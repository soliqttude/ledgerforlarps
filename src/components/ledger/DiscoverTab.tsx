import { Search, Compass, ChevronRight } from "lucide-react";

const apps = [
  { name: "Buy crypto", desc: "MoonPay, Ramp, Coinify", tint: "#7B61FF" },
  { name: "Swap", desc: "1inch, Paraswap, Changelly", tint: "#14B8A6" },
  { name: "Earn", desc: "Kiln, Lido staking", tint: "#F59E0B" },
  { name: "NFT", desc: "Browse your collectibles", tint: "#EC4899" },
  { name: "Lend", desc: "Aave, Compound", tint: "#3B82F6" },
  { name: "Web3 news", desc: "Curated by Ledger", tint: "#EF4444" },
];

export function DiscoverTab() {
  return (
    <div className="px-5 pb-4 pt-6">
      <h1 className="text-[28px] font-semibold tracking-tight">Discover</h1>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-card px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search apps and services"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground">
        <Compass className="h-6 w-6" />
        <p className="mt-3 text-[20px] font-semibold leading-snug">Explore the Web3 ecosystem</p>
        <p className="mt-1 text-[13px] opacity-80">Access 50+ trusted apps, all secured by your device.</p>
      </div>

      <h2 className="mt-7 text-[17px] font-semibold">Popular</h2>
      <div className="mt-2 space-y-2">
        {apps.map((a) => (
          <button key={a.name} className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left active:bg-accent">
            <div className="h-10 w-10 rounded-2xl" style={{ backgroundColor: a.tint }} />
            <div className="flex-1">
              <p className="text-[15px] font-medium">{a.name}</p>
              <p className="text-[13px] text-muted-foreground">{a.desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
