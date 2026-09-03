import { fmt, fmtCrypto, type Asset } from "./data";

export function AssetIcon({ asset, size = 42 }: { asset: Asset; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-white shadow-[inset_0_1px_0_0_oklch(1_0_0/25%)] ring-1 ring-white/10"
      style={{ width: size, height: size, backgroundColor: asset.color, fontSize: size * 0.42 }}
    >
      {asset.glyph}
    </div>
  );
}

export function AssetRow({
  asset,
  onClick,
  hidden,
}: {
  asset: Asset;
  onClick?: () => void;
  hidden?: boolean;
}) {
  const value = asset.price * asset.amount;
  const change = asset.change ?? 0;
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-2xl px-2 py-2.5 text-left transition-colors active:bg-white/[0.05]"
    >
      <AssetIcon asset={asset} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-medium leading-tight text-foreground">{asset.name}</p>
        <p className="mt-0.5 truncate text-[13.5px] leading-tight text-muted-foreground">
          {hidden ? "••••" : fmtCrypto(asset.amount)} {asset.ticker}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[16px] font-medium leading-tight text-foreground tabular-nums">
          {hidden ? "••••" : fmt(value)}
        </p>
        <p
          className={`mt-0.5 text-[13px] leading-tight tabular-nums ${
            change >= 0 ? "text-success" : "text-destructive"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </p>
      </div>
    </button>
  );
}
