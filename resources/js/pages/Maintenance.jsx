import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../utils/toast";

export default function Maintenance() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // 1. TIMER STATE (Start at 1 Hour = 3600 seconds)
    const [countdown, setCountdown] = useState(3600);

    // 2. TIMER LOGIC (Looping)
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) return 3600; // Loop back to 1 hour kapag 0
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Helper: Format Seconds to HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    // 3. SMART REFRESH (Check kung tapos na ang Maintenance)
    const handleCheckStatus = async () => {
        setIsLoading(true);
        try {
            await axios.get("/api/user");

            Toast.fire({
                icon: "success",
                title: "System is back online! Redirecting...",
            });

            setTimeout(() => {
                navigate("/staff/dashboard");
            }, 1000);
        } catch (error) {
            if (error.response && error.response.status === 503) {
                Toast.fire({
                    icon: "warning",
                    title: "System is still under maintenance.",
                });
            } else {
                window.location.href = "/login";
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Logout Logic
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            localStorage.clear();
            window.location.href = "/login";
        } catch (e) {
            localStorage.clear();
            window.location.href = "/login";
        }
    };

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center vh-100 fade-in"
            style={{ backgroundColor: "#FFE2AF" }}
        >
            <div
                className="text-center p-5 card-retro bg-white"
                style={{
                    maxWidth: "600px",
                    border: "3px solid #000",
                    boxShadow: "8px 8px 0px #000",
                }}
            >
                {/* ICON & ANIMATION */}
                <div className="mb-4 position-relative d-inline-block">
                    <i
                        className="bi bi-cone-striped text-warning"
                        style={{
                            fontSize: "5rem",
                            textShadow: "3px 3px 0 #000",
                        }}
                    ></i>
                    <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-dark rounded-circle blink-animation"></span>
                </div>

                {/* TITLE */}
                <h1
                    className="fw-black text-uppercase mb-2 font-monospace"
                    style={{ color: "#2d3436", letterSpacing: "1px" }}
                >
                    SYSTEM MAINTENANCE
                </h1>

                {/* TIMER DISPLAY */}
                <div
                    className="my-4 p-3 bg-dark rounded border border-2 border-dark"
                    style={{ boxShadow: "inset 0 0 10px #000" }}
                >
                    <p className="text-white-50 mb-1 font-monospace small text-uppercase">
                        Estimated Time Remaining
                    </p>
                    <h1
                        className="font-monospace text-warning fw-bold mb-0"
                        style={{
                            letterSpacing: "3px",
                            textShadow: "0 0 10px rgba(241, 196, 15, 0.5)",
                        }}
                    >
                        {formatTime(countdown)}
                    </h1>
                    <small
                        className="text-white-50 fst-italic"
                        style={{ fontSize: "0.7rem" }}
                    >
                        (Looping until completion)
                    </small>
                </div>

                {/* MESSAGE */}
                <p className="font-monospace text-muted mb-4 fs-6">
                    We are currently upgrading the{" "}
                    <strong>SmartEnroll System</strong>.
                    <br />
                    Please wait until the admin restores access.
                </p>

                {/* ACTIONS */}
                <div className="d-flex gap-2 justify-content-center">
                    {/* BUTTON 1: REFRESH (Yellow Retro) */}
                    <button
                        onClick={handleCheckStatus}
                        className="btn btn-retro px-4 py-2 font-monospace fw-bold d-flex align-items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm border-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                CHECKING...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-clockwise fs-5"></i>
                                REFRESH STATUS
                            </>
                        )}
                    </button>

                    {/* BUTTON 2: LOGOUT (Dark Retro with Effects) */}
                    <button
                        onClick={handleLogout}
                        className="btn btn-retro px-4 py-2 font-monospace fw-bold"
                        style={{
                            backgroundColor: "#2d3436",
                            color: "#fff",
                            borderColor: "#000",
                        }}
                        disabled={isLoading}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <p className="mt-4 font-monospace small text-dark fw-bold">
                &copy; {new Date().getFullYear()} SmartEnroll System
            </p>

            <style>
                {`
                    @keyframes blink { 50% { opacity: 0; } }
                    .blink-animation { animation: blink 1s linear infinite; }
                `}
            </style>
        </div>
    );
}
