import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin-route";

export async function GET(request: Request) {
  return withAdmin(async () => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const messages = await prisma.contactSubmission.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages });
  });
}
