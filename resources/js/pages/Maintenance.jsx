import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../utils/toast";

export default function Maintenance() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(3600);

    // CHECK TOKEN
    const hasToken = localStorage.getItem("token");

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) return 3600;
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

    // UPDATED CHECKING LOGIC
    const handleCheckStatus = async () => {
        setIsLoading(true);
        try {
            // Anti-Cache request
            await axios.get(`/api/user?t=${Date.now()}`);

            Toast.fire({ icon: "success", title: "System is back online!" });

            setTimeout(() => {
                if (hasToken) {
                    window.location.href = "/staff/dashboard"; // Staff -> Dashboard
                } else {
                    window.location.href = "/"; // Public -> Landing Page
                }
            }, 1000);
        } catch (error) {
            // 1. MAINTENANCE PA RIN (503)
            if (error.response && error.response.status === 503) {
                Toast.fire({
                    icon: "warning",
                    title: "System is still under maintenance.",
                });
            }
            // 2. UNAUTHORIZED (401)
            else if (error.response && error.response.status === 401) {
                // Linisin muna kung ano man ang natira
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                // DITO ANG FIX: Check natin kung Staff ba siya o Public
                if (hasToken) {
                    // Kung may token dati (Staff na expired session), go to Login
                    window.location.href = "/login";
                } else {
                    // Kung wala talagang token (Public), go to Landing
                    window.location.href = "/";
                }
            }
            // 3. IBANG ERROR -> Landing Page na lang para safe
            else {
                window.location.href = "/";
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
        } catch (e) {
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    };

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center vh-100 fade-in position-fixed top-0 start-0 w-100"
            style={{
                backgroundColor: "#FFE2AF",
                zIndex: 9999,
            }}
        >
            <div
                className="text-center p-5 card-retro bg-white"
                style={{
                    maxWidth: "600px",
                    border: "3px solid #000",
                    boxShadow: "8px 8px 0px #000",
                }}
            >
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

                <h1
                    className="fw-black text-uppercase mb-2 font-monospace"
                    style={{ color: "#2d3436", letterSpacing: "1px" }}
                >
                    SYSTEM MAINTENANCE
                </h1>

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
                </div>

                <p className="font-monospace text-muted mb-4 fs-6">
                    We are currently upgrading the{" "}
                    <strong>SmartEnroll System</strong>.<br />
                    Please wait until the admin restores access.
                </p>

                <div className="d-flex gap-2 justify-content-center">
                    <button
                        onClick={handleCheckStatus}
                        className="btn btn-retro px-4 py-2 font-monospace fw-bold d-flex align-items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            /* UPDATED: TOGA SPINNER */
                            <i className="bi bi-mortarboard-fill fs-5 toga-spin"></i>
                        ) : (
                            <i className="bi bi-arrow-clockwise fs-5"></i>
                        )}
                        REFRESH STATUS
                    </button>

                    {hasToken && (
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
                    )}
                </div>
            </div>

            <p className="mt-4 font-monospace small text-dark fw-bold">
                &copy; {new Date().getFullYear()} SmartEnroll System
            </p>
        </div>
    );
}
