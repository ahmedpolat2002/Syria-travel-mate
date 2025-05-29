// app/api/reviews/stats/route.ts
import { NextResponse } from "next/server";
import DB from "@/lib/db";

export async function GET() {
  try {
    const db = await DB();

    const total = db.prepare("SELECT COUNT(*) as count FROM reviews").get() as {
      count: number;
    };

    const average = db
      .prepare("SELECT AVG(rating) as avg FROM reviews")
      .get() as { avg: number };

    const distribution = db
      .prepare(`SELECT rating, COUNT(*) as count FROM reviews GROUP BY rating`)
      .all();

    const topPlaces = db
      .prepare(
        `
        SELECT places.name, COUNT(reviews.id) as count
        FROM reviews
        JOIN places ON places.id = reviews.placeId
        GROUP BY placeId
        ORDER BY count DESC
        LIMIT 5
      `
      )
      .all();

    return NextResponse.json({
      total: total.count,
      average: Number(average.avg).toFixed(2),
      distribution,
      topPlaces,
    });
  } catch (err) {
    console.error("Failed to fetch review statistics:", err);
    return NextResponse.json(
      { error: "Failed to fetch review statistics" },
      { status: 500 }
    );
  }
}
