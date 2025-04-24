import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { handleImageUpload } from "@/lib/utils";
// import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Get all places
export async function GET() {
  try {
    const db = await DB();
    const places = db
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
          provinces.name AS provinceName
        FROM places
        JOIN place_types ON places.typeId = place_types.id
        JOIN provinces ON places.provinceId = provinces.id
        WHERE places.deleted = 0
      `
      )
      .all();

    return NextResponse.json(places);
  } catch (err) {
    console.error("Error fetching places:", err);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}

// Add a new place
export async function POST(req: NextRequest) {
  // const admin = verifyAdmin(req);
  // if (!admin)
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const uploadResult = await handleImageUpload(req);

    if (!uploadResult) {
      throw new Error("Image upload failed");
    }

    const {
      fields,
      imagePath,
    }: {
      fields: {
        name?: string[];
        description?: string[];
        typeId?: string[];
        provinceId?: string[];
        safetyStatus?: string[];
        latitude?: string[];
        longitude?: string[];
      };
      imagePath: string;
    } = uploadResult;

    const db = await DB();

    const stmt = db.prepare(`
      INSERT INTO places
      (name, description, typeId, provinceId, image, safetyStatus, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      fields.name?.[0],
      fields.description?.[0],
      Number(fields.typeId?.[0]),
      Number(fields.provinceId?.[0]),
      imagePath,
      fields.safetyStatus?.[0],
      parseFloat(fields.latitude?.[0] || "0"),
      parseFloat(fields.longitude?.[0] || "0")
    );

    return NextResponse.json({ id: result.lastInsertRowid, imagePath });
  } catch (err) {
    console.error("Error adding place:", err);
    return NextResponse.json({ error: "Failed to add place" }, { status: 500 });
  }
}
