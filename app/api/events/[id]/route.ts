import { verifyAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { deleteImage, updateImage } from "@/lib/utils";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await DB();
    const { id } = await params;

    const stmt = db.prepare(`
      SELECT events.*, provinces.name as provinceName
      FROM events
      JOIN provinces ON events.provinceId = provinces.id
      WHERE events.id = ? AND events.deleted = 0
    `);

    const event = stmt.get(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error("Failed to fetch event:", err);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await DB();
    const { id } = await params;

    const current = db
      .prepare("SELECT image FROM events WHERE id = ?")
      .get(id) as { image: string };

    if (!current?.image) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { fields, newImagePath } = await updateImage(req, current.image);

    const stmt = db.prepare(`
      UPDATE events SET
        title = ?, description = ?, provinceId = ?, image = ?, startDate = ?, endDate = ?,
        latitude = ?, longitude = ?, status = ?
      WHERE id = ?
    `);

    stmt.run(
      fields.title?.[0],
      fields.description?.[0],
      parseInt(fields.provinceId?.[0] || "0"),
      newImagePath,
      fields.startDate?.[0],
      fields.endDate?.[0],
      parseFloat(fields.latitude?.[0] || "0"),
      parseFloat(fields.longitude?.[0] || "0"),
      fields.status,
      id
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update event:", err);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const admin = verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await DB();
    const { id } = await params;

    const getImage = db
      .prepare("SELECT image FROM events WHERE id = ? AND deleted = 0")
      .get(id) as { image?: string };

    if (!getImage) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (getImage.image) {
      await deleteImage(getImage.image);
    }

    const stmt = db.prepare("UPDATE events SET deleted = 1 WHERE id = ?");
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to soft delete event:", err);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
