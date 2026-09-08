import { getSupabase } from "./supabaseClient.js";

export interface DBUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

export interface DBActivity {
  id: string;
  user_id: string;
  title: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface DBCheckpoint {
  id: string;
  activity_id: string;
  where_left_off: string;
  whats_important: string | null;
  whats_next: string;
  created_at: string;
  updated_at: string;
}

export class DBService {
  // --- USERS ---
  static async findUserByEmail(email: string): Promise<DBUser | null> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();
      if (error) console.error("Supabase findUserByEmail error:", error.message);
      return data as DBUser | null;
    }
    return null;
  }

  static async findUserById(id: string): Promise<DBUser | null> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) console.error("Supabase findUserById error:", error.message);
      return data as DBUser | null;
    }
    return null;
  }

  static async createUser(user: DBUser): Promise<DBUser> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .insert([user])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as DBUser;
    }
    return user;
  }

  // --- ACTIVITIES ---
  static async getActivitiesByUserId(userId: string): Promise<DBActivity[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) console.error("Supabase getActivities error:", error.message);
      return (data || []) as DBActivity[];
    }
    return [];
  }

  static async getActivityById(id: string): Promise<DBActivity | null> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) console.error("Supabase getActivityById error:", error.message);
      return data as DBActivity | null;
    }
    return null;
  }

  static async createActivity(activity: DBActivity): Promise<DBActivity> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("activities")
        .insert([activity])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as DBActivity;
    }
    return activity;
  }

  static async updateActivityTimestamp(id: string, timestamp: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase
        .from("activities")
        .update({ updated_at: timestamp })
        .eq("id", id);
    }
  }

  static async deleteActivity(id: string, userId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      // Postgres ON DELETE CASCADE will automatically remove checkpoints
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
      return true;
    }
    return false;
  }

  // --- CHECKPOINTS ---
  static async getCheckpointsByActivityId(activityId: string): Promise<DBCheckpoint[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("checkpoints")
        .select("*")
        .eq("activity_id", activityId)
        .order("created_at", { ascending: false });
      if (error) console.error("Supabase getCheckpoints error:", error.message);
      return (data || []) as DBCheckpoint[];
    }
    return [];
  }

  static async getCheckpointsByActivityIds(activityIds: string[]): Promise<DBCheckpoint[]> {
    const supabase = getSupabase();
    if (supabase && activityIds.length > 0) {
      const { data, error } = await supabase
        .from("checkpoints")
        .select("*")
        .in("activity_id", activityIds)
        .order("created_at", { ascending: false });
      if (error) console.error("Supabase getCheckpointsByActivityIds error:", error.message);
      return (data || []) as DBCheckpoint[];
    }
    return [];
  }

  static async getCheckpointById(id: string): Promise<DBCheckpoint | null> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("checkpoints")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) console.error("Supabase getCheckpointById error:", error.message);
      return data as DBCheckpoint | null;
    }
    return null;
  }

  static async createCheckpoint(checkpoint: DBCheckpoint): Promise<DBCheckpoint> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("checkpoints")
        .insert([checkpoint])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as DBCheckpoint;
    }
    return checkpoint;
  }

  static async updateCheckpoint(
    id: string,
    updates: Partial<Pick<DBCheckpoint, "where_left_off" | "whats_important" | "whats_next" | "updated_at">>
  ): Promise<DBCheckpoint | null> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("checkpoints")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as DBCheckpoint;
    }
    return null;
  }
}
