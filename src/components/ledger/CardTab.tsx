import { ChevronRight, Lock, Snowflake, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { fmt } from "./data";
import { TopBar } from "./HomeTab";
import { useLedger } from "./store";

export function CardTab() {
  const l = useLedger();
  const [frozen, setFrozen] = useState(false);

  return (
    <div className="relative pb-32">
      <div className="halftone halftone-purple" />
      <div className="relative">
        <TopBar tint="blue" />

        <h1 className="mt-12 px-6 text-center text-[46px] font-bold leading-[1.05] tracking-tight">
          Spend your
          <br />
          crypto anywhere
        </h1>

        <div className="mt-8 px-5">
          <div className="relative aspect-[1.6] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-6 ring-1 ring-white/10">
            <p className="text-[15px] uppercase tracking-[0.3em] text-muted-foreground">Ledger</p>
            <p className="mt-10 text-[22px] tracking-[0.25em]">•••• •••• •••• 4821</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[13px] text-muted-foreground">Available</p>
                <p className="text-[19px] font-semibold">{l.hideBalances ? "••••" : fmt(l.total * 0.12)}</p>
              </div>
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            {frozen && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-[17px] font-semibold">
                  <Snowflake className="h-5 w-5" /> Card frozen
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 px-5">
          <button
            onClick={() => {
              setFrozen((f) => !f);
              toast.success(frozen ? "Card unfrozen" : "Card frozen");
            }}
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-card py-6 text-[17px] font-semibold active:bg-secondary"
          >
            <Snowflake className="h-6 w-6" strokeWidth={1.7} />
            {frozen ? "Unfreeze" : "Freeze"}
          </button>
          <button
            onClick={() => l.open({ type: "settings" })}
            className="flex flex-col items-center gap-2.5 rounded-2xl bg-card py-6 text-[17px] font-semibold active:bg-secondary"
          >
            <Lock className="h-6 w-6" strokeWidth={1.7} />
            Card settings
          </button>
        </div>

        <h2 className="mt-8 px-5 text-[26px] font-bold tracking-tight">Recent spending</h2>
        <div className="mt-2 px-5">
          {[
            ["Apple Store", "Today", 129.0],
            ["Uber", "Yesterday", 18.4],
            ["Carrefour", "Aug 21", 62.15],
          ].map(([name, when, amt]) => (
            <button
              key={name as string}
              onClick={() => toast.info(`${name} — ${fmt(amt as number)}`)}
              className="flex w-full items-center gap-4 py-3.5 text-left active:opacity-70"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-[15px] font-semibold">
                {(name as string).slice(0, 1)}
              </div>
              <div className="flex-1">
                <p className="text-[17px] font-semibold">{name}</p>
                <p className="text-[15px] text-muted-foreground">{when}</p>
              </div>
              <p className="text-[17px] font-semibold">-{fmt(amt as number)}</p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
