import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_MEMBERS = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80",
    nameEn: "Ahmad Al-Rashid",
    nameAr: "\u0623\u062D\u0645\u062F \u0627\u0644\u0631\u0634\u064A\u062F",
    positionEn: "Creative Director",
    positionAr: "\u0645\u062F\u064A\u0631 \u0625\u0628\u062F\u0627\u0639\u064A",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80",
    nameEn: "Sara Mohammed",
    nameAr: "\u0633\u0627\u0631\u0629 \u0645\u062D\u0645\u062F",
    positionEn: "Brand Strategist",
    positionAr: "\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0629 \u0639\u0644\u0627\u0645\u0627\u062A \u062A\u062C\u0627\u0631\u064A\u0629",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&q=80",
    nameEn: "Omar Hassan",
    nameAr: "\u0639\u0645\u0631 \u062D\u0633\u0627\u0646",
    positionEn: "Lead Developer",
    positionAr: "\u0645\u0637\u0648\u0631 \u0631\u0626\u064A\u0633\u064A",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&q=80",
    nameEn: "Layla Kareem",
    nameAr: "\u0644\u064A\u0644\u0649 \u0643\u0631\u064A\u0645",
    positionEn: "Marketing Manager",
    positionAr: "\u0645\u062F\u064A\u0631\u0629 \u062A\u0633\u0648\u064A\u0642",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&q=80",
    nameEn: "Khalid Nasser",
    nameAr: "\u062E\u0627\u0644\u062F \u0646\u0627\u0635\u0631",
    positionEn: "Video Producer",
    positionAr: "\u0645\u0646\u062A\u062C \u0641\u064A\u062F\u064A\u0648",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&q=80",
    nameEn: "Noor Faisal",
    nameAr: "\u0646\u0648\u0631 \u0641\u064A\u0635\u0644",
    positionEn: "UI/UX Designer",
    positionAr: "\u0645\u0635\u0645\u0645\u0629 \u062A\u062C\u0631\u0628\u0629 \u0645\u0633\u062A\u062E\u062F\u0645",
  },
] as const;

async function main() {
  await prisma.teamConfig.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      labelEn: "Our Team",
      labelAr: "\u0641\u0631\u064A\u0642\u0646\u0627",
      headingEn: "Meet the Team",
      headingAr: "\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0641\u0631\u064A\u0642",
      visible: true,
    },
    update: {},
  });

  const existing = await prisma.teamMember.count();
  if (existing > 0) {
    console.log(`Team members already seeded (${existing}). Skipping members.`);
    return;
  }

  for (const [index, member] of DEMO_MEMBERS.entries()) {
    await prisma.teamMember.create({
      data: {
        ...member,
        sortOrder: index,
        visible: true,
      },
    });
  }

  console.log(`Seeded ${DEMO_MEMBERS.length} team members.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
