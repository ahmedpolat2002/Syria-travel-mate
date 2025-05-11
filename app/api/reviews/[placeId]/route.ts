import { NextRequest, NextResponse } from "next/server";
import DB from "@/lib/db";
import { verifyUser } from "@/lib/auth";
// import { verifyUser } from "@/lib/auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const db = await DB();
    const { placeId } = await params;

    const stmt = db.prepare(`
      SELECT reviews.*, users.username
      FROM reviews
      JOIN users ON reviews.userId = users.id
      WHERE placeId = ?
    `);
    const reviews = stmt.all(placeId);

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const user = verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await DB();
    const body = await req.json();
    const { userId, rating, comment } = body;
    const { placeId } = await params;

    // تحقق إن كان المستخدم كتب مراجعة من قبل
    const exists = db
      .prepare(`SELECT id FROM reviews WHERE userId = ? AND placeId = ?`)
      .get(userId, placeId);
    if (exists) {
      return NextResponse.json(
        { error: "Review already exists" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO reviews (userId, placeId, rating, comment)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(userId, placeId, rating, comment);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to add review:", err);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const user = verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await DB();
    const body = await req.json();
    const { userId, rating, comment } = body;
    const { placeId } = await params;

    const stmt = db.prepare(`
      UPDATE reviews
      SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
      WHERE userId = ? AND placeId = ?
    `);
    const result = stmt.run(rating, comment, userId, placeId);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update review:", err);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const user = verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await DB();
    const { userId } = await req.json();
    const { placeId } = await params;

    const stmt = db.prepare(
      `DELETE FROM reviews WHERE userId = ? AND placeId = ?`
    );
    const result = stmt.run(userId, placeId);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete review:", err);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
