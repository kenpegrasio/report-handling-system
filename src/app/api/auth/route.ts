import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'backup-key');

export async function GET() {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({
      isAuthenticated: true,
      email: payload.email as string,
      role: payload.role as string
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}