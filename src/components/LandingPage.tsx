import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Command,
  CornerDownLeft,
  RotateCcw,
  Layers,
  BookmarkCheck,
  Brain,
  Timer,
  Play,
} from "lucide-react";

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onTryGuestDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onTryGuestDemo,
}) => {
  // Interactive Simulator State for users to test the concept immediately
  const [simulatorStep, setSimulatorStep] = useState<number>(0);
  const sampleScenarios = [
    {
      title: "Fullstack Auth Refactoring",
      color: "#6366f1",
      where: "Selesai bikin middleware JWT verify di server/auth.ts line 64, tapi token expire time belum dites.",
      why: "Mencegah session hijacking dan memastikan token refresh berjalan otomatis saat request 401.",
      next: "Jalankan npm test untuk auth endpoint, lalu periksa respon cookie refreshToken di Postman.",
      time: "Kemarin, 17:45",
    },
    {
      title: "Checkout Payment Flow",
      color: "#10b981",
      where: "Webhook Stripe sudah menerima event invoice.paid, tinggal simpan order_id ke database.",
      why: "Agar pelanggan langsung mendapatkan email invoice otomatis tanpa delay manual.",
      next: "Buka file src/services/stripe.ts baris 88 dan pasang fungsi updateOrderStatus('paid').",
      time: "2 jam yang lalu",
    },
    {
      title: "UI Design System Migration",
      color: "#f59e0b",
      where: "Tombol CTA di Landing Page sudah ganti warna Zinc, modal dialog belum disesuaikan.",
      why: "Standardisasi design token agar konsisten di semua viewport tablet & mobile.",
      next: "Buka components/Modal.tsx dan ganti border-gray-200 menjadi border-zinc-200/80.",
      time: "30 menit yang lalu",
    },
  ];

  const currentScenario = sampleScenarios[simulatorStep];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col font-sans">
      {/* 1. STICKY NAVBAR */}
      <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo/trace.png"
              alt="TRACE Logo"
              className="w-9 h-9 rounded-xl object-contain shadow-xs"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("landing-nav-logo-fallback");
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              id="landing-nav-logo-fallback"
              style={{ display: "none" }}
              className="w-9 h-9 rounded-xl bg-zinc-900 text-white items-center justify-center font-bold tracking-wider shadow-sm"
            >
              <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-zinc-900 text-lg tracking-wider">
                TRACE
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] text-zinc-500 font-normal">
                Find your way back.
              </span>
            </div>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#how-it-works"
              className="hidden md:inline-block text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors px-2 py-1"
            >
              How It Works
            </a>
            <a
              href="#the-framework"
              className="hidden md:inline-block text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors px-2 py-1"
            >
              The 3 Questions
            </a>
            <a
              href="#benefits"
              className="hidden md:inline-block text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors px-2 py-1"
            >
              Why TRACE
            </a>

            <div className="h-4 w-px bg-zinc-200 hidden md:block" />

            {/* Sign In Button */}
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              Masuk
            </button>

            {/* Get Started Button */}
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-all shadow-xs cursor-pointer group"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 overflow-hidden">
        {/* Subtle Background Radial Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Context Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200/90 rounded-full shadow-2xs mb-6 text-xs text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-zinc-800">
              Context Preservation Tool untuk Developer & Knowledge Worker
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] mb-6">
            Berhenti membuang 20 menit hanya untuk mengingat{" "}
            <span className="relative inline-block text-zinc-900 underline decoration-emerald-500 decoration-wavy decoration-2 underline-offset-8">
              "Tadi saya sampai mana?"
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-8">
            TRACE adalah alat pencatat titik kerja minimalis. Tinggalkan proyek Anda kapan saja
            tanpa cemas. Catat checkpoint dalam 30 detik, dan lanjutkan pekerjaan esok hari seolah
            Anda tidak pernah berhenti.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-10">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>Mulai Sekarang — Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onTryGuestDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-zinc-800 border border-zinc-200/90 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl text-sm font-medium transition-all shadow-2xs cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Coba Demo Langsung</span>
            </button>
          </div>

          {/* Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tanpa kartu kredit</span>
            </div>
            <span className="hidden sm:inline text-zinc-300">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Keyboard-first (<kbd className="font-mono bg-zinc-100 px-1 border border-zinc-200 rounded text-[10px]">C</kbd> / <kbd className="font-mono bg-zinc-100 px-1 border border-zinc-200 rounded text-[10px]">N</kbd>)</span>
            </div>
            <span className="hidden sm:inline text-zinc-300">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data aman terisolasi</span>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE SIMULATOR (SHOW, DON'T JUST TELL) */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-16">
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl overflow-hidden">
            {/* Window bar */}
            <div className="bg-zinc-50 border-b border-zinc-200/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-xs font-mono text-zinc-400 hidden sm:inline">
                  trace-resume-hero-card.tsx
                </span>
              </div>

              {/* Scenario switcher tabs */}
              <div className="flex items-center gap-1 bg-zinc-200/70 p-1 rounded-lg">
                {sampleScenarios.map((s, idx) => (
                  <button
                    key={s.title}
                    onClick={() => setSimulatorStep(idx)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                      simulatorStep === idx
                        ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Scenario {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Card Simulator Body */}
            <div className="p-6 sm:p-8 bg-linear-to-b from-white to-zinc-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shadow-2xs"
                    style={{ backgroundColor: currentScenario.color }}
                  />
                  <h3 className="text-lg font-bold text-zinc-950">
                    {currentScenario.title}
                  </h3>
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Active Context
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Disimpan {currentScenario.time}</span>
                </div>
              </div>

              {/* The 3 Golden Fields Visualized */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                {/* 1. WHERE */}
                <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    <span>1. Di mana berhenti?</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-zinc-800 leading-relaxed">
                    {currentScenario.where}
                  </p>
                </div>

                {/* 2. WHY */}
                <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    <Brain className="w-4 h-4 text-amber-500" />
                    <span>2. Mengapa penting?</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-zinc-800 leading-relaxed">
                    {currentScenario.why}
                  </p>
                </div>

                {/* 3. NEXT */}
                <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-2xs ring-1 ring-emerald-500/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span>3. Apa langkah pertama?</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
                    {currentScenario.next}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Action of the Card */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Begitu buka aplikasi, Anda langsung tahu persis apa yang harus dieksekusi.</span>
                </span>
                <button
                  onClick={onOpenRegister}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>Coba buat checkpoint Anda sendiri</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 23-MINUTE PROBLEM VS TRACE */}
      <section id="benefits" className="py-16 sm:py-24 bg-white border-y border-zinc-200/80 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              The Context Switching Cost
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Mengapa kembali bekerja sering terasa begitu melelahkan?
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
              Penelitian Dr. Gloria Mark (University of California, Irvine) menemukan bahwa rata-rata
              orang membutuhkan <strong>23 menit dan 15 detik</strong> untuk memulihkan fokus penuh setelah terdistraksi.
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Painful Way */}
            <div className="bg-rose-50/40 border border-rose-200/70 rounded-2xl p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 text-rose-700 font-bold text-sm mb-4">
                <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">✕</span>
                <span>Cara Lama (Tanpa Checkpoint)</span>
              </div>
              <ul className="space-y-4 text-sm text-zinc-700">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>Membuka 18 tab browser dan scroll riwayat commit untuk mencari tahu file terakhir yang disentuh.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>Lupa alasan teknis di balik keputusan kode kemarin ("Kenapa baris ini saya komentari ya?").</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>Mengalami <em>mental friction</em> & menunda mulai kerja (prokrastinasi) karena bingung langkah pertamanya.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>Todo list biasa hanya bertuliskan "Refactor auth" tanpa konteks status memori kerja terkini.</span>
                </li>
              </ul>
            </div>

            {/* The TRACE Way */}
            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 relative">
              <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-sm mb-4">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                <span>Dengan TRACE (Preserved Context)</span>
              </div>
              <ul className="space-y-4 text-sm text-zinc-800">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>Cukup tekan shortcut <kbd className="font-mono bg-white px-1.5 py-0.5 border border-zinc-200 rounded text-xs text-zinc-800">C</kbd> dalam 20 detik sebelum istirahat / meeting.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>Keesokan harinya, Resume Card langsung menyorot konteks persis di layar pertama.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>Langkah eksekusi pertama ("What's Next") sudah dirumuskan jelas tanpa perlu berpikir ulang.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>Memulihkan <em>Flow State</em> dalam hitungan 15 detik, bukan 20 menit.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE 3 GOLDEN QUESTIONS FRAMEWORK */}
      <section id="the-framework" className="py-16 sm:py-24 px-4 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              The Architecture
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              3 Pertanyaan Emas Pembentuk Checkpoint
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
              Bukan sekadar mencatat tugas selesai, TRACE memetakan memori kerja Anda ke dalam 3 dimensi kognitif:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. WHERE */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-zinc-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-zinc-400">FAKTA SPASIAL</span>
              <h4 className="text-base font-bold text-zinc-900 mt-1 mb-2">
                Where did I leave off?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Di file atau baris kode mana Anda berhenti? Branch apa yang sedang aktif? Fungsi apa yang baru saja Anda ubah sebelum laptop ditutup?
              </p>
            </div>

            {/* 2. WHY */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-zinc-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-5">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-zinc-400">KONTEKS LOGIKA</span>
              <h4 className="text-base font-bold text-zinc-900 mt-1 mb-2">
                Why does this matter?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Keputusan apa yang baru saja Anda ambil? Error atau edge case apa yang ingin dihindari sehingga pendekatan tersebut dipilih?
              </p>
            </div>

            {/* 3. WHAT'S NEXT */}
            <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-2xs ring-1 ring-emerald-500/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600">TRIGGER AKSI</span>
              <h4 className="text-base font-bold text-zinc-900 mt-1 mb-2">
                What's the immediate next step?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Perintah konkret pertama yang harus dijalankan begitu membuka laptop: "Jalankan docker-compose up lalu tes endpoint login di browser".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. KEY FEATURES */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-t border-zinc-200/80 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Engineering Quality
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Dirancang untuk Kecepatan & Pengalaman Pengguna
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl border border-zinc-200/70 bg-zinc-50/50">
              <Command className="w-5 h-5 text-zinc-800 mb-3" />
              <h4 className="font-bold text-zinc-900 text-sm mb-1.5">
                Keyboard-First Navigation
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Tekan <kbd className="font-mono bg-white px-1.5 py-0.5 border border-zinc-200 rounded text-[10px]">C</kbd> untuk Checkpoint, <kbd className="font-mono bg-white px-1.5 py-0.5 border border-zinc-200 rounded text-[10px]">N</kbd> untuk New Activity, dan <kbd className="font-mono bg-white px-1.5 py-0.5 border border-zinc-200 rounded text-[10px]">?</kbd> untuk cheat sheet shortcut.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200/70 bg-zinc-50/50">
              <Layers className="w-5 h-5 text-zinc-800 mb-3" />
              <h4 className="font-bold text-zinc-900 text-sm mb-1.5">
                Project & Activity Timeline
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Lihat evolusi checkpoint secara kronologis mundur. Lacak bagaimana ide berkembang dari waktu ke waktu tanpa ada yang hilang.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200/70 bg-zinc-50/50">
              <ShieldCheck className="w-5 h-5 text-zinc-800 mb-3" />
              <h4 className="font-bold text-zinc-900 text-sm mb-1.5">
                Data Isolation Terjamin
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Setiap data tersimpan terpisah dan aman per user. Siap dihubungkan ke database PostgreSQL/Cloud backend kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="py-16 sm:py-20 px-4 bg-zinc-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Kembalikan fokus kerja Anda dalam 15 detik.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Mulai gunakan TRACE hari ini untuk mengakhiri kebingungan saat kembali bekerja. Gratis dan tanpa setup yang rumit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-950 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all shadow-md cursor-pointer"
            >
              Buat Akun Gratis Sekarang
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl text-sm font-medium transition-all cursor-pointer"
            >
              Masuk ke Akun Anda
            </button>
          </div>
        </div>
      </section>

      {/* 8. MINIMAL FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-8 px-4 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">TRACE</span>
            <span>—</span>
            <span>Find your way back. Context preservation made simple.</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="hover:text-zinc-900 transition-colors cursor-pointer">
              Sign In
            </button>
            <span>·</span>
            <button onClick={onOpenRegister} className="hover:text-zinc-900 transition-colors cursor-pointer">
              Register
            </button>
            <span>·</span>
            <button onClick={onTryGuestDemo} className="hover:text-zinc-900 transition-colors cursor-pointer">
              Demo Mode
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};