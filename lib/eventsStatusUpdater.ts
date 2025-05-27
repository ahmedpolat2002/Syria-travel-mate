import DB from "@/lib/db";

export async function updateExpiredEventsStatus() {
  const db = await DB();

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const stmt = db.prepare(`
    UPDATE events
    SET status = 'finished'
    WHERE status = 'active' AND endDate < ?
  `);

  stmt.run(today);
}
