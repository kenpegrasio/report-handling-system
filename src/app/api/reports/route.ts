import { NextResponse } from "next/server";
import { prisma } from "@/db";

function convertBigIntToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToString(value),
      ])
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

    const sortBy = searchParams.get("sortBy") || "created_at"; // default sort
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const categoryFilter =
      type === "all"
        ? {}
        : {
            equals: type as
              | "review"
              | "user"
              | "business"
              | "service"
              | "other",
          };

    const statusFilter =
      status === "resolved"
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
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.report.count({
      where: {
        resolved_at: statusFilter,
        type: categoryFilter,
      },
    });

    return NextResponse.json({
      data: convertBigIntToString(reports),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report", details: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  try {
    const { id, user_id } = await request.json();

    const updateData = {
      resolved_at: new Date(),
      ...(user_id && {
        resolved_by: BigInt(user_id),
      })
    };

    const updatedReport = await prisma.report.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return NextResponse.json(convertBigIntToString(updatedReport));
  } catch (error: any) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to update report", details: error.message },
      { status: 500 }
    );
  }
}