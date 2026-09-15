import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";


import ReportIssueModal from "../components/ReportIssueModal";

import {
  ArrowLeft,
  MapPin,
  Building2,
  Flag,
  FileText,
  Users,
  CalendarDays,
  AlertTriangle,
  ShieldCheck,
  Clock3,
  Copy,
  IndianRupee,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
} from "lucide-react";

import { projects } from "../data/projects";


/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


/* =========================================================
   HELPERS
========================================================= */

function getRiskColor(score) {
  if (score >= 51) {
    return {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
      bar: "bg-red-500",
      label: "High Risk",
    };
  }

  if (score >= 31) {
    return {
      text: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      dot: "bg-orange-500",
      bar: "bg-orange-500",
      label: "Medium Risk",
    };
  }

  return {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    label: "Low Risk",
  };
}


function getStatusColor(status = "") {
  const value = status.toLowerCase();

  if (value.includes("complete")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (value.includes("delay")) {
    return "bg-red-50 text-red-600 border-red-200";
  }

  if (value.includes("ongoing")) {
    return "bg-orange-50 text-orange-600 border-orange-200";
  }

  if (value.includes("near")) {
    return "bg-blue-50 text-blue-600 border-blue-200";
  }

  return "bg-slate-100 text-slate-600 border-slate-200";
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ProjectDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [showReportModal, setShowReportModal] = useState(false);

  /* =========================================
   CITIZEN WATCH - RANDOM REPORT COUNT
========================================= */

const [citizenReports, setCitizenReports] =
  useState(() => {

    // Generate a stable-looking random
    // number between 2 and 15

    return Math.floor(
      Math.random() * 14
    ) + 2;

  });


  /* =========================================
   HANDLE SUCCESSFUL REPORT
========================================= */

const handleReportSuccess = () => {

  setCitizenReports((previousCount) =>
    previousCount + 1
  );

};

  /* =======================================================
     FIND PROJECT
  ======================================================= */

  const project = useMemo(() => {

    return projects.find(
      (item) => item.id === id
    );

  }, [id]);


  /* =======================================================
     ALWAYS START FROM TOP
  ======================================================= */

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, [id]);


  /* =======================================================
     PROJECT NOT FOUND
  ======================================================= */

  if (!project) {

    return (

      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-6">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="
            max-w-md
            w-full
            rounded-3xl
            bg-white
            p-10
            text-center
            shadow-xl
            border
            border-slate-200
          "
        >

          <CircleAlert
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-5 text-2xl font-bold text-slate-800">

            Project Not Found

          </h2>

          <p className="mt-3 text-slate-500">

            The project you are looking for does not exist.

          </p>

          <button
            onClick={() => navigate("/projects")}
            className="
              mt-7
              rounded-xl
              bg-[#17263a]
              px-7
              py-3
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-orange-500
              hover:-translate-y-1
              hover:shadow-lg
            "
          >

            Back To Projects

          </button>

        </motion.div>

      </div>

    );
  }


  /* =======================================================
     VALUES
  ======================================================= */

  const risk = getRiskColor(project.riskScore);

  const statusColor = getStatusColor(project.status);

  const progress = project.physicalProgress || 0;

  const expenditurePercent =
    project.expenditurePercent || 0;


  /* =======================================================
     RISK VALUES
  ======================================================= */

  const financialRisk = Math.min(
    30,
    Math.max(
      3,
      Math.round(
        Math.abs(expenditurePercent - progress) * 0.8
      ) + 5
    )
  );


  const delayRisk =
    project.status?.toLowerCase().includes("delay")
      ? 24
      : project.status?.toLowerCase().includes("ongoing")
      ? 12
      : 4;


  const duplicateRisk =
    project.riskScore >= 70
      ? 15
      : project.riskScore >= 31
      ? 8
      : 3;


  const publicRisk =
    project.status?.toLowerCase().includes("delay")
      ? 10
      : 3;


  /* =======================================================
     TIMELINE
  ======================================================= */

  const timeline = [

    {
      title: "Project Sanctioned",
      date: project.startDate || "Not Available",
      description:
        `Recommended by ${
          project.recommendedBy ||
          project.mpName ||
          "Concerned MP"
        }`,
    },

    {
      title: "Work Started",
      date: project.startDate || "Not Available",
      description:
        `Implementing agency: ${
          project.implementingAgency ||
          "Not Available"
        }`,
    },

    {
      title:
        project.status === "Completed"
          ? "Marked Completed"
          : "Current Progress",

      date:
        project.status === "Completed"
          ? project.completedOn ||
            project.expectedCompletion ||
            "Not Available"
          : project.expectedCompletion ||
            "Not Available",

      description:
        `${progress}% physical progress recorded`,
    },

  ];


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="
        min-h-screen
        bg-[#f5f7fb]
        pb-20
      "
    >


      {/* ===================================================
          MAIN CONTAINER
      =================================================== */}

      <main
        className="
          mx-auto
          max-w-[1700px]
          px-5
          sm:px-8
          lg:px-12
          pt-7
        "
      >


        {/* ===============================================
            BACK BUTTON
        =============================================== */}

        <motion.button
          whileHover={{
            x: -5,
          }}

          onClick={() => navigate("/projects")}

          className="
            mb-7
            flex
            items-center
            gap-3
            text-sm
            font-semibold
            text-slate-500
            transition-colors
            hover:text-orange-500
          "
        >

          <ArrowLeft size={19} />

          Back to projects

        </motion.button>


        {/* ===============================================
            HERO SECTION
        =============================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="
            relative
            overflow-hidden
            rounded-[32px]
            bg-gradient-to-r
            from-[#0b1524]
            via-[#101c2d]
            to-[#0c2928]
            px-6
            py-8
            sm:px-10
            lg:px-12
            lg:py-10
            shadow-2xl
          "
        >


          {/* BACKGROUND GRID */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.06]
            "
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",

              backgroundSize:
                "40px 40px",
            }}
          />


          <div
            className="
              relative
              grid
              grid-cols-1
              gap-10
              xl:grid-cols-[1fr_auto]
              xl:items-center
            "
          >


            {/* LEFT HERO */}

            <div>


              {/* TAGS */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <span
                  className="
                    text-xs
                    font-bold
                    tracking-wider
                    text-slate-400
                  "
                >

                  {project.id}

                </span>


                <span
                  className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-bold
                    ${statusColor}
                  `}
                >

                  {project.status}

                </span>


                <span
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-bold
                    ${risk.bg}
                    ${risk.border}
                    ${risk.text}
                  `}
                >

                  <span
                    className={`
                      h-2
                      w-2
                      rounded-full
                      ${risk.dot}
                    `}
                  />

                  {project.riskScore} {risk.label}

                </span>




              </div>


              {/* PROJECT NAME */}

              <h1
                className="
                  mt-5
                  max-w-[1100px]
                  text-3xl
                  font-black
                  leading-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >

                {project.name}

              </h1>


              {/* LOCATION */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-x-8
                  gap-y-4
                  text-sm
                  font-medium
                  text-slate-300
                  sm:text-base
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <MapPin
                    size={18}
                    className="text-orange-400"
                  />

                  {project.location},
                  {" "}
                  {project.district},
                  {" "}
                  {project.state}

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Building2
                    size={18}
                    className="text-orange-400"
                  />

                  {project.implementingAgency ||
                    "Implementing Agency Not Available"}

                </div>

              </div>


              {/* WORK DESCRIPTION */}

              <div
                className="
                  mt-6
                  max-w-[950px]
                  rounded-2xl
                  border
                  border-slate-700
                  bg-white/[0.05]
                  px-5
                  py-4
                  text-sm
                  leading-7
                  text-slate-300
                  backdrop-blur-sm
                "
              >

                <span
                  className="
                    font-bold
                    text-orange-300
                  "
                >

                  Work description:

                </span>

                {" "}

                {project.workDescription ||
                  "Project work description is not available."}

              </div>

            </div>


            {/* RIGHT HERO */}

            <div
              className="
                flex
                flex-col
                gap-4
                xl:min-w-[280px]
              "
            >


              {/* REPORT BUTTON */}

              <button
                  type="button"
  onClick={() => setShowReportModal(true)}

                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-red-600
                  px-8
                  py-5
                  text-base
                  font-bold
                  text-white
                  shadow-lg
                  shadow-red-900/20
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-red-700
                  hover:shadow-2xl
                  hover:shadow-red-500/30
                  active:scale-[0.97]
                "
              >

                <Flag
                  size={22}
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-[-8deg]
                  "
                />

                Report This Project

              </button>


              {/* RISK SCORE */}

              <motion.div
                whileHover={{
                  scale: 1.03,
                }}

                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.06]
                  px-7
                  py-5
                  text-center
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:bg-white/[0.09]
                "
              >

                <p
                  className="
                    text-xs
                    font-bold
                    tracking-[0.22em]
                    text-slate-400
                  "
                >

                  AI RISK SCORE

                </p>


                <div
                  className="
                    mt-2
                    flex
                    items-end
                    justify-center
                    gap-1
                  "
                >

                  <span
                    className="
                      text-5xl
                      font-black
                      text-white
                    "
                  >

                    {project.riskScore}

                  </span>


                  <span
                    className="
                      mb-1
                      text-lg
                      font-bold
                      text-slate-400
                    "
                  >

                    /100

                  </span>

                </div>


                <div
                  className="
                    mt-4
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-white/10
                  "
                >

                  <motion.div
                    initial={{
                      width: 0,
                    }}

                    animate={{
                      width: `${project.riskScore}%`,
                    }}

                    transition={{
                      duration: 1,
                      delay: 0.3,
                    }}

                    className={`
                      h-full
                      rounded-full
                      ${risk.bar}
                    `}
                  />

                </div>

              </motion.div>

            </div>

          </div>

        </motion.section>


        {/* ===============================================
            CONTENT AREA
        =============================================== */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-8
            xl:grid-cols-[1.8fr_0.9fr]
          "
        >


          {/* =============================================
              LEFT SIDE
          ============================================= */}

          <div
            className="
              flex
              flex-col
              gap-8
            "
          >


            {/* ===========================================
                PROJECT INFORMATION
            =========================================== */}

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}

              className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-6
                shadow-lg
                shadow-slate-200/50
                sm:p-8
              "
            >


              <SectionTitle
                icon={<FileText size={21} />}
                title="Project Information"
              />


              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-x-10
                "
              >

                <InfoRow
                  label="Project ID"
                  value={project.id}
                />

                <InfoRow
                  label="State"
                  value={project.state}
                />

                <InfoRow
                  label="District"
                  value={project.district}
                />

                <InfoRow
                  label="Location"
                  value={project.location}
                />


                <InfoRow
                  label="Sanctioned Cost"
                  value={project.cost}
                />

                <InfoRow
                  label="Total Expenditure"
                  value={`${project.expenditure} (${expenditurePercent}%)`}
                />

                <InfoRow
                  label="Physical Progress"
                  value={`${progress}%`}
                />

                <InfoRow
                  label="Current Status"
                  value={project.status}
                />

                <InfoRow
                  label="MP Name"
                  value={project.mpName || "Not Available"}
                />

                <InfoRow
                  label="Recommended By"
                  value={
                    project.recommendedBy ||
                    project.mpName ||
                    "Not Available"
                  }
                />

                <InfoRow
                  label="Start Date"
                  value={project.startDate || "Not Available"}
                />

                <InfoRow
                  label="Expected Completion"
                  value={
                    project.expectedCompletion ||
                    "Not Available"
                  }
                />

                <InfoRow
                  label="Completed On"
                  value={
                    project.completedOn ||
                    (
                      project.status === "Completed"
                        ? "Completed"
                        : "Not Completed"
                    )
                  }
                />

                <InfoRow
                  label="Implementing Agency"
                  value={
                    project.implementingAgency ||
                    "Not Available"
                  }
                />

                <InfoRow
                  label="Contractor"
                  value={
                    project.contractor ||
                    "Not Available"
                  }
                />

              </div>

            </motion.section>


            {/* ===========================================
                AI RISK ANALYSIS
            =========================================== */}

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}

              className="
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200
                bg-white
                shadow-lg
                shadow-slate-200/50
              "
            >


              {/* HEADER */}

              <div
                className="
                  border-b
                  border-emerald-100
                  bg-gradient-to-r
                  from-emerald-50
                  to-white
                  px-7
                  py-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <AlertTriangle
                    size={22}
                    className="text-emerald-600"
                  />

                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                        text-slate-800
                      "
                    >

                      AI Risk Analysis

                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >

                      Why this project carries a {risk.label.toLowerCase()} classification

                    </p>

                  </div>

                </div>

              </div>


              <div
                className="
                  p-7
                "
              >


                {/* TOP */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-8
                    lg:grid-cols-[260px_1fr]
                    lg:items-center
                  "
                >


                {/* =========================================
    RISK SCORE CIRCLE
========================================= */}

<div 
  className="
    flex 
    flex-col 
    items-center 
    justify-center 
    rounded-3xl 
    bg-slate-50 
    py-8
    transition-all
    duration-500
    hover:-translate-y-1
    hover:shadow-xl
  "
>

  <div 
    className="
      relative 
      flex 
      h-40 
      w-40 
      items-center 
      justify-center 
      rounded-full
      transition-all
      duration-500
    "
  >

    {/* BACKGROUND CIRCLE */}

    <div
      className={`
        absolute
        inset-0
        rounded-full
        border-[12px]
        ${
          project.riskLevel === "Low"
            ? "border-green-100"
            : project.riskLevel === "Medium"
            ? "border-orange-100"
            : "border-red-100"
        }
      `}
    />


    {/* COLORED RISK CIRCLE */}

    <div
      className={`
        absolute
        inset-0
        rounded-full
        border-[12px]
        border-transparent
        transition-all
        duration-700

        ${
          project.riskLevel === "Low"
            ? `
              border-t-green-500
              border-r-green-500
              border-b-green-500
            `
            : project.riskLevel === "Medium"
            ? `
              border-t-orange-500
              border-r-orange-500
              border-b-orange-500
            `
            : `
              border-t-red-500
              border-r-red-500
              border-b-red-500
            `
        }
      `}
    />


    {/* INNER CIRCLE */}

    <div
      className={`
        absolute
        inset-[12px]
        rounded-full
        transition-all
        duration-500

        ${
          project.riskLevel === "Low"
            ? "bg-green-50"
            : project.riskLevel === "Medium"
            ? "bg-orange-50"
            : "bg-red-50"
        }
      `}
    />


    {/* SCORE */}

    <div className="relative z-10 text-center">

      <div
        className={`
          text-5xl
          font-black
          transition-all
          duration-500

          ${
            project.riskLevel === "Low"
              ? "text-green-600"
              : project.riskLevel === "Medium"
              ? "text-orange-600"
              : "text-red-600"
          }
        `}
      >

        {project.riskScore}

      </div>


      <div
        className="
          mt-2
          text-xs
          font-bold
          tracking-widest
          text-slate-400
        "
      >

        RISK SCORE / 100

      </div>

    </div>

  </div>


  {/* RISK LABEL */}

  <div
    className={`
      mt-5
      rounded-full
      border
      px-6
      py-2
      text-sm
      font-bold
      transition-all
      duration-300

      ${
        project.riskLevel === "Low"
          ? `
            border-green-200
            bg-green-50
            text-green-700
            hover:bg-green-100
          `
          : project.riskLevel === "Medium"
          ? `
            border-orange-200
            bg-orange-50
            text-orange-700
            hover:bg-orange-100
          `
          : `
            border-red-200
            bg-red-50
            text-red-700
            hover:bg-red-100
          `
      }
    `}
  >

    {project.riskLevel} Risk

  </div>

</div>


                  {/* SUMMARY */}

                  <div
                    className={`
                      rounded-3xl
                      border
                      p-6
                      ${risk.bg}
                      ${risk.border}
                    `}
                  >

                    <div
                      className="
                        flex
                        gap-4
                      "
                    >

                      <ShieldCheck
                        size={27}
                        className={risk.text}
                      />

                      <div>

                        <h3
                          className={`
                            text-xl
                            font-bold
                            ${risk.text}
                          `}
                        >

                          {
                            project.riskScore <= 30
                              ? "No significant anomalies detected"
                              : project.riskScore <= 70
                              ? "Moderate anomalies require monitoring"
                              : "Significant anomalies detected"
                          }

                        </h3>

                        <p
                          className="
                            mt-2
                            leading-7
                            text-slate-600
                          "
                        >

                          {
                            project.riskScore <= 30
                              ? "Financial records, timeline and physical progress appear broadly consistent for this work."
                              : project.riskScore <= 70
                              ? "The project requires periodic monitoring due to financial, progress or timeline variations."
                              : "Multiple risk indicators require closer investigation and verification against official records."
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* RISK CARDS */}

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                  "
                >

                  <RiskCard
                    icon={<IndianRupee size={20} />}
                    title="Financial Risk"
                    score={financialRisk}
                    max={30}
                    description={`Expenditure of ${expenditurePercent}% recorded against ${progress}% physical progress.`}
                  />


                  <RiskCard
                    icon={<Clock3 size={20} />}
                    title="Project Delay"
                    score={delayRisk}
                    max={30}
                    description={`Current project status is ${project.status}. Expected completion: ${project.expectedCompletion || "Not Available"}.`}
                  />


                  <RiskCard
                    icon={<Copy size={20} />}
                    title="Duplicate Work Risk"
                    score={duplicateRisk}
                    max={20}
                    description={`AI similarity screening checks nearby and related ${project.category} projects.`}
                  />


                  <RiskCard
                    icon={<Users size={20} />}
                    title="Public Report Risk"
                    score={publicRisk}
                    max={20}
                    description="No verified public complaints have been recorded for this project."
                  />

                </div>


                {/* TOTAL */}

                <div
                  className="
                    mt-5
                    flex
                    flex-col
                    justify-between
                    gap-3
                    rounded-2xl
                    bg-[#17263a]
                    px-7
                    py-6
                    sm:flex-row
                    sm:items-center
                  "
                >

                  <span
                    className="
                      text-sm
                      font-bold
                      tracking-[0.18em]
                      text-slate-300
                    "
                  >

                    TOTAL AI RISK SCORE

                  </span>


                  <div
                    className="
                      flex
                      items-end
                      gap-1
                    "
                  >

                    <span
                      className="
                        text-4xl
                        font-black
                        text-white
                      "
                    >

                      {project.riskScore}

                    </span>

                    <span
                      className="
                        mb-1
                        text-lg
                        font-bold
                        text-slate-400
                      "
                    >

                      /100

                    </span>

                  </div>

                </div>

              </div>

            </motion.section>


            {/* ===========================================
                FINANCIAL VS PHYSICAL PROGRESS
            =========================================== */}

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}

              className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-7
                shadow-lg
                shadow-slate-200/50
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                "
              >

                Financial vs Physical Progress

              </h2>


              <p
                className="
                  mt-1
                  text-slate-500
                "
              >

                Mismatch between money spent and work on ground

              </p>


              {/* CHART */}

              <div
                className="
                  mt-10
                  grid
                  grid-cols-2
                  items-end
                  gap-10
                  px-5
                  sm:gap-20
                  sm:px-14
                  lg:px-24
                "
              >


                <ProgressBarChart
                  label="Expenditure"
                  value={project.expenditurePercentage}
                  color="bg-orange-500"
                />


                <ProgressBarChart
                  label="Physical Progress"
                  value={project.physicalProgress}
                  color="bg-[#243b5a]"
                />

              </div>


              {/* BOTTOM INFO */}

              <div
                className="
                  mt-10
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-3
                "
              >

                <MiniStat
                  label="Sanctioned Cost"
                  value={project.cost}
                />

                <MiniStat
                  label="Total Expenditure"
                  value={project.expenditure}
                />

                <MiniStat
                  label="Physical Progress"
                  value={`${progress}%`}
                />

              </div>

            </motion.section>

          </div>


          {/* =============================================
              RIGHT SIDE
          ============================================= */}

          <div
            className="
              flex
              flex-col
              gap-8
            "
          >


            {/* ===========================================
                REPORT PROJECT
            =========================================== */}

            <motion.section
              id="report-project"

              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}

              className="
                rounded-[28px]
                border
                border-red-200
                bg-white
                p-7
                shadow-lg
                shadow-red-100/50
              "
            >

              <div
                className="
                  flex
                  gap-4
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
                    rounded-2xl
                    bg-red-600
                    text-white
                    shadow-lg
                    shadow-red-200
                  "
                >

                  <Flag size={24} />

                </div>


                <div>

                  <h2
                    className="
                      text-xl
                      font-bold
                      text-slate-800
                    "
                  >

                    See something wrong?

                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >

                    Work incomplete on ground?

                  </p>

                </div>

              </div>


              <p
                className="
                  mt-6
                  leading-7
                  text-slate-500
                "
              >

                Upload photo evidence — the AI will verify it
                against official records and route it to the
                investigation authority.

              </p>


              <button
                onClick={() => setShowReportModal(true)}
                className="
                  group
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-[#17263a]
                  py-4
                  font-bold
                  text-white
                  shadow-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-red-600
                  hover:shadow-xl
                  hover:shadow-red-200
                  active:scale-[0.98]
                "
              >

                <Flag
                  size={20}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-rotate-6
                  "
                />

                Report Project Issue

              </button>

            </motion.section>


            {/* ===========================================
                CITIZEN WATCH
            =========================================== */}

{/* ===========================================
    CITIZEN WATCH
=========================================== */}

<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{
    once: true,
  }}

  className="
    rounded-[28px]
    border
    border-slate-200
    bg-white
    p-7
    shadow-lg
    shadow-slate-200/50

    transition-all
    duration-300

    hover:-translate-y-1
    hover:shadow-xl
  "
>

  <SectionTitle
    icon={<Users size={21} />}
    title="Citizen Watch"
  />


  <div
    className="
      mt-6
      flex
      items-center
      justify-between

      rounded-2xl

      bg-slate-50

      px-6
      py-5

      transition-all
      duration-300

      hover:bg-orange-50
    "
  >

    {/* LEFT */}

    <div>

      <span
        className="
          font-medium
          text-slate-600
        "
      >
        Public reports filed
      </span>


      <p
        className="
          mt-1
          text-xs
          text-slate-400
        "
      >
        Citizen observations and reported issues
      </p>

    </div>


    {/* REPORT COUNT */}

    <motion.span

      key={citizenReports}

      initial={{
        opacity: 0,
        scale: 0.6,
        y: 10,
      }}

      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}

      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}

      className="
        flex
        h-14
        min-w-14

        items-center
        justify-center

        rounded-2xl

        bg-orange-500

        px-4

        text-2xl
        font-black
        text-white

        shadow-lg
        shadow-orange-200
      "
    >

      {citizenReports}

    </motion.span>

  </div>


  {/* STATUS */}

  <div
    className="
      mt-5

      flex
      items-center
      gap-3

      rounded-xl

      border
      border-orange-100

      bg-orange-50/50

      px-4
      py-3
    "
  >

    <div
      className="
        h-2.5
        w-2.5

        rounded-full

        bg-orange-500

        animate-pulse
      "
    />


    <p
      className="
        text-sm
        text-slate-500
      "
    >

      Citizen monitoring is active for this project.

    </p>

  </div>


  {/* DESCRIPTION */}

  <p
    className="
      mt-5

      text-sm
      leading-6

      text-slate-500
    "
  >

    Public reports help authorities identify
    project delays, quality concerns and
    potential issues on the ground.

  </p>

</motion.section>


            {/* ===========================================
                PROJECT TIMELINE
            =========================================== */}

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}

              className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-7
                shadow-lg
                shadow-slate-200/50
              "
            >

              <SectionTitle
                icon={<CalendarDays size={21} />}
                title="Project Timeline"
              />


              <div
                className="
                  mt-8
                  space-y-8
                "
              >

                {timeline.map(
                  (item, index) => (

                    <TimelineItem
                      key={index}
                      title={item.title}
                      date={item.date}
                      description={item.description}
                      last={
                        index === timeline.length - 1
                      }
                    />

                  )
                )}

              </div>

            </motion.section>
                <ReportIssueModal
  isOpen={showReportModal}

  onClose={() =>
    setShowReportModal(false)
  }

  project={project}

  onReportSuccess={
    handleReportSuccess
  }
/>


            {/* ===========================================
                PROJECT PROGRESS
            =========================================== */}

            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}

              className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-7
                shadow-lg
                shadow-slate-200/50
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                "
              >

                Project Progress

              </h2>


              <div className="mt-7">

                <ProgressLine
                  label="Physical Progress"
                  value={project.physicalProgress}
                  color="bg-emerald-500"
                />

                <ProgressLine
                  label="Financial Utilisation"
                  value={project.expenditurePercentage}
                  color="bg-orange-500"
                />

              </div>

            </motion.section>

          </div>

        </div>

      </main>

    </motion.div>

  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon,
  title,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <div className="text-orange-500">

        {icon}

      </div>


      <h2
        className="
          text-xl
          font-bold
          text-slate-800
        "
      >

        {title}

      </h2>

    </div>

  );
}


/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
}) {

  return (

    <motion.div
      whileHover={{
        x: 4,
      }}

      className="
        flex
        flex-col
        justify-between
        gap-3
        border-b
        border-dashed
        border-slate-200
        py-5
        sm:flex-row
        sm:items-center
      "
    >

      <span
        className="
          text-xs
          font-bold
          tracking-[0.12em]
          text-slate-500
        "
      >

        {label}

      </span>


      <span
        className="
          text-sm
          font-semibold
          text-right
          text-slate-700
        "
      >

        {value}

      </span>

    </motion.div>

  );
}


/* =========================================================
   RISK CARD
========================================================= */

function RiskCard({
  icon,
  title,
  score,
  max,
  description,
}) {

  const percentage =
    Math.min(
      100,
      (score / max) * 100
    );


  return (

    <motion.div
      whileHover={{
        y: -5,
      }}

      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-shadow
        duration-300
        hover:shadow-lg
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div className="text-orange-500">

            {icon}

          </div>


          <h3
            className="
              font-bold
              text-slate-700
            "
          >

            {title}

          </h3>

        </div>


        <div
          className="
            text-lg
            font-black
            text-slate-700
          "
        >

          {score}

          <span
            className="
              text-sm
              text-slate-400
            "
          >

            /{max}

          </span>

        </div>

      </div>


      <p
        className="
          mt-4
          min-h-[50px]
          text-sm
          leading-6
          text-slate-500
        "
      >

        {description}

      </p>


      <div
        className="
          mt-4
          h-2
          overflow-hidden
          rounded-full
          bg-slate-100
        "
      >

        <motion.div
          initial={{
            width: 0,
          }}

          whileInView={{
            width: `${percentage}%`,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.8,
          }}

          className="
            h-full
            rounded-full
            bg-emerald-500
          "
        />

      </div>

    </motion.div>

  );
}


/* =========================================================
   BAR CHART
========================================================= */

function ProgressBarChart({
  label,
  value,
  color,
}) {

  return (

    <div
      className="
        flex
        flex-col
        items-center
      "
    >

      <div
        className="
          relative
          flex
          h-[280px]
          w-full
          max-w-[150px]
          items-end
          overflow-hidden
          rounded-t-2xl
          bg-slate-100
        "
      >

        <motion.div
          initial={{
            height: 0,
          }}

          whileInView={{
            height: `${value}%`,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 1,
            ease: "easeOut",
          }}

          className={`
            w-full
            rounded-t-2xl
            ${color}
          `}
        />


        <div
          className="
            absolute
            inset-x-0
            top-4
            text-center
            text-sm
            font-bold
            text-slate-500
          "
        >

          {value}%

        </div>

      </div>


      <p
        className="
          mt-4
          text-center
          font-bold
          text-slate-600
        "
      >

        {label}

      </p>

    </div>

  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}) {

  return (

    <motion.div
      whileHover={{
        y: -3,
      }}

      className="
        rounded-2xl
        bg-slate-50
        p-5
        transition-all
        duration-300
        hover:bg-orange-50
      "
    >

      <p
        className="
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-400
        "
      >

        {label}

      </p>


      <p
        className="
          mt-2
          text-lg
          font-black
          text-slate-800
        "
      >

        {value}

      </p>

    </motion.div>

  );
}


/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({
  title,
  date,
  description,
  last,
}) {

  return (

    <div
      className="
        relative
        flex
        gap-5
      "
    >


      {/* LINE */}

      {!last && (

        <div
          className="
            absolute
            left-[7px]
            top-5
            h-[calc(100%+25px)]
            w-[2px]
            bg-slate-200
          "
        />

      )}


      {/* DOT */}

      <div
        className="
          relative
          z-10
          mt-1
          h-4
          w-4
          shrink-0
          rounded-full
          bg-[#385775]
          ring-4
          ring-white
        "
      />


      <div>

        <h3
          className="
            font-bold
            text-slate-700
          "
        >

          {title}

        </h3>


        <p
          className="
            mt-1
            font-mono
            text-xs
            text-slate-400
          "
        >

          {date}

        </p>


        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
          "
        >

          {description}

        </p>

      </div>

    </div>

  );
}


/* =========================================================
   PROGRESS LINE
========================================================= */

function ProgressLine({
  label,
  value,
  color,
}) {

  return (

    <div className="mb-7">

      <div
        className="
          mb-3
          flex
          justify-between
        "
      >

        <span
          className="
            text-sm
            font-semibold
            text-slate-600
          "
        >

          {label}

        </span>


        <span
          className="
            text-sm
            font-black
            text-slate-800
          "
        >

          {value}%

        </span>

      </div>


      <div
        className="
          h-3
          overflow-hidden
          rounded-full
          bg-slate-100
        "
      >

        <motion.div
          initial={{
            width: 0,
          }}

          whileInView={{
            width: `${value}%`,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 1,
          }}

          className={`
            h-full
            rounded-full
            ${color}
          `}
        />

        

      </div>

 

    </div>
    

  );
}