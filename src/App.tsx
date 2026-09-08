import React, { useEffect, useState } from "react";
import { Activity, Checkpoint, ResumeData, User } from "./types";
import { api, authStorage } from "./api";
import { Navbar } from "./components/Navbar";
import { ResumeCard } from "./components/ResumeCard";
import { ActivityCard } from "./components/ActivityCard";
import { CheckpointModal } from "./components/CheckpointModal";
import { NewActivityModal } from "./components/NewActivityModal";
import { ActivityDetailView } from "./components/ActivityDetailView";
import { AuthView } from "./components/AuthView";
import { Plus, Compass, Layers, Sparkles } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // App Navigation View
  const [currentView, setCurrentView] = useState<"dashboard" | "activity_detail">(
    "dashboard"
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Data States
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modal States
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [targetActivityIdForCheckpoint, setTargetActivityIdForCheckpoint] =
    useState<string | null>(null);
  const [editingCheckpoint, setEditingCheckpoint] = useState<Checkpoint | null>(null);

  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);

  // 1. Initial Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const token = authStorage.getToken();
      if (!token) {
        setAuthChecking(false);
        return;
      }
      try {
        const res = await api.getMe();
        setCurrentUser(res.user);
      } catch {
        authStorage.clearAuth();
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // 2. Fetch Core Data when logged in
  const refreshData = async () => {
    if (!currentUser) return;
    try {
      setLoadingData(true);
      const [resResume, resActivities] = await Promise.all([
        api.getResume(),
        api.getActivities(),
      ]);
      setResumeData(resResume.resume);
      setActivities(resActivities.activities);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  // Auth Handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    setCurrentUser(null);
    setResumeData(null);
    setActivities([]);
    setCurrentView("dashboard");
  };

  // Checkpoint Modal Handlers
  const handleOpenCheckpointModal = (
    activityId: string,
    checkpointToEdit?: Checkpoint
  ) => {
    setTargetActivityIdForCheckpoint(activityId);
    setEditingCheckpoint(checkpointToEdit || null);
    setIsCheckpointModalOpen(true);
  };

  const handleSaveCheckpoint = async (data: {
    where_left_off: string;
    whats_important?: string;
    whats_next: string;
  }) => {
    if (!targetActivityIdForCheckpoint) return;

    if (editingCheckpoint) {
      // Edit existing
      await api.editCheckpoint(editingCheckpoint.id, data);
    } else {
      // Create new
      await api.createCheckpoint(targetActivityIdForCheckpoint, data);
    }

    await refreshData();
  };

  // Activity Handlers
  const handleCreateActivity = async (data: {
    title: string;
    description?: string;
    color: string;
    initial_where?: string;
    initial_important?: string;
    initial_next?: string;
  }) => {
    await api.createActivity(data);
    await refreshData();
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await api.deleteActivity(activityId);
      if (selectedActivityId === activityId) {
        setCurrentView("dashboard");
        setSelectedActivityId(null);
      }
      await refreshData();
    } catch (err: any) {
      alert(err.message || "Failed to delete activity");
    }
  };

  const handleViewActivityDetail = (activityId: string) => {
    setSelectedActivityId(activityId);
    setCurrentView("activity_detail");
  };

  // Loading state during auth initialization
  if (authChecking) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-500 text-sm flex items-center gap-2">
          <Compass className="w-5 h-5 animate-spin text-zinc-900" />
          <span>Starting TRACE...</span>
        </div>
      </div>
    );
  }

  // If not logged in, render the clean Auth screen
  if (!currentUser) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  // Get active activity object for the checkpoint modal
  const targetActivity =
    activities.find((a) => a.id === targetActivityIdForCheckpoint) ||
    (resumeData?.activity.id === targetActivityIdForCheckpoint
      ? resumeData.activity
      : null);

  // Dynamic greeting based on hour of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white pb-20">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onNavigateHome={() => {
          setCurrentView("dashboard");
          setSelectedActivityId(null);
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {currentView === "dashboard" ? (
          <div className="space-y-10">
            {/* Friendly Context Greeting */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  {getGreeting()}, {currentUser.name.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Here is where you left off. Ready to resume without the mental friction?
                </p>
              </div>

              <button
                onClick={() => setIsNewActivityModalOpen(true)}
                className="inline-flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium px-4 py-2.5 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>New Activity</span>
              </button>
            </div>

            {/* 1. HERO COMPONENT: CONTINUE WHERE YOU LEFT OFF */}
            <section aria-label="Resume Last Activity">
              <ResumeCard
                resumeData={resumeData}
                onOpenCheckpointModal={(id) => handleOpenCheckpointModal(id)}
                onViewActivityDetail={handleViewActivityDetail}
                onOpenCreateActivity={() => setIsNewActivityModalOpen(true)}
              />
            </section>

            {/* 2. RECENT ACTIVITIES LIST */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    All Activities ({activities.length})
                  </h2>
                </div>
                <span className="text-xs text-zinc-500">
                  Sorted by most recently active
                </span>
              </div>

              {activities.length === 0 ? (
                <div className="py-12 text-center bg-white border border-dashed border-zinc-200 rounded-2xl p-6">
                  <p className="text-sm text-zinc-500 mb-3">
                    You don't have any activities created yet.
                  </p>
                  <button
                    onClick={() => setIsNewActivityModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create an activity to get started</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onOpenCheckpointModal={(id) => handleOpenCheckpointModal(id)}
                      onViewActivityDetail={handleViewActivityDetail}
                      onDeleteActivity={handleDeleteActivity}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Activity Detail View (History Timeline) */
          selectedActivityId && (
            <ActivityDetailView
              activityId={selectedActivityId}
              onBack={() => {
                setCurrentView("dashboard");
                setSelectedActivityId(null);
                refreshData();
              }}
              onOpenCheckpointModal={(actId, chk) =>
                handleOpenCheckpointModal(actId, chk)
              }
            />
          )
        )}
      </main>

      {/* Checkpoint Drop / Edit Modal */}
      <CheckpointModal
        isOpen={isCheckpointModalOpen}
        onClose={() => {
          setIsCheckpointModalOpen(false);
          setTargetActivityIdForCheckpoint(null);
          setEditingCheckpoint(null);
        }}
        activity={targetActivity}
        editingCheckpoint={editingCheckpoint}
        onSave={handleSaveCheckpoint}
      />

      {/* New Activity Modal */}
      <NewActivityModal
        isOpen={isNewActivityModalOpen}
        onClose={() => setIsNewActivityModalOpen(false)}
        onCreate={handleCreateActivity}
      />
    </div>
  );
}
