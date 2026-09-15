import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ShieldCheck,
  LayoutDashboard,
  FolderKanban,
  SearchCheck,
  FileText,
  BarChart3,
  Bell,
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";


export default function InvestigatorNavbar() {

  const navigate = useNavigate();

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);


  /* =========================================
     NAVIGATION ITEMS
  ========================================= */

  const navItems = [

    {
      name: "Dashboard",
      path: "/risk-dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Investigations",
      path: "/investigations",
      icon: SearchCheck,
    },

    {
      name: "Reports",
      path: "/investigator-reports",
      icon: FileText,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },

  ];


  /* =========================================
     CHECK ACTIVE PAGE
  ========================================= */

  const isActive = (path) => {

    return location.pathname === path;

  };


  /* =========================================
     NAVIGATE
  ========================================= */

  const handleNavigate = (path) => {

    setMenuOpen(false);

    setProfileOpen(false);

    navigate(path);

  };


  /* =========================================
     RETURN HOME
  ========================================= */

  const handleLogout = () => {

    setProfileOpen(false);

    navigate("/");

  };


  return (

    <header
      className="
        sticky
        top-3
        z-[9999]

        w-full

        px-3
        sm:px-5
        lg:px-8

        pt-1

        animate-[investigatorNavbarEnter_.6s_ease-out]
      "
    >

      {/* =====================================
          NAVBAR CONTAINER
      ===================================== */}

      <nav
        className="
          mx-auto

          flex
          h-[68px]

          max-w-[1500px]

          items-center
          justify-between

          rounded-2xl

          border
          border-slate-200

          bg-white/95

          px-4
          sm:px-5
          lg:px-7

          backdrop-blur-xl

          shadow-lg
          shadow-slate-300/30

          transition-all
          duration-500

          hover:shadow-xl
          hover:shadow-slate-300/40
        "
      >


        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div
          className="
            flex
            items-center

            gap-5
            xl:gap-9
          "
        >


          {/* =====================================
              LOGO
          ===================================== */}

          <button
            onClick={() =>
              handleNavigate("/risk-dashboard")
            }
            className="
              group

              flex
              shrink-0
              cursor-pointer
              items-center
              gap-3

              rounded-xl

              transition-all
              duration-300

              hover:scale-[1.02]

              active:scale-[0.97]
            "
          >

            {/* LOGO ICON */}

            <div
              className="
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                bg-[#17263a]

                shadow-md
                shadow-slate-900/10

                transition-all
                duration-500

                group-hover:-translate-y-0.5
                group-hover:rotate-[-5deg]
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


            {/* LOGO TEXT */}

            <div
              className="
                hidden
                text-left
                sm:block
              "
            >

              <div
                className="
                  flex
                  items-center

                  text-[17px]
                  font-bold
                "
              >

                <span className="text-slate-800">
                  Sentinal
                </span>

                <span className="ml-1 text-orange-500">
                  AI
                </span>

                <span className="ml-1 text-slate-700">
                  Monitor
                </span>

              </div>


              <p
                className="
                  mt-[2px]

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
              DESKTOP NAVIGATION
          ===================================== */}

          <div
            className="
              hidden

              items-center
              gap-1

              lg:flex

              absolute
              left-1/2
              -translate-x-1/2
            "
          >

            {navItems.map((item) => {

              const Icon = item.icon;

              const active =
                isActive(item.path);


              return (

                <button
                  key={item.name}

                  onClick={() =>
                    handleNavigate(item.path)
                  }

                  className={`
                    group
                    relative

                    flex
                    cursor-pointer
                    items-center
                    gap-2

                    rounded-lg

                    px-4
                    py-3

                    text-[13px]
                    font-semibold

                    transition-all
                    duration-300

                    hover:-translate-y-[1px]

                    ${
                      active

                        ? `
                          bg-orange-50/70
                          text-[#17263a]
                        `

                        : `
                          text-slate-500

                          hover:bg-orange-50/60
                          hover:text-orange-500
                        `
                    }
                  `}
                >

                  <Icon
                    size={15}

                    className={`
                      hidden
                      transition-all
                      duration-300

                      xl:block

                      ${
                        active
                          ? "text-orange-500"
                          : "text-slate-400 group-hover:text-orange-500"
                      }
                    `}
                  />

                  <span>
                    {item.name}
                  </span>


                  {/* ACTIVE LINE */}

                  {active && (

                    <span
                      className="
                        absolute

                        bottom-1.5
                        left-4
                        right-4

                        h-[2px]

                        rounded-full

                        bg-orange-500

                        animate-[investigatorActiveLine_.35s_ease-out]
                      "
                    />

                  )}

                </button>

              );

            })}

          </div>

        </div>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div
          className="
            flex
            items-center

            gap-2
            sm:gap-3
          "
        >


          {/* =====================================
              LIVE STATUS
          ===================================== */}

          <div
            className="
              hidden

              items-center

              rounded-full

              border
              border-slate-200

              bg-slate-50

              px-4
              py-2

              text-[11px]
              font-semibold
              text-slate-500

              transition-all
              duration-300

              xl:flex

              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >

            <span
              className="
                mr-2

                text-[9px]
                text-emerald-500

                animate-pulse
              "
            >
              ●
            </span>

            Live Monitoring

          </div>


          {/* =====================================
              NOTIFICATION
          ===================================== */}

          <button
            className="
              group
              relative

              hidden
              h-10
              w-10

              cursor-pointer
              items-center
              justify-center

              rounded-xl

              text-slate-500

              transition-all
              duration-300

              sm:flex

              hover:bg-orange-50
              hover:text-orange-500

              active:scale-95
            "
          >



           

          </button>


          {/* =====================================
              PROFILE
          ===================================== */}

          <div className="relative">


            <button
              onClick={() =>
                setProfileOpen(!profileOpen)
              }

              className="
                group

                flex
                cursor-pointer
                items-center

                gap-3

                rounded-xl

                px-2
                py-1.5

                transition-all
                duration-300

                hover:bg-slate-50

                active:scale-[0.98]
              "
            >


              {/* AVATAR */}

              <div
                className="
                  flex
                  h-10
                  w-10

                  items-center
                  justify-center

                  rounded-xl

                  bg-gradient-to-br
                  from-orange-500
                  to-orange-600

                  text-white

                  shadow-md
                  shadow-orange-500/20

                  transition-all
                  duration-300

                  group-hover:-translate-y-0.5
                  group-hover:shadow-lg
                "
              >

                <UserRound
                  size={19}
                />

              </div>


              {/* PROFILE INFO */}

              <div
                className="
                  hidden

                  max-w-[150px]

                  text-left

                  xl:block
                "
              >

                <p
                  className="
                    truncate

                    text-[12px]
                    font-bold

                    text-slate-700
                  "
                >
                  Investigative Officer
                </p>


                <p
                  className="
                    mt-0.5

                    text-[9px]
                    font-bold

                    tracking-[0.12em]

                    text-orange-600
                  "
                >
                  INVESTIGATOR
                </p>

              </div>


              <ChevronDown
                size={16}

                className={`
                  hidden

                  text-slate-400

                  transition-transform
                  duration-300

                  sm:block

                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {/* =====================================
                PROFILE DROPDOWN
            ===================================== */}

            {profileOpen && (

              <div
                className="
                  absolute

                  right-0
                  top-[58px]

                  w-[220px]

                  overflow-hidden

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  p-2

                  shadow-xl
                  shadow-slate-300/40

                  animate-[profileMenu_.25s_ease-out]
                "
              >

                <div
                  className="
                    border-b
                    border-slate-100

                    px-4
                    py-3
                  "
                >

                  <p
                    className="
                      text-sm
                      font-bold

                      text-slate-700
                    "
                  >
                    Investigative Officer
                  </p>


                  <p
                    className="
                      mt-1

                      text-xs

                      text-slate-400
                    "
                  >
                    Authorized Investigator
                  </p>

                </div>


                <button
                  onClick={handleLogout}

                  className="
                    mt-2

                    flex
                    w-full

                    cursor-pointer
                    items-center
                    gap-3

                    rounded-xl

                    px-4
                    py-3

                    text-left
                    text-sm
                    font-semibold

                    text-red-500

                    transition-all
                    duration-300

                    hover:bg-red-50
                  "
                >

                  <LogOut
                    size={17}
                  />

                  Return to Landing

                </button>

              </div>

            )}

          </div>


          {/* =====================================
              MOBILE MENU BUTTON
          ===================================== */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }

            className="
              flex
              h-10
              w-10

              cursor-pointer
              items-center
              justify-center

              rounded-xl

              text-slate-600

              transition-all
              duration-300

              lg:hidden

              hover:bg-orange-50
              hover:text-orange-500

              active:scale-95
            "
          >

            {menuOpen

              ? (
                <X size={21} />
              )

              : (
                <Menu size={21} />
              )

            }

          </button>

        </div>

      </nav>


      {/* =====================================
          MOBILE MENU
      ===================================== */}

      {menuOpen && (

        <div
          className="
            mx-auto

            mt-3

            max-w-[1500px]

            overflow-hidden

            rounded-2xl

            border
            border-slate-200

            bg-white/95

            p-3

            shadow-xl
            shadow-slate-300/30

            backdrop-blur-xl

            animate-[mobileMenu_.3s_ease-out]

            lg:hidden
          "
        >

          <div className="flex flex-col gap-1">

            {navItems.map((item) => {

              const Icon = item.icon;

              const active =
                isActive(item.path);


              return (

                <button
                  key={item.name}

                  onClick={() =>
                    handleNavigate(item.path)
                  }

                  className={`
                    flex
                    cursor-pointer
                    items-center
                    gap-3

                    rounded-xl

                    px-4
                    py-3.5

                    text-left
                    text-sm
                    font-semibold

                    transition-all
                    duration-300

                    ${
                      active

                        ? `
                          bg-orange-50
                          text-orange-600
                        `

                        : `
                          text-slate-600

                          hover:bg-slate-50
                          hover:text-orange-500
                        `
                    }
                  `}
                >

                  <Icon size={18} />

                  {item.name}

                </button>

              );

            })}


            {/* MOBILE RETURN */}

            <button
              onClick={handleLogout}

              className="
                mt-2

                flex
                cursor-pointer
                items-center
                gap-3

                rounded-xl

                border
                border-red-100

                bg-red-50

                px-4
                py-3.5

                text-sm
                font-bold

                text-red-500

                transition-all
                duration-300

                hover:bg-red-500
                hover:text-white
              "
            >

              <LogOut size={18} />

              Return to Landing

            </button>

          </div>

        </div>

      )}


      {/* =====================================
          ANIMATIONS
      ===================================== */}

      <style>

        {`

          @keyframes investigatorNavbarEnter {

            from {

              opacity: 0;

              transform:
                translateY(-24px);

            }

            to {

              opacity: 1;

              transform:
                translateY(0);

            }

          }


          @keyframes investigatorActiveLine {

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


          @keyframes profileMenu {

            from {

              opacity: 0;

              transform:
                translateY(-10px)
                scale(0.97);

            }

            to {

              opacity: 1;

              transform:
                translateY(0)
                scale(1);

            }

          }


          @keyframes mobileMenu {

            from {

              opacity: 0;

              transform:
                translateY(-12px);

            }

            to {

              opacity: 1;

              transform:
                translateY(0);

            }

          }

        `}

      </style>

    </header>

  );

}