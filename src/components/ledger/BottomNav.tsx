import { Home, Repeat2, LineChart, CreditCard } from "lucide-react";

export type TabId = "home" | "swap" | "earn" | "card";

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "swap", label: "Swap", icon: Repeat2 },
  { id: "earn", label: "Earn", icon: LineChart },
  { id: "card", label: "Card", icon: CreditCard },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[max(14px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-4 flex w-[calc(100%-2rem)] max-w-[400px] items-center gap-1 rounded-[26px] p-1.5 backdrop-blur-2xl tabbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-[3px] rounded-[20px] py-2 transition-all duration-200 active:scale-[0.96] ${
                isActive
                  ? "bg-white/[0.09] text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/8%)]"
                  : "text-muted-foreground active:bg-white/[0.04]"
              }`}
            >
              <Icon className="h-[21px] w-[21px]" strokeWidth={isActive ? 2.1 : 1.7} />
              <span className={`text-[11px] tracking-tight ${isActive ? "text-foreground" : ""}`}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
