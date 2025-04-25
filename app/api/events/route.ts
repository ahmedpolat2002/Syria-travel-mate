import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { handleImageUpload } from "@/lib/utils";
// import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const db = await DB();
    const stmt = db.prepare(`
      SELECT events.*, provinces.name as provinceName
      FROM events
      JOIN provinces ON events.provinceId = provinces.id
      WHERE events.deleted = 0
    `);
    const events = stmt.all();
    return NextResponse.json(events);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // const admin = verifyAdmin(req);
  // if (!admin)
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const uploadResult = await handleImageUpload(req);

    if (!uploadResult) {
      throw new Error("Failed to upload image");
    }

    const {
      fields,
      imagePath,
    }: {
      fields: {
        title?: string[];
        description?: string[];
        provinceId?: string[];
        startDate?: string[];
        endDate?: string[];
        latitude?: string[];
        longitude?: string[];
        status?: string[]; // optional, default 'active'
      };
      imagePath: string;
    } = uploadResult;

    const db = await DB();

    const stmt = db.prepare(`
      INSERT INTO events (
        title, description, provinceId, image,
        startDate, endDate, latitude, longitude, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      fields.title?.[0],
      fields.description?.[0],
      parseInt(fields.provinceId?.[0] || "0"),
      imagePath,
      fields.startDate?.[0],
      fields.endDate?.[0],
      parseFloat(fields.latitude?.[0] || "0"),
      parseFloat(fields.longitude?.[0] || "0"),
      fields.status?.[0] || "active"
    );

    return NextResponse.json({ id: result.lastInsertRowid, imagePath });
  } catch (err) {
    console.error("Error adding event:", err);
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}
