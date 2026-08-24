import { ChevronRight, Calculator } from "lucide-react";
import { toast } from "sonner";
import { fmt } from "./data";
import { AssetIcon } from "./AssetRow";
import { TopBar } from "./HomeTab";
import { useLedger } from "./store";

export function EarnTab() {
  const l = useLedger();
  const favorites = l.assets.filter((a) => a.apy).slice(0, 4);
  const stables = l.assets.filter((a) => a.stable);

  return (
    <div className="relative pb-32">
      <div className="halftone halftone-green" />
      <div className="relative">
        <TopBar tint="green" />

        <h1 className="mt-14 px-6 text-center text-[46px] font-bold leading-[1.05] tracking-tight">
          Make your assets
          <br />
          earn for you
        </h1>
        <p className="mt-4 text-center text-[17px] text-muted-foreground">Join 2 million people who have deposited.</p>

        <div className="mt-7 flex justify-center">
          <button
            onClick={() => l.open({ type: "stake", assetId: "eth" })}
            className="rounded-full bg-foreground px-9 py-4 text-[19px] font-semibold text-background active:scale-[0.98]"
          >
            Start earning rewards
          </button>
        </div>

        <div className="mt-9 flex items-center gap-2 px-5">
          <h2 className="text-[26px] font-bold tracking-tight">Crowd favorites</h2>
          <span className="text-[20px] text-muted-foreground">({l.assets.length})</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <Row items={favorites} onPick={(id) => l.open({ type: "stake", assetId: id })} />

        <h2 className="mt-8 px-5 text-[26px] font-bold tracking-tight">Top stablecoins</h2>
        <Row items={stables} onPick={(id) => l.open({ type: "stake", assetId: id })} />

        <button
          onClick={() => toast.info("Simulate rewards", { description: `Est. yearly rewards ${fmt(l.total * 0.032)}` })}
          className="mx-5 mt-7 flex w-[calc(100%-2.5rem)] items-center gap-4 rounded-3xl bg-card p-5 text-left active:bg-secondary"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Calculator className="h-5 w-5" />
          </div>
          <span className="flex-1 text-[19px] font-semibold">Simulate rewards</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <h2 className="mt-8 px-5 text-[26px] font-bold tracking-tight">How does it work?</h2>
        <div className="mt-3 space-y-2 px-5">
          {[
            ["Choose an asset", "Pick from staking and lending offers."],
            ["Deposit securely", "Approve every step on your Ledger device."],
            ["Earn rewards", "Track your rewards and withdraw anytime."],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-4 rounded-2xl bg-card p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[15px] font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="text-[17px] font-semibold">{t}</p>
                <p className="text-[15px] text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ items, onPick }: { items: ReturnType<typeof Object>[] | any[]; onPick: (id: string) => void }) {
  return (
    <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
      {items.map((a) => (
        <button
          key={a.id}
          onClick={() => onPick(a.id)}
          className="flex w-[132px] shrink-0 flex-col items-center gap-2 rounded-2xl bg-card p-4 active:bg-secondary"
        >
          <AssetIcon asset={a} size={56} />
          <p className="w-full truncate text-center text-[17px] font-semibold">{a.name}</p>
          <span className="rounded-md bg-success/15 px-2 py-1 text-[14px] font-medium text-success">
            ~{(a.apy ?? 3.1).toFixed(2)}% {a.stable ? "NRR" : "APY"}
          </span>
        </button>
      ))}
    </div>
  );
}
