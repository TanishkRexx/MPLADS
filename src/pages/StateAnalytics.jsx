import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileWarning,
  Gauge,
  IndianRupee,
  MapPin,
  ShieldAlert,
  Target,
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

const COLORS = {
  High: "#e32626",
  Medium: "#d97706",
  Low: "#16a34a",
};

const normalizeRisk = (project) => {
  const explicit = String(project?.riskLevel || "").trim().toLowerCase();
  if (explicit === "high") return "High";
  if (explicit === "medium") return "Medium";
  if (explicit === "low") return "Low";

  const score = Number(project?.riskScore || 0);
  if (score >= 51) return "High";
  if (score >= 31) return "Medium";
  return "Low";
};

const costInLakh = (project) => {
  const value = Number(project?.costValue || 0);
  return value > 100000 ? value / 100000 : value;
};

const expenditureInLakh = (project) => {
  const cost = costInLakh(project);
  const percent = Number(project?.expenditurePercent);

  if (Number.isFinite(percent)) {
    return cost * Math.max(0, percent) / 100;
  }

  const raw = project?.expenditure;
  if (typeof raw === "number") return raw > 100000 ? raw / 100000 : raw;

  if (raw) {
    const clean = String(raw).replace(/[₹,\s]/g, "").toLowerCase();
    const numeric = parseFloat(clean);
    if (Number.isFinite(numeric)) return clean.includes("cr") ? numeric * 100 : numeric;
  }

  return 0;
};

const formatAmount = (value) => {
  const n = Number(value || 0);
  if (n >= 100) return `₹${(n / 100).toFixed(2)} Cr`;
  return `₹${n.toFixed(2)} Lakh`;
};

const percent = (value) => Math.max(0, Math.min(100, Number(value || 0)));

const isStatus = (p, value) =>
  String(p?.status || "").toLowerCase().includes(value);

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Card({ title, subtitle, children, className = "" }) {
  return (
    <motion.section
      variants={fade}
      className={`rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#172943]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}

function Kpi({ title, value, subtitle, icon: Icon, className }) {
  return (
    <motion.div
      variants={fade}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-[18px] p-5 text-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] ${className}`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-white/75">{title}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
          <p className="mt-2 text-xs font-medium text-white/75">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-white/15 p-3"><Icon size={20} /></div>
      </div>
    </motion.div>
  );
}

export default function StateAnalytics() {
  const navigate = useNavigate();
  const { stateName } = useParams();
  const selectedState = decodeURIComponent(stateName || "");

  const stateProjects = useMemo(
    () => projects.filter((p) => p.state === selectedState),
    [selectedState]
  );

  const data = useMemo(() => {
    const total = stateProjects.length;

    const high = stateProjects.filter((p) => normalizeRisk(p) === "High");
    const medium = stateProjects.filter((p) => normalizeRisk(p) === "Medium");
    const low = stateProjects.filter((p) => normalizeRisk(p) === "Low");

    const completed = stateProjects.filter((p) => isStatus(p, "completed")).length;
    const delayed = stateProjects.filter((p) => isStatus(p, "delayed")).length;
    const underInvestigation = stateProjects.filter(
      (p) => isStatus(p, "investigation")
    ).length;
    const ongoing = stateProjects.filter(
      (p) => isStatus(p, "ongoing") || isStatus(p, "progress")
    ).length;

    const allocated = stateProjects.reduce((s, p) => s + costInLakh(p), 0);
    const expenditure = stateProjects.reduce((s, p) => s + expenditureInLakh(p), 0);

    const averageRisk = total
      ? Math.round(stateProjects.reduce((s, p) => s + Number(p.riskScore || 0), 0) / total)
      : 0;

    const avgPhysical = total
      ? Math.round(
          stateProjects.reduce((s, p) => s + Number(p.physicalProgress || 0), 0) / total
        )
      : 0;

    const categoryMap = {};
    stateProjects.forEach((p) => {
      const category = p.workcategory || "Other";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const riskData = [
      { name: "High", value: high.length },
      { name: "Medium", value: medium.length },
      { name: "Low", value: low.length },
    ];

    let reports = [];
    try {
      reports = JSON.parse(localStorage.getItem("mplads_public_reports") || "[]");
    } catch {
      reports = [];
    }

    const stateReports = reports.filter(
      (r) => (r.state || r.projectState) === selectedState
    );

    const riskProjects = [...stateProjects]
      .sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0));

    const progressData = riskProjects.slice(0, 6).map((p) => ({
      name: p.name || p.id,
      financial: percent(p.expenditurePercent),
      physical: percent(p.physicalProgress),
    }));

    return {
      total,
      high,
      medium,
      low,
      completed,
      delayed,
      underInvestigation,
      ongoing,
      allocated,
      expenditure,
      utilization: allocated > 0 ? (expenditure / allocated) * 100 : 0,
      averageRisk,
      avgPhysical,
      categoryData,
      riskData,
      reports: stateReports,
      riskProjects,
      progressData,
    };
  }, [stateProjects, selectedState]);

  if (!stateProjects.length) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <MapPin className="mx-auto text-slate-300" size={42} />
          <h1 className="mt-4 text-2xl font-black text-slate-800">State not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            No projects in projects.js match “{selectedState}”.
          </p>
          <button
            onClick={() => navigate("/analytics")}
            className="mt-6 rounded-xl bg-[#132a49] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Back to National Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07 } },
        }}
        className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8"
      >
        <motion.button
          variants={fade}
          onClick={() => navigate("/analytics")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-all duration-300 hover:-translate-x-1 hover:text-slate-800"
        >
          <ArrowLeft size={17} />
          National analytics
        </motion.button>

        <motion.header
          variants={fade}
          className="relative overflow-hidden rounded-[24px] bg-[#030c1b] px-7 py-8 text-white shadow-lg sm:px-8"
        >
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-orange-400">
                <MapPin size={14} />
                STATE INTELLIGENCE BRIEF
              </p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">{selectedState}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                  {data.completed} completed
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200">
                  {data.ongoing} ongoing
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                  {data.delayed} delayed
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-orange-500 px-7 py-4 text-center shadow-lg">
              <p className="text-[10px] font-bold tracking-widest text-white/80">AVERAGE RISK</p>
              <p className="text-4xl font-black">{data.averageRisk}</p>
              <p className="text-[10px] font-semibold text-white/80">across {data.total} projects</p>
            </div>
          </div>
        </motion.header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            title="TOTAL PROJECTS"
            value={data.total}
            subtitle="Monitored works"
            icon={Building2}
            className="bg-gradient-to-br from-[#254b76] to-[#112c4f]"
          />
          <Kpi
            title="HIGH RISK"
            value={data.high.length}
            subtitle="Priority investigation"
            icon={ShieldAlert}
            className="bg-gradient-to-br from-[#e6002d] to-[#d5002b]"
          />
          <Kpi
            title="UNDER INVESTIGATION"
            value={data.underInvestigation}
            subtitle="Active investigation"
            icon={Target}
            className="bg-gradient-to-br from-[#ef7600] to-[#c95700]"
          />
          <Kpi
            title="CITIZEN REPORTS"
            value={data.reports.length}
            subtitle="State evidence reports"
            icon={FileWarning}
            className="bg-gradient-to-br from-[#625d57] to-[#c95700]"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card title="Risk Distribution" subtitle={`${selectedState} — AI classification`}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.riskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={2}
                    animationBegin={100}
                    animationDuration={1200}
                  >
                    {data.riskData.map((item) => (
                      <Cell key={item.name} fill={COLORS[item.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={28} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Category Distribution" subtitle="Development sectors in state">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={2}
                    animationBegin={150}
                    animationDuration={1250}
                  >
                    {data.categoryData.map((item, index) => (
                      <Cell key={item.name} fill={["#19395f", "#f97316", "#16a34a", "#6486b5", "#eab308", "#7c3aed"][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={32} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card title="Project Risk Scores" subtitle="All monitored works, ranked">
            <div className="h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.riskProjects}
                  margin={{ top: 10, right: 15, left: -10, bottom: 55 }}
                >
                  <CartesianGrid stroke="#e5eaf1" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-20}
                    textAnchor="end"
                    height={75}
                    tick={{ fontSize: 9, fill: "#64748b" }}
                    tickFormatter={(v) => String(v).slice(0, 20)}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip />
                  <Bar dataKey="riskScore" name="Risk Score" radius={[7, 7, 0, 0]} animationDuration={1200}>
                    {data.riskProjects.map((p) => (
                      <Cell key={p.id} fill={COLORS[normalizeRisk(p)]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Financial vs Physical Progress" subtitle="Highest-risk projects">
            <div className="h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.progressData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 55 }}
                >
                  <CartesianGrid stroke="#e5eaf1" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-20}
                    textAnchor="end"
                    height={75}
                    tick={{ fontSize: 9, fill: "#64748b" }}
                    tickFormatter={(v) => String(v).slice(0, 17)}
                  />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip formatter={(v) => `${Number(v).toFixed(0)}%`} />
                  <Legend />
                  <Bar dataKey="financial" name="Expenditure" fill="#f47b16" radius={[5, 5, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="physical" name="Physical" fill="#19395f" radius={[5, 5, 0, 0]} animationDuration={1250} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card title="Projects in State" subtitle={`${data.total} monitored works`} className="mt-6">
          <div className="divide-y divide-slate-100">
            {data.riskProjects.map((project, index) => {
              const risk = normalizeRisk(project);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                  className="group flex flex-col gap-3 py-4 transition-all duration-300 hover:px-2 hover:bg-slate-50 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#6486b5]">{project.id}</span>
                      <span className="text-sm font-bold text-slate-800">{project.name}</span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} />
                      {project.district || project.location || "Location unavailable"}
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                    {project.status || "Unknown"}
                  </span>

                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      color: COLORS[risk],
                      backgroundColor: `${COLORS[risk]}15`,
                    }}
                  >
                    {Number(project.riskScore || 0)} {risk} Risk
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071a33] px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#102c4f] hover:shadow-lg"
                  >
                    Investigate
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card title="State Financial Snapshot" subtitle="Calculated directly from projects.js" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Allocation", formatAmount(data.allocated), Wallet],
              ["Expenditure", formatAmount(data.expenditure), IndianRupee],
              ["Utilization", `${data.utilization.toFixed(1)}%`, Gauge],
              ["Physical Progress", `${data.avgPhysical}%`, CheckCircle2],
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
        </Card>
      </motion.main>
    </div>
  );
}
