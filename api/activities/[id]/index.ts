import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../../_utils/auth.js";
import { DBService } from "../../_utils/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  const activityId = req.query.id as string;
  if (!activityId) {
    return res.status(400).json({ error: "Activity ID is required." });
  }

  try {
    await DBService.deleteActivity(activityId, user.id);

    return res.json({
      success: true,
      message: "Activity and all associated checkpoints deleted successfully.",
    });
  } catch (err: any) {
    console.error("Delete activity error:", err);
    return res.status(500).json({ error: err.message });
  }
}
