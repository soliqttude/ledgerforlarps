import { useState } from "react";
import { toast } from "sonner";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AssetIcon } from "./AssetRow";
import { fmt } from "./data";
import { useLedger } from "./store";

export function EditBalancesView() {
  const l = useLedger();
  const [query, setQuery] = useState("");

  const list = l.assets.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.ticker.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="max-h-[80vh] overflow-y-auto px-5 pb-8">
      <SheetHeader className="px-0">
        <SheetTitle className="text-[24px] font-medium tracking-tight">Edit balances</SheetTitle>
      </SheetHeader>
      <p className="text-[15px] text-muted-foreground">Search a coin and set how much you hold.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search assets"
        className="mt-4 w-full rounded-2xl bg-secondary px-4 py-3.5 text-[17px] outline-none placeholder:text-muted-foreground"
      />

      <div className="mt-3 space-y-2">
        {list.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
            <AssetIcon asset={a} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-medium">{a.name}</p>
              <p className="text-[14px] text-muted-foreground">
                {fmt(a.price, a.price < 1 ? 4 : 2)} · {fmt(a.price * a.amount)}
              </p>
            </div>
            <input
              type="number"
              inputMode="decimal"
              value={a.amount}
              onChange={(e) => l.setAmount(a.id, Number(e.target.value))}
              className="w-28 rounded-xl bg-card px-3 py-2 text-right text-[16px] font-medium outline-none ring-1 ring-border"
            />
          </div>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-muted-foreground">No assets found</p>}
      </div>

      <button
        onClick={() => {
          toast.success("Balances saved");
          l.close();
        }}
        className="mt-5 w-full rounded-full bg-foreground py-4 text-[18px] font-medium text-background active:scale-[0.99]"
      >
        Done
      </button>
    </div>
  );
}
