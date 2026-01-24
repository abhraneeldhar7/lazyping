"use client";
import { PingLog } from "@/lib/types";
import { useMemo } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type BucketStatus = "UP" | "DOWN" | "DEGRADED" | "NONE";

export default function BarUptime({
    logs,
    hideLabel = false,
    hideTooltip = false,
}: {
    logs: PingLog[];
    hideLabel?: boolean;
    hideTooltip?: boolean;
}) {
    const buckets = useMemo(() => {
        const now = new Date();

        // ⬇️ snap to the start of the current hour
        const currentHour = new Date(now);
        currentHour.setMinutes(0, 0, 0);

        const startTime = new Date(currentHour.getTime() - 24 * 3600000);

        // pre-create buckets
        const result = Array.from({ length: 24 }, (_, i) => {
            const start = new Date(startTime.getTime() + i * 3600000);
            return {
                start,
                end: new Date(start.getTime() + 3600000),
                logs: [] as PingLog[],
            };
        });

        // ⬇️ single-pass log assignment (correct + fast)
        for (const log of logs) {
            const t = new Date(log.timestamp).getTime();
            const index = Math.floor((t - startTime.getTime()) / 3600000);

            if (index >= 0 && index < 24) {
                result[index].logs.push(log);
            }
        }

        // compute status per bucket
        return result.map((bucket) => {
            let status: BucketStatus = "NONE";

            if (bucket.logs.length > 0) {
                const allOk = bucket.logs.every(l => l.status === "OK");
                const someOk = bucket.logs.some(l => l.status === "OK");

                if (allOk) status = "UP";
                else if (someOk) status = "DEGRADED";
                else status = "DOWN";
            }

            return {
                start: bucket.start,
                end: bucket.end,
                status,
                count: bucket.logs.length,
            };
        });
    }, [logs]);

    const getColor = (status: BucketStatus) => {
        if (status === "UP")
            return "linear-gradient(180deg, #5fffb4ff 0%, #00ff88 50%, #007a3d 100%)";
        if (status === "DEGRADED")
            return "linear-gradient(180deg, #fff25fff 0%, #ffd000 50%, #7a6a00 100%)";
        if (status === "DOWN")
            return "linear-gradient(180deg, #ff5858ff 0%, #ff0000 50%, #a70202ff 100%)";
        return "var(--muted)";
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-[10px] h-fit w-fit">
                <div className="flex gap-[3px] flex-1 justify-end">
                    {buckets.map((bucket, index) => {
                        const bar = (
                            <div
                                className={`rounded-[1px] h-[35px] w-[7px] cursor-pointer ${bucket.status === "NONE" ? "border border-border/30" : ""
                                    }`}
                                style={{ background: getColor(bucket.status) }}
                            />
                        );

                        if (hideTooltip) return <div key={index}>{bar}</div>;

                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>{bar}</TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-[12px]">
                                        <p className="font-medium">
                                            {bucket.status === "UP"
                                                ? "Operational"
                                                : bucket.status === "DEGRADED"
                                                    ? "Degraded performance"
                                                    : bucket.status === "DOWN"
                                                        ? "Outage detected"
                                                        : "No data"}
                                        </p>
                                        <p className="opacity-70 mt-1">
                                            {bucket.start.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            –{" "}
                                            {bucket.end.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        {bucket.count > 0 && (
                                            <p className="opacity-70">{bucket.count} checks</p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>

                {!hideLabel && (
                    <p className="text-[12px] opacity-[0.7] text-center w-full">
                        Last 24 hr
                    </p>
                )}
            </div>
        </TooltipProvider>
    );
}
