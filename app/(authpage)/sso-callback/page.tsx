import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { LoaderCircleIcon } from "lucide-react";

export default function SSOCallback() {
    return (
        <div className="flex items-center justify-center h-screen px-[15px]">
            <AuthenticateWithRedirectCallback />
            <div className="flex items-center gap-[15px]">
                <LoaderCircleIcon size={26} className="animate-spin" />
                <h1 className="text-center text-[24px] animate-pulse">Signin in...</h1>
            </div>
        </div>
    );
}
