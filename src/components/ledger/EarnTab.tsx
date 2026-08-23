import { TrendingUp, Info } from "lucide-react";
import { assets, fmt } from "./data";
import { AssetIcon } from "./AssetRow";

const staking = [
  { id: "eth", apy: 3.2, staked: 1.2 },
  { id: "sol", apy: 6.8, staked: 12 },
  { id: "dot", apy: 14.5, staked: 120 },
];

export function EarnTab() {
  const rewards = 214.87;
  return (
    <div className="px-5 pb-4 pt-6">
      <h1 className="text-[28px] font-semibold tracking-tight">Earn</h1>
      <p className="mt-1 text-sm text-muted-foreground">Put your crypto to work securely from your Ledger.</p>

      <div className="mt-5 rounded-3xl bg-card p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span className="text-[13px]">Total rewards earned</span>
        </div>
        <p className="mt-2 text-[30px] font-semibold">{fmt(rewards)}</p>
        <button className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground active:opacity-90">
          Start earning
        </button>
      </div>

      <h2 className="mt-7 text-[17px] font-semibold">Available offers</h2>
      <div className="mt-2 space-y-2">
        {staking.map((s) => {
          const asset = assets.find((a) => a.id === s.id)!;
          return (
            <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-card p-4">
              <AssetIcon asset={asset} />
              <div className="flex-1">
                <p className="text-[15px] font-medium">{asset.name} staking</p>
                <p className="text-[13px] text-muted-foreground">
                  {s.staked} {asset.ticker} staked
                </p>
              </div>
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-[13px] font-semibold text-success">
                {s.apy}% APY
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-2xl border border-border p-4 text-[12px] text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Rewards are estimates and vary with network conditions. Your keys always stay on your Ledger device.</p>
      </div>
    </div>
  );
}
