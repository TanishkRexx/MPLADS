import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Flag,
  MapPin,
  Landmark,
  CircleCheck,
  TriangleAlert,
  ScanSearch,
  ChevronRight,
  Bot,
  FileCheck,
  UserRound,
  Camera,
  BrainCircuit,
  Gauge,
  Inbox,
  Search,
  Gavel,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Building2,
  AlertTriangle,
  CircleAlert,
  UserCheck,
  BadgeCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import { projects } from "../data/projects";


/* =========================================================
   DATA
========================================================= */

const stats = [
  {
    icon: Landmark,
    value: "1149",
    label: "TOTAL PROJECTS",
  },
  {
    icon: CircleCheck,
    value: "921",
    label: "COMPLETED PROJECTS",
  },
  {
    icon: TriangleAlert,
    value: "121",
    label: "HIGH RISK PROJECTS",
  },
  {
    icon: ScanSearch,
    value: "107",
    label: "UNDER INVESTIGATION",
  },
];


const pipelineSteps = [
  {
    number: "01",
    title: "Citizen",
    description: "Spots an incomplete or suspicious work",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Evidence Upload",
    description: "Photo proof submitted in seconds",
    icon: Camera,
  },
  {
    number: "03",
    title: "AI Processing",
    description: "Imagery verified against records",
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Risk Verification",
    description: "Risk score & anomaly re-checked",
    icon: Gauge,
  },
  {
    number: "05",
    title: "Investigation Queue",
    description: "Prioritised alert dispatched",
    icon: Inbox,
  },
  {
    number: "06",
    title: "Investigator Review",
    description: "Officer audits findings & evidence",
    icon: Search,
  },
  {
    number: "07",
    title: "Action",
    description: "Field inspection & closure",
    icon: Gavel,
  },
];


const stateData = [
  { name: "Uttar Pradesh", value: 52 },
  { name: "Maharashtra", value: 43 },
  { name: "West Bengal", value: 43 },
  { name: "Madhya Pradesh", value: 34 },
  { name: "Rajasthan", value: 34 },
  { name: "Gujarat", value: 33 },
  { name: "Bihar", value: 32 },
  { name: "Tamil Nadu", value: 33 },
];


const watchlist = [
  {
    score: 95,
    title: "Avenue Plantation with Tree Guards, Bhagwan...",
    location: "Surat, Gujarat",
    status: "Completed",
  },
  {
    score: 90,
    title: "Additional Classrooms, Govt. Primary School ...",
    location: "Chennai, Tamil Nadu",
    status: "Not Started",
  },
  {
    score: 88,
    title: "Multipurpose Sports Court, Kishunpur",
    location: "Nashik, Maharashtra",
    status: "Ongoing",
  },
  {
    score: 87,
    title: "Community Hall, Tikri",
    location: "Jalandhar, Punjab",
    status: "Completed",
  },
  {
    score: 85,
    title: "Library Building, Higher Secondary School Sai...",
    location: "Gaya, Bihar",
    status: "Ongoing",
  },
];


const accountabilityCards = [
  {
    title: "For Citizens",
    icon: Users,
    iconColor: "bg-[#243c59]",
    items: [
      "Browse every sanctioned MPLADS work",
      "Search & filter by state, district, category",
      "See AI risk scores with clear explanations",
      "Report incomplete works with photo evidence",
    ],
  },
  {
    title: "AI Intelligence Layer",
    icon: BrainCircuit,
    iconColor: "bg-orange-500",
    items: [
      "Detects cost & payment anomalies",
      "Flags expenditure vs progress mismatch",
      "Finds duplicate works in the same area",
      "Verifies citizen evidence automatically",
    ],
  },
  {
    title: "For Investigators",
    icon: ShieldCheck,
    iconColor: "bg-red-600",
    items: [
      "Risk-ranked project monitoring queue",
      "Citizen reports in a prioritised inbox",
      "Six-agent deep investigation per project",
      "Evidence comparison & timeline audit",
    ],
  },
];


const riskCards = [
  {
    title: "Low Risk",
    score: "RISK SCORE 0 – 30",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50/60",
    iconClass: "bg-emerald-600",
    titleClass: "text-emerald-800",
    description:
      "Projects tracking normally — expenditure and physical progress are aligned and on schedule.",
  },
  {
    title: "Medium Risk",
    score: "RISK SCORE 31 – 60",
    icon: Gauge,
    className: "border-amber-200 bg-amber-50/70",
    iconClass: "bg-orange-500",
    titleClass: "text-amber-800",
    description:
      "Early warning signs detected — moderate gaps, minor delays or isolated complaints.",
  },
  {
    title: "High Risk",
    score: "RISK SCORE 61 – 100",
    icon: TriangleAlert,
    className: "border-red-200 bg-red-50/70",
    iconClass: "bg-red-600",
    titleClass: "text-red-800",
    description:
      "Serious anomalies — inflated billing, stalled works, duplicate projects or multiple citizen reports.",
  },
];


/* =========================================================
   ANIMATION
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};


/* =========================================================
   COMPONENT
========================================================= */

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden bg-[#f7f8fa] text-slate-900">


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative min-h-screen overflow-hidden">

        {/* Background */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="absolute -top-[280px] right-[-150px] w-[800px] h-[800px] rounded-full border border-slate-200/80" />

          <div className="absolute -top-[170px] right-[-40px] w-[650px] h-[650px] rounded-full border border-slate-200/60" />

          <div className="absolute top-[250px] left-[52%] w-[620px] h-[620px] rounded-full border border-slate-200/50" />

        </div>


        <main className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 lg:pt-20">


          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center min-h-[540px]">


            {/* LEFT */}

            <div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 border border-orange-200 bg-orange-50/80 px-4 py-2 rounded-full mb-7"
              >

                <span className="w-2 h-3 bg-orange-500 rounded-full animate-pulse" />

                <span className="text-[12px] font-bold tracking-[0.16em] text-orange-700">
                  AI-POWERED PUBLIC FUND OVERSIGHT
                </span>

              </motion.div>


              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="text-[48px] sm:text-[60px] lg:text-[66px] xl:text-[70px] leading-[1.02] font-bold tracking-[-0.045em]"
              >

                <span className="block">
                  Making MPLADS
                </span>

                <span className="block">
                  Projects
                  <span className="text-orange-500 ml-3">
                    Transparent
                  </span>
                </span>

                <span className="block">
                  With AI
                </span>

              </motion.h1>


              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "62%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.5,
                }}
                className="h-[3px] bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 rounded-full mt-5"
              />


              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
                className="mt-8 max-w-[620px] text-[16px] lg:text-[18px] leading-8 text-slate-500 font-medium"
              >

                Monitor projects, identify risks, report incomplete works and
                enable intelligent investigation — a unified citizen-to-authority
                accountability platform.

              </motion.p>


              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{
                  duration: 0.5,
                  delay: 0.45,
                }}
                className="flex flex-wrap gap-4 mt-9"
              >

                <Link
                  to="/public-dashboard"
                  className="group flex items-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all"
                >

                  <Eye size={18} />

                  Explore Public Dashboard

                  <ChevronRight
                    size={17}
                    className="group-hover:translate-x-1 transition"
                  />

                </Link>


                <button onClick={() => navigate("/projects")}
                className="flex items-center gap-3 px-7 py-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:border-orange-300 hover:bg-orange-50 hover:-translate-y-1 transition-all">



                  View Projects

                </button>

              </motion.div>


              <div className="flex items-center gap-2 mt-6 text-sm text-slate-500">

                <MapPin
                  size={16}
                  className="text-orange-500"
                />

                <span className="font-medium">
                  Monitoring 49 sanctioned works across 15 states & 48+ districts
                </span>

              </div>

            </div>


            {/* RIGHT CARD */}

            <motion.div
              initial={{
                opacity: 0,
                x: 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.2,
              }}
              className="relative"
            >

              <div className="absolute -inset-8 bg-orange-100/40 blur-3xl rounded-full -z-10" />


              <div className="bg-white border border-slate-200 rounded-[24px] p-7 lg:p-8 shadow-[0_25px_70px_rgba(15,23,42,0.10)]">


                <div className="flex justify-between items-center gap-4">

                  <span className="text-[11px] tracking-[0.16em] font-bold text-slate-400">
                    LIVE RISK FEED
                  </span>


                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 px-3 py-1.5 rounded-full">

                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />

                    <span className="text-[11px] font-bold">
                      Anomaly Detected
                    </span>

                  </div>

                </div>


                <div className="mt-7">

                  <h2 className="text-[19px] lg:text-[21px] leading-7 font-bold">

                    CC Road Work - 240 Meter Village Bhitari Link Road

                  </h2>


                  <p className="mt-2 text-xs font-mono text-slate-400">

                    MPLADS-UP-12012 • Muzaffarnagar, Uttar Pradesh

                  </p>

                </div>


                {/* Expenditure */}

                <div className="mt-7">

                  <div className="flex justify-between mb-2">

                    <span className="text-sm font-semibold text-slate-500">
                      Expenditure
                    </span>

                    <span className="text-sm font-bold">
                      96%
                    </span>

                  </div>


                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "96%" }}
                      transition={{ duration: 1 }}
                      className="h-full bg-orange-500 rounded-full"
                    />

                  </div>

                </div>


                {/* Progress */}

                <div className="mt-6">

                  <div className="flex justify-between mb-2">

                    <span className="text-sm font-semibold text-slate-500">
                      Physical Progress
                    </span>

                    <span className="text-sm font-bold">
                      58%
                    </span>

                  </div>


                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "58%" }}
                      transition={{ duration: 1 }}
                      className="h-full bg-slate-500 rounded-full"
                    />

                  </div>

                </div>


                {/* Risk */}

                <div className="mt-7 border border-red-200 bg-red-50/70 rounded-2xl px-5 py-5">

                  <div className="flex justify-between">

                    <div>

                      <p className="text-[10px] tracking-[0.14em] font-bold text-red-400">
                        RISK SCORE
                      </p>


                      <div className="flex items-end gap-1 mt-1">

                        <span className="text-[34px] font-bold">
                          82
                        </span>

                        <span className="text-sm font-bold text-red-500 mb-2">
                          /100
                        </span>

                      </div>

                    </div>


                    <div className="text-right">

                      <p className="text-[10px] tracking-[0.14em] font-bold text-red-400">
                        CITIZEN REPORTS
                      </p>

                      <p className="text-[32px] font-bold mt-1">
                        5
                      </p>

                    </div>

                  </div>

                </div>


                <div className="flex items-center gap-3 mt-5">

                  <div className="flex -space-x-2">

                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center"
                      >

                        <Bot
                          size={13}
                          className="text-slate-500"
                        />

                      </div>
                    ))}

                  </div>


                  <span className="text-sm text-slate-500">
                    6 AI agents actively auditing this project
                  </span>

                </div>

              </div>


              {/* Floating Card */}

              

            </motion.div>

          </div>


          {/* Stats */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-20 pb-16">

            {stats.map((stat, index) => {

              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-slate-200 rounded-2xl px-6 py-6 flex items-center gap-4 shadow-sm hover:shadow-lg transition"
                >

                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">

                    <Icon
                      size={21}
                      className="text-orange-500"
                    />

                  </div>


                  <div>

                    <p className="text-[34px] font-bold leading-none">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-[10px] font-bold tracking-[0.13em] text-slate-400">
                      {stat.label}
                    </p>

                  </div>

                </motion.div>
              );
            })}

          </div>

        </main>

      </section>



      {/* =====================================================
          SECTION 1
          CITIZEN TO INVESTIGATOR PIPELINE
      ===================================================== */}

      <section
        id="intelligence-pipeline"
        className="scroll-mt-24 relative bg-[#081423] overflow-hidden py-24 lg:py-32"
      >

        {/* Grid */}

        <div className="absolute inset-0 opacity-50 pointer-events-none">

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:54px_54px]" />

        </div>


        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-10">


          {/* Heading */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-center"
          >

            <div className="flex items-center justify-center gap-3 mb-5">

              <span className="w-7 h-px bg-orange-400" />

              <span className="text-orange-300 text-[11px] font-bold tracking-[0.2em]">
                HIGHLIGHTED CAPABILITY
              </span>

              <span className="w-7 h-px bg-orange-400" />

            </div>


            <h2 className="text-white text-[38px] sm:text-[46px] lg:text-[52px] leading-tight font-bold tracking-[-0.035em]">

              Citizen → Investigator Intelligence

              <span className="block">
                Pipeline
              </span>

            </h2>


            <p className="max-w-[760px] mx-auto mt-4 text-[17px] lg:text-[19px] leading-8 text-slate-400">

              Every citizen report travels through an auditable AI pipeline —
              from photo evidence to an investigator's desk — in seconds.

            </p>

          </motion.div>


          {/* Pipeline */}

          <div className="relative mt-20">

            {/* Connecting line */}

            <div className="hidden xl:block absolute top-[40px] left-[5%] right-[5%] h-px bg-gradient-to-r from-orange-500/20 via-orange-400 to-orange-500/20" />


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">

              {pipelineSteps.map((step, index) => {

                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -6,
                    }}
                    className="relative bg-[#102036] border border-[#1c3a5a] rounded-[20px] p-4 min-h-[166px] transition"
                  >

                    {/* Number */}

                    <span className="absolute right-4 top-4 text-[11px] font-bold tracking-[0.16em] text-[#7392b3]">
                      {step.number}
                    </span>


                    {/* Icon */}

                    <div className="w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-[#1b334e] border border-[#345779] flex items-center justify-center shadow-lg">

                      <Icon
                        size={21}
                        className="text-orange-400"
                      />

                    </div>


                    <h3 className="mt-4 text-[15px] font-bold text-white">
                      {step.title}
                    </h3>


                    <p className="mt-1 text-[13px] leading-5 text-slate-400">
                      {step.description}
                    </p>

                  </motion.div>
                );
              })}

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          SECTION 2
          LIVE PROJECT INTELLIGENCE
      ===================================================== */}

      <section
        id="live-project-dashboard"
        className="scroll-mt-24 relative py-24 lg:py-28 bg-[#f5f7fb]"
      >

        {/* Dotted Background */}

        <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(#b7c1cf_1px,transparent_1px)] bg-[size:24px_24px]" />


        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">


          {/* Heading */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <span className="w-7 h-px bg-orange-400" />

                <span className="text-orange-700 text-[11px] font-bold tracking-[0.2em]">
                  NATIONAL SNAPSHOT
                </span>

              </div>


              <h2 className="text-[38px] lg:text-[44px] font-bold tracking-[-0.035em] text-[#22324a]">
                Live project intelligence dashboard
              </h2>


              <p className="mt-3 max-w-[750px] text-[17px] leading-7 text-slate-500">

                A real-time view of sanctioned works, their risk posture and
                where citizen attention is focused.

              </p>

            </div>


            <Link
              to="/projects"
              className="inline-flex w-fit items-center gap-3 px-6 py-3.5 rounded-xl bg-[#1b2e47] text-white text-sm font-bold hover:bg-[#263e5d] transition"
            >

              Open Full Explorer

              <ArrowRight size={17} />

            </Link>

          </div>


          {/* Dashboard Grid */}

          <div className="grid lg:grid-cols-3 gap-6">


            {/* RISK DISTRIBUTION */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur border border-slate-200 rounded-[22px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >

              <h3 className="text-[17px] font-bold text-[#2b3748]">
                Risk Distribution
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Share of projects by AI risk classification
              </p>


              {/* Donut */}

              <div className="flex justify-center mt-8">

                <div
                  className="relative w-[190px] h-[190px] rounded-full"
                  style={{
                    background:
                      "conic-gradient(#218b4c 0deg 88deg, #f8f8f8 88deg 95deg, #e32626 95deg 230deg, #f8f8f8 230deg 238deg, #d97706 238deg 350deg, #f8f8f8 350deg 360deg)",
                  }}
                >

                  <div className="absolute inset-[30px] bg-white rounded-full" />

                </div>

              </div>


              {/* Legend */}

              <div className="flex justify-center flex-wrap gap-5 mt-8 text-sm font-semibold">

                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-[#218b4c]" />

                  <span className="text-slate-500">
                    Low
                  </span>

                  <span>
                    12
                  </span>

                </div>


                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-[#d97706]" />

                  <span className="text-slate-500">
                    Medium
                  </span>

                  <span>
                    16
                  </span>

                </div>


                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-[#dc2626]" />

                  <span className="text-slate-500">
                    High
                  </span>

                  <span>
                    21
                  </span>

                </div>

              </div>

            </motion.div>



            {/* PROJECTS BY STATE */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: 0.1,
              }}
              className="bg-white/80 backdrop-blur border border-slate-200 rounded-[22px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >

              <h3 className="text-[17px] font-bold text-[#2b3748]">
                Projects by State
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Top monitored states by sanctioned works
              </p>


              <div className="mt-7 space-y-4">

                {stateData.map((state, index) => (

                  <div
                    key={state.name}
                    className="grid grid-cols-[110px_1fr] gap-3 items-center"
                  >

                    <p className="text-right text-[13px] leading-4 text-slate-500">
                      {state.name}
                    </p>


                    <div className="h-[19px] bg-slate-100 rounded-r-full overflow-hidden">

                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${state.value}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.7,
                        }}
                        className="h-full bg-[#2b425f] rounded-r-full"
                      />

                    </div>

                  </div>

                ))}

              </div>

            </motion.div>



            {/* WATCHLIST */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
              }}
              className="bg-white/80 backdrop-blur border border-slate-200 rounded-[22px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="text-[17px] font-bold text-[#2b3748]">
                    Highest Risk Watchlist
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Projects demanding immediate attention
                  </p>

                </div>


                <span className="px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold tracking-wider text-red-500">
                  PRIORITY
                </span>

              </div>


              <div className="mt-5">

                {watchlist.map((item) => (

                  <div
                    key={item.score}
                    className="flex items-center gap-3 py-3 border-b border-slate-200 last:border-none"
                  >

                    <div className="w-9 h-9 shrink-0 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
                      {item.score}
                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="truncate text-[14px] font-bold text-slate-700">
                        {item.title}
                      </p>

                      <p className="text-[12px] text-slate-400 mt-1">
                        {item.location} • {item.status}
                      </p>

                    </div>


                    <AlertTriangle
                      size={17}
                      className="shrink-0 text-red-500"
                    />

                  </div>

                ))}

              </div>

            </motion.div>

          </div>

        </div>

      </section>



      {/* =====================================================
          SECTION 3
          THREE LAYERS
      ===================================================== */}

      <section id="how-it-works" className="scroll-mt-24 py-24 lg:py-28 bg-[#f8f9fb]">

        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">


          {/* Heading */}

          <div className="text-center">

            <div className="flex justify-center items-center gap-3 mb-4">

              <span className="w-6 h-px bg-orange-400" />

              <span className="text-orange-700 text-[11px] font-bold tracking-[0.2em]">
                HOW IT WORKS
              </span>

              <span className="w-6 h-px bg-orange-400" />

            </div>


            <h2 className="text-[38px] lg:text-[46px] font-bold tracking-[-0.035em] text-[#22324a]">
              Three layers of accountability
            </h2>


            <p className="max-w-[800px] mx-auto mt-4 text-[17px] lg:text-[19px] leading-8 text-slate-500">

              Citizens surface ground truth, AI converts it into intelligence,
              and investigators act on prioritised evidence.

            </p>

          </div>


          {/* Cards */}

          <div className="grid lg:grid-cols-3 gap-6 mt-14">

            {accountabilityCards.map((card, index) => {

              const Icon = card.icon;

              return (

                <motion.div
                  key={card.title}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="bg-white border border-slate-200 rounded-[22px] p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                >

                  <div
                    className={`w-[58px] h-[58px] rounded-2xl flex items-center justify-center text-white shadow-lg ${card.iconColor}`}
                  >

                    <Icon size={25} />

                  </div>


                  <h3 className="mt-6 text-[22px] font-bold text-[#28364a]">
                    {card.title}
                  </h3>


                  <div className="mt-6 space-y-4">

                    {card.items.map((item) => (

                      <div
                        key={item}
                        className="flex items-start gap-3"
                      >

                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <span className="text-[16px] text-slate-500">
                          {item}
                        </span>

                      </div>

                    ))}

                  </div>

                </motion.div>

              );

            })}

          </div>


          {/* Risk Cards */}

          <div className="grid md:grid-cols-3 gap-6 mt-16">

            {riskCards.map((risk, index) => {

              const Icon = risk.icon;

              return (

                <motion.div
                  key={risk.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className={`rounded-[20px] border p-6 ${risk.className}`}
                >

                  <div className="flex gap-4">

                    <div
                      className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white ${risk.iconClass}`}
                    >

                      <Icon size={21} />

                    </div>


                    <div>

                      <h3
                        className={`font-bold text-[17px] ${risk.titleClass}`}
                      >
                        {risk.title}
                      </h3>


                      <p className="mt-1 text-[11px] font-bold tracking-[0.12em] text-slate-400">
                        {risk.score}
                      </p>


                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {risk.description}
                      </p>

                    </div>

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

      </section>



      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative bg-[#081423] overflow-hidden">

        {/* Grid */}

        <div className="absolute inset-0 opacity-40 pointer-events-none">

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:54px_54px]" />

        </div>


        <div className="relative max-w-[1100px] mx-auto px-6 py-24 lg:py-28 text-center">


          <Building2
            size={34}
            className="mx-auto text-orange-400"
          />


          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            className="mt-7 text-white text-[40px] sm:text-[50px] lg:text-[58px] leading-[1.05] font-bold tracking-[-0.04em]"
          >

            Every rupee of public money,

            <span className="block">
              under intelligent watch.
            </span>

          </motion.h2>


          <p className="max-w-[720px] mx-auto mt-5 text-[17px] lg:text-[18px] leading-7 text-slate-400">

            Join the platform as a citizen monitor or sign in to the
            investigation console to review flagged projects.

          </p>


          <div className="flex flex-wrap justify-center gap-4 mt-9">


            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition"
            >

              <UserCheck size={19} />

              Citizen Access

            </Link>


            <Link
              to="/investigator-login"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl border border-slate-600 text-white font-bold hover:bg-white/5 hover:-translate-y-1 transition"
            >

              <ShieldCheck size={19} />

              Investigator Console

            </Link>

          </div>

        </div>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="relative border-t border-slate-800">

          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">


            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">


              {/* Logo */}

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">

                  <ShieldCheck
                    size={21}
                    className="text-white"
                  />

                </div>


                <div>

                  <h3 className="font-bold text-[19px] text-white">

                    MPLADS

                    <span className="text-orange-400 ml-1">
                      AI
                    </span>

                    <span className="text-slate-300 ml-1">
                      Monitor
                    </span>

                  </h3>


                  <p className="text-[9px] font-bold tracking-[0.18em] text-slate-500">
                    NATIONAL OVERSIGHT INTELLIGENCE
                  </p>

                </div>

              </div>


              {/* Links */}

              <div className="flex flex-wrap gap-7 text-sm font-medium text-slate-400">

                <Link
                  to="/projects"
                  className="hover:text-orange-400 transition"
                >
                  Projects
                </Link>

                <a
                  href="#intelligence-pipeline"
                  className="hover:text-orange-400 transition"
                >
                  Pipeline
                </a>

                <a
                  href="#how-it-works"
                  className="hover:text-orange-400 transition"
                >
                  How It Works
                </a>

                <Link
                  to="/login"
                  className="hover:text-orange-400 transition"
                >
                  Login
                </Link>

              </div>

            </div>


            <div className="border-t border-slate-800 mt-8 pt-7 text-center">

              <p className="text-[13px] leading-6 text-slate-500">

                MPLADS AI Monitor is a demonstration prototype. All projects,
                MPs, contractors, reports and AI findings are simulated dummy
                data for illustration only — not affiliated with any government body.

              </p>

            </div>

          </div>

        </footer>

      </section>


    </div>
  );
}