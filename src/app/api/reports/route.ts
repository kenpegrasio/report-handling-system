import { NextResponse } from "next/server";
import { prisma } from "@/db";

function convertBigIntToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)])
    );
  } else if (typeof obj === "bigint") {
    return obj.toString();
  }
  return obj;
}

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";

    const categoryFilter = type === "all" ? {} : { equals: type as "review" | "user" | "business" | "service" | "other" };
    
    const statusFilter = status === "resolved" 
      ? { not: null } 
      : status === "unresolved" 
        ? { equals: null } 
        : {};

    const reports = await prisma.report.findMany({
      where: {
        resolved_at: statusFilter,
        type: categoryFilter,
      },
      include: {
        submitter: true,
        resolver: true,
      },
    });

    return NextResponse.json(convertBigIntToString(reports));
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report", details: error.message },
      { status: 500 }
    );
  }
}