import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { ArrowDownToLine, ArrowUpRight, ArrowLeftRight, CreditCard, Settings, Bell, Scan, ChevronRight } from "lucide-react";
import { assets, chartData, fmt, ranges, totalBalance } from "./data";
import { AssetRow } from "./AssetRow";

const actions = [
  { label: "Buy", icon: CreditCard },
  { label: "Send", icon: ArrowUpRight },
  { label: "Receive", icon: ArrowDownToLine },
  { label: "Swap", icon: ArrowLeftRight },
];

export function WalletTab() {
  const [range, setRange] = useState("1M");
  const change = 4.28;

  return (
    <div className="pb-4">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
            TS
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Wallet</p>
            <p className="text-sm font-medium">Ledger Nano X</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button aria-label="Scan" className="rounded-full p-2 active:bg-accent"><Scan className="h-5 w-5" /></button>
          <button aria-label="Notifications" className="rounded-full p-2 active:bg-accent"><Bell className="h-5 w-5" /></button>
          <button aria-label="Settings" className="rounded-full p-2 active:bg-accent"><Settings className="h-5 w-5" /></button>
        </div>
      </header>

      <section className="px-5 pt-4">
        <p className="text-[13px] text-muted-foreground">Total balance</p>
        <h1 className="mt-1 text-[38px] font-semibold leading-tight tracking-tight">{fmt(totalBalance)}</h1>
        <p className="mt-1 text-sm">
          <span className="rounded-md bg-success/15 px-1.5 py-0.5 font-medium text-success">+{change}%</span>
          <span className="ml-2 text-muted-foreground">{fmt(totalBalance * (change / 100))} today</span>
        </p>
      </section>

      <div className="mt-4 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="ledgerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 2000", "dataMax + 2000"]} />
            <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#ledgerFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex justify-center gap-1 px-5">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
              range === r ? "bg-secondary text-foreground" : "text-muted-foreground"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 px-5">
        {actions.map(({ label, icon: Icon }) => (
          <button key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-card py-3 active:bg-accent">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-[12px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      <section className="mt-6 px-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[17px] font-semibold">Assets</h2>
          <button className="flex items-center text-[13px] text-muted-foreground">
            See all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1">
          {assets.map((a) => (
            <AssetRow key={a.id} asset={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
