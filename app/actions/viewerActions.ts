"use server"
import { getDB } from "@/lib/db";
import { EndpointType, PingLog, ProjectType, PublicPageType } from "@/lib/types";
import { notFound } from "next/navigation";

export async function getViewerPublicPageData(slug: string) {
    try {
        const db = await getDB();
        const normalizedSlug = slug.toLowerCase();

        // 1. Fetch public page data
        const publicPage = await db.collection<PublicPageType>("public-page").findOne({
            pageSlug: normalizedSlug,
        });

        if (!publicPage) {
            notFound();
        }

        if (!publicPage.enabled) {
            return { error: "status page is disabled" };
        }

        const projectId = publicPage.projectId;

        // 2. Fetch project data
        const project = await db.collection<ProjectType>("projects").findOne({ projectId }, { projection: { _id: 0 } });

        // 3. Fetch endpoints
        const endpoints = await db.collection<EndpointType>("endpoints")
            .find({ projectId }, { projection: { _id: 0 } })
            .toArray();

        // 4. Fetch logs
        // Fetching last 100 logs for the status page
        const logs = await db.collection<PingLog>("logs")
            .find({ projectId }, { projection: { _id: 0 } })
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        // 5. Transform project data (security/privacy)
        const transformedProject = project ? {
            ...project,
            githubIntegration: null
        } : null;

        // 6. Transform endpoints (security/privacy)
        const transformedEndpoints = endpoints.map(endpoint => ({
            ...endpoint,
            url: "",
            expectedResponse: null,
            headers: null,
            body: null
        }));

        // 7. Transform logs (security/privacy)
        const transformedLogs = logs.map(log => ({
            ...log,
            url: "",
            responseMessage: null,
            errorMessage: null,
            logSummary: ""
        }));

        return JSON.parse(JSON.stringify({
            publicPageData: publicPage,
            projectData: transformedProject,
            endpoints: transformedEndpoints,
            logs: transformedLogs
        }));
    } catch (error: any) {
        if (error.message === 'NEXT_NOT_FOUND' || error.digest === 'NEXT_NOT_FOUND') {
            throw error;
        }
        console.error("Error fetching viewer public page data:", error);
        return { error: "An unexpected error occurred" };
    }
}
