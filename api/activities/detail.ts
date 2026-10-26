import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../_utils/auth.js";
import { DBService } from "../_utils/db.js";

export function extractActivityId(req: VercelRequest): string | null {
  if (req.query && req.query.id) {
    return Array.isArray(req.query.id) ? req.query.id[0] : (req.query.id as string);
  }
  const match = req.url?.match(/\/api\/activities\/([^\/\?]+)/);
  return match ? match[1] : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  const activityId = extractActivityId(req);
  if (!activityId) {
    return res.status(400).json({ error: "Activity ID is required." });
  }

  try {
    if (req.method === "GET") {
      const activity = await DBService.getActivityById(activityId);
      if (!activity || activity.user_id !== user.id) {
        return res.status(404).json({ error: "Activity not found or unauthorized." });
      }
      return res.json({ activity });
    }

    if (req.method === "DELETE") {
      await DBService.deleteActivity(activityId, user.id);
      return res.json({
        success: true,
        message: "Activity and all associated checkpoints deleted successfully.",
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("Activity detail error:", err);
    return res.status(500).json({ error: err.message });
  }
}
