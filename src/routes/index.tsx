import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav, type TabId } from "@/components/ledger/BottomNav";
import { HomeTab } from "@/components/ledger/HomeTab";
import { SwapTab } from "@/components/ledger/SwapTab";
import { EarnTab } from "@/components/ledger/EarnTab";
import { CardTab } from "@/components/ledger/CardTab";
import { LedgerProvider } from "@/components/ledger/store";
import { LedgerSheets } from "@/components/ledger/Sheets";

const title = "Ledger — Crypto Wallet App";
const description =
  "Manage your crypto securely: track your portfolio, buy, swap, stake and spend with the Ledger card.";

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
  const [tab, setTab] = useState<TabId>("home");

  return (
    <LedgerProvider>
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background text-foreground">
        <main className="flex-1">
          {tab === "home" && <HomeTab />}
          {tab === "swap" && <SwapTab />}
          {tab === "earn" && <EarnTab />}
          {tab === "card" && <CardTab />}
        </main>
        <BottomNav active={tab} onChange={setTab} />
        <LedgerSheets />
        <Toaster position="top-center" />
      </div>
    </LedgerProvider>
  );
}
