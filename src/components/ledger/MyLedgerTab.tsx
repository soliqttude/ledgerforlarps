import { BatteryFull, Bluetooth, ChevronRight, ShieldCheck, Smartphone, RefreshCw, HelpCircle } from "lucide-react";

const installed = [
  { name: "Bitcoin", version: "2.2.2", color: "#F7931A" },
  { name: "Ethereum", version: "1.10.4", color: "#627EEA" },
  { name: "Solana", version: "1.3.1", color: "#14F195" },
];

const rows = [
  { label: "Security checkup", icon: ShieldCheck },
  { label: "Device settings", icon: Smartphone },
  { label: "Firmware update", icon: RefreshCw },
  { label: "Help & support", icon: HelpCircle },
];

export function MyLedgerTab() {
  return (
    <div className="px-5 pb-4 pt-6">
      <h1 className="text-[28px] font-semibold tracking-tight">My Ledger</h1>

      <div className="mt-5 rounded-3xl bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-10 rounded-md bg-gradient-to-b from-neutral-700 to-neutral-900 ring-1 ring-white/10" />
          <div className="flex-1">
            <p className="text-[17px] font-semibold">Ledger Nano X</p>
            <p className="text-[13px] text-muted-foreground">Firmware 2.2.3 · Up to date</p>
            <div className="mt-2 flex items-center gap-3 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1"><Bluetooth className="h-3.5 w-3.5" /> Connected</span>
              <span className="flex items-center gap-1"><BatteryFull className="h-3.5 w-3.5" /> 82%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-secondary py-3">
            <p className="text-[17px] font-semibold">3</p>
            <p className="text-[11px] text-muted-foreground">Apps</p>
          </div>
          <div className="rounded-2xl bg-secondary py-3">
            <p className="text-[17px] font-semibold">1.2 MB</p>
            <p className="text-[11px] text-muted-foreground">Used</p>
          </div>
          <div className="rounded-2xl bg-secondary py-3">
            <p className="text-[17px] font-semibold">6</p>
            <p className="text-[11px] text-muted-foreground">Accounts</p>
          </div>
        </div>
      </div>

      <h2 className="mt-7 text-[17px] font-semibold">Apps installed</h2>
      <div className="mt-2 space-y-2">
        {installed.map((a) => (
          <div key={a.name} className="flex items-center gap-3 rounded-2xl bg-card p-4">
            <div className="h-9 w-9 rounded-full" style={{ backgroundColor: a.color }} />
            <div className="flex-1">
              <p className="text-[15px] font-medium">{a.name}</p>
              <p className="text-[13px] text-muted-foreground">Version {a.version}</p>
            </div>
            <button className="rounded-full border border-border px-3 py-1.5 text-[13px]">Uninstall</button>
          </div>
        ))}
      </div>

      <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl bg-card">
        {rows.map(({ label, icon: Icon }) => (
          <button key={label} className="flex w-full items-center gap-3 p-4 text-left active:bg-accent">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-[15px]">{label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
