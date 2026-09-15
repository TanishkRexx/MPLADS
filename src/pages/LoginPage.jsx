import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  ChevronLeft,
  ArrowRight,
  ScanSearch,
  BrainCircuit,
  FileSearch,
  ShieldAlert,
  Activity,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";



export default function LoginPage() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { login } = useAuth();


  /* =========================================
     PASSWORD VISIBILITY
  ========================================= */

  const [showPassword, setShowPassword] =
    useState(false);


  /* =========================================
     INVESTIGATOR LOGIN DATA
  ========================================= */

  const [investigatorData, setInvestigatorData] =
    useState({
      id: "",
      password: "",
    });


  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleInvestigatorChange = (e) => {

    setInvestigatorData({
      ...investigatorData,
      [e.target.name]: e.target.value,
    });

  };


  /* =========================================
     INVESTIGATOR LOGIN
  ========================================= */

  const handleInvestigatorLogin = (e) => {

    e.preventDefault();


    if (!investigatorData.id.trim()) {

      alert("Please enter Investigator ID");

      return;

    }


    if (!investigatorData.password.trim()) {

      alert("Please enter Password");

      return;

    }


    /* =========================================
       USER DATA
    ========================================= */

    const userData = {

      name: investigatorData.id,

      investigatorId:
        investigatorData.id,

      role:
        "investigator",

    };


    /* =========================================
       LOGIN
    ========================================= */

    login(userData);


    /* =========================================
       CHECK REDIRECT
    ========================================= */

    const redirect =
      searchParams.get("redirect");


    if (redirect) {

      navigate(`/${redirect}`);

      return;

    }


    navigate("/risk-dashboard");

  };


  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#f6f8fb]
      "
    >


      {/* =====================================
          BACKGROUND GRID
      ===================================== */}

      <div
        className="
          fixed
          inset-0
          pointer-events-none
          opacity-[0.35]

          [background-image:linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)]

          [background-size:48px_48px]
        "
      />


      {/* =====================================
          BACKGROUND ORANGE GLOW
      ===================================== */}

      <div
        className="
          fixed
          -top-40
          left-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-orange-200/20
          blur-[120px]
          pointer-events-none
        "
      />


      {/* =====================================
          HEADER
      ===================================== */}

      <header
        className="
          relative
          z-20
          animate-[fadeDown_.7s_ease-out]
        "
      >

        <div
          className="
            mx-auto
            flex
            h-[82px]
            max-w-[1280px]
            items-center
            justify-between
            px-5
            sm:px-6
            lg:px-8
          "
        >


          {/* =================================
              LOGO
          ================================= */}

          <button
            onClick={() =>
              navigate("/")
            }
            className="
              group
              flex
              items-center
              gap-3
              rounded-xl
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
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

                bg-[#1d334d]

                text-orange-400

                shadow-lg
                shadow-slate-300/70

                transition-all
                duration-300

                group-hover:-rotate-6
                group-hover:scale-110
                group-hover:shadow-xl
              "
            >

              <ShieldCheck size={21} />

            </div>


            <div className="text-left">

              <div className="flex items-center">

                <span
                  className="
                    text-[17px]
                    font-extrabold
                    text-slate-800
                  "
                >
                  Sentinal
                </span>


                <span
                  className="
                    ml-1
                    text-[17px]
                    font-extrabold
                    text-orange-500
                  "
                >
                  AI
                </span>


                <span
                  className="
                    ml-1
                    text-[17px]
                    font-extrabold
                    text-slate-700
                  "
                >
                  Monitor
                </span>

              </div>


              <p
                className="
                  mt-0.5
                  text-[7px]
                  font-bold
                  tracking-[0.18em]
                  text-slate-400
                "
              >
                NATIONAL OVERSIGHT INTELLIGENCE
              </p>

            </div>

          </button>


          {/* =================================
              BACK TO HOME
          ================================= */}

          <button
            onClick={() =>
              navigate("/")
            }
            className="
              group
              flex
              items-center
              gap-2

              rounded-xl

              px-3
              py-2

              text-sm
              font-semibold
              text-slate-500

              transition-all
              duration-300

              hover:bg-white
              hover:text-orange-500
              hover:shadow-sm

              active:scale-95
            "
          >

            <ChevronLeft
              size={18}
              className="
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />

            <span className="hidden sm:inline">
              Back to Home
            </span>

          </button>

        </div>

      </header>


      {/* =====================================
          MAIN
      ===================================== */}

      <main
        className="
          relative
          z-10

          mx-auto
          flex

          min-h-[calc(100vh-82px)]

          max-w-[1280px]

          items-center

          px-5
          py-10

          sm:px-6

          lg:px-8
          lg:py-16
        "
      >


        <div
          className="
            grid
            w-full
            items-center
            gap-12

            lg:grid-cols-[1fr_1fr]

            lg:gap-20
          "
        >


          {/* =================================
              LEFT SIDE
              INVESTIGATION INFORMATION
          ================================= */}

          <section
            className="
              animate-[fadeUp_.8s_ease-out]
            "
          >


            {/* SECURITY LABEL */}

            <div
              className="
                mb-7
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  h-px
                  w-8
                  bg-orange-400
                "
              />

              <span
                className="
                  text-[11px]
                  font-bold
                  tracking-[0.2em]
                  text-orange-500
                "
              >
                SECURE INVESTIGATION PORTAL
              </span>

            </div>


            {/* HEADING */}

            <h1
              className="
                max-w-[620px]

                text-4xl
                font-extrabold

                leading-[1.08]

                tracking-tight

                text-slate-800

                sm:text-5xl

                lg:text-6xl
              "
            >

              Intelligence

              <span className="block">
                for
              </span>

              <span className="block text-orange-500">
                accountability.
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p
              className="
                mt-7

                max-w-[560px]

                text-[15px]
                leading-7

                text-slate-500

                sm:text-[16px]
              "
            >
              Access the AI-powered investigation
              environment designed to identify risk,
              analyze evidence and prioritize MPLADS
              projects requiring immediate attention.
            </p>


            {/* =================================
                FEATURE GRID
            ================================= */}

            <div
              className="
                mt-10

                grid
                gap-4

                sm:grid-cols-2
              "
            >


              <FeatureCard
                icon={ScanSearch}
                title="Risk Intelligence"
                description="
                  AI-ranked projects based on
                  financial and execution patterns.
                "
              />


              <FeatureCard
                icon={BrainCircuit}
                title="AI Investigation"
                description="
                  Multi-agent analysis for
                  deeper project investigation.
                "
              />


              <FeatureCard
                icon={FileSearch}
                title="Evidence Review"
                description="
                  Analyze reports, documents
                  and investigation evidence.
                "
              />


              <FeatureCard
                icon={ShieldAlert}
                title="Priority Alerts"
                description="
                  Focus investigation resources
                  on high-risk projects.
                "
              />

            </div>


            {/* =================================
                SYSTEM STATUS
            ================================= */}

            <div
              className="
                mt-8

                flex
                items-center
                gap-3

                text-sm
                text-slate-500
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-lg

                  bg-orange-50

                  text-orange-500
                "
              >
                <Activity size={17} />
              </div>


              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    text-slate-700
                  "
                >
                  AI Intelligence System Active
                </p>


                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-400
                  "
                >
                  Monitoring project intelligence
                  across the national registry.
                </p>

              </div>

            </div>

          </section>


          {/* =================================
              RIGHT SIDE
              INVESTIGATOR LOGIN
          ================================= */}

          <section
            className="
              flex
              justify-center

              animate-[fadeUp_.9s_ease-out]
            "
          >


            <form
              onSubmit={
                handleInvestigatorLogin
              }
              className="
                relative

                w-full
                max-w-[500px]

                overflow-hidden

                rounded-[32px]

                border
                border-slate-200/80

                bg-white/95

                p-7

                shadow-[0_30px_80px_rgba(15,23,42,0.12)]

                backdrop-blur-xl

                transition-all
                duration-500

                hover:-translate-y-1

                hover:shadow-[0_35px_90px_rgba(15,23,42,0.16)]

                sm:p-10
              "
            >


              {/* TOP ORANGE LINE */}

              <div
                className="
                  absolute
                  left-0
                  top-0

                  h-1
                  w-full

                  bg-gradient-to-r
                  from-orange-400
                  via-orange-500
                  to-orange-600
                "
              />


              {/* LOGIN ICON */}

              <div
                className="
                  flex
                  h-14
                  w-14

                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-br
                  from-orange-400
                  to-orange-600

                  text-white

                  shadow-lg
                  shadow-orange-500/25

                  transition-all
                  duration-300

                  hover:-rotate-6
                  hover:scale-110
                "
              >
                <ShieldCheck size={25} />
              </div>


              {/* LOGIN TITLE */}

              <h2
                className="
                  mt-7

                  text-2xl
                  font-extrabold

                  tracking-tight

                  text-slate-800
                "
              >
                Investigator Access
              </h2>


              <p
                className="
                  mt-2

                  text-sm
                  leading-6

                  text-slate-500
                "
              >
                Sign in to access the secure
                investigation and risk intelligence
                console.
              </p>


              {/* DIVIDER */}

              <div
                className="
                  my-7
                  h-px
                  bg-slate-200
                "
              />


              {/* =================================
                  INVESTIGATOR ID
              ================================= */}

              <label
                className="
                  text-[10px]
                  font-bold
                  tracking-[0.16em]
                  text-slate-500
                "
              >
                INVESTIGATOR ID
              </label>


              <div
                className="
                  group
                  relative
                  mt-2
                "
              >

                <ShieldCheck
                  size={17}
                  className="
                    pointer-events-none

                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400

                    transition-colors
                    duration-300

                    group-focus-within:text-orange-500
                  "
                />


                <input
                  type="text"

                  name="id"

                  value={
                    investigatorData.id
                  }

                  onChange={
                    handleInvestigatorChange
                  }

                  placeholder="Enter Investigator ID"

                  className="
                    h-[56px]
                    w-full

                    rounded-xl

                    border
                    border-slate-200

                    bg-slate-50

                    pl-12
                    pr-4

                    text-sm
                    font-medium
                    text-slate-700

                    outline-none

                    placeholder:text-slate-400

                    transition-all
                    duration-300

                    hover:border-slate-300

                    focus:border-orange-400
                    focus:bg-white

                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

              </div>


              {/* =================================
                  PASSWORD
              ================================= */}

              <label
                className="
                  mt-6
                  block

                  text-[10px]
                  font-bold
                  tracking-[0.16em]
                  text-slate-500
                "
              >
                PASSWORD
              </label>


              <div
                className="
                  group
                  relative
                  mt-2
                "
              >

                <LockKeyhole
                  size={17}
                  className="
                    pointer-events-none

                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400

                    transition-colors
                    duration-300

                    group-focus-within:text-orange-500
                  "
                />


                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  name="password"

                  value={
                    investigatorData.password
                  }

                  onChange={
                    handleInvestigatorChange
                  }

                  placeholder="Enter your password"

                  className="
                    h-[56px]
                    w-full

                    rounded-xl

                    border
                    border-slate-200

                    bg-slate-50

                    pl-12
                    pr-14

                    text-sm
                    font-medium
                    text-slate-700

                    outline-none

                    placeholder:text-slate-400

                    transition-all
                    duration-300

                    hover:border-slate-300

                    focus:border-orange-400
                    focus:bg-white

                    focus:ring-4
                    focus:ring-orange-100
                  "
                />


                {/* PASSWORD TOGGLE */}

                <button
                  type="button"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="
                    absolute
                    right-3
                    top-1/2

                    flex
                    h-9
                    w-9

                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-lg

                    text-slate-400

                    transition-all
                    duration-300

                    hover:bg-orange-50
                    hover:text-orange-500

                    active:scale-90
                  "
                >

                  {showPassword ? (

                    <EyeOff size={18} />

                  ) : (

                    <Eye size={18} />

                  )}

                </button>

              </div>


              {/* =================================
                  LOGIN BUTTON
              ================================= */}

              <button
                type="submit"

                className="
                  group

                  mt-7

                  flex
                  h-[58px]
                  w-full

                  items-center
                  justify-center
                  gap-3

                  rounded-xl

                  bg-gradient-to-r
                  from-orange-500
                  to-orange-600

                  text-sm
                  font-bold
                  text-white

                  shadow-lg
                  shadow-orange-500/25

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:shadow-orange-500/35

                  active:translate-y-0
                  active:scale-[0.98]
                "
              >

                Login to Investigation Console


                <ArrowRight
                  size={18}

                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                />

              </button>


              {/* =================================
                  SECURITY MESSAGE
              ================================= */}

              <div
                className="
                  mt-7

                  flex
                  items-start
                  gap-3

                  rounded-xl

                  border
                  border-slate-100

                  bg-slate-50

                  p-4
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0

                    items-center
                    justify-center

                    rounded-lg

                    bg-[#1d334d]

                    text-orange-400
                  "
                >
                  <LockKeyhole size={16} />
                </div>


                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    Secure Access Environment
                  </p>


                  <p
                    className="
                      mt-1

                      text-[11px]
                      leading-5

                      text-slate-400
                    "
                  >
                    This portal is intended for
                    authorized investigation personnel
                    and project oversight authorities.
                  </p>

                </div>

              </div>


              {/* =================================
                  DEMO CREDENTIALS
              ================================= */}

              <div
                className="
                  mt-5

                  rounded-xl

                  border
                  border-orange-100

                  bg-orange-50/60

                  p-4
                "
              >

                <p
                  className="
                    text-[10px]
                    font-bold
                    tracking-[0.14em]

                    text-orange-600
                  "
                >
                  DEMO CREDENTIALS
                </p>


                <div
                  className="
                    mt-3

                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  <span
                    className="
                      rounded-lg

                      bg-white

                      px-3
                      py-2

                      font-mono
                      text-xs

                      text-slate-600

                      shadow-sm
                    "
                  >
                    ID: INV001
                  </span>


                  <span
                    className="
                      rounded-lg

                      bg-white

                      px-3
                      py-2

                      font-mono
                      text-xs

                      text-slate-600

                      shadow-sm
                    "
                  >
                    PASS: investigate123
                  </span>

                </div>

              </div>

            </form>

          </section>

        </div>

      </main>


      {/* =====================================
          ANIMATIONS
      ===================================== */}

      <style>{`

        @keyframes fadeUp {

          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        @keyframes fadeDown {

          from {
            opacity: 0;
            transform: translateY(-20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

      `}</style>

    </div>

  );

}


/* =========================================
   FEATURE CARD
========================================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
}) {

  return (

    <div
      className="
        group

        flex
        gap-4

        rounded-2xl

        border
        border-slate-200/80

        bg-white/70

        p-5

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-1

        hover:border-orange-200

        hover:bg-white

        hover:shadow-lg
      "
    >


      {/* =================================
          ICON
      ================================= */}

      <div
        className="
          flex
          h-11
          w-11
          shrink-0

          items-center
          justify-center

          rounded-xl

          bg-orange-50

          text-orange-500

          transition-all
          duration-300

          group-hover:scale-110

          group-hover:bg-orange-500

          group-hover:text-white
        "
      >
        <Icon size={20} />
      </div>


      {/* =================================
          CONTENT
      ================================= */}

      <div>

        <h3
          className="
            text-sm
            font-bold

            text-slate-700

            transition-colors
            duration-300

            group-hover:text-orange-600
          "
        >
          {title}
        </h3>


        <p
          className="
            mt-1.5

            text-xs
            leading-5

            text-slate-500
          "
        >
          {description}
        </p>

      </div>

    </div>

  );

}