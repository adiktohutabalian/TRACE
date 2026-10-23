import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../_utils/auth";
import { DBService } from "../_utils/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    const userActivities = await DBService.getActivitiesByUserId(user.id);
    const activityIds = userActivities.map((a) => a.id);
    const userCheckpoints = await DBService.getCheckpointsByActivityIds(activityIds);

    if (userCheckpoints.length === 0) {
      return res.json({ resume: null });
    }

    const latestCheckpoint = userCheckpoints[0];
    const relatedActivity = userActivities.find((a) => a.id === latestCheckpoint.activity_id);

    if (!relatedActivity) {
      return res.json({ resume: null });
    }

    return res.json({
      resume: {
        activity: relatedActivity,
        checkpoint: latestCheckpoint,
      },
    });
  } catch (err: any) {
    console.error("Dashboard resume error:", err);
    return res.status(500).json({ error: err.message });
  }
}
