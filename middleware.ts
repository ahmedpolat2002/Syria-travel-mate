import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// من الأفضل التحقق أن المتغير موجود
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// قائمة المسارات المحمية
const protectedRoutes = ["/dashboard", "/admin", "/profile"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // تحقق إذا كان المسار يتطلب حماية
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  // إذا لم يوجد التوكن، إعادة التوجيه لصفحة الدخول
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // ✅ التحقق من صحة التوكن
    // ✅ إذا كان التوكن صالحًا، يمكنك إضافة بيانات المستخدم إلى الطلب
    // ✅ وإلا، يمكنك إعادة التوجيه إلى صفحة الدخول
    const decoded = jwt.verify(token, JWT_SECRET || "") as JwtPayload;

    // ✅ تحقق خاص بمسار الأدمن فقط
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ يمكنك هنا تمرير بيانات المستخدم في Header أو Context
    const response = NextResponse.next();
    response.headers.set("x-user-id", decoded.id);
    response.headers.set("x-user-role", decoded.role);
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ⚙️ تحديد المسارات التي يطبق عليها middleware
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
