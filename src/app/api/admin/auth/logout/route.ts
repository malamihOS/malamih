import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { withAdmin } from "@/lib/admin-route";

export async function POST() {
  return withAdmin(async () => {
    await destroySession();
    return NextResponse.json({ success: true });
  });
}
