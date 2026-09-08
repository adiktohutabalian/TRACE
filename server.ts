import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { DBService, DBUser, DBActivity, DBCheckpoint } from "./src/db/dbService.js";
import { isSupabaseConfigured } from "./src/db/supabaseClient.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------
// Database Persistence (Local JSON Fallback Engine)
// -------------------------------------------------------------
const DB_FILE = path.join(process.cwd(), "db.json");

interface DatabaseSchema {
  users: DBUser[];
  activities: DBActivity[];
  checkpoints: DBCheckpoint[];
}

const emptyDB: DatabaseSchema = {
  users: [],
  activities: [],
  checkpoints: [],
};

function saveDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local database to disk:", err);
  }
}

function loadDB(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      return emptyDB;
    }
  }
  saveDB(emptyDB);
  return emptyDB;
}

let localDB = loadDB();

// -------------------------------------------------------------
// Auth Middleware (Bearer Token simulation)
// -------------------------------------------------------------
async function getAuthenticatedUser(req: express.Request): Promise<DBUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "");
  // Token format: "tok_<userId>"
  const userId = token.startsWith("tok_") ? token.replace("tok_", "") : token;

  if (isSupabaseConfigured()) {
    try {
      const user = await DBService.findUserById(userId);
      if (user) return user;
    } catch (e) {
      console.error("Auth Supabase lookup error:", e);
    }
  }

  // Fallback to local memory / JSON
  const localUser = localDB.users.find((u) => u.id === userId || `tok_${u.id}` === token);
  return localUser || null;
}

async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }
  (req as any).user = user;
  next();
}

// -------------------------------------------------------------
// System Status Route
// -------------------------------------------------------------
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    app: "TRACE",
    database_mode: isSupabaseConfigured() ? "Supabase (PostgreSQL Cloud)" : "Local JSON Storage",
    supabase_connected: isSupabaseConfigured(),
  });
});

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------

// 1. Auth: Sign up
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check existing
  if (isSupabaseConfigured()) {
    try {
      const existing = await DBService.findUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists in Supabase." });
      }
    } catch (err: any) {
      console.error("Supabase registration lookup error:", err);
    }
  } else {
    if (localDB.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
  }

  const newUser: DBUser = {
    id: `usr_${Date.now()}`,
    email: normalizedEmail,
    name: name.trim(),
    password_hash: password,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      await DBService.createUser(newUser);
    } catch (err: any) {
      console.error("Error creating user in Supabase:", err);
      return res.status(500).json({ error: `Supabase registration error: ${err.message}` });
    }
  }

  // Also cache locally
  localDB.users.push(newUser);
  saveDB(localDB);

  res.status(201).json({
    user: { id: newUser.id, email: newUser.email, name: newUser.name, created_at: newUser.created_at },
    token: `tok_${newUser.id}`,
  });
});

// 2. Auth: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || "").trim().toLowerCase();

  let user: DBUser | null = null;

  if (isSupabaseConfigured()) {
    try {
      user = await DBService.findUserByEmail(normalizedEmail);
    } catch (err) {
      console.error("Supabase login search error:", err);
    }
  }

  if (!user) {
    user = localDB.users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
  }

  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.json({
    user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
    token: `tok_${user.id}`,
  });
});

// 3. Auth: Current User Profile
app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = (req as any).user as DBUser;
  res.json({
    user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
  });
});

// 4. Dashboard Resume Experience (The Core Value!)
// Finds the single latest checkpoint across all activities belonging to this user
app.get("/api/dashboard/resume", requireAuth, async (req, res) => {
  const user = (req as any).user as DBUser;

  let userActivities: DBActivity[] = [];
  let userCheckpoints: DBCheckpoint[] = [];

  if (isSupabaseConfigured()) {
    try {
      userActivities = await DBService.getActivitiesByUserId(user.id);
      const activityIds = userActivities.map((a) => a.id);
      userCheckpoints = await DBService.getCheckpointsByActivityIds(activityIds);
    } catch (err) {
      console.error("Supabase resume dashboard error:", err);
    }
  } else {
    userActivities = localDB.activities.filter((a) => a.user_id === user.id);
    const userActivityIds = new Set(userActivities.map((a) => a.id));
    userCheckpoints = localDB.checkpoints
      .filter((c) => userActivityIds.has(c.activity_id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  if (userCheckpoints.length === 0) {
    return res.json({ resume: null });
  }

  const latestCheckpoint = userCheckpoints[0];
  const relatedActivity = userActivities.find((a) => a.id === latestCheckpoint.activity_id);

  if (!relatedActivity) {
    return res.json({ resume: null });
  }

  res.json({
    resume: {
      activity: relatedActivity,
      checkpoint: latestCheckpoint,
    },
  });
});

// 5. Activities: List all for current user (with latest checkpoint + recency ordering)
app.get("/api/activities", requireAuth, async (req, res) => {
  const user = (req as any).user as DBUser;

  let userActivities: DBActivity[] = [];
  let allCheckpoints: DBCheckpoint[] = [];

  if (isSupabaseConfigured()) {
    try {
      userActivities = await DBService.getActivitiesByUserId(user.id);
      const activityIds = userActivities.map((a) => a.id);
      allCheckpoints = await DBService.getCheckpointsByActivityIds(activityIds);
    } catch (err) {
      console.error("Supabase activities list error:", err);
    }
  } else {
    userActivities = localDB.activities.filter((a) => a.user_id === user.id);
    allCheckpoints = localDB.checkpoints;
  }

  // Attach latest checkpoint and count to each activity
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

  // Sort by most recent activity (recency first!)
  enrichedActivities.sort(
    (a, b) => new Date(b.last_active_time).getTime() - new Date(a.last_active_time).getTime()
  );

  res.json({ activities: enrichedActivities });
});

// 6. Activities: Create new activity
app.post("/api/activities", requireAuth, async (req, res) => {
  const user = (req as any).user as DBUser;
  const { title, description, color, initial_where, initial_important, initial_next } = req.body;

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
  }

  if (isSupabaseConfigured()) {
    try {
      await DBService.createActivity(newActivity);
      if (firstCheckpoint) {
        await DBService.createCheckpoint(firstCheckpoint);
      }
    } catch (err: any) {
      console.error("Supabase create activity error:", err);
      return res.status(500).json({ error: `Supabase error: ${err.message}` });
    }
  }

  // Keep local copy
  localDB.activities.push(newActivity);
  if (firstCheckpoint) {
    localDB.checkpoints.push(firstCheckpoint);
  }
  saveDB(localDB);

  res.status(201).json({
    activity: {
      ...newActivity,
      latest_checkpoint: firstCheckpoint,
      checkpoint_count: firstCheckpoint ? 1 : 0,
    },
  });
});

// 7. Activities: Delete activity with ON DELETE CASCADE
app.delete("/api/activities/:id", requireAuth, async (req, res) => {
  const user = (req as any).user as DBUser;
  const { id } = req.params;

  if (isSupabaseConfigured()) {
    try {
      await DBService.deleteActivity(id, user.id);
    } catch (err: any) {
      console.error("Supabase delete activity error:", err);
      return res.status(500).json({ error: `Supabase delete error: ${err.message}` });
    }
  }

  // Also clean local copy
  const activityIndex = localDB.activities.findIndex((a) => a.id === id && a.user_id === user.id);
  let deletedCheckpoints = 0;
  if (activityIndex !== -1) {
    const initialCheckpointCount = localDB.checkpoints.length;
    localDB.checkpoints = localDB.checkpoints.filter((c) => c.activity_id !== id);
    deletedCheckpoints = initialCheckpointCount - localDB.checkpoints.length;
    localDB.activities.splice(activityIndex, 1);
    saveDB(localDB);
  }

  res.json({
    success: true,
    message: `Activity and all associated checkpoints deleted successfully.`,
  });
});

// 8. Checkpoints: List all for an activity (Timeline History)
app.get("/api/activities/:id/checkpoints", requireAuth, async (req, res) => {
  const user = (req as any).user as DBUser;
  const { id } = req.params;

  let activity: DBActivity | null = null;
  let history: DBCheckpoint[] = [];

  if (isSupabaseConfigured()) {
    try {
      activity = await DBService.getActivityById(id);
      if (activity && activity.user_id === user.id) {
        history = await DBService.getCheckpointsByActivityId(id);
      } else {
        activity = null;
      }
    } catch (err) {
      console.error("Supabase checkpoints history error:", err);
    }
  }

  if (!activity) {
    activity = localDB.activities.find((a) => a.id === id && a.user_id === user.id) || null;
    if (activity) {
      history = localDB.checkpoints
        .filter((c) => c.activity_id === id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

  if (!activity) {
    return res.status(404).json({ error: "Activity not found or unauthorized." });
  }

  res.json({ activity, checkpoints: history });
});

// 9. Checkpoints: Create new Checkpoint (Where I left off)
app.post("/api/activities/:id/checkpoints", requireAuth, async (req, res) => {
  const user = (req as any).user as DBUser;
  const { id } = req.params;
  const { where_left_off, whats_important, whats_next } = req.body;

  if (!where_left_off || !where_left_off.trim()) {
    return res.status(400).json({ error: "'Where I left off' is required." });
  }
  if (!whats_next || !whats_next.trim()) {
    return res.status(400).json({ error: "'What's next' is required." });
  }

  const now = new Date().toISOString();
  const newCheckpoint: DBCheckpoint = {
    id: `chk_${Date.now()}`,
    activity_id: id,
    where_left_off: where_left_off.trim(),
    whats_important: whats_important && whats_important.trim() ? whats_important.trim() : null,
    whats_next: whats_next.trim(),
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    try {
      await DBService.createCheckpoint(newCheckpoint);
      await DBService.updateActivityTimestamp(id, now);
    } catch (err: any) {
      console.error("Supabase create checkpoint error:", err);
      return res.status(500).json({ error: `Supabase error: ${err.message}` });
    }
  }

  // Local fallback updates
  localDB.checkpoints.push(newCheckpoint);
  const localAct = localDB.activities.find((a) => a.id === id);
  if (localAct) {
    localAct.updated_at = now;
  }
  saveDB(localDB);

  res.status(201).json({ checkpoint: newCheckpoint });
});

// 10. Checkpoints: Edit an existing checkpoint
app.put("/api/checkpoints/:id", requireAuth, async (req, res) => {
  const user = (req as any).user as DBUser;
  const { id } = req.params;
  const { where_left_off, whats_important, whats_next } = req.body;

  const now = new Date().toISOString();
  const updates: any = { updated_at: now };
  if (where_left_off && where_left_off.trim()) updates.where_left_off = where_left_off.trim();
  if (whats_important !== undefined) {
    updates.whats_important = whats_important && whats_important.trim() ? whats_important.trim() : null;
  }
  if (whats_next && whats_next.trim()) updates.whats_next = whats_next.trim();

  let updatedCheckpoint: DBCheckpoint | null = null;

  if (isSupabaseConfigured()) {
    try {
      updatedCheckpoint = await DBService.updateCheckpoint(id, updates);
    } catch (err: any) {
      console.error("Supabase edit checkpoint error:", err);
      return res.status(500).json({ error: `Supabase error: ${err.message}` });
    }
  }

  // Local update
  const localCheckpoint = localDB.checkpoints.find((c) => c.id === id);
  if (localCheckpoint) {
    if (updates.where_left_off) localCheckpoint.where_left_off = updates.where_left_off;
    if (updates.whats_important !== undefined) localCheckpoint.whats_important = updates.whats_important;
    if (updates.whats_next) localCheckpoint.whats_next = updates.whats_next;
    localCheckpoint.updated_at = now;
    saveDB(localDB);
    if (!updatedCheckpoint) updatedCheckpoint = localCheckpoint;
  }

  if (!updatedCheckpoint) {
    return res.status(404).json({ error: "Checkpoint not found." });
  }

  res.json({ checkpoint: updatedCheckpoint });
});

// -------------------------------------------------------------
// Vite Server Integration (Middleware Mode)
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TRACE Server running on port ${PORT}`);
    if (isSupabaseConfigured()) {
      console.log("⚡ Connected to Supabase Cloud PostgreSQL!");
    } else {
      console.log("💾 Running in Local JSON Storage fallback mode.");
    }
  });
}

startServer();
