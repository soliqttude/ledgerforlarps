import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BottomNav, type TabId } from "@/components/ledger/BottomNav";
import { WalletTab } from "@/components/ledger/WalletTab";
import { EarnTab } from "@/components/ledger/EarnTab";
import { DiscoverTab } from "@/components/ledger/DiscoverTab";
import { MyLedgerTab } from "@/components/ledger/MyLedgerTab";

const title = "Ledger — Crypto Wallet App";
const description =
  "Manage your crypto securely: track your portfolio, buy, swap, stake and explore Web3 apps from your Ledger device.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<TabId>("wallet");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background text-foreground">
      <main className="flex-1">
        {tab === "wallet" && <WalletTab />}
        {tab === "earn" && <EarnTab />}
        {tab === "discover" && <DiscoverTab />}
        {tab === "myledger" && <MyLedgerTab />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
