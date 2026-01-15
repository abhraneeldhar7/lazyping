import { Suspense } from "react";
import { DashboardLogsWrapper } from "@/components/logs/logsWrapper";
import { LogsPageSkeleton, TableSkeleton } from "@/components/loadingSkeletons";


export default async function DashboardLogsPage() {
    return (
        <div>
            <Suspense fallback={<LogsPageSkeleton />}>
                <DashboardLogsWrapper />
            </Suspense>
        </div>
    )
}