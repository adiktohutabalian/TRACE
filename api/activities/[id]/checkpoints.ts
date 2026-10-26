import type { VercelRequest, VercelResponse } from "@vercel/node";
import checkpointsHandler from "../checkpoints.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return checkpointsHandler(req, res);
}
