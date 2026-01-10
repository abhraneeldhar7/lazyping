import { ChartNoAxesColumnIncreasing, Server, CheckCircle, XCircle, OctagonAlert, PauseCircle } from "lucide-react";
import BarUptime from "../barUptime";
import { EndpointType } from "@/lib/types";
import { getEndpointLogs } from "@/app/actions/endpointActions";
import { formatRelativeTime } from "@/lib/utils";

export default async function PublicPageEndpointCard({ endpoint }: { endpoint: EndpointType }) {
    const logs = await getEndpointLogs(endpoint.endpointId);

    const getStatusInfo = (status: EndpointType["currentStatus"]) => {
        switch (status) {
            case "UP":
                return { label: "Active", color: "text-[#00ff9e]", icon: CheckCircle };
            case "DOWN":
                return { label: "Down", color: "text-red-500", icon: XCircle };
            case "DEGRADED":
                return { label: "Degraded", color: "text-amber-500", icon: OctagonAlert };
            case "MAINTENANCE":
                return { label: "Maintenance", color: "text-blue-500", icon: PauseCircle };
            default:
                return { label: "Unknown", color: "text-muted-foreground", icon: Server };
        }
    };

    const statusInfo = getStatusInfo(endpoint.currentStatus);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="rounded-[10px] border bg-background/40 p-[10px] h-[170px] flex justify-between flex-col relative overflow-hidden group transition-all duration-300 cursor-default select-none">
            <div className="rounded-[50%] h-[20px] w-full absolute bg-foreground blur-[60px] bottom-[30%] left-[-50%] rotate-[-40deg] group-hover:translate-x-[50%] group-hover:translate-y-[-50%] transition-all duration-400 ease-in-out animate-pulse" />

            <div className="z-[2] flex flex-col gap-[10px] pl-[5px]">
                <h3 className="text-[17px] font-medium truncate max-w-[300px]">{endpoint.endpointName}</h3>
                <div className="flex flex-col gap-[6px]">
                    <div className="flex gap-[10px] items-center">
                        <p className="text-[12px] opacity-[0.8]">Status</p>
                        <p className="text-[14px] flex items-center gap-[5px]">
                            <StatusIcon size={14} className={statusInfo.color} />
                            <span className={statusInfo.color}>{statusInfo.label}</span>
                        </p>
                    </div>

                    <div className="flex gap-[10px] items-center">
                        <p className="text-[12px] opacity-[0.8]">Last checked</p>
                        <p className="text-[12px] flex gap-[5px] items-center opacity-[0.8]">
                            {formatRelativeTime(endpoint.lastPingedAt)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-[10px] justify-between items-end z-[2]">
                <p className="text-[12px] opacity-[0.8] flex gap-[4px] items-center pl-[5px]">
                    <ChartNoAxesColumnIncreasing size={12} />
                    {endpoint.latency || 0}ms</p>
                <BarUptime logs={logs} hideLabel hideTooltip />
            </div>
        </div>
    );
}