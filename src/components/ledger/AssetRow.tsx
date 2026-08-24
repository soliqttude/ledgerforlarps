import { fmt, fmtCrypto, type Asset } from "./data";

export function AssetIcon({ asset, size = 44 }: { asset: Asset; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-1 ring-white/10"
      style={{ width: size, height: size, backgroundColor: asset.color, fontSize: size * 0.44 }}
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
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-2xl px-1 py-3 text-left transition-colors active:bg-card"
    >
      <AssetIcon asset={asset} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] font-semibold text-foreground">{asset.name}</p>
        <p className="text-[15px] text-muted-foreground">
          {hidden ? "••••" : fmtCrypto(asset.amount)} {asset.ticker}
        </p>
      </div>
      <p className="text-[17px] font-semibold text-foreground">{hidden ? "••••" : fmt(value)}</p>
    </button>
  );
}
