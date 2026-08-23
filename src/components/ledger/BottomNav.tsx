import { Wallet, TrendingUp, Compass, Cpu, ArrowLeftRight } from "lucide-react";

export type TabId = "wallet" | "earn" | "discover" | "myledger";

const tabs: { id: TabId; label: string; icon: typeof Wallet }[] = [
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "earn", label: "Earn", icon: TrendingUp },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "myledger", label: "My Ledger", icon: Cpu },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
      <div className="relative grid grid-cols-5 items-center px-2 pb-5 pt-2">
        {tabs.slice(0, 2).map((t) => (
          <TabButton key={t.id} tab={t} active={active} onChange={onChange} />
        ))}
        <div className="flex justify-center">
          <button
            aria-label="Transfer"
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:opacity-90"
          >
            <ArrowLeftRight className="h-6 w-6" />
          </button>
        </div>
        {tabs.slice(2).map((t) => (
          <TabButton key={t.id} tab={t} active={active} onChange={onChange} />
        ))}
      </div>
    </nav>
  );
}

function TabButton({
  tab,
  active,
  onChange,
}: {
  tab: { id: TabId; label: string; icon: typeof Wallet };
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  const Icon = tab.icon;
  const isActive = active === tab.id;
  return (
    <button
      onClick={() => onChange(tab.id)}
      className={`flex flex-col items-center gap-1 py-1 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[11px] font-medium">{tab.label}</span>
    </button>
  );
}
