import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import TermsModal from "../components/TermsModal";
import StatusCheckModal from "../components/StatusCheckModal";

export default function PublicLayout() {
    const [showTerms, setShowTerms] = useState(false);
    const [searchLrn, setSearchLrn] = useState("");
    const [showStatus, setShowStatus] = useState(false);
    const [statusResult, setStatusResult] = useState(null);

    const handleQuickSearch = async (e) => {
        e.preventDefault();
        if (!searchLrn)
            return Swal.fire({
                title: "INPUT REQUIRED",
                text: "Enter 12-digit LRN to check status.",
                icon: "warning",
                confirmButtonColor: "#2d3436",
                customClass: { popup: "card-retro" },
            });

        try {
            const res = await axios.post("/api/public/check-status", {
                lrn: searchLrn,
            });
            setStatusResult(res.data);
            setShowStatus(true);
        } catch (e) {
            Swal.fire({
                title: "NO RECORD",
                text: "LRN not found in the system.",
                icon: "error",
                confirmButtonColor: "#F96E5B",
                customClass: { popup: "card-retro" },
            });
        }
    };

    // --- NEW: HANDLE CLOSE & REFRESH ---
    const handleCloseStatus = () => {
        setShowStatus(false);
        setStatusResult(null);
        setSearchLrn(""); // Clear input
        window.location.reload(); // 🔄 AUTO REFRESH PAGE
    };

    return (
        <div
            className="d-flex flex-column min-vh-100 font-monospace"
            style={{
                backgroundColor: "#fcfbf4",
                overflowX: "hidden",
                backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
            }}
        >
            <style>
                {`
                    .btn-staff {
                        background-color: #F4D03F !important; 
                        color: #000 !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        transition: all 0.2s ease;
                    }
                    .btn-staff:hover {
                        background-color: #FFFFFF !important;
                        transform: translate(4px, 4px) !important;
                        box-shadow: 0px 0px 0 #000 !important;
                    }
                `}
            </style>

            {/* --- NAVBAR --- */}
            <nav
                className="navbar navbar-expand-lg border-bottom border-2 border-dark sticky-top"
                style={{
                    backgroundColor: "#3F9AAE",
                    height: "80px",
                    boxShadow: "0 4px 0 rgba(0,0,0,0.1)",
                    zIndex: 1000,
                }}
            >
                <div className="container h-100 d-flex justify-content-between align-items-center">
                    {/* LEFT: BRANDING */}
                    <Link
                        to="/"
                        className="d-flex align-items-center gap-3 text-decoration-none"
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
                                Official Portal
                            </span>
                        </div>
                    </Link>

                    {/* RIGHT: SEARCH BAR & LOGIN BUTTON */}
                    <div className="d-flex align-items-center gap-4">
                        <form
                            onSubmit={handleQuickSearch}
                            className="d-none d-md-block"
                            style={{ width: "300px" }}
                        >
                            <div className="input-group shadow-sm">
                                <span className="input-group-text bg-white border-dark border-2 border-end-0 rounded-start">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-dark border-2 border-start-0 ps-2 font-monospace rounded-end"
                                    placeholder="Search LRN..."
                                    value={searchLrn}
                                    onChange={(e) =>
                                        setSearchLrn(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 12),
                                        )
                                    }
                                    style={{ boxShadow: "none" }}
                                />
                            </div>
                        </form>
                        <Link
                            to="/login"
                            className="btn btn-retro btn-staff px-4 py-2"
                        >
                            <i className="bi bi-shield-lock-fill"></i> STAFF
                            LOGIN
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-grow-1 position-relative">
                <Outlet />
            </main>

            <footer
                className="py-3 bg-white text-center small mt-auto"
                style={{ borderTop: "2px solid black" }}
            >
                <div className="container font-monospace">
                    <span>© {new Date().getFullYear()} SmartEnroll System</span>
                    <span className="mx-2">|</span>
                    <button
                        className="btn btn-link text-dark text-decoration-none fw-bold p-0"
                        onClick={() => setShowTerms(true)}
                    >
                        Terms & Policy
                    </button>
                </div>
            </footer>

            <TermsModal
                show={showTerms}
                handleClose={() => setShowTerms(false)}
            />

            {/* --- STATUS MODAL WITH REFRESH HANDLER --- */}
            <StatusCheckModal
                show={showStatus}
                student={statusResult}
                onClose={handleCloseStatus} // Calls the refresh logic
            />
        </div>
    );
}
