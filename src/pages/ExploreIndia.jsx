import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  GeoJSON,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  Search,
  MapPin,
  AlertTriangle,
  Clock3,
  Building2,
  IndianRupee,
  Eye,
  X,
  RotateCcw,
  Layers,
  Navigation,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import "leaflet/dist/leaflet.css";

import { projects } from "../data/projects";
import { useNavigate } from "react-router-dom";


/* =========================================================
   INDIA MAP SETTINGS
========================================================= */

const INDIA_CENTER = [
  22.5937,
  78.9629,
];

const INDIA_ZOOM = 5;


/* =========================================================
   STATE NAME GETTER

   Different GeoJSON files use different property names.
========================================================= */

function getStateName(properties) {

  if (!properties) return "Unknown";

  return (
    properties.name ||
    properties.NAME_1 ||
    properties.ST_NM ||
    properties.state ||
    properties.State ||
    properties.STATE ||
    properties.st_nm ||
    "Unknown"
  );
}


/* =========================================================
   NORMALIZE STATE NAME

   Helps match GeoJSON names with projects data.
========================================================= */

function normalizeName(name) {

  if (!name) return "";

  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ");
}


/* =========================================================
   RISK COLOR
========================================================= */

function getRiskColor(score) {

  if (score >= 75) {
    return "#dc2626";
  }

  if (score >= 50) {
    return "#f59e0b";
  }

  return "#16a34a";
}


/* =========================================================
   RISK BACKGROUND
========================================================= */

function getRiskBackground(score) {

  if (score >= 75) {
    return "#fee2e2";
  }

  if (score >= 50) {
    return "#fef3c7";
  }

  return "#dcfce7";
}


/* =========================================================
   RISK LABEL
========================================================= */

function getRiskLabel(score) {

  if (score >= 75) {
    return "High";
  }

  if (score >= 50) {
    return "Medium";
  }

  return "Low";
}


/* =========================================================
   MAP CONTROLLER

   Automatically zooms when state selected.
========================================================= */

function MapController({
  selectedState,
  stateLayerRef,
  reset,
}) {

  const map = useMap();

  useEffect(() => {

    if (
      selectedState &&
      stateLayerRef.current
    ) {

      stateLayerRef.current.eachLayer(
        (layer) => {

          const stateName =
            getStateName(
              layer.feature?.properties
            );

          if (
            normalizeName(stateName) ===
            normalizeName(selectedState)
          ) {

            try {

              map.fitBounds(
                layer.getBounds(),
                {
                  padding: [50, 50],
                  maxZoom: 7,
                  animate: true,
                  duration: 1,
                }
              );

            } catch (error) {

              console.error(
                "Zoom error:",
                error
              );

            }

          }

        }
      );

    }

  }, [
    selectedState,
    map,
    stateLayerRef,
  ]);


  useEffect(() => {

    if (reset) {

      map.flyTo(
        INDIA_CENTER,
        INDIA_ZOOM,
        {
          duration: 1,
        }
      );

    }

  }, [
    reset,
    map,
  ]);


  return null;
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ExploreIndia() {

  const navigate = useNavigate();


  /* =====================================================
     STATES
  ===================================================== */

  const [
    indiaGeoData,
    setIndiaGeoData,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    geoError,
    setGeoError,
  ] = useState(null);


  const [
    selectedState,
    setSelectedState,
  ] = useState(null);


  const [
    hoveredState,
    setHoveredState,
  ] = useState(null);


  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    showProjects,
    setShowProjects,
  ] = useState(true);


  const [
    resetMap,
    setResetMap,
  ] = useState(false);


  const stateLayerRef = useRef(null);


  /* =====================================================
     LOAD GEOJSON

     IMPORTANT:
     Loads from public/geo/
  ===================================================== */

  useEffect(() => {

    async function loadGeoJSON() {

      try {

        setLoading(true);

        const response =
          await fetch(
            "/geo/indiaStates.geojson"
          );


        if (!response.ok) {

          throw new Error(
            `Failed to load map: ${response.status}`
          );

        }


        const data =
          await response.json();


        setIndiaGeoData(data);


      } catch (error) {

        console.error(
          "GeoJSON Error:",
          error
        );

        setGeoError(
          error.message
        );


      } finally {

        setLoading(false);

      }

    }


    loadGeoJSON();


  }, []);


  /* =====================================================
     STATE DATA FROM PROJECTS
  ===================================================== */

  const stateStats = useMemo(() => {

    const grouped = {};


    projects.forEach((project) => {

      const state =
        project.state ||
        "Unknown";


      if (!grouped[state]) {

        grouped[state] = {

          state,

          projects: 0,

          delayed: 0,

          highRisk: 0,

          totalRisk: 0,

          totalCost: 0,

          totalExpenditure: 0,

        };

      }


      grouped[state].projects += 1;


      if (
        project.status ===
        "Delayed"
      ) {

        grouped[state].delayed += 1;

      }


      if (
        project.riskLevel ===
        "High"
      ) {

        grouped[state].highRisk += 1;

      }


      grouped[state].totalRisk +=
        Number(
          project.riskScore || 0
        );


      grouped[state].totalCost +=
        Number(
          project.costValue || 0
        );


      const expenditure =
        Number(
          project.costValue || 0
        ) *
        (
          Number(
            project.expenditurePercent || 0
          ) / 100
        );


      grouped[state].totalExpenditure +=
        expenditure;

    });


    Object.keys(grouped).forEach(
      (state) => {

        const item =
          grouped[state];


        item.averageRisk =
          item.projects > 0
            ? Math.round(
                item.totalRisk /
                item.projects
              )
            : 0;


        item.utilization =
          item.totalCost > 0
            ? Math.round(
                (
                  item.totalExpenditure /
                  item.totalCost
                ) * 100
              )
            : 0;

      }
    );


    return grouped;


  }, []);


  /* =====================================================
     NATIONAL STATS
  ===================================================== */

  const nationalStats = useMemo(() => {

    const totalProjects =
      projects.length;


    const delayed =
      projects.filter(
        (project) =>
          project.status ===
          "Delayed"
      ).length;


    const highRisk =
      projects.filter(
        (project) =>
          project.riskLevel ===
          "High"
      ).length;


    const totalRisk =
      projects.reduce(
        (sum, project) =>
          sum +
          Number(
            project.riskScore || 0
          ),
        0
      );


    const averageRisk =
      totalProjects > 0
        ? Math.round(
            totalRisk /
            totalProjects
          )
        : 0;


    return {

      totalProjects,

      delayed,

      highRisk,

      averageRisk,

      states:
        Object.keys(
          stateStats
        ).length,

    };


  }, [
    stateStats,
  ]);


  /* =====================================================
     SELECTED STATE PROJECTS
  ===================================================== */

  const selectedStateProjects =
    useMemo(() => {

      if (!selectedState) {

        return [];

      }


      return projects.filter(
        (project) =>

          normalizeName(
            project.state
          ) ===
          normalizeName(
            selectedState
          )

      );


    }, [
      selectedState,
    ]);


  /* =====================================================
     SEARCHED PROJECTS
  ===================================================== */

  const searchedProjects =
    useMemo(() => {

      if (!search.trim()) {

        return selectedStateProjects;

      }


      const searchValue =
        search.toLowerCase();


      return selectedStateProjects.filter(
        (project) =>

          project.name
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||

          project.district
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||

          project.location
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||

          project.id
            ?.toLowerCase()
            .includes(
              searchValue
            )

      );


    }, [
      selectedStateProjects,
      search,
    ]);


  /* =====================================================
     STATE CLICK
  ===================================================== */

  function handleStateClick(
    stateName
  ) {

    setSelectedState(
      stateName
    );


    setSelectedProject(
      null
    );


    setResetMap(
      false
    );

  }


  /* =====================================================
     RESET MAP
  ===================================================== */

  function handleReset() {

    setSelectedState(
      null
    );

    setHoveredState(
      null
    );

    setSelectedProject(
      null
    );

    setSearch(
      ""
    );

    setResetMap(
      true
    );


    setTimeout(() => {

      setResetMap(
        false
      );

    }, 100);

  }


  /* =====================================================
     GEOJSON STYLE
  ===================================================== */

  function stateStyle(
    feature
  ) {

    const stateName =
      getStateName(
        feature.properties
      );


    const stateData =
      Object.entries(
        stateStats
      ).find(
        ([state]) =>

          normalizeName(
            state
          ) ===
          normalizeName(
            stateName
          )
      )?.[1];


    const riskScore =
      stateData?.averageRisk || 0;


    const isSelected =
      selectedState &&
      normalizeName(
        selectedState
      ) ===
      normalizeName(
        stateName
      );


    const isHovered =
      hoveredState &&
      normalizeName(
        hoveredState
      ) ===
      normalizeName(
        stateName
      );


    let fillColor =
      "#e2e8f0";


    if (stateData) {

      fillColor =
        getRiskColor(
          riskScore
        );

    }


    return {

      fillColor,

      fillOpacity:
        isSelected
          ? 0.85
          : isHovered
          ? 0.75
          : 0.5,

      color:
        isSelected
          ? "#0f172a"
          : "#ffffff",

      weight:
        isSelected
          ? 2.5
          : isHovered
          ? 2
          : 1,

      opacity: 1,

    };

  }


  /* =====================================================
     GEOJSON EVENTS
  ===================================================== */

  function onEachState(
    feature,
    layer
  ) {

    const stateName =
      getStateName(
        feature.properties
      );


    layer.on({

      mouseover: () => {

        setHoveredState(
          stateName
        );

      },


      mouseout: () => {

        setHoveredState(
          null
        );

      },


      click: () => {

        handleStateClick(
          stateName
        );

      },

    });


  }


  /* =====================================================
     HOVER STATE DATA
  ===================================================== */

  const hoveredStateData =
    useMemo(() => {

      if (!hoveredState) {

        return null;

      }


      const matchedKey =
        Object.keys(
          stateStats
        ).find(
          (state) =>

            normalizeName(
              state
            ) ===
            normalizeName(
              hoveredState
            )
        );


      return matchedKey
        ? stateStats[
            matchedKey
          ]
        : null;


    }, [
      hoveredState,
      stateStats,
    ]);


  /* =====================================================
     SELECTED STATE DATA
  ===================================================== */

  const selectedStateData =
    useMemo(() => {

      if (!selectedState) {

        return null;

      }


      const matchedKey =
        Object.keys(
          stateStats
        ).find(
          (state) =>

            normalizeName(
              state
            ) ===
            normalizeName(
              selectedState
            )
        );


      return matchedKey
        ? stateStats[
            matchedKey
          ]
        : null;


    }, [
      selectedState,
      stateStats,
    ]);


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">


      {/* ===============================================
          BACKGROUND
      =============================================== */}

      <div className="fixed inset-0 pointer-events-none opacity-[0.35]">

        <div
          className="
            absolute
            inset-0

            [background-image:linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)]

            [background-size:48px_48px]
          "
        />

      </div>


      {/* ===============================================
          PAGE
      =============================================== */}

      <main
        className="
          relative
          z-10

          mx-auto
          max-w-[1450px]

          px-5
          pb-10

          pt-6
          lg:px-6
        "
      >


        {/* =============================================
            HEADER
        ============================================= */}

        <motion.div

          initial={{
            opacity: 0,
            y: 15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.45,
          }}

          className="
            mb-6

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
                mb-3

                flex
                items-center
                gap-2

                text-xs
                font-bold

                tracking-[0.16em]

                text-orange-500
              "
            >

              <span className="h-[2px] w-8 bg-orange-500" />

              GEOSPATIAL INTELLIGENCE

            </div>


            <h1
              className="
                text-3xl
                font-bold

                tracking-tight

                text-slate-800

                md:text-4xl
              "
            >

              Explore India

            </h1>


            <p
              className="
                mt-2

                max-w-[700px]

                text-sm
                leading-6

                text-slate-500
              "
            >

              Explore MPLADS projects across India.
              Hover over a state to analyse risk indicators
              and click to drill down into project intelligence.

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

              onClick={() =>
                setShowProjects(
                  !showProjects
                )
              }

              className="
                flex
                items-center
                gap-2

                rounded-xl

                border
                border-slate-200

                bg-white

                px-4
                py-2.5

                text-sm
                font-semibold

                text-slate-600

                shadow-sm

                transition

                hover:-translate-y-0.5
                hover:border-orange-200
                hover:text-orange-500
                hover:shadow-md
              "
            >

              <Layers size={17} />

              {showProjects
                ? "Hide Projects"
                : "Show Projects"}

            </button>


            <button

              onClick={
                handleReset
              }

              className="
                flex
                items-center
                gap-2

                rounded-xl

                bg-slate-800

                px-4
                py-2.5

                text-sm
                font-semibold

                text-white

                shadow-lg

                transition

                hover:-translate-y-0.5
                hover:bg-slate-700
              "
            >

              <RotateCcw size={17} />

              Reset Map

            </button>

          </div>

        </motion.div>


        {/* =============================================
            NATIONAL STATS
        ============================================= */}

        <div
          className="
            mb-6

            grid

            grid-cols-2
            gap-4

            lg:grid-cols-5
          "
        >

          <StatCard
            label="Projects"
            value={
              nationalStats.totalProjects
            }
            icon={Building2}
            color="text-blue-600"
          />


          <StatCard
            label="States Covered"
            value={
              nationalStats.states
            }
            icon={MapPin}
            color="text-purple-600"
          />


          <StatCard
            label="Delayed"
            value={
              nationalStats.delayed
            }
            icon={Clock3}
            color="text-orange-600"
          />


          <StatCard
            label="High Risk"
            value={
              nationalStats.highRisk
            }
            icon={AlertTriangle}
            color="text-red-600"
          />


          <StatCard
            label="Avg. Risk Score"
            value={
              nationalStats.averageRisk
            }
            icon={Navigation}
            color="text-green-600"
          />

        </div>


        {/* =============================================
            MAIN GRID
        ============================================= */}

        <div
          className="
            grid

            gap-6

            xl:grid-cols-[1fr_370px]
          "
        >


          {/* ===========================================
              MAP
          =========================================== */}

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
              delay: 0.1,
            }}

            className="
              relative

              min-h-[650px]

              overflow-hidden

              rounded-[28px]

              border
              border-slate-200

              bg-white

              shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            "
          >
            {/* ===============================
    EXPLORE MAP BUTTON
================================ */}

<div 
  className="
    absolute 
    inset-0 
    z-[500] 
    flex 
    items-center 
    justify-center 
    pointer-events-none 
  " 
> 

  <button 
    onClick={() => window.location.href = "http://localhost:5174"} 
    className="
      w-[400px] 
      group 
      pointer-events-auto 
      relative 
      flex 
      items-center 
      justify-center
      overflow-hidden 
      rounded-2xl 
      border 
      border-orange-300/60 
      bg-gradient-to-br 
      from-orange-400 
      via-orange-500 
      to-orange-600 
      px-8 
      py-6
      text-sm 
      font-bold 
      tracking-wide 
      text-white 
      shadow-[0_12px_35px_rgba(249,115,22,0.45)] 
      transition-all 
      duration-500 
      hover:-translate-y-1 
      hover:scale-105 
      hover:shadow-[0_20px_45px_rgba(249,115,22,0.6)] 
      active:scale-95 
    " 
  > 

    {/* Gloss Shine */} 

    <span 
      className="
        absolute 
        inset-0 
        -translate-x-full 
        bg-gradient-to-r 
        from-transparent 
        via-white/40 
        to-transparent 
        transition-transform 
        duration-700 
        group-hover:translate-x-full 
      " 
    /> 


    {/* Center Text */}

    <span 
      className="
        absolute
        left-1/2
        z-10 
        -translate-x-1/2
        whitespace-nowrap
      "
    > 
      Explore Map 
    </span> 


    {/* Arrow Right */}

    <span 
      className="
        absolute
        right-5
        z-10 
        flex 
        h-7 
        w-7 
        items-center 
        justify-center 
        rounded-full 
        bg-white/20 
        transition-all 
        duration-300 
        group-hover:translate-x-1 
        group-hover:bg-white/30 
      " 
    > 
      →
    </span> 

  </button> 

</div>


            {/* MAP TOP BAR */}

            <div
              className="
                absolute

                left-5
                right-5
                top-5

                z-[500]

                flex
                flex-col

                justify-between
                gap-4

                lg:flex-row
                lg:items-center
              "
            >


              <div
                className="
                  inline-flex
                  items-center
                  gap-3

                  self-start

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white/95

                  px-4
                  py-3

                  shadow-lg
                  backdrop-blur-xl
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

                    bg-orange-50

                    text-orange-500
                  "
                >

                  <MapPin size={19} />

                </div>


                <div>

                  <p
                    className="
                      text-[10px]

                      font-bold

                      tracking-[0.15em]

                      text-slate-400
                    "
                  >

                    CURRENT VIEW

                  </p>


                  <p
                    className="
                      mt-0.5

                      font-bold

                      text-slate-700
                    "
                  >

                    {selectedState ||
                      "India Overview"}

                  </p>

                </div>

              </div>


              {/* SEARCH */}

              {selectedState && (

                <div
                  className="
                    relative

                    w-full

                    lg:w-[320px]
                  "
                >

                  <Search
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2

                      -translate-y-1/2

                      text-slate-400
                    "
                  />


                  <input

                    value={search}

                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }

                    placeholder="Search projects..."

                    className="
                      w-full

                      rounded-xl

                      border
                      border-slate-200

                      bg-white/95

                      py-3
                      pl-11
                      pr-10

                      text-sm

                      outline-none

                      shadow-lg

                      transition

                      placeholder:text-slate-400

                      focus:border-orange-300
                      focus:ring-4
                      focus:ring-orange-100
                    "
                  />


                  {search && (

                    <button

                      onClick={() =>
                        setSearch("")
                      }

                      className="
                        absolute

                        right-3
                        top-1/2

                        -translate-y-1/2

                        text-slate-400

                        hover:text-slate-700
                      "
                    >

                      <X size={17} />

                    </button>

                  )}

                </div>

              )}

            </div>


            {/* LOADING */}

            {loading && (

              <div
                className="
                  absolute
                  inset-0

                  z-[600]

                  flex
                  flex-col

                  items-center
                  justify-center

                  bg-white
                "
              >

                <div
                  className="
                    h-12
                    w-12

                    animate-spin

                    rounded-full

                    border-4
                    border-slate-200

                    border-t-orange-500
                  "
                />


                <p
                  className="
                    mt-5

                    text-sm

                    font-semibold

                    text-slate-500
                  "
                >

                  Loading India Map...

                </p>

              </div>

            )}


            {/* ERROR */}

            {geoError && (

              <div
                className="
                  absolute
                  inset-0

                  z-[600]

                  flex
                  flex-col

                  items-center
                  justify-center

                  bg-white

                  px-6

                  text-center
                "
              >

                <AlertTriangle
                  size={42}
                  className="text-red-500"
                />


                <h3
                  className="
                    mt-4

                    text-xl
                    font-bold
                  "
                >

                  Map could not load

                </h3>


                <p
                  className="
                    mt-2

                    text-sm

                    text-slate-500
                  "
                >

                  Make sure your file exists at:

                </p>


                <code
                  className="
                    mt-3

                    rounded-lg

                    bg-slate-100

                    px-4
                    py-2

                    text-sm
                  "
                >

                  public/geo/indiaStates.geojson

                </code>

              </div>

            )}


            {/* MAP */}

            {!loading &&
              !geoError && (

<MapContainer
  center={[22.5937, 78.9629]}
  zoom={5}
  minZoom={4}
  maxZoom={10}
  maxBounds={[
    [5, 67],
    [38.5, 99]
  ]}
  maxBoundsViscosity={1}
  attributionControl={false}
  className="h-full w-full"
  style={{
    background: "#f5f7fb",
  }}
>
    




                {/* MAP CONTROLLER */}

                <MapController

                  selectedState={
                    selectedState
                  }

                  stateLayerRef={
                    stateLayerRef
                  }

                  reset={
                    resetMap
                  }

                />


                {/* GEOJSON */}

                {indiaGeoData && (

                  <GeoJSON

                    ref={
                      stateLayerRef
                    }

                    data={
                      indiaGeoData
                    }

                    style={
                      stateStyle
                    }

                    onEachFeature={
                      onEachState
                    }

                  />

                )}


                {/* PROJECT MARKERS */}

                {showProjects &&
                  selectedState &&
                  searchedProjects.map(
                    (project) => {

                      if (
                        !project.latitude ||
                        !project.longitude
                      ) {

                        return null;

                      }


                      const color =
                        getRiskColor(
                          Number(
                            project.riskScore || 0
                          )
                        );


                      return (

                        <CircleMarker

                          key={
                            project.id
                          }

                          center={[
                            project.latitude,
                            project.longitude,
                          ]}

                          radius={
                            selectedProject?.id ===
                            project.id
                              ? 11
                              : 7
                          }

                          pathOptions={{
                            fillColor:
                              color,

                            color:
                              "#ffffff",

                            weight: 2,

                            fillOpacity:
                              0.95,
                          }}

                          eventHandlers={{
                            click: () =>
                              setSelectedProject(
                                project
                              ),
                          }}

                        >

                          <Popup>

                            <div
                              className="
                                min-w-[230px]

                                p-1
                              "
                            >

                              <p
                                className="
                                  text-xs

                                  font-bold

                                  text-orange-500
                                "
                              >

                                {project.id}

                              </p>


                              <h3
                                className="
                                  mt-2

                                  text-sm

                                  font-bold

                                  text-slate-800
                                "
                              >

                                {project.name}

                              </h3>


                              <p
                                className="
                                  mt-2

                                  text-xs

                                  text-slate-500
                                "
                              >

                                {project.district},{" "}

                                {project.state}

                              </p>


                              <div
                                className="
                                  mt-3

                                  flex

                                  items-center
                                  justify-between
                                "
                              >

                                <span
                                  className="
                                    text-xs

                                    text-slate-500
                                  "
                                >

                                  Risk Score

                                </span>


                                <span
                                  className="
                                    rounded-full

                                    px-2
                                    py-1

                                    text-xs

                                    font-bold
                                  "

                                  style={{
                                    backgroundColor:
                                      getRiskBackground(
                                        project.riskScore
                                      ),

                                    color:
                                      getRiskColor(
                                        project.riskScore
                                      ),
                                  }}
                                >

                                  {project.riskScore}

                                </span>

                              </div>


                              <button

                                onClick={() =>
                                  setSelectedProject(
                                    project
                                  )
                                }

                                className="
                                  mt-4

                                  w-full

                                  rounded-lg

                                  bg-slate-800

                                  px-3
                                  py-2

                                  text-xs

                                  font-bold

                                  text-white

                                  hover:bg-slate-700
                                "
                              >

                                View Intelligence

                              </button>

                            </div>

                          </Popup>

                        </CircleMarker>

                      );

                    }
                  )}

              </MapContainer>

            )}


            {/* MAP LEGEND */}

            <div
              className="
                absolute

                bottom-5
                left-5

                z-[500]

                rounded-2xl

                border
                border-slate-200

                bg-white/95

                p-4

                shadow-xl
                backdrop-blur-xl
              "
            >

              <p
                className="
                  mb-3

                  text-[10px]

                  font-bold

                  tracking-[0.14em]

                  text-slate-400
                "
              >

                AI RISK LEVEL

              </p>


              <div
                className="
                  space-y-2

                  text-xs

                  font-medium
                "
              >

                <LegendItem
                  color="#16a34a"
                  label="Low Risk"
                />

                <LegendItem
                  color="#f59e0b"
                  label="Medium Risk"
                />

                <LegendItem
                  color="#dc2626"
                  label="High Risk"
                />

              </div>

            </div>


          </motion.div>


          {/* ===========================================
              RIGHT PANEL
          =========================================== */}

          <div
            className="
              space-y-6
            "
          >


            {/* =========================================
                HOVER STATE PANEL
            ========================================= */}

            <AnimatePresence
              mode="wait"
            >

              {hoveredState &&
                hoveredStateData ? (

                <motion.div

                  key={
                    hoveredState
                  }

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
                    y: -10,
                  }}

                  className="
                    overflow-hidden

                    rounded-[24px]

                    border
                    border-orange-100

                    bg-white

                    shadow-[0_20px_50px_rgba(15,23,42,0.08)]
                  "
                >

                  <div
                    className="
                      bg-gradient-to-r

                      from-orange-500
                      to-orange-400

                      p-6

                      text-white
                    "
                  >

                    <p
                      className="
                        text-xs

                        font-bold

                        tracking-[0.14em]

                        text-white/70
                      "
                    >

                      STATE INTELLIGENCE

                    </p>


                    <h2
                      className="
                        mt-2

                        text-2xl

                        font-bold
                      "
                    >

                      {hoveredState}

                    </h2>


                    <p
                      className="
                        mt-2

                        text-sm

                        text-white/80
                      "
                    >

                      Hover analysis

                    </p>

                  </div>


                  <div
                    className="
                      grid

                      grid-cols-2

                      gap-3

                      p-5
                    "
                  >

                    <MiniMetric
                      label="Risk Score"
                      value={
                        hoveredStateData.averageRisk
                      }
                      color={
                        getRiskColor(
                          hoveredStateData.averageRisk
                        )
                      }
                    />


                    <MiniMetric
                      label="Projects"
                      value={
                        hoveredStateData.projects
                      }
                    />


                    <MiniMetric
                      label="Delayed"
                      value={
                        hoveredStateData.delayed
                      }
                      color="#f97316"
                    />


                    <MiniMetric
                      label="High Risk"
                      value={
                        hoveredStateData.highRisk
                      }
                      color="#dc2626"
                    />

                  </div>


                  <div
                    className="
                      px-5
                      pb-5
                    "
                  >

                    <button

                      onClick={() =>
                        handleStateClick(
                          hoveredState
                        )
                      }

                      className="
                        flex

                        w-full

                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        bg-slate-800

                        px-4
                        py-3

                        text-sm

                        font-bold

                        text-white

                        transition

                        hover:bg-slate-700
                      "
                    >

                      Explore State

                      <Eye size={17} />

                    </button>

                  </div>

                </motion.div>

              ) : (

                <div
                  className="
                    rounded-[24px]

                    border
                    border-slate-200

                    bg-white

                    p-7

                    shadow-[0_20px_50px_rgba(15,23,42,0.06)]
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

                      bg-orange-50

                      text-orange-500
                    "
                  >

                    <Navigation size={22} />

                  </div>


                  <h3
                    className="
                      mt-5

                      text-lg

                      font-bold
                    "
                  >

                    Explore State Intelligence

                  </h3>


                  <p
                    className="
                      mt-2

                      text-sm
                      leading-6

                      text-slate-500
                    "
                  >

                    Hover over any state on the map
                    to see its risk score, delayed
                    projects and high risk indicators.

                  </p>

                </div>

              )}

            </AnimatePresence>


            {/* =========================================
                SELECTED STATE
            ========================================= */}

            {selectedState &&
              selectedStateData && (

              <motion.div

                initial={{
                  opacity: 0,
                  y: 15,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                className="
                  rounded-[24px]

                  border
                  border-slate-200

                  bg-white

                  p-6

                  shadow-[0_20px_50px_rgba(15,23,42,0.06)]
                "
              >

                <div
                  className="
                    flex

                    items-start
                    justify-between

                    gap-4
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs

                        font-bold

                        tracking-[0.14em]

                        text-orange-500
                      "
                    >

                      SELECTED STATE

                    </p>


                    <h2
                      className="
                        mt-2

                        text-xl

                        font-bold

                        text-slate-800
                      "
                    >

                      {selectedState}

                    </h2>

                  </div>


                  <button

                    onClick={() =>
                      setSelectedState(
                        null
                      )
                    }

                    className="
                      flex

                      h-9
                      w-9

                      items-center
                      justify-center

                      rounded-xl

                      bg-slate-100

                      text-slate-500

                      transition

                      hover:bg-red-50
                      hover:text-red-500
                    "
                  >

                    <X size={18} />

                  </button>

                </div>


                {/* RISK SCORE */}

                <div
                  className="
                    mt-6

                    rounded-2xl

                    border
                    border-slate-100

                    bg-slate-50

                    p-5
                  "
                >

                  <div
                    className="
                      flex

                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-xs

                          font-medium

                          text-slate-500
                        "
                      >

                        Average Risk Score

                      </p>


                      <p
                        className="
                          mt-2

                          text-3xl

                          font-bold
                        "

                        style={{
                          color:
                            getRiskColor(
                              selectedStateData.averageRisk
                            ),
                        }}
                      >

                        {
                          selectedStateData.averageRisk
                        }

                      </p>

                    </div>


                    <div
                      className="
                        flex

                        h-14
                        w-14

                        items-center
                        justify-center

                        rounded-2xl
                      "

                      style={{
                        backgroundColor:
                          getRiskBackground(
                            selectedStateData.averageRisk
                          ),

                        color:
                          getRiskColor(
                            selectedStateData.averageRisk
                          ),
                      }}
                    >

                      <AlertTriangle
                        size={25}
                      />

                    </div>

                  </div>


                  <div
                    className="
                      mt-4

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
                        width: `${selectedStateData.averageRisk}%`,
                      }}

                      transition={{
                        duration: 0.8,
                      }}

                      className="
                        h-full

                        rounded-full
                      "

                      style={{
                        backgroundColor:
                          getRiskColor(
                            selectedStateData.averageRisk
                          ),
                      }}
                    />

                  </div>

                </div>


                {/* METRICS */}

                <div
                  className="
                    mt-5

                    grid

                    grid-cols-2

                    gap-3
                  "
                >

                  <InfoBox
                    icon={Building2}
                    label="Projects"
                    value={
                      selectedStateData.projects
                    }
                  />


                  <InfoBox
                    icon={Clock3}
                    label="Delayed"
                    value={
                      selectedStateData.delayed
                    }
                    iconColor="text-orange-500"
                  />


                  <InfoBox
                    icon={AlertTriangle}
                    label="High Risk"
                    value={
                      selectedStateData.highRisk
                    }
                    iconColor="text-red-500"
                  />


                  <InfoBox
                    icon={IndianRupee}
                    label="Utilization"
                    value={`${selectedStateData.utilization}%`}
                    iconColor="text-green-500"
                  />

                </div>

              </motion.div>

            )}


            {/* =========================================
                PROJECT LIST
            ========================================= */}

            {selectedState && (

              <div
                className="
                  overflow-hidden

                  rounded-[24px]

                  border
                  border-slate-200

                  bg-white

                  shadow-[0_20px_50px_rgba(15,23,42,0.06)]
                "
              >

                <div
                  className="
                    border-b
                    border-slate-100

                    p-6
                  "
                >

                  <div
                    className="
                      flex

                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <h3
                        className="
                          font-bold

                          text-slate-800
                        "
                      >

                        Projects

                      </h3>


                      <p
                        className="
                          mt-1

                          text-xs

                          text-slate-500
                        "
                      >

                        {
                          searchedProjects.length
                        } projects found

                      </p>

                    </div>


                    <span
                      className="
                        rounded-full

                        bg-orange-50

                        px-3
                        py-1

                        text-xs

                        font-bold

                        text-orange-600
                      "
                    >

                      Live

                    </span>

                  </div>

                </div>


                <div
                  className="
                    max-h-[430px]

                    space-y-2

                    overflow-y-auto

                    p-3
                  "
                >

                  {searchedProjects.length >
                  0 ? (

                    searchedProjects.map(
                      (project) => (

                        <button

                          key={
                            project.id
                          }

                          onClick={() =>
                            setSelectedProject(
                              project
                            )
                          }

                          className={`
                            w-full

                            rounded-xl

                            border

                            p-4

                            text-left

                            transition

                            hover:-translate-y-0.5
                            hover:shadow-md

                            ${
                              selectedProject?.id ===
                              project.id
                                ? "border-orange-300 bg-orange-50"
                                : "border-slate-100 bg-white hover:border-slate-200"
                            }
                          `}
                        >

                          <div
                            className="
                              flex

                              items-start
                              justify-between

                              gap-3
                            "
                          >

                            <div
                              className="
                                min-w-0
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

                                  text-slate-500
                                "
                              >

                                {
                                  project.district
                                }

                              </p>

                            </div>


                            <span
                              className="
                                shrink-0

                                rounded-lg

                                px-2
                                py-1

                                text-xs

                                font-bold
                              "

                              style={{
                                backgroundColor:
                                  getRiskBackground(
                                    project.riskScore
                                  ),

                                color:
                                  getRiskColor(
                                    project.riskScore
                                  ),
                              }}
                            >

                              {
                                project.riskScore
                              }

                            </span>

                          </div>

                        </button>

                      )
                    )

                  ) : (

                    <div
                      className="
                        py-10

                        text-center

                        text-sm

                        text-slate-400
                      "
                    >

                      No projects found.

                    </div>

                  )}

                </div>

              </div>

            )}


          </div>

        </div>


        {/* =============================================
            PROJECT DETAILS MODAL
        ============================================= */}

        <AnimatePresence>

          {selectedProject && (

            <ProjectModal

              project={
                selectedProject
              }

              onClose={() =>
                setSelectedProject(
                  null
                )
              }

            />

          )}

        </AnimatePresence>


      </main>

    </div>

  );

}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}) {

  return (

    <motion.div

      whileHover={{
        y: -4,
        scale: 1.02,
      }}

      className="
        rounded-2xl

        border
        border-slate-200

        bg-white

        p-5

        shadow-sm

        transition
      "
    >

      <div
        className="
          flex

          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-xs

              font-medium

              text-slate-500
            "
          >

            {label}

          </p>


          <p
            className="
              mt-2

              text-2xl

              font-bold

              text-slate-800
            "
          >

            {value}

          </p>

        </div>


        <div
          className={`
            flex

            h-11
            w-11

            items-center
            justify-center

            rounded-xl

            bg-slate-50

            ${color}
          `}
        >

          <Icon size={21} />

        </div>

      </div>

    </motion.div>

  );

}


/* =========================================================
   LEGEND ITEM
========================================================= */

function LegendItem({
  color,
  label,
}) {

  return (

    <div
      className="
        flex

        items-center

        gap-2
      "
    >

      <span
        className="
          h-3
          w-3

          rounded-full
        "

        style={{
          backgroundColor:
            color,
        }}
      />

      <span
        className="
          text-slate-600
        "
      >

        {label}

      </span>

    </div>

  );

}


/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({
  label,
  value,
  color,
}) {

  return (

    <div
      className="
        rounded-xl

        border
        border-slate-100

        bg-slate-50

        p-4
      "
    >

      <p
        className="
          text-[11px]

          text-slate-500
        "
      >

        {label}

      </p>


      <p
        className="
          mt-2

          text-xl

          font-bold
        "

        style={{
          color:
            color ||
            "#1e293b",
        }}
      >

        {value}

      </p>

    </div>

  );

}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  icon: Icon,
  label,
  value,
  iconColor = "text-slate-600",
}) {

  return (

    <div
      className="
        rounded-xl

        border
        border-slate-100

        bg-slate-50

        p-4
      "
    >

      <Icon
        size={18}
        className={iconColor}
      />


      <p
        className="
          mt-3

          text-xs

          text-slate-500
        "
      >

        {label}

      </p>


      <p
        className="
          mt-1

          text-lg

          font-bold

          text-slate-800
        "
      >

        {value}

      </p>

    </div>

  );

}


/* =========================================================
   PROJECT MODAL
========================================================= */

function ProjectModal({
  project,
  onClose,
}) {

  const riskColor =
    getRiskColor(
      project.riskScore
    );


  return (

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

        z-[9999]

        flex

        items-center
        justify-center

        bg-slate-950/40

        p-4

        backdrop-blur-sm
      "

      onClick={
        onClose
      }
    >

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}

        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}

        exit={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}

        transition={{
          type: "spring",
          damping: 24,
        }}

        onClick={(event) =>
          event.stopPropagation()
        }

        className="
          w-full

          max-w-[650px]

          overflow-hidden

          rounded-[28px]

          bg-white

          shadow-2xl
        "
      >


        {/* HEADER */}

        <div
          className="
            flex

            items-start
            justify-between

            gap-5

            border-b
            border-slate-100

            p-6
          "
        >

          <div>

            <p
              className="
                text-xs

                font-bold

                text-orange-500
              "
            >

              {project.id}

            </p>


            <h2
              className="
                mt-2

                text-xl

                font-bold

                text-slate-800
              "
            >

              {project.name}

            </h2>

          </div>


          <button

            onClick={
              onClose
            }

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

              hover:bg-red-50
              hover:text-red-500
            "
          >

            <X size={20} />

          </button>

        </div>


        {/* CONTENT */}

        <div
          className="
            max-h-[70vh]

            overflow-y-auto

            p-6
          "
        >

          <p
            className="
              text-sm
              leading-7

              text-slate-500
            "
          >

            {
              project.workDescription
            }

          </p>


          {/* RISK */}

          <div
            className="
              mt-6

              flex

              items-center
              justify-between

              rounded-2xl

              p-5
            "

            style={{
              backgroundColor:
                getRiskBackground(
                  project.riskScore
                ),
            }}
          >

            <div>

              <p
                className="
                  text-xs

                  font-semibold

                  text-slate-500
                "
              >

                AI RISK SCORE

              </p>


              <p
                className="
                  mt-2

                  text-3xl

                  font-bold
                "

                style={{
                  color:
                    riskColor,
                }}
              >

                {
                  project.riskScore
                }

              </p>

            </div>


            <span
              className="
                rounded-full

                bg-white/70

                px-4
                py-2

                text-sm

                font-bold
              "

              style={{
                color:
                  riskColor,
              }}
            >

              {
                getRiskLabel(
                  project.riskScore
                )
              } Risk

            </span>

          </div>


          {/* DETAILS */}

          <div
            className="
              mt-6

              grid

              gap-4

              sm:grid-cols-2
            "
          >

            <Detail
              label="State"
              value={project.state}
            />

            <Detail
              label="District"
              value={project.district}
            />

            <Detail
              label="Location"
              value={project.location}
            />

            <Detail
              label="Category"
              value={project.category}
            />

            <Detail
              label="Project Cost"
              value={project.cost}
            />

            <Detail
              label="Expenditure"
              value={project.expenditure}
            />

            <Detail
              label="Physical Progress"
              value={`${project.physicalProgress}%`}
            />

            <Detail
              label="Status"
              value={project.status}
            />

            <Detail
              label="MP"
              value={project.mpName}
            />

            <Detail
              label="Agency"
              value={
                project.implementingAgency
              }
            />

          </div>

        </div>

      </motion.div>

    </motion.div>

  );

}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}) {

  return (

    <div
      className="
        rounded-xl

        border
        border-slate-100

        bg-slate-50

        p-4
      "
    >

      <p
        className="
          text-[11px]

          font-bold

          uppercase

          tracking-wide

          text-slate-400
        "
      >

        {label}

      </p>


      <p
        className="
          mt-2

          text-sm

          font-semibold

          leading-5

          text-slate-700
        "
      >

        {value || "-"}

      </p>

    </div>

  );

}