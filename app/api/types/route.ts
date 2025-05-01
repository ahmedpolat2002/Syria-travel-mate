import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
// import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Get all place types
export async function GET() {
  try {
    const db = await DB();
    const types = db
      .prepare("SELECT * FROM place_types WHERE deleted = 0")
      .all();
    return NextResponse.json(types);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
  }
}

// Create a new place type
export async function POST(req: NextRequest) {
  // const admin = verifyAdmin(req);
  // if (!admin)
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const db = await DB();

    // تحقق من وجود النوع مسبقًا
    const existing = db
      .prepare("SELECT * FROM place_types WHERE name = ?")
      .get(name);
    if (existing) {
      return NextResponse.json(
        { error: "Type already exists" },
        { status: 409 }
      );
    }

    const stmt = db.prepare("INSERT INTO place_types (name) VALUES (?)");
    const result = stmt.run(name);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding place type:", err);
    return NextResponse.json({ error: "Failed to add type" }, { status: 500 });
  }
}
