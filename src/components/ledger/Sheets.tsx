import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Fingerprint,
  Globe,
  Moon,
  QrCode,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { fmt, fmtCrypto, seriesFor } from "./data";
import { useLedger } from "./store";
import { AssetIcon } from "./AssetRow";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SheetHeader className="px-5 pb-2 pt-1">
        <SheetTitle className="text-[19px]">{title}</SheetTitle>
      </SheetHeader>
      <div className="max-h-[72vh] overflow-y-auto px-5 pb-8">{children}</div>
    </>
  );
}

function Numpad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
  const press = (k: string) => {
    if (k === "⌫") return onChange(value.length <= 1 ? "0" : value.slice(0, -1));
    if (k === "." && value.includes(".")) return;
    onChange(value === "0" && k !== "." ? k : value + k);
  };
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => press(k)}
          className="rounded-2xl bg-secondary py-3.5 text-[19px] font-medium transition-transform active:scale-95 active:bg-accent"
        >
          {k}
        </button>
      ))}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-5 w-full rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function AssetPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { assets } = useLedger();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {assets.map((a) => (
        <button
          key={a.id}
          onClick={() => onChange(a.id)}
          className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-medium transition-colors ${
            value === a.id ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"
          }`}
        >
          <AssetIcon asset={a} size={20} />
          {a.ticker}
        </button>
      ))}
    </div>
  );
}

export function LedgerSheets() {
  const l = useLedger();
  const s = l.sheet;
  const openState = s.type !== "none";

  return (
    <Sheet open={openState} onOpenChange={(o) => !o && l.close()}>
      <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-3xl border-border bg-card p-0 pt-4">
        {s.type === "asset" && <AssetDetail assetId={s.assetId} />}
        {s.type === "send" && <SendView assetId={s.assetId} />}
        {s.type === "receive" && <ReceiveView assetId={s.assetId} />}
        {s.type === "buy" && <BuyView assetId={s.assetId} />}
        {s.type === "swap" && <SwapView assetId={s.assetId} />}
        {s.type === "stake" && <StakeView assetId={s.assetId} />}
        {s.type === "notifications" && <NotificationsView />}
        {s.type === "settings" && <SettingsView />}
        {s.type === "scan" && <ScanView />}
        {s.type === "accounts" && <AccountsView />}
        {s.type === "app" && <AppView name={s.name} />}
      </SheetContent>
    </Sheet>
  );
}

function AssetDetail({ assetId }: { assetId: string }) {
  const l = useLedger();
  const a = l.byId(assetId);
  const [range, setRange] = useState<"1D" | "1W" | "1M" | "1Y" | "ALL">("1M");
  const data = seriesFor(range, a.price);
  const up = a.change >= 0;
  const acts = [
    { label: "Buy", icon: CreditCard, go: () => l.open({ type: "buy", assetId }) },
    { label: "Send", icon: ArrowUpRight, go: () => l.open({ type: "send", assetId }) },
    { label: "Receive", icon: ArrowDownToLine, go: () => l.open({ type: "receive", assetId }) },
    { label: "Swap", icon: ArrowLeftRight, go: () => l.open({ type: "swap", assetId }) },
  ];
  return (
    <Shell title={a.name}>
      <div className="flex items-center gap-3">
        <AssetIcon asset={a} size={44} />
        <div>
          <p className="text-[26px] font-semibold leading-tight">{fmt(a.price)}</p>
          <p className={`text-[13px] ${up ? "text-success" : "text-destructive"}`}>
            {up ? "+" : ""}
            {a.change.toFixed(2)}% today
          </p>
        </div>
      </div>

      <div className="mt-4 h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="assetFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={a.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={a.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              cursor={{ stroke: a.color, strokeOpacity: 0.4 }}
              contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
              labelFormatter={() => ""}
              formatter={(v: number) => [fmt(v), "Price"]}
            />
            <Area type="monotone" dataKey="value" stroke={a.color} strokeWidth={2} fill="url(#assetFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-1">
        {(["1D", "1W", "1M", "1Y", "ALL"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${range === r ? "bg-secondary" : "text-muted-foreground"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {acts.map(({ label, icon: Icon, go }) => (
          <button key={label} onClick={go} className="flex flex-col items-center gap-2 rounded-2xl bg-secondary py-3 active:scale-95">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-[12px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-secondary p-4">
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">Your balance</span>
          <span className="font-medium">{fmtCrypto(a.amount)} {a.ticker}</span>
        </div>
        <div className="mt-2 flex justify-between text-[14px]">
          <span className="text-muted-foreground">Value</span>
          <span className="font-medium">{fmt(a.amount * a.price)}</span>
        </div>
      </div>

      <h3 className="mt-5 text-[15px] font-semibold">Operations</h3>
      <div className="mt-2 space-y-2">
        {l.txs.filter((t) => t.assetId === assetId).slice(0, 4).map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-[14px]">
            <div>
              <p className="font-medium">{t.kind}</p>
              <p className="text-[12px] text-muted-foreground">{t.date}</p>
            </div>
            <span className="font-medium">{fmt(t.usd)}</span>
          </div>
        ))}
        {l.txs.filter((t) => t.assetId === assetId).length === 0 && (
          <p className="text-[13px] text-muted-foreground">No operations yet.</p>
        )}
      </div>
    </Shell>
  );
}

function SendView({ assetId }: { assetId?: string | undefined }) {
  const l = useLedger();
  const [id, setId] = useState(assetId ?? l.assets[0].id);
  const [amount, setAmount] = useState("0");
  const [addr, setAddr] = useState("");
  const a = l.byId(id);
  const num = parseFloat(amount) || 0;
  const valid = num > 0 && num <= a.amount && addr.trim().length >= 6;
  return (
    <Shell title="Send">
      <AssetPicker value={id} onChange={setId} />
      <input
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="Recipient address"
        className="mt-3 w-full rounded-2xl bg-secondary px-4 py-3 text-[14px] outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-4 text-center">
        <p className="text-[34px] font-semibold leading-none">{amount} <span className="text-[18px] text-muted-foreground">{a.ticker}</span></p>
        <p className="mt-1 text-[13px] text-muted-foreground">{fmt(num * a.price)}</p>
        <button onClick={() => setAmount(String(a.amount))} className="mt-2 rounded-full bg-secondary px-3 py-1 text-[12px]">
          Max {fmtCrypto(a.amount)} {a.ticker}
        </button>
      </div>
      <Numpad value={amount} onChange={setAmount} />
      <PrimaryButton
        disabled={!valid}
        onClick={() => {
          l.send(id, num);
          l.close();
          toast.success(`Sent ${num} ${a.ticker}`, { description: "Confirmed on your Ledger device" });
        }}
      >
        Confirm on device
      </PrimaryButton>
    </Shell>
  );
}

function ReceiveView({ assetId }: { assetId?: string | undefined }) {
  const l = useLedger();
  const [id, setId] = useState(assetId ?? l.assets[0].id);
  const a = l.byId(id);
  const address = `${a.ticker.toLowerCase()}1q${a.id}9x7fk2m4zlp8vt3nd6rhs0quw5ej`;
  return (
    <Shell title="Receive">
      <AssetPicker value={id} onChange={setId} />
      <div className="mt-5 flex flex-col items-center">
        <div className="rounded-3xl bg-foreground p-4">
          <QrCode className="h-40 w-40 text-background" />
        </div>
        <p className="mt-4 break-all px-4 text-center text-[13px] text-muted-foreground">{address}</p>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(address);
            toast.success("Address copied");
          }}
          className="mt-3 flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-[13px] font-medium active:scale-95"
        >
          <Copy className="h-4 w-4" /> Copy address
        </button>
      </div>
      <PrimaryButton
        onClick={() => {
          l.receive(id, 0.05);
          l.close();
          toast.success(`Received 0.05 ${a.ticker}`, { description: "Test deposit simulated" });
        }}
      >
        Verify address on device
      </PrimaryButton>
    </Shell>
  );
}

function BuyView({ assetId }: { assetId?: string | undefined }) {
  const l = useLedger();
  const [id, setId] = useState(assetId ?? l.assets[0].id);
  const [usd, setUsd] = useState("100");
  const a = l.byId(id);
  const num = parseFloat(usd) || 0;
  return (
    <Shell title="Buy crypto">
      <AssetPicker value={id} onChange={setId} />
      <div className="mt-4 text-center">
        <p className="text-[34px] font-semibold leading-none">${usd}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">≈ {fmtCrypto(num / a.price)} {a.ticker}</p>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {[50, 100, 250, 500].map((v) => (
          <button key={v} onClick={() => setUsd(String(v))} className={`rounded-full px-3 py-1.5 text-[13px] ${usd === String(v) ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            ${v}
          </button>
        ))}
      </div>
      <Numpad value={usd} onChange={setUsd} />
      <PrimaryButton
        disabled={num <= 0}
        onClick={() => {
          l.buy(id, num);
          l.close();
          toast.success(`Bought ${fmt(num)} of ${a.ticker}`, { description: "Provider: MoonPay" });
        }}
      >
        Continue with MoonPay
      </PrimaryButton>
    </Shell>
  );
}

function SwapView({ assetId }: { assetId?: string | undefined }) {
  const l = useLedger();
  const [from, setFrom] = useState(assetId ?? l.assets[0].id);
  const [to, setTo] = useState(l.assets.find((a) => a.id !== (assetId ?? l.assets[0].id))!.id);
  const [amount, setAmount] = useState("0");
  const f = l.byId(from);
  const t = l.byId(to);
  const num = parseFloat(amount) || 0;
  const out = (num * f.price) / t.price;
  return (
    <Shell title="Swap">
      <p className="text-[12px] uppercase tracking-wide text-muted-foreground">From</p>
      <div className="mt-2"><AssetPicker value={from} onChange={setFrom} /></div>
      <p className="mt-4 text-[12px] uppercase tracking-wide text-muted-foreground">To</p>
      <div className="mt-2"><AssetPicker value={to} onChange={(v) => setTo(v === from ? to : v)} /></div>
      <div className="mt-4 rounded-2xl bg-secondary p-4 text-center">
        <p className="text-[30px] font-semibold leading-none">{amount} <span className="text-[16px] text-muted-foreground">{f.ticker}</span></p>
        <p className="mt-2 text-[14px] text-muted-foreground">≈ {fmtCrypto(out)} {t.ticker}</p>
      </div>
      <Numpad value={amount} onChange={setAmount} />
      <PrimaryButton
        disabled={num <= 0 || num > f.amount || from === to}
        onClick={() => {
          l.swap(from, to, num);
          l.close();
          toast.success(`Swapped ${num} ${f.ticker} → ${fmtCrypto(out)} ${t.ticker}`);
        }}
      >
        Review swap
      </PrimaryButton>
    </Shell>
  );
}

function StakeView({ assetId }: { assetId: string }) {
  const l = useLedger();
  const a = l.byId(assetId);
  const [amount, setAmount] = useState("0");
  const num = parseFloat(amount) || 0;
  return (
    <Shell title={`Stake ${a.name}`}>
      <div className="rounded-2xl bg-secondary p-4 text-center">
        <p className="text-[30px] font-semibold leading-none">{amount} <span className="text-[16px] text-muted-foreground">{a.ticker}</span></p>
        <p className="mt-1 text-[13px] text-muted-foreground">{fmt(num * a.price)}</p>
      </div>
      <Numpad value={amount} onChange={setAmount} />
      <PrimaryButton
        disabled={num <= 0 || num > a.amount}
        onClick={() => {
          l.send(assetId, num);
          l.close();
          toast.success(`Staked ${num} ${a.ticker}`, { description: "Rewards start in ~24h" });
        }}
      >
        Stake with Kiln
      </PrimaryButton>
    </Shell>
  );
}

const notifs = [
  { title: "Bitcoin is up 2.14%", body: "Your BTC position gained today.", time: "2h" },
  { title: "Firmware 2.2.3 available", body: "Update your Ledger Nano X.", time: "1d" },
  { title: "Staking rewards paid", body: "You earned 0.014 SOL.", time: "2d" },
];

function NotificationsView() {
  return (
    <Shell title="Notifications">
      <div className="space-y-2">
        {notifs.map((n) => (
          <div key={n.title} className="flex gap-3 rounded-2xl bg-secondary p-4">
            <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-[14px] font-medium">{n.title}</p>
              <p className="text-[13px] text-muted-foreground">{n.body}</p>
            </div>
            <span className="text-[12px] text-muted-foreground">{n.time}</span>
          </div>
        ))}
      </div>
      <PrimaryButton onClick={() => toast.success("All notifications marked as read")}>Mark all as read</PrimaryButton>
    </Shell>
  );
}

function SettingsView() {
  const l = useLedger();
  const [rows, setRows] = useState({ biometrics: true, analytics: false, dark: true });
  const toggles = [
    { key: "biometrics" as const, label: "Unlock with biometrics", icon: Fingerprint },
    { key: "analytics" as const, label: "Share analytics", icon: Globe },
    { key: "dark" as const, label: "Dark appearance", icon: Moon },
  ];
  return (
    <Shell title="Settings">
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-secondary">
        {toggles.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3 p-4">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-[15px]">{label}</span>
            <Switch
              checked={rows[key]}
              onCheckedChange={(v) => {
                setRows((r) => ({ ...r, [key]: v }));
                toast.success(`${label} ${v ? "enabled" : "disabled"}`);
              }}
            />
          </div>
        ))}
        <button onClick={l.toggleHide} className="flex w-full items-center gap-3 p-4 text-left active:bg-accent">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <span className="flex-1 text-[15px]">{l.hideBalances ? "Show balances" : "Hide balances"}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <PrimaryButton onClick={() => { l.close(); toast.success("Ledger locked"); }}>Lock app</PrimaryButton>
    </Shell>
  );
}

function ScanView() {
  const l = useLedger();
  useEffect(() => {
    const t = setTimeout(() => {
      l.close();
      toast.success("QR scanned", { description: "Address added to recipients" });
    }, 1800);
    return () => clearTimeout(t);
  }, [l]);
  return (
    <Shell title="Scan QR code">
      <div className="relative mx-auto mt-2 aspect-square w-64 overflow-hidden rounded-3xl bg-secondary">
        <div className="absolute inset-6 rounded-2xl border-2 border-primary/70" />
        <div className="absolute inset-x-6 top-6 h-0.5 animate-[pulse_1.2s_ease-in-out_infinite] bg-primary" />
      </div>
      <p className="mt-4 text-center text-[13px] text-muted-foreground">Point your camera at a wallet QR code.</p>
    </Shell>
  );
}

function AccountsView() {
  const l = useLedger();
  return (
    <Shell title="Accounts">
      <div className="space-y-2">
        {l.assets.map((a) => (
          <button
            key={a.id}
            onClick={() => l.open({ type: "asset", assetId: a.id })}
            className="flex w-full items-center gap-3 rounded-2xl bg-secondary p-4 text-left active:scale-[0.99]"
          >
            <AssetIcon asset={a} />
            <div className="flex-1">
              <p className="text-[15px] font-medium">{a.name} 1</p>
              <p className="text-[13px] text-muted-foreground">{fmtCrypto(a.amount)} {a.ticker}</p>
            </div>
            <span className="text-[15px] font-medium">{fmt(a.amount * a.price)}</span>
          </button>
        ))}
      </div>
      <PrimaryButton onClick={() => { l.close(); toast.success("Add account", { description: "Connect your device to continue" }); }}>
        <span className="inline-flex items-center gap-2"><Wallet className="h-4 w-4" /> Add new account</span>
      </PrimaryButton>
    </Shell>
  );
}

function AppView({ name }: { name: string }) {
  const l = useLedger();
  return (
    <Shell title={name}>
      <p className="text-[14px] text-muted-foreground">
        {name} runs inside Ledger Live. Your private keys never leave your device — every transaction is verified on-screen.
      </p>
      <div className="mt-4 space-y-2">
        {["Secured by your Ledger", "No account required", "Cancel anytime"].map((f) => (
          <div key={f} className="flex items-center gap-2 rounded-2xl bg-secondary p-3 text-[14px]">
            <Check className="h-4 w-4 text-success" /> {f}
          </div>
        ))}
      </div>
      <PrimaryButton onClick={() => { l.close(); toast.success(`${name} opened`); }}>Open {name}</PrimaryButton>
    </Shell>
  );
}
