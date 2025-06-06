import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
// import { verifyAdmin } from "@/lib/auth";

// export const dynamic = "force-dynamic";

// Get a place type by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await DB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing or invalid id" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(
      "SELECT * FROM place_types WHERE id = ? AND deleted = 0"
    );
    const placeType = stmt.get(id);

    if (!placeType) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    return NextResponse.json(placeType);
  } catch (err) {
    console.error("Error fetching place type:", err);
    return NextResponse.json(
      { error: "Failed to fetch type" },
      { status: 500 }
    );
  }
}

// Update an existing place type by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name } = await req.json();

    const { id } = await params;

    if (!id || !name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const db = await DB();
    const stmt = db.prepare("UPDATE place_types SET name = ? WHERE id = ?");
    const result = stmt.run(name, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating place type:", err);
    return NextResponse.json(
      { error: "Failed to update type" },
      { status: 500 }
    );
  }
}

// Delete a place type by ID
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

    // تحقق من وجود أماكن مرتبطة بهذا النوع ولم يتم حذفها soft delete
    const placeCount = db
      .prepare(
        "SELECT COUNT(*) AS count FROM places WHERE typeId = ? AND deleted = 0"
      )
      .get(id) as { count: number };

    if (placeCount.count > 0) {
      return NextResponse.json(
        { error: "لا يمكن حذف النوع لوجود أماكن مرتبطة به" },
        { status: 400 }
      );
    }

    // تنفيذ soft delete بدلاً من الحذف النهائي
    const stmt = db.prepare("UPDATE place_types SET deleted = 1 WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting place type:", err);
    return NextResponse.json(
      { error: "Failed to delete type" },
      { status: 500 }
    );
  }
}
