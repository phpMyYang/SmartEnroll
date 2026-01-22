import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

// Components
import LRNCheckModal from "../components/LRNCheckModal";
import EnrollmentWizard from "../components/EnrollmentWizard";
import Maintenance from "./Maintenance";

export default function Landing() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLRN, setShowLRN] = useState(false);
    const [showWizard, setShowWizard] = useState(false);
    const [wizardData, setWizardData] = useState(null);
    const [searchLrn, setSearchLrn] = useState("");

    useEffect(() => {
        axios
            .get("/api/public/settings")
            .then((res) => {
                setSettings(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (!loading && settings?.maintenance_mode == 1) return <Maintenance />;

    const isOpen =
        settings?.start_date &&
        moment().isBetween(settings.start_date, settings.end_date, "day", "[]");

    // --- REFRESH HANDLER ---
    const handleCloseAndRefresh = () => {
        setShowLRN(false);
        setShowWizard(false);
        setWizardData(null);
        window.location.reload();
    };

    return (
        <div
            className="position-relative w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden font-monospace"
            style={{
                minHeight: "85vh",
                backgroundColor: "#FFE2AF",
                backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
            }}
        >
            <style>
                {`
                    /* --- Animations --- */
                    @keyframes float { 0% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-15px) rotate(1deg); } 100% { transform: translateY(0px) rotate(-1deg); } }
                    @keyframes float-reverse { 0% { transform: translateY(0px) rotate(1deg); } 50% { transform: translateY(15px) rotate(-1deg); } 100% { transform: translateY(0px) rotate(1deg); } }
                    .float-anim { animation: float 6s ease-in-out infinite; }
                    .float-anim-rev { animation: float-reverse 7s ease-in-out infinite; }

                    /* School Icons Animation */
                    @keyframes float-icon { 
                        0% { transform: translateY(0px) rotate(0deg); } 
                        50% { transform: translateY(-20px) rotate(10deg); } 
                        100% { transform: translateY(0px) rotate(0deg); } 
                    }
                    
                    /* Background Elements - Distributed, Not Clustered */
                    .bg-element { 
                        position: absolute; 
                        z-index: 0; 
                        pointer-events: none;
                        color: #2d3436; 
                    }
                    .float-icon { 
                        animation: float-icon 12s ease-in-out infinite; 
                        opacity: 0.07; /* Subtle Visibility */
                    }
                    .float-shape {
                        opacity: 0.25;
                        animation: float-icon 15s ease-in-out infinite;
                    }

                    /* Shapes */
                    .shape-circle { border-radius: 50%; }
                    .shape-square { transform: rotate(15deg); }
                    .shape-triangle {
                        width: 0; height: 0;
                        border-left: 25px solid transparent;
                        border-right: 25px solid transparent;
                        border-bottom: 45px solid; 
                    }
                    .shape-cross {
                        position: relative;
                        width: 40px; height: 40px;
                    }
                    .shape-cross:before, .shape-cross:after {
                        position: absolute; content: ""; background: currentColor;
                    }
                    .shape-cross:before { width: 10px; height: 40px; left: 15px; }
                    .shape-cross:after { width: 40px; height: 10px; top: 15px; }

                    /* --- Card Positioning (Pushed further to edges to avoid crowding center) --- */
                    @media (min-width: 992px) {
                        /* Top Left - Moved closer to edge */
                        .pos-1 { position: absolute; top: 5%; left: 3%; width: 240px; transform: rotate(-3deg); }
                        /* Top Right - Moved closer to edge */
                        .pos-2 { position: absolute; top: 8%; right: 3%; width: 240px; transform: rotate(3deg); }
                        /* Bottom Left - Moved closer to edge */
                        .pos-3 { position: absolute; bottom: 5%; left: 3%; width: 240px; transform: rotate(2deg); }
                        /* Bottom Right - Moved closer to edge */
                        .pos-4 { position: absolute; bottom: 3%; right: 3%; width: 300px; transform: rotate(-1deg); }
                    }

                    /* --- Components --- */
                    .retro-card {
                        background: white;
                        border: 3px solid black;
                        box-shadow: 8px 8px 0px black;
                        transition: all 0.3s ease;
                    }
                    .retro-card:hover {
                        transform: scale(1.05) rotate(0deg) !important;
                        box-shadow: 12px 12px 0px black;
                        z-index: 50;
                    }
                    
                    /* Hero Button */
                    .btn-hero {
                        background-color: #F4D03F;
                        color: black;
                        border: 3px solid black;
                        box-shadow: 6px 6px 0px black;
                        transform: translate(0, 0);
                        transition: all 0.2s ease;
                    }
                    .btn-hero:hover {
                        transform: translate(6px, 6px); 
                        box-shadow: 0px 0px 0px black;
                        background-color: #FFFFFF; 
                    }
                    .btn-hero.disabled {
                        background-color: #e0e0e0;
                        color: #888;
                        box-shadow: 4px 4px 0px #888;
                        transform: none !important;
                    }
                `}
            </style>

            <div className="container position-relative h-100 py-5">
                {/* =================================================================================
                    BACKGROUND LAYER: EVENLY DISTRIBUTED (HIWALAY-HIWALAY)
                   ================================================================================= */}

                {/* --- FAR CORNERS (Likod ng Cards) --- */}
                <i
                    className="bi bi-book-fill bg-element float-icon display-1"
                    style={{ top: "2%", left: "2%", opacity: "0.04" }}
                ></i>
                <i
                    className="bi bi-mortarboard-fill bg-element float-icon display-1"
                    style={{ top: "3%", right: "2%", opacity: "0.04" }}
                ></i>
                <i
                    className="bi bi-globe-americas bg-element float-icon display-1"
                    style={{ bottom: "2%", left: "2%", opacity: "0.04" }}
                ></i>
                <i
                    className="bi bi-award-fill bg-element float-icon display-1"
                    style={{ bottom: "2%", right: "2%", opacity: "0.04" }}
                ></i>

                {/* --- UPPER AREAS (Away from Center) --- */}
                <div
                    className="bg-element float-shape shape-circle"
                    style={{
                        width: "60px",
                        height: "60px",
                        top: "15%",
                        left: "25%",
                        backgroundColor: "#F96E5B",
                    }}
                ></div>
                <i
                    className="bi bi-calculator-fill bg-element float-icon display-4"
                    style={{ top: "12%", left: "35%" }}
                ></i>

                <div
                    className="bg-element float-shape shape-square"
                    style={{
                        width: "50px",
                        height: "50px",
                        top: "18%",
                        right: "25%",
                        backgroundColor: "#3F9AAE",
                    }}
                ></div>
                <i
                    className="bi bi-backpack-fill bg-element float-icon display-4"
                    style={{ top: "10%", right: "35%" }}
                ></i>

                {/* --- MIDDLE AREAS (Sides) --- */}
                <i
                    className="bi bi-pencil-fill bg-element float-icon display-3"
                    style={{
                        top: "45%",
                        left: "5%",
                        transform: "rotate(45deg)",
                    }}
                ></i>
                <div
                    className="bg-element float-shape shape-triangle"
                    style={{
                        borderBottomColor: "#F4D03F",
                        top: "50%",
                        left: "15%",
                    }}
                ></div>

                <i
                    className="bi bi-clipboard-data-fill bg-element float-icon display-3"
                    style={{ top: "48%", right: "5%" }}
                ></i>
                <div
                    className="bg-element float-shape shape-cross"
                    style={{ top: "45%", right: "15%", color: "#3F9AAE" }}
                ></div>

                {/* --- LOWER AREAS (Away from Center) --- */}
                <i
                    className="bi bi-laptop bg-element float-icon display-4"
                    style={{ bottom: "25%", left: "25%" }}
                ></i>
                <div
                    className="bg-element float-shape shape-square"
                    style={{
                        width: "40px",
                        height: "40px",
                        bottom: "15%",
                        left: "35%",
                        backgroundColor: "#000",
                        opacity: "0.1",
                    }}
                ></div>

                <i
                    className="bi bi-alarm-fill bg-element float-icon display-4"
                    style={{ bottom: "25%", right: "30%" }}
                ></i>
                <div
                    className="bg-element float-shape shape-circle"
                    style={{
                        width: "30px",
                        height: "30px",
                        bottom: "15%",
                        right: "40%",
                        backgroundColor: "#F96E5B",
                    }}
                ></div>

                {/* --- FILLERS (Randomly placed but spaced) --- */}
                <i
                    className="bi bi-star-fill bg-element float-icon h3"
                    style={{ top: "30%", left: "10%", opacity: "0.1" }}
                ></i>
                <i
                    className="bi bi-music-note-beamed bg-element float-icon h2"
                    style={{ top: "25%", right: "10%", opacity: "0.1" }}
                ></i>
                <i
                    className="bi bi-lightbulb-fill bg-element float-icon h3"
                    style={{ bottom: "40%", left: "10%", opacity: "0.1" }}
                ></i>
                <i
                    className="bi bi-palette-fill bg-element float-icon h3"
                    style={{ bottom: "45%", right: "8%", opacity: "0.1" }}
                ></i>

                {/* =================================================================================
                    MAIN CONTENT 
                   ================================================================================= */}

                {/* --- CARDS (Now Pushed to Edges) --- */}

                {/* Pos 1: Top Left */}
                <div className="retro-card p-4 pos-1 float-anim mb-4 mx-auto bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-warning border border-2 border-dark p-2 rounded text-dark">
                            <i className="bi bi-lightning-charge-fill fs-3"></i>
                        </div>
                        <div>
                            <h6 className="fw-black m-0 text-uppercase">
                                FAST & EASY
                            </h6>
                            <small className="text-muted fw-bold">
                                Enroll in minutes.
                            </small>
                        </div>
                    </div>
                </div>

                {/* Pos 2: Top Right */}
                <div className="retro-card p-4 pos-2 float-anim-rev mb-4 mx-auto bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-info border border-2 border-dark p-2 rounded text-white">
                            <i className="bi bi-phone-fill fs-3"></i>
                        </div>
                        <div>
                            <h6 className="fw-black m-0 text-uppercase">
                                ACCESSIBLE
                            </h6>
                            <small className="text-muted fw-bold">
                                Anytime, anywhere.
                            </small>
                        </div>
                    </div>
                </div>

                {/* Pos 3: Bottom Left */}
                <div className="retro-card p-4 pos-3 float-anim mb-4 mx-auto bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-success border border-2 border-dark p-2 rounded text-white">
                            <i className="bi bi-shield-lock-fill fs-3"></i>
                        </div>
                        <div>
                            <h6 className="fw-black m-0 text-uppercase">
                                SECURE DATA
                            </h6>
                            <small className="text-muted fw-bold">
                                Encrypted info.
                            </small>
                        </div>
                    </div>
                </div>

                {/* --- HERO CONTENT (CENTER) --- */}
                <div className="text-center position-relative z-index-10 mt-5 mt-lg-0 pt-lg-5 px-lg-5">
                    <div className="d-inline-block bg-white border border-2 border-dark px-3 py-1 mb-3 shadow-sm">
                        <span
                            className="fw-bold text-uppercase text-dark small"
                            style={{ letterSpacing: "2px" }}
                        >
                            🚀 WELCOME TO SMARTENROLL
                        </span>
                    </div>
                    <h1
                        className="display-1 fw-black text-uppercase mb-4"
                        style={{
                            color: "#2d3436",
                            textShadow: "4px 4px 0 #3F9AAE",
                            lineHeight: "0.9",
                            letterSpacing: "-2px",
                        }}
                    >
                        YOUR FUTURE <br /> STARTS HERE
                    </h1>
                    <p
                        className="lead fw-bold text-muted mx-auto mb-5"
                        style={{ maxWidth: "600px" }}
                    >
                        The official online enrollment portal. Manage your
                        academic journey with ease and security.
                    </p>
                    <button
                        className={`btn btn-lg rounded-pill px-5 py-3 fw-black btn-hero d-inline-flex align-items-center gap-2 ${isOpen ? "" : "disabled"}`}
                        onClick={() => setShowLRN(true)}
                        disabled={!isOpen}
                    >
                        {isOpen ? (
                            <>
                                ENROLL NOW{" "}
                                <i className="bi bi-arrow-right-circle-fill"></i>
                            </>
                        ) : (
                            <>
                                ENROLLMENT CLOSED{" "}
                                <i className="bi bi-lock-fill"></i>
                            </>
                        )}
                    </button>
                </div>

                {/* --- ADVISORY (Bottom Right) --- */}
                <div className="retro-card p-0 pos-4 float-anim-rev mt-5 mx-auto bg-white">
                    <div className="bg-dark text-white p-3 border-bottom border-3 border-dark d-flex align-items-center gap-2">
                        <i className="bi bi-megaphone-fill text-warning"></i>
                        <h6 className="fw-black m-0 text-uppercase small">
                            ADVISORY BOARD
                        </h6>
                    </div>
                    <div className="p-4 text-center">
                        {loading ? (
                            <div className="spinner-border spinner-border-sm"></div>
                        ) : isOpen ? (
                            <>
                                <h2 className="fw-black m-0 display-6">
                                    {settings?.school_year}
                                </h2>
                                <span className="badge bg-white text-dark border border-dark rounded-0 mb-3">
                                    {settings?.semester}
                                </span>
                                <div className="small fw-bold text-success text-uppercase border-top border-dark pt-2 mt-2">
                                    <i className="bi bi-calendar-check me-1"></i>
                                    OPEN UNTIL{" "}
                                    {moment(settings?.end_date).format("MMM D")}
                                </div>
                            </>
                        ) : (
                            <div className="opacity-50 py-2">
                                <h5 className="fw-black text-uppercase m-0">
                                    CLOSED
                                </h5>
                                <small className="text-muted">
                                    Please wait for announcements.
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <LRNCheckModal
                show={showLRN}
                onClose={handleCloseAndRefresh}
                onProceed={(data) => {
                    setWizardData(data);
                    setShowLRN(false);
                    setShowWizard(true);
                }}
            />
            {showWizard && (
                <EnrollmentWizard
                    initialData={wizardData}
                    settings={settings}
                    onClose={handleCloseAndRefresh}
                />
            )}
        </div>
    );
}
