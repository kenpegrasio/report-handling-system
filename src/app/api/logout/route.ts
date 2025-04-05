import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    (await cookies()).set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: -1,
    });

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in logout:", error);
    return NextResponse.json(
      { error: "Failed to log out", details: error.message },
      { status: 500 }
    );
  }
}
