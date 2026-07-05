import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin, withAdminMutation } from "@/lib/admin-route";

export async function GET() {
  return withAdmin(
    async () => {
      const files = await prisma.mediaFile.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ files });
    },
    "media",
  );
}

export async function POST(request: Request) {
  return withAdminMutation(
    request,
    async (session) => {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const { saveUploadFile } = await import("@/lib/upload");
      const uploaded = await saveUploadFile(file);

      const media = await prisma.mediaFile.create({
        data: {
          filename: uploaded.filename,
          originalName: file.name,
          url: uploaded.url,
          mimeType: uploaded.mimeType,
          size: uploaded.size,
          altEn: String(formData.get("altEn") ?? ""),
          altAr: String(formData.get("altAr") ?? ""),
          uploadedBy: session.email,
        },
      });

      return NextResponse.json({ media });
    },
    "media",
  );
}
