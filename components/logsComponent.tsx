"use client"
import { PingLog } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile";
import LogsTable from "./logsTable";
import { GithubIntegartionPrompt } from "./githubIntegrationPrompt";

export const mockLogsData: PingLog[] = []

export default function LogsPageComponent() {

    return (
        <div>



            <LogsTable logsData={mockLogsData} />


        </div >
    )
}