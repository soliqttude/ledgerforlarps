import { fmt, type Asset } from "./data";

export function AssetIcon({ asset, size = 40 }: { asset: Asset; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: asset.color, fontSize: size * 0.45 }}
    >
      {asset.glyph}
    </div>
  );
}

export function AssetRow({ asset }: { asset: Asset }) {
  const value = asset.price * asset.amount;
  const up = asset.change >= 0;
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition-colors active:bg-accent">
      <AssetIcon asset={asset} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-foreground">{asset.name}</p>
        <p className="text-[13px] text-muted-foreground">
          {asset.amount} {asset.ticker}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[15px] font-medium text-foreground">{fmt(value)}</p>
        <p className={`text-[13px] ${up ? "text-success" : "text-destructive"}`}>
          {up ? "+" : ""}
          {asset.change.toFixed(2)}%
        </p>
      </div>
    </button>
  );
}
