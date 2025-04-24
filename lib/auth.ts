  import { NextRequest } from "next/server";
  import jwt from "jsonwebtoken";

  const JWT_SECRET = process.env.JWT_SECRET || "";
  interface UserPayload {
    id: number;
    username: string;
    role: string;
  }

  export function verifyUser(req: NextRequest): UserPayload | null {
    try {
      // نحاول قراءة التوكن من الكوكيز
      const token = req.cookies.get("token")?.value;

      if (!token) return null;

      // التحقق من التوكن
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

      return decoded; // يحتوي على id، username، role
    } catch (err) {
      console.warn("Invalid or missing token:", err);
      return null;
    }
  }
  // Verify JWT token and return user ID if valid
  export function verifyAdmin(req: NextRequest): { id: number; role: string } | null {
    const token = req.cookies.get("token")?.value;

    if (!token) return null;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
      if (decoded.role !== "admin") return null;
      return decoded;
    } catch {
      return null;
    }
  }
