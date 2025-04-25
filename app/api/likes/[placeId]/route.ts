import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { verifyUser } from "@/lib/auth";

// ✅ GET: هل المستخدم أعجب بالمكان؟ أو كم عدد الإعجابات؟
export async function GET(
  req: NextRequest,
  { params }: { params: { placeId: string } }
) {
  try {
    const db = await DB();
    const placeId = Number(params.placeId);

    // إرجاع عدد الإعجابات
    const countStmt = db.prepare(
      "SELECT COUNT(*) as count FROM likes WHERE placeId = ?"
    );
    const count = countStmt.get(placeId) as { count: number };

    // إذا كان المستخدم مسجل، أرجع هل أعجب أم لا
    const user = verifyUser(req);
    let liked = false;

    if (user) {
      const likeCheck = db
        .prepare("SELECT 1 FROM likes WHERE placeId = ? AND userId = ?")
        .get(placeId, user.id);
      liked = !!likeCheck;
    }

    return NextResponse.json({ count: count.count, liked });
  } catch (err) {
    console.error("Failed to fetch likes:", err);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

// ✅ POST: إضافة إعجاب
export async function POST(
  req: NextRequest,
  { params }: { params: { placeId: string } }
) {
  try {
    const user = verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await DB();
    const placeId = Number(params.placeId);

    // إدراج إعجاب
    const stmt = db.prepare(
      "INSERT INTO likes (userId, placeId) VALUES (?, ?)"
    );
    stmt.run(user.id, placeId);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (String(err).includes("UNIQUE")) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    console.error("Failed to like:", err);
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}

// ✅ DELETE: حذف الإعجاب
export async function DELETE(
  req: NextRequest,
  { params }: { params: { placeId: string } }
) {
  try {
    const user = verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await DB();
    const placeId = Number(params.placeId);

    const stmt = db.prepare(
      "DELETE FROM likes WHERE userId = ? AND placeId = ?"
    );
    const result = stmt.run(user.id, placeId);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to unlike:", err);
    return NextResponse.json({ error: "Failed to unlike" }, { status: 500 });
  }
}
