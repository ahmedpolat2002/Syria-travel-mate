import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
// import { verifyAdmin } from "@/lib/auth";

// export const dynamic = "force-dynamic";

// Update an existing place type by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // const admin = verifyAdmin(req);
  // if (!admin)
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name } = await req.json();
    const id = parseInt(params.id);

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
  { params }: { params: { id: string } }
) {
  // const admin = verifyAdmin(req);
  // if (!admin)
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = parseInt(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "Missing or invalid id" },
        { status: 400 }
      );
    }

    const db = await DB();
    const stmt = db.prepare("DELETE FROM place_types WHERE id = ?");
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
