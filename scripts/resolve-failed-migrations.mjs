// Resolves failed Prisma migrations before `prisma migrate deploy` runs.
//
// Background: a migration can be recorded as "failed" in the `_prisma_migrations`
// table (e.g. when a column was already added out-of-band via `db push`). Prisma
// then refuses to apply any further migrations (P3009). This script marks any
// failed migration as rolled back so `migrate deploy` can retry it. The affected
// migrations are written to be idempotent (e.g. `ADD COLUMN IF NOT EXISTS`), so
// retrying them is safe.
import { execSync } from "node:child_process";

function run(command) {
  return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function getFailedMigrations() {
  try {
    const output = run("npx prisma migrate status");
    const failed = new Set();
    const regex = /The `([^`]+)` migration started at .* failed/g;
    let match;
    while ((match = regex.exec(output)) !== null) {
      failed.add(match[1]);
    }
    return [...failed];
  } catch (error) {
    // `migrate status` exits non-zero when there are failed migrations, but the
    // output is still on stdout/stderr. Parse whatever we captured.
    const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    const failed = new Set();
    const regex = /The `([^`]+)` migration started at .* failed/g;
    let match;
    while ((match = regex.exec(output)) !== null) {
      failed.add(match[1]);
    }
    return [...failed];
  }
}

const failedMigrations = getFailedMigrations();

if (failedMigrations.length === 0) {
  console.log("No failed migrations found.");
  process.exit(0);
}

for (const name of failedMigrations) {
  console.log(`Resolving failed migration as rolled back: ${name}`);
  run(`npx prisma migrate resolve --rolled-back ${name}`);
}

console.log("Failed migrations resolved.");
