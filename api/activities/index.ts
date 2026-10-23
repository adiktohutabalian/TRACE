import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../_utils/auth.js";
import { DBService } from "../_utils/db.js";
import type { DBActivity, DBCheckpoint } from "../_utils/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  try {
    // GET /api/activities — List all activities for current user
    if (req.method === "GET") {
      const userActivities = await DBService.getActivitiesByUserId(user.id);
      const activityIds = userActivities.map((a) => a.id);
      const allCheckpoints = await DBService.getCheckpointsByActivityIds(activityIds);

      const enrichedActivities = userActivities.map((act) => {
        const actCheckpoints = allCheckpoints
          .filter((c) => c.activity_id === act.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const latest = actCheckpoints[0] || null;

        return {
          ...act,
          latest_checkpoint: latest,
          checkpoint_count: actCheckpoints.length,
          last_active_time: latest ? latest.created_at : act.created_at,
        };
      });

      enrichedActivities.sort(
        (a, b) => new Date(b.last_active_time).getTime() - new Date(a.last_active_time).getTime()
      );

      return res.json({ activities: enrichedActivities });
    }

    // POST /api/activities — Create new activity
    if (req.method === "POST") {
      const { title, description, color, initial_where, initial_important, initial_next } = req.body || {};

      if (!title || !title.trim()) {
        return res.status(400).json({ error: "Activity title is required." });
      }

      const now = new Date().toISOString();
      const newActivity: DBActivity = {
        id: `act_${Date.now()}`,
        user_id: user.id,
        title: title.trim(),
        description: (description || "").trim(),
        color: color || "#3b82f6",
        created_at: now,
        updated_at: now,
      };

      await DBService.createActivity(newActivity);

      let firstCheckpoint: DBCheckpoint | null = null;
      if (initial_where && initial_where.trim() && initial_next && initial_next.trim()) {
        firstCheckpoint = {
          id: `chk_${Date.now()}`,
          activity_id: newActivity.id,
          where_left_off: initial_where.trim(),
          whats_important: initial_important ? initial_important.trim() : null,
          whats_next: initial_next.trim(),
          created_at: now,
          updated_at: now,
        };
        await DBService.createCheckpoint(firstCheckpoint);
      }

      return res.status(201).json({
        activity: {
          ...newActivity,
          latest_checkpoint: firstCheckpoint,
          checkpoint_count: firstCheckpoint ? 1 : 0,
        },
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("Activities error:", err);
    return res.status(500).json({ error: err.message });
  }
}
