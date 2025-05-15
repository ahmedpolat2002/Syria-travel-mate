// app/api/reviews/all/route.ts
import { NextResponse } from "next/server";
import DB from "@/lib/db";

export async function GET() {
  try {
    const db = await DB();

    const reviews = db
      .prepare(
        `
        SELECT reviews.*, users.username, places.name AS placeName
        FROM reviews
        JOIN users ON reviews.userId = users.id
        JOIN places ON reviews.placeId = places.id
        ORDER BY reviews.created_at DESC
      `
      )
      .all();

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("Failed to fetch all reviews:", err);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
