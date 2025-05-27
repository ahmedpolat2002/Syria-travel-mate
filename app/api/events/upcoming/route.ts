import { NextResponse } from "next/server";
import DB from "@/lib/db";
import { updateExpiredEventsStatus } from "@/lib/eventsStatusUpdater";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await DB();

    await updateExpiredEventsStatus();

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const stmt = db.prepare(`
      SELECT
        events.id,
        events.title,
        events.description,
        events.image,
        events.startDate,
        events.endDate,
        provinces.name AS provinceName
      FROM events
      JOIN provinces ON events.provinceId = provinces.id
      WHERE events.deleted = 0
        AND events.status = 'active'
        AND events.startDate >= ?
      ORDER BY events.startDate ASC
      LIMIT 3
    `);

    const events = stmt.all(today);

    return NextResponse.json(events);
  } catch (err) {
    console.error("Failed to fetch upcoming events:", err);
    return NextResponse.json(
      { error: "Failed to fetch upcoming events" },
      { status: 500 }
    );
  }
}
