import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Flag,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

import { projects } from "../data/projects";

/* =====================================================
   CONSTANTS
===================================================== */

const PROJECTS_PER_PAGE = 9;


/* =====================================================
   HELPERS
===================================================== */

const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-orange-500";
  return "bg-red-500";
};




const getProgressTextColor = (progress) => {
  if (progress >= 80) return "text-emerald-600";
  if (progress >= 50) return "text-orange-600";
  return "text-red-600";
};


const getStatusStyle = (status) => {
  const styles = {
    Completed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    Ongoing:
      "border-orange-200 bg-orange-50 text-orange-700",

    Delayed:
      "border-red-200 bg-red-50 text-red-700",

    Pending:
      "border-slate-200 bg-slate-50 text-slate-600",
  };

  return styles[status] || styles.Pending;
};


const getRiskStyle = (riskLevel) => {
  const styles = {
    High:
      "border-red-200 bg-red-50 text-red-600",

    Medium:
      "border-orange-200 bg-orange-50 text-orange-600",

    Low:
      "border-emerald-200 bg-emerald-50 text-emerald-600",
  };

  return styles[riskLevel] || styles.Low;
};


/* =====================================================
   PROJECT CARD
===================================================== */

function ProjectCard({ project, index }) {
  const [reported, setReported] = useState(false);
  const navigate = useNavigate();

  const progress = project.physicalProgress || 0;


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
        delay: index * 0.04,
      }}
      whileHover={{
        y: -10,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-[0_8px_30px_rgba(15,23,42,0.05)]
        transition-all
        duration-300
        hover:border-slate-300
        hover:shadow-[0_20px_60px_rgba(15,23,42,0.13)]
      "
    >

      {/* TOP HOVER LINE */}

      <div
        className="
          absolute
          left-0
          top-0
          h-1
          w-0
          bg-gradient-to-r
          from-orange-400
          via-orange-500
          to-amber-400
          transition-all
          duration-500
          group-hover:w-full
        "
      />


      {/* TOP SECTION */}

      <div className="flex items-start justify-between gap-4">


        {/* PROJECT ID */}

        <div>

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.14em]
              text-slate-500
            "
          >
            {project.id}
          </p>


          {/* TITLE */}

          <h2
            className="
              mt-4
              text-[20px]
              font-bold
              leading-[1.4]
              text-slate-800
              transition-colors
              duration-300
              group-hover:text-orange-700
            "
          >
            {project.name}
          </h2>

        </div>


        {/* BADGES */}

        <div className="flex shrink-0 flex-col items-end gap-2">

          {/* STATUS */}

          <span
            className={`
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-semibold
              transition-all
              duration-300
              group-hover:scale-105
              ${getStatusStyle(project.status)}
            `}
          >
            {project.status}
          </span>


          {/* RISK */}

          <span
            className={`
              flex
              items-center
              gap-2
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-semibold
              transition-all
              duration-300
              group-hover:scale-105
              ${getRiskStyle(project.riskLevel)}
            `}
          >

            <span
              className={`
                h-2
                w-2
                rounded-full

                ${
                  project.riskLevel === "High"
                    ? "bg-red-500"
                    : project.riskLevel === "Medium"
                    ? "bg-orange-500"
                    : "bg-emerald-500"
                }
              `}
            />

            {project.riskScore} Risk

          </span>

        </div>

      </div>


      {/* LOCATION + CATEGORY */}

      <div
        className="
          mt-6
          flex
          flex-wrap
          items-center
          gap-3
          text-sm
        "
      >

        {/* LOCATION */}

        <div
          className="
            flex
            items-center
            gap-2
            text-slate-500
          "
        >

          <MapPin
            size={18}
            className="
              text-orange-500
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          <span>
            {project.district}, {project.state}
          </span>

        </div>


        {/* CATEGORY */}

        <span
          className="
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-3
            py-1.5
            text-xs
            font-medium
            text-slate-600
            transition-all
            duration-300
            group-hover:border-orange-200
            group-hover:bg-orange-50
            group-hover:text-orange-700
          "
        >
          {project.category}
        </span>

      </div>


      {/* FINANCIAL BOX */}

      <div
        className="
          mt-6
          rounded-[20px]
          border
          border-slate-200
          bg-slate-50
          p-4
          transition-all
          duration-300
          group-hover:border-slate-300
          group-hover:bg-white
        "
      >

        {/* MONEY */}

        <div className="grid grid-cols-2 gap-6">


          {/* SANCTIONED */}

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Sanctioned
            </p>


            <p
              className="
                mt-2
                text-lg
                font-bold
                text-slate-800
              "
            >
              {project.cost}
            </p>

          </div>


          {/* EXPENDITURE */}

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Expenditure
            </p>


            <div className="mt-2 flex items-center gap-2">

              <p
                className="
                  text-lg
                  font-bold
                  text-slate-800
                "
              >
                {project.expenditure}
              </p>


              <span
                className="
                  text-xs
                  font-bold
                  text-slate-400
                "
              >
                ({project.expenditurePercent}%)
              </span>

            </div>

          </div>

        </div>


        {/* PROGRESS */}

        <div className="mt-5">


          <div className="flex items-center justify-between">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
                text-slate-400
              "
            >
              Physical Progress
            </p>


            <span
              className={`
                text-xs
                font-bold
                ${getProgressTextColor(progress)}
              `}
            >
              {progress}%
            </span>

          </div>


          {/* PROGRESS BAR */}

          <div
            className="
              mt-2
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
                delay: index * 0.05,
              }}
              className={`
                h-full
                rounded-full
                ${getProgressColor(progress)}
              `}
            />

          </div>

        </div>

      </div>


      {/* BUTTON SECTION */}

      <div
        className="
          mt-6
          flex
          items-center
          gap-3
        "
      >


        {/* VIEW PROJECT */}

<button
  onClick={() => navigate(`/projects/${project.id}`)}
  className="
    group
    flex
    w-full
    items-center
    justify-center
    gap-4
    rounded-2xl
    bg-[#17263a]
    px-8
    py-5
    text-lg
    font-bold
    text-white
    shadow-lg
    transition-all
    duration-300
    hover:-translate-y-1
    hover:bg-orange-500
    hover:shadow-2xl
    hover:shadow-orange-200
    active:scale-[0.98]
  "
>
  <span>View Project</span>

  <ChevronRight
    size={24}
    strokeWidth={2.5}
    className="
      transition-transform
      duration-300
      group-hover:translate-x-2
    "
  />
</button>


        {/* REPORT */}

        <button
          onClick={() => setReported(!reported)}
          className={`
            flex
            h-[52px]
            w-[56px]
            items-center
            justify-center
            rounded-[18px]
            border
            transition-all
            duration-300
            active:scale-95

            ${
              reported
                ? "border-red-500 bg-red-500 text-white"
                : `
                  border-red-200
                  bg-red-50
                  text-red-500
                  hover:border-red-400
                  hover:bg-red-500
                  hover:text-white
                `
            }
          `}
        >

          <Flag size={20} />

        </button>

      </div>


      {/* REPORTED MESSAGE */}

      <AnimatePresence>

        {reported && (

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            className="
              mt-3
              text-center
              text-xs
              font-medium
              text-red-500
            "
          >
            Project marked for review
          </motion.div>

        )}

      </AnimatePresence>

    </motion.div>
  );
}


/* =====================================================
   PROJECTS PAGE
===================================================== */

export default function ProjectsPage() {

  /* =====================================
     STATE
  ===================================== */

  const [search, setSearch] = useState("");

  const [stateFilter, setStateFilter] =
    useState("All States");

  const [districtFilter, setDistrictFilter] =
    useState("All Districts");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [riskFilter, setRiskFilter] =
    useState("All Risk Levels");

  const [sortOrder, setSortOrder] =
    useState("default");

  const [currentPage, setCurrentPage] =
    useState(1);


  /* =====================================
     OPTIONS
  ===================================== */

  const states = useMemo(() => {

    return [
      ...new Set(
        projects.map(
          (project) => project.state
        )
      ),
    ];

  }, []);


  const districts = useMemo(() => {

    let filtered = projects;

    if (stateFilter !== "All States") {

      filtered =
        projects.filter(
          (project) =>
            project.state === stateFilter
        );

    }

    return [
      ...new Set(
        filtered.map(
          (project) => project.district
        )
      ),
    ];

  }, [stateFilter]);


  const categories = useMemo(() => {

    return [
      ...new Set(
        projects.map(
          (project) => project.category
        )
      ),
    ];

  }, []);


  const statuses = useMemo(() => {

    return [
      ...new Set(
        projects.map(
          (project) => project.status
        )
      ),
    ];

  }, []);


  /* =====================================
     FILTER PROJECTS
  ===================================== */

  const filteredProjects = useMemo(() => {

    let data = [...projects];


    /* SEARCH */

    if (search.trim()) {

      const query =
        search.toLowerCase();

      data = data.filter((project) => {

        return (

          project.name
            ?.toLowerCase()
            .includes(query)

          ||

          project.id
            ?.toLowerCase()
            .includes(query)

          ||

          project.state
            ?.toLowerCase()
            .includes(query)

          ||

          project.district
            ?.toLowerCase()
            .includes(query)

          ||

          project.mpName
            ?.toLowerCase()
            .includes(query)

        );

      });

    }


    /* STATE */

    if (
      stateFilter !== "All States"
    ) {

      data = data.filter(
        (project) =>
          project.state === stateFilter
      );

    }


    /* DISTRICT */

    if (
      districtFilter !== "All Districts"
    ) {

      data = data.filter(
        (project) =>
          project.district === districtFilter
      );

    }


    /* CATEGORY */

    if (
      categoryFilter !== "All Categories"
    ) {

      data = data.filter(
        (project) =>
          project.category === categoryFilter
      );

    }


    /* STATUS */

    if (
      statusFilter !== "All Statuses"
    ) {

      data = data.filter(
        (project) =>
          project.status === statusFilter
      );

    }


    /* RISK */

    if (
      riskFilter !== "All Risk Levels"
    ) {

      data = data.filter(
        (project) =>
          project.riskLevel === riskFilter
      );

    }


    /* SORT */

    if (
      sortOrder === "risk"
    ) {

      data.sort(
        (a, b) =>
          b.riskScore - a.riskScore
      );

    }


    if (
      sortOrder === "cost"
    ) {

      data.sort(
        (a, b) =>
          b.costValue - a.costValue
      );

    }


    if (
      sortOrder === "progress"
    ) {

      data.sort(
        (a, b) =>
          a.physicalProgress -
          b.physicalProgress
      );

    }


    return data;

  }, [
    search,
    stateFilter,
    districtFilter,
    categoryFilter,
    statusFilter,
    riskFilter,
    sortOrder,
  ]);


  /* =====================================
     RESET PAGE ON FILTER
  ===================================== */

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    stateFilter,
    districtFilter,
    categoryFilter,
    statusFilter,
    riskFilter,
    sortOrder,
  ]);


  /* =====================================
     PAGINATION
  ===================================== */

  const totalPages =
    Math.ceil(
      filteredProjects.length /
      PROJECTS_PER_PAGE
    );


  const startIndex =
    (currentPage - 1) *
    PROJECTS_PER_PAGE;


  const paginatedProjects =
    filteredProjects.slice(
      startIndex,
      startIndex + PROJECTS_PER_PAGE
    );


  /* =====================================
     RESET FILTERS
  ===================================== */

  const resetFilters = () => {

    setSearch("");

    setStateFilter("All States");

    setDistrictFilter("All Districts");

    setCategoryFilter("All Categories");

    setStatusFilter("All Statuses");

    setRiskFilter("All Risk Levels");

    setSortOrder("default");

    setCurrentPage(1);

  };


  /* =====================================
     PAGE NUMBERS
  ===================================== */

  const getPageNumbers = () => {

    const pages = [];

    for (
      let i = 1;
      i <= totalPages;
      i++
    ) {

      pages.push(i);

    }

    return pages;

  };


  return (

    <div
      className="
        min-h-screen
        bg-[#f6f8fc]
      "
    >

      <main
        className="
          mx-auto
          max-w-[1550px]
          px-6
          py-10
          lg:px-10
        "
      >


        {/* =================================
            HEADER
        ================================= */}

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
            flex
            flex-col
            justify-between
            gap-6
            lg:flex-row
            lg:items-center
          "
        >


          {/* TITLE */}

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.22em]
                text-orange-600
              "
            >
              Public Project Explorer
            </p>


            <h1
              className="
                mt-2
                text-4xl
                font-bold
                tracking-tight
                text-slate-800
                md:text-5xl
              "
            >
              MPLADS Project Registry
            </h1>


            <p
              className="
                mt-3
                text-base
                text-slate-500
                md:text-lg
              "
            >
              Search, filter and inspect every sanctioned work
              — with AI risk intelligence on each project.
            </p>

          </div>


          {/* SORT */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <ArrowUpDown
              size={20}
              className="text-slate-400"
            />


            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value
                )
              }
              className="
                h-[48px]
                min-w-[220px]
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                font-medium
                text-slate-700
                outline-none
                transition-all
                focus:border-orange-400
                focus:ring-4
                focus:ring-orange-100
              "
            >

              <option value="default">
                Default order
              </option>

              <option value="risk">
                Highest risk first
              </option>

              <option value="cost">
                Highest cost first
              </option>

              <option value="progress">
                Lowest progress first
              </option>

            </select>

          </div>

        </motion.div>


        {/* =================================
            FILTER PANEL
        ================================= */}

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
            mt-8
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-6
            shadow-[0_12px_40px_rgba(15,23,42,0.06)]
          "
        >


          {/* SEARCH */}

          <div className="flex gap-4">


            <div
              className="
                relative
                flex-1
              "
            >

              <Search
                size={21}
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                type="text"

                value={search}

                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }

                placeholder="
                  Search projects by name, ID, district or MP...
                "

                className="
                  h-[58px]
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  bg-slate-50
                  pl-14
                  pr-5
                  text-base
                  text-slate-700
                  outline-none
                  transition-all
                  placeholder:text-slate-400
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />

            </div>


            {/* RESET */}

            <button
              onClick={resetFilters}
              className="
                flex
                h-[58px]
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-6
                font-semibold
                text-slate-500
                transition-all
                hover:border-orange-300
                hover:bg-orange-50
                hover:text-orange-600
                active:scale-95
              "
            >

              <RotateCcw size={19} />

              Reset

            </button>

          </div>


          {/* FILTERS */}

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-5
            "
          >


            {/* STATE */}

            <FilterSelect
              label="State"
              value={stateFilter}
              onChange={(value) => {

                setStateFilter(value);

                setDistrictFilter(
                  "All Districts"
                );

              }}
              options={[
                "All States",
                ...states,
              ]}
            />


            {/* DISTRICT */}

            <FilterSelect
              label="District"
              value={districtFilter}
              onChange={setDistrictFilter}
              options={[
                "All Districts",
                ...districts,
              ]}
            />


            {/* CATEGORY */}

            <FilterSelect
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                "All Categories",
                ...categories,
              ]}
            />


            {/* STATUS */}

            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "All Statuses",
                ...statuses,
              ]}
            />


            {/* RISK */}

            <FilterSelect
              label="Risk Level"
              value={riskFilter}
              onChange={setRiskFilter}
              options={[
                "All Risk Levels",
                "High",
                "Medium",
                "Low",
              ]}
            />

          </div>


          {/* RESULT */}

          <div
            className="
              mt-6
              flex
              items-center
              gap-3
              border-t
              border-slate-100
              pt-5
            "
          >

            <SlidersHorizontal
              size={19}
              className="text-slate-400"
            />


            <span
              className="
                text-sm
                text-slate-500
              "
            >

              <strong className="text-slate-700">
                {filteredProjects.length}
              </strong>

              {" "}
              projects match

            </span>

          </div>

        </motion.div>


        {/* =================================
            PROJECT GRID
        ================================= */}

        <AnimatePresence mode="wait">

          <motion.div
            key={currentPage}

            initial={{
              opacity: 0,
              y: 15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -15,
            }}

            transition={{
              duration: 0.35,
            }}

            className="
              mt-8
              grid
              grid-cols-1
              gap-7
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {paginatedProjects.map(
              (project, index) => (

                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />

              )
            )}

          </motion.div>

        </AnimatePresence>


        {/* =================================
            EMPTY STATE
        ================================= */}

        {filteredProjects.length === 0 && (

          <motion.div
            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            className="
              mt-10
              rounded-[28px]
              border
              border-dashed
              border-slate-300
              bg-white
              py-20
              text-center
            "
          >

            <Search
              size={42}
              className="
                mx-auto
                text-slate-300
              "
            />


            <h3
              className="
                mt-5
                text-xl
                font-bold
                text-slate-700
              "
            >
              No projects found
            </h3>


            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Try changing your filters or search query.
            </p>


            <button
              onClick={resetFilters}
              className="
                mt-6
                rounded-xl
                bg-slate-900
                px-6
                py-3
                font-semibold
                text-white
                transition-all
                hover:bg-orange-600
              "
            >
              Reset Filters
            </button>

          </motion.div>

        )}


        {/* =================================
            PAGINATION
        ================================= */}

        {filteredProjects.length > 0 && (

          <div
            className="
              mt-10
              flex
              flex-col
              items-center
              justify-between
              gap-5
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              md:flex-row
            "
          >


            {/* INFO */}

            <p
              className="
                text-sm
                text-slate-500
              "
            >

              Showing

              {" "}

              <strong>
                {startIndex + 1}
              </strong>

              {" - "}

              <strong>
                {Math.min(
                  startIndex +
                    PROJECTS_PER_PAGE,
                  filteredProjects.length
                )}
              </strong>

              {" "}

              of

              {" "}

              <strong>
                {filteredProjects.length}
              </strong>

              {" "}

              projects

            </p>


            {/* BUTTONS */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >


              {/* PREVIOUS */}

              <button
                disabled={
                  currentPage === 1
                }

                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }

                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  transition-all
                  hover:border-orange-300
                  hover:bg-orange-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                <ChevronLeft size={19} />

              </button>


              {/* PAGE NUMBERS */}

              {getPageNumbers()
                .slice(
                  Math.max(
                    0,
                    currentPage - 3
                  ),
                  Math.min(
                    totalPages,
                    currentPage + 2
                  )
                )
                .map((page) => (

                  <button
                    key={page}

                    onClick={() =>
                      setCurrentPage(page)
                    }

                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      text-sm
                      font-semibold
                      transition-all
                      duration-200

                      ${
                        currentPage === page
                          ? `
                            bg-slate-900
                            text-white
                            shadow-lg
                          `
                          : `
                            border
                            border-slate-200
                            text-slate-600
                            hover:border-orange-300
                            hover:bg-orange-50
                            hover:text-orange-600
                          `
                      }
                    `}
                  >
                    {page}
                  </button>

                ))}


              {/* NEXT */}

              <button
                disabled={
                  currentPage === totalPages
                }

                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }

                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  transition-all
                  hover:border-orange-300
                  hover:bg-orange-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                <ChevronRight size={19} />

              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}


/* =====================================================
   FILTER SELECT COMPONENT
===================================================== */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {

  return (

    <div>

      <label
        className="
          mb-2
          block
          text-xs
          font-bold
          uppercase
          tracking-[0.14em]
          text-slate-500
        "
      >
        {label}
      </label>


      <select
        value={value}

        onChange={(event) =>
          onChange(
            event.target.value
          )
        }

        className="
          h-[54px]
          w-full
          rounded-2xl
          border
          border-slate-300
          bg-slate-50
          px-4
          font-medium
          text-slate-700
          outline-none
          transition-all
          hover:border-slate-400
          focus:border-orange-400
          focus:bg-white
          focus:ring-4
          focus:ring-orange-100
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

    </div>

  );

}