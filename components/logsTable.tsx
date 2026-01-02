"use client"
import { PingLog } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";


export default function LogsTable({ logsData }: { logsData: PingLog[] }) {
    const isMobile = useIsMobile();


    return (
        <Table>
            <TableHeader>
                <TableRow className="opacity-[0.6] text-[12px]">
                    <TableHead className="w-[450px] md:w-[450px]">URL</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="text-[12px] cursor-pointer" suppressHydrationWarning>
                {logsData.map((log, index) => (

                    <Sheet key={index}>
                        <SheetTrigger asChild  >

                            <TableRow className={`border-0 hover:border-[1px] border-border/60 h-[45px] ${index % 2 == 0 ? "dark:bg-muted/50 bg-muted " : ""}`} >


                                <TableCell className="text-[15px]">
                                    <div className="relative w-full">
                                        <p className="absolute top-[50%] left-0 translate-y-[-50%] truncate right-0">{log.url}</p>
                                    </div>
                                </TableCell>

                                <TableCell>{log.method}</TableCell>
                                <TableCell className={`font-[600] ${log.status == "OK" ? "text-[var(--success)]" : "text-destructive"}`}>{log.status}</TableCell>
                                <TableCell>{log.latencyMs}</TableCell>
                                <TableCell className="opacity-[0.7] text-right">{log.timestamp.toLocaleTimeString().toUpperCase()}</TableCell>
                            </TableRow>

                        </SheetTrigger>

                        <SheetContent side={isMobile ? "bottom" : "right"} className="ring-0 outline-0 focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:outline-offset-0 ">
                            <SheetHeader>
                                <SheetTitle>Are you absolutely sure?</SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                ))}
            </TableBody>
        </Table>
    )
}