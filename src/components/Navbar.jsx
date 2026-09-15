import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();


  /* =========================================
     SCROLL TO SECTION
  ========================================= */

  const scrollToSection = (sectionId) => {
    setMenuOpen(false);

    if (location.pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      return;
    }

    navigate(`/#${sectionId}`);

    setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 400);
  };


  /* =========================================
     HOME
  ========================================= */

  const handleHome = () => {
    setMenuOpen(false);

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };


  return (
    <div className="fixed top-2 left-0 z-[100] w-full px-3 sm:px-5 lg:px-8">

      {/* =====================================
          FLOATING NAVBAR
      ===================================== */}

      <nav
        className="
          mx-auto
          max-w-[1280px]
          rounded-2xl
          border
          border-slate-200/80
          bg-white/90
          shadow-lg
          shadow-slate-900/[0.08]
          backdrop-blur-xl
          transition-all
          duration-500
        "
      >

        <div className="px-4 sm:px-5 lg:px-7">

          {/* =================================
              NAVBAR MAIN
          ================================= */}

          <div className="flex h-[66px] items-center justify-between">


            {/* =================================
                LOGO
            ================================= */}

            <button
              onClick={handleHome}
              className="
                group
                flex
                shrink-0
                items-center
                gap-3
                rounded-xl
                transition-all
                duration-300
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >

              {/* LOGO ICON */}

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-500
                  shadow-lg
                  shadow-orange-500/25
                  transition-all
                  duration-300
                  group-hover:-rotate-6
                  group-hover:scale-110
                  group-hover:bg-orange-600
                "
              >
                <ShieldCheck
                  size={18}
                  className="text-white"
                />
              </div>


              {/* LOGO TEXT */}

              <div className="text-left">

                <h1
                  className="
                    whitespace-nowrap
                    text-[15px]
                    font-extrabold
                    leading-none
                    tracking-tight
                    text-slate-800
                  "
                >
                  Sentinal

                  <span className="ml-1 text-orange-500">
                    AI
                  </span>

                  <span className="ml-1">
                    Monitor
                  </span>

                </h1>


                <p
                  className="
                    mt-1
                    text-[6px]
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
                DESKTOP NAVIGATION
            ================================= */}

            <div
              className="
                hidden
                items-center
                rounded-xl
                border
                border-slate-100
                bg-slate-50/70
                px-2
                py-1.5
                lg:flex
              "
            >

              {/* HOME */}

              <button
                onClick={handleHome}
                className="
                  rounded-lg
                  px-4
                  py-2
                  text-[13px]
                  font-semibold
                  text-slate-600
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:shadow-sm
                  active:scale-95
                  cursor-pointer
                "
              >
                Home
              </button>


              {/* PROJECTS */}

              <button
                onClick={() =>
                  scrollToSection("live-project-dashboard")
                }
                className="
                  rounded-lg
                  px-4
                  py-2
                  text-[13px]
                  font-semibold
                  text-slate-600
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:shadow-sm
                  active:scale-95
                  cursor-pointer
                "
              >
                Projects
              </button>


              {/* RISK DASHBOARD */}

              <button
                onClick={() =>
                  navigate(
                    "/login?type=investigator&redirect=risk-dashboard"
                  )
                }
                className="
                  rounded-lg
                  px-4
                  py-2
                  text-[13px]
                  font-semibold
                  text-slate-600
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:shadow-sm
                  active:scale-95
                  cursor-pointer
                "
              >
                Risk Dashboard
              </button>


              {/* HOW IT WORKS */}

              <button
                onClick={() =>
                  scrollToSection("how-it-works")
                }
                className="
                  rounded-lg
                  px-4
                  py-2
                  text-[13px]
                  font-semibold
                  text-slate-600
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:shadow-sm
                  active:scale-95
                  cursor-pointer
                "
              >
                How It Works
              </button>

            </div>


            {/* =================================
                DESKTOP LOGIN
            ================================= */}

            <div className="hidden shrink-0 items-center gap-3 lg:flex">

              <Link
                to="/login?type=investigator"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-5
                  py-2.5
                  text-[12px]
                  font-bold
                  text-white
                  shadow-lg
                  shadow-orange-500/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                  hover:shadow-xl
                  hover:shadow-orange-500/25
                  active:translate-y-0
                  active:scale-95
                "
              >

                <Search
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                Investigator Login

              </Link>

            </div>


            {/* =================================
                MOBILE MENU BUTTON
            ================================= */}

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-700
                shadow-sm
                transition-all
                duration-300
                hover:border-orange-200
                hover:bg-orange-50
                hover:text-orange-500
                hover:scale-105
                active:scale-95
                lg:hidden
              "
            >
              {menuOpen ? (
                <X
                  size={20}
                  className="transition-transform duration-300 rotate-90"
                />
              ) : (
                <Menu
                  size={20}
                  className="transition-transform duration-300"
                />
              )}
            </button>

          </div>


          {/* =================================
              MOBILE MENU
          ================================= */}

          <div
            className={`
              overflow-hidden
              transition-all
              duration-500
              ease-in-out
              lg:hidden

              ${
                menuOpen
                  ? "max-h-[500px] opacity-100 pb-4"
                  : "max-h-0 opacity-0"
              }
            `}
          >

            <div
              className="
                mt-1
                flex
                flex-col
                gap-1
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                p-2
              "
            >


              {/* HOME */}

              <button
                onClick={handleHome}
                className="
                  rounded-lg
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:translate-x-1
                "
              >
                Home
              </button>


              {/* PROJECTS */}

              <button
                onClick={() =>
                  scrollToSection("live-project-dashboard")
                }
                className="
                  rounded-lg
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:translate-x-1
                "
              >
                Projects
              </button>


              {/* RISK DASHBOARD */}

              <button
                onClick={() => {
                  setMenuOpen(false);

                  navigate(
                    "/login?type=investigator&redirect=risk-dashboard"
                  );
                }}
                className="
                  rounded-lg
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:translate-x-1
                "
              >
                Risk Dashboard
              </button>


              {/* HOW IT WORKS */}

              <button
                onClick={() =>
                  scrollToSection("how-it-works")
                }
                className="
                  rounded-lg
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-orange-500
                  hover:translate-x-1
                "
              >
                How It Works
              </button>


              {/* DIVIDER */}

              <div className="my-2 border-t border-slate-200" />


              {/* INVESTIGATOR LOGIN */}

              <Link
                to="/login?type=investigator"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  shadow-orange-500/20
                  transition-all
                  duration-300
                  hover:bg-orange-600
                  hover:shadow-lg
                  active:scale-[0.98]
                "
              >

                <Search
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                Investigator Login

              </Link>

            </div>

          </div>

        </div>

      </nav>

    </div>
  );
}