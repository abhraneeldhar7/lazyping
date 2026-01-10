"use client"
import { RssIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { pingEndpoint } from "@/app/actions/pingActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PingEndpoint({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    return (
        <Button variant="shinny" className="w-[80px]" loading={loading}
            onClick={async () => {
                setLoading(true)
                try {
                    await pingEndpoint(id);
                    toast.success("Success");
                } catch (error) {
                    toast.error("Failed to ping endpoint")
                }
                setLoading(false);
                router.refresh();
            }}
        ><RssIcon /> Ping</Button>
    )
}