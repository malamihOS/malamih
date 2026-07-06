import { NextResponse } from "next/server";
import { getAdminNotificationCounts } from "@/lib/admin-notifications";
import { withAdmin } from "@/lib/admin-route";

export async function GET() {
  return withAdmin(async () => {
    const counts = await getAdminNotificationCounts();
    return NextResponse.json({ counts });
  });
}
