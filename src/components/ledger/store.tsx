import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { assets as seedAssets, initialTxs, type Asset, type Tx } from "./data";

export type SheetKind =
  | { type: "none" }
  | { type: "asset"; assetId: string }
  | { type: "send"; assetId?: string }
  | { type: "receive"; assetId?: string }
  | { type: "buy"; assetId?: string }
  | { type: "swap"; assetId?: string }
  | { type: "notifications" }
  | { type: "settings" }
  | { type: "scan" }
  | { type: "accounts" }
  | { type: "stake"; assetId: string }
  | { type: "edit" }
  | { type: "app"; name: string };

const COINGECKO_IDS: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  bnb: "binancecoin",
  usdt: "tether",
  xrp: "ripple",
  usdc: "usd-coin",
  sol: "solana",
  dai: "dai",
};

type Ctx = {
  assets: Asset[];
  txs: Tx[];
  sheet: SheetKind;
  open: (s: SheetKind) => void;
  close: () => void;
  hideBalances: boolean;
  toggleHide: () => void;
  send: (assetId: string, amount: number) => void;
  receive: (assetId: string, amount: number) => void;
  swap: (fromId: string, toId: string, amount: number) => void;
  buy: (assetId: string, usd: number) => void;
  total: number;
  byId: (id: string) => Asset;
  setAmount: (id: string, amount: number) => void;
  livePrices: boolean;
};

const LedgerCtx = createContext<Ctx | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(seedAssets);
  const [txs, setTxs] = useState<Tx[]>(initialTxs);
  const [sheet, setSheet] = useState<SheetKind>({ type: "none" });
  const [hideBalances, setHide] = useState(false);
  const [livePrices, setLivePrices] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const ids = Object.values(COINGECKO_IDS).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    async function load() {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const json = (await res.json()) as Record<string, { usd?: number; usd_24h_change?: number }>;
        if (cancelled) return;
        setAssets((prev) =>
          prev.map((a) => {
            const cgId = COINGECKO_IDS[a.id];
            const quote = cgId ? json[cgId] : undefined;
            if (!quote?.usd) return a;
            return { ...a, price: quote.usd, change: quote.usd_24h_change ?? a.change };
          }),
        );
        setLivePrices(true);
      } catch {
        /* keep seeded prices offline */
      }
    }

    void load();
    const timer = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const byId = useCallback((id: string) => assets.find((a) => a.id === id)!, [assets]);

  const addTx = useCallback((tx: Omit<Tx, "id" | "date" | "status">) => {
    setTxs((prev) => [
      { ...tx, id: crypto.randomUUID(), date: "Just now", status: "Confirmed" },
      ...prev,
    ]);
  }, []);

  const adjust = useCallback((id: string, delta: number) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, amount: Math.max(0, a.amount + delta) } : a)));
  }, []);

  const value = useMemo<Ctx>(() => {
    const total = assets.reduce((s, a) => s + a.price * a.amount, 0);
    return {
      assets,
      txs,
      sheet,
      open: setSheet,
      close: () => setSheet({ type: "none" }),
      hideBalances,
      toggleHide: () => setHide((v) => !v),
      total,
      byId,
      livePrices,
      setAmount: (id, amount) =>
        setAssets((prev) =>
          prev.map((a) => (a.id === id ? { ...a, amount: Number.isFinite(amount) ? Math.max(0, amount) : 0 } : a)),
        ),
      send: (assetId, amount) => {
        const a = assets.find((x) => x.id === assetId)!;
        adjust(assetId, -amount);
        addTx({ kind: "Sent", assetId, amount, usd: amount * a.price });
      },
      receive: (assetId, amount) => {
        const a = assets.find((x) => x.id === assetId)!;
        adjust(assetId, amount);
        addTx({ kind: "Received", assetId, amount, usd: amount * a.price });
      },
      buy: (assetId, usd) => {
        const a = assets.find((x) => x.id === assetId)!;
        const amount = usd / a.price;
        adjust(assetId, amount);
        addTx({ kind: "Bought", assetId, amount, usd });
      },
      swap: (fromId, toId, amount) => {
        const from = assets.find((x) => x.id === fromId)!;
        const to = assets.find((x) => x.id === toId)!;
        const usd = amount * from.price;
        adjust(fromId, -amount);
        adjust(toId, usd / to.price);
        addTx({ kind: "Swapped", assetId: fromId, amount, usd });
      },
    };
  }, [assets, txs, sheet, hideBalances, byId, addTx, adjust, livePrices]);

  return <LedgerCtx.Provider value={value}>{children}</LedgerCtx.Provider>;
}

export function useLedger() {
  const ctx = useContext(LedgerCtx);
  if (!ctx) throw new Error("useLedger must be used inside LedgerProvider");
  return ctx;
}
