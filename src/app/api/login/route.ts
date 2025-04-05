import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'backup-key');

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    const sessionToken = await new SignJWT({
      userId: user.id.toString(),
      role: user.role,
      email: user.email,
      sessionId: uuidv4(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(JWT_SECRET);

    (await cookies()).set({
      name: 'auth-token',
      value: sessionToken,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 2 * 60 * 60
    });

    if (user.role === "admin") {
      return NextResponse.json({ message: "Approved" }, { status: 202 });
    } else if (user.role === "user") {
      return NextResponse.json({ message: "Prohibited" }, { status: 403 });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to login", details: error.message },
      { status: 500 }
    );
  }
}