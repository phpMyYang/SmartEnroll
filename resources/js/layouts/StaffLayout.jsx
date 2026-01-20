import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../utils/toast";
import TermsModal from "../components/TermsModal";

export default function StaffLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // User State
    const [user, setUser] = useState({
        name: "Staff User",
        email: "staff@test.com",
        role: "Staff",
    });

    // Dynamic Header State
    const [currentSem, setCurrentSem] = useState({
        school_year: "Loading...",
        semester: "",
    });

    // UI States
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // FETCH SETTINGS
    const fetchSettings = async () => {
        try {
            const res = await axios.get("/api/settings");
            if (res.data) {
                setCurrentSem({
                    school_year: res.data.school_year || "N/A",
                    semester: res.data.semester || "",
                });
            }
        } catch (error) {
            console.error("Failed to load settings");
            setCurrentSem({ school_year: "N/A", semester: "Offline" });
        }
    };

    useEffect(() => {
        // 1. Load User
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        // 2. Fetch Settings
        fetchSettings();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            Toast.fire({ icon: "success", title: "Logged out successfully" });
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    // Helper para sa Active Link style
    const isActive = (path) => location.pathname === path;

    return (
        // 1. FIXED HEIGHT CONTAINER (No Page Scroll)
        <div
            className="d-flex flex-column"
            style={{
                height: "100vh", // Lock height to screen
                overflow: "hidden", // Disable body scroll
                backgroundColor: "var(--color-bg)",
            }}
        >
            {/* 2. FIXED HEADER (flexShrink: 0 prevents shrinking) */}
            <nav
                className="navbar navbar-expand-lg py-0 px-4 border-bottom border-2 border-dark"
                style={{
                    backgroundColor: "var(--color-primary)",
                    zIndex: 1000,
                    boxShadow: "0 4px 0 rgba(0,0,0,0.1)",
                    height: "80px",
                    flexShrink: 0, // IMPORTANT: Prevents squishing
                }}
            >
                <div className="container-fluid h-100 d-flex align-items-center justify-content-between">
                    {/* LEFT: BRANDING */}
                    <Link
                        to="/staff/dashboard"
                        className="d-flex align-items-center text-decoration-none gap-3 h-100"
                    >
                        <div
                            className="bg-white p-1 border border-2 border-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: "50px", height: "50px" }}
                        >
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                            <span
                                className="fw-black text-uppercase lh-1 text-white"
                                style={{
                                    fontSize: "1.5rem",
                                    letterSpacing: "1px",
                                    textShadow: "3px 3px 0 #000",
                                }}
                            >
                                SmartEnroll
                            </span>
                            <span
                                className="small fw-bold font-monospace text-uppercase"
                                style={{
                                    letterSpacing: "2px",
                                    color: "#F4D03F",
                                    textShadow: "1px 1px 0 #000",
                                }}
                            >
                                Staff Portal
                            </span>
                        </div>
                    </Link>

                    {/* CENTER: SCHOOL YEAR BADGE */}
                    <div
                        className="d-none d-lg-flex align-items-center gap-2 px-3 py-1 rounded shadow-sm"
                        style={{
                            border: "2px solid black",
                            backgroundColor: "#FFE2AF", // Cream Background
                            boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                        }}
                    >
                        <i className="bi bi-calendar-check-fill text-dark"></i>
                        <span
                            style={{
                                fontFamily: "monospace",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                color: "#000",
                            }}
                        >
                            S.Y. {currentSem.school_year} |{" "}
                            {currentSem.semester}
                        </span>
                    </div>

                    {/* RIGHT: USER PROFILE */}
                    <div className="position-relative">
                        <div
                            className="d-flex align-items-center cursor-pointer gap-3 px-3 py-2 rounded bg-white border border-2 border-dark"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                cursor: "pointer",
                                boxShadow: "3px 3px 0 #000",
                                transition: "all 0.1s",
                            }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform =
                                    "translate(2px, 2px)";
                                e.currentTarget.style.boxShadow =
                                    "1px 1px 0 #000";
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform =
                                    "translate(0, 0)";
                                e.currentTarget.style.boxShadow =
                                    "3px 3px 0 #000";
                            }}
                        >
                            <div
                                className="text-end d-none d-md-block"
                                style={{ lineHeight: "1.2" }}
                            >
                                <span className="d-block fw-bold text-dark font-monospace">
                                    {user.name}
                                </span>
                                <span
                                    className="d-block text-muted text-uppercase small"
                                    style={{
                                        fontSize: "0.7rem",
                                        fontWeight: "800",
                                    }}
                                >
                                    {user.role}
                                </span>
                            </div>
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=000000&color=fff`}
                                alt="User"
                                width="40"
                                height="40"
                                className="rounded-circle border border-2 border-dark"
                            />
                            <i
                                className={`bi bi-chevron-${isDropdownOpen ? "up" : "down"} small text-dark ms-1`}
                            ></i>
                        </div>

                        {/* DROPDOWN MENU */}
                        {isDropdownOpen && (
                            <div
                                className="position-absolute bg-white border border-2 border-dark p-0 rounded shadow fade-in"
                                style={{
                                    top: "125%",
                                    right: 0,
                                    minWidth: "240px",
                                    zIndex: 1050,
                                    boxShadow: "5px 5px 0 #000",
                                }}
                            >
                                <div className="p-3 border-bottom border-dark bg-retro-bg">
                                    <small
                                        className="fw-bold text-muted d-block font-monospace"
                                        style={{ fontSize: "0.7rem" }}
                                    >
                                        SIGNED IN AS
                                    </small>
                                    <span className="fw-bold text-dark text-truncate d-block font-monospace">
                                        {user.email}
                                    </span>
                                </div>

                                <div className="p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold border-2 border-dark rounded-1 font-monospace"
                                        style={{ boxShadow: "2px 2px 0 #000" }}
                                    >
                                        <i className="bi bi-box-arrow-right"></i>{" "}
                                        SIGN OUT
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* 3. FIXED MENU BAR (Horizontal Tabs) */}
            <div
                className="bg-dark border-bottom border-2 border-dark shadow-sm pt-3"
                style={{
                    paddingBottom: "0",
                    flexShrink: 0, // IMPORTANT: Prevents shrinking
                }}
            >
                <div className="container-fluid px-4">
                    <ul
                        className="nav nav-tabs border-0 gap-1"
                        style={{
                            flexWrap: "nowrap",
                            overflowX: "auto",
                            overflowY: "hidden",
                            scrollbarWidth: "none",
                        }}
                    >
                        {[
                            {
                                path: "/staff/dashboard",
                                icon: "bi-speedometer2",
                                label: "Dashboard",
                            },
                            {
                                path: "/staff/students",
                                icon: "bi-mortarboard-fill",
                                label: "Student Records",
                            },
                            {
                                path: "/staff/strands",
                                icon: "bi-diagram-3-fill",
                                label: "Strands",
                            },
                            {
                                path: "/staff/sections",
                                icon: "bi-grid-3x3-gap-fill",
                                label: "Sections",
                            },
                            {
                                path: "/staff/subjects",
                                icon: "bi-book-fill",
                                label: "Subjects",
                            },
                            {
                                path: "/staff/reports",
                                icon: "bi-file-earmark-bar-graph-fill",
                                label: "Reports",
                            },
                        ].map((item) => {
                            const active = isActive(item.path);
                            return (
                                <li
                                    className="nav-item"
                                    key={item.path}
                                    style={{ flexShrink: 0 }}
                                >
                                    <Link
                                        to={item.path}
                                        className="nav-link px-4 py-2 fw-bold d-flex align-items-center gap-2 font-monospace text-uppercase small"
                                        style={{
                                            borderRadius: "8px 8px 0 0",
                                            border: "2px solid #000",
                                            borderBottom: active
                                                ? "2px solid #F4D03F"
                                                : "2px solid #000",
                                            backgroundColor: active
                                                ? "#F4D03F"
                                                : "#e9ecef",
                                            color: "#000",
                                            marginBottom: "-2px",
                                            zIndex: active ? 10 : 1,
                                            position: "relative",
                                            top: active ? "0" : "4px",
                                            transition: "top 0.2s",
                                        }}
                                    >
                                        <i
                                            className={`bi ${item.icon} ${active ? "text-dark" : "text-secondary"}`}
                                        ></i>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* 4. SCROLLABLE CONTENT AREA */}
            <div
                className="d-flex flex-column flex-grow-1"
                style={{
                    overflowY: "auto", // Allows scrolling only in this area
                }}
            >
                {/* MAIN CONTENT */}
                <main className="flex-grow-1 p-4">
                    <div className="container-fluid fade-in">
                        <Outlet />
                    </div>
                </main>

                {/* FOOTER (Inside scrollable area) */}
                <footer
                    className="py-3 bg-white text-center small mt-auto"
                    style={{ borderTop: "2px solid black" }}
                >
                    <div className="container font-monospace">
                        <span>
                            © {new Date().getFullYear()} SmartEnroll System
                        </span>
                        <span className="mx-2">|</span>
                        <button
                            className="btn btn-link text-dark text-decoration-none fw-bold p-0"
                            onClick={() => setShowTerms(true)}
                        >
                            Terms & Policy
                        </button>
                    </div>
                </footer>
            </div>

            <TermsModal
                show={showTerms}
                handleClose={() => setShowTerms(false)}
            />
        </div>
    );
}
