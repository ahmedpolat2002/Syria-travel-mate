import DB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const db = await DB();
    const stmt = db.prepare("SELECT * FROM users");
    const users = stmt.all();
    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const db = await DB();
    const body = await req.json();
    const { username, password } = body;
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const info = stmt.run(username, password);
    return NextResponse.json(info);
}