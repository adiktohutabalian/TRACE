import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../_utils/auth.js";
import { DBService } from "../_utils/db.js";

export function extractCheckpointId(req: VercelRequest): string | null {
  if (req.query && req.query.id) {
    return Array.isArray(req.query.id) ? req.query.id[0] : (req.query.id as string);
  }
  const match = req.url?.match(/\/api\/checkpoints\/([^\/\?]+)/);
  return match ? match[1] : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  const checkpointId = extractCheckpointId(req);
  if (!checkpointId) {
    return res.status(400).json({ error: "Checkpoint ID is required." });
  }

  try {
    if (req.method === "PUT") {
      const { where_left_off, whats_important, whats_next } = req.body || {};

      const now = new Date().toISOString();
      const updates: any = { updated_at: now };
      if (where_left_off && where_left_off.trim()) updates.where_left_off = where_left_off.trim();
      if (whats_important !== undefined) {
        updates.whats_important = whats_important && whats_important.trim() ? whats_important.trim() : null;
      }
      if (whats_next && whats_next.trim()) updates.whats_next = whats_next.trim();

      const updatedCheckpoint = await DBService.updateCheckpoint(checkpointId, updates);
      if (!updatedCheckpoint) {
        return res.status(404).json({ error: "Checkpoint not found." });
      }

      return res.json({ checkpoint: updatedCheckpoint });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("Edit checkpoint error:", err);
    return res.status(500).json({ error: err.message });
  }
}
