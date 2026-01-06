import { getEndpointDetails, getEndpointLogs } from "@/app/actions/endpointActions";
import BarUptime from "@/components/barUptime";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import NextPingComponent from "@/components/nextPing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SettingsIcon, Undo2Icon } from "lucide-react";
import Link from "next/link";

export default async function EndpointPage({ params }: { params: Promise<{ endpointId: string }> }) {
    const { endpointId } = await params;
    const endpointDetails = await getEndpointDetails(endpointId);
    console.log(endpointDetails)
    const logs = await getEndpointLogs(endpointId);

    return (
        <div className="flex flex-col gap-[30px]">

            <NextPingComponent endpoints={[JSON.parse(JSON.stringify(endpointDetails))]} />


            <div className="flex flex-col gap-[15px]">
                <div className="flex flex-col gap-[2px]">
                    <Label>Endpoint url</Label>
                    <p>{endpointDetails.url}</p>
                </div>
                <div className="flex flex-col gap-[2px]">
                    <Label>Last pinged at</Label>
                    <p>{endpointDetails.lastPingedAt?.toLocaleDateString()}</p>
                </div>
            </div>

            <div className="gap-[10px] md:grid-cols-1 grid-cols-2 grid md:w-[140px] max-w-[400px]">
                <div className="flex flex-col gap-[2px] items-center p-[6px] pt-[8px] border dark:bg-muted/20 rounded-[8px] flex-1 gap-[6px]">
                    <Label className="text-[12px]">Ping Interval</Label>
                    <div className="text-[14px] bg-foreground/10 rounded-[3px] w-full flex items-center justify-center h-[30px]">{endpointDetails.intervalMinutes} m</div>
                </div>
                <div className="flex flex-col gap-[2px] items-center p-[6px] pt-[8px] border dark:bg-muted/20 rounded-[8px] flex-1 gap-[6px]">
                    <Label className="text-[12px]">Latency</Label>
                    <div className="text-[14px] bg-foreground/10 rounded-[3px] w-full flex items-center justify-center h-[30px]">{endpointDetails.latency} ms</div>
                </div>
            </div>


            <div className="">
                <ChartAreaInteractive logs={logs} />
            </div>



        </div>
    )
}