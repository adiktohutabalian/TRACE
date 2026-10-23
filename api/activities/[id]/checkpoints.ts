import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../../_utils/auth.js";
import { DBService } from "../../_utils/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  // The activity ID comes from the URL: /api/activities/[id]/checkpoints
  // Vercel parses it as req.query.id
  const activityId = req.query.id as string;
  if (!activityId) {
    return res.status(400).json({ error: "Activity ID is required." });
  }

  try {
    // DELETE /api/activities/[id]/checkpoints — Actually means delete the activity
    // But this file handles the checkpoints sub-route, so:
    // GET  = list checkpoints for activity
    // POST = create new checkpoint for activity

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

      const now = new Date().toISOString();
      const newCheckpoint = {
        id: `chk_${Date.now()}`,
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
