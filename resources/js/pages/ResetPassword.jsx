import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Toast from "../utils/toast";

export default function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                const { token, user, role, verified } = response.data;

                if (verified && token) {
                    // CASE A: SUCCESS & AUTO-LOGIN
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;

                    Toast.fire({
                        icon: "success",
                        title: "Password updated! Entering Dashboard...",
                        timer: 2000,
                    });

                    // STRICT REDIRECT SA RESET
                    setTimeout(() => {
                        if (role === "admin") {
                            window.location.href = "/admin/dashboard";
                        } else if (role === "staff") {
                            window.location.href = "/staff/dashboard";
                        } else {
                            window.location.href = "/login";
                        }
                    }, 2000);
                } else {
                    // CASE B: SUCCESS PERO DI PA VERIFIED
                    Toast.fire({
                        icon: "warning",
                        title: "Password updated. Please verify email first.",
                    });
                    setTimeout(() => {
                        navigate(`/login?email=${email}&needs_verification=1`);
                    }, 2000);
                }
            }
        } catch (error) {
            let errorMessage = "Failed to reset password.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                errorMessage = Object.values(error.response.data.errors)
                    .flat()
                    .join(" ");
            }
            Toast.fire({ icon: "error", title: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="split-layout">
            <div className="split-left" style={{ backgroundColor: "#F96E5B" }}>
                <h2
                    className="fw-bold mb-3 font-monospace"
                    style={{ textShadow: "2px 2px 0 #000" }}
                >
                    SECURE YOUR ACCOUNT
                </h2>
                <p className="lead mb-4 font-monospace">
                    Create a strong password.
                </p>
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

            <div className="split-right">
                <div className="auth-form-container card-retro p-4 bg-white">
                    <div className="mb-4">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            width="50"
                            className="d-none d-md-inline-block me-2 mb-2"
                        />
                        <h3
                            className="fw-bold d-inline-block align-middle font-monospace text-uppercase"
                            style={{ color: "#3F9AAE" }}
                        >
                            SET NEW PASSWORD
                        </h3>
                        <p className="text-muted small font-monospace">
                            Please enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleReset}>
                        <div className="mb-3">
                            <label className="fw-bold small mb-1 font-monospace">
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
                            <label className="fw-bold small mb-1 font-monospace">
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
                            <label className="fw-bold small mb-1 font-monospace">
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
                                    <span>PROCESSING...</span>
                                </>
                            ) : (
                                <span>UPDATE PASSWORD</span>
                            )}
                        </button>
                    </form>

                    <p className="text-center small text-muted mt-4 font-monospace">
                        © {new Date().getFullYear()} SmartEnroll System
                    </p>
                </div>
            </div>
        </div>
    );
}
