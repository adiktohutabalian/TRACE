export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  // Computed fields from relational queries:
  latest_checkpoint?: Checkpoint | null;
  checkpoint_count?: number;
}

export interface Checkpoint {
  id: string;
  activity_id: string;
  where_left_off: string;
  whats_important?: string | null;
  whats_next: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeData {
  activity: Activity;
  checkpoint: Checkpoint;
}

export interface AuthResponse {
  user: User;
  token: string;
}
