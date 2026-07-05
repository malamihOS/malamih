import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadFile } from "@/lib/upload";
import {
  withAdminMutation,
  jsonError,
} from "@/lib/admin-route";

export async function POST(request: Request) {
  return withAdminMutation(
    request,
    async (session) => {
      let formData: FormData;
      try {
        formData = await request.formData();
      } catch {
        return jsonError("Invalid form data");
      }

      const file = formData.get("file");
      if (!(file instanceof File)) {
        return jsonError("No file provided");
      }

      try {
        const uploaded = await saveUploadFile(file);
        const altEn = String(formData.get("altEn") ?? "");
        const altAr = String(formData.get("altAr") ?? "");

        const media = await prisma.mediaFile.create({
          data: {
            filename: uploaded.filename,
            originalName: file.name,
            url: uploaded.url,
            mimeType: uploaded.mimeType,
            size: uploaded.size,
            altEn,
            altAr,
            uploadedBy: session.email,
          },
        });

        return NextResponse.json({ url: uploaded.url, media });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
        return jsonError(message);
      }
    },
    "media",
  );
}
