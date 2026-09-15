import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";

import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Target,
  Inbox,
  BarChart3,
  ClipboardList,
  MapPin,
  ArrowRight,
  Eye,
  X,
  Search,
  FileWarning,
  CheckCircle2,
  Clock3,
  CircleDot,
} from "lucide-react";

import { projects } from "../data/projects";


/* =====================================================
   COLORS
===================================================== */

const COLORS = {
  navy: "#243852",
  red: "#e30613",
  orange: "#f97316",
  green: "#15803d",
  lightGreen: "#22c55e",
  slate: "#64748b",
  blue: "#6683a5",
  yellow: "#d97706",
};


/* =====================================================
   ANIMATION
===================================================== */

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.08,
    },
  },
};


const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};


const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 15,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};


/* =====================================================
   GET STATUS
===================================================== */

function normalizeStatus(status = "") {

  return status
    .toLowerCase()
    .replace(/\s+/g, "");
}


/* =====================================================
   GET RISK LEVEL
===================================================== */

function getRiskLevel(project) {

  if (project.riskLevel) {

    return project.riskLevel.toLowerCase();

  }

  const score = Number(project.riskScore || 0);

  if (score >= 50) return "high";

  if (score >= 30) return "medium";

  return "low";
}


/* =====================================================
   LOCAL STORAGE REPORTS
===================================================== */

function getPublicReports() {

  try {

    const savedReports =
      localStorage.getItem(
        "mplads_public_reports"
      );

    if (!savedReports) {

      return [];

    }

    return JSON.parse(savedReports);

  } catch {

    return [];

  }

}


/* =====================================================
   FORMAT REPORT
===================================================== */

function formatReport(report) {

  const project =
    projects.find(
      (item) =>
        item.id === report.projectId
    );

  return {

    ...report,

    projectName:
      project?.name ||
      report.projectName ||
      "Unknown Project",

    projectId:
      report.projectId ||
      project?.id,

    location:
      project?.location ||
      report.location ||
      "Location unavailable",

    state:
      project?.state ||
      report.state ||
      "",

    riskScore:
      project?.riskScore ||
      0,

  };

}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  icon,
  type = "navy",
  delay = 0,
  onClick,
}) {

  const styles = {

    navy:
      "bg-[#243852] text-white",

    red:
      "bg-gradient-to-br from-[#ef0015] to-[#d6001a] text-white",

    orange:
      "bg-gradient-to-br from-orange-500 to-orange-600 text-white",

    green:
      "bg-gradient-to-br from-emerald-700 to-emerald-600 text-white",

    darkOrange:
      "bg-gradient-to-br from-orange-700 to-orange-600 text-white",

    white:
      "bg-white text-slate-800",

  };


  return (

    <motion.button

      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.45,
        delay,
      }}

      whileHover={{
        y: -5,
        scale: 1.015,
      }}

      whileTap={{
        scale: 0.98,
      }}

      onClick={onClick}

      className={`
        relative
        overflow-hidden

        min-h-[118px]

        rounded-[18px]

        p-6

        text-left

        shadow-lg

        transition-all
        duration-300

        ${styles[type]}

        ${onClick ? "cursor-pointer" : ""}
      `}
    >

      {/* Background Glow */}

      <div
        className="
          absolute

          -right-8
          -top-8

          h-24
          w-24

          rounded-full

          bg-white/10
        "
      />


      {/* Content */}

      <div
        className="
          relative
          z-10

          flex
          items-start
          justify-between
        "
      >

        <div>

          <p
            className={`
              text-[11px]
              font-bold
              tracking-[0.16em]

              ${
                type === "white"
                  ? "text-slate-400"
                  : "text-white/70"
              }
            `}
          >

            {title}

          </p>


          <h3
            className="
              mt-3

              text-4xl

              font-black
            "
          >

            {value}

          </h3>

        </div>


        <div
          className={`
            flex

            h-12
            w-12

            items-center
            justify-center

            rounded-2xl

            ${
              type === "white"
                ? "bg-slate-100 text-[#243852]"
                : "bg-white/15 text-white"
            }
          `}
        >

          {icon}

        </div>

      </div>

    </motion.button>

  );

}


/* =====================================================
   SECTION CARD
===================================================== */

function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}) {

  return (

    <motion.div

      variants={cardVariants}

      className={`
        rounded-[22px]

        border
        border-slate-200

        bg-white

        p-5

        shadow-[0_10px_30px_rgba(15,23,42,0.06)]

        transition-all
        duration-300

        hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)]

        ${className}
      `}
    >

      <div
        className="
          mb-4
        "
      >

        <h3
          className="
            text-[16px]

            font-bold

            text-slate-700
          "
        >

          {title}

        </h3>


        {subtitle && (

          <p
            className="
              mt-1

              text-sm

              text-slate-400
            "
          >

            {subtitle}

          </p>

        )}

      </div>


      {children}

    </motion.div>

  );

}


/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  status,
}) {

  const normalized =
    normalizeStatus(status);


  let style =
    "border-slate-200 bg-slate-50 text-slate-500";


  if (
    normalized.includes("complete")
  ) {

    style =
      "border-emerald-200 bg-emerald-50 text-emerald-700";

  }


  if (
    normalized.includes("ongoing")
  ) {

    style =
      "border-blue-200 bg-blue-50 text-blue-700";

  }


  if (
    normalized.includes("notstarted")
  ) {

    style =
      "border-slate-200 bg-slate-100 text-slate-500";

  }


  if (
    normalized.includes("delay")
  ) {

    style =
      "border-orange-200 bg-orange-50 text-orange-700";

  }


  return (

    <span
      className={`
        whitespace-nowrap

        rounded-full

        border

        px-3
        py-1

        text-xs
        font-semibold

        ${style}
      `}
    >

      {status || "Ongoing"}

    </span>

  );

}


/* =====================================================
   INVESTIGATION MODAL
===================================================== */

function InvestigationModal({
  project,
  report,
  onClose,
}) {

  if (!project) {

    return null;

  }


  return (

    <AnimatePresence>

      <motion.div

        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        exit={{
          opacity: 0,
        }}

        className="
          fixed
          inset-0
          z-[99999]

          flex
          items-center
          justify-center

          bg-slate-950/60

          p-4

          backdrop-blur-sm
        "
      >

        <motion.div

          initial={{
            opacity: 0,
            scale: 0.92,
            y: 30,
          }}

          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}

          exit={{
            opacity: 0,
            scale: 0.92,
            y: 20,
          }}

          className="
            w-full
            max-w-2xl

            overflow-hidden

            rounded-[26px]

            bg-white

            shadow-2xl
          "
        >

          {/* Header */}

          <div
            className="
              flex
              items-start
              justify-between

              bg-[#111d2c]

              p-7

              text-white
            "
          >

            <div>

              <p
                className="
                  text-xs

                  font-bold

                  tracking-[0.15em]

                  text-orange-300
                "
              >

                INVESTIGATION CASE

              </p>


              <h2
                className="
                  mt-2

                  text-2xl

                  font-bold
                "
              >

                {project.name}

              </h2>


              <p
                className="
                  mt-2

                  text-sm

                  text-slate-300
                "
              >

                {project.id}

              </p>

            </div>


            <button

              onClick={onClose}

              className="
                flex

                h-10
                w-10

                cursor-pointer

                items-center
                justify-center

                rounded-xl

                bg-white/10

                transition

                hover:bg-red-500
              "
            >

              <X size={20} />

            </button>

          </div>


          {/* Body */}

          <div
            className="
              max-h-[65vh]

              overflow-y-auto

              p-7
            "
          >

            <div
              className="
                grid

                gap-4

                md:grid-cols-2
              "
            >

              <div
                className="
                  rounded-2xl

                  bg-slate-50

                  p-4
                "
              >

                <p
                  className="
                    text-xs

                    font-bold

                    tracking-wider

                    text-slate-400
                  "
                >

                  RISK SCORE

                </p>


                <p
                  className="
                    mt-2

                    text-3xl

                    font-black

                    text-red-600
                  "
                >

                  {project.riskScore}

                </p>

              </div>


              <div
                className="
                  rounded-2xl

                  bg-slate-50

                  p-4
                "
              >

                <p
                  className="
                    text-xs

                    font-bold

                    tracking-wider

                    text-slate-400
                  "
                >

                  CURRENT STATUS

                </p>


                <div
                  className="
                    mt-3
                  "
                >

                  <StatusBadge
                    status={project.status}
                  />

                </div>

              </div>

            </div>


            <div
              className="
                mt-6

                rounded-2xl

                border
                border-slate-200

                p-5
              "
            >

              <h3
                className="
                  font-bold

                  text-slate-700
                "
              >

                Project Information

              </h3>


              <div
                className="
                  mt-4

                  space-y-3

                  text-sm
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    gap-5
                  "
                >

                  <span className="text-slate-400">
                    State
                  </span>

                  <span className="font-semibold text-slate-700">
                    {project.state}
                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    gap-5
                  "
                >

                  <span className="text-slate-400">
                    District
                  </span>

                  <span className="font-semibold text-slate-700">
                    {project.district}
                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    gap-5
                  "
                >

                  <span className="text-slate-400">
                    Physical Progress
                  </span>

                  <span className="font-semibold text-slate-700">
                    {project.physicalProgress || 0}%
                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    gap-5
                  "
                >

                  <span className="text-slate-400">
                    Financial Progress
                  </span>

                  <span className="font-semibold text-slate-700">
                    {project.expenditurePercent || 0}%
                  </span>

                </div>

              </div>

            </div>


            {/* Public Complaint */}

            {report && (

              <div
                className="
                  mt-6

                  rounded-2xl

                  border
                  border-red-200

                  bg-red-50

                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <FileWarning
                    size={18}
                    className="text-red-600"
                  />

                  <h3
                    className="
                      font-bold

                      text-red-700
                    "
                  >

                    Citizen Complaint

                  </h3>

                </div>


                <p
                  className="
                    mt-3

                    text-sm

                    leading-7

                    text-slate-600
                  "
                >

                  {report.description ||
                    "No additional description provided."}

                </p>


                {report.issueType && (

                  <div
                    className="
                      mt-4

                      inline-flex

                      rounded-full

                      bg-white

                      px-4
                      py-2

                      text-xs

                      font-bold

                      text-red-600
                    "
                  >

                    {report.issueType}

                  </div>

                )}

              </div>

            )}

          </div>


          {/* Footer */}

          <div
            className="
              flex
              justify-end
              gap-3

              border-t

              p-5
            "
          >

            <button

              onClick={onClose}

              className="
                cursor-pointer

                rounded-xl

                border
                border-slate-200

                px-5
                py-3

                text-sm
                font-bold

                text-slate-600

                transition

                hover:bg-slate-50
              "
            >

              Close

            </button>


            <button

              onClick={() => {

                alert(
                  "Investigation started for " +
                  project.name
                );

              }}

              className="
                flex
                cursor-pointer
                items-center
                gap-2

                rounded-xl

                bg-orange-500

                px-5
                py-3

                text-sm
                font-bold

                text-white

                shadow-lg
                shadow-orange-500/20

                transition-all

                hover:-translate-y-0.5
                hover:bg-orange-600

                active:scale-95
              "
            >

              <Search size={16} />

              Start Investigation

            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );

}


/* =====================================================
   MAIN DASHBOARD
===================================================== */

export default function RiskDashboard() {

  const navigate = useNavigate();


  /* =====================================================
     STATE
  ===================================================== */

  const [
    publicReports,
    setPublicReports,
  ] = useState([]);


  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);


  const [
    selectedReport,
    setSelectedReport,
  ] = useState(null);


  const [
    activeRisk,
    setActiveRisk,
  ] = useState("all");


  /* =====================================================
     LOAD PUBLIC REPORTS
  ===================================================== */

  useEffect(() => {

    const loadReports = () => {

      const reports =
        getPublicReports();

      setPublicReports(
        reports.map(formatReport)
      );

    };


    loadReports();


    /* Listen to public report submission */

    window.addEventListener(
      "storage",
      loadReports
    );


    window.addEventListener(
      "mplads-report-submitted",
      loadReports
    );


    return () => {

      window.removeEventListener(
        "storage",
        loadReports
      );


      window.removeEventListener(
        "mplads-report-submitted",
        loadReports
      );

    };

  }, []);


  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const highRiskProjects =
    projects.filter(
      (project) =>
        getRiskLevel(project) === "high"
    );


  const mediumRiskProjects =
    projects.filter(
      (project) =>
        getRiskLevel(project) === "medium"
    );


  const lowRiskProjects =
    projects.filter(
      (project) =>
        getRiskLevel(project) === "low"
    );


  const investigationProjects =
    projects.filter(
      (project) => {

        const score =
          Number(
            project.riskScore || 0
          );

        return score >= 70;

      }
    );


  /* =====================================================
     RISK DISTRIBUTION
  ===================================================== */

  const riskDistribution = [

    {
      name: "Low",
      value:
        lowRiskProjects.length,
      color: COLORS.green,
    },

    {
      name: "Medium",
      value:
        mediumRiskProjects.length,
      color: COLORS.orange,
    },

    {
      name: "High",
      value:
        highRiskProjects.length,
      color: COLORS.red,
    },

  ];


  /* =====================================================
     STATE DATA
  ===================================================== */

  const stateData =
    useMemo(() => {

      const stateCount = {};


      projects.forEach(
        (project) => {

          const state =
            project.state ||
            "Unknown";


          stateCount[state] =
            (stateCount[state] || 0) + 1;

        }
      );


      return Object.entries(
        stateCount
      )
        .map(
          ([state, count]) => ({
            state,
            count,
          })
        )
        .sort(
          (a, b) =>
            b.count - a.count
        )
        .slice(0, 10);

    }, []);


  /* =====================================================
     CATEGORY DATA
  ===================================================== */

  const categoryData =
    useMemo(() => {

      const categories = {};


      projects.forEach(
        (project) => {

          const category =
            project.workcategory ||
            "Other";


          categories[category] =
            (categories[category] || 0) + 1;

        }
      );


      return Object.entries(
        categories
      )
        .map(
          ([name, value]) => ({
            name,
            value,
          })
        )
        .sort(
          (a, b) =>
            b.value - a.value
        );

    }, []);


  /* =====================================================
     RISK SCORE BANDS
  ===================================================== */

  const riskScoreBands = [

    {
      band: "0-20",
      count: 0,
    },

    {
      band: "21-40",
      count: 0,
    },

    {
      band: "41-60",
      count: 0,
    },

    {
      band: "61-80",
      count: 0,
    },

    {
      band: "81-100",
      count: 0,
    },

  ];


  projects.forEach(
    (project) => {

      const score =
        Number(
          project.riskScore || 0
        );


      if (score <= 20) {

        riskScoreBands[0].count++;

      }

      else if (score <= 40) {

        riskScoreBands[1].count++;

      }

      else if (score <= 60) {

        riskScoreBands[2].count++;

      }

      else if (score <= 80) {

        riskScoreBands[3].count++;

      }

      else {

        riskScoreBands[4].count++;

      }

    }
  );


  /* =====================================================
     PROJECT STATUS
  ===================================================== */

  const statusData =
    useMemo(() => {

      const statusCount = {};


      projects.forEach(
        (project) => {

          const status =
            project.status ||
            "Ongoing";


          statusCount[status] =
            (statusCount[status] || 0) + 1;

        }
      );


      return Object.entries(
        statusCount
      )
        .map(
          ([name, value]) => ({
            name,
            value,
          })
        );

    }, []);


  /* =====================================================
     FINANCIAL VS PHYSICAL
  ===================================================== */

  const progressData =
    projects.map(
      (project) => ({

        x:
          Number(
            project.expenditurePercentage || 0
          ),

        y:
          Number(
            project.physicalProgress || 0
          ),

        name:
          project.name,

        risk:
          getRiskLevel(project),

        id:
          project.id,

      })
    );


  /* =====================================================
     PRIORITY WATCHLIST
  ===================================================== */

  const watchlist =
    [...projects]

      .sort(
        (a, b) =>
          Number(
            b.riskScore || 0
          ) -
          Number(
            a.riskScore || 0
          )
      )

      .filter(
        (project) => {

          if (
            activeRisk === "all"
          ) {

            return true;

          }


          return (
            getRiskLevel(project) ===
            activeRisk
          );

        }
      )

      .slice(0, 5);


  /* =====================================================
     REPORTS
  ===================================================== */

  const displayedReports =
    publicReports
      .slice()
      .reverse()
      .slice(0, 5);


  /* =====================================================
     OPEN INVESTIGATION
  ===================================================== */

  const openInvestigation =
    (project, report = null) => {

      setSelectedProject(project);

      setSelectedReport(report);

    };


  /* =====================================================
     HANDLE REPORT CLICK
  ===================================================== */

  const handleReportClick =
    (report) => {

      const project =
        projects.find(
          (item) =>
            item.id ===
            report.projectId
        );


      if (project) {

        openInvestigation(
          project,
          report
        );

      }

    };


  return (

    <>

      <motion.main

        variants={containerVariants}

        initial="hidden"

        animate="visible"

        className="
          min-h-screen

          bg-[#f4f6fa]

          px-4
          pb-10

          pt-6

          lg:px-8
        "
      >

        <div
          className="
            mx-auto

            max-w-[1450px]
          "
        >


          {/* =================================================
              HERO HEADER
          ================================================= */}

          <motion.section

            variants={itemVariants}

            className="
              relative

              overflow-hidden

              rounded-[26px]

              bg-[#111d2c]

              px-8
              py-8

              text-white

              shadow-xl

              lg:px-10
            "
          >

            {/* Background */}

            <div
              className="
                absolute
                inset-0

                bg-[linear-gradient(
                  90deg,
                  rgba(15,23,42,0.2),
                  rgba(15,23,42,0.1),
                  rgba(80,10,30,0.2)
                )]
              "
            />


            <div
              className="
                relative
                z-10

                flex
                flex-col

                gap-8

                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              <div>

                <p
                  className="
                    flex
                    items-center
                    gap-2

                    text-[11px]

                    font-bold

                    tracking-[0.18em]

                    text-orange-300
                  "
                >

                  <span className="text-red-400">
                    ●
                  </span>

                  RESTRICTED — INVESTIGATION AUTHORITY

                </p>


                <h1
                  className="
                    mt-3

                    text-3xl

                    font-black

                    tracking-tight

                    md:text-4xl
                  "
                >

                  Investigation Authority Dashboard

                </h1>


                <p
                  className="
                    mt-3

                    text-sm

                    text-slate-300

                    md:text-base
                  "
                >

                  {highRiskProjects.length}
                  {" "}high-risk projects and{" "}

                  {publicReports.length}
                  {" "}citizen reports await your review.

                </p>

              </div>


              <div
                className="
                  flex

                  flex-wrap

                  gap-3
                "
              >

                <button

                  onClick={() => {

                    document
                      .getElementById(
                        "citizen-reports"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });

                  }}

                  className="
                    flex

                    cursor-pointer
                    items-center
                    gap-3

                    rounded-2xl

                    bg-[#ef0a12]

                    px-6
                    py-4

                    font-bold

                    text-white

                    shadow-lg
                    shadow-red-900/30

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:scale-[1.02]

                    active:scale-95
                  "
                >

                  <Inbox size={18} />

                  Citizen Reports


                  <span
                    className="
                      rounded-full

                      bg-white/20

                      px-2
                      py-0.5

                      text-xs
                    "
                  >

                    {publicReports.length}

                  </span>

                </button>


                <button

                  onClick={() => {

                    document
                      .getElementById(
                        "analytics"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });

                  }}

                  className="
                    flex

                    cursor-pointer
                    items-center
                    gap-3

                    rounded-2xl

                    border
                    border-white/20

                    bg-white/5

                    px-6
                    py-4

                    font-bold

                    text-white

                    transition-all
                    duration-300

                    hover:-translate-y-1

                    hover:bg-white/10
                  "
                >

                  <BarChart3
                    size={18}
                    className="text-orange-400"
                  />

                  National Analytics

                </button>

              </div>

            </div>

          </motion.section>


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section
            className="
              mt-6

              grid

              gap-4

              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-6
            "
          >

            <StatCard

              title="TOTAL PROJECTS"

              value={projects.length}

              type="navy"

              delay={0.05}

              icon={
                <Building2 size={22} />
              }

            />


            <StatCard

              title="HIGH RISK"

              value={
                highRiskProjects.length
              }

              type="red"

              delay={0.1}

              onClick={() =>
                setActiveRisk("high")
              }

              icon={
                <ShieldAlert size={22} />
              }

            />


            <StatCard

              title="MEDIUM RISK"

              value={
                mediumRiskProjects.length
              }

              type="orange"

              delay={0.15}

              onClick={() =>
                setActiveRisk("medium")
              }

              icon={
                <AlertTriangle size={22} />
              }

            />


            <StatCard

              title="LOW RISK"

              value={
                lowRiskProjects.length
              }

              type="green"

              delay={0.2}

              onClick={() =>
                setActiveRisk("low")
              }

              icon={
                <ShieldCheck size={22} />
              }

            />


            <StatCard

              title="UNDER INVESTIGATION"

              value={
                investigationProjects.length
              }

              type="darkOrange"

              delay={0.25}

              icon={
                <Target size={22} />
              }

            />


            <StatCard

              title="REPORTS PENDING"

              value={
                publicReports.length
              }

              type="white"

              delay={0.3}

              onClick={() => {

                document
                  .getElementById(
                    "citizen-reports"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });

              }}

              icon={
                <Inbox size={22} />
              }

            />

          </section>


          {/* =================================================
              FIRST ROW ANALYTICS
          ================================================= */}

          <section
            id="analytics"

            className="
              mt-6

              grid

              gap-5

              lg:grid-cols-3
            "
          >


            {/* RISK DISTRIBUTION */}

            <SectionCard

              title="Risk Distribution"

              subtitle="AI classification of all projects"

            >

              <div
                className="
                  h-[290px]
                "
              >

                <ResponsiveContainer>

                  <PieChart>

                    <Pie

                      data={riskDistribution}

                      cx="50%"

                      cy="45%"

                      innerRadius={58}

                      outerRadius={88}

                      paddingAngle={2}

                      dataKey="value"

                      stroke="none"

                    >

                      {riskDistribution.map(
                        (entry, index) => (

                          <Cell

                            key={index}

                            fill={
                              entry.color
                            }

                          />

                        )
                      )}

                    </Pie>


                    <Tooltip />


                  </PieChart>

                </ResponsiveContainer>


                <div
                  className="
                    -mt-6

                    flex

                    justify-center
                    gap-5

                    text-sm
                  "
                >

                  {riskDistribution.map(
                    (item) => (

                      <button

                        key={item.name}

                        onClick={() => {

                          setActiveRisk(
                            item.name.toLowerCase()
                          );

                        }}

                        className="
                          flex

                          cursor-pointer
                          items-center
                          gap-2

                          font-semibold

                          text-slate-500

                          transition

                          hover:text-slate-900
                        "
                      >

                        <span
                          className="
                            h-2.5
                            w-2.5

                            rounded-full
                          "

                          style={{
                            background:
                              item.color,
                          }}

                        />

                        {item.name}

                        {item.value}

                      </button>

                    )
                  )}

                </div>

              </div>

            </SectionCard>


            {/* PROJECTS BY STATE */}

            <SectionCard

              title="Projects by State"

              subtitle="Top monitored states"

            >

              <div
                className="
                  h-[290px]
                "
              >

                <ResponsiveContainer>

                  <BarChart

                    data={stateData}

                    layout="vertical"

                    margin={{
                      left: 15,
                      right: 20,
                    }}

                  >

                    <CartesianGrid
                      horizontal={false}
                      strokeDasharray="3 3"
                    />


                    <XAxis
                      type="number"
                      hide
                    />


                    <YAxis

                      type="category"

                      dataKey="state"

                      width={105}

                      tick={{
                        fontSize: 11,
                      }}

                    />


                    <Tooltip />


                    <Bar

                      dataKey="count"

                      fill={COLORS.navy}

                      radius={[
                        0,
                        10,
                        10,
                        0,
                      ]}

                      cursor="pointer"

                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </SectionCard>


            {/* CATEGORY */}

            <SectionCard

              title="Projects by Category"

              subtitle="Development sector split"

            >

              <div
                className="
                  h-[290px]
                "
              >

                <ResponsiveContainer>

                  <PieChart>

                    <Pie

                      data={categoryData}

                      dataKey="value"

                      nameKey="name"

                      cx="50%"

                      cy="43%"

                      innerRadius={55}

                      outerRadius={84}

                      paddingAngle={3}

                    >

                      {categoryData.map(
                        (_, index) => (

                          <Cell

                            key={index}

                            fill={
                              [
                                "#243852",
                                "#f97316",
                                "#15803d",
                                "#e30613",
                                "#6683a5",
                                "#d97706",
                                "#94a3b8",
                              ][
                                index % 7
                              ]
                            }

                          />

                        )
                      )}

                    </Pie>


                    <Tooltip />


                  </PieChart>

                </ResponsiveContainer>


                <div
                  className="
                    -mt-5

                    flex

                    flex-wrap

                    justify-center

                    gap-x-4
                    gap-y-2

                    text-[11px]

                    text-slate-500
                  "
                >

                  {categoryData.map(
                    (item, index) => (

                      <div
                        key={item.name}

                        className="
                          flex
                          items-center
                          gap-1.5
                        "
                      >

                        <span

                          className="
                            h-2
                            w-2
                            rounded-full
                          "

                          style={{
                            background:
                              [
                                "#243852",
                                "#f97316",
                                "#15803d",
                                "#e30613",
                                "#6683a5",
                                "#d97706",
                                "#94a3b8",
                              ][
                                index % 7
                              ],
                          }}

                        />

                        {item.name}

                      </div>

                    )
                  )}

                </div>

              </div>

            </SectionCard>

          </section>


          {/* =================================================
              SECOND ANALYTICS
          ================================================= */}

          <section
            className="
              mt-6

              grid

              gap-5

              lg:grid-cols-3
            "
          >


            {/* RISK SCORE */}

            <SectionCard

              title="Risk Score Distribution"

              subtitle="Projects per risk band"

            >

              <div
                className="
                  h-[280px]
                "
              >

                <ResponsiveContainer>

                  <BarChart
                    data={riskScoreBands}
                  >

                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                    />


                    <XAxis
                      dataKey="band"
                    />


                    <YAxis />


                    <Tooltip />


                    <Bar

                      dataKey="count"

                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}

                      cursor="pointer"

                    >

                      {riskScoreBands.map(
                        (_, index) => (

                          <Cell

                            key={index}

                            fill={
                              [
                                "#15803d",
                                "#84cc16",
                                "#d97706",
                                "#f45100",
                                "#dc2626",
                              ][index]
                            }

                          />

                        )
                      )}

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </SectionCard>


            {/* PROJECT STATUS */}

            <SectionCard

              title="Project Status"

              subtitle="Execution state of all works"

            >

              <div
                className="
                  h-[280px]
                "
              >

                <ResponsiveContainer>

                  <PieChart>

                    <Pie

                      data={statusData}

                      dataKey="value"

                      nameKey="name"

                      cx="50%"

                      cy="43%"

                      outerRadius={85}

                      label={false}

                    >

                      {statusData.map(
                        (_, index) => (

                          <Cell

                            key={index}

                            fill={
                              [
                                "#1f8f46",
                                "#d97706",
                                "#94a3b8",
                                "#6683a5",
                              ][
                                index % 4
                              ]
                            }

                          />

                        )
                      )}

                    </Pie>


                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </SectionCard>


            {/* FINANCIAL VS PHYSICAL */}

            <SectionCard

              title="Financial vs Physical Progress"

              subtitle="Each point is a project — below diagonal means money is ahead of work"

            >

              <div
                className="
                  h-[280px]
                "
              >

                <ResponsiveContainer>

                  <ScatterChart>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />


                    <XAxis

                      type="number"

                      dataKey="x"

                      domain={[
                        0,
                        100,
                      ]}

                      name="Financial"

                      unit="%"

                    />


                    <YAxis

                      type="number"

                      dataKey="y"

                      domain={[
                        0,
                        100,
                      ]}

                      name="Physical"

                      unit="%"

                    />


                    <ZAxis
                      range={[70]}
                    />


                    <Tooltip

                      cursor={{
                        strokeDasharray:
                          "3 3",
                      }}

                      formatter={(
                        value,
                        name
                      ) => [

                        `${value}%`,

                        name,

                      ]}

                    />


                    <ReferenceLine

                      segment={[
                        {
                          x: 0,
                          y: 0,
                        },

                        {
                          x: 100,
                          y: 100,
                        },

                      ]}

                      stroke="#cbd5e1"

                      strokeDasharray="5 5"

                    />


                    <Scatter

                      data={progressData}

                      fill="#e30613"

                      cursor="pointer"

                      onClick={(data) => {

                        const project =
                          projects.find(
                            (item) =>
                              item.id ===
                              data.id
                          );


                        if (project) {

                          openInvestigation(
                            project
                          );

                        }

                      }}

                    />

                  </ScatterChart>

                </ResponsiveContainer>

              </div>

            </SectionCard>

          </section>


          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <section
            className="
              mt-6

              grid

              gap-5

              lg:grid-cols-[1fr_1.35fr]
            "
          >


            {/* =============================================
                INCOMING CITIZEN REPORTS
            ============================================== */}

            <SectionCard

              title="Incoming Citizen Reports"

              subtitle="AI-verified evidence awaiting action"

              className="min-h-[380px]"

            >

              <div
                id="citizen-reports"

                className="
                  space-y-3
                "
              >

                {displayedReports.length === 0 && (

                  <div
                    className="
                      flex

                      min-h-[230px]

                      flex-col

                      items-center
                      justify-center

                      text-center
                    "
                  >

                    <Inbox
                      size={40}
                      className="text-slate-300"
                    />


                    <p
                      className="
                        mt-4

                        font-bold

                        text-slate-500
                      "
                    >

                      No citizen reports yet

                    </p>


                    <p
                      className="
                        mt-2

                        text-sm

                        text-slate-400
                      "
                    >

                      Reports submitted by the public
                      will automatically appear here.

                    </p>

                  </div>

                )}


                {displayedReports.map(
                  (report, index) => (

                    <motion.button

                      key={
                        report.id ||
                        index
                      }

                      initial={{
                        opacity: 0,
                        x: -20,
                      }}

                      animate={{
                        opacity: 1,
                        x: 0,
                      }}

                      transition={{
                        delay:
                          index * 0.08,
                      }}

                      onClick={() =>
                        handleReportClick(
                          report
                        )
                      }

                      className="
                        flex

                        w-full

                        cursor-pointer

                        items-center

                        gap-4

                        rounded-2xl

                        border
                        border-slate-200

                        bg-slate-50/50

                        p-3

                        text-left

                        transition-all
                        duration-300

                        hover:-translate-y-0.5

                        hover:border-red-200

                        hover:bg-red-50/50

                        hover:shadow-md
                      "
                    >

                      <div
                        className="
                          flex

                          h-14
                          w-14

                          shrink-0

                          items-center
                          justify-center

                          rounded-xl

                          bg-red-100

                          text-red-600
                        "
                      >

                        <FileWarning
                          size={22}
                        />

                      </div>


                      <div
                        className="
                          min-w-0

                          flex-1
                        "
                      >

                        <div
                          className="
                            flex

                            items-center

                            gap-2
                          "
                        >

                          <p
                            className="
                              truncate

                              text-sm

                              font-bold

                              text-slate-700
                            "
                          >

                            {report.issueType ||
                              "Citizen Report"}

                          </p>

                        </div>


                        <p
                          className="
                            mt-1

                            truncate

                            text-xs

                            font-semibold

                            text-slate-400
                          "
                        >

                          {report.projectId}

                        </p>


                        <div
                          className="
                            mt-2

                            flex

                            items-center

                            gap-1

                            text-xs

                            text-slate-400
                          "
                        >

                          <MapPin
                            size={12}
                          />

                          {report.location}

                        </div>

                      </div>


                      <div
                        className="
                          hidden

                          rounded-full

                          border
                          border-orange-200

                          bg-orange-50

                          px-3
                          py-1.5

                          text-[11px]

                          font-bold

                          text-orange-700

                          md:block
                        "
                      >

                        Pending Investigation

                      </div>

                    </motion.button>

                  )
                )}

              </div>

            </SectionCard>


            {/* =============================================
                PRIORITY WATCHLIST
            ============================================== */}

            <SectionCard

              title="Priority Investigation Watchlist"

              subtitle="Highest AI risk scores in the national registry"

              className="min-h-[380px]"

            >

              {/* Filter */}

              <div
                className="
                  mb-5

                  flex

                  flex-wrap

                  gap-2
                "
              >

                {[
                  "all",
                  "high",
                  "medium",
                  "low",
                ].map(
                  (risk) => (

                    <button

                      key={risk}

                      onClick={() =>
                        setActiveRisk(risk)
                      }

                      className={`
                        cursor-pointer

                        rounded-full

                        px-4
                        py-2

                        text-xs

                        font-bold

                        capitalize

                        transition-all

                        ${
                          activeRisk === risk

                            ? "bg-[#243852] text-white shadow-md"

                            : "bg-slate-100 text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                        }
                      `}
                    >

                      {risk}

                    </button>

                  )
                )}

              </div>


              <div
                className="
                  divide-y
                  divide-slate-100
                "
              >

                {watchlist.map(
                  (project) => (

                    <motion.div

                      key={project.id}

                      whileHover={{
                        x: 4,
                      }}

                      className="
                        flex

                        items-center

                        gap-3

                        py-3.5
                      "
                    >

                      {/* Risk Score */}

                      <div
                        className="
                          flex

                          h-11
                          w-11

                          shrink-0

                          items-center
                          justify-center

                          rounded-xl

                          bg-red-600

                          text-sm

                          font-black

                          text-white
                        "
                      >

                        {project.riskScore}

                      </div>


                      {/* Project */}

                      <div
                        className="
                          min-w-0

                          flex-1
                        "
                      >

                        <p
                          className="
                            truncate

                            text-sm

                            font-bold

                            text-slate-700
                          "
                        >

                          {project.name}

                        </p>


                        <p
                          className="
                            mt-1

                            text-xs

                            text-slate-400
                          "
                        >

                          {project.district},
                          {" "}
                          {project.state}

                        </p>

                      </div>


                      {/* Status */}

                      <div
                        className="
                          hidden

                          lg:block
                        "
                      >

                        <StatusBadge
                          status={
                            project.status
                          }
                        />

                      </div>


                      {/* Investigate */}

                      <button

                        onClick={() =>
                          openInvestigation(
                            project
                          )
                        }

                        className="
                          flex

                          cursor-pointer

                          items-center
                          gap-2

                          rounded-xl

                          bg-[#1b2b40]

                          px-4
                          py-2.5

                          text-xs

                          font-bold

                          text-white

                          transition-all
                          duration-300

                          hover:-translate-y-0.5

                          hover:bg-orange-500

                          hover:shadow-lg

                          active:scale-95
                        "
                      >

                        Investigate

                        <ArrowRight
                          size={14}
                        />

                      </button>

                    </motion.div>

                  )
                )}

              </div>

            </SectionCard>

          </section>

        </div>

      </motion.main>


      {/* =================================================
          INVESTIGATION MODAL
      ================================================= */}

      <InvestigationModal

        project={selectedProject}

        report={selectedReport}

        onClose={() => {

          setSelectedProject(null);

          setSelectedReport(null);

        }}

      />

    </>

  );

}