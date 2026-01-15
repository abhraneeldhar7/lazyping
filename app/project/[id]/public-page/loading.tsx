import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPublicPagesSkeleton() {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[15px]">
            <Skeleton className="h-[145px] w-full bg-muted rounded-[15px] border" />
            <Skeleton className="h-[145px] w-full bg-muted rounded-[15px] border" />
            <Skeleton className="h-[145px] w-full bg-muted rounded-[15px] border" />
            <Skeleton className="h-[145px] w-full bg-muted rounded-[15px] border" />
        </div>

    );
}