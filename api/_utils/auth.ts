import type { VercelRequest } from "@vercel/node";
import { DBService, DBUser } from "./db.js";

/**
 * Extract the authenticated user from the Authorization header.
 * Token format: "Bearer tok_<userId>"
 */
export async function getAuthenticatedUser(req: VercelRequest): Promise<DBUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = (authHeader as string).replace(/^Bearer\s+/i, "");
  const userId = token.startsWith("tok_") ? token.replace("tok_", "") : token;

  try {
    const user = await DBService.findUserById(userId);
    return user;
  } catch (e) {
    console.error("Auth lookup error:", e);
    return null;
  }
}
