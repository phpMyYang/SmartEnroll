import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Toast from "../utils/toast";

export default function ResetPassword() {
    // 1. GET DATA FROM URL
    const { token } = useParams(); // Kunin ang token sa path /password-reset/{token}
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 2. STATES
    const [email] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    // UI STATES
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 3. SUBMIT LOGIC
    const handleReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post("/api/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            if (response.status === 200) {
                // 👇 KUNIN ANG DATA MULA SA BACKEND UPDATE
                const isVerified = response.data.verified;
                const role = response.data.role;

                if (isVerified) {
                    // ✅ CASE A: VERIFIED NA (Go to Dashboard)
                    Toast.fire({
                        icon: "success",
                        title: "Password updated successfully! Redirecting...",
                    });

                    setTimeout(() => {
                        if (role === "admin") navigate("/admin/dashboard");
                        else navigate("/student/dashboard");
                    }, 1500);
                } else {
                    // 🛑 CASE B: HINDI PA VERIFIED (Go to Verification Page)
                    Toast.fire({
                        icon: "warning",
                        title: "Password updated. Please verify your email first.",
                    });

                    // Redirect sa Login page na may utos na buksan ang "Verification UI"
                    setTimeout(() => {
                        navigate(`/login?email=${email}&needs_verification=1`);
                    }, 1500);
                }
            }
        } catch (error) {
            // ERROR HANDLING
            let errorMessage = "Failed to reset password.";

            if (error.response && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response && error.response.data.errors) {
                errorMessage = Object.values(error.response.data.errors)
                    .flat()
                    .join(" ");
            }

            Toast.fire({
                icon: "error",
                title: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="split-layout">
            {/* LEFT SIDE */}
            <div className="split-left" style={{ backgroundColor: "#F96E5B" }}>
                <h2
                    className="fw-bold mb-3"
                    style={{ textShadow: "2px 2px 0 #000" }}
                >
                    SECURE YOUR ACCOUNT
                </h2>
                <p className="lead mb-4">Create a strong password.</p>
                <img
                    src="/images/reset.svg"
                    alt="Reset Illustration"
                    className="img-fluid"
                    style={{
                        maxWidth: "70%",
                        filter: "drop-shadow(4px 4px 0 #000)",
                    }}
                />
            </div>

            {/* RIGHT SIDE */}
            <div className="split-right">
                <div className="auth-form-container">
                    {/* ✅ MOBILE LOGO (Visible only on small screens) */}
                    <div className="text-center mb-4 d-md-none">
                        <img src="/images/logo.png" alt="Logo" width="60" />
                    </div>

                    <div className="mb-4">
                        {/* ✅ DESKTOP LOGO (Next to Heading) */}
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            width="50"
                            className="d-none d-md-inline-block me-2 mb-2"
                        />
                        <h3
                            className="fw-bold d-inline-block align-middle"
                            style={{ color: "#3F9AAE" }}
                        >
                            Set New Password
                        </h3>
                        <p className="text-muted small">
                            Please enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleReset}>
                        <div className="mb-3">
                            <label className="fw-bold small mb-1">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                readOnly
                                disabled
                                style={{
                                    backgroundColor: "#e9ecef",
                                    cursor: "not-allowed",
                                }}
                            />
                        </div>

                        <div className="mb-3 position-relative">
                            <label className="fw-bold small mb-1">
                                NEW PASSWORD
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create new password"
                                required
                                minLength="8"
                                disabled={isLoading}
                            />
                            <span
                                className="position-absolute"
                                style={{
                                    right: "15px",
                                    top: "38px",
                                    cursor: "pointer",
                                    color: "#666",
                                }}
                                onClick={() =>
                                    !isLoading && setShowPassword(!showPassword)
                                }
                            >
                                <i
                                    className={`bi ${
                                        showPassword
                                            ? "bi-eye-slash-fill"
                                            : "bi-eye-fill"
                                    } fs-5`}
                                ></i>
                            </span>
                        </div>

                        <div className="mb-4 position-relative">
                            <label className="fw-bold small mb-1">
                                CONFIRM PASSWORD
                            </label>
                            <input
                                type={showConfirm ? "text" : "password"}
                                className="form-control"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                placeholder="Repeat new password"
                                required
                                minLength="8"
                                disabled={isLoading}
                            />
                            <span
                                className="position-absolute"
                                style={{
                                    right: "15px",
                                    top: "38px",
                                    cursor: "pointer",
                                    color: "#666",
                                }}
                                onClick={() =>
                                    !isLoading && setShowConfirm(!showConfirm)
                                }
                            >
                                <i
                                    className={`bi ${
                                        showConfirm
                                            ? "bi-eye-slash-fill"
                                            : "bi-eye-fill"
                                    } fs-5`}
                                ></i>
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-retro w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="bi bi-mortarboard-fill fs-5 toga-spin"></i>
                                    <span>UPDATING...</span>
                                </>
                            ) : (
                                <span>UPDATE PASSWORD</span>
                            )}
                        </button>
                    </form>

                    <p className="text-center small text-muted mt-4">
                        © {new Date().getFullYear()} SmartEnroll System
                    </p>
                </div>
            </div>
        </div>
    );
}
