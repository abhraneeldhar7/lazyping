import { Webhook } from "svix";
import { headers } from "next/headers";
import { getDB } from "@/lib/db";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  const evt = wh.verify(payload, {
    "svix-id": headersList.get("svix-id")!,
    "svix-timestamp": headersList.get("svix-timestamp")!,
    "svix-signature": headersList.get("svix-signature")!,
  }) as any;

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const db = await getDB();
    const users = db.collection("users");

    const data = evt.data;

    await users.updateOne(
      { clerkId: data.id },
      {
        $set: {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          avatar: data.image_url,
          provider: data.external_accounts?.[0]?.provider || "email",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  } else if (evt.type === "user.deleted") {
    const db = await getDB();
    const clerkId = evt.data.id;

    // 1. Find all projects belonging to this user
    const projects = await db.collection("projects").find({ ownerId: clerkId }).toArray();
    const projectIds = projects.map(p => p.projectId);

    if (projectIds.length > 0) {
      // 2. Delete all related data from MongoDB
      await db.collection("endpoints").deleteMany({ projectId: { $in: projectIds } });
      await db.collection("logs").deleteMany({ projectId: { $in: projectIds } });
      await db.collection("public-page").deleteMany({ projectId: { $in: projectIds } });
      await db.collection("projects").deleteMany({ ownerId: clerkId });

      // 3. Clean up Redis Cache
      const pipeline = redis.pipeline();

      for (const projectId of projectIds) {
        pipeline.del(`project:${projectId}`);

        // Cleanup endpoints for each project
        const endpointIds = await redis.smembers(`project:${projectId}:endpoints`);
        if (endpointIds.length > 0) {
          endpointIds.forEach(eid => pipeline.del(`endpoint:${eid}`));
        }
        pipeline.del(`project:${projectId}:endpoints`);
      }

      pipeline.del(`user:${clerkId}:projects`);
      await pipeline.exec();
    }

    // 4. Delete the user from MongoDB
    await db.collection("users").deleteOne({ clerkId });
  }

  return new Response("OK");
}
