import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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
