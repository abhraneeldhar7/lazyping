"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { PlusIcon } from "lucide-react";
import { createProjectPublicPage } from "@/app/actions/publicPageActions";

export default function CreatePublicPageButton({ projectId }: { projectId: string }) {
    const [loading, setLoading] = useState(false);
    return (
        <Button loading={loading} variant="shinny" onClick={async () => {
            setLoading(true);
            await createProjectPublicPage(projectId)
            setLoading(false);
        }}>Create <PlusIcon /></Button>

    )
}