import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ShieldCheck,
  ArrowLeft,
  Home,
} from "lucide-react";


export default function PublicNavbar() {

  const navigate = useNavigate();

  const location = useLocation();


  /* =========================================
     NAVIGATION ITEMS
  ========================================= */

  const navItems = [
    {
      name: "Dashboard",
      path: "/public-dashboard",
    },
    {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "Explore India",
      path: "/explore-india",
    },

    {
      name: "Reports",
      path: "/reports",
    },
  ];


  /* =========================================
     RETURN TO LANDING PAGE
  ========================================= */

  const handleReturnHome = () => {

    navigate("/");

  };


  return (

    <header
      className="
        sticky
        top-3
        z-[9999]
        px-4

        animate-[navbarEnter_.5s_ease-out]
      "
    >

      <nav
        className="
          mx-auto
          max-w-[1450px]
          h-[68px]

          flex
          items-center
          justify-between

          px-6

          bg-white/95
          backdrop-blur-xl

          border
          border-slate-200

          rounded-2xl

          shadow-xl
          shadow-slate-300/30

          transition-all
          duration-300

          hover:shadow-2xl
          hover:shadow-slate-300/40
        "
      >


        {/* =====================================
            LOGO
        ===================================== */}

        <button
          onClick={() =>
            navigate("/public-dashboard")
          }

          className="
            group

            flex
            items-center
            gap-3
            shrink-0

            rounded-xl

            transition-all
            duration-300

            hover:scale-[1.02]

            active:scale-[0.98]
            cursor-pointer
          "
        >

          <div
            className="
              w-10
              h-10

              rounded-xl

              bg-[#1d334d]

              flex
              items-center
              justify-center

              text-white

              shadow-md

              transition-all
              duration-300

              group-hover:-rotate-6
              group-hover:scale-110
              group-hover:shadow-lg
            "
          >

            <ShieldCheck
              size={20}
              className="
                text-orange-400

                transition-transform
                duration-300

                group-hover:scale-110
              "
            />

          </div>


          <div className="text-left">

            <div className="flex items-center">

              <span className="text-[17px] font-bold text-slate-800">
                Sentinal
              </span>

              <span className="ml-1 text-[17px] font-bold text-orange-500">
                AI
              </span>

              <span className="ml-1 text-[17px] font-bold text-slate-700">
                Monitor
              </span>

            </div>


            <p
              className="
                text-[8px]
                font-bold
                tracking-[0.16em]
                text-slate-400
              "
            >
              NATIONAL OVERSIGHT INTELLIGENCE
            </p>

          </div>

        </button>


        {/* =====================================
            NAVIGATION
        ===================================== */}

        <div
          className="
            hidden
            lg:flex

            items-center
            gap-1
          "
        >

          {navItems.map((item) => {

            const isActive =
              location.pathname === item.path;


            return (

              <button
                key={item.name}

                onClick={() =>
                  navigate(item.path)
                }

                className={`
                  relative
                  cursor-pointer

                  px-4
                  py-3
                  rounded-lg

                  text-sm
                  font-semibold

                  transition-all
                  duration-300

                  hover:-translate-y-[1px]

                  ${
                    isActive
                      ? `
                        text-[#1d334d]
                        bg-orange-50/50
                      `
                      : `
                        text-slate-500
                        hover:text-orange-500
                        hover:bg-orange-50/50
                      `
                  }
                `}
              >

                {item.name}


                {isActive && (

                  <span
                    className="
                      absolute

                      bottom-1
                      left-4
                      right-4

                      h-[2px]

                      bg-orange-500

                      rounded-full

                      animate-[activeLine_.3s_ease-out]
                    "
                  />

                )}

              </button>

            );

          })}

        </div>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >


          {/* =====================================
              LIVE STATUS
          ===================================== */}

          <div
            className="
              hidden
              xl:flex

              items-center

              rounded-full

              border
              border-slate-200

              bg-slate-50

              px-4
              py-2

              text-xs
              text-slate-500

              transition-all
              duration-300

              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >

            <span
              className="
                mr-2
                text-green-500

                animate-pulse
              "
            >
              ●
            </span>

            Live Monitoring

          </div>


          {/* =====================================
              RETURN TO LANDING PAGE
          ===================================== */}

          <button
            onClick={handleReturnHome}

            className="
              group
              cursor-pointer
              flex
              items-center
              justify-center
              gap-2
              

              rounded-xl

              border
              border-slate-200

              bg-white

              px-4
              py-2.5

              text-sm
              font-bold
              text-slate-600

              shadow-sm

              transition-all
              duration-300

              hover:-translate-y-0.5

              hover:border-orange-300

              hover:bg-orange-500

              hover:text-white

              hover:shadow-lg
              hover:shadow-orange-500/20

              active:translate-y-0
              active:scale-[0.97]
            "
          >


            <ArrowLeft
              size={17}

              className="
                transition-transform
                duration-300

                group-hover:-translate-x-1
              "
            />


            <span className="hidden sm:inline">
              Return to Landing
            </span>


            <Home
              size={17}

              className="
                sm:hidden

                transition-transform
                duration-300

                group-hover:scale-110
              "
            />

          </button>


        </div>

      </nav>


      {/* =====================================
          ANIMATIONS
      ===================================== */}

      <style>

        {`

          @keyframes navbarEnter {

            from {

              opacity: 0;

              transform:
                translateY(-20px);

            }


            to {

              opacity: 1;

              transform:
                translateY(0);

            }

          }


          @keyframes activeLine {

            from {

              transform:
                scaleX(0);

              opacity: 0;

            }


            to {

              transform:
                scaleX(1);

              opacity: 1;

            }

          }

        `}

      </style>


    </header>

  );

}