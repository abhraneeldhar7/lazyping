import { Skeleton } from "@/components/ui/skeleton";

export default function StatusLoading() {
    return (
        <div className="relative overflow-hidden">
            <div className="min-h-[100vh] flex flex-col gap-[35px] p-[20px] pb-[100px] max-w-[800px] w-full mx-auto relative z-[1]">
                {/* Header Loading */}
                <div className="flex gap-[15px] items-center">
                    <Skeleton className="h-[45px] w-[45px] rounded-lg" />
                    <div className="flex flex-col gap-[8px]">
                        <Skeleton className="h-[24px] w-[200px]" />
                        <Skeleton className="h-[14px] w-[150px]" />
                    </div>
                </div>

                {/* Status Section Loading */}
                <div className="flex flex-col gap-[25px]">
                    <div className="flex flex-col gap-[7px]">
                        <h3 className="text-[14px] opacity-[0.7]">Current Status</h3>
                        <Skeleton className="h-[38px] w-[180px] rounded-[20px]" />
                    </div>

                    <div className="flex flex-col leading-[1em] gap-[10px]">
                        <h3 className="text-[14px] opacity-[0.7]">Overall Latency</h3>
                        <Skeleton className="h-[28px] w-[80px]" />
                    </div>
                </div>

                {/* Services Grid Loading */}
                <div className="flex flex-col gap-[8px]">
                    <h3 className="text-[14px] opacity-[0.7]">Services</h3>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-[12px]">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-[10px] border bg-background/40 p-[10px] h-[170px] flex justify-between flex-col">
                                <div className="flex flex-col gap-[10px] pl-[5px]">
                                    <Skeleton className="h-[20px] w-[80%]" />
                                    <div className="flex flex-col gap-[8px]">
                                        <Skeleton className="h-[14px] w-[40%]" />
                                        <Skeleton className="h-[12px] w-[60%]" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-end pl-[5px]">
                                    <Skeleton className="h-[14px] w-[40px]" />
                                    <Skeleton className="h-[24px] w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Loading */}
                <div className="mt-[20px]">
                    <Skeleton className="w-full h-[300px] rounded-xl" />
                </div>
            </div>
        </div>
    );
}
