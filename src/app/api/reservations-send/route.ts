import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReservations, type ReservationFilters } from "@/lib/reservations";
import { Resend } from "resend";

function normalizeServices(v: unknown): string {
  if (Array.isArray(v)) return v.join(",");
  return String(v ?? "").replace(/[{}]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Neautorizované" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { category = "", plan = "", name = "", from = "", month = "" } =
      body || {};

    const filters: ReservationFilters = { category, plan, name, from, month };
    const filtered = await getReservations(filters);

    // Prepare HTML table
    const th = (t: string) =>
      `<th style="text-align:left;padding:6px;border-bottom:1px solid #e5e7eb">${t}</th>`;
    const td = (t: string) =>
      `<td style="padding:6px;border-bottom:1px solid #f3f4f6">${t}</td>`;
    const fmt = (d: Date) =>
      d.toLocaleString("sk-SK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

    const rowsHtml = filtered
      .map((r) => {
        const s = normalizeServices(r.services);
        const [c = "", p = ""] = s.toUpperCase().split(":");
        return `<tr>
          ${td(r.notes || "-")}
          ${td(c || "-")}
          ${td(p || "-")}
          ${td(fmt(new Date(r.createdAt)))}
          ${td(r.status)}
          ${td(r.user?.email || "-")}
        </tr>`;
      })
      .join("");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111827">
        <h2>Prehľad rezervácií</h2>
        <p>Filtrované parametre:</p>
        <ul>
          <li>Kategória: ${category || "–"}</li>
          <li>Plán: ${plan || "–"}</li>
          <li>Meno: ${name || "–"}</li>
          <li>Od dátumu: ${from || "–"}</li>
          <li>Mesiac: ${month || "–"}</li>
        </ul>
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;margin-top:12px;font-size:14px">
          <thead><tr>
            ${th("Meno")}
            ${th("Kategória")}
            ${th("Plán")}
            ${th("Vytvorené")}
            ${th("Stav")}
            ${th("Email")}
          </tr></thead>
          <tbody>${rowsHtml || `<tr>${td("Žiadne záznamy")}<td colspan="6"></td></tr>`}</tbody>
        </table>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.EMAIL_USER;
    const mailFrom = "no-reply@s-gym.sk";

    if (!to) {
      return NextResponse.json(
        { message: "USER_EMAIL nie je nastavený v env" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: mailFrom,
      to,
      subject: "Aktuálny prehľad rezervácií - S-GYM",
      html,
    });

    return NextResponse.json({ ok: true, count: filtered.length }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}