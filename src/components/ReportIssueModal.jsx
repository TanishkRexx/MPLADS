import { useEffect, useRef, useState } from "react";

import {
  AlertTriangle,
  Camera,
  Check,
  ChevronRight,
  Flag,
  Loader2,
  MapPin,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";

export default function ReportIssueModal({
  isOpen,
  onClose,
  project,
  onReportSuccess,
}) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");

  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isProcessingImage, setIsProcessingImage] =
    useState(false);

  const [processingStep, setProcessingStep] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [sliderPosition, setSliderPosition] =
    useState(0);

  const [reportSubmitted, setReportSubmitted] =
  useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const sliderRef = useRef(null);

  const processingTimers = useRef([]);

  /* =========================================
     CLEAR TIMERS
  ========================================= */

  const clearProcessingTimers = () => {
    processingTimers.current.forEach(clearTimeout);
    processingTimers.current = [];
  };

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    clearProcessingTimers();

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setIssueType("");
    setDescription("");
    setUploadedImage(null);
    setImagePreview(null);

    setIsProcessingImage(false);
    setProcessingStep("");

    setIsSubmitting(false);
    setIsSuccess(false);

    setSliderPosition(0);
    setIsDragging(false);

    setReportSubmitted(false);
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  /* =========================================
     BODY SCROLL LOCK
  ========================================= */

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  /* =========================================
     ESC CLOSE
  ========================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, isSubmitting]);

  /* =========================================
     CLEANUP
  ========================================= */

  useEffect(() => {
    return () => {
      clearProcessingTimers();
    };
  }, []);

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  const handleImageUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        "Please upload a valid image file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(
        "Image size should be less than 10 MB."
      );

      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setUploadedImage(file);
    setImagePreview(previewUrl);

    setIsProcessingImage(true);

    setProcessingStep(
      "Uploading evidence..."
    );

    clearProcessingTimers();

    processingTimers.current.push(
      setTimeout(() => {
        setProcessingStep(
          "Analyzing image quality..."
        );
      }, 700)
    );

    processingTimers.current.push(
      setTimeout(() => {
        setProcessingStep(
          "Scanning visual evidence..."
        );
      }, 1400)
    );

    processingTimers.current.push(
      setTimeout(() => {
        setProcessingStep(
          "Verifying uploaded evidence..."
        );
      }, 2100)
    );

    processingTimers.current.push(
      setTimeout(() => {
        setProcessingStep(
          "Evidence ready"
        );
      }, 2800)
    );

    processingTimers.current.push(
      setTimeout(() => {
        setIsProcessingImage(false);
      }, 3300)
    );

    event.target.value = "";
  };

  /* =========================================
     REMOVE IMAGE
  ========================================= */

  const removeImage = () => {
    clearProcessingTimers();

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setUploadedImage(null);
    setImagePreview(null);

    setIsProcessingImage(false);
    setProcessingStep("");
  };

  /* =========================================
     SLIDER WIDTH
  ========================================= */

  const getSliderWidth = () => {
    if (!sliderRef.current) return 0;

    const width =
      sliderRef.current.offsetWidth;

    return Math.max(
      0,
      width - 68
    );
  };

  /* =========================================
     VALIDATE REPORT
  ========================================= */

  const validateReport = () => {
    if (!issueType) {
      alert(
        "Please select an issue type."
      );

      return false;
    }

    if (!description.trim()) {
      alert(
        "Please describe the issue."
      );

      return false;
    }

    return true;
  };

  /* =========================================
   CONVERT IMAGE TO BASE64
========================================= */

/* =========================================
   CONVERT IMAGE TO BASE64
========================================= */

const convertImageToBase64 = (file) => {

  return new Promise((resolve, reject) => {

    if (!file) {

      resolve(null);

      return;

    }

    const reader = new FileReader();


    reader.onload = () => {

      resolve(reader.result);

    };


    reader.onerror = () => {

      reject(
        new Error("Unable to read image")
      );

    };


    reader.readAsDataURL(file);

  });

};



/* =========================================
   SUBMIT REPORT
========================================= */

/* =========================================
   SUBMIT REPORT
========================================= */

const submitReport = async () => {

  if (
    reportSubmitted ||
    isSubmitting
  ) {

    return;

  }


  if (!validateReport()) {

    setSliderPosition(0);

    return;

  }


  setReportSubmitted(true);

  setIsSubmitting(true);


  try {


    /* =====================================
       CONVERT PUBLIC IMAGE
    ===================================== */

    const evidenceImage =
      await convertImageToBase64(
        uploadedImage
      );


    setTimeout(() => {


      setIsSubmitting(false);

      setIsSuccess(true);


      setSliderPosition(
        getSliderWidth()
      );


      /* =====================================
         CREATE PUBLIC REPORT
      ===================================== */

      const newReport = {

        id:
          `REPORT-PUBLIC-${Date.now()}`,


        projectId:
          project?.id || "",


        projectName:
          project?.name ||
          project?.title ||
          "Citizen Reported Project",


        projectTitle:
          project?.name ||
          project?.title ||
          "Citizen Reported Project",


        issueType:
          issueType,


        description:
          description.trim(),


        /* ===============================
           PUBLIC UPLOADED IMAGE
        =============================== */

        evidenceImage:
          evidenceImage,


        evidenceFileName:
          uploadedImage?.name ||
          null,


        evidenceFileType:
          uploadedImage?.type ||
          null,


        hasEvidence:
          Boolean(evidenceImage),


        /* ===============================
           LOCATION
        =============================== */

        district:
          project?.district || "",


        state:
          project?.state || "",


        location:
          project?.location ||
          `${project?.district || ""}, ${project?.state || ""}`,


        category:
          project?.category || "",


        /* ===============================
           STATUS
        =============================== */

        status:
          "Pending Investigation",


        risk:
          "High",


        aiConfidence:
          Math.floor(
            Math.random() * 15
          ) + 80,


        /* ===============================
           DATE
        =============================== */

        submittedAt:
          new Date().toISOString(),


        createdAt:
          new Date().toISOString(),


        submittedBy:
          "Citizen",

      };


      /* =====================================
         GET OLD PUBLIC REPORTS
      ===================================== */

      const existingReports =
        JSON.parse(

          localStorage.getItem(
            "mplads_public_reports"
          ) || "[]"

        );


      /* =====================================
         ADD NEW REPORT FIRST
      ===================================== */

      const updatedReports = [

        newReport,

        ...existingReports,

      ];


      /* =====================================
         SAVE REPORT
      ===================================== */

      localStorage.setItem(

        "mplads_public_reports",

        JSON.stringify(
          updatedReports
        )

      );


      /* =====================================
         NOTIFY INVESTIGATOR PAGE
      ===================================== */

      window.dispatchEvent(

        new CustomEvent(
          "mplads-report-submitted",

          {
            detail:
              newReport,
          }

        )

      );


      /* =====================================
         SUCCESS CALLBACK
      ===================================== */

      if (onReportSuccess) {

        onReportSuccess(
          newReport
        );

      }


    }, 1800);


  } catch (error) {


    console.error(
      "Report submission error:",
      error
    );


    alert(
      "Unable to submit report. Please try again."
    );


    setIsSubmitting(false);

    setReportSubmitted(false);

    setSliderPosition(0);

  }


  /* =====================================
     CLOSE MODAL
  ===================================== */

  setTimeout(() => {

    setIsSuccess(false);

    setReportSubmitted(false);

    handleClose();

  }, 4500);

};
  /* =========================================
     DRAG START
  ========================================= */

  const handleDragStart = () => {
    if (
      isSubmitting ||
      isSuccess
    ) {
      return;
    }

    setIsDragging(true);
  };

  /* =========================================
     DRAG MOVE
  ========================================= */

  const handleDragMove = (event) => {
    if (!isDragging) return;

    const rect =
      sliderRef.current?.getBoundingClientRect();

    if (!rect) return;

    let clientX;

    if (event.touches) {
      clientX =
        event.touches[0].clientX;
    } else {
      clientX =
        event.clientX;
    }

    let position =
      clientX -
      rect.left -
      34;

    const max =
      getSliderWidth();

    position = Math.max(
      0,
      Math.min(position, max)
    );

    setSliderPosition(position);
  };

  /* =========================================
     DRAG END
  ========================================= */

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const max =
      getSliderWidth();

    if (max <= 0) return;

    const percentage =
      (sliderPosition / max) * 100;

    if (percentage >= 75) {
      setSliderPosition(max);

      submitReport();
    } else {
      setSliderPosition(0);
    }
  };

  if (!isOpen) return null;

  /* =========================================
     ISSUE OPTIONS
  ========================================= */

  const issueOptions = [
    {
      value: "delay",

      label: "Project Delay",

      description:
        "Work is delayed or stopped",

      icon: AlertTriangle,

      color:
        "hover:border-orange-300 hover:bg-orange-50",

      active:
        "border-orange-400 bg-orange-50 ring-4 ring-orange-100",
    },

    {
      value: "quality",

      label: "Poor Quality",

      description:
        "Construction quality concerns",

      icon: ShieldAlert,

      color:
        "hover:border-red-300 hover:bg-red-50",

      active:
        "border-red-400 bg-red-50 ring-4 ring-red-100",
    },

    {
      value: "financial",

      label: "Financial Issue",

      description:
        "Possible fund irregularity",

      icon: Flag,

      color:
        "hover:border-purple-300 hover:bg-purple-50",

      active:
        "border-purple-400 bg-purple-50 ring-4 ring-purple-100",
    },

    {
      value: "other",

      label: "Other Issue",

      description:
        "Any other project concern",

      icon: AlertTriangle,

      color:
        "hover:border-blue-300 hover:bg-blue-50",

      active:
        "border-blue-400 bg-blue-50 ring-4 ring-blue-100",
    },
  ];

  /* =========================================
     RED FILL CALCULATION
  ========================================= */

  const maxSliderWidth =
    getSliderWidth();

  const fillPercentage =
    maxSliderWidth > 0
      ? Math.min(
          100,
          ((sliderPosition + 68) /
            (maxSliderWidth + 68)) *
            100
        )
      : 0;

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        bg-slate-950/60
        p-3
        backdrop-blur-md
        sm:p-6
      "
    >
      {/* BACKDROP */}

      <div
        className="absolute inset-0"
        onClick={handleClose}
      />

      {/* MODAL */}

      <div
        className="
          relative
          z-10
          flex
          max-h-[92vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-[30px]
          bg-white
          shadow-[0_30px_100px_rgba(15,23,42,0.4)]
          animate-[modalIn_0.35s_ease-out]
        "
      >
        {/* TOP LINE */}

        <div
          className="
            h-2
            shrink-0
            bg-gradient-to-r
            from-red-500
            via-orange-500
            to-red-500
          "
        />

        {/* SCROLLABLE CONTENT */}

        <div
          className="
            custom-scrollbar
            flex-1
            overflow-y-auto
            overscroll-contain
            scroll-smooth
          "
        >
          <div className="p-5 sm:p-8">

            {/* HEADER */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-50
                    text-red-600
                    transition-all
                    duration-300
                    hover:rotate-6
                    hover:scale-110
                  "
                >
                  <Flag size={23} />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-red-500
                    "
                  >
                    Public Reporting Portal
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-black
                      text-slate-800
                      sm:text-3xl
                    "
                  >
                    Report Project Issue
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    Help improve transparency by
                    reporting an issue with this
                    MPLADS project.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
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
                  transition-all
                  duration-300
                  hover:rotate-90
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* PROJECT INFORMATION */}

            <div
              className="
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  border-b
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                "
              >
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Reporting Project
                </span>

                <span
                  className="
                    rounded-full
                    bg-red-50
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-red-600
                  "
                >
                  {project?.id}
                </span>
              </div>

              <div className="p-5">
                <h3
                  className="
                    text-lg
                    font-bold
                    text-slate-800
                  "
                >
                  {project?.name}
                </h3>

                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    gap-4
                    text-sm
                    text-slate-500
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <MapPin size={16} />

                    {project?.district},{" "}
                    {project?.state}
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Flag size={16} />

                    {project?.category}
                  </div>
                </div>
              </div>
            </div>

            {/* ISSUE TYPE */}

            <div className="mt-7">
              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                "
              >
                What is the issue?
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Select the issue that best
                describes your concern.
              </p>

              <div
                className="
                  mt-4
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                {issueOptions.map((issue) => {
                  const Icon = issue.icon;

                  const active =
                    issueType === issue.value;

                  return (
                    <button
                      key={issue.value}
                      type="button"
                      onClick={() =>
                        setIssueType(
                          issue.value
                        )
                      }
                      className={`
                        group
                        relative
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg

                        ${
                          active
                            ? issue.active
                            : `
                              border-slate-200
                              bg-white
                              ${issue.color}
                            `
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-100
                          text-slate-600
                          transition-all
                          duration-300
                          group-hover:scale-110
                        "
                      >
                        <Icon size={20} />
                      </div>

                      <div>
                        <p
                          className="
                            font-bold
                            text-slate-800
                          "
                        >
                          {issue.label}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          {issue.description}
                        </p>
                      </div>

                      {active && (
                        <div
                          className="
                            absolute
                            right-4
                            top-4
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-800
                            text-white
                          "
                        >
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-7">
              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >
                <label
                  className="
                    font-bold
                    text-slate-800
                  "
                >
                  Describe the issue
                </label>

                <span
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  {description.length}/500
                </span>
              </div>

              <textarea
                value={description}
                maxLength={500}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe what you observed, where you observed it, and any other important details..."
                className="
                  min-h-[150px]
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                  text-sm
                  leading-relaxed
                  text-slate-700
                  outline-none
                  transition-all
                  duration-300
                  hover:border-slate-300
                  focus:border-red-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-red-100
                "
              />
            </div>

            {/* IMAGE UPLOAD */}

            <div className="mt-7">
              <h3
                className="
                  font-bold
                  text-slate-800
                "
              >
                Upload Evidence
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Add a photo of the project or
                issue. Maximum size: 10 MB.
              </p>

              {!imagePreview && (
                <label
                  className="
                    group
                    mt-4
                    flex
                    min-h-[190px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border-2
                    border-dashed
                    border-slate-200
                    bg-slate-50
                    p-6
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-red-300
                    hover:bg-red-50
                    hover:shadow-lg
                  "
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      text-slate-500
                      shadow-sm
                      transition-all
                      duration-300
                      group-hover:scale-110
                      group-hover:bg-red-500
                      group-hover:text-white
                    "
                  >
                    <Upload size={27} />
                  </div>

                  <h4
                    className="
                      mt-4
                      font-bold
                      text-slate-700
                    "
                  >
                    Click to upload evidence
                  </h4>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-400
                    "
                  >
                    JPG, PNG, WEBP supported
                  </p>
                </label>
              )}

              {imagePreview && (
                <div
                  className="
                    relative
                    mt-4
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-slate-950
                    shadow-lg
                  "
                >
                  <img
                    src={imagePreview}
                    alt="Evidence preview"
                    className="
                      h-[220px]
                      w-full
                      object-cover
                      transition-all
                      duration-700
                      hover:scale-105
                      sm:h-[280px]
                    "
                  />

                  {/* PROCESSING */}

                  {isProcessingImage && (
                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                        bg-slate-950/75
                        p-6
                        backdrop-blur-sm
                      "
                    >
                      <div
                        className="
                          absolute
                          left-0
                          right-0
                          h-[3px]
                          animate-[scan_2s_linear_infinite]
                          bg-gradient-to-r
                          from-transparent
                          via-red-400
                          to-transparent
                        "
                      />

                      <div
                        className="
                          flex
                          h-20
                          w-20
                          animate-spin
                          items-center
                          justify-center
                          rounded-full
                          border-4
                          border-white/20
                          border-t-red-400
                        "
                      >
                        <Camera
                          size={28}
                          className="text-white"
                        />
                      </div>

                      <h4
                        className="
                          mt-6
                          text-lg
                          font-bold
                          text-white
                        "
                      >
                        Processing Evidence
                      </h4>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-slate-200
                        "
                      >
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        {processingStep}
                      </div>

                      <div
                        className="
                          mt-6
                          h-2
                          w-full
                          max-w-sm
                          overflow-hidden
                          rounded-full
                          bg-white/20
                        "
                      >
                        <div
                          className="
                            h-full
                            animate-[progress_3.3s_ease-in-out]
                            bg-gradient-to-r
                            from-red-500
                            via-orange-400
                            to-green-400
                          "
                        />
                      </div>
                    </div>
                  )}

                  {/* READY */}

                  {!isProcessingImage && (
                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        flex
                        items-center
                        justify-between
                        bg-gradient-to-t
                        from-slate-950/95
                        to-transparent
                        p-5
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
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-green-500
                            text-white
                          "
                        >
                          <Check size={19} />
                        </div>

                        <div>
                          <p
                            className="
                              font-bold
                              text-white
                            "
                          >
                            Evidence Ready
                          </p>

                          <p
                            className="
                              text-xs
                              text-slate-300
                            "
                          >
                            Image successfully processed
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-white/10
                          text-white
                          transition-all
                          duration-300
                          hover:rotate-90
                          hover:bg-red-500
                        "
                      >
                        <X size={19} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PRIVACY */}

            <div
              className="
                mt-7
                flex
                gap-3
                rounded-2xl
                border
                border-blue-100
                bg-blue-50
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
                  rounded-xl
                  bg-white
                  text-blue-600
                "
              >
                <ShieldAlert size={18} />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-bold
                    text-blue-900
                  "
                >
                  Your report helps improve accountability
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-blue-700
                  "
                >
                  Submitted evidence will be reviewed
                  by the relevant authorities.
                </p>
              </div>
            </div>

            {/* =====================================
                SWIPE TO SUBMIT
            ====================================== */}

            <div className="mt-8">
              <p
                className="
                  mb-3
                  text-center
                  text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-400
                "
              >
                Swipe to submit your report
              </p>

              <div
                ref={sliderRef}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                className={`
                  relative
                  mx-auto
                  flex
                  h-[68px]
                  w-[300px]
                  select-none
                  items-center
                  overflow-hidden
                  rounded-2xl
                  border
                  transition-all
                  duration-300
                  

                  ${
                    isSuccess
                      ? "border-green-500 bg-green-500"
                      : isSubmitting
                      ? "border-red-500 bg-red-500"
                      : "border-red-200 bg-red-50"
                  }
                `}
              >
                {/* =================================
                    RED PROGRESS FILL
                ================================== */}

                {!isSubmitting &&
                  !isSuccess && (
                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        top-0
                        z-0
                        bg-gradient-to-r
                        from-red-700
                        via-red-600
                        to-red-500
                        transition-[width]
                        duration-75
                      "
                      style={{
                        width: `${fillPercentage}%`,
                      }}
                    />
                  )}

                {/* NORMAL TEXT */}

                {!isSuccess &&
                  !isSubmitting && (
                    <div
                      className="
                        absolute
                        inset-0
                        z-10
                        flex
                        items-center
                        justify-center
                        gap-2
                        pl-12
                        pointer-events-none
                      "
                    >
                      <span
                        className={`
                          font-bold
                          transition-colors
                          duration-200

                          ${
                            fillPercentage > 45
                              ? "text-white"
                              : "text-red-600"
                          }
                        `}
                      >
                        Swipe to Submit Report
                      </span>

                      <ChevronRight
                        size={18}
                        className={`
                          animate-pulse
                          transition-colors

                          ${
                            fillPercentage > 45
                              ? "text-white"
                              : "text-red-500"
                          }
                        `}
                      />
                    </div>
                  )}

                {/* SUBMITTING */}

                {isSubmitting && (
                  <div
                    className="
                      absolute
                      inset-0
                      z-30
                      flex
                      items-center
                      justify-center
                      gap-3
                      text-white
                    "
                  >
                    <Loader2
                      size={21}
                      className="animate-spin"
                    />

                    <span className="font-bold">
                      Submitting Report...
                    </span>
                  </div>
                )}

                {/* SUCCESS */}

                {isSuccess && (
                  <div
                    className="
                      absolute
                      inset-0
                      z-30
                      flex
                      items-center
                      justify-center
                      gap-3
                      text-white
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-white/20
                      "
                    >
                      <Check size={18} />
                    </div>

                    <span className="font-bold">
                      Report Submitted Successfully!
                    </span>
                  </div>
                )}

                {/* DRAG BUTTON */}

                {!isSubmitting &&
                  !isSuccess && (
                    <button
                      type="button"
                      onMouseDown={
                        handleDragStart
                      }
                      onTouchStart={
                        handleDragStart
                      }
                      className="
                        absolute
                        left-[5px]
                        z-20
                        flex
                        h-[58px]
                        w-[58px]
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-700
                        text-white
                        shadow-lg
                        transition-transform
                        duration-75
                        hover:bg-red-800
                        active:scale-95
                        cursor-grab
                        active:cursor-grabbing
                      "
                      style={{
                        transform: `
                          translateX(${sliderPosition}px)
                        `,
                      }}
                    >
                      <ChevronRight size={25} />
                    </button>
                  )}
              </div>

              <p
                className="
                  mt-3
                  text-center
                  text-xs
                  text-slate-400
                "
              >
                Drag the arrow to the right to
                confirm your report.
              </p>
            </div>

            {/* CANCEL */}

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="
                mt-5
                w-full
                rounded-xl
                py-3
                text-sm
                font-semibold
                text-slate-500
                transition-all
                duration-300
                hover:bg-slate-100
                hover:text-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel Report
            </button>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}

      <style>
        {`
          @keyframes modalIn {
            0% {
              opacity: 0;
              transform:
                translateY(30px)
                scale(0.96);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          @keyframes scan {
            0% {
              top: 0%;
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            85% {
              opacity: 1;
            }

            100% {
              top: 100%;
              opacity: 0;
            }
          }

          @keyframes progress {
            0% {
              width: 0%;
            }

            100% {
              width: 100%;
            }
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 7px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 20px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
}