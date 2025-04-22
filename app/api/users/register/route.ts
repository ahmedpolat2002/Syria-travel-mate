import DB from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const SALT_ROUNDS = 10;

// Register API Endpoint :
export async function POST(req: Request) {
  const db = await DB(); // get database instance
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Username, email and password are required." },
      { status: 400 }
    );
  }

  // التحقق من تكرار البريد الإلكتروني أو اسم المستخدم
  const userExists = db
    .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
    .get(username, email);

  if (userExists) {
    return NextResponse.json(
      { error: "Username or email already taken." },
      { status: 409 }
    );
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // حفظ المستخدم
  const stmt = db.prepare(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
  );
  const result = stmt.run(username, email, hashedPassword);

  return NextResponse.json({
    message: "User registered successfully.",
    userId: result.lastInsertRowid,
  });
}
