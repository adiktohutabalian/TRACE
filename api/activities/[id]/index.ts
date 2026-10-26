import type { VercelRequest, VercelResponse } from "@vercel/node";
import detailHandler from "../detail.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return detailHandler(req, res);
}
