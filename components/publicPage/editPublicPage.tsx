"use client"

import { PublicPageType } from "@/lib/types"
import Image from "next/image";
import { useState } from "react"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ArrowUpRight, RadioIcon, SaveIcon, WifiOffIcon } from "lucide-react";
import { compareObjects } from "@/lib/utils";
import { savePublicPage, togglePublicPageStatus } from "@/app/actions/publicPageActions";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditPublicStatusPage({ pageData }: { pageData: PublicPageType }) {
    const [newPageData, setNewPageData] = useState<PublicPageType>(pageData);
    const [saveLoading, setSaveLoading] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const result = await savePublicPage(newPageData);
            if (result.success) {
                toast.success("Public page updated successfully");
                setNewPageData(prev => ({ ...prev, pageSlug: result.newSlug || prev.pageSlug }));
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update public page");
        } finally {
            setSaveLoading(false);
        }
    }

    const handleToggleStatus = async () => {
        setToggleLoading(true);
        try {
            const nextEnabled = !pageData.enabled;
            await togglePublicPageStatus(pageData.projectId, nextEnabled);
            toast.success(`Public page ${nextEnabled ? "enabled" : "disabled"}`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to toggle status");
        } finally {
            // setToggleLoading(false);
        }
        setToggleLoading(false);
    }

    return (
        <div className="mx-auto max-w-[600px] w-full flex flex-col gap-[20px] relative">

            <div className="flex justify-between">
                {pageData.enabled ?
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary" className="w-[80px]" loading={toggleLoading}><RadioIcon className="text-[var(--success)]" /> Live</Button>
                        </DialogTrigger>
                        <DialogContent className="gap-[50px]">
                            <DialogHeader>
                                <DialogTitle>Disable Public Page?</DialogTitle>
                                <DialogDescription>Users will not be able to view vitals of your project</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={handleToggleStatus} className="w-[90px]" loading={toggleLoading}>Disable</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    :
                    <Button variant="outline" className="text-[var(--error)] w-[110px]" onClick={handleToggleStatus} loading={toggleLoading}><WifiOffIcon /> Disabled</Button>
                }

                <Link href={`/${pageData.pageSlug}`} target="_blank">
                    <Button variant="outline">Preview <ArrowUpRight /></Button>
                </Link>
            </div>

            <div className="flex gap-[20px] items-start">
                <div className={`rounded-[14px] flex items-center justify-center shadow-md ${!newPageData.logoUrl && " bg-muted border-[2px]"} overflow-hidden h-[40px] w-[40px] min-w-[40px]`}>
                    {newPageData.logoUrl &&
                        <Image src={newPageData.logoUrl} unoptimized height={40} width={40} alt="Site Logo" className="object-cover h-full w-full" />
                    }
                </div>
                <div className="flex flex-col gap-[10px] w-full md:w-fit">
                    <Label>Logo URL</Label>
                    <Input placeholder={pageData.logoUrl || "URL to your site logo"} value={newPageData.logoUrl || ""} onChange={(e) => setNewPageData((prev) => ({ ...prev, logoUrl: e.target.value }))} />
                </div>
            </div>

            <div className="flex flex-col gap-[6px]">
                <Label>Display name</Label>
                <Input placeholder={pageData.projectName || "Display name"} value={newPageData.projectName || ""} onChange={(e) => setNewPageData((prev) => ({ ...prev, projectName: e.target.value }))} />
            </div>

            <div className="flex flex-col gap-[6px]">
                <Label>Site URL</Label>
                <Input placeholder={pageData.siteUrl || "URL to your site"} value={newPageData.siteUrl || ""} onChange={(e) => setNewPageData((prev) => ({ ...prev, siteUrl: e.target.value }))} />
            </div>

            <div className="flex flex-col gap-[6px]">
                <Label>Slug</Label>
                <Input placeholder={pageData.pageSlug || "Slug"} value={newPageData.pageSlug || ""} onChange={(e) => setNewPageData((prev) => ({ ...prev, pageSlug: e.target.value }))} />
            </div>

            <div className="flex justify-end mt-[60px]">
                <Button onClick={handleSave} disabled={compareObjects(newPageData, pageData)} loading={saveLoading} className="w-[80px]"><SaveIcon /> Save</Button>
            </div>
        </div>
    )
}
