import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../utils/toast";
import TermsModal from "../components/TermsModal";

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // User State
    const [user, setUser] = useState({
        name: "Admin User",
        email: "admin@test.com",
        role: "Administrator",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
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

    // Helper para sa Active Link style (Retro Version)
    const isActive = (path) =>
        location.pathname === path
            ? "active" // The CSS .nav-link-retro.active handles the style
            : "";

    return (
        <div
            className="d-flex"
            style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}
        >
            {/* 🟦 RETRO SIDEBAR */}
            <div
                className="d-flex flex-column flex-shrink-0 p-3 sidebar-retro text-white"
                style={{
                    width: isSidebarOpen ? "280px" : "80px",
                    transition: "width 0.3s ease-in-out",
                    position: "relative",
                    zIndex: 1000,
                }}
            >
                {/* BRAND / LOGO */}
                <div
                    className="d-flex align-items-center mb-4 text-white text-decoration-none overflow-hidden"
                    style={{ height: "50px" }}
                >
                    <div className="bg-white p-1 border border-2 border-dark rounded-circle me-2 flex-shrink-0">
                        <img src="/images/logo.png" alt="Logo" width="30" />
                    </div>
                    {isSidebarOpen && (
                        <div className="fade-in">
                            <span
                                className="fs-5 fw-bold d-block text-uppercase"
                                style={{ textShadow: "2px 2px 0 #000" }}
                            >
                                SmartEnroll
                            </span>
                        </div>
                    )}
                </div>

                <hr className="border-dark opacity-100" />

                {/* NAVIGATION LINKS */}
                <ul className="nav nav-pills flex-column mb-auto">
                    {[
                        {
                            path: "/admin/dashboard",
                            icon: "bi-speedometer2",
                            label: "Dashboard",
                        },
                        {
                            path: "/admin/users",
                            icon: "bi-people-fill",
                            label: "Users Management",
                        },
                        {
                            path: "/admin/students",
                            icon: "bi-mortarboard-fill",
                            label: "Students",
                        },
                        {
                            path: "/admin/strands",
                            icon: "bi-diagram-3-fill",
                            label: "Strands",
                        },
                        {
                            path: "/admin/sections",
                            icon: "bi-grid-3x3-gap-fill",
                            label: "Sections",
                        },
                        {
                            path: "/admin/subjects",
                            icon: "bi-book-fill",
                            label: "Subjects",
                        },
                        {
                            path: "/admin/settings",
                            icon: "bi-gear-fill",
                            label: "Settings",
                        },
                    ].map((item) => (
                        <li className="nav-item mb-2" key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link nav-link-retro d-flex align-items-center gap-3 ${isActive(
                                    item.path
                                )}`}
                            >
                                <i className={`bi ${item.icon} fs-5`}></i>
                                {isSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>

                <hr className="border-dark opacity-100" />

                {/* USER PROFILE & DROPDOWN */}
                <div className="dropdown position-relative">
                    <div
                        className="d-flex align-items-center text-white text-decoration-none cursor-pointer p-2 rounded border border-2 border-transparent hover-border-dark"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            cursor: "pointer",
                            backgroundColor: isDropdownOpen
                                ? "rgba(0,0,0,0.2)"
                                : "transparent",
                        }}
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=000000&color=fff`}
                            alt="User"
                            width="40"
                            height="40"
                            className="rounded-circle me-2 border border-2 border-dark"
                        />

                        {isSidebarOpen && (
                            <div className="fade-in overflow-hidden">
                                <strong
                                    className="d-block text-truncate"
                                    style={{ maxWidth: "160px" }}
                                >
                                    {user.name}
                                </strong>
                                <small
                                    className="text-white-50 text-uppercase"
                                    style={{
                                        fontSize: "0.7rem",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    {user.role}
                                </small>
                            </div>
                        )}

                        {isSidebarOpen && (
                            <i
                                className={`bi bi-chevron-${
                                    isDropdownOpen ? "up" : "down"
                                } ms-auto small`}
                            ></i>
                        )}
                    </div>

                    {/* RETRO DROPDOWN MENU */}
                    {isDropdownOpen && (
                        <div
                            className="bg-white text-dark rounded p-2 fade-in"
                            style={{
                                position: "absolute",
                                bottom: "100%",
                                left: 0,
                                marginBottom: "10px",
                                width: "100%",
                                border: "2px solid black",
                                boxShadow: "4px 4px 0px #000",
                                zIndex: 1000,
                            }}
                        >
                            <div className="px-3 py-2 border-bottom border-dark mb-2 bg-retro-bg rounded">
                                <span className="d-block small fw-bold text-muted">
                                    SIGNED IN AS
                                </span>
                                <span className="d-block text-truncate fw-bold">
                                    {user.email}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
                                style={{
                                    border: "2px solid black",
                                    boxShadow: "2px 2px 0 #000",
                                }}
                            >
                                <i className="bi bi-box-arrow-right"></i> SIGN
                                OUT
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
                    className="py-3 px-4 bg-white d-flex justify-content-between align-items-center sticky-top"
                    style={{
                        zIndex: 900,
                        borderBottom: "2px solid black",
                    }}
                >
                    <button
                        className="btn p-0 border-0"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <i className="bi bi-list fs-1 fw-bold"></i>
                    </button>

                    <div
                        className="fw-bold d-flex align-items-center gap-2 px-3 py-1 rounded"
                        style={{
                            border: "2px solid black",
                            backgroundColor: "var(--color-bg)",
                        }}
                    >
                        <i className="bi bi-calendar-check-fill"></i>
                        <span
                            style={{
                                fontFamily: "monospace",
                                fontSize: "1.1rem",
                            }}
                        >
                            S.Y. 2025-2026 | 1st Sem
                        </span>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="p-4 flex-grow-1">
                    <Outlet />
                </main>

                {/* FOOTER */}
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
