import { NextResponse } from "next/server";
import DB from "@/lib/db";

export async function GET() {
  try {
    const db = await DB();

    const provincesCount = (
      db.prepare("SELECT COUNT(*) as count FROM provinces").get() as {
        count: number;
      }
    ).count;
    const placesCount = (
      db
        .prepare("SELECT COUNT(*) as count FROM places WHERE deleted = 0")
        .get() as { count: number }
    ).count;
    const placeTypesCount = (
      db.prepare("SELECT COUNT(*) as count FROM place_types").get() as {
        count: number;
      }
    ).count;
    const reviewsCount = (
      db.prepare("SELECT COUNT(*) as count FROM reviews").get() as {
        count: number;
      }
    ).count;
    const likesCount = (
      db.prepare("SELECT COUNT(*) as count FROM likes").get() as {
        count: number;
      }
    ).count;
    const eventsCount = (
      db
        .prepare("SELECT COUNT(*) as count FROM events WHERE deleted = 0")
        .get() as { count: number }
    ).count;
    const usersCount = (
      db.prepare("SELECT COUNT(*) as count FROM users").get() as {
        count: number;
      }
    ).count;

    return NextResponse.json({
      provincesCount,
      placesCount,
      placeTypesCount,
      reviewsCount,
      likesCount,
      eventsCount,
      usersCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
