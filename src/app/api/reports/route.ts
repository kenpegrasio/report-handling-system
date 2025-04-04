import { NextResponse } from "next/server";
import { prisma } from "@/db";

export async function POST(request: Request) {
  try {
    const { type, target_id, reason, description } = await request.json();

    await prisma.report.create({
      data: {
        type,
        target_id,
        reason,
        description,
      },
    });

    return NextResponse.json(
      { message: "Report submitted successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to submit report", details: error.message },
      { status: 500 }
    );
  }
}
