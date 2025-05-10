import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { updateImage } from "@/lib/utils";
// import { verifyAdmin } from "@/lib/auth";

// Get single place by ID with type and province names
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await DB();
    const { id } = await params;

    const stmt = db.prepare(`
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
      WHERE places.id = ? AND places.deleted = 0
    `);
    const place = stmt.get(id);

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(place);
  } catch (err) {
    console.error("Error fetching place:", err);
    return NextResponse.json(
      { error: "Failed to fetch place" },
      { status: 500 }
    );
  }
}

// Update a place
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // const admin = verifyAdmin(req);
  // if (!admin)
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await DB();
    const { id } = await params;

    // جلب الصورة الحالية
    const current = db
      .prepare("SELECT image FROM places WHERE id = ?")
      .get(id) as { image: string };

    if (!current?.image) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // تحديث الصورة إذا تم رفع صورة جديدة
    const { fields, newImagePath } = await updateImage(req, current.image);

    const stmt = db.prepare(`
        UPDATE places
        SET name = ?, description = ?, typeId = ?, provinceId = ?, image = ?, safetyStatus = ?, latitude = ?, longitude = ?
        WHERE id = ?
      `);

    const result = stmt.run(
      fields.name?.[0],
      fields.description?.[0],
      Number(fields.typeId?.[0]),
      Number(fields.provinceId?.[0]),
      newImagePath,
      fields.safetyStatus?.[0],
      parseFloat(fields.latitude?.[0] || "0"),
      parseFloat(fields.longitude?.[0] || "0"),
      id
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Place not found or unchanged" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating place:", err);
    return NextResponse.json(
      { error: "Failed to update place" },
      { status: 500 }
    );
  }
}

// Delete a place (soft delete)
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // const admin = verifyAdmin(req);
  // if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await DB();
    const { id } = await params;

    const stmt = db.prepare("UPDATE places SET deleted = 1 WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting place:", err);
    return NextResponse.json(
      { error: "Failed to delete place" },
      { status: 500 }
    );
  }
}
