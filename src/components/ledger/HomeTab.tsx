import { User, Compass, Search, Clock, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { fmt, market } from "./data";
import { AssetRow } from "./AssetRow";
import { useLedger } from "./store";

export function TopBar({ tint = "purple" }: { tint?: "purple" | "blue" | "green" }) {
  const l = useLedger();
  const round =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-foreground ring-1 ring-white/10 transition-colors active:bg-white/15";
  return (
    <div className="flex items-center justify-between px-5 pt-[max(12px,env(safe-area-inset-top))]">
      <div className="flex items-center gap-2.5">
        <button aria-label="Account" className={round} onClick={() => l.open({ type: "accounts" })}>
          <User className="h-[19px] w-[19px]" strokeWidth={1.7} />
        </button>
        {tint !== "blue" && (
          <>
            <button aria-label="Discover" className={round} onClick={() => l.open({ type: "app", name: "Discover" })}>
              <Compass className="h-[19px] w-[19px]" strokeWidth={1.7} />
            </button>
            <button aria-label="Search" className={round} onClick={() => l.open({ type: "edit" })}>
              <Search className="h-[19px] w-[19px]" strokeWidth={1.7} />
            </button>
          </>
        )}
      </div>
      <button aria-label="History" className={round} onClick={() => l.open({ type: "notifications" })}>
        <Clock className="h-[19px] w-[19px]" strokeWidth={1.7} />
      </button>
    </div>
  );
}

export function HomeTab() {
  const l = useLedger();
  const [sort, setSort] = useState<"Trending" | "Top gainers">("Trending");

  const crypto = l.assets.filter((a) => !a.stable);
  const stables = l.assets.filter((a) => a.stable);

  return (
    <div className="relative pb-36">
      <div className="halftone halftone-purple" />
      <div className="relative">
        <TopBar />

        <div className="mt-9 flex flex-col items-center justify-center px-6">
          {(() => {
            if (l.hideBalances) {
              return <p className="text-center text-[46px] leading-none tracking-tight">••••</p>;
            }
            const formatted = fmt(l.total);
            const match = formatted.match(/^(.+)(\.\d+)$/);
            if (!match) {
              return (
                <p className="text-center text-[46px] leading-none tracking-[-0.03em] tabular-nums">{formatted}</p>
              );
            }
            return (
              <p className="text-center text-[46px] leading-none tracking-[-0.03em] tabular-nums">
                <span>{match[1]}</span>
                <span className="align-super text-[22px] text-muted-foreground">{match[2]}</span>
              </p>
            );
          })()}
          <button
            onClick={() => toast.info("Performance", { description: "Detailed portfolio performance coming soon" })}
            className="mt-4 flex items-center gap-1.5 rounded-full bg-success/12 px-3.5 py-1.5 text-[14px] text-success ring-1 ring-success/20 transition-transform active:scale-[0.97]"
          >
            +5621.95% · Today <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-9 flex items-end justify-between px-5">
          <button
            onClick={() => toast.info("Market", { description: "Full market view coming from Ledger Live" })}
            className="flex items-center gap-1.5 text-[22px] tracking-[-0.02em]"
          >
            Market <ChevronRight className="mt-[3px] h-[18px] w-[18px] text-muted-foreground" />
          </button>
          <button
            onClick={() => setSort((s) => (s === "Trending" ? "Top gainers" : "Trending"))}
            className="flex items-center gap-1 pb-0.5 text-[14px] text-muted-foreground"
          >
            {sort} <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => toast.info("Market mood: Greed (78)")}
            className="flex w-[104px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-[22px] py-4 transition-transform active:scale-[0.97] surface"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-success/70 text-[14px]">
              78
            </div>
            <p className="text-[14.5px] leading-tight">Mood</p>
            <p className="text-[13px] leading-tight text-success">Greed</p>
          </button>
          {(sort === "Trending" ? market : [...market].sort((a, b) => b.change - a.change)).map((m) => (
            <button
              key={m.ticker}
              onClick={() => toast.info(`${m.ticker} ${m.change >= 0 ? "+" : ""}${m.change}%`)}
              className="flex w-[104px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-[22px] py-4 transition-transform active:scale-[0.97] surface"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-[17px] text-white shadow-[inset_0_1px_0_0_oklch(1_0_0/25%)] ring-1 ring-white/10"
                style={{ backgroundColor: m.color }}
              >
                {m.glyph}
              </div>
              <p className="text-[14.5px] leading-tight">{m.ticker}</p>
              <p
                className={`text-[13px] leading-tight tabular-nums ${m.change >= 0 ? "text-success" : "text-destructive"}`}
              >
                {m.change >= 0 ? "+" : ""}
                {m.change.toFixed(2)}%
              </p>
            </button>
          ))}
        </div>

        <section className="mt-9 px-3.5">
          <h2 className="px-2 text-[22px] tracking-[-0.02em]">Crypto</h2>
          <div className="mt-1.5 divide-y divide-white/[0.05]">
            {crypto.map((a) => (
              <AssetRow
                key={a.id}
                asset={a}
                hidden={l.hideBalances}
                onClick={() => l.open({ type: "asset", assetId: a.id })}
              />
            ))}
          </div>

          <h2 className="mt-7 px-2 text-[22px] tracking-[-0.02em]">Stablecoins</h2>
          <div className="mt-1.5 divide-y divide-white/[0.05]">
            {stables.map((a) => (
              <AssetRow
                key={a.id}
                asset={a}
                hidden={l.hideBalances}
                onClick={() => l.open({ type: "asset", assetId: a.id })}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
