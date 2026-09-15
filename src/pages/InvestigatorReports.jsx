import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Archive,
  Filter,
  Fingerprint,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  Eye,
  FolderOpen,
  Bot,
  Search,
  Loader2,
  ClipboardCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* =========================================
   IMPORT PROJECT DATA

   CHANGE PATH ONLY IF REQUIRED
========================================= */

import projectsData from "../data/projects";


/* =========================================
   DUMMY REPORT DATA
========================================= */

const DUMMY_REPORTS = [
  {
    id: "REPORT-1001",

    projectId: "MPLADS-UP-12012",

    title:
      "CC Road Work – 240 Meter Village Bhitari Link",

    issueType:
      "Project Incomplete",

    state:
      "Uttar Pradesh",

    district:
      "Muzaffarnagar",

    date:
      "10 September 2026",

    aiConfidence: 82,

    risk:
      "High",

    status:
      "Pending Investigation",

    evidenceImage:
      "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    description:
      "The road construction is still incomplete but the project is marked completed. Barely 50% of the stretch is laid and the remaining portion is kaccha with loose material stacked on the roadside.",

    aiObservation:
      "Uploaded evidence indicates incomplete road construction. Surface layer and edging are absent in the second half of the stretch, contradicting the recorded completed status.",
  },

  {
    id: "REPORT-1002",

    projectId: "MPLADS-UP-12059",

    title:
      "Open Air Gym & Play Area, Kalyanpur",

    issueType:
      "Poor Construction Quality",

    state:
      "Uttar Pradesh",

    district:
      "Muzaffarnagar",

    date:
      "08 September 2026",

    aiConfidence: 88,

    risk:
      "High",

    status:
      "Pending Investigation",

    evidenceImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85",

    description:
      "The construction quality appears poor. Several areas show cracks, damaged surfaces and unfinished work.",

    aiObservation:
      "AI detected visible surface deterioration and irregular construction quality. Evidence suggests possible deviation from expected project standards.",
  },

  {
    id: "REPORT-1003",

    projectId: "MPLADS-MH-12459",

    title:
      "Anganwadi Centre Building, Rampur Kalan",

    issueType:
      "Project Not Started",

    state:
      "Maharashtra",

    district:
      "Nashik",

    date:
      "04 September 2026",

    aiConfidence: 91,

    risk:
      "High",

    status:
      "Under Review",

    evidenceImage:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85",

    description:
      "The project is listed as sanctioned but no construction activity is visible at the site.",

    aiObservation:
      "Image analysis indicates no visible active construction corresponding to the registered project stage.",
  },

  {
    id: "REPORT-1004",

    projectId: "MPLADS-GJ-21672",

    title:
      "Widening of Govindpur-Tendua Road (KM 0 to 18)",

    issueType:
      "Project Incomplete",

    state:
      "Gujarat",

    district:
      "Surat",

    date:
      "29 August 2026",

    aiConfidence: 79,

    risk:
      "Medium",

    status:
      "Pending Investigation",

    evidenceImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85",

    description:
      "Road widening work is incomplete and several areas remain unsafe for public movement.",

    aiObservation:
      "AI analysis found unfinished road sections and possible safety concerns around the construction zone.",
  },

  {
    id: "REPORT-1005",

    projectId: "MPLADS-MP-11201",

    title:
      "Multipurpose Sports Court, Raipur",

    issueType:
      "Possible Fraud",

    state:
      "Madhya Pradesh",

    district:
      "Gwalior",

    date:
      "21 August 2026",

    aiConfidence: 74,

    risk:
      "High",

    status:
      "Under Investigation",

    evidenceImage:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85",

    description:
      "The visible construction does not appear to match the project progress recorded in the public system.",

    aiObservation:
      "Potential mismatch detected between visible construction progress and reported project completion information.",
  },

  {
    id: "REPORT-1006",

    projectId: "MPLADS-MP-12269",

    title:
      "Football Ground with Gallery, Bharala",

    issueType:
      "Other",

    state:
      "Madhya Pradesh",

    district:
      "Bhopal",

    date:
      "14 August 2026",

    aiConfidence: 76,

    risk:
      "Medium",

    status:
      "Closed",

    evidenceImage:
      "https://plus.unsplash.com/premium_photo-1684106554193-89dcabcd600b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    description:
      "Citizen reported concerns regarding incomplete surrounding infrastructure.",

    aiObservation:
      "Evidence reviewed and issue was resolved after verification.",
  },
];


/* =========================================
   NORMALIZE PROJECT DATA
========================================= */

function getProjectsArray() {

  if (Array.isArray(projectsData)) {
    return projectsData;
  }

  if (
    projectsData &&
    Array.isArray(projectsData.projects)
  ) {
    return projectsData.projects;
  }

  return [];
}


/* =========================================
   RISK COLORS
========================================= */

function getRiskStyle(risk) {

  if (risk === "High") {

    return `
      bg-red-500
      text-white
      shadow-red-500/30
    `;
  }

  if (risk === "Medium") {

    return `
      bg-amber-400
      text-slate-900
      shadow-amber-400/30
    `;
  }

  return `
    bg-emerald-500
    text-white
    shadow-emerald-500/30
  `;
}


/* =========================================
   STATUS STYLE
========================================= */

function getStatusStyle(status) {

  if (
    status === "Pending Investigation"
  ) {

    return `
      border-amber-200
      bg-amber-50
      text-amber-700
    `;
  }

  if (
    status === "Under Investigation"
  ) {

    return `
      border-red-200
      bg-red-50
      text-red-600
    `;
  }

  if (
    status === "Closed"
  ) {

    return `
      border-emerald-200
      bg-emerald-50
      text-emerald-700
    `;
  }

  return `
    border-blue-200
    bg-blue-50
    text-blue-700
  `;
}


/* =========================================
   ISSUE TYPE STYLE
========================================= */

function getIssueStyle() {

  return `
    border-red-200
    bg-red-50
    text-red-700
  `;
}


/* =========================================
   EVIDENCE VISUAL

   USED WHEN USER HAS NOT
   UPLOADED IMAGE
========================================= */

function EvidencePlaceholder({
  report,
}) {

  return (

    <div
      className="
        relative
        h-full
        w-full
        overflow-hidden

        bg-gradient-to-br
        from-slate-900
        via-slate-700
        to-slate-900
      "
    >

      <div
        className="
          absolute
          inset-0

          opacity-30

          bg-[radial-gradient(circle_at_20%_30%,white_1px,transparent_1px)]
          bg-[length:16px_16px]
        "
      />

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-t
          from-black/80
          via-black/10
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-0

          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-3

            text-center
          "
        >

          <div
            className="
              flex
              h-16
              w-16

              items-center
              justify-center

              rounded-2xl

              border
              border-white/20

              bg-white/10

              backdrop-blur-md
            "
          >

            <Bot
              size={28}
              className="
                text-orange-300
              "
            />

          </div>

          <span
            className="
              max-w-[250px]

              text-sm
              font-semibold

              text-white/90
            "
          >

            Citizen Evidence

          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================
   REPORT IMAGE
========================================= */

function ReportImage({
  report,
}) {

  if (
    report.evidenceImage
  ) {

    return (

      <img
        src={report.evidenceImage}
        alt={report.title}
        className="
          h-full
          w-full

          object-cover
        "
      />
      
      

    );
  }
  <div className="mt-4 rounded-xl bg-slate-50 p-4">

  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
    Citizen Description
  </p>

  <p className="text-sm leading-relaxed text-slate-600">
    {report?.description}
  </p>

</div>


  return (

    <EvidencePlaceholder
      report={report}
    />

  );
}


/* =========================================
   REPORT CARD
========================================= */

function ReportCard({

  report,

  index,

  onViewEvidence,

  onStartInvestigation,

  onOpenProject,

}) {

  const isInvestigating =
    report.status ===
    "Under Investigation";


  const isClosed =
    report.status ===
    "Closed";


  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 30,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.45,
        delay: index * 0.07,
      }}

      whileHover={{
        y: -5,
      }}

      className="
        group

        overflow-hidden

        rounded-[22px]

        border
        border-slate-200

        bg-white

        shadow-lg
        shadow-slate-200/50

        transition-all
        duration-300

        hover:border-orange-200

        hover:shadow-xl
        hover:shadow-orange-100/50
      "
    >


      {/* ===============================
          IMAGE
      =============================== */}

      <div
        className="
          relative

          h-[175px]

          overflow-hidden
        "
      >

        <motion.div

          whileHover={{
            scale: 1.06,
          }}

          transition={{
            duration: 0.6,
          }}

          className="
            h-full
            w-full
          "
        >

          <ReportImage
            report={report}
          />

        </motion.div>


        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-t
            from-slate-950/70
            via-transparent
            to-transparent
          "
        />


        {/* REPORT ID */}

        <div
          className="
            absolute

            bottom-3
            left-4
          "
        >

          <span
            className="
              text-[10px]

              font-black

              tracking-wider

              text-white
            "
          >

            {report.id}

          </span>

        </div>


        {/* RISK */}

        <div
          className="
            absolute

            bottom-3
            right-4
          "
        >

          <span
            className={`
              rounded-full

              px-3
              py-1

              text-[10px]

              font-black

              shadow-lg

              ${getRiskStyle(
                report.risk
              )}
            `}
          >

            {report.risk}

          </span>

        </div>

      </div>


      {/* ===============================
          CONTENT
      =============================== */}

      <div
        className="
          p-4
        "
      >


        {/* TAGS */}

        <div
          className="
            mb-3

            flex
            items-center
            justify-between

            gap-2
          "
        >

          <span
            className={`
              rounded-lg

              border

              px-2.5
              py-1

              text-[11px]

              font-bold

              ${getIssueStyle()}
            `}
          >

            {report.issueType}

          </span>


          <span
            className={`
              whitespace-nowrap

              rounded-full

              border

              px-3
              py-1

              text-[10px]

              font-bold

              ${getStatusStyle(
                report.status
              )}
            `}
          >

            {report.status}

          </span>

        </div>


        {/* TITLE */}

        <h3
          className="
            min-h-[48px]

            text-[15px]
            font-bold

            leading-6

            text-slate-800
          "
        >

          {report.title}

        </h3>


        {/* PROJECT ID */}

        <p
          className="
            mt-1

            text-[11px]

            font-bold

            tracking-wide

            text-slate-400
          "
        >

          {report.projectId}

        </p>


        {/* LOCATION */}

        <div
          className="
            mt-3

            flex
            flex-wrap

            items-center

            gap-x-4
            gap-y-2

            text-[11px]

            text-slate-500
          "
        >

          <div
            className="
              flex
              items-center
              gap-1
            "
          >

            <MapPin
              size={13}
            />

            {report.district},{" "}

            {report.state}

          </div>


          <div
            className="
              flex
              items-center
              gap-1
            "
          >

            <Calendar
              size={13}
            />

            {report.date}

          </div>

        </div>


        {/* ===============================
            AI CONFIDENCE
        =============================== */}

        <div
          className="
            mt-4

            flex
            items-center
            justify-between

            rounded-xl

            border
            border-slate-200

            bg-slate-50

            px-3
            py-2.5
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Bot
              size={15}
              className="
                text-orange-500
              "
            />

            <span
              className="
                text-[11px]

                font-semibold

                text-slate-600
              "
            >

              AI Confidence

            </span>

          </div>


          <span
            className="
              text-sm

              font-black

              text-orange-600
            "
          >

            {report.aiConfidence}%

          </span>

        </div>


        {/* ===============================
            ACTIONS
        =============================== */}

        <div
          className="
            mt-4

            grid
            grid-cols-2

            gap-2
          "
        >

          {/* VIEW */}

          <button

            onClick={() =>
              onViewEvidence(
                report
              )
            }

            className="
              flex

              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-slate-300

              bg-white

              py-3

              text-[11px]

              font-bold

              text-slate-600

              transition-all
              duration-300

              hover:border-orange-300

              hover:bg-orange-50

              hover:text-orange-600

              active:scale-[0.97]
            "
          >

            <Eye
              size={14}
            />

            View Evidence

          </button>


          {/* INVESTIGATION */}

          <button

            disabled={
              isClosed
            }

            onClick={() =>
              onStartInvestigation(
                report
              )
            }

            className={`
              flex

              items-center
              justify-center
              gap-2

              rounded-xl

              py-3

              text-[11px]

              font-bold

              transition-all
              duration-300

              active:scale-[0.97]

              ${
                isClosed
                  ? `
                    cursor-not-allowed

                    bg-slate-200

                    text-slate-400
                  `
                  : isInvestigating
                  ? `
                    bg-slate-200

                    text-slate-500
                  `
                  : `
                    bg-red-500

                    text-white

                    shadow-lg
                    shadow-red-500/20

                    hover:bg-red-600

                    hover:shadow-xl
                    hover:shadow-red-500/30
                  `
              }
            `}
          >

            <Fingerprint
              size={14}
            />

            {isClosed
              ? "Closed"
              : isInvestigating
              ? "Investigating"
              : "Start Investigation"}

          </button>

        </div>


        {/* OPEN PROJECT */}

        <button

          onClick={() =>
            onOpenProject(
              report
            )
          }

          className="
            mt-2

            flex
            w-full

            items-center
            justify-center
            gap-2

            rounded-xl

            border
            border-slate-200

            bg-slate-50

            py-3

            text-[11px]

            font-semibold

            text-slate-600

            transition-all
            duration-300

            hover:bg-slate-100

            hover:text-slate-900

            active:scale-[0.98]
          "
        >

          <FolderOpen
            size={15}
          />

          Open Project File

        </button>

      </div>

    </motion.div>
  );
}


/* =========================================
   EVIDENCE MODAL
========================================= */

function EvidenceModal({

  report,

  onClose,

  onStartInvestigation,

}) {

  if (!report) {
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

        onClick={onClose}

        className="
          fixed
          inset-0

          z-[99999]

          flex

          items-center
          justify-center

          bg-slate-950/60

          p-4

          backdrop-blur-md
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
            y: 30,
          }}

          transition={{
            type: "spring",
            stiffness: 220,
            damping: 22,
          }}

          onClick={(event) =>
            event.stopPropagation()
          }

          className="
            relative

            max-h-[92vh]
            w-full
            max-w-[770px]

            overflow-y-auto

            rounded-[28px]

            bg-white

            shadow-2xl
          "
        >


          {/* ===============================
              TOP ACCENT
          =============================== */}

          <div
            className="
              absolute

              left-0
              top-0

              flex
              h-[3px]
              w-full
            "
          >

            <div
              className="
                w-1/3
                bg-orange-500
              "
            />

            <div
              className="
                w-1/3
                bg-slate-400
              "
            />

            <div
              className="
                w-1/3
                bg-emerald-500
              "
            />

          </div>


          {/* ===============================
              HEADER
          =============================== */}

          <div
            className="
              flex

              items-start
              justify-between

              border-b
              border-slate-200

              px-6
              pb-4
              pt-6
            "
          >

            <div>

              <h2
                className="
                  text-[19px]

                  font-black

                  text-slate-800
                "
              >

                Evidence — {report.id}

              </h2>


              <p
                className="
                  mt-1

                  text-[12px]

                  font-medium

                  text-slate-400
                "
              >

                {report.projectId}

                {" • "}

                Submitted {report.date}

              </p>

            </div>


            <button

              onClick={onClose}

              className="
                flex

                h-10
                w-10

                items-center
                justify-center

                rounded-full

                border
                border-slate-200

                text-slate-400

                transition-all

                hover:rotate-90

                hover:border-red-200

                hover:bg-red-50

                hover:text-red-500
              "
            >

              <X
                size={20}
              />

            </button>

          </div>


          {/* ===============================
              CONTENT
          =============================== */}

          <div
            className="
              p-6
            "
          >


            {/* IMAGE */}

            <div
              className="
                h-[370px]

                overflow-hidden

                rounded-2xl

                border
                border-slate-200
              "
            >

              <ReportImage
                report={report}
              />

            </div>


            {/* AI SECTION */}

            <div
              className="
                mt-4

                grid

                grid-cols-1
                md:grid-cols-[1fr_115px]

                gap-4
              "
            >


              {/* OBSERVATION */}

              <div
                className="
                  rounded-2xl

                  border
                  border-orange-200

                  bg-gradient-to-br
                  from-orange-50
                  to-white

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

                  <Bot
                    size={16}
                    className="
                      text-orange-500
                    "
                  />

                  <span
                    className="
                      text-[10px]

                      font-black

                      tracking-[0.12em]

                      text-orange-700
                    "
                  >

                    AI OBSERVATION

                  </span>

                </div>


                <p
                  className="
                    mt-3

                    text-[14px]

                    leading-6

                    text-slate-600
                  "
                >

                  {report.aiObservation}

                </p>

              </div>


              {/* CONFIDENCE */}

              <div
                className="
                  flex

                  flex-col

                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-slate-200

                  bg-slate-50
                "
              >

                <span
                  className="
                    text-[10px]

                    font-black

                    tracking-[0.14em]

                    text-slate-400
                  "
                >

                  CONFIDENCE

                </span>


                <span
                  className="
                    mt-2

                    text-3xl

                    font-black

                    text-slate-800
                  "
                >

                  {report.aiConfidence}%

                </span>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div
              className="
                mt-3

                rounded-xl

                bg-slate-50

                px-4
                py-4
              "
            >

              <p
                className="
                  text-[13px]

                  leading-6

                  text-slate-500
                "
              >

                <span
                  className="
                    font-bold

                    text-slate-700
                  "
                >

                  Citizen description:

                </span>

                {" "}

                {report.description}

              </p>

            </div>


            {/* START */}

            <button

              onClick={() => {

                onStartInvestigation(
                  report
                );

                onClose();

              }}

              className="
                mt-4

                flex
                w-full

                items-center
                justify-center
                gap-3

                rounded-xl

                bg-red-500

                py-4

                text-sm

                font-black

                text-white

                shadow-xl
                shadow-red-500/20

                transition-all
                duration-300

                hover:-translate-y-1

                hover:bg-red-600

                hover:shadow-2xl
                hover:shadow-red-500/30

                active:scale-[0.98]
              "
            >

              <Fingerprint
                size={18}
              />

              Start Investigation on {report.projectId}

            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
}


/* =========================================
   MAIN PAGE
========================================= */

export default function InvestigatorReports() {

  const navigate =
    useNavigate();


  /* =======================================
     STATES
  ======================================= */

  const [
    reports,
    setReports,
  ] = useState([]);


  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All Reports");


  const [
    selectedReport,
    setSelectedReport,
  ] = useState(null);


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const projects =
    getProjectsArray();


  /* =======================================
     LOAD REPORTS
  ======================================= */

  useEffect(() => {

    const loadReports = () => {

      try {

        const storedReports =
          JSON.parse(
            localStorage.getItem(
              "mplads_public_reports"
            ) || "[]"
          );


        const realReports =
          Array.isArray(
            storedReports
          )
            ? storedReports.map(
                (
                  report,
                  index
                ) => {

                  const project =
                    projects.find(
                      (item) =>
                        item.id ===
                          report.projectId ||
                        item.projectId ===
                          report.projectId ||
                        item.code ===
                          report.projectId
                    );


                  return {

                    id:
                      report.id ||
                      `REPORT-PUBLIC-${index + 1}`,

                    projectId:
                      report.projectId ||
                      project?.id ||
                      "MPLADS-UNKNOWN",

                    title:
                      project?.title ||
                      project?.name ||
                      report.projectTitle ||
                      "Citizen Reported Project",

                    issueType:
                      report.issueType ||
                      "Other",

                    state:
                      project?.state ||
                      report.state ||
                      "India",

                    district:
                      project?.district ||
                      report.district ||
                      "Unknown District",

                    date:
                      report.date ||
                      report.submittedAt ||
                      "Recently",

                    aiConfidence:
                      report.aiConfidence ||
                      85,

                    risk:
                      report.risk ||
                      "High",

                    status:
                      report.status ||
                      "Pending Investigation",

                    evidenceImage:
                      report.evidenceImage ||
                      report.image ||
                      report.imageUrl ||
                      null,

                    description:
                      report.description ||
                      "Citizen submitted evidence for investigation.",

                    aiObservation:
                      report.aiObservation ||
                      "AI verification completed. Evidence has been flagged for investigator review.",
                  };

                }
              )
            : [];


        /* =================================
           REAL PUBLIC REPORTS FIRST
        ================================= */

        setReports([
          ...realReports,
          ...DUMMY_REPORTS,
        ]);

      } catch (error) {

        console.error(
          "Unable to load citizen reports:",
          error
        );


        setReports(
          DUMMY_REPORTS
        );

      }

    };


    loadReports();


    /* =====================================
       LISTEN FOR NEW PUBLIC REPORT
    ===================================== */

    const handleNewReport =
      () => {

        loadReports();

      };


    window.addEventListener(
      "storage",
      handleNewReport
    );


    window.addEventListener(
      "mpladsReportSubmitted",
      handleNewReport
    );


    return () => {

      window.removeEventListener(
        "storage",
        handleNewReport
      );


      window.removeEventListener(
        "mpladsReportSubmitted",
        handleNewReport
      );

    };

  }, [
    projects.length,
  ]);


  /* =======================================
     FILTER COUNTS
  ======================================= */

  const counts =
    useMemo(() => {

      return {

        total:
          reports.length,

        pending:
          reports.filter(
            (report) =>
              report.status ===
              "Pending Investigation"
          ).length,

        investigation:
          reports.filter(
            (report) =>
              report.status ===
              "Under Investigation"
          ).length,

        closed:
          reports.filter(
            (report) =>
              report.status ===
              "Closed"
          ).length,

      };

    }, [
      reports,
    ]);


  /* =======================================
     FILTER REPORTS
  ======================================= */

  const filteredReports =
    useMemo(() => {

      return reports.filter(
        (report) => {

          let filterMatch =
            true;


          if (
            activeFilter ===
            "Pending"
          ) {

            filterMatch =
              report.status ===
              "Pending Investigation";

          }


          if (
            activeFilter ===
            "Under Investigation"
          ) {

            filterMatch =
              report.status ===
              "Under Investigation";

          }


          if (
            activeFilter ===
            "Closed"
          ) {

            filterMatch =
              report.status ===
              "Closed";

          }


          const query =
            searchQuery
              .toLowerCase()
              .trim();


          const searchMatch =
            !query ||
            report.title
              ?.toLowerCase()
              .includes(query) ||
            report.projectId
              ?.toLowerCase()
              .includes(query) ||
            report.issueType
              ?.toLowerCase()
              .includes(query) ||
            report.state
              ?.toLowerCase()
              .includes(query);


          return (
            filterMatch &&
            searchMatch
          );

        }
      );

    }, [
      reports,
      activeFilter,
      searchQuery,
    ]);


  /* =======================================
     START INVESTIGATION
  ======================================= */

  const handleStartInvestigation =
    (report) => {

      setReports(
        (previousReports) =>
          previousReports.map(
            (item) => {

              if (
                item.id ===
                report.id
              ) {

                return {

                  ...item,

                  status:
                    "Under Investigation",

                };

              }


              return item;

            }
          )
      );


      /* ================================
         UPDATE LOCAL STORAGE
      ================================= */

      try {

        const storedReports =
          JSON.parse(
            localStorage.getItem(
              "mpladsCitizenReports"
            ) || "[]"
          );


        const updatedReports =
          storedReports.map(
            (item) => {

              if (
                item.id ===
                report.id
              ) {

                return {

                  ...item,

                  status:
                    "Under Investigation",

                };

              }

              return item;

            }
          );


        localStorage.setItem(
          "mpladsCitizenReports",

          JSON.stringify(
            updatedReports
          )
        );

      } catch (error) {

        console.error(
          error
        );

      }

    };


  /* =======================================
     OPEN PROJECT
  ======================================= */

  const handleOpenProject =
    (report) => {

      const project =
        projects.find(
          (item) =>
            item.id ===
              report.projectId ||
            item.projectId ===
              report.projectId ||
            item.code ===
              report.projectId
        );


      if (
        project?.id
      ) {

        navigate(
          `/projects/${project.id}`
        );

        return;

      }


      navigate(
        `/projects/${report.projectId}`
      );

    };


  /* =======================================
     FILTER BUTTONS
  ======================================= */

  const filters = [

    {
      name:
        "All Reports",

      count:
        counts.total,
    },

    {
      name:
        "Pending",

      count:
        counts.pending,
    },

    {
      name:
        "Under Investigation",

      count:
        counts.investigation,
    },

    {
      name:
        "Closed",

      count:
        counts.closed,
    },

  ];


  return (

    <div
      className="
        min-h-screen

        bg-[#f5f7fb]

        px-4
        pb-16
        pt-8

        md:px-8
        lg:px-12
      "
    >


      {/* ===================================
          PAGE CONTAINER
      =================================== */}

      <div
        className="
          mx-auto

          max-w-[1280px]
        "
      >


        {/* ===================================
            HEADER
        =================================== */}

        <motion.div

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
            mb-7
          "
        >

          <div
            className="
              flex

              flex-col

              justify-between
              gap-5

              lg:flex-row
              lg:items-end
            "
          >


            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    h-2
                    w-2

                    rounded-full

                    bg-orange-500

                    animate-pulse
                  "
                />

                <span
                  className="
                    text-[11px]

                    font-black

                    tracking-[0.18em]

                    text-orange-600
                  "
                >

                  CITIZEN EVIDENCE INBOX

                </span>

              </div>


              <h1
                className="
                  mt-2

                  text-3xl

                  font-black

                  tracking-tight

                  text-slate-800

                  md:text-4xl
                "
              >

                Citizen Reports

              </h1>


              <p
                className="
                  mt-2

                  text-sm

                  text-slate-500
                "
              >

                AI-verified public evidence — prioritised
                for investigation, newest first.

              </p>

            </div>


            {/* SEARCH */}

            <div
              className="
                relative

                w-full

                lg:w-[310px]
              "
            >

              <Search
                size={17}

                className="
                  absolute

                  left-4
                  top-1/2

                  -translate-y-1/2

                  text-slate-400
                "
              />

              <input

                value={
                  searchQuery
                }

                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }

                placeholder="
                  Search reports...
                "

                className="
                  w-full

                  rounded-xl

                  border
                  border-slate-200

                  bg-white

                  py-3
                  pl-11
                  pr-4

                  text-sm

                  outline-none

                  transition-all

                  focus:border-orange-300

                  focus:ring-4
                  focus:ring-orange-100
                "
              />

            </div>

          </div>

        </motion.div>


        {/* ===================================
            STATISTICS
        =================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
            delay: 0.1,
          }}

          className="
            grid

            grid-cols-1

            gap-4

            sm:grid-cols-2

            xl:grid-cols-4
          "
        >


          {/* TOTAL */}

          <StatCard

            icon={
              <Archive
                size={21}
              />
            }

            value={
              counts.total
            }

            label="
              TOTAL REPORTS
            "

            iconClass="
              bg-slate-100
              text-slate-600
            "
          />


          {/* PENDING */}

          <StatCard

            icon={
              <Filter
                size={21}
              />
            }

            value={
              counts.pending
            }

            label="
              PENDING REVIEW
            "

            iconClass="
              bg-orange-50
              text-orange-600
            "
          />


          {/* INVESTIGATION */}

          <StatCard

            icon={
              <Fingerprint
                size={21}
              />
            }

            value={
              counts.investigation
            }

            label="
              UNDER INVESTIGATION
            "

            iconClass="
              bg-red-50
              text-red-500
            "
          />


          {/* CLOSED */}

          <StatCard

            icon={
              <CheckCircle2
                size={21}
              />
            }

            value={
              counts.closed
            }

            label="
              CLOSED
            "

            iconClass="
              bg-emerald-50
              text-emerald-600
            "
          />

        </motion.div>


        {/* ===================================
            FILTERS
        =================================== */}

        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.25,
          }}

          className="
            mt-7

            flex
            flex-wrap

            gap-3
          "
        >

          {filters.map(
            (filter) => {

              const isActive =
                activeFilter ===
                filter.name;


              return (

                <button

                  key={
                    filter.name
                  }

                  onClick={() =>
                    setActiveFilter(
                      filter.name
                    )
                  }

                  className={`
                    flex

                    items-center
                    gap-2

                    rounded-full

                    border

                    px-5
                    py-2.5

                    text-xs

                    font-bold

                    transition-all
                    duration-300

                    active:scale-95

                    ${
                      isActive
                        ? `
                          border-slate-800

                          bg-slate-800

                          text-white

                          shadow-lg
                          shadow-slate-300
                        `
                        : `
                          border-slate-200

                          bg-white

                          text-slate-500

                          hover:border-orange-200

                          hover:text-orange-600
                        `
                    }
                  `}
                >

                  {filter.name}


                  <span
                    className={`
                      flex

                      h-5
                      min-w-5

                      items-center
                      justify-center

                      rounded-full

                      px-1

                      text-[10px]

                      ${
                        isActive
                          ? `
                            bg-white/15

                            text-white
                          `
                          : `
                            bg-slate-100

                            text-slate-500
                          `
                      }
                    `}
                  >

                    {filter.count}

                  </span>

                </button>

              );

            }
          )}

        </motion.div>


        {/* ===================================
            REPORT GRID
        =================================== */}

        <motion.div

          layout

          className="
            mt-6

            grid

            grid-cols-1

            gap-5

            md:grid-cols-2

            xl:grid-cols-3
          "
        >

          <AnimatePresence
            mode="popLayout"
          >

            {filteredReports.map(
              (
                report,
                index
              ) => (

                <ReportCard

                  key={
                    report.id
                  }

                  report={
                    report
                  }

                  index={
                    index
                  }

                  onViewEvidence={
                    setSelectedReport
                  }

                  onStartInvestigation={
                    handleStartInvestigation
                  }

                  onOpenProject={
                    handleOpenProject
                  }

                />

              )
            )}

          </AnimatePresence>

        </motion.div>


        {/* ===================================
            EMPTY STATE
        =================================== */}

        {filteredReports.length ===
          0 && (

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            className="
              mt-12

              flex

              flex-col

              items-center
              justify-center

              rounded-3xl

              border
              border-dashed
              border-slate-300

              bg-white

              py-20
            "
          >

            <Search
              size={36}

              className="
                text-slate-300
              "
            />


            <h3
              className="
                mt-4

                font-bold

                text-slate-700
              "
            >

              No reports found

            </h3>


            <p
              className="
                mt-2

                text-sm

                text-slate-400
              "
            >

              Try changing your search or filter.

            </p>

          </motion.div>

        )}


      </div>


      {/* =====================================
          EVIDENCE MODAL
      ====================================== */}

      <AnimatePresence>

        {selectedReport && (

          <EvidenceModal

            report={
              selectedReport
            }

            onClose={() =>
              setSelectedReport(
                null
              )
            }

            onStartInvestigation={
              handleStartInvestigation
            }

          />

        )}

      </AnimatePresence>


    </div>
  );
}


/* =========================================
   STAT CARD COMPONENT
========================================= */

function StatCard({

  icon,

  value,

  label,

  iconClass,

}) {

  return (

    <motion.div

      whileHover={{
        y: -3,
      }}

      className="
        flex

        items-center

        gap-4

        rounded-2xl

        border
        border-slate-200

        bg-white

        p-5

        shadow-md
        shadow-slate-200/40

        transition-all
        duration-300
      "
    >

      <div
        className={`
          flex

          h-11
          w-11

          shrink-0

          items-center
          justify-center

          rounded-xl

          ${iconClass}
        `}
      >

        {icon}

      </div>


      <div>

        <div
          className="
            text-2xl

            font-black

            text-slate-800
          "
        >

          {value}

        </div>


        <div
          className="
            mt-1

            text-[10px]

            font-black

            tracking-[0.16em]

            text-slate-400
          "
        >

          {label}

        </div>

      </div>

    </motion.div>

  );
}