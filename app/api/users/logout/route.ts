import { NextResponse } from "next/server";

// Logout API Endpoint :
export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0, // حذف الكوكي
  });
  return res;
}
