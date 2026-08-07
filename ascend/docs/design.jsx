import { useState } from "react";
import {
  Dumbbell,
  Sparkles,
  Moon,
  Wallet,
  BookOpen,
  Flame,
  Gem,
  Check,
  ChevronRight,
  HelpCircle,
  Home as HomeIcon,
  Calendar,
  User,
  Award,
} from "lucide-react";

// ---- Design tokens -------------------------------------------------
const C = {
  bgDeep: "#161320",
  bgSurface: "#201C2E",
  bgSurfaceAlt: "#2A2440",
  gold: "#E7B24C",
  violet: "#9A8CFF",
  teal: "#59D6C4",
  textPrimary: "#F6F3FB",
  textMuted: "#9C93B5",
  border: "rgba(255,255,255,0.08)",
};

const fontDisplay = { fontFamily: "'Space Grotesk', sans-serif" };
const fontBody = { fontFamily: "'Inter', sans-serif" };
const fontMono = { fontFamily: "'JetBrains Mono', monospace" };

const THEMES = [
  { key: "sport", label: "Sport", icon: Dumbbell, color: C.gold },
  { key: "confiance", label: "Confiance", icon: Sparkles, color: C.violet },
  { key: "sommeil", label: "Sommeil", icon: Moon, color: C.teal },
  { key: "finances", label: "Finances", icon: Wallet, color: C.gold },
  { key: "apprentissage", label: "Apprentissage", icon: BookOpen, color: C.violet },
];

// ---- Signature element: Level Ring ---------------------------------
function LevelRing({ size = 64, stroke = 6, percentage = 70, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  const gradId = `ring-grad-${size}`;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.violet} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: "drop-shadow(0 0 4px rgba(231,178,76,0.5))" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ ...fontDisplay, color: C.textPrimary }}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({ icon: Icon, value, color }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}` }}
    >
      <Icon size={14} color={color} />
      <span style={{ ...fontMono, color: C.textPrimary, fontSize: 12 }}>{value}</span>
    </div>
  );
}

// ---- Screen: Onboarding --------------------------------------------
function OnboardingScreen() {
  const [selected, setSelected] = useState(["sport", "confiance"]);
  const toggle = (key) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8" style={{ backgroundColor: C.bgDeep }}>
      <div style={{ ...fontMono, color: C.textMuted, fontSize: 11, letterSpacing: 1 }}>
        ÉTAPE 1 SUR 3
      </div>
      <h1 className="mt-2" style={{ ...fontDisplay, color: C.textPrimary, fontSize: 26, fontWeight: 600 }}>
        Choisis tes thèmes
      </h1>
      <p className="mt-1" style={{ ...fontBody, color: C.textMuted, fontSize: 13 }}>
        Tu pourras en changer à tout moment.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {THEMES.map((t) => {
          const isOn = selected.includes(t.key);
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => toggle(t.key)}
              className="relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left"
              style={{
                backgroundColor: isOn ? C.bgSurfaceAlt : C.bgSurface,
                border: `1.5px solid ${isOn ? t.color : C.border}`,
                boxShadow: isOn ? `0 0 16px ${t.color}33` : "none",
              }}
            >
              {isOn && (
                <div
                  className="absolute top-3 right-3 flex items-center justify-center rounded-full"
                  style={{ width: 18, height: 18, backgroundColor: t.color }}
                >
                  <Check size={12} color={C.bgDeep} strokeWidth={3} />
                </div>
              )}
              <Icon size={22} color={t.color} />
              <span style={{ ...fontBody, color: C.textPrimary, fontSize: 14, fontWeight: 500 }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <button
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(90deg, ${C.gold}, ${C.violet})`,
            ...fontBody,
            color: C.bgDeep,
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Continuer <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---- Screen: Home ----------------------------------------------------
function ChallengeCard({ theme, title, xp, done }) {
  const t = THEMES.find((x) => x.key === theme);
  const Icon = t.icon;
  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-2xl"
      style={{
        backgroundColor: C.bgSurface,
        border: `1px solid ${C.border}`,
        opacity: done ? 0.55 : 1,
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{ width: 40, height: 40, backgroundColor: `${t.color}22` }}
      >
        <Icon size={18} color={t.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            ...fontBody,
            color: C.textPrimary,
            fontSize: 13.5,
            fontWeight: 500,
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {title}
        </div>
        <div style={{ ...fontMono, color: C.gold, fontSize: 11, marginTop: 2 }}>+{xp} XP</div>
      </div>
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 26,
          height: 26,
          border: `1.5px solid ${done ? C.gold : C.border}`,
          backgroundColor: done ? C.gold : "transparent",
        }}
      >
        {done && <Check size={14} color={C.bgDeep} strokeWidth={3} />}
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: C.bgDeep }}>
      <div className="flex items-center justify-between px-6 pt-14">
        <div className="flex items-center gap-3">
          <LevelRing size={48} stroke={4} percentage={68}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>12</span>
          </LevelRing>
          <div>
            <div style={{ ...fontBody, color: C.textPrimary, fontSize: 14, fontWeight: 600 }}>
              Salut 👋
            </div>
            <div style={{ ...fontMono, color: C.textMuted, fontSize: 10.5 }}>740 / 900 XP</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Chip icon={Flame} value="14" color={C.gold} />
          <Chip icon={Gem} value="128" color={C.teal} />
        </div>
      </div>

      <div className="px-6 mt-8 flex-1 overflow-hidden">
        <div style={{ ...fontDisplay, color: C.textPrimary, fontSize: 17, fontWeight: 600 }}>
          Tes défis du jour
        </div>
        <div className="flex flex-col gap-2.5 mt-4">
          <ChallengeCard theme="sport" title="Faire 20 pompes" xp={30} done={false} />
          <ChallengeCard theme="confiance" title="Parler à un inconnu" xp={25} done={true} />
          <ChallengeCard theme="finances" title="Mettre 5€ de côté" xp={20} done={false} />
        </div>

        <div
          className="mt-4 p-4 rounded-2xl flex items-center gap-3"
          style={{
            backgroundColor: C.bgSurfaceAlt,
            border: `1.5px dashed ${C.violet}88`,
            boxShadow: `0 0 20px ${C.violet}22`,
          }}
        >
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 40, height: 40, backgroundColor: `${C.violet}22` }}
          >
            <HelpCircle size={20} color={C.violet} />
          </div>
          <div className="flex-1">
            <div style={{ ...fontBody, color: C.textPrimary, fontSize: 13.5, fontWeight: 600 }}>
              Défi mystère
            </div>
            <div style={{ ...fontBody, color: C.textMuted, fontSize: 11.5 }}>
              Récompense surprise à la clé
            </div>
          </div>
          <ChevronRight size={16} color={C.textMuted} />
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

// ---- Screen: Profil ---------------------------------------------------
function SkillRow({ theme, level, percentage }) {
  const t = THEMES.find((x) => x.key === theme);
  const Icon = t.icon;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Icon size={16} color={t.color} />
      <span style={{ ...fontBody, color: C.textPrimary, fontSize: 12.5, width: 96 }}>
        {t.label}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: t.color }}
        />
      </div>
      <span style={{ ...fontMono, color: C.textMuted, fontSize: 10.5, width: 28, textAlign: "right" }}>
        {level}
      </span>
    </div>
  );
}

function ProfileScreen() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const completed = [true, true, true, false, true, true, true];
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: C.bgDeep }}>
      <div className="flex flex-col items-center pt-14">
        <LevelRing size={92} stroke={7} percentage={68}>
          <div className="flex flex-col items-center">
            <span style={{ fontSize: 22, fontWeight: 700 }}>12</span>
            <span style={{ ...fontMono, fontSize: 8.5, color: C.textMuted }}>NIVEAU</span>
          </div>
        </LevelRing>
        <div className="mt-3 flex gap-2">
          <Chip icon={Flame} value="14 jours" color={C.gold} />
          <Chip icon={Award} value="9 badges" color={C.violet} />
        </div>
      </div>

      <div className="px-6 mt-8 flex-1 overflow-hidden">
        <div style={{ ...fontDisplay, color: C.textPrimary, fontSize: 15, fontWeight: 600 }}>
          Compétences
        </div>
        <div className="mt-1">
          <SkillRow theme="sport" level={8} percentage={80} />
          <SkillRow theme="confiance" level={5} percentage={50} />
          <SkillRow theme="sommeil" level={3} percentage={30} />
          <SkillRow theme="finances" level={6} percentage={60} />
          <SkillRow theme="apprentissage" level={2} percentage={20} />
        </div>

        <div className="mt-5" style={{ ...fontDisplay, color: C.textPrimary, fontSize: 15, fontWeight: 600 }}>
          Cette semaine
        </div>
        <div className="flex justify-between mt-3">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span style={{ ...fontMono, color: C.textMuted, fontSize: 9 }}>{d}</span>
              <div
                className="rounded-full"
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: completed[i] ? C.gold : "transparent",
                  border: `1.5px solid ${completed[i] ? C.gold : C.border}`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}

// ---- Bottom nav ---------------------------------------------------
function BottomNav({ active }) {
  const items = [
    { key: "home", icon: HomeIcon, label: "Accueil" },
    { key: "calendar", icon: Calendar, label: "Calendrier" },
    { key: "profile", icon: User, label: "Profil" },
  ];
  return (
    <div
      className="flex items-center justify-around py-4 px-6"
      style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.bgDeep }}
    >
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = it.key === active;
        return (
          <div key={it.key} className="flex flex-col items-center gap-1">
            <Icon size={19} color={isActive ? C.gold : C.textMuted} />
            <span
              style={{
                ...fontMono,
                fontSize: 9,
                color: isActive ? C.gold : C.textMuted,
              }}
            >
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---- Phone frame + screen switcher --------------------------------
export default function AscendDesign() {
  const [screen, setScreen] = useState("home");
  const screens = {
    onboarding: <OnboardingScreen />,
    home: <HomeScreen />,
    profile: <ProfileScreen />,
  };
  const tabs = [
    { key: "onboarding", label: "Onboarding" },
    { key: "home", label: "Accueil" },
    { key: "profile", label: "Profil" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 gap-6" style={{ backgroundColor: "#0D0B14" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
      `}</style>

      <div className="flex gap-1 p-1 rounded-full" style={{ backgroundColor: C.bgSurface, border: `1px solid ${C.border}` }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setScreen(t.key)}
            className="px-4 py-1.5 rounded-full"
            style={{
              ...fontBody,
              fontSize: 12.5,
              fontWeight: 500,
              color: screen === t.key ? C.bgDeep : C.textMuted,
              backgroundColor: screen === t.key ? C.gold : "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          width: 360,
          height: 760,
          borderRadius: 44,
          border: "10px solid #0A0812",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full z-10"
          style={{ width: 90, height: 22, backgroundColor: "#0A0812" }}
        />
        {screens[screen]}
      </div>
    </div>
  );
}
