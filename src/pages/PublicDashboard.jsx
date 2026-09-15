import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateWiseAllocation from "../components/StateWiseAllocation";

import {
  Building2,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Flag,
  MapPin,
  ArrowRight,
  FolderOpen,
  Database,
  BellRing,
  Search,
  Brain,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { projects } from "../data/projects";


/* =========================================================
   INTERACTIVE RISK DONUT
========================================================= */

function RiskDonut({ projects }) {
  const [hovered, setHovered] = useState(null);

  const riskData = useMemo(() => {
    const getRiskScore = (project) => {
      return Number(
        project.riskScore ??
          project.risk_score ??
          project.risk ??
          project.aiRiskScore ??
          0
      );
    };

    const low = projects.filter((project) => {
      const score = getRiskScore(project);
      return score >= 0 && score <= 30;
    }).length;

    const medium = projects.filter((project) => {
      const score = getRiskScore(project);
      return score > 30 && score <= 40;
    }).length;

    const high = projects.filter((project) => {
      const score = getRiskScore(project);
      return score > 50;
    }).length;

    return [
      {
        name: "Low",
        value: low,
        color: "#1d9254",
        description: "Projects showing lower levels of risk indicators",
      },
      {
        name: "Medium",
        value: medium,
        color: "#d97706",
        description: "Projects with moderate patterns requiring attention",
      },
      {
        name: "High",
        value: high,
        color: "#e52525",
        description: "Projects with stronger risk indicators",
      },
    ];
  }, [projects]);

  const total =
    riskData.reduce((sum, item) => sum + item.value, 0) || 1;

  const radius = 82;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div className="flex flex-col items-center">

      {/* DONUT */}
      <div className="relative flex h-[270px] w-[270px] items-center justify-center">

        <svg
          width="270"
          height="270"
          viewBox="0 0 270 270"
          className="-rotate-90 overflow-visible"
        >
          {/* Background */}
          <circle
            cx="135"
            cy="135"
            r={radius}
            fill="none"
            stroke="#edf1f5"
            strokeWidth={strokeWidth}
          />

          {/* RISK SEGMENTS */}
          {riskData.map((item, index) => {
            const percentage = item.value / total;

            const segmentLength =
              percentage * circumference;

            const gap = 8;

            const offset =
              -(accumulated * circumference);

            accumulated += percentage;

            const active = hovered === index;

            return (
              <circle
                key={item.name}
                cx="135"
                cy="135"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={
                  active
                    ? strokeWidth + 6
                    : strokeWidth
                }
                strokeLinecap="butt"
                strokeDasharray={`
                  ${Math.max(segmentLength - gap, 0)}
                  ${circumference}
                `}
                strokeDashoffset={offset}
                className="cursor-pointer transition-all duration-300"
                style={{
                  filter: active
                    ? `drop-shadow(0px 5px 7px ${item.color}55)`
                    : "none",

                  transformOrigin: "center",

                  transform: active
                    ? "scale(1.035)"
                    : "scale(1)",
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>


        {/* CENTER */}
        <div className="absolute flex flex-col items-center justify-center">

          {hovered !== null ? (
            <>
              <div
                className="text-3xl font-bold transition-all duration-300"
                style={{
                  color: riskData[hovered].color,
                }}
              >
                {riskData[hovered].value}
              </div>

              <div className="mt-1 text-[10px] font-bold tracking-[0.22em] text-slate-400">
                {riskData[hovered].name.toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-[#24364d]">
                {projects.length}
              </div>

              <div className="mt-1 text-[10px] font-bold tracking-[0.22em] text-slate-400">
                PROJECTS
              </div>
            </>
          )}

        </div>

      </div>


      {/* HOVER INFO */}

      <div className="min-h-[42px] text-center">

        {hovered !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

            <p
              className="text-sm font-semibold"
              style={{
                color: riskData[hovered].color,
              }}
            >
              {riskData[hovered].name} Risk
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {riskData[hovered].description}
            </p>

          </div>
        )}

      </div>


      {/* LEGEND */}

      <div className="mt-3 flex items-center justify-center gap-5">

        {riskData.map((item, index) => (
          <button
            key={item.name}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className={`
              flex items-center gap-2 rounded-lg px-2 py-1
              transition-all duration-300

              ${
                hovered === index
                  ? "scale-110 bg-slate-100 shadow-sm"
                  : "hover:scale-105"
              }
            `}
          >

            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />

            <span className="text-sm font-medium text-slate-500">
              {item.name}
            </span>

            <span className="text-sm font-bold text-slate-700">
              {item.value}
            </span>

          </button>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  iconBg,
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6
        text-white shadow-lg transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        ${color}
      `}
    >

      {/* Background circle */}

      <div
        className="
          absolute -right-5 -top-5
          h-24 w-24 rounded-full
          bg-white/10
        "
      />


      {/* ICON */}

      <div
        className={`
          absolute right-5 top-5
          flex h-12 w-12 items-center justify-center
          rounded-xl
          ${iconBg}
        `}
      >
        {icon}
      </div>


      {/* CONTENT */}

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {value}
      </h2>

      <p className="mt-3 text-sm text-white/75">
        {subtitle}
      </p>

    </div>
  );
}


/* =========================================================
   RISK BAR
========================================================= */

function RiskBar({
  label,
  value,
  percentage,
  color,
  hoverText,
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="
        rounded-xl px-3 py-2
        transition-all duration-300
        hover:bg-slate-50
      "
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >

      <div className="mb-2 flex justify-between text-sm">

        <span className="font-medium text-slate-600">
          {label}
        </span>

        <span className="font-bold text-slate-700">
          {value}
        </span>

      </div>


      <div className="h-3 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,

            transform: hover
              ? "scaleY(1.25)"
              : "scaleY(1)",

            boxShadow: hover
              ? `0 0 12px ${color}88`
              : "none",
          }}
        />

      </div>


      {hover && hoverText && (
        <p className="mt-2 text-xs text-slate-500">
          {hoverText}
        </p>
      )}

    </div>
  );
}


/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function PublicDashboard() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Citizen";


  /* =====================================================
     PROJECT HELPERS
  ===================================================== */

  const getProjectName = (project) => {
    return (
      project.projectName ||
      project.project_name ||
      project.name ||
      project.title ||
      "Unnamed Project"
    );
  };


  const getState = (project) => {
    return (
      project.state ||
      "India"
    );
  };


  const getDistrict = (project) => {
    return (
      project.district ||
      project.location ||
      ""
    );
  };


  const getRiskScore = (project) => {
    return Number(
      project.riskScore ??
        project.risk_score ??
        project.risk ??
        project.aiRiskScore ??
        0
    );
  };


  const highRiskProjects = [...projects]
    .filter(
      (project) => getRiskScore(project) > 60
    )
    .sort(
      (a, b) =>
        getRiskScore(b) -
        getRiskScore(a)
    )
    .slice(0, 4);


  /* =====================================================
     STATE RISK DATA
  ===================================================== */

  const stateRiskMap = {};

  projects.forEach((project) => {
    const state = getState(project);

    const score = getRiskScore(project);

    if (!stateRiskMap[state]) {
      stateRiskMap[state] = 0;
    }

    if (score > 60) {
      stateRiskMap[state] += 1;
    }
  });


  const stateRiskData =
    Object.entries(stateRiskMap)
      .map(([state, value]) => ({
        state,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);


  const maxStateRisk =
    Math.max(
      ...stateRiskData.map(
        (item) => item.value
      ),
      1
    );


  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <main className="mx-auto max-w-[1450px] px-6 pb-16 pt-8">


        {/* =============================================
            WELCOME HERO
        ============================================== */}

        <section
          className="
            relative overflow-hidden rounded-[26px]
            border border-slate-800
            bg-[#091321]
            px-9 py-9
            shadow-xl
          "
        >

          {/* GRID */}

          <div
            className="
              absolute inset-0 opacity-20
              [background-image:linear-gradient(#334155_1px,transparent_1px),linear-gradient(90deg,#334155_1px,transparent_1px)]
              [background-size:48px_48px]
            "
          />


          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">


            {/* TEXT */}

            <div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-[11px] font-bold tracking-[0.2em] text-orange-300">
                  CITIZEN OVERSIGHT CONSOLE
                </span>

              </div>


              <h1 className="mt-4 text-4xl font-bold text-white">

                Welcome, Citizens

              </h1>


              <p className="mt-3 max-w-[600px] text-[15px] leading-relaxed text-slate-300">

                Track every sanctioned MPLADS work in your district,
                understand AI risk flags and report anything that
                doesn't add up.

              </p>

            </div>


            {/* BUTTONS */}

            <div className="flex flex-wrap gap-3">


              <button
                onClick={() =>
                  navigate("/projects")
                }
                className="
                  flex items-center gap-2 rounded-xl
                  bg-orange-500 px-7 py-4
                  font-semibold text-slate-900
                  shadow-lg shadow-orange-500/20
                  transition-all duration-300
                  hover:-translate-y-1 hover:bg-orange-400
                "
              >

                <Eye size={19} />

                Browse Projects

              </button>


              <button
                onClick={() =>
                  navigate("/projects")
                }
                className="
                  flex items-center gap-2 rounded-xl
                  border border-slate-600
                  bg-white/5 px-7 py-4
                  font-semibold text-white
                  transition-all duration-300
                  hover:border-orange-400
                  hover:bg-white/10
                "
              >

                <Flag size={19} className="text-orange-400" />

                Report a Project

              </button>


            </div>

          </div>

        </section>



        {/* =============================================
            NATIONAL STATS
        ============================================== */}

        <section className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">


          <StatCard
            title="Total Projects"
            value="1,199"
            subtitle="Across 545 constituencies"
            color="bg-[#263e5c]"
            iconBg="bg-white/10"
            icon={<Building2 size={23} />}
          />


          <StatCard
            title="Sanctioned Amount"
            value="₹2,850 Cr"
            subtitle="Total funds sanctioned"
            color="bg-[#0d8550]"
            iconBg="bg-white/10"
            icon={<IndianRupee size={23} />}
          />


          <StatCard
            title="Reported Expenditure"
            value="₹2,410 Cr"
            subtitle="As reported by agencies"
            color="bg-[#d86400]"
            iconBg="bg-white/10"
            icon={<TrendingUp size={23} />}
          />


          <StatCard
            title="Completed Projects"
            value="1,026"
            subtitle="73% completion rate"
            color="bg-[#16854d]"
            iconBg="bg-white/10"
            icon={<CheckCircle2 size={23} />}
          />


          <StatCard
            title="Under Progress"
            value="100"
            subtitle="Active implementation"
            color="bg-[#e57a00]"
            iconBg="bg-white/10"
            icon={<TrendingUp size={23} />}
          />


          {/* <StatCard
            title="Risk Indicators"
            value="3,240"
            subtitle="Unusual patterns in public data"
            color="bg-[#dc0028]"
            iconBg="bg-white/10"
            icon={<AlertTriangle size={23} />}
          /> */}

        </section>



        {/* =============================================
            TOP DASHBOARD GRID
        ============================================== */}

        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">


          {/* ===========================================
              RISK OVERVIEW
          ============================================ */}

          <div
            className="
              rounded-[22px]
              border border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-shadow
              hover:shadow-md
            "
          >

            <h2 className="text-lg font-bold text-slate-700">
              National Risk Overview
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              AI classification of monitored works
            </p>


            <RiskDonut
              projects={projects}
            />

          </div>



          {/* ===========================================
              PROJECTS NEEDING ATTENTION
          ============================================ */}

          <div
            className="
              rounded-[22px]
              border border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-700">
                  Projects Needing Attention
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Highest AI risk scores right now
                </p>

              </div>


              <button
                onClick={() =>
                  navigate("/projects")
                }
                className="
                  rounded-xl border border-slate-200
                  px-4 py-2 text-sm font-medium
                  text-slate-600
                  transition-all
                  hover:border-orange-400
                  hover:text-orange-600
                "
              >
                View all
              </button>

            </div>


            <div className="mt-5 space-y-1">


              {highRiskProjects.length > 0 ? (

                highRiskProjects.map(
                  (project, index) => (

                    <button
                      key={
                        project.id ||
                        project._id ||
                        index
                      }
                      onClick={() =>
                        navigate("/projects")
                      }
                      className="
                        flex w-full items-center gap-4
                        rounded-xl p-3 text-left
                        transition-all duration-200
                        hover:bg-slate-50
                        hover:shadow-sm
                      "
                    >

                      {/* SCORE */}

                      <div
                        className="
                          flex h-10 w-10 shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-red-600
                          font-bold text-white
                        "
                      >
                        {getRiskScore(project)}
                      </div>


                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-slate-700">

                          {getProjectName(project)}

                        </p>


                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">

                          <MapPin size={12} />

                          {getDistrict(project)}

                          {getDistrict(project) &&
                            ", "}

                          {getState(project)}

                        </div>

                      </div>


                      <ArrowRight
                        size={17}
                        className="text-slate-300"
                      />

                    </button>

                  )
                )

              ) : (

                <div className="py-16 text-center">

                  <ShieldCheck
                    size={35}
                    className="mx-auto text-emerald-500"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    No high risk projects found.
                  </p>

                </div>

              )}

            </div>

          </div>



          {/* ===========================================
              MY REPORTS
          ============================================ */}

          <div
            className="
              rounded-[22px]
              border border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-700">
                  My Submitted Reports
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your citizen evidence pipeline
                </p>

              </div>


              <span
                className="
                  rounded-full bg-slate-100
                  px-3 py-1 text-xs
                  font-semibold text-slate-500
                "
              >
                0 filed
              </span>

            </div>


            <div
              className="
                mt-5 flex min-h-[260px]
                flex-col items-center
                justify-center
                rounded-2xl
                border border-dashed
                border-slate-300
                px-6 text-center
              "
            >

              <div
                className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-500
                "
              >
                <FolderOpen size={25} />
              </div>


              <p className="mt-4 text-sm leading-relaxed text-slate-500">

                No reports yet. Spot an incomplete work?

                <br />

                Upload photo evidence and let AI verify it.

              </p>


              <button
                onClick={() =>
                  navigate("/projects")
                }
                className="
                  mt-5 flex items-center gap-2
                  rounded-xl bg-red-600
                  px-5 py-3 text-sm
                  font-semibold text-white
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:bg-red-700
                "
              >

                <Flag size={16} />

                Report a Project

              </button>

            </div>

          </div>

        </section>
        
        <StateWiseAllocation />


        {/* =============================================
            RISK INSIGHTS
        ============================================== */}

        <section className="mt-12">

          <div className="flex items-end justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-800">
                Risk Insights
              </h2>

              <p className="mt-2 max-w-[700px] leading-relaxed text-slate-500">

                Unusual patterns identified from available public project
                data. Risk indicators do not establish fraud, misconduct
                or wrongdoing.

              </p>

            </div>


            <button
              onClick={() =>
                navigate("/risk-insights")
              }
              className="
                hidden font-semibold text-blue-700
                transition-all hover:translate-x-1
                md:block
              "
            >

              View all →

            </button>

          </div>



          <div className="mt-8 grid gap-6 lg:grid-cols-2">


            {/* ===========================================
                RISK DISTRIBUTION
            ============================================ */}

            <div
              className="
                rounded-[22px]
                border border-slate-200
                bg-white
                p-7
                shadow-sm
              "
            >

              <h3 className="text-lg font-semibold text-slate-700">
                Risk Indicator Distribution
              </h3>


              <div className="mt-5 space-y-4">

                <RiskBar
                  label="Low (0–29)"
                  value="58,420 (69.4%)"
                  percentage={100}
                  color="#24944e"
                  hoverText="Most projects show no unusual patterns in available public data."
                />


                <RiskBar
                  label="Moderate (30–59)"
                  value="15,920 (18.9%)"
                  percentage={28}
                  color="#d97706"
                  hoverText="Moderate indicators may require additional monitoring."
                />


                <RiskBar
                  label="High (60–79)"
                  value="7,630 (9.1%)"
                  percentage={14}
                  color="#f05209"
                  hoverText="Multiple unusual indicators were detected."
                />


                <RiskBar
                  label="Critical (80–100)"
                  value="2,240 (2.6%)"
                  percentage={4}
                  color="#dc2626"
                  hoverText="Strong indicators detected. Requires closer review."
                />

              </div>


              <p className="mt-6 text-sm text-slate-500">

                69.4% of projects show no unusual patterns in
                available public data.

              </p>

            </div>



            {/* ===========================================
                STATES WITH RISK
            ============================================ */}

            <div
              className="
                rounded-[22px]
                border border-slate-200
                bg-white
                p-7
                shadow-sm
              "
            >

              <h3 className="text-lg font-semibold text-slate-700">
                States with Higher Concentration of Risk Indicators
              </h3>


              <div className="mt-6 space-y-5">


                {stateRiskData.length > 0 ? (

                  stateRiskData.map(
                    (item, index) => {

                      const percentage =
                        (item.value / maxStateRisk) * 100;

                      return (

                        <div
                          key={item.state}
                          className="
                            group grid
                            grid-cols-[180px_1fr_45px]
                            items-center gap-4
                          "
                        >

                          <span className="text-sm font-medium text-slate-600">

                            {item.state}

                          </span>


                          <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                            <div
                              className="
                                h-full rounded-full
                                transition-all duration-500
                                group-hover:brightness-110
                                group-hover:shadow-lg
                              "
                              style={{
                                width: `${percentage}%`,

                                background:
                                  index % 2 === 0
                                    ? "#ea580c"
                                    : "#dc2626",
                              }}
                            />

                          </div>


                          <span className="text-right text-sm font-bold text-slate-600">

                            {item.value}

                          </span>

                        </div>

                      );

                    }
                  )

                ) : (

                  <p className="py-16 text-center text-sm text-slate-500">

                    State risk data will appear here.

                  </p>

                )}

              </div>


              <p className="mt-7 text-sm text-slate-500">

                Higher concentration reflects more projects with unusual
                data patterns, not confirmed wrongdoing.

              </p>

            </div>

          </div>

        </section>



        {/* =============================================
            HOW MPLAD SENTINEL WORKS
        ============================================== */}

        <section className="mt-16">

          <div className="text-center">

            <h2 className="text-3xl font-bold text-slate-800">
              How MPLAD Sentinel Works
            </h2>

            <p className="mt-3 text-slate-500">
              A transparent, step-by-step process for making government
              data understandable.
            </p>


            <div
              className="
                mx-auto mt-5 inline-block
                rounded-xl border border-amber-300
                bg-amber-50 px-6 py-3
                text-sm font-semibold text-amber-800
              "
            >
              "Risk is not the same as fraud."
            </div>

          </div>



          <div className="relative mt-12">


            {/* LINE */}

            <div
              className="
                absolute left-[8%] right-[8%] top-7
                hidden h-px bg-slate-300
                lg:block
              "
            />


            <div className="relative grid gap-8 md:grid-cols-3 lg:grid-cols-7">


              {[
                {
                  number: "01",
                  title: "Collect",
                  text: "Public project data is gathered from MPLADS / eSAKSHI and open government sources.",
                },

                {
                  number: "02",
                  title: "Standardize",
                  text: "Records are cleaned, normalized and cross-referenced across financial years.",
                },

                {
                  number: "03",
                  title: "Analyze",
                  text: "Multiple dimensions — financial, execution, temporal and geographic — are examined.",
                },

                {
                  number: "04",
                  title: "Identify Patterns",
                  text: "Unusual patterns in data are detected using algorithmic analysis.",
                },

                {
                  number: "05",
                  title: "Generate Indicators",
                  text: "Public risk indicators are generated for each project with scores of 0–100.",
                },

                {
                  number: "06",
                  title: "Explain Signals",
                  text: "Each indicator includes a plain-language explanation of the signals detected.",
                },

                {
                  number: "07",
                  title: "Enable Understanding",
                  text: "Citizens, researchers and journalists can explore and understand MPLADS implementation.",
                },
              ].map((step) => (

                <div
                  key={step.number}
                  className="text-center"
                >

                  <div
                    className="
                      relative z-10 mx-auto
                      flex h-14 w-14
                      items-center justify-center
                      rounded-full
                      border border-blue-200
                      bg-[#edf3fa]
                      font-mono font-bold
                      text-blue-700
                      shadow-sm
                      transition-all duration-300
                      hover:scale-110
                      hover:shadow-md
                    "
                  >
                    {step.number}
                  </div>


                  <h3 className="mt-4 font-semibold text-slate-700">
                    {step.title}
                  </h3>


                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>



        {/* =============================================
            DATA SOURCES
        ============================================== */}

        <section className="mt-16">

          <div className="flex items-end justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-800">
                Data Sources
              </h2>

              <p className="mt-2 text-slate-500">
                Where our data comes from — with full transparency on
                availability.
              </p>

            </div>


            <button
              className="
                hidden font-semibold text-blue-700
                transition-all hover:translate-x-1
                md:block
              "
            >
              View all →
            </button>

          </div>



          <div className="mt-7 grid gap-5 md:grid-cols-3">


            {/* SOURCE 1 */}

            <div
              className="
                rounded-2xl border border-slate-200
                bg-white p-6
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Database size={20} />
                  </div>


                  <h3 className="font-semibold text-slate-700">
                    MPLADS / eSAKSHI Portal
                  </h3>

                </div>


                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Public
                </span>

              </div>


              <p className="mt-5 text-sm text-slate-500">
                Primary project data — recommendations, sanctions,
                expenditure
              </p>

            </div>



            {/* SOURCE 2 */}

            <div
              className="
                rounded-2xl border border-slate-200
                bg-white p-6
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                    <Search size={20} />
                  </div>


                  <h3 className="font-semibold text-slate-700">
                    Ministry of Statistics & PI (MoSPI)
                  </h3>

                </div>


                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Public
                </span>

              </div>


              <p className="mt-5 text-sm text-slate-500">
                Administrative and economic reference data
              </p>

            </div>



            {/* SOURCE 3 */}

            <div
              className="
                rounded-2xl border border-slate-200
                bg-white p-6
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                    <Brain size={20} />
                  </div>


                  <h3 className="font-semibold text-slate-700">
                    National Data & Analytics Platform
                  </h3>

                </div>


                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Public
                </span>

              </div>


              <p className="mt-5 text-sm text-slate-500">
                Open government datasets and statistical tables
              </p>

            </div>

          </div>

        </section>


      </main>

    </div>
  );
}