import DB from "@/lib/db";
import { Users } from "@/types/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

// Login API Endpoint :
export async function POST(req: Request) {
  const db = await DB();
  const { usernameOrEmail, password } = await req.json();

  if (!usernameOrEmail || !password) {
    return NextResponse.json(
      { error: "Missing username/email or password" },
      { status: 400 }
    );
  }

  // البحث باستخدام username أو email
  const stmt = db.prepare(
    "SELECT * FROM users WHERE username = ? OR email = ?"
  );
  const user = stmt.get(usernameOrEmail, usernameOrEmail) as Users;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // تحقق من كلمة المرور
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // إنشاء التوكن
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  // إرسال التوكن داخل كوكي
  const res = NextResponse.json({ message: "Logged in", token });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: false, // يجب أن يكون true في بيئة الإنتاج
    // secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
