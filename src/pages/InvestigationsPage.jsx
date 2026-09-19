import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  RotateCcw,
  ShieldCheck,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { projects } from "../data/projects";


// =====================================================
// CONSTANTS
// =====================================================

const PAGE_SIZE = 12;


// =====================================================
// RISK HELPERS
// =====================================================

const getRiskLevel = (project) => {
  const score = Number(project?.riskScore) || 0;

  const level = String(
    project?.riskLevel || ""
  ).toLowerCase();

  if (level === "high" || score >= 61) {
    return "High";
  }

  if (level === "medium" || score >= 31) {
    return "Medium";
  }

  return "Low";
};


const riskStyles = {
  High:
    "border-red-200 bg-red-50 text-red-600",

  Medium:
    "border-orange-200 bg-orange-50 text-orange-600",

  Low:
    "border-emerald-200 bg-emerald-50 text-emerald-600",
};


const riskBars = {
  High:
    "bg-red-500",

  Medium:
    "bg-orange-500",

  Low:
    "bg-emerald-500",
};


// =====================================================
// INVESTIGATION STATUS
// =====================================================

const getInvestigationStatus = (project) => {
  const projectStatus = String(
    project?.status || ""
  ).toLowerCase();

  const riskLevel = getRiskLevel(project);

  /*
    If your projects.js later contains a dedicated
    investigationStatus field, that value will be used.
  */

  if (project?.investigationStatus) {
    return project.investigationStatus;
  }


  if (
    projectStatus.includes("investigation") ||
    projectStatus.includes("under review")
  ) {
    return "Under Investigation";
  }


  if (
    projectStatus.includes("delayed") ||
    riskLevel === "High"
  ) {
    return "Requires Field Inspection";
  }


  return "Evidence Review";
};


const investigationStatusStyles = {
  "Requires Field Inspection":
    "border-orange-200 bg-orange-50 text-orange-600",

  "Evidence Review":
    "border-amber-200 bg-amber-50 text-amber-600",

  "Under Investigation":
    "border-red-200 bg-red-50 text-red-600",
};


// =====================================================
// MAIN PAGE
// =====================================================

export default function InvestigationsPage() {

  const navigate = useNavigate();


  // ===================================================
  // STATE
  // ===================================================

  const [search, setSearch] = useState("");

  const [state, setState] =
    useState("All States");

  const [district, setDistrict] =
    useState("All Districts");

  const [category, setCategory] =
    useState("All Categories");

  const [status, setStatus] =
    useState("All Statuses");

  const [riskFilter, setRiskFilter] =
    useState("All Risk Levels");

  const [order, setOrder] =
    useState("desc");

  const [page, setPage] =
    useState(1);


  // ===================================================
  // STATES
  // ===================================================

  const states = useMemo(() => {

    return [
      ...new Set(
        projects
          .map((project) => project.state)
          .filter(Boolean)
      ),
    ].sort();

  }, []);


  // ===================================================
  // DISTRICTS
  // ===================================================

  const districts = useMemo(() => {

    return [
      ...new Set(
        projects
          .filter(
            (project) =>
              state === "All States" ||
              project.state === state
          )
          .map((project) => project.district)
          .filter(Boolean)
      ),
    ].sort();

  }, [state]);


  // ===================================================
  // CATEGORIES
  // ===================================================

  const categories = useMemo(() => {

    return [
      ...new Set(
        projects
          .map((project) => project.category)
          .filter(Boolean)
      ),
    ].sort();

  }, []);


  // ===================================================
  // STATUSES
  // ===================================================

  const statuses = useMemo(() => {

    return [
      ...new Set(
        projects
          .map((project) => project.status)
          .filter(Boolean)
      ),
    ].sort();

  }, []);


  // ===================================================
  // FILTER + SORT
  // ===================================================

  const data = useMemo(() => {

    const query =
      search.trim().toLowerCase();


    return projects

      .filter((project) => {

        const riskLevel =
          getRiskLevel(project);


        const searchableText = [

          project.id,

          project.name,

          project.workDescription,

          project.location,

          project.district,

          project.state,

          project.mpName,

        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


        const matchesSearch =
          !query ||
          searchableText.includes(query);


        const matchesState =
          state === "All States" ||
          project.state === state;


        const matchesDistrict =
          district === "All Districts" ||
          project.district === district;


        const matchesCategory =
          category === "All Categories" ||
          project.category === category;


        const matchesStatus =
          status === "All Statuses" ||
          project.status === status;


        const matchesRisk =
          riskFilter === "All Risk Levels" ||
          riskLevel === riskFilter;


        return (
          matchesSearch &&
          matchesState &&
          matchesDistrict &&
          matchesCategory &&
          matchesStatus &&
          matchesRisk
        );

      })

      .sort((a, b) => {

        const scoreA =
          Number(a.riskScore) || 0;

        const scoreB =
          Number(b.riskScore) || 0;


        if (order === "desc") {
          return scoreB - scoreA;
        }

        return scoreA - scoreB;

      });

  }, [
    search,
    state,
    district,
    category,
    status,
    riskFilter,
    order,
  ]);


  // ===================================================
  // PAGINATION
  // ===================================================

  const pages = Math.max(
    1,
    Math.ceil(
      data.length / PAGE_SIZE
    )
  );


  const current =
    Math.min(page, pages);


  const visible = data.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );


  // ===================================================
  // RESET
  // ===================================================

  const reset = () => {

    setSearch("");

    setState("All States");

    setDistrict("All Districts");

    setCategory("All Categories");

    setStatus("All Statuses");

    setRiskFilter("All Risk Levels");

    setOrder("desc");

    setPage(1);

  };


  // ===================================================
  // FILTER HANDLER
  // ===================================================

  const filter = (setter) => (event) => {

    setter(event.target.value);

    setPage(1);

  };


  // ===================================================
  // PAGE CHANGE
  // ===================================================

  const changePage = (newPage) => {

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // ===================================================
  // JSX
  // ===================================================

  return (

    <div
      className="
        min-h-screen
        bg-[#f5f7fb]
        text-slate-800
      "
    >

      <main
        className="
          mx-auto
          max-w-[1550px]
          px-5
          pb-16
          pt-7
          sm:px-8
          lg:px-10
        "
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <motion.section

          initial={{
            opacity: 0,
            y: -18,
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
            flex
            flex-col
            gap-5
            xl:flex-row
            xl:items-end
            xl:justify-between
          "
        >

          <div>

            <p
              className="
                mb-2
                text-[12px]
                font-extrabold
                tracking-[0.16em]
                text-orange-600
              "
            >
              NATIONAL PROJECT REGISTRY
            </p>


            <h1
              className="
                text-3xl
                font-extrabold
                tracking-tight
                text-[#10233d]
                sm:text-4xl
              "
            >
              Active Investigations
            </h1>


            <p
              className="
                mt-2
                text-[15px]
                text-slate-500
              "
            >
              {data.length} projects currently
              being investigated
              <span className="mx-1">
                —
              </span>
              sorted by risk.
            </p>

          </div>


          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            <button
              type="button"
              onClick={() => {
                setRiskFilter(
                  "All Risk Levels"
                );

                setPage(1);
              }}
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-red-600
                px-5
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-red-500/20
                transition
                hover:bg-red-700
              "
            >

              <ShieldCheck size={17} />

              Showing Investigations

            </button>


            <button
              type="button"
              onClick={() =>
                setOrder(
                  (value) =>
                    value === "desc"
                      ? "asc"
                      : "desc"
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-white
              "
            >

              <ArrowUpDown size={18} />

            </button>


            <select
              value={order}
              onChange={(event) => {

                setOrder(
                  event.target.value
                );

                setPage(1);

              }}
              className="
                h-11
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                font-semibold
                outline-none
              "
            >

              <option value="desc">
                Sort: Risk score
              </option>

              <option value="asc">
                Sort: Lowest risk
              </option>

            </select>

          </div>

        </motion.section>


        {/* =================================================
            FILTER PANEL
        ================================================= */}

        <motion.section

          initial={{
            opacity: 0,
            y: 18,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
            delay: 0.05,
          }}

          className="
            rounded-[22px]
            border
            border-slate-200
            bg-white
            p-5
            shadow-[0_10px_35px_rgba(15,23,42,.06)]
            sm:p-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
            "
          >

            {/* SEARCH */}

            <div
              className="
                relative
                flex-1
              "
            >

              <Search
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#8ca2c0]
                "
              />


              <input
                value={search}
                onChange={(event) => {

                  setSearch(
                    event.target.value
                  );

                  setPage(1);

                }}
                placeholder="
                  Search projects by name,
                  ID, district or MP...
                "
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-12
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-orange-300
                  focus:ring-4
                  focus:ring-orange-50
                "
              />

            </div>


            {/* RESET */}

            <button
              type="button"
              onClick={reset}
              className="
                flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                px-4
                text-sm
                font-semibold
                text-slate-400
                transition
                hover:bg-orange-50
                hover:text-orange-600
              "
            >

              <RotateCcw size={16} />

              Reset

            </button>

          </div>


          {/* FILTERS */}

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-3
              border-t
              border-slate-100
              pt-5
              md:grid-cols-2
              xl:grid-cols-5
            "
          >

            <Select
              label="STATE"
              value={state}
              options={[
                "All States",
                ...states,
              ]}
              onChange={(event) => {

                setState(
                  event.target.value
                );

                setDistrict(
                  "All Districts"
                );

                setPage(1);

              }}
            />


            <Select
              label="DISTRICT"
              value={district}
              options={[
                "All Districts",
                ...districts,
              ]}
              onChange={filter(
                setDistrict
              )}
            />


            <Select
              label="CATEGORY"
              value={category}
              options={[
                "All Categories",
                ...categories,
              ]}
              onChange={filter(
                setCategory
              )}
            />


            <Select
              label="STATUS"
              value={status}
              options={[
                "All Statuses",
                ...statuses,
              ]}
              onChange={filter(
                setStatus
              )}
            />


            <Select
              label="RISK LEVEL"
              value={riskFilter}
              options={[
                "All Risk Levels",
                "High",
                "Medium",
                "Low",
              ]}
              onChange={filter(
                setRiskFilter
              )}
            />

          </div>


          {/* MATCH COUNT */}

          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              border-t
              border-slate-100
              pt-4
              text-sm
            "
          >

            <span
              className="
                font-bold
                text-slate-700
              "
            >
              {data.length}
            </span>


            <span
              className="
                text-slate-400
              "
            >
              projects match
            </span>

          </div>

        </motion.section>


        {/* =================================================
            PROJECT CARDS
        ================================================= */}

        <AnimatePresence mode="wait">

          <motion.div

            key={`${current}-${data.length}-${search}-${state}-${district}-${category}-${status}-${riskFilter}`}

            initial={{
              opacity: 0,
              y: 12,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -8,
            }}

            transition={{
              duration: 0.3,
            }}

            className="
              mt-7
              grid
              grid-cols-1
              gap-7
              lg:grid-cols-2
              xl:grid-cols-3
            "
          >

            {visible.map(
              (project, index) => (

                <Card
                  key={project.id}
                  project={project}
                  index={index}
                  onInvestigate={() =>
                    navigate(
                      `/investigations/${encodeURIComponent(
                        project.id
                      )}`
                    )
                  }
                />

              )
            )}

          </motion.div>

        </AnimatePresence>


        {/* =================================================
            NO RESULTS
        ================================================= */}

        {data.length === 0 && (

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              mt-7
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-14
              text-center
              text-slate-400
            "
          >

            No projects found.

            <button
              type="button"
              onClick={reset}
              className="
                ml-1
                font-bold
                text-orange-600
              "
            >
              Clear filters
            </button>

          </motion.div>

        )}


        {/* =================================================
            PAGINATION
        ================================================= */}

        {data.length > 0 && (

          <div
            className="
              mt-9
              flex
              flex-col
              items-center
              justify-between
              gap-4
              sm:flex-row
            "
          >

            <p
              className="
                text-sm
                text-slate-400
              "
            >

              Showing{" "}

              <b
                className="
                  text-slate-600
                "
              >
                {(current - 1) *
                  PAGE_SIZE +
                  1}
              </b>

              {" – "}

              <b
                className="
                  text-slate-600
                "
              >
                {Math.min(
                  current * PAGE_SIZE,
                  data.length
                )}
              </b>

              {" of "}

              <b
                className="
                  text-slate-600
                "
              >
                {data.length}
              </b>

              {" projects"}

            </p>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Page
                disabled={current === 1}
                onClick={() =>
                  changePage(
                    current - 1
                  )
                }
              >

                <ChevronLeft size={17} />

              </Page>


              {Array.from(
                {
                  length: pages,
                },
                (_, index) =>
                  index + 1
              )

                .filter(
                  (number) =>
                    number === 1 ||
                    number === pages ||
                    Math.abs(
                      number - current
                    ) <= 1
                )

                .map(
                  (
                    number,
                    index,
                    array
                  ) => (

                    <span
                      key={number}
                      className="contents"
                    >

                      {index > 0 &&
                        array[index - 1] !==
                          number - 1 && (

                          <span
                            className="
                              px-1
                              text-slate-300
                            "
                          >
                            ...
                          </span>

                        )}


                      <Page
                        active={
                          number === current
                        }
                        onClick={() =>
                          changePage(
                            number
                          )
                        }
                      >
                        {number}
                      </Page>

                    </span>

                  )
                )}


              <Page
                disabled={
                  current === pages
                }
                onClick={() =>
                  changePage(
                    current + 1
                  )
                }
              >

                <ChevronRight size={17} />

              </Page>

            </div>

          </div>

        )}

      </main>

    </div>

  );
}


// =====================================================
// SELECT COMPONENT
// =====================================================

function Select({
  label,
  value,
  options,
  onChange,
}) {

  return (

    <label>

      <span
        className="
          mb-2
          block
          text-[11px]
          font-extrabold
          tracking-[.12em]
          text-[#657b9b]
        "
      >
        {label}
      </span>


      <div className="relative">

        <select
          value={value}
          onChange={onChange}
          className="
            h-12
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            pr-10
            text-sm
            font-medium
            outline-none
            transition
            focus:border-orange-300
            focus:ring-4
            focus:ring-orange-50
          "
        >

          {options.map(
            (option) => (

              <option
                key={option}
                value={option}
              >
                {option}
              </option>

            )
          )}

        </select>


        <ChevronDown
          size={16}
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

      </div>

    </label>

  );
}


// =====================================================
// PROJECT CARD
// =====================================================

function Card({
  project,
  index,
  onInvestigate,
}) {

  const riskLevel =
    getRiskLevel(project);

  const score =
    Number(project.riskScore) || 0;


  const progress = Math.max(
    0,
    Math.min(
      100,
      Number(
        project.physicalProgress
      ) || 0
    )
  );


  const investigationStatus =
    getInvestigationStatus(project);


  const investigationStatusStyle =
    investigationStatusStyles[
      investigationStatus
    ] ||
    investigationStatusStyles[
      "Evidence Review"
    ];


  return (

    <motion.article

      initial={{
        opacity: 0,
        y: 25,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.4,
        delay: Math.min(
          index * 0.04,
          0.3
        ),
      }}

      whileHover={{
        y: -5,
      }}

      className="
        group
        relative
        overflow-hidden
        rounded-[25px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-[0_10px_28px_rgba(15,23,42,.055)]
        transition-shadow
        duration-300
        hover:shadow-[0_18px_42px_rgba(15,23,42,.1)]
      "
    >

      {/* TOP RISK BAR */}

      <div
        className={`
          absolute
          inset-x-0
          top-0
          h-1
          ${riskBars[riskLevel]}
        `}
      />


      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          min-h-[78px]
          items-start
          justify-between
          gap-4
        "
      >

        <div className="min-w-0">

          <p
            className="
              truncate
              text-[11px]
              font-extrabold
              tracking-[.14em]
              text-[#5e7597]
            "
          >
            {project.id}
          </p>


          <h2
            className="
              mt-3
              line-clamp-2
              min-h-[50px]
              text-[19px]
              font-extrabold
              leading-6
              text-[#10233d]
            "
          >
            {project.name ||
              "Unnamed Project"}
          </h2>

        </div>


        <div
          className="
            flex
            shrink-0
            flex-col
            items-end
            gap-2
          "
        >

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


          <span
            className={`
              flex
              items-center
              gap-1.5
              rounded-full
              border
              px-3
              py-1
              text-[11px]
              font-bold
              ${riskStyles[riskLevel]}
            `}
          >

            <span
              className={`
                h-2
                w-2
                rounded-full
                ${riskBars[riskLevel]}
              `}
            />

            {score} Risk

          </span>

        </div>

      </div>


      {/* =================================================
          LOCATION
      ================================================= */}

      <div
        className="
          mt-5
          flex
          min-h-[22px]
          items-center
          gap-2
          text-sm
          text-[#60789b]
        "
      >

        <MapPin
          size={17}
          className="
            shrink-0
            text-orange-500
          "
        />


        <span
          className="
            truncate
          "
        >
          {project.district ||
            project.location ||
            "—"}

          ,{" "}

          {project.state ||
            "—"}
        </span>

      </div>


      {/* =================================================
          INVESTIGATION STATUS
          FIXED HEIGHT = SAME POSITION IN EVERY CARD
      ================================================= */}

      <div
        className="
          mt-4
          min-h-[82px]
          rounded-xl
          border
          border-slate-100
          bg-white
          px-3
          py-3
        "
      >

        <p
          className="
            text-[10px]
            font-extrabold
            leading-[15px]
            tracking-[0.12em]
            text-[#8093ae]
          "
        >
          INVESTIGATION
          <br />
          STATUS
        </p>


        <div
          className="
            mt-2
            flex
            h-[28px]
            items-center
          "
        >

          <span
            className={`
              inline-flex
              min-w-fit
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              border
              px-3
              py-1
              text-[11px]
              font-bold
              leading-[14px]
              ${investigationStatusStyle}
            `}
          >
            {investigationStatus}
          </span>

        </div>

      </div>


      {/* =================================================
          FINANCIAL INFORMATION
      ================================================= */}

      <div
        className="
          mt-4
          rounded-[19px]
          border
          border-slate-200
          bg-[#f8fafc]
          p-4
        "
      >

        <div
          className="
            grid
            grid-cols-2
            gap-5
          "
        >

          <Info
            label="SANCTIONED"
            value={
              project.cost || "—"
            }
          />


          <Info
            label="EXPENDITURE"
            value={
              project.expenditure ||
              "—"
            }
            suffix={
              project.expenditurePercent !=
              null
                ? `(${project.expenditurePercent}%)`
                : ""
            }
          />

        </div>


        {/* =================================================
            PHYSICAL PROGRESS
        ================================================= */}

        <div className="mt-5">

          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-[11px]
                font-extrabold
                tracking-[.12em]
                text-[#7d91ad]
              "
            >
              PHYSICAL PROGRESS
            </span>


            <span
              className="
                text-[12px]
                font-extrabold
                text-emerald-600
              "
            >
              {progress}%
            </span>

          </div>


          <div
            className="
              h-2
              overflow-hidden
              rounded-full
              bg-slate-200
            "
          >

            <motion.div

              initial={{
                width: 0,
              }}

              animate={{
                width: `${progress}%`,
              }}

              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: "easeOut",
              }}

              className={`
                h-full
                rounded-full
                ${riskBars[riskLevel]}
              `}
            />

          </div>

        </div>

      </div>


      {/* =================================================
          INVESTIGATE BUTTON
      ================================================= */}

      <div
        className="
          mt-6
          flex
          items-center
          gap-3
        "
      >

        <motion.button

          whileHover={{
            scale: 1.015,
          }}

          whileTap={{
            scale: 0.985,
          }}

          onClick={onInvestigate}

          className="
            flex
            h-14
            flex-1
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-[#17283f]
            text-[16px]
            font-extrabold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:bg-[#203650]
          "
        >

          Investigate


          <ArrowRight
            size={19}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />

        </motion.button>

      </div>

    </motion.article>

  );
}


// =====================================================
// INFO COMPONENT
// =====================================================

function Info({
  label,
  value,
  suffix,
}) {

  return (

    <div>

      <p
        className="
          text-[11px]
          font-extrabold
          tracking-[.12em]
          text-[#8093ae]
        "
      >
        {label}
      </p>


      <p
        className="
          mt-2
          text-[16px]
          font-extrabold
          text-[#10233d]
        "
      >

        {value}


        {suffix && (

          <span
            className="
              ml-1
              text-[11px]
              font-bold
              text-[#8093ae]
            "
          >
            {suffix}
          </span>

        )}

      </p>

    </div>

  );
}


// =====================================================
// PAGINATION BUTTON
// =====================================================

function Page({
  children,
  active,
  disabled,
  onClick,
}) {

  return (

    <motion.button

      whileHover={
        !disabled
          ? {
              y: -1,
            }
          : undefined
      }

      whileTap={
        !disabled
          ? {
              scale: 0.95,
            }
          : undefined
      }

      disabled={disabled}

      onClick={onClick}

      className={`
        flex
        h-10
        min-w-10
        items-center
        justify-center
        rounded-xl
        border
        px-3
        text-sm
        font-bold
        transition-all

        ${
          active
            ? `
              border-[#17283f]
              bg-[#17283f]
              text-white
            `
            : `
              border-slate-200
              bg-white
              text-slate-600
              hover:border-orange-200
              hover:bg-orange-50
              hover:text-orange-600
            `
        }

        ${
          disabled
            ? `
              cursor-not-allowed
              opacity-35
            `
            : `
              cursor-pointer
            `
        }
      `}
    >

      {children}

    </motion.button>

  );
}