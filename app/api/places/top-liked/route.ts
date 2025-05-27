import { NextResponse } from "next/server";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await DB();

    const topLikedPlaces = db
      .prepare(
        `
        SELECT
          places.id,
          places.name,
          places.description,
          places.image,
          places.safetyStatus,
          places.latitude,
          places.longitude,
          places.created_at,
          place_types.name AS typeName,
          provinces.name AS provinceName,
          COUNT(likes.id) AS likeCount
        FROM places
        LEFT JOIN likes ON places.id = likes.placeId
        JOIN place_types ON places.typeId = place_types.id
        JOIN provinces ON places.provinceId = provinces.id
        WHERE places.deleted = 0
        GROUP BY places.id
        ORDER BY likeCount DESC
        LIMIT 3
      `
      )
      .all();

    return NextResponse.json(topLikedPlaces);
  } catch (err) {
    console.error("Error fetching top liked places:", err);
    return NextResponse.json(
      { error: "Failed to fetch top liked places" },
      { status: 500 }
    );
  }
}
