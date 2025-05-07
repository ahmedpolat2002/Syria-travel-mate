import DB from "@/lib/db";
import { NextResponse } from "next/server";

// جلب جميع المستخدمين
export async function GET() {
  const db = await DB();
  const stmt = db.prepare(
    "SELECT id, username, email, role, created_at FROM users"
  );
  const users = stmt.all();
  return NextResponse.json(users);
}

// تعديل اسم المستخدم أو صلاحية المستخدم
export async function PUT(req: Request) {
  const db = await DB();
  const { id, username, role } = await req.json();

  // تحقق من أن المستخدم موجود
  const userExists = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!userExists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // إذا تم تمرير اسم مستخدم، تحقق من كونه فريدًا قبل التحديث
  if (username) {
    const existingUsername = db
      .prepare("SELECT id FROM users WHERE username = ? AND id != ?")
      .get(username, id);

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    db.prepare("UPDATE users SET username = ? WHERE id = ?").run(username, id);
  }

  // إذا تم تمرير دور جديد (admin أو user)، حدثه
  if (role) {
    if (!["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
  }

  return NextResponse.json({ message: "User updated successfully" });
}
