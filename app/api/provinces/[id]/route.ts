import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { deleteImage, updateImage } from "@/lib/utils";

// export const dynamic = "force-dynamic";

// Get one province
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await DB();

  const id = params.id;

  const province = db
    .prepare("SELECT * FROM provinces WHERE id = ?")
    .get(id);
  if (!province) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(province, { status: 200 });
}

// Update a province
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await DB();

    const id = params.id;

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
      SET name = ?, description = ?, safetyStatus = ?, image = ?
      WHERE id = ?
    `);
    stmt.run(
      fields.name?.[0],
      fields.description?.[0],
      fields.safetyStatus?.[0],
      newImagePath,
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
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // const admin = verifyAdmin(req);
  // if (!admin)
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await DB();

    const id = params.id;

    // Get current image path
    const getImage = db
      .prepare("SELECT image FROM provinces WHERE id = ?")
      .get(id) as { image?: string };

    if (getImage?.image) {
      await deleteImage(getImage.image);
    }

    const stmt = db.prepare("DELETE FROM provinces WHERE id = ?");
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete province" },
      { status: 500 }
    );
  }
}
