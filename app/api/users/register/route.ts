import DB from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const SALT_ROUNDS = 10;

// Register API Endpoint :
export async function POST(req: Request) {
  const db = await DB(); // get database instance
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  // تأكد إن المستخدم غير موجود مسبقًا
  const userExists = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);

  if (userExists) {
    return NextResponse.json(
      { error: "Username already taken." },
      { status: 409 }
    );
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // إدخال المستخدم الجديد
  const stmt = db.prepare(
    "INSERT INTO users (username, password) VALUES (?, ?)"
  );
  const result = stmt.run(username, hashedPassword);

  return NextResponse.json({
    message: "User registered successfully.",
    userId: result.lastInsertRowid,
  });
}
