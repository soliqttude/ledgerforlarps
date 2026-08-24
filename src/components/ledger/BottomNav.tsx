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
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-5">
      <div className="pointer-events-auto mx-4 flex w-full max-w-[420px] items-center justify-between rounded-full bg-card/95 p-1.5 backdrop-blur-xl">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2.5 transition-colors ${
                isActive ? "bg-secondary text-foreground" : "text-foreground/85 active:bg-secondary/60"
              }`}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
              <span className="text-[12px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
