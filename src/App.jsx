import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PublicNavbar from "./components/PublicNavbar";
import InvestigatorNavbar from "./components/InvestigatorNavbar";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PublicDashboard from "./pages/PublicDashboard";
import ProjectsPage from "./pages/Projects";
import ExploreIndia from "./pages/ExploreIndia";
import ProjectDetails from "./pages/ProjectDetails";

import RiskDashboard from "./pages/RiskDashboard";
import InvestigatorReports
from "./pages/InvestigatorReports";

import NationalAnalytics from "./pages/NationalAnalytics";
import StateAnalytics from "./pages/StateAnalytics";

import InvestigationsPage from "./pages/InvestigationsPage";
import InvestigationDetailsPage from "./pages/InvestigationDetailsPage";

import { useAuth } from "./context/AuthContext";


/* =========================================
   INVESTIGATOR PROTECTED ROUTE
========================================= */

function InvestigatorProtectedRoute({ children }) {

  const { user } = useAuth();


  /* =========================================
     USER NOT LOGGED IN
  ========================================= */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  /* =========================================
     WRONG ROLE
  ========================================= */

  if (user.role !== "investigator") {

    return (
      <Navigate
        to="/public-dashboard"
        replace
      />
    );

  }


  return children;

}


/* =========================================
   APP CONTENT
========================================= */

function AppContent() {

  const location = useLocation();


  /* =========================================
     IMPORTANT FIX

     DEFINE USER HERE
  ========================================= */

  const { user } = useAuth();


  const currentPath = location.pathname;


  /* =========================================
     SHOW LANDING NAVBAR
  ========================================= */

  const showLandingNavbar =
    currentPath === "/";


  /* =========================================
     PUBLIC NAVBAR PAGES

     NO LOGIN REQUIRED
  ========================================= */

  const publicPages = [

    "/public-dashboard",

    "/projects",

    "/explore-india",

    "/reports",

    // "/risk-insights",

  ];


  /* =========================================
     INVESTIGATOR NAVBAR PAGES
  ========================================= */

  const investigatorPages = [

    "/risk-dashboard",

    "/investigator-projects",

    "/investigations",

    "/investigator-reports",

    "/analytics",

  ];


  /* =========================================
     SHOW INVESTIGATOR NAVBAR
  ========================================= */

  const showInvestigatorNavbar =

    user?.role === "investigator" &&

    investigatorPages.includes(currentPath);


  /* =========================================
     CHECK PROJECT DETAILS PAGE

     Works for:

     /projects/MPLADS-AS-203279
  ========================================= */

  const isProjectDetailsPage =

    currentPath.startsWith("/projects/");


  /* =========================================
     SHOW PUBLIC NAVBAR

     NO USER ROLE CHECK
  ========================================= */

  const showPublicNavbar =

    publicPages.includes(currentPath) ||

    isProjectDetailsPage;


  return (

    <div className="min-h-screen bg-[#f5f7fb]">


      {/* =====================================
          LANDING NAVBAR
      ===================================== */}

      {showLandingNavbar && (

        <Navbar />

      )}


      {/* =====================================
          PUBLIC NAVBAR

          AVAILABLE WITHOUT LOGIN
      ===================================== */}

      {showPublicNavbar && (

        <PublicNavbar />

      )}


      {/* =====================================
          INVESTIGATOR NAVBAR
      ===================================== */}

      {showInvestigatorNavbar && (

        <InvestigatorNavbar />

      )}


      {/* =====================================
          ROUTES
      ===================================== */}

      <Routes>


        {/* =====================================
            HOME
        ===================================== */}

        <Route

          path="/"

          element={<LandingPage />}

        />


        {/* =====================================
            LOGIN

            ONLY NEEDED FOR INVESTIGATORS
        ===================================== */}

        <Route

          path="/login"

          element={<LoginPage />}

        />


        {/* =====================================
            PUBLIC DASHBOARD

            NO LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/public-dashboard"

          element={<PublicDashboard />}

        />


        {/* =====================================
            PROJECTS PAGE

            NO LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/projects"

          element={<ProjectsPage />}

        />


        {/* =====================================
            PROJECT DETAILS PAGE

            NO LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/projects/:id"

          element={<ProjectDetails />}

        />


        {/* =====================================
            EXPLORE INDIA

            NO LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/explore-india"

          element={<ExploreIndia />}

        />


        {/* =====================================
            RISK INSIGHTS

            NO LOGIN REQUIRED
        ===================================== */}

        {/* <Route

          path="/risk-insights"

          element={<RiskInsightsPage />}

        /> */}


        {/* =====================================
            MY REPORTS

            NO LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/reports"

          element={<ReportsPage />}

        />


        {/* =====================================
            INVESTIGATOR RISK DASHBOARD

            LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/risk-dashboard"

          element={

            <InvestigatorProtectedRoute>

              <RiskDashboard />

            </InvestigatorProtectedRoute>

          }

        />


        {/* =====================================
            INVESTIGATOR PROJECTS

            LOGIN REQUIRED
        ===================================== */}




        {/* =====================================
            INVESTIGATIONS

            LOGIN REQUIRED
        ===================================== */}

<Route
  path="/investigations"
  element={
    <InvestigatorProtectedRoute>
      <InvestigationsPage />
    </InvestigatorProtectedRoute>
  }
/>

<Route
  path="/investigations/:projectId"
  element={
    <InvestigatorProtectedRoute>
      <InvestigationDetailsPage />
    </InvestigatorProtectedRoute>
  }
/>


        {/* =====================================
            INVESTIGATOR REPORTS

            LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/investigator-reports"

          element={

            <InvestigatorProtectedRoute>

              <InvestigatorReports />

            </InvestigatorProtectedRoute>

          }

        />


        {/* =====================================
            ANALYTICS

            LOGIN REQUIRED
        ===================================== */}

        <Route

          path="/analytics"

          element={

            <InvestigatorProtectedRoute>

              <NationalAnalytics />

            </InvestigatorProtectedRoute>

          }

        />

        <Route
  path="/analytics/state/:stateName"
  element={<StateAnalytics />}
/>


        {/* =====================================
            OLD DASHBOARD REDIRECT
        ===================================== */}

        <Route

          path="/dashboard"

          element={

            <Navigate

              to="/public-dashboard"

              replace

            />

          }

        />


        {/* =====================================
            FALLBACK
        ===================================== */}

        <Route

          path="*"

          element={

            <Navigate

              to="/"

              replace

            />

          }

        />


      </Routes>


    </div>

  );

}


/* =========================================
   RISK INSIGHTS PAGE
========================================= */

function RiskInsightsPage() {

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      <main className="mx-auto max-w-[1450px] px-6 py-10">

        <h1 className="text-3xl font-bold text-slate-800">

          Risk Insights

        </h1>


        <p className="mt-3 text-slate-500">

          AI-powered insights based on unusual patterns
          identified in public project data.

        </p>

      </main>

    </div>

  );

}


/* =========================================
   MY REPORTS PAGE
========================================= */

function ReportsPage() {

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      <main className="mx-auto max-w-[1450px] px-6 py-10">

        <h1 className="text-3xl font-bold text-slate-800">

          My Reports

        </h1>


        <p className="mt-3 text-slate-500">

          View and manage your submitted reports.

        </p>

      </main>

    </div>

  );

}



/* =========================================
   APP EXPORT
========================================= */

export default function App() {

  return <AppContent />;

}