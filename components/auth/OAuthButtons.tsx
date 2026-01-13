"use client"
import { GithubIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";

export default function OAuthButtons() {
    const { signIn } = useSignIn();
    const { signUp } = useSignUp();

    const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
        try {
            if (!signIn || !signUp) return;

            // Use the dedicated sso-callback route
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            });
        } catch (err: any) {
            console.error("OAuth error", err);
            toast.error("Failed to start login with " + strategy.split("_")[1]);
        }
    };

    return (
        <div className="flex gap-[8px]">
            <Button
                onClick={() => handleOAuth("oauth_google")}
                className="flex-1 h-[44px]"
            >
                <Image alt="" src="/login/google.webp" height={18} width={18} /> Google
            </Button>
            <Button
                onClick={() => handleOAuth("oauth_github")}
                className="flex-1 h-[44px]"
            >
                <GithubIcon /> Github
            </Button>
        </div>
    )
}