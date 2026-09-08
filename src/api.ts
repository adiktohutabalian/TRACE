import { Activity, AuthResponse, Checkpoint, ResumeData, User } from "./types";

const TOKEN_KEY = "context_switch_token";
const USER_KEY = "context_switch_user";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setAuth: (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "An unexpected error occurred");
  }

  return data as T;
}

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    authStorage.setAuth(res);
    return res;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    authStorage.setAuth(res);
    return res;
  },

  getMe: async (): Promise<{ user: User }> => {
    return request<{ user: User }>("/api/auth/me");
  },

  // Dashboard Resume (The core "Where did I leave off?")
  getResume: async (): Promise<{ resume: ResumeData | null }> => {
    return request<{ resume: ResumeData | null }>("/api/dashboard/resume");
  },

  // Activities
  getActivities: async (): Promise<{ activities: Activity[] }> => {
    return request<{ activities: Activity[] }>("/api/activities");
  },

  createActivity: async (data: {
    title: string;
    description?: string;
    color?: string;
    initial_where?: string;
    initial_important?: string;
    initial_next?: string;
  }): Promise<{ activity: Activity }> => {
    return request<{ activity: Activity }>("/api/activities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteActivity: async (id: string): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/api/activities/${id}`, {
      method: "DELETE",
    });
  },

  // Checkpoints
  getActivityCheckpoints: async (
    activityId: string
  ): Promise<{ activity: Activity; checkpoints: Checkpoint[] }> => {
    return request<{ activity: Activity; checkpoints: Checkpoint[] }>(
      `/api/activities/${activityId}/checkpoints`
    );
  },

  createCheckpoint: async (
    activityId: string,
    data: {
      where_left_off: string;
      whats_important?: string;
      whats_next: string;
    }
  ): Promise<{ checkpoint: Checkpoint }> => {
    return request<{ checkpoint: Checkpoint }>(`/api/activities/${activityId}/checkpoints`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  editCheckpoint: async (
    checkpointId: string,
    data: {
      where_left_off?: string;
      whats_important?: string | null;
      whats_next?: string;
    }
  ): Promise<{ checkpoint: Checkpoint }> => {
    return request<{ checkpoint: Checkpoint }>(`/api/checkpoints/${checkpointId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
