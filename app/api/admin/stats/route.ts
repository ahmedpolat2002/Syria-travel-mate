import { NextResponse } from "next/server";
import DB from "@/lib/db";

export async function GET() {
  try {
    const db = await DB();

    const provincesCount = (
      db
        .prepare("SELECT COUNT(*) as count FROM provinces WHERE deleted = 0")
        .get() as {
        count: number;
      }
    ).count;

    const placesCount = (
      db
        .prepare("SELECT COUNT(*) as count FROM places WHERE deleted = 0")
        .get() as {
        count: number;
      }
    ).count;

    const placeTypesCount = (
      db
        .prepare("SELECT COUNT(*) as count FROM place_types WHERE deleted = 0")
        .get() as {
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
        .get() as {
        count: number;
      }
    ).count;

    const usersCount = (
      db.prepare("SELECT COUNT(*) as count FROM users").get() as {
        count: number;
      }
    ).count;

    const placesPerType = db
      .prepare(
        `
      SELECT place_types.name as typeName, COUNT(places.id) as count
      FROM places
      JOIN place_types ON places.typeId = place_types.id
      WHERE places.deleted = 0
      GROUP BY place_types.id
    `
      )
      .all();

    const placesPerProvince = db
      .prepare(
        `
      SELECT provinces.name as provinceName, COUNT(places.id) as count
      FROM places
      JOIN provinces ON places.provinceId = provinces.id
      WHERE places.deleted = 0
      GROUP BY provinces.id
    `
      )
      .all();

    const usersPerMonth = db
      .prepare(
        `
      SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
      FROM users
      GROUP BY month
      ORDER BY month ASC
    `
      )
      .all();

    const placesGrowth = db
      .prepare(
        `
      SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
      FROM places
      WHERE deleted = 0
      GROUP BY month
      ORDER BY month ASC
    `
      )
      .all();

    const placesStatus = db
      .prepare(
        `
      SELECT
        (SELECT COUNT(*) FROM places WHERE deleted = 0) as active,
        (SELECT COUNT(*) FROM places WHERE deleted = 1) as deleted
    `
      )
      .get();

    return NextResponse.json({
      provincesCount,
      placesCount,
      placeTypesCount,
      reviewsCount,
      likesCount,
      eventsCount,
      usersCount,
      placesPerType,
      placesPerProvince,
      usersPerMonth,
      placesGrowth,
      placesStatus,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
