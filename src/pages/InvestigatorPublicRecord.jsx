import { useEffect } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  Flag,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

/*
  InvestigatorPublicRecord
  ------------------------
  Read-only public project record for the Investigator panel.

  IMPORTANT:
  - This component intentionally does NOT contain "Report this Project".
  - It is designed to open from the investigator's "View Public Record" button.
  - Project data comes from the same project object used by the investigation page.
  - Existing citizen reports can be displayed, but citizens cannot submit a new
    report from this investigator view.
*/

export default function InvestigatorPublicRecord({
  isOpen,
  onClose,
  project,
  reports = [],
}) {
  /* ---------------------------------------------
     BODY SCROLL LOCK
  --------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /* ---------------------------------------------
     ESCAPE TO CLOSE
  --------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* ---------------------------------------------
     SAFE PROJECT VALUES
  --------------------------------------------- */
  const projectId = project?.id || "N/A";
  const projectName =
    project?.name ||
    project?.title ||
    "MPLADS Project";

  const district = project?.district || "";
  const state = project?.state || "";
  const location =
    project?.location ||
    [district, state].filter(Boolean).join(", ") ||
    "Location not available";

  const category = project?.category || "General";
  const status = project?.status || "Not Available";
  const mpName =
    project?.mpName ||
    project?.recommendedBy ||
    "Not available";

  const implementingAgency =
    project?.implementingAgency ||
    "Not available";

  const contractor =
    project?.contractor ||
    "Not available";

  const physicalProgress = Math.min(
    100,
    Math.max(0, Number(project?.physicalProgress) || 0)
  );

  const riskScore = Math.min(
    100,
    Math.max(0, Number(project?.riskScore) || 0)
  );

  const expenditurePercent =
    project?.expenditurePercent !== undefined &&
    project?.expenditurePercent !== null
      ? Math.min(
          100,
          Math.max(
            0,
            Number(project.expenditurePercent) || 0
          )
        )
      : null;

  /* ---------------------------------------------
     MONEY HELPERS
  --------------------------------------------- */
  const formatLakh = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) return "Not available";

    // Supports both rupees and lakh-style values.
    const lakh =
      number > 100000
        ? number / 100000
        : number;

    return `₹${lakh.toFixed(2)} Lakh`;
  };

  const sanctioned =
    project?.costValue ??
    project?.cost ??
    null;

  let expenditure = project?.expenditure;

  if (
    (expenditure === null ||
      expenditure === undefined ||
      expenditure === "") &&
    expenditurePercent !== null &&
    sanctioned !== null
  ) {
    const sanctionedRupees =
      Number(sanctioned) > 100000
        ? Number(sanctioned)
        : Number(sanctioned) * 100000;

    expenditure =
      sanctionedRupees *
      (expenditurePercent / 100);
  }

  const expenditureDisplay =
    expenditure !== null &&
    expenditure !== undefined &&
    expenditure !== ""
      ? formatLakh(expenditure)
      : "Not available";

  /* ---------------------------------------------
     RISK
  --------------------------------------------- */
  const getRiskLabel = () => {
    if (
      project?.riskLevel
    ) {
      return project.riskLevel;
    }

    if (riskScore >= 61) return "High Risk";
    if (riskScore >= 31) return "Medium Risk";
    return "Low Risk";
  };

  const riskLabel = getRiskLabel();

  const riskClasses =
    riskLabel.toLowerCase().includes("high")
      ? {
          badge:
            "border-red-200 bg-red-50 text-red-600",
          dot: "bg-red-500",
        }
      : riskLabel.toLowerCase().includes("medium")
      ? {
          badge:
            "border-orange-200 bg-orange-50 text-orange-600",
          dot: "bg-orange-500",
        }
      : {
          badge:
            "border-emerald-200 bg-emerald-50 text-emerald-600",
          dot: "bg-emerald-500",
        };

  /* ---------------------------------------------
     REPORT NORMALIZATION
  --------------------------------------------- */
  const projectReports = Array.isArray(reports)
    ? reports.filter((report) => {
        if (!report) return false;

        return (
          report.projectId === projectId ||
          report.projectName === projectName ||
          report.projectTitle === projectName
        );
      })
    : [];

  /* ---------------------------------------------
     DATE FORMATTER
  --------------------------------------------- */
  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md sm:p-6">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close public record"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* MODAL */}
      <div
        className="
          relative
          z-10
          flex
          max-h-[94vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-[0_30px_100px_rgba(15,23,42,0.35)]
          animate-[publicRecordIn_0.35s_ease-out]
        "
      >
        {/* TOP ACCENT */}
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900" />

        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-700
                transition-all
                duration-300
                hover:scale-110
                hover:rotate-3
              "
            >
              <FileText size={23} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                  Public Project Record
                </p>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Read Only
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                Project Information
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Publicly available information associated with this
                MPLADS project.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-slate-500
              transition-all
              duration-300
              hover:rotate-90
              hover:bg-slate-200
              hover:text-slate-800
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* SCROLL CONTENT */}
        <div className="custom-public-scrollbar flex-1 overflow-y-auto">
          <div className="p-5 sm:p-7">

            {/* PROJECT ID + STATUS */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-5
                transition-all
                duration-300
                hover:border-slate-300
                hover:shadow-sm
              "
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Project ID
                  </p>

                  <p className="mt-1 font-mono text-sm font-bold text-slate-700">
                    {projectId}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${riskClasses.badge}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${riskClasses.dot}`}
                    />
                    {riskLabel}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={13} />
                    {status}
                  </span>
                </div>
              </div>

              <h3 className="mt-5 max-w-4xl text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                {projectName}
              </h3>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={16}
                    className="text-orange-500"
                  />
                  <span>{location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Flag
                    size={16}
                    className="text-blue-600"
                  />
                  <span>{category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users
                    size={16}
                    className="text-slate-500"
                  />
                  <span>{mpName}</span>
                </div>
              </div>
            </div>

            {/* PROJECT SNAPSHOT */}
            <section className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <ClipboardCheck size={17} />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Project Snapshot
                  </h3>
                  <p className="text-xs text-slate-500">
                    Key public project information
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* SANCTIONED */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <CircleDollarSign size={18} />
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sanctioned Amount
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-900">
                    {formatLakh(sanctioned)}
                  </p>
                </div>

                {/* EXPENDITURE */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <TrendingUp size={18} />
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Expenditure
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-900">
                    {expenditureDisplay}
                  </p>

                  {expenditurePercent !== null && (
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {expenditurePercent}% utilised
                    </p>
                  )}
                </div>

                {/* PHYSICAL */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <TrendingUp size={18} />
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Physical Progress
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-900">
                    {physicalProgress}%
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${physicalProgress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* RISK */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <ShieldCheck size={18} />
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Risk Score
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-900">
                    {riskScore}
                    <span className="ml-1 text-xs font-bold text-slate-400">
                      /100
                    </span>
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${riskScore}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* PROJECT DETAILS */}
            <section className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Building2 size={17} />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Project Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Implementation and administrative information
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <DetailRow
                    label="Work Description"
                    value={
                      project?.workDescription ||
                      projectName
                    }
                  />

                  <DetailRow
                    label="Category"
                    value={category}
                  />

                  <DetailRow
                    label="District"
                    value={district || "Not available"}
                  />

                  <DetailRow
                    label="State"
                    value={state || "Not available"}
                  />

                  <DetailRow
                    label="Implementing Agency"
                    value={implementingAgency}
                  />

                  <DetailRow
                    label="Contractor"
                    value={contractor}
                  />

                  <DetailRow
                    label="Recommended By"
                    value={
                      project?.recommendedBy ||
                      mpName
                    }
                  />

                  <DetailRow
                    label="Current Status"
                    value={status}
                  />
                </div>
              </div>
            </section>

            {/* TIMELINE */}
            <section className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Project Timeline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dates recorded in the public project record
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <TimelineCard
                  title="Start Date"
                  value={formatDate(project?.startDate)}
                  active
                />

                <TimelineCard
                  title="Expected Completion"
                  value={formatDate(
                    project?.expectedCompletion
                  )}
                />

                <TimelineCard
                  title="Current Status"
                  value={status}
                />
              </div>
            </section>

            {/* CITIZEN REPORTS — READ ONLY */}
            <section className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Users size={17} />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      Publicly Submitted Reports
                    </h3>
                    <p className="text-xs text-slate-500">
                      Existing public submissions associated with this project
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500">
                  {projectReports.length}
                </span>
              </div>

              {projectReports.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
                  <Users
                    size={25}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    No public reports are currently linked to this project.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    This section is read-only in the investigator panel.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projectReports.map((report, index) => (
                    <div
                      key={
                        report.id ||
                        `public-report-${index}`
                      }
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-md
                      "
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-600">
                              {report.issueType ||
                                "Public Concern"}
                            </span>

                            {report.status && (
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                {report.status}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm font-bold text-slate-800">
                            {report.description ||
                              "No description provided."}
                          </p>
                        </div>

                        <span className="text-xs text-slate-400">
                          {formatDate(
                            report.submittedAt ||
                              report.createdAt ||
                              report.date
                          )}
                        </span>
                      </div>

                      {report.evidenceImage && (
                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                          <img
                            src={report.evidenceImage}
                            alt="Citizen submitted evidence"
                            className="max-h-[260px] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* PUBLIC RECORD NOTICE */}
            <div className="mt-7 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
                <ShieldCheck size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-blue-900">
                  Public record — read only
                </p>

                <p className="mt-1 text-xs leading-relaxed text-blue-700">
                  This view shows project information available in
                  the public registry. Investigation actions,
                  internal notes, authority decisions, and other
                  restricted information are intentionally excluded.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
          <p className="hidden text-xs text-slate-400 sm:block">
            MPLADS AI Monitor • Public Project Record
          </p>

          <button
            type="button"
            onClick={onClose}
            className="
              ml-auto
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-slate-900
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-slate-800
              hover:shadow-md
            "
          >
            Close Record
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes publicRecordIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .custom-public-scrollbar::-webkit-scrollbar {
          width: 7px;
        }

        .custom-public-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-public-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }

        .custom-public-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------
   DETAIL ROW
--------------------------------------------- */
function DetailRow({ label, value }) {
  return (
    <div className="p-4 transition-colors duration-200 hover:bg-slate-50">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-800">
        {value || "Not available"}
      </p>
    </div>
  );
}

/* ---------------------------------------------
   TIMELINE CARD
--------------------------------------------- */
function TimelineCard({
  title,
  value,
  active = false,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          active ? "bg-blue-600" : "bg-slate-200"
        }`}
      />

      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}