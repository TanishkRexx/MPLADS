import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InvestigatorPublicRecord from "./InvestigatorPublicRecord";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  History,
  Landmark,
  MapPin,
  MessageSquarePlus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { projects } from "../data/projects";


const clamp = (n) =>
  Math.max(
    0,
    Math.min(
      100,
      Number(n) || 0
    )
  );


const getRisk = (p) => {
  const score = clamp(p?.riskScore);

  const level = String(
    p?.riskLevel || ""
  ).toLowerCase();

  if (
    level === "high" ||
    score >= 61
  ) {
    return "High";
  }

  if (
    level === "medium" ||
    score >= 31
  ) {
    return "Medium";
  }

  return "Low";
};


const riskStyle = {
  High:
    "border-red-200 bg-red-50 text-red-600",

  Medium:
    "border-orange-200 bg-orange-50 text-orange-600",

  Low:
    "border-emerald-200 bg-emerald-50 text-emerald-600",
};


const getInvestigationStatus = (p) => {
  if (p?.investigationStatus) {
    return p.investigationStatus;
  }

  const s = String(
    p?.status || ""
  ).toLowerCase();

  if (
    s.includes("investigation") ||
    s.includes("review")
  ) {
    return "Under Investigation";
  }

  if (
    getRisk(p) === "High" ||
    s.includes("delay")
  ) {
    return "Requires Field Inspection";
  }

  return "Evidence Review";
};


const statusStyle = (s) => {
  if (
    s === "Under Investigation"
  ) {
    return "border-red-200 bg-red-50 text-red-600";
  }

  if (
    s === "Evidence Review"
  ) {
    return "border-amber-200 bg-amber-50 text-amber-600";
  }

  if (s === "Closed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-600";
  }

  return "border-orange-200 bg-orange-50 text-orange-600";
};


const expenditurePercent = (p) => {
  if (
    p?.expenditurePercent != null
  ) {
    return clamp(
      p.expenditurePercent
    );
  }

  const costText = String(
    p?.cost || ""
  ).replace(
    /,/g,
    ""
  );

  const expText = String(
    p?.expenditure || ""
  ).replace(
    /,/g,
    ""
  );

  const cost = Number(
    costText.match(
      /[\d.]+/
    )?.[0] || 0
  );

  const exp = Number(
    expText.match(
      /[\d.]+/
    )?.[0] || 0
  );

  return cost
    ? clamp(
        (exp / cost) * 100
      )
    : 0;
};


const costLakh = (p) => {
  if (
    p?.costValue != null
  ) {
    const n = Number(
      p.costValue
    );

    if (
      Number.isFinite(n)
    ) {
      return n > 100000
        ? n / 100000
        : n;
    }
  }

  const text = String(
    p?.cost || ""
  ).replace(
    /,/g,
    ""
  );

  const n = Number(
    text.match(
      /[\d.]+/
    )?.[0] || 0
  );

  return /crore/i.test(text)
    ? n * 100
    : n;
};


export default function InvestigationDetailsPage() {
  const navigate = useNavigate();

  const {
    projectId,
  } = useParams();

  const project = useMemo(
    () =>
      projects.find(
        (p) =>
          String(p.id) ===
          decodeURIComponent(
            projectId || ""
          )
      ),
    [projectId]
  );


  const [
    status,
    setStatus,
  ] = useState(
    () =>
      getInvestigationStatus(
        project
      )
  );


  const [
    requested,
    setRequested,
  ] = useState(false);


  const [
    open,
    setOpen,
  ] = useState({
    cost: true,
    payment: true,
    expenditure: true,
    duplicate: false,
    delay: false,
    progress: false,
  });


  const [
    reports,
    setReports,
  ] = useState([]);


  const [
    notes,
    setNotes,
  ] = useState([]);


  const [
    noteOpen,
    setNoteOpen,
  ] = useState(false);


  const [
    note,
    setNote,
  ] = useState("");


  const [
    decision,
    setDecision,
  ] = useState(
    "Technical Verification"
  );


  const [
    reason,
    setReason,
  ] = useState("");


  const [
    evidence,
    setEvidence,
  ] = useState("");


  const [
    toast,
    setToast,
  ] = useState("");


  const [
    showPublicRecord,
    setShowPublicRecord,
  ] = useState(false);


  useEffect(() => {
    setStatus(
      getInvestigationStatus(
        project
      )
    );
  }, [project]);


  useEffect(() => {
    const load = () => {
      try {
        const all =
          JSON.parse(
            localStorage.getItem(
              "mplads_public_reports"
            ) || "[]"
          );

        setReports(
          all.filter(
            (r) =>
              String(
                r.projectId || ""
              ) ===
              String(
                project?.id
              )
          )
        );
      } catch {
        setReports([]);
      }
    };


    load();

    window.addEventListener(
      "mplads-report-submitted",
      load
    );

    window.addEventListener(
      "storage",
      load
    );


    return () => {
      window.removeEventListener(
        "mplads-report-submitted",
        load
      );

      window.removeEventListener(
        "storage",
        load
      );
    };
  }, [project]);


  useEffect(() => {
    if (!toast) {
      return;
    }

    const t =
      setTimeout(
        () => setToast(""),
        2600
      );

    return () =>
      clearTimeout(t);
  }, [toast]);


  if (!project) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f4f7fb]
          p-8
        "
      >

        <div
          className="
            mx-auto
            max-w-xl
            rounded-3xl
            border
            bg-white
            p-10
            text-center
            shadow-sm
          "
        >

          <ShieldAlert
            className="
              mx-auto
              text-red-500
            "
            size={42}
          />

          <h1
            className="
              mt-4
              text-2xl
              font-extrabold
              text-[#10233d]
            "
          >
            Project not found
          </h1>

          <button
            onClick={() =>
              navigate(
                "/investigations"
              )
            }
            className="
              mt-6
              rounded-xl
              bg-[#0c2946]
              px-5
              py-3
              text-sm
              font-bold
              text-white
            "
          >
            Back to investigations
          </button>

        </div>

      </div>
    );
  }


  const risk =
    getRisk(project);

  const score =
    clamp(
      project.riskScore
    );

  const physical =
    clamp(
      project.physicalProgress
    );

  const expenditure =
    expenditurePercent(
      project
    );

  const gap =
    Math.round(
      expenditure -
        physical
    );

  const confidence =
    clamp(
      74 +
        Math.round(
          score * 0.18
        )
    );


  const dimensions = [
    [
      "Financial Risk",
      clamp(
        Math.round(
          score * 0.96
        )
      ),
      25,
    ],

    [
      "Execution Risk",
      clamp(
        Math.round(
          score * 0.75
        )
      ),
      20,
    ],

    [
      "Temporal Risk",
      clamp(
        Math.round(
          score * 1.04
        )
      ),
      15,
    ],

    [
      "Similarity Risk",
      clamp(
        Math.round(
          score * 0.87
        )
      ),
      15,
    ],

    [
      "Geographic Risk",
      clamp(
        Math.round(
          score * 0.67
        )
      ),
      10,
    ],

    [
      "Evidence / Compliance Risk",
      clamp(
        Math.round(
          score * 0.94
        )
      ),
      15,
    ],
  ];


  const signalData = [
    [
      "Cost Deviation",
      "High",
      "Reported expenditure is compared with comparable works and the registered project cost.",
      `${Math.max(
        5,
        score - 56
      )}% vs comparable median`,
      Wallet,
    ],

    [
      "Timeline Anomaly",
      score >= 75
        ? "High"
        : "Medium",
      "Project execution is assessed against expected completion and available project records.",
      physical < 100
        ? `${Math.max(
            2,
            Math.round(
              (100 -
                physical) /
                10
            )
          )} months progress gap`
        : "On track",
      Clock3,
    ],

    [
      "Similarity Signal",
      "Medium",
      "Potentially related projects with similar descriptions or characteristics are identified.",
      `${Math.max(
        2,
        Math.round(
          score / 20
        )
      )} potentially related projects`,
      Search,
    ],

    [
      "Evidence Gap",
      "Medium",
      "Available supporting evidence is checked for completeness before an authority decision.",
      reports.length
        ? `${reports.length} citizen report(s) require review`
        : "Supporting documents require review",
      FileCheck2,
    ],

    [
      "Project Delay",
      physical < 100
        ? "High"
        : "Low",
      "Timeline compliance is compared with current physical completion.",
      `${100 - physical}% physical progress remaining`,
      Clock3,
    ],

    [
      "Citizen Reports",
      reports.length
        ? "High"
        : "Low",
      "Public complaints are included as an additional investigation signal.",
      `${reports.length} public report(s) linked`,
      Users,
    ],
  ];


  const notify = (
    message
  ) => {
    setToast(
      message
    );
  };


  const addNote = () => {
    if (
      !note.trim()
    ) {
      return;
    }

    setNotes(
      (old) => [
        ...old,
        {
          id: Date.now(),
          text: note.trim(),
          date:
            "17 Sep 2026 · just now",
        },
      ]
    );

    setNote("");
    setNoteOpen(false);

    notify(
      "Investigation note added."
    );
  };


  const requestVerification =
    () => {
      setRequested(true);

      setStatus(
        "Requires Field Inspection"
      );

      notify(
        "Field verification requested."
      );
    };


  const recordDecision =
    () => {
      if (
        !reason.trim()
      ) {
        notify(
          "Enter a decision reason first."
        );

        return;
      }

      setStatus(
        decision ===
          "Continue Monitoring"
          ? "Evidence Review"
          : "Under Investigation"
      );

      notify(
        `Decision recorded: ${decision}.`
      );
    };


  return (
    <div
      className="
        min-h-screen
        bg-[#f4f7fb]
        text-[#10233d]
      "
    >

      <AnimatePresence>

        {toast && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            className="
              fixed
              right-5
              top-5
              z-[100]
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-emerald-200
              bg-white
              px-4
              py-3
              text-sm
              font-bold
              text-emerald-700
              shadow-xl
            "
          >

            <CheckCircle2
              size={17}
            />

            {toast}

          </motion.div>
        )}

      </AnimatePresence>


      <main
        className="
          mx-auto
          max-w-[1480px]
          px-5
          pb-20
          pt-6
          sm:px-8
          lg:px-10
        "
      >

        <button
          onClick={() =>
            navigate(
              "/investigations"
            )
          }
          className="
            mb-5
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#60789b]
            hover:text-orange-600
          "
        >

          <ArrowLeft
            size={17}
          />

          Back to monitoring

        </button>


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
            duration: 0.55,
          }}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            bg-[#050c18]
            p-7
            text-white
            shadow-2xl
            sm:p-8
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_100%_0%,rgba(234,88,12,.16),transparent_38%)]
            "
          />


          <div
            className="
              relative
              grid
              gap-7
              xl:grid-cols-[1fr_205px]
            "
          >

            <div>

              <p
                className="
                  text-[11px]
                  font-extrabold
                  tracking-[.16em]
                  text-orange-400
                "
              >
                ◉ PROJECT INVESTIGATION FILE
              </p>


              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    text-[11px]
                    font-extrabold
                    tracking-[.12em]
                    text-[#8ea5c4]
                  "
                >
                  {project.id}
                </span>


                <span
                  className={`
                    rounded-full
                    border
                    px-3
                    py-1
                    text-[11px]
                    font-extrabold
                    ${riskStyle[risk]}
                  `}
                >
                  ● {score} {risk} Risk
                </span>


                <span
                  className="
                    rounded-full
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-3
                    py-1
                    text-[11px]
                    font-bold
                    text-emerald-600
                  "
                >
                  {project.status ||
                    "Active"}
                </span>


                {project.category && (
                  <span
                    className="
                      rounded-md
                      bg-[#edf3fa]
                      px-3
                      py-1
                      text-[11px]
                      font-semibold
                      text-[#31506f]
                    "
                  >
                    {project.category}
                  </span>
                )}

              </div>


              <h1
                className="
                  mt-4
                  max-w-5xl
                  text-3xl
                  font-extrabold
                  leading-tight
                  sm:text-4xl
                "
              >
                {project.name ||
                  project.workDescription ||
                  "Unnamed Project"}
              </h1>


              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-x-6
                  gap-y-2
                  text-sm
                  text-[#a9bbd2]
                "
              >

                <span
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <MapPin
                    size={16}
                    className="text-orange-400"
                  />

                  {project.location ||
                    `${project.district || "—"}, ${
                      project.state || "—"
                    }`}

                </span>


                {project.implementingAgency && (
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <Landmark
                      size={16}
                      className="text-orange-400"
                    />

                    {project.implementingAgency}

                  </span>
                )}

              </div>


              <div
                className="
                  mt-7
                  grid
                  gap-3
                  sm:grid-cols-2
                  xl:grid-cols-4
                "
              >

                <HeroMetric
                  label="SANCTIONED"
                  value={
                    project.cost ||
                    `₹${Number(
                      project.costValue || 0
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />

                <HeroMetric
                  label="EXPENDITURE"
                  value={`${Math.round(
                    expenditure
                  )}%`}
                />

                <HeroMetric
                  label="PHYSICAL PROGRESS"
                  value={`${physical}%`}
                />

                <HeroMetric
                  label="CONTRACTOR"
                  value={
                    project.contractor ||
                    "Not specified"
                  }
                />

              </div>

            </div>


            <div>

              <label
                className="
                  block
                  text-[11px]
                  font-extrabold
                  tracking-[.13em]
                  text-[#8ea5c4]
                "
              >
                INVESTIGATION STATUS
              </label>


              <div
                className="
                  relative
                  mt-2
                "
              >

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(
                      e.target.value
                    );

                    notify(
                      `Status changed to ${e.target.value}.`
                    );
                  }}
                  className="
                    h-11
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    pr-9
                    text-sm
                    font-bold
                    text-white
                    outline-none
                  "
                >

                  <option className="text-slate-900">
                    Requires Field Inspection
                  </option>

                  <option className="text-slate-900">
                    Evidence Review
                  </option>

                  <option className="text-slate-900">
                    Under Investigation
                  </option>

                  <option className="text-slate-900">
                    Closed
                  </option>

                </select>


                <ChevronDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                  "
                />

              </div>


              <button
                onClick={() =>
                  setShowPublicRecord(
                    true
                  )
                }
                className="
                  mt-3
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/20
                  bg-white/[.03]
                  text-sm
                  font-bold
                  hover:bg-white/10
                "
              >

                <Search
                  size={15}
                  className="text-orange-400"
                />

                View Public Record

              </button>

            </div>

          </div>

        </motion.section>


        <section
          className="
            mt-6
            grid
            gap-5
            xl:grid-cols-[440px_1fr]
          "
        >

          <FadeCard
            delay={0.05}
            className="p-7"
          >

            <SectionTitle
              icon={Gauge}
              title="Risk Score"
              subtitle="Explainable risk assessment"
            />

            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
              "
            >

              <RiskGauge
                score={score}
                risk={risk}
              />

            </div>

          </FadeCard>


          <FadeCard
            delay={0.1}
            className="p-7"
          >

            <SectionTitle
              icon={ShieldAlert}
              title="Investigation Summary"
              subtitle="Current case intelligence and priority"
            />


            <div
              className="
                mt-5
                grid
                gap-3
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >

              <Summary
                label="RISK SCORE"
                value={score}
                suffix="/100"
                badge={`${risk} Risk`}
                danger
              />

              <Summary
                label="PRIORITY"
                value={
                  score >= 80
                    ? "Immediate Review"
                    : score >= 60
                    ? "Priority Review"
                    : "Standard Review"
                }
                badge="Queue position #1"
              />

              <Summary
                label="STATUS"
                value={status}
                badge="Updated 17 September 2026"
              />

              <Summary
                label="CITIZEN REPORTS"
                value={reports.length}
                badge={
                  reports.length
                    ? "Via public platform"
                    : "No platform reports"
                }
                danger={
                  reports.length > 0
                }
              />

            </div>


            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              <MiniProgress
                label="Financial Risk"
                value={dimensions[0][1]}
              />

              <MiniProgress
                label="Project Delay"
                value={dimensions[2][1]}
              />

              <MiniProgress
                label="Duplicate Work Risk"
                value={dimensions[3][1]}
              />

              <MiniProgress
                label="Public Report Risk"
                value={
                  reports.length
                    ? Math.min(
                        100,
                        60 +
                          reports.length *
                            10
                      )
                    : 25
                }
              />

            </div>

          </FadeCard>

        </section>


        <AnimatedSection
          title="AI Risk Factors"
          subtitle="Signals identified from available project data"
          icon={Sparkles}
          count="6 signals analysed"
        >

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {signalData.map(
              (
                [
                  title,
                  level,
                  desc,
                  metric,
                  Icon,
                ],
                i
              ) => (
                <SignalCard
                  key={title}
                  title={title}
                  level={level}
                  desc={desc}
                  metric={metric}
                  Icon={Icon}
                  index={i}
                />
              )
            )}

          </div>

        </AnimatedSection>


        <AnimatedSection
          title="Financial Intelligence"
          subtitle="Financial analysis performed from project records"
          icon={Wallet}
          badge="Investigator only"
        >

          <Agent
            title="Cost Anomaly Agent"
            subtitle="Benchmarks sanctioned cost against comparable works"
            icon={Wallet}
            open={open.cost}
            result={
              dimensions[0][1] > 70
                ? "Requires Review"
                : "Within Normal Range"
            }
            onClick={() =>
              setOpen({
                ...open,
                cost: !open.cost,
              })
            }
          >

            <Finding>
              Benchmarked project cost against available registry records and comparable works.
            </Finding>

            <p
              className="
                mt-2
                text-sm
                font-bold
                text-emerald-600
              "
            >
              Project cost is within the available comparison range unless further evidence indicates otherwise.
            </p>

            <ComparisonBars
              value={costLakh(
                project
              )}
            />

          </Agent>


          <Agent
            title="Payment Anomaly Agent"
            subtitle="Compares fund utilisation with verified progress"
            icon={Wallet}
            open={open.payment}
            result={
              gap > 15
                ? "Requires Review"
                : "Within Normal Range"
            }
            onClick={() =>
              setOpen({
                ...open,
                payment:
                  !open.payment,
              })
            }
          >

            <Finding>
              Analysed financial utilisation against the physical progress recorded for the project.
            </Finding>

            <p
              className="
                mt-2
                text-sm
                font-bold
                text-[#10233d]
              "
            >
              {gap > 15
                ? "Financial utilisation is ahead of physical progress and requires review."
                : "Financial utilisation is broadly aligned with physical progress."}
            </p>


            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-3
              "
            >

              <Payment
                title="Tranche 1 — Mobilisation"
                value="40%"
              />

              <Payment
                title="Tranche 2 — Midterm"
                value="35%"
                warning
              />

              <Payment
                title="Tranche 3 — Completion"
                value="25%"
                warning={
                  expenditure > 80
                }
              />

            </div>

          </Agent>


          <Agent
            title="Expenditure Analysis Agent"
            subtitle="Financial utilisation versus physical completion"
            icon={Wallet}
            open={open.expenditure}
            result={
              Math.abs(gap) > 15
                ? "Moderate Mismatch"
                : "Aligned"
            }
            onClick={() =>
              setOpen({
                ...open,
                expenditure:
                  !open.expenditure,
              })
            }
          >

            <Finding>
              Cross-comparison of financial utilisation versus physical completion.
            </Finding>

            <ProgressCompare
              expenditure={
                expenditure
              }
              physical={
                physical
              }
            />

          </Agent>

        </AnimatedSection>


        <AnimatedSection
          title="Project Intelligence"
          subtitle="Registry, similarity, timeline and progress analysis"
          icon={Search}
        >

          <Agent
            title="Duplicate / Similar Work Agent"
            subtitle="Scans the registry for overlapping works"
            icon={Search}
            open={open.duplicate}
            result={`${Math.max(
              2,
              Math.round(
                score / 25
              )
            )} similar works`}
            onClick={() =>
              setOpen({
                ...open,
                duplicate:
                  !open.duplicate,
              })
            }
          >

            <Finding>
              Similarity analysis compares project description, category, district and location attributes.
            </Finding>

            <div
              className="
                mt-4
                rounded-xl
                border
                border-orange-200
                bg-orange-50
                p-4
                text-sm
                text-orange-700
              "
            >
              Potentially related projects should be compared before a duplicate-work concern is confirmed.
            </div>

          </Agent>


          <Agent
            title="Project Delay Agent"
            subtitle="Timeline compliance analysis"
            icon={Clock3}
            open={open.delay}
            result={
              physical < 100
                ? "Requires Review"
                : "On Track"
            }
            onClick={() =>
              setOpen({
                ...open,
                delay:
                  !open.delay,
              })
            }
          >

            <Finding>
              Timeline status is derived from available start date, expected completion and current progress.
            </Finding>


            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-3
              "
            >

              <DateBox
                label="START DATE"
                value={
                  project.startDate ||
                  "Not available"
                }
              />

              <DateBox
                label="EXPECTED COMPLETION"
                value={
                  project.expectedCompletion ||
                  "Not available"
                }
              />

              <DateBox
                label="CURRENT STATUS"
                value={
                  project.status ||
                  "Not available"
                }
              />

            </div>

          </Agent>


          <Agent
            title="Progress / Status Agent"
            subtitle="Triangulates financial, physical and timeline progress"
            icon={Gauge}
            open={open.progress}
            result={
              Math.abs(gap) > 15
                ? "Moderate Mismatch"
                : "Aligned"
            }
            onClick={() =>
              setOpen({
                ...open,
                progress:
                  !open.progress,
              })
            }
          >

            <Finding>
              Financial progress, physical progress and project status are compared to identify inconsistencies.
            </Finding>

            <ProgressCompare
              expenditure={
                expenditure
              }
              physical={
                physical
              }
            />

          </Agent>

        </AnimatedSection>


        <section
          className="
            mt-8
            grid
            gap-5
            xl:grid-cols-[1.25fr_.75fr]
          "
        >

          <FadeCard
            className="p-6"
          >

            <SectionTitle
              icon={Users}
              title="Citizen Reports on this Project"
              count={reports.length}
            />


            <div
              className="
                mt-4
                rounded-xl
                border
                border-slate-100
                bg-[#fbfcfe]
                p-5
              "
            >

              {reports.length ? (
                reports.map(
                  (r) => (
                    <div
                      key={r.id}
                      className="
                        mb-3
                        rounded-xl
                        border
                        bg-white
                        p-4
                        last:mb-0
                      "
                    >

                      <div
                        className="
                          flex
                          justify-between
                          gap-3
                        "
                      >

                        <b
                          className="
                            text-sm
                          "
                        >
                          {r.issueType ||
                            "Citizen Report"}
                        </b>

                        <span
                          className="
                            text-xs
                            text-red-600
                          "
                        >
                          {r.risk ||
                            "Review"}
                        </span>

                      </div>


                      <p
                        className="
                          mt-2
                          text-xs
                          leading-5
                          text-slate-500
                        "
                      >
                        {r.description ||
                          "Citizen submitted a project concern."}
                      </p>


                      {r.evidenceImage && (
                        <img
                          src={
                            r.evidenceImage
                          }
                          alt="Citizen evidence"
                          className="
                            mt-3
                            max-h-48
                            w-full
                            rounded-lg
                            object-cover
                          "
                        />
                      )}

                    </div>
                  )
                )
              ) : (
                <div
                  className="
                    flex
                    min-h-[130px]
                    flex-col
                    items-center
                    justify-center
                    text-center
                    text-sm
                    text-[#8ca0bb]
                  "
                >

                  <Users
                    size={28}
                  />

                  <p className="mt-2">
                    No platform-filed reports for this project.
                  </p>

                </div>
              )}

            </div>

          </FadeCard>


          <FadeCard
            className="p-6"
          >

            <SectionTitle
              icon={CalendarDays}
              title="Investigation Timeline"
            />

            <Timeline
              project={project}
              status={status}
              requested={requested}
            />

          </FadeCard>

        </section>


        <AnimatedSection
          title="Risk Assessment"
          subtitle="Explainable risk assessment across six dimensions"
          icon={ShieldCheck}
        >

          <FadeCard
            className="p-7"
          >

            <div
              className="
                grid
                gap-8
                lg:grid-cols-[250px_1fr]
              "
            >

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >

                <RiskGauge
                  score={score}
                  risk={risk}
                  small
                />

                <p
                  className="
                    mt-3
                    text-sm
                    text-slate-500
                  "
                >
                  Confidence{" "}
                  <b
                    className="
                      text-[#10233d]
                    "
                  >
                    {confidence}%
                  </b>
                </p>

              </div>


              <div
                className="
                  space-y-5
                "
              >

                {dimensions.map(
                  ([
                    name,
                    value,
                  ]) => (
                    <RiskBar
                      key={name}
                      name={name}
                      value={value}
                    />
                  )
                )}

              </div>

            </div>


            <div
              className="
                mt-8
                border-t
                pt-6
              "
            >

              <p
                className="
                  text-xs
                  font-extrabold
                  tracking-[.12em]
                  text-[#657b9b]
                "
              >
                RISK SCORE CONTRIBUTION
              </p>


              <div
                className="
                  mt-4
                  grid
                  gap-3
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >

                {dimensions.map(
                  ([
                    name,
                    value,
                    weight,
                  ]) => (
                    <div
                      key={name}
                      className="
                        rounded-xl
                        border
                        bg-[#f8fafc]
                        p-4
                      "
                    >

                      <div
                        className="
                          flex
                          justify-between
                        "
                      >

                        <div>

                          <b
                            className="
                              text-xs
                            "
                          >
                            {name}
                          </b>

                          <p
                            className="
                              text-[11px]
                              text-slate-500
                            "
                          >
                            Weight: {weight}%
                          </p>

                        </div>


                        <div
                          className="
                            text-right
                          "
                        >

                          <small
                            className="
                              text-[9px]
                              text-slate-400
                            "
                          >
                            CONTRIBUTION
                          </small>

                          <p
                            className="
                              text-sm
                              font-extrabold
                            "
                          >
                            {(
                              (value *
                                weight) /
                              100
                            ).toFixed(
                              1
                            )}
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>


              <p
                className="
                  mt-5
                  text-right
                  text-sm
                  font-extrabold
                "
              >
                Final Risk Score:{" "}
                <span
                  className="
                    text-red-600
                  "
                >
                  {score}
                </span>
              </p>

            </div>

          </FadeCard>

        </AnimatedSection>


        <AnimatedSection
          title="Mitigating Factors / Context"
          subtitle="Contextual factors that may explain or reduce observed risk"
          icon={ShieldCheck}
        >

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <Mitigation>
              Local schedule of rates and regional conditions may explain part of the observed cost variation.
            </Mitigation>

            <Mitigation>
              Documented execution conditions may explain some timeline variation where supporting evidence is available.
            </Mitigation>

          </div>

        </AnimatedSection>


        <section
          className="
            mt-8
            grid
            gap-5
            lg:grid-cols-2
          "
        >

          <FadeCard
            className="p-6"
          >

            <SectionTitle
              icon={ClipboardCheck}
              title="Field Verification"
              subtitle="Physical verification of unresolved project evidence."
            />


            <div
              className="
                mt-5
                rounded-xl
                border
                bg-[#f7f9fc]
                p-4
              "
            >

              <span
                className={`
                  rounded-md
                  px-3
                  py-1
                  text-[10px]
                  font-extrabold
                  ${
                    requested
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-orange-50 text-orange-600"
                  }
                `}
              >
                {requested
                  ? "REQUESTED"
                  : "NOT ASSIGNED"}
              </span>


              <div
                className="
                  mt-3
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <b
                  className="
                    text-sm
                  "
                >
                  Verify dimensions and current completion status
                </b>


                <button
                  onClick={
                    requestVerification
                  }
                  className="
                    rounded-xl
                    bg-[#0c2946]
                    px-5
                    py-3
                    text-xs
                    font-extrabold
                    text-white
                    hover:bg-[#123b61]
                  "
                >

                  <ClipboardCheck
                    size={15}
                    className="mr-2 inline"
                  />

                  {requested
                    ? "Verification Requested"
                    : "Request Field Verification"}

                </button>

              </div>

            </div>

          </FadeCard>


          <FadeCard
            className="p-6"
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >

              <SectionTitle
                icon={MessageSquarePlus}
                title="Investigation Notes"
                subtitle="Restricted internal notes for authorized personnel."
              />


              <button
                onClick={() =>
                  setNoteOpen(
                    true
                  )
                }
                className="
                  rounded-lg
                  border
                  px-4
                  py-2
                  text-xs
                  font-bold
                  hover:border-orange-300
                  hover:text-orange-600
                "
              >

                <MessageSquarePlus
                  size={14}
                  className="mr-1 inline"
                />

                Add Note

              </button>

            </div>


            <div
              className="
                mt-5
                space-y-4
              "
            >

              {notes.map(
                (n) => (
                  <div
                    key={n.id}
                    className="
                      border-l-2
                      border-[#173e66]
                      pl-4
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-extrabold
                      "
                    >
                      Investigation Team{" "}
                      <span
                        className="
                          font-medium
                          text-slate-400
                        "
                      >
                        · Authorized Officer
                      </span>
                    </p>


                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-slate-400
                      "
                    >
                      {n.date}
                    </p>


                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-[#60789b]
                      "
                    >
                      {n.text}
                    </p>

                  </div>
                )
              )}


              {!notes.length && (
                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  No investigation notes added yet.
                </p>
              )}

            </div>

          </FadeCard>

        </section>


        <section
          className="
            mt-5
            grid
            gap-5
            lg:grid-cols-2
          "
        >

          <FadeCard
            className="
              border-orange-200
              p-6
            "
          >

            <SectionTitle
              icon={Sparkles}
              title="AI-Assisted Recommended Action"
              subtitle="AI recommends. Authorized officer decides."
            />


            <div
              className="
                mt-5
                rounded-xl
                bg-[#fff0d3]
                p-5
              "
            >

              <p
                className="
                  text-[10px]
                  font-extrabold
                  tracking-[.1em]
                  text-orange-600
                "
              >
                RECOMMENDATION
              </p>


              <h3
                className="
                  mt-2
                  text-xl
                  font-extrabold
                "
              >
                {score >= 75
                  ? "Technical Verification"
                  : "Continue Monitoring"}
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#60789b]
                "
              >
                The strongest unresolved signal relates to the discrepancy between reported execution status, financial utilisation and available project evidence.
              </p>

            </div>


            <button
              onClick={() => {
                setDecision(
                  score >= 75
                    ? "Technical Verification"
                    : "Continue Monitoring"
                );

                notify(
                  "AI recommendation accepted."
                );
              }}
              className="
                mt-5
                rounded-xl
                bg-[#0c2946]
                px-4
                py-3
                text-xs
                font-extrabold
                text-white
              "
            >
              Accept Recommendation
            </button>

          </FadeCard>


          <FadeCard
            className="p-6"
          >

            <SectionTitle
              icon={Landmark}
              title="Authority Decision"
              subtitle="Formal decision by the authorized officer."
            />


            <div
              className="
                mt-5
                grid
                gap-2
                sm:grid-cols-2
              "
            >

              {[
                "No Further Action",
                "Request Documentation",
                "Technical Verification",
                "Financial Review",
                "Continue Monitoring",
                "Escalate",
              ].map(
                (x) => (
                  <label
                    key={x}
                    className={`
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      px-4
                      py-3
                      text-sm
                      ${
                        decision === x
                          ? "border-[#173e66] bg-[#f5f8fc]"
                          : "border-slate-200"
                      }
                    `}
                  >

                    <input
                      type="radio"
                      checked={
                        decision === x
                      }
                      onChange={() =>
                        setDecision(
                          x
                        )
                      }
                      name="decision"
                    />

                    {x}

                  </label>
                )
              )}

            </div>


            <label
              className="
                mt-5
                block
                text-xs
                font-bold
              "
            >

              Decision Reason

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Record the basis for this decision"
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  p-3
                  text-sm
                  outline-none
                  focus:border-orange-300
                "
              />

            </label>


            <label
              className="
                mt-4
                block
                text-xs
                font-bold
              "
            >

              Supporting Evidence

              <select
                value={evidence}
                onChange={(e) =>
                  setEvidence(
                    e.target.value
                  )
                }
                className="
                  mt-2
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-white
                  px-3
                  text-sm
                "
              >

                <option value="">
                  Select evidence
                </option>

                <option>
                  Project Registry
                </option>

                <option>
                  Citizen Report
                </option>

                <option>
                  Financial Records
                </option>

                <option>
                  Field Verification
                </option>

              </select>

            </label>


            <button
              onClick={
                recordDecision
              }
              className="
                mt-5
                w-full
                rounded-xl
                bg-[#0c2946]
                py-3
                text-sm
                font-extrabold
                text-white
              "
            >

              <Check
                size={16}
                className="mr-2 inline"
              />

              Record Decision

            </button>

          </FadeCard>

        </section>


        <AnimatedSection
          title="Risk Assessment History"
          subtitle="Risk assessment may change as additional evidence becomes available."
          icon={History}
        >

          <FadeCard
            className="p-7"
          >

            <div
              className="
                relative
                grid
                grid-cols-3
                gap-4
              "
            >

              <div
                className="
                  absolute
                  left-[16%]
                  right-[16%]
                  top-10
                  h-px
                  bg-slate-200
                "
              />


              <HistoryPoint
                score={score}
                title="Initial Assessment"
                date="17 Sep 2026"
                color="bg-red-600"
              />


              <HistoryPoint
                score={Math.max(
                  0,
                  score - 15
                )}
                title="After Document Review"
                date="Pending"
                color="bg-orange-600"
              />


              <HistoryPoint
                score={Math.max(
                  0,
                  score - 35
                )}
                title="After Field Verification"
                date="Pending"
                color="bg-emerald-600"
              />

            </div>

          </FadeCard>

        </AnimatedSection>


        <AnimatedSection
          title="Investigation Audit Trail"
          subtitle="Immutable, read-only record of investigation activity."
          icon={History}
          badge="READ ONLY"
        >

          <FadeCard
            className="p-6"
          >

            <Audit
              title="Risk engine created case"
              actor="System · Risk Engine"
              state="Awaiting Review"
            />

            <Audit
              title="Case opened"
              actor="Investigation Team · District Authority"
              state="Investigation Opened"
            />

            <Audit
              title="Evidence reviewed"
              actor="Authorized Officer"
              state="Partially Reviewed"
            />

            <Audit
              title="Field verification requested"
              actor="District Authority"
              state={
                requested
                  ? "Requested"
                  : "Not Assigned"
              }
            />

            <Audit
              title="Investigation assessment updated"
              actor="Investigation Team"
              state={`${score} Risk · ${status}`}
            />

          </FadeCard>

        </AnimatedSection>


        <footer
          className="
            mt-10
            flex
            flex-col
            gap-4
            border-t
            border-slate-200
            pt-8
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <p
              className="
                text-sm
                font-extrabold
              "
            >
              From data to risk. From risk to investigation. From investigation to action.
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              AI detects and prioritizes risk. Humans investigate and decide.
            </p>

          </div>


          <button
            onClick={() =>
              window.print()
            }
            className="
              rounded-xl
              border
              bg-white
              px-5
              py-3
              text-sm
              font-bold
              hover:border-orange-300
            "
          >

            <FileText
              size={16}
              className="mr-2 inline"
            />

            Generate Investigation Report

          </button>

        </footer>

      </main>


      <InvestigatorPublicRecord
        isOpen={
          showPublicRecord
        }
        onClose={() =>
          setShowPublicRecord(
            false
          )
        }
        project={
          project
        }
        reports={
          reports
        }
      />


      <AnimatePresence>

        {noteOpen && (
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
            onClick={() =>
              setNoteOpen(
                false
              )
            }
            className="
              fixed
              inset-0
              z-[90]
              flex
              items-center
              justify-center
              bg-slate-950/40
              p-5
              backdrop-blur-sm
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                w-full
                max-w-xl
                rounded-2xl
                bg-white
                p-6
                shadow-2xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <h3
                  className="
                    text-lg
                    font-extrabold
                  "
                >
                  Add Investigation Note
                </h3>


                <button
                  onClick={() =>
                    setNoteOpen(
                      false
                    )
                  }
                >

                  <X
                    size={18}
                  />

                </button>

              </div>


              <textarea
                autoFocus
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                rows={6}
                placeholder="Write investigation note..."
                className="
                  mt-5
                  w-full
                  rounded-xl
                  border
                  p-4
                  text-sm
                  outline-none
                  focus:border-orange-300
                "
              />


              <div
                className="
                  mt-4
                  flex
                  justify-end
                  gap-2
                "
              >

                <button
                  onClick={() =>
                    setNoteOpen(
                      false
                    )
                  }
                  className="
                    rounded-xl
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                  "
                >
                  Cancel
                </button>


                <button
                  onClick={addNote}
                  disabled={
                    !note.trim()
                  }
                  className="
                    rounded-xl
                    bg-[#0c2946]
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    disabled:opacity-40
                  "
                >
                  Add Note
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}


/* =========================================================
   FADE CARD
========================================================= */

function FadeCard({
  children,
  className = "",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.45,
        delay,
      }}
      className={`
        rounded-[22px]
        border
        border-slate-200
        bg-white
        shadow-[0_10px_35px_rgba(15,23,42,.05)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}


/* =========================================================
   ANIMATED SECTION
========================================================= */

function AnimatedSection({
  title,
  subtitle,
  icon,
  count,
  badge,
  children,
}) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.08,
      }}
      transition={{
        duration: 0.45,
      }}
      className="mt-8"
    >

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <SectionTitle
          icon={icon}
          title={title}
          subtitle={subtitle}
          count={count}
        />


        {badge && (
          <span
            className="
              rounded-full
              border
              border-orange-200
              bg-orange-50
              px-3
              py-1
              text-[10px]
              font-extrabold
              text-orange-600
            "
          >
            {badge}
          </span>
        )}

      </div>


      {children}

    </motion.section>
  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  count,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      <div
        className="
          rounded-lg
          bg-[#edf4fb]
          p-2
          text-[#0c2946]
        "
      >
        <Icon
          size={17}
        />
      </div>


      <div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <h2
            className="
              text-[16px]
              font-extrabold
            "
          >
            {title}
          </h2>


          {count !== undefined && (
            <span
              className="
                rounded-full
                bg-[#edf3fa]
                px-2
                py-0.5
                text-[10px]
                font-extrabold
                text-[#31506f]
              "
            >
              {count}
            </span>
          )}

        </div>


        {subtitle && (
          <p
            className="
              mt-1
              text-xs
              text-[#60789b]
            "
          >
            {subtitle}
          </p>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   HERO METRIC
========================================================= */

function HeroMetric({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/10
        bg-white/[.045]
        px-4
        py-3
      "
    >

      <p
        className="
          text-[10px]
          font-extrabold
          tracking-[.13em]
          text-[#8ea5c4]
        "
      >
        {label}
      </p>


      <p
        className="
          mt-2
          truncate
          text-[16px]
          font-extrabold
        "
      >
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   RISK GAUGE
========================================================= */

function RiskGauge({
  score,
  risk,
  small,
}) {
  const size = small
    ? "h-[190px] w-[190px]"
    : "h-[250px] w-[250px]";

  const inner = small
    ? "h-[150px] w-[150px]"
    : "h-[200px] w-[200px]";


  return (
    <motion.div
      initial={{
        scale: 0.85,
        opacity: 0,
      }}
      whileInView={{
        scale: 1,
        opacity: 1,
      }}
      viewport={{
        once: true,
      }}
      className={`
        flex
        items-center
        justify-center
        rounded-full
        ${size}
      `}
      style={{
        background:
          `conic-gradient(
            #ef1d26 0deg
            ${score * 3.6}deg,
            #edf2f7 ${score * 3.6}deg
            360deg
          )`,
      }}
    >

      <div
        className={`
          flex
          flex-col
          items-center
          justify-center
          rounded-full
          bg-white
          ${inner}
        `}
      >

        <span
          className={
            small
              ? "text-5xl font-extrabold"
              : "text-6xl font-extrabold"
          }
        >
          {score}
        </span>


        <span
          className="
            text-xs
            font-bold
            text-slate-400
          "
        >
          / 100
        </span>


        <span
          className={`
            mt-2
            rounded-full
            border
            px-3
            py-1
            text-[10px]
            font-extrabold
            ${riskStyle[risk]}
          `}
        >
          ● {risk} Risk
        </span>

      </div>

    </motion.div>
  );
}


/* =========================================================
   SUMMARY
========================================================= */

function Summary({
  label,
  value,
  suffix,
  badge,
  danger,
}) {
  return (
    <div
      className="
        min-h-[106px]
        rounded-xl
        border
        border-slate-100
        bg-[#fbfcfe]
        p-4
      "
    >

      <p
        className="
          text-[10px]
          font-extrabold
          tracking-[.12em]
          text-[#8ca0bb]
        "
      >
        {label}
      </p>


      <p
        className={`
          mt-2
          font-extrabold
          ${
            typeof value === "number"
              ? `text-2xl ${
                  danger
                    ? "text-red-600"
                    : ""
                }`
              : "text-sm"
          }
        `}
      >

        {value}

        {suffix && (
          <span
            className="
              text-xs
              text-slate-400
            "
          >
            {suffix}
          </span>
        )}

      </p>


      <span
        className={`
          mt-2
          inline-flex
          rounded-full
          border
          px-2.5
          py-1
          text-[9px]
          font-extrabold
          ${statusStyle(
            String(value)
          )}
        `}
      >
        {badge}
      </span>

    </div>
  );
}


/* =========================================================
   MINI PROGRESS
========================================================= */

function MiniProgress({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-[#fbfcfe]
        p-3
      "
    >

      <div
        className="
          flex
          justify-between
          text-xs
        "
      >

        <b>
          {label}
        </b>

        <b>
          {value}/100
        </b>

      </div>


      <div
        className="
          mt-2
          h-1.5
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
            duration: 0.8,
          }}
          className="
            h-full
            rounded-full
            bg-red-500
          "
        />

      </div>

    </div>
  );
}


/* =========================================================
   SIGNAL CARD
========================================================= */

function SignalCard({
  title,
  level,
  desc,
  metric,
  Icon,
  index,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
      }}
      whileHover={{
        y: -4,
      }}
      className="
        rounded-[18px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex
          justify-between
        "
      >

        <div
          className="
            rounded-xl
            bg-red-50
            p-3
            text-red-500
          "
        >
          <Icon
            size={19}
          />
        </div>


        <span
          className={`
            rounded-full
            border
            px-2.5
            py-1
            text-[9px]
            font-extrabold
            ${riskStyle[level]}
          `}
        >
          ● {level}
        </span>

      </div>


      <h3
        className="
          mt-4
          text-sm
          font-extrabold
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-2
          text-xs
          leading-5
          text-[#60789b]
        "
      >
        {desc}
      </p>


      <p
        className="
          mt-3
          text-xs
          font-extrabold
        "
      >
        {metric}
      </p>

    </motion.div>
  );
}


/* =========================================================
   AGENT
========================================================= */

function Agent({
  title,
  subtitle,
  icon: Icon,
  open,
  result,
  onClick,
  children,
}) {
  return (
    <motion.div
      layout
      className="
        mb-4
        overflow-hidden
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >

      <button
        onClick={onClick}
        className="
          flex
          w-full
          items-center
          gap-4
          px-5
          py-4
          text-left
          hover:bg-slate-50
        "
      >

        <div
          className="
            rounded-xl
            bg-[#0c2946]
            p-3
            text-white
          "
        >
          <Icon
            size={19}
          />
        </div>


        <div
          className="
            flex-1
          "
        >

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >

            <h3
              className="
                text-sm
                font-extrabold
              "
            >
              {title}
            </h3>


            <span
              className="
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-2
                py-0.5
                text-[9px]
                font-extrabold
                text-emerald-600
              "
            >
              ✓ Completed
            </span>

          </div>


          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            {subtitle}
          </p>

        </div>


        <span
          className="
            hidden
            rounded-full
            border
            border-orange-200
            bg-orange-50
            px-3
            py-1
            text-[9px]
            font-extrabold
            text-orange-600
            sm:block
          "
        >
          {result}
        </span>


        <ChevronDown
          size={17}
          className={`
            transition-transform
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />

      </button>


      <AnimatePresence
        initial={false}
      >

        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
          >

            <div
              className="
                border-t
                bg-[#fbfcfe]
                p-5
              "
            >
              {children}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </motion.div>
  );
}


/* =========================================================
   FINDING
========================================================= */

function Finding({
  children,
}) {
  return (
    <>
      <p
        className="
          text-[10px]
          font-extrabold
          tracking-[.12em]
          text-[#8093ae]
        "
      >
        AGENT FINDINGS
      </p>


      <p
        className="
          mt-2
          text-xs
          leading-5
          text-[#60789b]
        "
      >
        {children}
      </p>
    </>
  );
}


/* =========================================================
   COMPARISON BARS
========================================================= */

function ComparisonBars({
  value,
}) {
  const max =
    Math.max(
      value * 1.2,
      10
    );


  return (
    <div
      className="
        mt-5
        flex
        items-end
        justify-center
        gap-24
        rounded-xl
        border
        bg-white
        p-5
      "
    >

      <Bar
        label="This project"
        value={value}
        height={
          (value / max) *
          120
        }
        danger
      />


      <Bar
        label="Environment median"
        value={
          value * 1.05
        }
        height={
          ((value * 1.05) /
            max) *
          120
        }
      />

    </div>
  );
}


/* =========================================================
   BAR
========================================================= */

function Bar({
  label,
  value,
  height,
  danger,
}) {
  return (
    <div
      className="
        text-center
      "
    >

      <div
        className="
          flex
          h-[125px]
          items-end
          justify-center
        "
      >

        <motion.div
          initial={{
            height: 0,
          }}
          whileInView={{
            height,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className={`
            w-12
            rounded-t-md
            ${
              danger
                ? "bg-red-600"
                : "bg-[#183c60]"
            }
          `}
        />

      </div>


      <p
        className="
          mt-2
          text-[10px]
          text-slate-500
        "
      >
        {label}
      </p>


      <p
        className="
          text-xs
          font-extrabold
        "
      >
        ₹
        {Number(
          value || 0
        ).toFixed(2)}{" "}
        L
      </p>

    </div>
  );
}


/* =========================================================
   PAYMENT
========================================================= */

function Payment({
  title,
  value,
  warning,
}) {
  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        ${
          warning
            ? "border-amber-300 bg-amber-50/60"
            : "bg-white"
        }
      `}
    >

      <p
        className="
          text-[10px]
          font-bold
        "
      >
        {title}
      </p>


      <p
        className="
          mt-2
          text-lg
          font-extrabold
        "
      >
        {value}
      </p>


      <p
        className="
          mt-1
          text-[10px]
          text-slate-400
        "
      >
        Progress-linked release
      </p>

    </div>
  );
}


/* =========================================================
   PROGRESS COMPARE
========================================================= */

function ProgressCompare({
  expenditure,
  physical,
}) {
  const gap =
    Math.round(
      expenditure -
        physical
    );


  return (
    <div
      className="
        mt-4
        space-y-4
      "
    >

      <RiskBar
        name="Expenditure"
        value={
          expenditure
        }
        orange
      />


      <RiskBar
        name="Physical Progress"
        value={
          physical
        }
      />


      <div
        className={`
          rounded-xl
          border
          px-4
          py-3
          text-xs
          font-extrabold
          ${
            Math.abs(gap) >
            15
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }
        `}
      >
        {Math.abs(gap) >
        15
          ? `⚠ Gap of ${Math.abs(
              gap
            )} points — Moderate Mismatch`
          : "✓ Financial and physical progress are broadly aligned."}
      </div>

    </div>
  );
}


/* =========================================================
   RISK BAR
========================================================= */

function RiskBar({
  name,
  value,
  orange,
}) {
  return (
    <div>

      <div
        className="
          flex
          justify-between
          text-xs
        "
      >

        <b>
          {name}
        </b>

        <b>
          {Math.round(
            value
          )}
        </b>

      </div>


      <div
        className="
          mt-2
          h-2
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
            duration: 0.8,
          }}
          className={`
            h-full
            rounded-full
            ${
              orange
                ? "bg-orange-400"
                : value >= 75
                ? "bg-red-500"
                : "bg-[#183f68]"
            }
          `}
        />

      </div>

    </div>
  );
}


/* =========================================================
   DATE BOX
========================================================= */

function DateBox({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-4
      "
    >

      <p
        className="
          text-[9px]
          font-extrabold
          text-slate-400
        "
      >
        {label}
      </p>


      <p
        className="
          mt-2
          text-sm
          font-extrabold
        "
      >
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   TIMELINE
========================================================= */

function Timeline({
  project,
  status,
  requested,
}) {
  const items = [
    [
      "Project Sanctioned",
      project.startDate ||
        "Registry record",
      project.recommendedBy ||
        "Registered project",
    ],

    [
      "Work Started",
      project.startDate ||
        "Recorded start date",
      project.implementingAgency ||
        "Implementing agency",
    ],

    [
      "Expected Completion",
      project.expectedCompletion ||
        "As per work order",
      "Expected milestone",
    ],

    [
      "Investigation Review",
      "17 Sep 2026",
      status,
    ],
  ];


  if (requested) {
    items.push(
      [
        "Field Verification Requested",
        "17 Sep 2026",
        "Request submitted by investigator",
      ]
    );
  }


  return (
    <div
      className="
        mt-4
        rounded-[22px]
        border
        bg-white
        p-6
      "
    >

      <div
        className="
          relative
          space-y-6
        "
      >

        <div
          className="
            absolute
            bottom-3
            left-1.5
            top-3
            w-px
            bg-slate-200
          "
        />


        {items.map(
          (
            [
              title,
              date,
              detail,
            ],
            i
          ) => (
            <div
              key={title}
              className="
                relative
                flex
                gap-4
              "
            >

              <span
                className={`
                  relative
                  z-10
                  mt-1
                  h-3
                  w-3
                  shrink-0
                  rounded-full
                  border-2
                  border-white
                  ${
                    i >= 3
                      ? "bg-orange-500"
                      : "bg-[#315b86]"
                  }
                `}
              />


              <div>

                <p
                  className="
                    text-xs
                    font-extrabold
                  "
                >
                  {title}
                </p>


                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-400
                  "
                >
                  {date}
                </p>


                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-500
                  "
                >
                  {detail}
                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}


/* =========================================================
   MITIGATION
========================================================= */

function Mitigation({
  children,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-emerald-200
        bg-[#e3f8e9]
        p-5
      "
    >

      <p
        className="
          text-sm
          font-semibold
          leading-6
        "
      >
        {children}
      </p>


      <p
        className="
          mt-4
          text-xs
          text-emerald-700
        "
      >

        <b>
          Impact:
        </b>{" "}

        May explain or reduce part of observed risk

        <span
          className="
            ml-2
            rounded
            bg-orange-50
            px-2
            py-1
            text-[9px]
            font-extrabold
            text-orange-600
          "
        >
          REQUIRES REVIEW
        </span>

      </p>

    </div>
  );
}


/* =========================================================
   HISTORY POINT
========================================================= */

function HistoryPoint({
  score,
  title,
  date,
  color,
}) {
  return (
    <div
      className="
        relative
        z-10
        flex
        flex-col
        items-center
        text-center
      "
    >

      <motion.div
        initial={{
          scale: 0,
        }}
        whileInView={{
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          type: "spring",
        }}
        className={`
          flex
          h-[76px]
          w-[76px]
          items-center
          justify-center
          rounded-full
          text-2xl
          font-extrabold
          text-white
          shadow-lg
          ${color}
        `}
      >
        {score}
      </motion.div>


      <p
        className="
          mt-4
          text-xs
          font-extrabold
        "
      >
        {title}
      </p>


      <p
        className="
          mt-1
          text-[10px]
          text-slate-400
        "
      >
        {date}
      </p>

    </div>
  );
}


/* =========================================================
   AUDIT
========================================================= */

function Audit({
  title,
  actor,
  state,
}) {
  return (
    <div
      className="
        grid
        grid-cols-[145px_1fr_150px]
        gap-5
        border-l
        border-slate-200
        py-4
        pl-5
      "
    >

      <div
        className="
          relative
        "
      >

        <span
          className="
            absolute
            -left-[26px]
            top-1
            h-3
            w-3
            rounded-full
            bg-[#0c2946]
            ring-4
            ring-white
          "
        />


        <span
          className="
            text-[10px]
            text-slate-500
          "
        >
          17 Sep 2026
        </span>

      </div>


      <div>

        <p
          className="
            text-sm
            font-extrabold
          "
        >
          {title}
        </p>


        <p
          className="
            mt-1
            text-xs
            text-slate-500
          "
        >
          {actor}
        </p>

      </div>


      <div
        className="
          text-xs
          text-slate-400
        "
      >

        <p>
          Previous state
        </p>


        <p
          className="
            my-1
          "
        >
          ↓
        </p>


        <b
          className="
            text-[#173452]
          "
        >
          {state}
        </b>

      </div>

    </div>
  );
}