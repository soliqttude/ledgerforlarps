import { User, Compass, Search, Clock, Scan, ShoppingCart, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { fmt, market } from "./data";
import { AssetRow } from "./AssetRow";
import { useLedger } from "./store";

export function TopBar({ tint = "purple" }: { tint?: "purple" | "blue" | "green" }) {
  const l = useLedger();
  const round =
    "flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.07] text-foreground ring-1 ring-white/10 active:bg-white/15";
  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <div className="flex items-center gap-3">
        <button aria-label="Account" className={round} onClick={() => l.open({ type: "accounts" })}>
          <User className="h-6 w-6" strokeWidth={1.6} />
        </button>
        {tint !== "blue" && (
          <>
            <button aria-label="Discover" className={round} onClick={() => l.open({ type: "app", name: "Discover" })}>
              <Compass className="h-6 w-6" strokeWidth={1.6} />
            </button>
            <button aria-label="Search" className={round} onClick={() => l.open({ type: "accounts" })}>
              <Search className="h-6 w-6" strokeWidth={1.6} />
            </button>
          </>
        )}
      </div>
      <button aria-label="History" className={round} onClick={() => l.open({ type: "notifications" })}>
        <Clock className="h-6 w-6" strokeWidth={1.6} />
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
    <div className="relative pb-32">
      <div className="halftone halftone-purple" />
      <div className="relative">
        <TopBar />

        <h1 className="mt-14 px-6 text-center text-[46px] font-bold leading-[1.05] tracking-tight">
          Your secure
          <br />
          crypto wallet
        </h1>

        <p className="mt-4 text-center text-[15px] text-muted-foreground">
          Total balance {l.hideBalances ? "••••" : fmt(l.total)}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 px-5">
          <button
            onClick={() => l.open({ type: "scan" })}
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-card py-6 text-[17px] font-semibold active:bg-secondary"
          >
            <Scan className="h-6 w-6" strokeWidth={1.7} />
            Connect
          </button>
          <button
            onClick={() => l.open({ type: "app", name: "Buy a Ledger" })}
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-card py-6 text-[17px] font-semibold active:bg-secondary"
          >
            <ShoppingCart className="h-6 w-6" strokeWidth={1.7} />
            Buy a Ledger
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between px-5">
          <button
            onClick={() => toast.info("Market", { description: "Full market view coming from Ledger Live" })}
            className="flex items-center gap-2 text-[26px] font-bold tracking-tight"
          >
            Market <ChevronRight className="mt-1 h-5 w-5" />
          </button>
          <button
            onClick={() => setSort((s) => (s === "Trending" ? "Top gainers" : "Trending"))}
            className="flex items-center gap-1 text-[17px] text-muted-foreground"
          >
            {sort} <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          <button
            onClick={() => toast.info("Market mood: Greed (78)")}
            className="flex w-[112px] shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-card py-4 active:bg-secondary"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-success/70 text-[15px] font-semibold">
              78
            </div>
            <p className="text-[16px] font-semibold">Mood</p>
            <p className="text-[14px] text-success">Greed</p>
          </button>
          {(sort === "Trending" ? market : [...market].sort((a, b) => b.change - a.change)).map((m) => (
            <button
              key={m.ticker}
              onClick={() => toast.info(`${m.ticker} ${m.change >= 0 ? "+" : ""}${m.change}%`)}
              className="flex w-[112px] shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-card py-4 active:bg-secondary"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-[18px] font-semibold text-white"
                style={{ backgroundColor: m.color }}
              >
                {m.glyph}
              </div>
              <p className="text-[16px] font-semibold">{m.ticker}</p>
              <p className={`text-[14px] ${m.change >= 0 ? "text-success" : "text-destructive"}`}>
                {m.change >= 0 ? "+" : ""}
                {m.change.toFixed(2)}%
              </p>
            </button>
          ))}
        </div>

        <section className="mt-8 px-4">
          <h2 className="px-1 text-[26px] font-bold tracking-tight">Crypto</h2>
          <div className="mt-2">
            {crypto.map((a) => (
              <AssetRow key={a.id} asset={a} hidden={l.hideBalances} onClick={() => l.open({ type: "asset", assetId: a.id })} />
            ))}
          </div>

          <h2 className="mt-6 px-1 text-[26px] font-bold tracking-tight">Stablecoins</h2>
          <div className="mt-2">
            {stables.map((a) => (
              <AssetRow key={a.id} asset={a} hidden={l.hideBalances} onClick={() => l.open({ type: "asset", assetId: a.id })} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
