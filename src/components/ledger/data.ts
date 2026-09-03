export type Asset = {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  amount: number;
  color: string;
  glyph: string;
  apy?: number;
  stable?: boolean;
};

export const assets: Asset[] = [
  { id: "btc", name: "Bitcoin", ticker: "BTC", price: 64210.42, change: 0.3, amount: 0.4821, color: "#F7931A", glyph: "₿" },
  { id: "eth", name: "Ethereum", ticker: "ETH", price: 3288.9, change: -1.02, amount: 3.104, color: "#4A5CA8", glyph: "Ξ", apy: 2.69 },
  { id: "bnb", name: "BNB Chain", ticker: "BNB", price: 592.4, change: 1.18, amount: 4.2, color: "#F0B90B", glyph: "◈" },
  { id: "usdt", name: "Tether USD", ticker: "USDT", price: 1.0, change: 0.01, amount: 1850, color: "#00A478", glyph: "₮", apy: 2.96, stable: true },
  { id: "xrp", name: "XRP", ticker: "XRP", price: 0.58, change: 1.44, amount: 2400, color: "#3B3B3B", glyph: "✕" },
  { id: "usdc", name: "USD Coin", ticker: "USDC", price: 1.0, change: 0.0, amount: 640, color: "#2775CA", glyph: "$", apy: 3.7, stable: true },
  { id: "sol", name: "Solana", ticker: "SOL", price: 148.77, change: 5.63, amount: 24.5, color: "#1B1B1B", glyph: "◎", apy: 5.23 },
  { id: "dai", name: "Dai Stablecoin", ticker: "DAI", price: 1.0, change: 0.02, amount: 300, color: "#F5AC37", glyph: "◈", apy: 1.06, stable: true },
];

export const totalBalance = assets.reduce((sum, a) => sum + a.price * a.amount, 0);

export const market = [
  { ticker: "HYPE", change: 1.0, color: "#0B3B33", glyph: "◐" },
  { ticker: "ENA", change: 4.7, color: "#2A2A2A", glyph: "◇" },
  { ticker: "BTC", change: 0.3, color: "#F7931A", glyph: "₿" },
  { ticker: "SOL", change: 2.1, color: "#1B1B1B", glyph: "◎" },
];

export const ranges = ["1D", "1W", "1M", "1Y", "ALL"] as const;
export type Range = (typeof ranges)[number];

const rangePoints: Record<Range, { points: number; amp: number; drift: number }> = {
  "1D": { points: 24, amp: 0.008, drift: 0.012 },
  "1W": { points: 28, amp: 0.02, drift: 0.03 },
  "1M": { points: 40, amp: 0.035, drift: 0.14 },
  "1Y": { points: 52, amp: 0.06, drift: 0.42 },
  ALL: { points: 60, amp: 0.09, drift: 0.78 },
};

export function seriesFor(range: Range, total: number) {
  const { points, amp, drift } = rangePoints[range];
  const base = total * (1 - drift * 0.6);
  return Array.from({ length: points }, (_, i) => {
    const wave = Math.sin(i / 3.3) * total * amp + Math.cos(i / 7) * total * amp * 0.4;
    return { i, value: Math.round(base + wave + (i / (points - 1)) * total * drift * 0.6) };
  });
}

export const chartData = seriesFor("1M", totalBalance);

export type Tx = {
  id: string;
  kind: "Sent" | "Received" | "Swapped" | "Bought" | "Staked";
  assetId: string;
  amount: number;
  usd: number;
  date: string;
  status: "Confirmed" | "Pending";
};

export const initialTxs: Tx[] = [
  { id: "t1", kind: "Received", assetId: "btc", amount: 0.052, usd: 3338.94, date: "Today, 09:14", status: "Confirmed" },
  { id: "t2", kind: "Swapped", assetId: "eth", amount: 0.8, usd: 2631.12, date: "Yesterday, 18:02", status: "Confirmed" },
  { id: "t3", kind: "Sent", assetId: "sol", amount: 4.2, usd: 624.83, date: "Aug 20, 11:47", status: "Confirmed" },
  { id: "t4", kind: "Bought", assetId: "usdt", amount: 500, usd: 500, date: "Aug 18, 08:30", status: "Confirmed" },
];

export const fmt = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtCrypto = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 6 });

const supplyInfo: Record<string, { circulating: number; max: number | null; rank: number; athMul: number; atlMul: number }> = {
  btc: { circulating: 20.079e6, max: 21e6, rank: 1, athMul: 1.58, atlMul: 0.0000008 },
  eth: { circulating: 120.4e6, max: null, rank: 2, athMul: 1.49, atlMul: 0.0001 },
  usdt: { circulating: 141.2e9, max: null, rank: 3, athMul: 1.02, atlMul: 0.94 },
  xrp: { circulating: 57.1e9, max: 100e9, rank: 4, athMul: 5.9, atlMul: 0.005 },
  bnb: { circulating: 145.9e6, max: 200e6, rank: 5, athMul: 1.35, atlMul: 0.0002 },
  sol: { circulating: 471.2e6, max: null, rank: 6, athMul: 1.72, atlMul: 0.003 },
  usdc: { circulating: 43.6e9, max: null, rank: 7, athMul: 1.02, atlMul: 0.89 },
  dai: { circulating: 5.3e9, max: null, rank: 12, athMul: 1.05, atlMul: 0.9 },
};

export const compact = (n: number) => {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(3)} tn`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(3)} bn`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(3)} m`;
  return fmt(n);
};

export const compactUnits = (n: number, ticker: string) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(3)} bn ${ticker}`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(3)} m ${ticker}`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(3)} k ${ticker}`;
  return `${n} ${ticker}`;
};

export function statsFor(a: Asset) {
  const info = supplyInfo[a.id] ?? { circulating: 1e9, max: null, rank: 20, athMul: 1.6, atlMul: 0.01 };
  return {
    marketCap: a.price * info.circulating,
    rank: info.rank,
    circulating: info.circulating,
    max: info.max,
    ath: a.price * info.athMul,
    atl: a.price * info.atlMul,
  };
}
