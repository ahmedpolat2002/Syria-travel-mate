import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { handleImageUpload } from "@/lib/utils";
// import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Get all provinces
export async function GET() {
  try {
    const db = await DB();
    const provinces = db.prepare("SELECT * FROM provinces").all();
    return NextResponse.json(provinces);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch provinces" },
      { status: 500 }
    );
  }
}

// Create a new province
export async function POST(req: NextRequest) {
  //   const admin = verifyAdmin(req);
  //   if (!admin)
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
        name?: string[];
        description?: string[];
        safetyStatus?: string[];
      };
      imagePath: string;
    } = uploadResult;

    const db = await DB();

    const stmt = db.prepare(`
      INSERT INTO provinces (name, description, safetyStatus, image)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      fields.name?.[0],
      fields.description?.[0],
      fields.safetyStatus?.[0],
      imagePath
    );

    return NextResponse.json({ id: result.lastInsertRowid, imagePath });
  } catch (err) {
    console.error("Error adding province:", err);
    return NextResponse.json(
      { error: "Failed to add province" },
      { status: 500 }
    );
  }
}
