import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../utils/toast";
import TermsModal from "../components/TermsModal"; // ✅ Import TermsModal

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showTerms, setShowTerms] = useState(false); // ✅ State para sa Terms Modal
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ✅ React-controlled Dropdown

    // User State
    const [user, setUser] = useState({
        name: "Admin User",
        email: "admin@test.com",
        role: "Administrator",
    });

    // 1. LOAD USER FROM STORAGE (Pagka-load ng page)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // 2. LOGOUT LOGIC
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            Toast.fire({ icon: "success", title: "Logged out successfully" });
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
            // Force logout kahit error
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    // Helper para sa Active Link style
    const isActive = (path) =>
        location.pathname === path
            ? "bg-white text-primary fw-bold shadow-sm"
            : "text-white";

    return (
        <div
            className="d-flex"
            style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}
        >
            {/* 🟦 SIDEBAR */}
            <div
                className="d-flex flex-column flex-shrink-0 p-3 text-white shadow"
                style={{
                    width: isSidebarOpen ? "280px" : "80px",
                    backgroundColor: "#2C3E50",
                    transition: "all 0.3s",
                    position: "relative", // Para sa positioning ng footer content
                }}
            >
                {/* BRAND / LOGO */}
                <div
                    className="d-flex align-items-center mb-4 text-white text-decoration-none"
                    style={{ overflow: "hidden" }}
                >
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        width="40"
                        className="me-2 flex-shrink-0"
                    />
                    {isSidebarOpen && (
                        <div className="fade-in">
                            <span className="fs-5 fw-bold d-block">
                                SmartEnroll
                            </span>
                        </div>
                    )}
                </div>

                <hr className="border-secondary" />

                {/* NAVIGATION LINKS */}
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mb-2">
                        <Link
                            to="/admin/dashboard"
                            className={`nav-link d-flex align-items-center gap-3 ${isActive(
                                "/admin/dashboard"
                            )}`}
                        >
                            <i className="bi bi-speedometer2 fs-5"></i>{" "}
                            {isSidebarOpen && "Dashboard"}
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link
                            to="/admin/users"
                            className={`nav-link d-flex align-items-center gap-3 ${isActive(
                                "/admin/users"
                            )}`}
                        >
                            <i className="bi bi-people-fill fs-5"></i>{" "}
                            {isSidebarOpen && "Users Management"}
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link
                            to="/admin/students"
                            className={`nav-link d-flex align-items-center gap-3 ${isActive(
                                "/admin/students"
                            )}`}
                        >
                            <i className="bi bi-mortarboard-fill fs-5"></i>{" "}
                            {isSidebarOpen && "Students"}
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link
                            to="/admin/strands"
                            className={`nav-link d-flex align-items-center gap-3 ${isActive(
                                "/admin/strands"
                            )}`}
                        >
                            <i className="bi bi-diagram-3-fill fs-5"></i>{" "}
                            {isSidebarOpen && "Strands"}
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link
                            to="/admin/sections"
                            className={`nav-link d-flex align-items-center gap-3 ${isActive(
                                "/admin/sections"
                            )}`}
                        >
                            <i className="bi bi-grid-3x3-gap-fill fs-5"></i>{" "}
                            {isSidebarOpen && "Sections"}
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link
                            to="/admin/subjects"
                            className={`nav-link d-flex align-items-center gap-3 ${isActive(
                                "/admin/subjects"
                            )}`}
                        >
                            <i className="bi bi-book-fill fs-5"></i>{" "}
                            {isSidebarOpen && "Subjects"}
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link
                            to="/admin/settings"
                            className={`nav-link d-flex align-items-center gap-3 ${isActive(
                                "/admin/settings"
                            )}`}
                        >
                            <i className="bi bi-gear-fill fs-5"></i>{" "}
                            {isSidebarOpen && "Settings"}
                        </Link>
                    </li>
                </ul>

                <hr className="border-secondary" />

                {/* ✅ USER PROFILE & DROPDOWN (SA BABA) */}
                <div className="dropdown position-relative">
                    <div
                        className="d-flex align-items-center text-white text-decoration-none cursor-pointer p-2 rounded hover-bg-dark"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{ cursor: "pointer" }}
                    >
                        {/* Dynamic Avatar based on Name */}
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt="User"
                            width="40"
                            height="40"
                            className="rounded-circle me-2 border border-2 border-white"
                        />

                        {isSidebarOpen && (
                            <div className="fade-in overflow-hidden">
                                <strong
                                    className="d-block text-truncate"
                                    style={{ maxWidth: "180px" }}
                                >
                                    {user.name}
                                </strong>
                                <small
                                    className="text-white-50 text-uppercase"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    {user.role}
                                </small>
                            </div>
                        )}

                        {isSidebarOpen && (
                            <i
                                className={`bi bi-chevron-${
                                    isDropdownOpen ? "up" : "down"
                                } ms-auto small text-white-50`}
                            ></i>
                        )}
                    </div>

                    {/* CUSTOM DROPDOWN MENU (Dropup style) */}
                    {isDropdownOpen && (
                        <div
                            className="bg-white text-dark rounded shadow position-absolute w-100 p-2 fade-in"
                            style={{
                                bottom: "100%",
                                left: 0,
                                marginBottom: "10px",
                                zIndex: 1000,
                            }}
                        >
                            <div className="px-3 py-2 border-bottom mb-2 bg-light rounded">
                                <span className="d-block small text-muted fw-bold">
                                    SIGNED IN AS
                                </span>
                                <span className="d-block text-truncate fw-bold text-primary">
                                    {user.email}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                            >
                                <i className="bi bi-box-arrow-right"></i> Sign
                                out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ⬜ CONTENT AREA */}
            <div
                className="flex-grow-1 d-flex flex-column"
                style={{ overflowY: "auto", height: "100vh" }}
            >
                {/* HEADER */}
                <header
                    className="py-3 px-4 border-bottom bg-white d-flex justify-content-between align-items-center sticky-top shadow-sm"
                    style={{ zIndex: 900 }}
                >
                    <button
                        className="btn btn-link text-dark p-0 border-0"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <i className="bi bi-list fs-3"></i>
                    </button>
                    <div className="fw-bold text-secondary d-flex align-items-center gap-2">
                        <i className="bi bi-calendar-check"></i>
                        <span>SCHOOL YEAR: 2025-2026 | 1st Semester</span>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="p-4 flex-grow-1">
                    <Outlet />
                </main>

                {/* FOOTER */}
                <footer className="py-3 bg-white text-center text-muted small border-top mt-auto">
                    <div className="container">
                        <span>
                            © {new Date().getFullYear()} SmartEnroll System
                        </span>
                        <span className="mx-2">|</span>
                        {/* ✅ TERMS TRIGGER */}
                        <button
                            className="btn btn-link text-decoration-none text-muted small p-0 fw-bold"
                            onClick={() => setShowTerms(true)}
                        >
                            Terms & Policy
                        </button>
                    </div>
                </footer>
            </div>

            {/* ✅ TERMS MODAL COMPONENT */}
            <TermsModal
                show={showTerms}
                handleClose={() => setShowTerms(false)}
            />
        </div>
    );
}
