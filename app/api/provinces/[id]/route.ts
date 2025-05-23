import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { deleteImage, updateImage } from "@/lib/utils";
import { verifyAdmin } from "@/lib/auth";

// export const dynamic = "force-dynamic";

// Get one province
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = await DB();

  const { id } = await params;

  const province = db
    .prepare("SELECT * FROM provinces WHERE id = ? AND deleted = 0")
    .get(id);
  if (!province) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(province, { status: 200 });
}

// Update a province
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await DB();

    const { id } = await params;

    // get current path
    const current = db
      .prepare("SELECT image FROM provinces WHERE id = ?")
      .get(id) as { image: string };

    if (!current?.image) {
      return NextResponse.json(
        { error: "Province not found" },
        { status: 404 }
      );
    }

    const { fields, newImagePath } = await updateImage(req, current.image);

    const stmt = db.prepare(`
      UPDATE provinces
      SET name = ?, description = ?, safetyStatus = ?, image = ?, latitude = ?, longitude = ?
      WHERE id = ?
    `);

    stmt.run(
      fields.name?.[0],
      fields.description?.[0],
      fields.safetyStatus?.[0],
      newImagePath,
      fields.latitude?.[0] || "0",
      fields.longitude?.[0] || "0",
      id
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update province:", err);
    return NextResponse.json(
      { error: "Failed to update province" },
      { status: 500 }
    );
  }
}

// Delete a province
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await DB();
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing or invalid id" },
        { status: 400 }
      );
    }

    // تحقق من وجود أماكن مرتبطة بالمحافظة
    const placeCount = db
      .prepare(
        "SELECT COUNT(*) AS count FROM places WHERE provinceId = ? AND deleted = 0"
      )
      .get(id) as { count: number };

    if (placeCount.count > 0) {
      return NextResponse.json(
        { error: "Cannot delete province due to linked places" },
        { status: 400 }
      );
    }

    // تحقق من وجود فعاليات مرتبطة بالمحافظة
    const eventCount = db
      .prepare(
        "SELECT COUNT(*) AS count FROM events WHERE provinceId = ? AND deleted = 0"
      )
      .get(id) as { count: number };

    if (eventCount.count > 0) {
      return NextResponse.json(
        { error: "Cannot delete province due to linked events" },
        { status: 400 }
      );
    }

    // احصل على مسار الصورة الحالية
    const getImage = db
      .prepare("SELECT image FROM provinces WHERE id = ?")
      .get(id) as { image?: string };

    if (getImage?.image) {
      await deleteImage(getImage.image);
    }

    // تنفيذ الحذف
    const stmt = db.prepare("UPDATE provinces SET deleted = 1 WHERE id = ?");
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting province:", err);
    return NextResponse.json(
      { error: "Failed to delete province" },
      { status: 500 }
    );
  }
}
