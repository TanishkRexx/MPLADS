import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileWarning,
  Gauge,
  IndianRupee,
  MapPin,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { projects } from "../data/projects";

const RISK = {
  High: "#e32626",
  Medium: "#f5a623",
  Low: "#16a34a",
};

const normalizeRisk = (project) => {
  const explicit = String(project?.riskLevel || "").trim().toLowerCase();
  if (explicit === "high") return "High";
  if (explicit === "medium") return "Medium";
  if (explicit === "low") return "Low";

  const score = Number(project?.riskScore || 0);
  if (score >= 61) return "High";
  if (score >= 31) return "Medium";
  return "Low";
};

const costInLakh = (project) => {
  const value = Number(project?.costValue || 0);
  // Supports both lakh-style values (14.89) and rupee values (1489000).
  return value > 100000 ? value / 100000 : value;
};

const expenditureInLakh = (project) => {
  const cost = costInLakh(project);
  const percent = Number(project?.expenditurePercent);

  if (Number.isFinite(percent)) {
    return cost * Math.max(0, percent) / 100;
  }

  const raw = project?.expenditure;
  if (typeof raw === "number") {
    return raw > 100000 ? raw / 100000 : raw;
  }

  if (raw) {
    const clean = String(raw).replace(/[₹,\s]/g, "").toLowerCase();
    const numeric = parseFloat(clean);
    if (Number.isFinite(numeric)) {
      return clean.includes("cr") ? numeric * 100 : numeric;
    }
  }

  return 0;
};

const riskColor = (risk) => RISK[risk] || RISK.Low;

const formatAmount = (lakh) => {
  const value = Number(lakh || 0);
  if (value >= 100) return `₹${(value / 100).toFixed(2)} Cr`;
  return `₹${value.toFixed(2)} Lakh`;
};

const formatCompact = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const safePercent = (value) =>
  Math.max(0, Math.min(100, Number(value || 0)));

const statusIs = (project, word) =>
  String(project?.status || "").toLowerCase().includes(word);

const fade = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <motion.section
      variants={fade}
      className={`rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#172943]">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.section>
  );
}

function KpiCard({ title, value, subtitle, icon: Icon, className, iconClass }) {
  return (
    <motion.div
      variants={fade}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-[18px] p-5 text-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] ${className}`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-white/75">
            {title}
          </p>
          <p className="mt-2 text-3xl font-black">{value}</p>
          <p className="mt-2 text-xs font-medium text-white/75">{subtitle}</p>
        </div>
        <div className={`rounded-2xl p-3 ${iconClass || "bg-white/15"}`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}

function RiskTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="font-bold text-slate-800">{item.state}</p>
      <p className="mt-1 text-sm text-slate-500">
        Average risk: <b className="text-slate-800">{item.risk}</b>
      </p>
      <p className="text-xs text-slate-400">{item.projects} projects</p>
    </div>
  );
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="font-bold text-slate-800">{item.category}</p>
      <p className="mt-1 text-sm text-red-600">
        {item.count} high-risk projects
      </p>
    </div>
  );
}

function ReportsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="font-bold text-slate-800">{item.state}</p>
      <p className="mt-1 text-sm text-orange-600">
        Count: {item.count} reports
      </p>
    </div>
  );
}

export default function NationalAnalytics() {
  const navigate = useNavigate();
  const [showAllStates, setShowAllStates] = useState(false);

  const analytics = useMemo(() => {
    const rows = projects.filter((p) => p?.state);

    const totalProjects = rows.length;
    const highRisk = rows.filter((p) => normalizeRisk(p) === "High");
    const mediumRisk = rows.filter((p) => normalizeRisk(p) === "Medium");
    const lowRisk = rows.filter((p) => normalizeRisk(p) === "Low");

    const delayed = rows.filter((p) => statusIs(p, "delayed")).length;
    const completed = rows.filter((p) => statusIs(p, "completed")).length;
    const ongoing = rows.filter(
      (p) => statusIs(p, "ongoing") || statusIs(p, "progress")
    ).length;

    const totalAllocated = rows.reduce((s, p) => s + costInLakh(p), 0);
    const totalExpenditure = rows.reduce(
      (s, p) => s + expenditureInLakh(p),
      0
    );

    const averageRisk = totalProjects
      ? Math.round(
          rows.reduce((s, p) => s + Number(p.riskScore || 0), 0) /
            totalProjects
        )
      : 0;

    const stateMap = {};
    rows.forEach((p) => {
      const state = p.state;
      if (!stateMap[state]) {
        stateMap[state] = {
          state,
          projects: 0,
          riskTotal: 0,
          high: 0,
          medium: 0,
          low: 0,
          allocated: 0,
          expenditure: 0,
        };
      }

      const risk = normalizeRisk(p);
      stateMap[state].projects += 1;
      stateMap[state].riskTotal += Number(p.riskScore || 0);
      stateMap[state][risk.toLowerCase()] += 1;
      stateMap[state].allocated += costInLakh(p);
      stateMap[state].expenditure += expenditureInLakh(p);
    });

    const states = Object.values(stateMap)
      .map((s) => ({
        ...s,
        risk: s.projects ? Math.round(s.riskTotal / s.projects) : 0,
        utilization:
          s.allocated > 0 ? (s.expenditure / s.allocated) * 100 : 0,
      }))
      .sort((a, b) => b.risk - a.risk);

    const categoryMap = {};
    highRisk.forEach((p) => {
      const category = p.workcategory || "Other";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    let reports = [];
    try {
      reports = JSON.parse(
        localStorage.getItem("mplads_public_reports") || "[]"
      );
    } catch {
      reports = [];
    }

    const reportMap = {};
    reports.forEach((r) => {
      const state = r.state || r.projectState || "Unknown";
      reportMap[state] = (reportMap[state] || 0) + 1;
    });

    const reportsByState = Object.entries(reportMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);

    const topProjects = [...rows]
      .sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0))
      .slice(0, 5);

    const progressProjects = [...rows]
      .sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0))
      .slice(0, 6)
      .map((p) => ({
        name: p.name || p.id,
        financial: safePercent(p.expenditurePercentage),
        physical: safePercent(p.physicalProgress),
      }));

    return {
      rows,
      totalProjects,
      highRisk,
      mediumRisk,
      lowRisk,
      delayed,
      completed,
      ongoing,
      totalAllocated,
      totalExpenditure,
      averageRisk,
      utilization:
        totalAllocated > 0 ? (totalExpenditure / totalAllocated) * 100 : 0,
      states,
      categoryData,
      reportsByState,
      reportsCount: reports.length,
      topProjects,
      progressProjects,
    };
  }, []);

  const heatmapData = showAllStates
    ? analytics.states
    : analytics.states.slice(0, 15);

  const riskRanking = analytics.states.slice(0, 12);

  const categoryData = analytics.categoryData.slice(0, 9);

  const riskPie = [
    { name: "High", value: analytics.highRisk.length },
    { name: "Medium", value: analytics.mediumRisk.length },
    { name: "Low", value: analytics.lowRisk.length },
  ];

  const openState = (state) => {
    navigate(`/analytics/state/${encodeURIComponent(state)}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8"
      >
        <motion.header variants={fade} className="mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-orange-600">
                INTELLIGENCE ANALYTICS
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#10213b] sm:text-4xl">
                National Project Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Cross-state risk intelligence — charts react to the project dataset.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-3 text-sm font-semibold shadow-sm">
              <MapPin size={16} className="text-slate-500" />
              All States (National)
            </div>
          </div>
        </motion.header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="AVERAGE RISK SCORE"
            value={analytics.averageRisk}
            subtitle="National average"
            icon={Gauge}
            className="bg-gradient-to-br from-[#e6002d] to-[#d5002b]"
          />
          <KpiCard
            title="HIGH RISK PROJECTS"
            value={analytics.highRisk.length}
            subtitle={`of ${analytics.totalProjects} in scope`}
            icon={ShieldAlert}
            className="bg-gradient-to-br from-[#254b76] to-[#112c4f]"
          />
          <KpiCard
            title="DELAYED PROJECTS"
            value={analytics.delayed}
            subtitle="Beyond expected completion"
            icon={Clock3}
            className="bg-gradient-to-br from-[#ef7600] to-[#c95700]"
          />
          <KpiCard
            title="CITIZEN REPORTS"
            value={analytics.reportsCount}
            subtitle="Submitted evidence"
            icon={FileWarning}
            className="bg-gradient-to-br from-[#625d57] to-[#c95700]"
            iconClass="bg-blue-50 text-[#244a78]"
          />
        </div>

        <SectionCard
          title="State Risk Heatmap"
          subtitle="Average AI risk score per state — click a state to open its analytics"
          className="mt-6"
        >
          <div className="mb-4 flex justify-end gap-4 text-[11px] font-semibold text-slate-400">
            {["Low", "Medium", "High"].map((risk) => (
              <span key={risk} className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: riskColor(risk) }}
                />
                {risk}
              </span>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {heatmapData.map((item, index) => {
              const risk =
                item.risk >= 61 ? "High" : item.risk >= 31 ? "Medium" : "Low";

              return (
                <motion.button
                  layout
                  key={item.state}
                  type="button"
                  onClick={() => openState(item.state)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.025, duration: 0.3 }}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative min-h-[86px] overflow-hidden rounded-xl p-3 text-left text-white shadow-sm"
                  style={{ backgroundColor: riskColor(risk) }}
                >
                  <span className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                  <p className="relative truncate text-xs font-bold">{item.state}</p>
                  <div className="relative mt-3 flex items-end justify-between">
                    <span className="text-2xl font-black">{item.risk}</span>
                    <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold">
                      {item.high} high
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {analytics.states.length > 15 && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllStates((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {showAllStates ? "Show Less" : `Show More (${analytics.states.length - 15} states)`}
                {showAllStates ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}
        </SectionCard>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Average Risk Score by State"
            subtitle="National ranking — descending"
          >
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskRanking} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
                  <CartesianGrid stroke="#e5eaf1" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis
                    type="category"
                    dataKey="state"
                    width={105}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <Tooltip content={<RiskTooltip />} />
                  <Bar dataKey="risk" radius={[0, 7, 7, 0]} animationDuration={1200}>
                    {riskRanking.map((item) => (
                      <Cell
                        key={item.state}
                        fill={
                          item.risk >= 61
                            ? RISK.High
                            : item.risk >= 31
                            ? RISK.Medium
                            : RISK.Low
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard
            title="High-Risk Projects by Category"
            subtitle="Categories represented in the current projects.js dataset"
          >
            <div className="h-[350px]">
              {categoryData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 55 }}>
                    <CartesianGrid stroke="#e5eaf1" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="category"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={75}
                      tick={{ fontSize: 9, fill: "#64748b" }}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip content={<CategoryTooltip />} />
                    <Bar dataKey="count" fill="#df2427" radius={[6, 6, 0, 0]} animationDuration={1300} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No high-risk category data available.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Citizen Reports by State"
          subtitle="Evidence volume flowing through the public-report pipeline"
          className="mt-6"
        >
          <div className="h-[300px]">
            {analytics.reportsByState.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.reportsByState} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                  <CartesianGrid stroke="#e5eaf1" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="state" angle={-15} textAnchor="end" height={60} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip content={<ReportsTooltip />} />
                  <Bar dataKey="count" fill="#f97316" radius={[7, 7, 0, 0]} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FileWarning className="text-slate-300" size={32} />
                <p className="mt-3 text-sm font-semibold text-slate-500">No citizen reports yet</p>
                <p className="mt-1 text-xs text-slate-400">Reports will appear here after citizens submit evidence.</p>
              </div>
            )}
          </div>
        </SectionCard>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionCard title="Project Risk Scores" subtitle="All monitored works, ranked">
            <div className="space-y-3">
              {analytics.topProjects.map((project, index) => {
                const risk = normalizeRisk(project);
                return (
                  <motion.button
                    key={project.id}
                    type="button"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    whileHover={{ x: 4 }}
                    className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-md"
                  >
                    <span className="w-5 text-xs font-bold text-slate-400">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-700">{project.name}</p>
                      <p className="mt-1 truncate text-[11px] text-slate-400">
                        {project.state} · {project.district || "District unavailable"}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-bold"
                      style={{
                        color: riskColor(risk),
                        backgroundColor: `${riskColor(risk)}18`,
                      }}
                    >
                      {Number(project.riskScore || 0)}
                    </span>
                    <ArrowRight size={15} className="text-slate-300 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Financial vs Physical Progress" subtitle="Highest-risk projects in the current dataset">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.progressProjects} margin={{ top: 10, right: 10, left: -15, bottom: 45 }}>
                  <CartesianGrid stroke="#e5eaf1" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-20}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 9, fill: "#64748b" }}
                    tickFormatter={(v) => String(v).slice(0, 18)}
                  />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip formatter={(v) => `${Number(v).toFixed(0)}%`} />
                  <Legend />
                  <Bar dataKey="financial" name="Expenditure" fill="#f47b16" radius={[5, 5, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="physical" name="Physical" fill="#19395f" radius={[5, 5, 0, 0]} animationDuration={1250} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="National Financial Snapshot"
          subtitle="Calculated directly from projects.js"
          className="mt-6"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Total Allocation", formatAmount(analytics.totalAllocated), Wallet],
              ["Total Expenditure", formatAmount(analytics.totalExpenditure), IndianRupee],
              ["Fund Utilization", `${analytics.utilization.toFixed(1)}%`, Activity],
            ].map(([label, value, Icon]) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-md"
              >
                <Icon size={19} className="text-blue-600" />
                <p className="mt-4 text-xs font-semibold text-slate-400">{label}</p>
                <p className="mt-1 text-xl font-black text-slate-800">{value}</p>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </motion.main>
    </div>
  );
}
