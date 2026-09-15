/* =========================================
   STATE NAME NORMALIZATION
========================================= */

export const normalizeStateName = (name = "") => {
  return name
    .toUpperCase()
    .trim()
    .replace(/&/g, "AND")
    .replace(/\s+/g, " ");
};


/* =========================================
   RISK LEVEL
========================================= */

export const getRiskLevel = (score) => {
  if (score <= 30) return "Low";
  if (score <= 70) return "Medium";
  return "High";
};


/* =========================================
   RISK COLOR
========================================= */

export const getRiskColor = (score) => {
  if (score <= 30) return "#27845d";

  if (score <= 70) return "#d88920";

  return "#c94f50";
};


/* =========================================
   RISK CONFIG
========================================= */

export const RISK_CONFIG = {
  Low: {
    color: "#27845d",
    light: "#e8f6ef",
    label: "Low Risk",
  },

  Medium: {
    color: "#d88920",
    light: "#fff4df",
    label: "Medium Risk",
  },

  High: {
    color: "#c94f50",
    light: "#fff0f0",
    label: "High Risk",
  },
};


/* =========================================
   GET PROJECT COST
========================================= */

export const getProjectCost = (project) => {
  if (typeof project.costValue === "number") {
    return project.costValue;
  }

  if (!project.cost) return 0;

  const value = parseFloat(
    project.cost
      .replace(/[₹,]/g, "")
      .replace(/Lakh/i, "")
      .trim()
  );

  return isNaN(value) ? 0 : value;
};


/* =========================================
   GET EXPENDITURE
========================================= */

export const getProjectExpenditure = (project) => {
  if (typeof project.expenditureValue === "number") {
    return project.expenditureValue;
  }

  if (!project.expenditure) {
    return getProjectCost(project) *
      ((project.expenditurePercent || 0) / 100);
  }

  const value = parseFloat(
    project.expenditure
      .replace(/[₹,]/g, "")
      .replace(/Lakh/i, "")
      .trim()
  );

  return isNaN(value) ? 0 : value;
};


/* =========================================
   CALCULATE STATE ANALYTICS
========================================= */

export const calculateStateAnalytics = (
  stateName,
  projects
) => {
  const normalizedState =
    normalizeStateName(stateName);

  const stateProjects =
    projects.filter((project) => {
      return (
        normalizeStateName(project.state) ===
        normalizedState
      );
    });

  const totalProjects =
    stateProjects.length;

  const completed =
    stateProjects.filter(
      (p) =>
        p.status?.toLowerCase() ===
        "completed"
    ).length;

  const delayed =
    stateProjects.filter(
      (p) =>
        p.status?.toLowerCase() ===
        "delayed"
    ).length;

  const ongoing =
    stateProjects.filter(
      (p) =>
        p.status?.toLowerCase() ===
          "ongoing" ||
        p.status?.toLowerCase() ===
          "in progress"
    ).length;

  const highRisk =
    stateProjects.filter(
      (p) =>
        p.riskLevel === "High" ||
        p.riskScore >= 71
    ).length;

  const mediumRisk =
    stateProjects.filter(
      (p) =>
        p.riskLevel === "Medium" ||
        (p.riskScore >= 31 &&
          p.riskScore <= 70)
    ).length;

  const lowRisk =
    stateProjects.filter(
      (p) =>
        p.riskLevel === "Low" ||
        p.riskScore <= 30
    ).length;

  const totalRisk =
    stateProjects.reduce(
      (sum, project) =>
        sum + (project.riskScore || 0),
      0
    );

  const riskScore =
    totalProjects > 0
      ? Math.round(
          totalRisk / totalProjects
        )
      : 0;

  const totalSanctioned =
    stateProjects.reduce(
      (sum, project) =>
        sum + getProjectCost(project),
      0
    );

  const totalExpenditure =
    stateProjects.reduce(
      (sum, project) =>
        sum +
        getProjectExpenditure(project),
      0
    );

  const utilization =
    totalSanctioned > 0
      ? Math.round(
          (totalExpenditure /
            totalSanctioned) *
            100
        )
      : 0;

  return {
    stateName,
    projects: stateProjects,

    totalProjects,

    completed,

    delayed,

    ongoing,

    highRisk,

    mediumRisk,

    lowRisk,

    riskScore,

    riskLevel:
      getRiskLevel(riskScore),

    totalSanctioned,

    totalExpenditure,

    utilization,
  };
};


/* =========================================
   DISTRICT ANALYTICS
========================================= */

export const calculateDistrictAnalytics = (
  projects
) => {
  const districts = {};

  projects.forEach((project) => {
    const district =
      project.district ||
      project.location ||
      "Unknown";

    if (!districts[district]) {
      districts[district] = [];
    }

    districts[district].push(project);
  });

  return Object.entries(districts)
    .map(
      ([districtName, districtProjects]) => {
        const total =
          districtProjects.length;

        const riskScore =
          total > 0
            ? Math.round(
                districtProjects.reduce(
                  (sum, p) =>
                    sum +
                    (p.riskScore || 0),
                  0
                ) / total
              )
            : 0;

        const completed =
          districtProjects.filter(
            (p) =>
              p.status?.toLowerCase() ===
              "completed"
          ).length;

        const delayed =
          districtProjects.filter(
            (p) =>
              p.status?.toLowerCase() ===
              "delayed"
          ).length;

        const ongoing =
          districtProjects.filter(
            (p) =>
              p.status?.toLowerCase() ===
                "ongoing" ||
              p.status?.toLowerCase() ===
                "in progress"
          ).length;

        return {
          districtName,

          projects:
            districtProjects,

          totalProjects:
            total,

          completed,

          delayed,

          ongoing,

          riskScore,

          riskLevel:
            getRiskLevel(riskScore),
        };
      }
    )
    .sort(
      (a, b) =>
        b.riskScore -
        a.riskScore
    );
};