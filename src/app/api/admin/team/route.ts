import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation, jsonError } from "@/lib/admin-route";

const teamConfigSchema = z.object({
  labelEn: z.string(),
  labelAr: z.string(),
  headingEn: z.string(),
  headingAr: z.string(),
  visible: z.boolean(),
});

const memberSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1),
  nameEn: z.string().default(""),
  nameAr: z.string().default(""),
  positionEn: z.string().default(""),
  positionAr: z.string().default(""),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

const putSchema = z.object({
  config: teamConfigSchema,
  members: z.array(memberSchema),
});

async function syncMembers(
  members: z.infer<typeof memberSchema>[],
) {
  const ids = members.filter((m) => m.id).map((m) => m.id!);
  await prisma.teamMember.deleteMany({
    where: ids.length > 0 ? { id: { notIn: ids } } : {},
  });

  for (const member of members) {
    if (member.id) {
      const { id, ...data } = member;
      await prisma.teamMember.update({ where: { id }, data });
    } else {
      const { id: _id, ...data } = member;
      await prisma.teamMember.create({ data });
    }
  }
}

export async function GET() {
  return withAdmin(async () => {
    const [config, members] = await Promise.all([
      prisma.teamConfig.findFirst(),
      prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    return NextResponse.json({
      config: config ?? {
        labelEn: "Our Team",
        labelAr: "فريقنا",
        headingEn: "Meet the Team",
        headingAr: "تعرف على الفريق",
        visible: true,
      },
      members,
    });
  });
}

export async function PUT(request: Request) {
  return withAdminMutation(request, async () => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body");
    }

    const parsed = putSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const { config, members } = parsed.data;

    await prisma.teamConfig.upsert({
      where: { id: 1 },
      create: { id: 1, ...config },
      update: config,
    });

    await syncMembers(members);

    const [savedConfig, savedMembers] = await Promise.all([
      prisma.teamConfig.findFirst(),
      prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    return NextResponse.json({ config: savedConfig, members: savedMembers });
  });
}
