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
import { MobileBottomNav, MobileTab } from "./components/MobileBottomNav";
import { ProfileModal } from "./components/ProfileModal";
import { ActivitySelectModal } from "./components/ActivitySelectModal";
import { DashboardSkeleton } from "./components/SkeletonLoaders";
import { ToastContainer, ToastData, ToastType } from "./components/Toast";
import { Plus, Compass, Layers, Sparkles, AlertTriangle, RefreshCw } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // App Navigation View
  const [currentView, setCurrentView] = useState<"dashboard" | "activity_detail">(
    "dashboard"
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Mobile Navigation Tab (Home vs Activities vs Profile)
  const [mobileTab, setMobileTab] = useState<MobileTab>("home");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isActivitySelectModalOpen, setIsActivitySelectModalOpen] = useState(false);

  // Data States
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

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
      setDashboardError(null);
      const [resResume, resActivities] = await Promise.all([
        api.getResume(),
        api.getActivities(),
      ]);
      setResumeData(resResume.resume);
      setActivities(resActivities.activities);
    } catch (err: any) {
      console.error("Failed to load dashboard data", err);
      const errMsg =
        err?.message || "Unable to reach database. Please check your connection.";
      setDashboardError(errMsg);
      showToast(errMsg, "error");
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
    showToast(`Welcome back, ${(user.name || "friend").split(" ")[0]}!`, "success");
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    setCurrentUser(null);
    setResumeData(null);
    setActivities([]);
    setCurrentView("dashboard");
    showToast("Signed out successfully.", "info");
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

    try {
      if (editingCheckpoint) {
        // Edit existing
        await api.editCheckpoint(editingCheckpoint.id, data);
        showToast("Checkpoint updated successfully! ✏️", "success");
      } else {
        // Create new
        await api.createCheckpoint(targetActivityIdForCheckpoint, data);
        showToast("Checkpoint dropped! Ready whenever you return. 🎯", "success");
      }

      await refreshData();
    } catch (err: any) {
      const msg = err.message || "Failed to save checkpoint";
      showToast(msg, "error");
      throw err; // Lempar agar modal tahu terjadi error
    }
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
    try {
      await api.createActivity(data);
      showToast(`Created activity "${data.title}" 🚀`, "success");
      await refreshData();
    } catch (err: any) {
      const msg = err.message || "Failed to create activity";
      showToast(msg, "error");
      throw err;
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await api.deleteActivity(activityId);
      if (selectedActivityId === activityId) {
        setCurrentView("dashboard");
        setSelectedActivityId(null);
      }
      showToast("Activity deleted.", "info");
      await refreshData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete activity", "error");
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

  // Quick Add handler from Mobile Bottom Nav (+)
  const handleQuickAddCheckpoint = () => {
    // If currently looking at an activity detail, drop checkpoint for that activity directly
    if (currentView === "activity_detail" && selectedActivityId) {
      handleOpenCheckpointModal(selectedActivityId);
      return;
    }

    // If no activities exist yet, open new activity modal first
    if (activities.length === 0) {
      setIsNewActivityModalOpen(true);
      return;
    }

    // If only 1 activity exists, open checkpoint modal directly for it
    if (activities.length === 1) {
      handleOpenCheckpointModal(activities[0].id);
      return;
    }

    // If multiple activities exist, open the quick picker sheet
    setIsActivitySelectModalOpen(true);
  };

  // Mobile Bottom Navigation Tab switcher
  const handleTabChange = (tab: MobileTab) => {
    if (tab === "profile") {
      setIsProfileModalOpen(true);
      return;
    }

    setMobileTab(tab);
    // If navigating to home or activities from detail view, return to dashboard
    if (currentView === "activity_detail") {
      setCurrentView("dashboard");
      setSelectedActivityId(null);
    }
  };

  // Dynamic greeting based on hour of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white pb-28 md:pb-16">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onNavigateHome={() => {
          setCurrentView("dashboard");
          setSelectedActivityId(null);
          setMobileTab("home");
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {dashboardError && activities.length === 0 ? (
          <div className="py-16 px-6 text-center bg-white rounded-2xl border border-rose-200/80 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900">
                Connection Issue
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                {dashboardError}
              </p>
            </div>
            <button
              onClick={() => refreshData()}
              disabled={loadingData}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-xs transition-all disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} />
              <span>{loadingData ? "Reconnecting..." : "Try Reconnecting"}</span>
            </button>
          </div>
        ) : loadingData && activities.length === 0 ? (
          <DashboardSkeleton />
        ) : currentView === "dashboard" ? (
          <div className="space-y-8 sm:space-y-10">
            {/* Friendly Context Greeting */}
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  {getGreeting()},{" "}
                  {(currentUser.name || "friend").split(" ")[0]} 👋
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Here is where you left off. Ready to resume without the mental friction?
                </p>
              </div>

              {/* Desktop New Activity Button */}
              <button
                onClick={() => setIsNewActivityModalOpen(true)}
                className="hidden md:inline-flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium px-4 py-2.5 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>New Activity</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* 1. HERO COMPONENT: CONTINUE WHERE YOU LEFT OFF (Home Tab on Mobile / Always visible on Desktop) */}
            {/* ========================================================================= */}
            <section
              aria-label="Resume Last Activity"
              className={`${mobileTab === "home" ? "block" : "hidden md:block"}`}
            >
              <ResumeCard
                resumeData={resumeData}
                onOpenCheckpointModal={(id) => handleOpenCheckpointModal(id)}
                onViewActivityDetail={handleViewActivityDetail}
                onOpenCreateActivity={() => setIsNewActivityModalOpen(true)}
              />
            </section>

            {/* ========================================================================= */}
            {/* 2. ALL ACTIVITIES LIST (Activities Tab on Mobile / Always visible on Desktop) */}
            {/* ========================================================================= */}
            <section
              className={`space-y-4 ${
                mobileTab === "activities" ? "block" : "hidden md:block"
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    All Activities ({activities.length})
                  </h2>
                </div>
                
                {/* Mobile 'New Activity' trigger on Activities tab */}
                <button
                  onClick={() => setIsNewActivityModalOpen(true)}
                  className="md:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>

                <span className="hidden md:inline text-xs text-zinc-500">
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

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <MobileBottomNav
        activeTab={mobileTab}
        onChangeTab={handleTabChange}
        onOpenAddCheckpoint={handleQuickAddCheckpoint}
        hasActivities={activities.length > 0}
      />

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

      {/* Quick Activity Selector Modal (Triggered by Mobile '+' button) */}
      <ActivitySelectModal
        isOpen={isActivitySelectModalOpen}
        onClose={() => setIsActivitySelectModalOpen(false)}
        activities={activities}
        onSelectActivity={(act) => handleOpenCheckpointModal(act.id)}
        onCreateNewActivity={() => setIsNewActivityModalOpen(true)}
      />

      {/* Profile Modal (Triggered by Mobile Bottom Nav Profile tab) */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onSignOut={handleLogout}
        activitiesCount={activities.length}
      />

      {/* Floating Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
