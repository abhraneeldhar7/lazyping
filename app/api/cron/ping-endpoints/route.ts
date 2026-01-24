import { processScheduledPings } from "@/app/actions/systemActions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.HUB_CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fire and forget: Return immediately to prevent caller timeouts
    // Individual ping failures are caught and logged within processScheduledPings
    processScheduledPings().catch((err) => {
        console.error("[CRON BACKGROUND ERROR] Batch process failed:", err);
    });

    // Return success immediately so GitHub Actions doesn't timeout
    return NextResponse.json({
        success: true,
        message: "Ping process started in background"
    });
}
