"use server"

import { getDB } from "@/lib/db";
import { EndpointType, methodType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

/**
 * Adds a monitored endpoint to a project
 */
export async function createEndpoint(projectId: string, data: {
    url: string;
    method: methodType;
    intervalMinutes: number;
    expectedResponseCode: string;
    body: string | null;
    headers: Record<string, string> | null;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const db = await getDB();

    const userCheck = (await getDB()).collection("projects").findOne({ projectId: projectId, ownerId: userId })
    if (!userCheck) throw new Error("Unauthorized");

    const newEndpoint: EndpointType = {
        projectId: projectId,
        endpointId: uuidv4(),
        url: data.url,
        method: data.method,
        intervalMinutes: data.intervalMinutes,
        expectedResponse: data.expectedResponseCode,
        enabled: true,
        currentStatus: null,
        consecutiveFailures: 0,
        lastPingedAt: null,
        headers: data.headers,
        body: data.body,
        latencyAvg: null,
        nextPingAt: new Date(),
        lastStatusChange: new Date(),
    };

    await db.collection("endpoints").insertOne(newEndpoint);
    revalidatePath(`/project/${projectId}`);
}


export async function toggleEndpoint(endpointId: string, enabled: boolean) {
    const db = await getDB();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const endpoint = await db.collection("endpoints").findOne({ endpointId: endpointId })
    if (!endpoint) throw new Error("Unauthorized");

    const project = await db.collection("projects").findOne({ projectId: endpoint.projectId })
    if (!project) throw new Error("Unauthorized");

    if (project.ownerId != userId) throw new Error("Unauthorized");

    await db.collection("endpoints").updateOne({ endpointId: endpointId }, { $set: { enabled: enabled, nextPingAt: enabled ? new Date() : null } })

    revalidatePath(`/project/${endpoint.projectId}`);
}