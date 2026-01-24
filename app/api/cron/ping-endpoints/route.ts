import { processScheduledPings } from "@/app/actions/systemActions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.HUB_CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const res = await processScheduledPings().catch((err) => {
        console.error("[CRON BACKGROUND ERROR] Batch process failed:", err);
    });

    if (res) {
        return NextResponse.json({
            success: true,
            message: "Ping process started",
            processed: res.processed,
            pingedEndpoints: res.pingedEndpointsLog
        });
    }
    else {
        return NextResponse.json({
            success: false,
            message: "Ping process failed"
        });
    }
}
