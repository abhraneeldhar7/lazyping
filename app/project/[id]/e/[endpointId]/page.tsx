import { getEndpointDetails, getEndpointLogs } from "@/app/actions/endpointActions";
import BarUptime from "@/components/barUptime";
import { ChartAreaInteractive } from "@/components/latencyChart/latencyChart";
import NextPingComponent from "@/components/nextPing";
import { Button } from "@/components/ui/button";
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

            {/* <ChartAreaInteractive /> */}
            {/* <div>
                <BarUptime logs={logs} />
            </div> */}
        </div>
    )
}