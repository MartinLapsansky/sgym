// Resolves failed Prisma migrations before `prisma migrate deploy` runs.
//
// Background: a migration can be recorded as "failed" in the `_prisma_migrations`
// table (e.g. when a column was already added out-of-band via `db push`). Prisma
// then refuses to apply any further migrations (P3009). This script marks any
// failed migration as rolled back directly in the database so `migrate deploy`
// can retry it. The affected migrations are written to be idempotent
// (e.g. `ADD COLUMN IF NOT EXISTS`), so retrying them is safe.
//
// We update the table directly (instead of `prisma migrate resolve`) because
// `resolve` only handles a single row and fails when duplicate failed rows exist.
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set. Skipping failed migration resolution.");
  process.exit(0);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();

  const { rows } = await client.query(
    `SELECT id, migration_name
       FROM "_prisma_migrations"
      WHERE finished_at IS NULL
        AND rolled_back_at IS NULL`,
  );

  if (rows.length === 0) {
    console.log("No failed migrations found.");
  } else {
    for (const row of rows) {
      console.log(`Marking failed migration as rolled back: ${row.migration_name}`);
    }

    await client.query(
      `UPDATE "_prisma_migrations"
          SET rolled_back_at = NOW()
        WHERE finished_at IS NULL
          AND rolled_back_at IS NULL`,
    );

    console.log(`Resolved ${rows.length} failed migration record(s).`);
  }
} catch (error) {
  console.error("Failed to resolve failed migrations:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
