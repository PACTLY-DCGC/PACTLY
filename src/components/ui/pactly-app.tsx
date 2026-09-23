import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  CircleDollarSign,
  Code2,
  Delete,
  Figma,
  Github,
  Home,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type View = "dashboard" | "send" | "analytics";
type EscrowStatus = "Locked" | "Disbursed";

type Escrow = {
  id: string;
  beneficiary_name: string;
  beneficiary_initials: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  trigger_type: string;
  trigger_label: string;
  status: "locked" | "disbursed";
  created_at: string;
  disbursed_at: string | null;
};

const escrowsQueryKey = ["pactly", "escrows"] as const;

async function fetchEscrows(): Promise<Escrow[]> {
  const { data, error } = await supabase.from("escrows").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((escrow) => ({
    ...escrow,
    amount: Number(escrow.amount),
    status: escrow.status === "disbursed" ? "disbursed" : "locked",
  }));
}

function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const chartData = [
  { day: "Mon", value: 1920 },
  { day: "Tue", value: 2480 },
  { day: "Wed", value: 2210 },
  { day: "Thu", value: 3727 },
  { day: "Fri", value: 3140 },
  { day: "Sat", value: 4300 },
  { day: "Sun", value: 5522 },
];

function LogoMark() {
  return (
    <div className="grid size-10 place-items-center rounded-2xl bg-foreground text-background shadow-soft">
      <ShieldCheck className="size-5" strokeWidth={2.4} />
    </div>
  );
}

function AppHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="flex items-center justify-between px-5 pb-5 pt-5">
      <div className="flex items-center gap-3">
        {compact ? (
          <LogoMark />
        ) : (
          <div className="grid size-11 place-items-center rounded-full border-2 border-background bg-avatar text-sm font-bold text-foreground shadow-soft">
            LD
          </div>
        )}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {compact ? "PACTLY" : "Welcome back"}
          </p>
          <p className="font-display text-[18px] font-semibold leading-tight text-foreground">
            {compact ? "Smart escrow" : "Leonardo!"}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="relative size-11 rounded-full bg-card shadow-soft" aria-label="Notifications">
        <Bell className="size-5" />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card" />
      </Button>
    </header>
  );
}

function StatusPill({ status }: { status: EscrowStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
        status === "Disbursed" ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
      )}
    >
      <span className={cn("size-1.5 rounded-full", status === "Disbursed" ? "bg-success" : "bg-warning")} />
      {status}
    </span>
  );
}

function Dashboard({ escrows, onNavigate }: { escrows: Escrow[]; onNavigate: (view: View) => void }) {
  const quickActions = [
    { label: "Send / Lock", icon: LockKeyhole, action: () => onNavigate("send") },
    { label: "Request", icon: ArrowDownLeft, action: () => toast("Payment link created", { description: "Your request is ready to share." }) },
    { label: "Stats", icon: BarChart3, action: () => onNavigate("analytics") },
    { label: "Menu", icon: Menu, action: () => toast("More tools coming soon") },
  ];

  return (
    <motion.main key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="pb-32">
      <AppHeader />
      <section className="px-5">
        <div className="relative pb-5 pt-4">
          <div className="absolute inset-x-4 top-0 h-32 rotate-[-2deg] rounded-[1.75rem] bg-foreground shadow-deep" />
          <div className="balance-glow relative overflow-hidden rounded-[1.75rem] bg-primary px-6 pb-6 pt-7 text-primary-foreground shadow-orange">
            <div className="absolute -right-8 -top-10 size-36 rounded-full border border-primary-foreground/20" />
            <div className="absolute -right-1 top-8 size-20 rounded-full border border-primary-foreground/15" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-foreground/80">
                  <span>Available balance</span>
                  <span className="size-1 rounded-full bg-primary-foreground/60" />
                  <span>USDC</span>
                </div>
                <p className="mt-3 font-display text-[38px] font-bold leading-none tracking-normal">$12,034.98</p>
              </div>
              <WalletCards className="size-6" />
            </div>
            <div className="relative mt-8 flex items-center justify-between border-t border-primary-foreground/20 pt-4 text-xs font-medium">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4" /> Gasless protection</span>
              <span>•• 9421</span>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-4 gap-2.5">
          {quickActions.map(({ label, icon: Icon, action }) => (
            <Button key={label} variant="ghost" onClick={action} className="h-auto flex-col gap-2 rounded-2xl bg-card px-1 py-3 text-[10px] font-semibold shadow-soft hover:bg-card/80">
              <span className="grid size-9 place-items-center rounded-full bg-secondary text-foreground"><Icon className="size-4" /></span>
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Live contracts</p>
            <h2 className="font-display text-2xl font-bold">Escrow feed</h2>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="More escrow options"><MoreHorizontal /></Button>
        </div>
        <div className="space-y-3">
          {escrows.map((escrow) => {
            const Icon = escrow.trigger_type === "github" ? Github : escrow.trigger_type === "figma" ? Figma : Code2;
            const displayStatus: EscrowStatus = escrow.status === "disbursed" ? "Disbursed" : "Locked";
            return (
              <article key={escrow.id} className="rounded-3xl border border-border/70 bg-card/85 p-4 shadow-soft backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-foreground text-background"><Icon className="size-5" /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{escrow.title}</p><p className="truncate text-xs text-muted-foreground">{escrow.beneficiary_name} · {escrow.description}</p></div>
                  <p className="text-sm font-bold">{money(escrow.amount)}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                  <StatusPill status={displayStatus} />
                  <span className="text-[11px] font-medium text-muted-foreground">{displayStatus === "Locked" ? escrow.trigger_label : "Released"}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </motion.main>
  );
}

function AmountPad({ amount, setAmount }: { amount: string; setAmount: (value: string) => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"];
  const input = (key: string) => {
    if (key === "delete") return setAmount(amount.length > 1 ? amount.slice(0, -1) : "0");
    if (key === "." && amount.includes(".")) return;
    if (amount.includes(".") && amount.split(".")[1]?.length === 2) return;
    setAmount(amount === "0" && key !== "." ? key : `${amount}${key}`);
  };

  return (
    <div className="grid grid-cols-3 gap-x-5 gap-y-1 px-4">
      {keys.map((key) => (
        <Button key={key} variant="ghost" className="h-12 rounded-2xl font-display text-xl font-semibold hover:bg-secondary" onClick={() => input(key)} aria-label={key === "delete" ? "Delete digit" : `Enter ${key}`}>
          {key === "delete" ? <Delete className="size-5" /> : key}
        </Button>
      ))}
    </div>
  );
}

function SendLock({ onBack, onLocked, saving }: { onBack: () => void; onLocked: (amount: number, trigger: string) => void; saving: boolean }) {
  const [amount, setAmount] = useState("727");
  const [trigger, setTrigger] = useState("github");
  const formatted = useMemo(() => {
    const value = Number(amount || 0);
    return Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
  }, [amount]);

  const lockFunds = () => {
    if (Number(amount) < 50 || Number(amount) > 1000) {
      toast.error("Enter an amount from $50 to $1,000");
      return;
    }
    onLocked(Number(amount), trigger);
  };

  return (
    <motion.main key="send" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="min-h-screen pb-28">
      <header className="flex items-center justify-between px-5 py-5">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-11 rounded-full bg-card shadow-soft" aria-label="Go back"><ArrowLeft /></Button>
        <div className="text-center"><p className="font-display text-base font-bold">Send & lock</p><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Protected payment</p></div>
        <Button variant="ghost" size="icon" className="size-11 rounded-full" aria-label="More options"><MoreHorizontal /></Button>
      </header>

      <section className="px-5">
        <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card/80 p-4 shadow-soft backdrop-blur-xl">
          <div className="grid size-12 place-items-center rounded-full bg-avatar font-bold">JM</div>
          <div className="flex-1"><p className="text-xs text-muted-foreground">Beneficiary</p><p className="font-display text-base font-bold">Jessica Miles</p></div>
          <div className="grid size-8 place-items-center rounded-full bg-success-soft text-success"><Check className="size-4" /></div>
        </div>

        <div className="py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">You’re locking</p>
          <div className="mt-2 flex items-start justify-center">
            <span className="mt-2 font-display text-2xl font-semibold text-muted-foreground">$</span>
            <span className="font-display text-6xl font-bold leading-none tracking-normal">{formatted}</span>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success"><CircleDollarSign className="size-3.5" /> 1 USDC = $1.00</p>
        </div>

        <AmountPad amount={amount} setAmount={setAmount} />

        <div className="mt-6">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Release condition</label>
          <Select value={trigger} onValueChange={setTrigger}>
            <SelectTrigger className="h-16 rounded-2xl border-border bg-card px-4 shadow-soft">
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-secondary"><Code2 className="size-4" /></span><SelectValue /></div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="github">GitHub PR #42 Merged</SelectItem>
              <SelectItem value="figma">Figma Design Approved</SelectItem>
              <SelectItem value="staging">Staging Health-check Passed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={lockFunds} disabled={saving} className="mt-4 h-16 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-orange hover:bg-primary/90">
          <LockKeyhole className="size-5" /> {saving ? "Locking funds…" : "Lock funds in escrow"}
        </Button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Gas fees covered by Pactly · Settlement in USDC</p>
      </section>
    </motion.main>
  );
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.[0]) return null;
  return <div className="rounded-xl bg-foreground px-3 py-2 text-xs font-bold text-background shadow-deep">${payload[0].value.toLocaleString()}</div>;
}

function Analytics({ escrows }: { escrows: Escrow[] }) {
  const total = escrows.filter((escrow) => escrow.status === "disbursed").reduce((sum, escrow) => sum + escrow.amount, 0);
  return (
    <motion.main key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="pb-32">
      <AppHeader compact />
      <section className="px-5">
        <div className="flex items-end justify-between">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Escrow volume</p><h1 className="mt-1 font-display text-[40px] font-bold leading-none">{money(total)}</h1></div>
          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success"><ArrowUpRight className="size-3.5" /> 12.4%</span>
        </div>
        <div className="mt-6 h-60 overflow-hidden rounded-3xl border border-border/60 bg-card/80 px-2 pb-2 pt-5 shadow-soft backdrop-blur-xl">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 14, right: 12, left: 4, bottom: 0 }}>
              <defs><linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600 }} dy={8} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--primary)", strokeDasharray: "3 4" }} />
              <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fill="url(#volumeFill)" activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="mb-4 flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">This month</p><h2 className="font-display text-2xl font-bold">Counterparties</h2></div><Button variant="ghost" className="rounded-full px-3 text-xs">View all</Button></div>
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/75 px-4 shadow-soft backdrop-blur-xl">
          {escrows.slice(0, 3).map((escrow, index) => (
            <div key={escrow.id} className={cn("flex items-center gap-3 py-4", index !== Math.min(escrows.length, 3) - 1 && "border-b border-border/70")}>
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold">{escrow.beneficiary_initials}</div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{escrow.beneficiary_name}</p><p className="truncate text-xs text-muted-foreground">{escrow.trigger_label}</p></div>
              <div className="text-right"><p className="text-sm font-bold">{money(escrow.amount)}</p><p className={cn("text-[10px] font-bold", escrow.status === "disbursed" ? "text-success" : "text-warning")}>{escrow.status === "disbursed" ? "Released" : "Active"}</p></div>
            </div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

function BottomNav({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  const items = [
    { view: "dashboard" as const, label: "Home", icon: Home },
    { view: "send" as const, label: "Lock", icon: Plus },
    { view: "analytics" as const, label: "Stats", icon: BarChart3 },
  ];
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-around rounded-[1.7rem] border border-border/70 bg-nav/90 p-2 shadow-deep backdrop-blur-xl" aria-label="Primary navigation">
      {items.map(({ view: target, label, icon: Icon }) => (
        <Button key={target} variant="ghost" aria-label={label} onClick={() => onNavigate(target)} className={cn("h-12 min-w-20 rounded-2xl px-4 text-xs", view === target ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background" : "text-muted-foreground hover:bg-card")}>
          <Icon className="size-4" /> {view === target && label}
        </Button>
      ))}
    </nav>
  );
}

export function PactlyApp() {
  const [view, setView] = useState<View>("dashboard");
  const queryClient = useQueryClient();
  const { data: escrows = [], isLoading } = useQuery({ queryKey: escrowsQueryKey, queryFn: fetchEscrows });
  const githubEscrow = escrows.find((escrow) => escrow.trigger_type === "github" && escrow.status === "locked");

  const createEscrow = useMutation({
    mutationFn: async ({ amount, trigger }: { amount: number; trigger: string }) => {
      const labels: Record<string, string> = { github: "GitHub PR #42 Merged", figma: "Figma Design Approved", staging: "Staging Health-check Passed" };
      const titles: Record<string, string> = { github: "GitHub PR #42", figma: "Figma design approval", staging: "Staging deployment" };
      const { error } = await supabase.from("escrows").insert({ beneficiary_name: "Jessica Miles", beneficiary_initials: "JM", title: titles[trigger] ?? "Milestone payment", description: "New contract", amount, trigger_type: trigger, trigger_label: labels[trigger] ?? "Manual approval", status: "locked" });
      if (error) throw error;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: escrowsQueryKey });
      toast.success("Funds locked in escrow", { description: `${money(variables.amount)} is now protected and awaiting its trigger.` });
      navigate("dashboard");
    },
    onError: () => toast.error("Couldn’t lock funds", { description: "Please try again." }),
  });

  const disburseEscrow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("escrows").update({ status: "disbursed", disbursed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: escrowsQueryKey });
      navigate("dashboard");
      toast.success("GitHub PR merged", { description: "The escrow was disbursed to Jessica Miles instantly." });
    },
    onError: () => toast.error("Couldn’t release escrow", { description: "Please try again." }),
  });

  const navigate = (target: View) => {
    setView(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const simulateMerge = () => githubEscrow && disburseEscrow.mutate(githubEscrow.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-app shadow-shell">
        <div className="ambient-grid absolute inset-0 pointer-events-none" />
        <div className="relative">
          <AnimatePresence mode="wait">
            {view === "dashboard" && <Dashboard escrows={escrows} onNavigate={navigate} />}
            {view === "send" && <SendLock onBack={() => navigate("dashboard")} onLocked={(amount, trigger) => createEscrow.mutate({ amount, trigger })} saving={createEscrow.isPending} />}
            {view === "analytics" && <Analytics escrows={escrows} />}
          </AnimatePresence>
        </div>
        {githubEscrow && view !== "send" && !isLoading && (
          <Button onClick={simulateMerge} disabled={disburseEscrow.isPending} className="fixed bottom-20 left-1/2 z-30 h-11 -translate-x-1/2 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground shadow-orange hover:bg-primary/90">
            <Sparkles className="size-4" /> {disburseEscrow.isPending ? "Merging PR…" : "Simulate PR merge"}
          </Button>
        )}
        <BottomNav view={view} onNavigate={navigate} />
      </div>
    </div>
  );
}
