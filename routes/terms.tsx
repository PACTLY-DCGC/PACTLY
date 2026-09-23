import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — PACTLY" },
      { name: "description", content: "The terms that govern escrow contracts, releases, and fees on PACTLY." },
      { property: "og:title", content: "Terms & Conditions — PACTLY" },
      { property: "og:description", content: "How PACTLY escrow contracts, triggers, and stablecoin settlement work." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "1. The escrow service",
    body: "PACTLY holds stablecoin funds between a payer and a beneficiary until an agreed release condition is met. Contracts are limited to amounts between $50 and $1,000 per agreement.",
  },
  {
    title: "2. Automatic release",
    body: "Funds are released when the selected programmatic trigger reports success — a merged pull request, an approved design, or a passing staging health-check. Once released, a transfer cannot be reversed.",
  },
  {
    title: "3. Fees and gas",
    body: "Network fees are sponsored by PACTLY. Settlement happens in USD-pegged stablecoins, so the locked value does not fluctuate while a contract is open.",
  },
  {
    title: "4. Your account",
    body: "You are responsible for keeping your sign-in credentials safe and for the accuracy of the beneficiary details you enter. Contracts created under your account are treated as authorised by you.",
  },
  {
    title: "5. Disputes",
    body: "If a trigger fails or a party disagrees with an outcome, either side may open a dispute within 14 days. Funds stay locked until the dispute is closed.",
  },
  {
    title: "6. Changes",
    body: "We may update these terms. Continuing to use PACTLY after an update means you accept the revised terms.",
  },
];

function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto min-h-screen w-full max-w-md bg-app px-5 pb-16 shadow-shell">
        <header className="flex items-center gap-3 py-5">
          <Link to="/" className="grid size-11 place-items-center rounded-full bg-card shadow-soft" aria-label="Go back">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
            <h1 className="font-display text-2xl font-bold leading-tight">Terms &amp; Conditions</h1>
          </div>
        </header>
        <p className="text-xs text-muted-foreground">Last updated 23 September 2026</p>
        <div className="mt-5 space-y-3">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-border/70 bg-card/85 p-4 shadow-soft backdrop-blur-xl">
              <h2 className="font-display text-base font-bold">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
