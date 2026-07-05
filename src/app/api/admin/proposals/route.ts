import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError } from "@/lib/admin-route";

export async function GET() {
  return withAdmin(
    async () => {
      const proposals = await prisma.proposalRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: { lead: { select: { fullName: true, email: true } } },
      });
      return NextResponse.json({ proposals });
    },
    "proposals",
  );
}

export async function PATCH(request: Request) {
  return withAdminMutation(
    request,
    async () => {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonError("Invalid JSON body");
      }
      const parsed = z
        .object({
          id: z.string(),
          status: z.enum(["new", "reviewing", "proposal_drafted", "sent", "won", "lost"]),
        })
        .safeParse(body);
      if (!parsed.success) return jsonError("Invalid input");
      const proposal = await prisma.proposalRequest.update({
        where: { id: parsed.data.id },
        data: { status: parsed.data.status },
      });
      return NextResponse.json({ proposal });
    },
    "proposals",
  );
}
