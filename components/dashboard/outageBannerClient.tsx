"use client"

import { ProjectType } from "@/lib/types";
import Link from "next/link";
import { AlertTriangle, AlertOctagon, AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function OutageBannerClient({ initialOutages }: { initialOutages: ProjectType[] }) {
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("dismissedOutages");
        if (saved) {
            try {
                setDismissedIds(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse dismissedOutages", e);
            }
        }
    }, []);

    const dismissOutage = (projectId: string) => {
        const newDismissed = [...dismissedIds, projectId];
        setDismissedIds(newDismissed);
        localStorage.setItem("dismissedOutages", JSON.stringify(newDismissed));
    };

    if (!mounted) return null;

    const visibleOutages = initialOutages.filter(p => !dismissedIds.includes(p.projectId));

    if (visibleOutages.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-[300px] w-full pointer-events-none">
            {visibleOutages.map(p => {
                let colorClass = "bg-destructive text-destructive-foreground";
                let Icon = AlertTriangle;
                let text = "Outage";

                if (p.overallStatus === "DEGRADED") {
                    colorClass = "bg-amber-500 text-white";
                    Icon = AlertCircle;
                    text = "Degraded Performance";
                } else if (p.overallStatus === "MAJOR_OUTAGE") {
                    colorClass = "bg-red-600 text-white";
                    Icon = AlertOctagon;
                    text = "Major Outage";
                } else if (p.overallStatus === "PARTIAL_OUTAGE") {
                    colorClass = "bg-orange-500 text-white";
                    Icon = AlertTriangle;
                    text = "Partial Outage";
                }

                return (
                    <div key={p.projectId} className="relative group pointer-events-auto">
                        <Link
                            href={`/project/${p.projectId}`}
                            onClick={() => dismissOutage(p.projectId)}
                            className={`${colorClass} p-4 rounded-xl shadow-xl flex items-center gap-4 hover:scale-[1.02] transition-transform animate-in slide-in-from-bottom-5 duration-300 w-full`}
                        >
                            <div className="p-2 bg-white/20 rounded-full">
                                <Icon size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[14px] leading-tight">{p.projectName}</span>
                                <span className="text-[12px] opacity-90 font-medium whitespace-nowrap">
                                    {text}
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dismissOutage(p.projectId);
                            }}
                            className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-[60]"
                        >
                            <X size={12} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
