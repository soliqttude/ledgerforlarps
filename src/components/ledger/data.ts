export type Asset = {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
  amount: number;
  color: string;
  glyph: string;
};

export const assets: Asset[] = [
  { id: "btc", name: "Bitcoin", ticker: "BTC", price: 64210.42, change: 2.14, amount: 0.4821, color: "#F7931A", glyph: "₿" },
  { id: "eth", name: "Ethereum", ticker: "ETH", price: 3288.9, change: -1.02, amount: 3.104, color: "#627EEA", glyph: "Ξ" },
  { id: "sol", name: "Solana", ticker: "SOL", price: 148.77, change: 5.63, amount: 24.5, color: "#14F195", glyph: "◎" },
  { id: "usdt", name: "Tether USD", ticker: "USDT", price: 1.0, change: 0.01, amount: 1850, color: "#26A17B", glyph: "₮" },
  { id: "dot", name: "Polkadot", ticker: "DOT", price: 6.42, change: -3.18, amount: 320, color: "#E6007A", glyph: "●" },
  { id: "xrp", name: "XRP", ticker: "XRP", price: 0.58, change: 1.44, amount: 2400, color: "#23292F", glyph: "✕" },
];

export const totalBalance = assets.reduce((sum, a) => sum + a.price * a.amount, 0);

export const chartData = Array.from({ length: 40 }, (_, i) => {
  const base = totalBalance * 0.86;
  const wave = Math.sin(i / 4) * totalBalance * 0.035 + (i / 39) * totalBalance * 0.14;
  return { i, value: Math.round(base + wave) };
});

export const ranges = ["1D", "1W", "1M", "1Y", "ALL"];

export const fmt = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
