import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin-route";

export async function GET() {
  return withAdmin(
    async () => {
      const subscribers = await prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ subscribers });
    },
    "newsletter",
  );
}
