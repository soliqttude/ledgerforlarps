import { useState } from "react";
import { ArrowUpDown, ChevronDown, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { fmt, fmtCrypto } from "./data";
import { AssetIcon } from "./AssetRow";
import { TopBar } from "./HomeTab";
import { useLedger } from "./store";

export function SwapTab() {
  const l = useLedger();
  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [picking, setPicking] = useState<"from" | "to" | null>(null);
  const [query, setQuery] = useState("");

  const from = fromId ? l.byId(fromId) : null;
  const to = toId ? l.byId(toId) : null;
  const num = parseFloat(amount) || 0;
  const out = from && to ? (num * from.price) / to.price : 0;
  const ready = !!from && !!to && num > 0 && num <= from.amount;

  const results = l.assets.filter(
    (a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.ticker.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen pb-32">
      <div className="halftone halftone-blue" />
      <div className="relative">
        <TopBar tint="blue" />

        <div className="relative mt-5 px-5">
          <div className="rounded-3xl border border-white/15 p-5">
            <p className="text-[17px] text-muted-foreground">Send</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0"
                className="w-full bg-transparent text-[36px] font-medium outline-none placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => setPicking("from")}
                className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-4 py-3 text-[18px] font-semibold active:bg-accent"
              >
                {from ? (
                  <>
                    <AssetIcon asset={from} size={24} /> {from.ticker}
                  </>
                ) : (
                  "Choose asset"
                )}
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 flex items-center gap-2 text-[17px] text-muted-foreground">
              <ArrowUpDown className="h-4 w-4" /> {from ? fmt(num * from.price) : "$0"}
            </p>
          </div>

          <button
            onClick={() => {
              setFromId(toId);
              setToId(fromId);
            }}
            aria-label="Invert assets"
            className="absolute left-1/2 top-[124px] z-10 -translate-x-1/2 rounded-xl bg-secondary p-3 ring-4 ring-background active:bg-accent"
          >
            <ArrowUpDown className="h-5 w-5" />
          </button>

          <div className="mt-3 rounded-3xl bg-card p-5">
            <p className="text-[17px] text-muted-foreground">Receive</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[36px] font-medium text-muted-foreground/80">{out ? fmtCrypto(+out.toFixed(6)) : "0"}</p>
              <button
                onClick={() => setPicking("to")}
                className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-4 py-3 text-[18px] font-semibold active:bg-accent"
              >
                {to ? (
                  <>
                    <AssetIcon asset={to} size={24} /> {to.ticker}
                  </>
                ) : (
                  "Choose asset"
                )}
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
            <div className="h-8" />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-28 z-20 mx-auto max-w-md px-5">
        <button
          disabled={!ready}
          onClick={() => {
            l.swap(fromId!, toId!, num);
            setAmount("");
            toast.success(`Swapped ${num} ${from!.ticker} → ${fmtCrypto(+out.toFixed(6))} ${to!.ticker}`);
          }}
          className="w-full rounded-full bg-card py-5 text-[19px] font-semibold text-muted-foreground/70 transition-colors disabled:opacity-100 enabled:bg-foreground enabled:text-background active:scale-[0.99]"
        >
          View quotes
        </button>
      </div>

      <Sheet open={picking !== null} onOpenChange={(o) => !o && setPicking(null)}>
        <SheetContent side="bottom" className="mx-auto h-[86vh] max-w-md rounded-t-3xl border-none bg-card p-0">
          <div className="flex justify-end px-5 pt-4">
            <button
              onClick={() => setPicking(null)}
              aria-label="Close"
              className="rounded-full bg-secondary p-3 active:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="px-5 pt-3 text-[32px] font-bold tracking-tight">Select asset</h2>
          <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3.5">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or address"
              className="w-full bg-transparent text-[17px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="mt-2 overflow-y-auto px-5 pb-10" style={{ maxHeight: "60vh" }}>
            {results.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  if (picking === "from") setFromId(a.id);
                  else setToId(a.id);
                  setPicking(null);
                  setQuery("");
                }}
                className="flex w-full items-center gap-4 py-3.5 text-left active:opacity-70"
              >
                <AssetIcon asset={a} size={48} />
                <div className="flex-1">
                  <p className="text-[17px] font-semibold">{a.name}</p>
                  <p className="text-[15px] text-muted-foreground">{a.ticker}</p>
                </div>
                <div className="text-right">
                  <p className="text-[17px] font-semibold">{fmt(a.amount * a.price)}</p>
                  <p className="text-[15px] text-muted-foreground">
                    {fmtCrypto(a.amount)} {a.ticker}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
