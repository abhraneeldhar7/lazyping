
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] gap-[20px] p-4 text-center">
            <div className="p-[20px] bg-muted/50 rounded-full">
                <FileQuestion size={40} className="opacity-40" />
            </div>
            <div className="flex flex-col gap-[8px]">
                <h2 className="text-[20px] font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground text-[16px]">We couldn't find the page you're looking for.</p>
            </div>
            <Link
                href="/"
                className="px-[20px] py-[10px] bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity text-[14px] font-medium"
            >
                Go Home
            </Link>
        </div>
    )
}
