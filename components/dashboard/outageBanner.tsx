
import { getProjects } from "@/app/actions/projectActions";
import Link from "next/link";
import { AlertTriangle, AlertOctagon, AlertCircle } from "lucide-react";

export default async function OutageBanner() {
    const projects = await getProjects();
    const outages = projects.filter(p => p.overallStatus && p.overallStatus !== 'OPERATIONAL');

    if (outages.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-[300px] w-full pointer-events-none">
            {outages.map(p => {
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
                    <Link
                        href={`/project/${p.projectId}`}
                        key={p.projectId}
                        className={`pointer-events-auto ${colorClass} p-4 rounded-xl shadow-xl flex items-center gap-4 hover:scale-[1.02] transition-transform animate-in slide-in-from-bottom-5 duration-300`}
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
                );
            })}
        </div>
    )
}
