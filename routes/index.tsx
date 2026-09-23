import { createFileRoute } from "@tanstack/react-router";
import { PactlyApp } from "@/components/pactly-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PACTLY — Smart Escrow for Global Work" },
      { name: "description", content: "Low-cost, automated micro-escrow for freelancers and global teams." },
      { property: "og:title", content: "PACTLY — Smart Escrow for Global Work" },
      { property: "og:description", content: "Lock, track, and automatically release stablecoin payments when the work is done." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PactlyApp />;
}
