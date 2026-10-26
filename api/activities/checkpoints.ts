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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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

      const checkpoints = await DBService.getCheckpointsByActivityId(activityId);
      return res.json({ activity, checkpoints });
    }

    if (req.method === "POST") {
      const { where_left_off, whats_important, whats_next } = req.body || {};

      if (!where_left_off || !where_left_off.trim()) {
        return res.status(400).json({ error: "'Where I left off' is required." });
      }
      if (!whats_next || !whats_next.trim()) {
        return res.status(400).json({ error: "'What's next' is required." });
      }

      // Verify activity ownership
      const activity = await DBService.getActivityById(activityId);
      if (!activity || activity.user_id !== user.id) {
        return res.status(404).json({ error: "Activity not found or unauthorized." });
      }

      const now = new Date().toISOString();
      const newCheckpoint = {
        id: `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        activity_id: activityId,
        where_left_off: where_left_off.trim(),
        whats_important: whats_important && whats_important.trim() ? whats_important.trim() : null,
        whats_next: whats_next.trim(),
        created_at: now,
        updated_at: now,
      };

      await DBService.createCheckpoint(newCheckpoint);
      await DBService.updateActivityTimestamp(activityId, now);

      return res.status(201).json({ checkpoint: newCheckpoint });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("Checkpoints error:", err);
    return res.status(500).json({ error: err.message });
  }
}
