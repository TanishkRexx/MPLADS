import { useMemo, useState } from "react";

import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  TrendingUp,
  MapPin,
  CheckCircle2,
  IndianRupee,
  Layers3,
} from "lucide-react";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  Cell,
} from "recharts";

import { projects } from "../data/projects";

/* =========================================
   FORMAT NUMBER
========================================= */

const formatNumber = (number) => {
  return new Intl.NumberFormat("en-IN").format(
    Number(number || 0)
  );
};


/* =========================================
   FORMAT AMOUNT

   costValue is assumed to be in Lakh
========================================= */

const formatAmount = (amount) => {
  const value = Number(amount || 0);

  if (value >= 100) {
    return `₹${(value / 100).toFixed(2)} Cr`;
  }

  return `₹${value.toFixed(2)} Lakh`;
};


/* =========================================
   FORMAT AXIS AMOUNT
========================================= */

const formatAxisAmount = (amount) => {
  const value = Number(amount || 0);

  if (value >= 100) {
    return `₹${(value / 100).toFixed(1)} Cr`;
  }

  return `₹${value.toFixed(0)} L`;
};


/* =========================================
   PARSE EXPENDITURE STRING

   Supports:
   ₹8.20 Lakh
   ₹1.5 Cr
========================================= */

const parseExpenditure = (value) => {
  if (!value) return null;

  if (typeof value === "number") {
    return value;
  }

  const cleanValue = String(value)
    .replace(/[₹,\s]/g, "")
    .toLowerCase();

  const numericValue = parseFloat(cleanValue);

  if (Number.isNaN(numericValue)) {
    return null;
  }

  if (cleanValue.includes("cr")) {
    return numericValue * 100;
  }

  return numericValue;
};


/* =========================================
   CUSTOM TOOLTIP
========================================= */

function CustomTooltip({
  active,
  payload,
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) return null;

  return (
    <div
      className="
        min-w-[260px]
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-2xl
      "
    >
      {/* STATE */}

      <div className="mb-4">

        <div className="flex items-center gap-2">

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <MapPin size={18} />
          </div>

          <div>

            <h4
              className="
                text-base
                font-bold
                text-slate-800
              "
            >
              {data.state}
            </h4>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              {data.projects} projects monitored
            </p>

          </div>

        </div>

      </div>


      {/* DIVIDER */}

      <div
        className="
          mb-4
          h-px
          bg-slate-100
        "
      />


      {/* ALLOCATED */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-600
          "
        >

          <span
            className="
              h-3
              w-3
              rounded-sm
              bg-[#4f68a1]
            "
          />

          Allocated

        </div>

        <strong
          className="
            text-sm
            text-slate-800
          "
        >
          {formatAmount(data.allocated)}
        </strong>

      </div>


      {/* EXPENDITURE */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-600
          "
        >

          <span
            className="
              h-3
              w-3
              rounded-sm
              bg-[#8bb879]
            "
          />

          Expenditure

        </div>

        <strong
          className="
            text-sm
            text-slate-800
          "
        >
          {formatAmount(data.expenditure)}
        </strong>

      </div>


      {/* UTILIZATION */}

      <div
        className="
          mt-4
          rounded-xl
          border
          border-amber-100
          bg-amber-50
          p-3
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <span
            className="
              text-sm
              font-medium
              text-amber-700
            "
          >
            Utilization
          </span>

          <strong
            className="
              text-lg
              text-amber-700
            "
          >
            {data.utilization.toFixed(1)}%
          </strong>

        </div>

      </div>


      {/* PROJECTS */}

      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          text-xs
          text-slate-500
        "
      >

        <span>
          Total Projects
        </span>

        <strong
          className="
            text-slate-700
          "
        >
          {formatNumber(data.projects)}
        </strong>

      </div>

    </div>
  );
}


/* =========================================
   CUSTOM LEGEND
========================================= */

function CustomLegend() {
  return (
    <div
      className="
        mb-2
        flex
        flex-wrap
        items-center
        justify-center
        gap-6
        text-sm
      "
    >

      {/* ALLOCATED */}

      <div
        className="
          flex
          items-center
          gap-2
          text-slate-600
        "
      >

        <span
          className="
            h-4
            w-7
            rounded
            bg-[#4f68a1]
          "
        />

        Allocated Amount

      </div>


      {/* EXPENDITURE */}

      <div
        className="
          flex
          items-center
          gap-2
          text-slate-600
        "
      >

        <span
          className="
            h-4
            w-7
            rounded
            bg-[#8bb879]
          "
        />

        Expenditure

      </div>


      {/* UTILIZATION */}

      <div
        className="
          flex
          items-center
          gap-2
          text-slate-600
        "
      >

        <span
          className="
            flex
            items-center
            gap-1
          "
        >

          <span
            className="
              h-[2px]
              w-7
              bg-[#e9b949]
            "
          />

          <span
            className="
              h-3
              w-3
              rounded-full
              bg-[#e9b949]
            "
          />

        </span>

        Utilization %

      </div>

    </div>
  );
}


/* =========================================
   STATE WISE ALLOCATION
========================================= */

export default function StateWiseAllocation() {

  const [selectedStates, setSelectedStates] =
    useState([]);

  const [showStates, setShowStates] =
    useState(false);

  const [viewMode, setViewMode] =
    useState("all");

  const [hoveredState, setHoveredState] =
    useState(null);

  // State summary table: show 10 states first, then reveal all.
  const [showAllTableStates, setShowAllTableStates] =
    useState(false);


  /* =========================================
     CALCULATE DATA FROM PROJECTS.JS
  ========================================= */

  const stateData = useMemo(() => {

    const grouped = {};

    projects.forEach((project) => {

      const state =
        project.state ||
        "Unknown";


      /* =====================================
         ALLOCATION
      ===================================== */

      const allocation =
        Number(project.costValue || 0);


      /* =====================================
         EXPENDITURE

         Priority:
         1. Actual expenditure value
         2. expenditurePercent
      ===================================== */

      let expenditure =
        parseExpenditure(
          project.expenditure
        );


      if (
        expenditure === null &&
        project.expenditurePercent !== undefined
      ) {

        expenditure =
          allocation *
          (
            Number(
              project.expenditurePercent
            ) / 100
          );

      }


      if (expenditure === null) {
        expenditure = 0;
      }


      /* =====================================
         CREATE STATE
      ===================================== */

      if (!grouped[state]) {

        grouped[state] = {

          state,

          allocated: 0,

          expenditure: 0,

          projects: 0,

          completed: 0,

          ongoing: 0,

          delayed: 0,

        };

      }


      /* =====================================
         ADD VALUES
      ===================================== */

      grouped[state].allocated +=
        allocation;

      grouped[state].expenditure +=
        expenditure;

      grouped[state].projects += 1;


      /* =====================================
         STATUS
      ===================================== */

      const status =
        String(
          project.status || ""
        ).toLowerCase();


      if (
        status.includes("completed")
      ) {

        grouped[state].completed += 1;

      }


      if (
        status.includes("ongoing") ||
        status.includes("progress") ||
        status.includes("active")
      ) {

        grouped[state].ongoing += 1;

      }


      if (
        status.includes("delayed")
      ) {

        grouped[state].delayed += 1;

      }

    });


    /* =====================================
       UTILIZATION
    ===================================== */

    return Object
      .values(grouped)

      .map((item) => ({

        ...item,

        utilization:
          item.allocated > 0
            ? (
                item.expenditure /
                item.allocated
              ) * 100
            : 0,

      }))

      .sort(
        (a, b) =>
          b.allocated -
          a.allocated
      );

  }, []);


  /* =========================================
     FILTER DATA
  ========================================= */

  const displayedData = useMemo(() => {

    let data =
      [...stateData];


    /* TOP 10 */

    if (
      viewMode === "top"
    ) {

      data = data.slice(
        0,
        10
      );

    }


    /* BOTTOM 10 */

    if (
      viewMode === "bottom"
    ) {

      data = data
        .slice(-10)
        .sort(
          (a, b) =>
            a.allocated -
            b.allocated
        );

    }


    /* SELECTED STATES */

    if (
      selectedStates.length > 0
    ) {

      data =
        data.filter((item) =>
          selectedStates.includes(
            item.state
          )
        );

    }


    return data;

  }, [
    stateData,
    viewMode,
    selectedStates,
  ]);


  /* =========================================
     TOTALS
  ========================================= */

  const totals = useMemo(() => {

    return displayedData.reduce(
      (accumulator, item) => {

        accumulator.allocated +=
          item.allocated;

        accumulator.expenditure +=
          item.expenditure;

        accumulator.projects +=
          item.projects;

        return accumulator;

      },

      {
        allocated: 0,
        expenditure: 0,
        projects: 0,
      }
    );

  }, [displayedData]);


  /* =========================================
     TOTAL UTILIZATION
  ========================================= */

  const totalUtilization =
    totals.allocated > 0
      ? (
          totals.expenditure /
          totals.allocated
        ) * 100
      : 0;


  /* =========================================
     TOGGLE STATE
  ========================================= */

  const toggleState = (state) => {

    setSelectedStates(
      (previous) => {

        if (
          previous.includes(state)
        ) {

          return previous.filter(
            (item) =>
              item !== state
          );

        }


        return [
          ...previous,
          state,
        ];

      }
    );

  };


  /* =========================================
     SELECT ALL
  ========================================= */

  const selectAllStates = () => {

    setSelectedStates(
      stateData.map(
        (item) =>
          item.state
      )
    );

  };


  /* =========================================
     CLEAR ALL
  ========================================= */

  const clearAllStates = () => {

    setSelectedStates([]);

  };


  /* =========================================
     RESET
  ========================================= */

  const resetAll = () => {

    setSelectedStates([]);

    setViewMode("all");

    setHoveredState(null);

  };


  /* =========================================
     COMPARE DATA
  ========================================= */

  const compareData =
    selectedStates.length >= 2
      ? stateData.filter((item) =>
          selectedStates.includes(
            item.state
          )
        )
      : [];


  /* =========================================
     CHART HEIGHT
  ========================================= */

  const chartHeight =
    displayedData.length <= 10
      ? 480
      : 560;

  // All table values come from the project-derived displayedData.
  const visibleTableData = showAllTableStates
    ? displayedData
    : displayedData.slice(0, 10);


  return (

    <section
      className="
        mt-10
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >


      {/* =====================================
          HEADER
      ===================================== */}

      <div
        className="
          border-b
          border-slate-100
          px-6
          py-6
          sm:px-8
        "
      >

        <div
          className="
            flex
            flex-col
            justify-between
            gap-5
            lg:flex-row
            lg:items-center
          "
        >

          {/* TITLE */}

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                "
              >

                <BarChart3
                  size={24}
                />

              </div>


              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  State-wise Allocation
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Compare allocation,
                  expenditure and fund
                  utilization across states.
                </p>

              </div>

            </div>

          </div>


          {/* SUMMARY */}

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:flex
            "
          >

            <div
              className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Total Allocation
              </p>

              <p
                className="
                  mt-1
                  font-bold
                  text-slate-800
                "
              >
                {formatAmount(
                  totals.allocated
                )}
              </p>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Utilization
              </p>

              <p
                className="
                  mt-1
                  font-bold
                  text-amber-600
                "
              >
                {totalUtilization.toFixed(1)}%
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          CONTROLS
      ===================================== */}

      <div
        className="
          border-b
          border-slate-100
          bg-slate-50/60
          px-6
          py-5
          sm:px-8
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >


          {/* SELECT STATES */}

          <button
            onClick={() =>
              setShowStates(
                !showStates
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-blue-200
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-blue-400
              hover:text-blue-600
              hover:shadow-md
            "
          >

            {showStates
              ? "Hide States"
              : "Select States"
            }

            {showStates ? (
              <ChevronUp size={17} />
            ) : (
              <ChevronDown size={17} />
            )}

          </button>


          {/* TOP 10 */}

          <button
            onClick={() => {

              setViewMode("top");

              setSelectedStates([]);

            }}
            className={`
              rounded-xl
              px-5
              py-3
              text-sm
              font-semibold
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              ${
                viewMode === "top"
                  ? `
                    bg-emerald-600
                    text-white
                    shadow-emerald-100
                  `
                  : `
                    border
                    border-emerald-200
                    bg-white
                    text-emerald-700
                    hover:border-emerald-400
                  `
              }
            `}
          >
            Top 10
          </button>


          {/* BOTTOM 10 */}

          <button
            onClick={() => {

              setViewMode("bottom");

              setSelectedStates([]);

            }}
            className={`
              rounded-xl
              px-5
              py-3
              text-sm
              font-semibold
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              ${
                viewMode === "bottom"
                  ? `
                    bg-amber-500
                    text-white
                  `
                  : `
                    border
                    border-amber-200
                    bg-white
                    text-amber-700
                    hover:border-amber-400
                  `
              }
            `}
          >
            Bottom 10
          </button>


          {/* ALL */}

          <button
            onClick={() => {

              setViewMode("all");

              setSelectedStates([]);

            }}
            className={`
              rounded-xl
              px-5
              py-3
              text-sm
              font-semibold
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              ${
                viewMode === "all" &&
                selectedStates.length === 0
                  ? `
                    bg-blue-600
                    text-white
                  `
                  : `
                    border
                    border-blue-200
                    bg-white
                    text-blue-700
                    hover:border-blue-400
                  `
              }
            `}
          >
            All States
          </button>


          {/* RESET */}

          <button
            onClick={resetAll}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-500
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-red-600
              hover:shadow-md
            "
          >

            <RotateCcw
              size={16}
            />

            Reset

          </button>


          {/* SELECTED COUNT */}

          {selectedStates.length > 0 && (

            <div
              className="
                ml-auto
                rounded-full
                bg-blue-100
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-700
              "
            >

              {selectedStates.length} state
              {selectedStates.length > 1
                ? "s"
                : ""
              } selected

            </div>

          )}

        </div>


        {/* ===================================
            STATE SELECTION
        ==================================== */}

        {showStates && (

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >


            {/* STATE ACTIONS */}

            <div
              className="
                mb-5
                flex
                flex-wrap
                items-center
                gap-3
              "
            >

              <button
                onClick={selectAllStates}
                className="
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Select All
              </button>


              <button
                onClick={clearAllStates}
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                Clear All
              </button>


              <p
                className="
                  ml-auto
                  text-xs
                  text-slate-500
                "
              >
                Select states to compare
              </p>

            </div>


            {/* STATE GRID */}

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
              "
            >

              {stateData.map((item) => {

                const isSelected =
                  selectedStates.includes(
                    item.state
                  );


                return (

                  <label
                    key={item.state}
                    className={`
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      px-4
                      py-3
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? `
                            border-blue-300
                            bg-blue-50
                            shadow-sm
                          `
                          : `
                            border-slate-100
                            bg-white
                            hover:border-slate-300
                            hover:bg-slate-50
                          `
                      }
                    `}
                  >

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        toggleState(
                          item.state
                        )
                      }
                      className="
                        h-4
                        w-4
                        cursor-pointer
                        accent-blue-600
                      "
                    />


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
                          font-semibold
                          text-slate-700
                        "
                      >
                        {item.state}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-slate-400
                        "
                      >
                        {item.projects} projects
                      </p>

                    </div>

                  </label>

                );

              })}

            </div>

          </div>

        )}

      </div>


      {/* =====================================
          COMPARISON PANEL
      ===================================== */}

      {compareData.length >= 2 && (

        <div
          className="
            border-b
            border-blue-100
            bg-gradient-to-r
            from-blue-50
            via-white
            to-emerald-50
            px-6
            py-6
            sm:px-8
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
              "
            >
              <TrendingUp
                size={20}
              />
            </div>


            <div>

              <h3
                className="
                  font-bold
                  text-slate-800
                "
              >
                State Comparison
              </h3>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Comparing selected states
              </p>

            </div>

          </div>


          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >

            {compareData.map(
              (item) => (

                <div
                  key={item.state}
                  className="
                    rounded-2xl
                    border
                    border-white
                    bg-white/90
                    p-5
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >

                  {/* STATE */}

                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <h4
                      className="
                        font-bold
                        text-slate-800
                      "
                    >
                      {item.state}
                    </h4>

                    <span
                      className="
                        rounded-full
                        bg-blue-50
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-blue-600
                      "
                    >
                      {item.projects} projects
                    </span>

                  </div>


                  {/* ALLOCATION */}

                  <div
                    className="
                      mb-3
                      flex
                      justify-between
                      text-sm
                    "
                  >

                    <span
                      className="
                        text-slate-500
                      "
                    >
                      Allocated
                    </span>

                    <strong
                      className="
                        text-slate-800
                      "
                    >
                      {formatAmount(
                        item.allocated
                      )}
                    </strong>

                  </div>


                  {/* EXPENDITURE */}

                  <div
                    className="
                      mb-4
                      flex
                      justify-between
                      text-sm
                    "
                  >

                    <span
                      className="
                        text-slate-500
                      "
                    >
                      Expenditure
                    </span>

                    <strong
                      className="
                        text-emerald-600
                      "
                    >
                      {formatAmount(
                        item.expenditure
                      )}
                    </strong>

                  </div>


                  {/* UTILIZATION */}

                  <div>

                    <div
                      className="
                        mb-2
                        flex
                        justify-between
                        text-xs
                      "
                    >

                      <span
                        className="
                          text-slate-500
                        "
                      >
                        Utilization
                      </span>

                      <strong
                        className="
                          text-amber-600
                        "
                      >
                        {item.utilization.toFixed(
                          1
                        )}%
                      </strong>

                    </div>


                    <div
                      className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                      "
                    >

                      <div
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-amber-400
                          to-amber-500
                          transition-all
                          duration-700
                        "
                        style={{
                          width: `${Math.min(
                            item.utilization,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =====================================
          CHART
      ===================================== */}

      <div
        className="
          px-3
          py-7
          sm:px-6
          lg:px-8
        "
      >


        {/* CHART TITLE */}

        <div
          className="
            mb-6
            text-center
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-slate-800
              sm:text-2xl
            "
          >
            State-wise Allocation vs Expenditure
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Hover over any state to explore
            project funds and utilization.
          </p>

        </div>


        {/* LEGEND */}

        <CustomLegend />


        {/* CHART */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-slate-100
            bg-gradient-to-b
            from-white
            to-slate-50/60
            p-3
            shadow-inner
            sm:p-5
          "
        >

          {displayedData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={chartHeight}
            >

              <ComposedChart
                data={displayedData}
                margin={{
                  top: 25,
                  right: 35,
                  left: 15,
                  bottom: 10,
                }}

                onMouseMove={(state) => {

                  if (
                    state &&
                    state.activeLabel
                  ) {

                    setHoveredState(
                      state.activeLabel
                    );

                  }

                }}

                onMouseLeave={() =>
                  setHoveredState(null)
                }
              >


                {/* GRID */}

                <CartesianGrid
                  stroke="#dbe3ef"
                  strokeDasharray="0"
                  vertical={false}
                />


                {/* X AXIS */}

                <XAxis
                  dataKey="state"
                  interval={0}
                  angle={
                    displayedData.length > 12
                      ? -45
                      : -25
                  }
                  textAnchor="end"
                  height={100}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                  axisLine={{
                    stroke: "#cbd5e1",
                  }}
                  tickLine={false}
                />


                {/* LEFT Y AXIS */}

                <YAxis
                  yAxisId="amount"
                  tickFormatter={
                    formatAxisAmount
                  }
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={85}
                  label={{
                    value: "Amount",
                    position: "top",
                    offset: 12,
                    style: {
                      fill: "#64748b",
                      fontSize: 13,
                    },
                  }}
                />


                {/* RIGHT Y AXIS */}

                <YAxis
                  yAxisId="utilization"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={65}
                  label={{
                    value: "Utilization %",
                    position: "top",
                    offset: 12,
                    style: {
                      fill: "#64748b",
                      fontSize: 13,
                    },
                  }}
                />


                {/* TOOLTIP */}

                <Tooltip
                  cursor={{
                    fill: "rgba(59, 130, 246, 0.06)",
                  }}
                  content={
                    <CustomTooltip />
                  }
                />


                {/* LEGEND */}

                <Legend
                  content={() => null}
                />


                {/* =================================
                    ALLOCATED BAR
                ================================= */}

                <Bar
                  yAxisId="amount"
                  dataKey="allocated"
                  name="Allocated Amount"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                  animationDuration={900}
                >

                  {displayedData.map(
                    (item) => {

                      const isHovered =
                        hoveredState ===
                        item.state;

                      const shouldFade =
                        hoveredState &&
                        !isHovered;


                      return (

                        <Cell
                          key={`allocated-${item.state}`}
                          fill="#4f68a1"
                          fillOpacity={
                            shouldFade
                              ? 0.28
                              : 1
                          }
                          style={{
                            transition:
                              "all 250ms ease",
                            filter:
                              isHovered
                                ? "drop-shadow(0 5px 7px rgba(79,104,161,0.35))"
                                : "none",
                          }}
                        />

                      );

                    }
                  )}

                </Bar>


                {/* =================================
                    EXPENDITURE BAR
                ================================= */}

                <Bar
                  yAxisId="amount"
                  dataKey="expenditure"
                  name="Expenditure"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                  animationDuration={1100}
                >

                  {displayedData.map(
                    (item) => {

                      const isHovered =
                        hoveredState ===
                        item.state;

                      const shouldFade =
                        hoveredState &&
                        !isHovered;


                      return (

                        <Cell
                          key={`expenditure-${item.state}`}
                          fill="#8bb879"
                          fillOpacity={
                            shouldFade
                              ? 0.28
                              : 1
                          }
                          style={{
                            transition:
                              "all 250ms ease",
                            filter:
                              isHovered
                                ? "drop-shadow(0 5px 7px rgba(100,160,80,0.35))"
                                : "none",
                          }}
                        />

                      );

                    }
                  )}

                </Bar>


                {/* =================================
                    UTILIZATION LINE
                ================================= */}

                <Line
                  yAxisId="utilization"
                  type="monotone"
                  dataKey="utilization"
                  name="Utilization %"
                  stroke="#e9b949"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#e9b949",
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#ffffff",
                    stroke: "#e9b949",
                    strokeWidth: 4,
                  }}
                  animationDuration={1200}
                />


                {/* =================================
                    STATE NAVIGATION BRUSH
                ================================= */}

                {displayedData.length > 10 && (

                  <Brush
                    dataKey="state"
                    height={45}
                    stroke="#9db4db"
                    fill="#edf3ff"
                    travellerWidth={10}
                  />

                )}

              </ComposedChart>

            </ResponsiveContainer>

          ) : (

            <div
              className="
                flex
                h-[400px]
                flex-col
                items-center
                justify-center
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
                  rounded-full
                  bg-slate-100
                  text-slate-400
                "
              >
                <Layers3
                  size={28}
                />
              </div>


              <h4
                className="
                  mt-5
                  font-bold
                  text-slate-700
                "
              >
                No states available
              </h4>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Try selecting different states.
              </p>

            </div>

          )}

        </div>


        {/* =====================================
            HOVER INFORMATION
        ===================================== */}

        <div
          className="
            mt-5
            flex
            flex-col
            justify-between
            gap-4
            rounded-2xl
            border
            border-slate-100
            bg-slate-50
            p-5
            sm:flex-row
            sm:items-center
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-amber-50
                text-amber-500
              "
            >
              <TrendingUp
                size={20}
              />
            </div>


            <div>

              <p
                className="
                  font-semibold
                  text-slate-700
                "
              >
                Interactive State Intelligence
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Hover on any bar or point
                to view allocation,
                expenditure and utilization.
              </p>

            </div>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-white
              px-4
              py-3
              text-sm
              shadow-sm
            "
          >

            <CheckCircle2
              size={17}
              className="
                text-emerald-500
              "
            />

            <span
              className="
                text-slate-500
              "
            >
              {displayedData.length} states shown
            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          STATE SUMMARY TABLE
      ===================================== */}

      <div
        className="
          border-t
          border-slate-100
          bg-slate-50/50
          px-6
          py-8
          sm:px-8
        "
      >

        <div
          className="
            mb-5
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
            "
          >
            <IndianRupee
              size={20}
            />
          </div>


          <div>

            <h3
              className="
                font-bold
                text-slate-800
              "
            >
              State Fund Summary
            </h3>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Calculated from available
              project records.
            </p>

          </div>

        </div>


        <div
          className="
            overflow-x-auto
            rounded-2xl
            border
            border-slate-200
            bg-white
          "
        >

          <table
            className="
              min-w-full
              text-left
            "
          >

            <thead>

              <tr
                className="
                  border-b
                  border-slate-200
                  bg-slate-50
                "
              >

                <th
                  className="
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-slate-600
                  "
                >
                  State
                </th>


                <th
                  className="
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-slate-600
                  "
                >
                  Projects
                </th>


                <th
                  className="
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-slate-600
                  "
                >
                  Allocated
                </th>


                <th
                  className="
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-slate-600
                  "
                >
                  Expenditure
                </th>


                <th
                  className="
                    px-5
                    py-4
                    text-sm
                    font-bold
                    text-slate-600
                  "
                >
                  Utilization
                </th>

              </tr>

            </thead>


            <tbody>

              {visibleTableData.map(
                (item) => (

                  <tr
                    key={item.state}
                    className="
                      border-b
                      border-slate-100
                      transition-all
                      duration-300
                      ease-out
                      hover:-translate-y-0.5
                      hover:bg-blue-50/50
                      hover:shadow-sm
                    "
                  >

                    <td
                      className="
                        px-5
                        py-4
                        font-semibold
                        text-slate-800
                      "
                    >
                      {item.state}
                    </td>


                    <td
                      className="
                        px-5
                        py-4
                        text-slate-600
                      "
                    >
                      {item.projects}
                    </td>


                    <td
                      className="
                        px-5
                        py-4
                        font-semibold
                        text-[#4f68a1]
                      "
                    >
                      {formatAmount(
                        item.allocated
                      )}
                    </td>


                    <td
                      className="
                        px-5
                        py-4
                        font-semibold
                        text-emerald-600
                      "
                    >
                      {formatAmount(
                        item.expenditure
                      )}
                    </td>


                    <td
                      className="
                        px-5
                        py-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            h-2
                            w-24
                            overflow-hidden
                            rounded-full
                            bg-slate-100
                          "
                        >

                          <div
                            className="
                              h-full
                              rounded-full
                              bg-amber-400
                            "
                            style={{
                              width: `${Math.min(
                                item.utilization,
                                100
                              )}%`,
                            }}
                          />

                        </div>


                        <span
                          className="
                            rounded-full
                            bg-amber-50
                            px-3
                            py-1
                            text-sm
                            font-semibold
                            text-amber-700
                          "
                        >
                          {item.utilization.toFixed(
                            1
                          )}%
                        </span>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {displayedData.length > 10 && (
            <div
              className="
                flex
                justify-center
                border-t
                border-slate-100
                bg-slate-50/50
                px-4
                py-5
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowAllTableStates((previous) => !previous)
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-slate-700
                  shadow-sm
                  transition-all
                  duration-300
                  ease-out
                  hover:-translate-y-0.5
                  hover:border-blue-300
                  hover:bg-blue-50
                  hover:text-blue-600
                  hover:shadow-md
                  active:scale-95
                "
              >
                {showAllTableStates
                  ? "Show Less"
                  : `Show More (${displayedData.length - 10} more states)`}

                {showAllTableStates ? (
                  <ChevronUp size={17} />
                ) : (
                  <ChevronDown size={17} />
                )}
              </button>
            </div>
          )}

        </div>

      </div>

    </section>

  );

}