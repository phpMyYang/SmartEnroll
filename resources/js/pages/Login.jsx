import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import TermsModal from "../components/TermsModal";
import Toast from "../utils/toast";

export default function Login() {
    // DATA STATES
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    // UI STATES
    const [showPassword, setShowPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // VERIFICATION STATES
    const [needsVerification, setNeedsVerification] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // HOOKS
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 1. CHECK URL STATUS (Galing sa Email Link o Reset Password)
    useEffect(() => {
        const status = searchParams.get("status");
        const verificationNeeded = searchParams.get("needs_verification");
        const emailParam = searchParams.get("email");

        // Logic A: Email Verification Status
        if (status === "verified") {
            Toast.fire({
                icon: "success",
                title: "Email successfully verified! You may now login.",
                timer: 5000,
            });
        } else if (status === "already_verified") {
            Toast.fire({
                icon: "info",
                title: "Email is already verified. Login to continue.",
            });
        } else if (status === "invalid") {
            Toast.fire({
                icon: "error",
                title: "Invalid or expired verification link.",
            });
        }

        // Logic B: Galing sa Reset Password pero Unverified pa
        if (verificationNeeded === "1" && emailParam) {
            setEmail(emailParam);
            setNeedsVerification(true); // Buksan agad ang Verification UI
        }
    }, [searchParams]);

    // 2. LOGIN LOGIC
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.post("/api/login", {
                email,
                password,
                remember,
            });

            if (response.status === 200) {
                // 1. Save Token & User
                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                Toast.fire({ icon: "success", title: "Login successful!" });

                const role = response.data.role;

                // 2. DELAY & REDIRECT (Updated Logic)
                setTimeout(() => {
                    // Check kung Admin OR Staff (parehas silang pupunta sa Admin Dashboard sa ngayon)
                    if (role === "admin" || role === "staff") {
                        // Gagamit tayo ng window.location.href para ma-force reload
                        // at kumagat ang Token sa bootstrap.js
                        window.location.href = "/admin/dashboard";
                    } else {
                        // Students (Wala pa tayong route nito, pero ready na)
                        window.location.href = "/student/dashboard";
                    }
                }, 1000);
            }
        } catch (error) {
            // CATCH: Account exists but NOT Verified
            if (
                error.response &&
                error.response.status === 403 &&
                error.response.data.needs_verification
            ) {
                setNeedsVerification(true);
                Toast.fire({
                    icon: "warning",
                    title: "Email not verified. Please verify your account.",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title:
                        error.response?.data?.message ||
                        "Invalid credentials. Please try again.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 3. RESEND VERIFICATION LOGIC
    const handleResend = async () => {
        setIsResending(true);
        try {
            await axios.post("/api/email/resend", { email });
            Toast.fire({
                icon: "success",
                title: "Verification link sent! Check your inbox.",
            });
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Failed to send verification email.",
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="split-layout">
            {/* LEFT SIDE */}
            <div className="split-left">
                <h1
                    className="display-4 fw-bold mb-3"
                    style={{ textShadow: "3px 3px 0 #000" }}
                >
                    SMARTENROLL
                </h1>
                <p className="lead fw-bold mb-4">
                    Official HFJLSJI Enrollment System
                </p>
                <img
                    src="/images/login.svg"
                    alt="Login Illustration"
                    className="img-fluid"
                    style={{
                        maxWidth: "80%",
                        filter: "drop-shadow(4px 4px 0 #000)",
                    }}
                />
            </div>

            {/* RIGHT SIDE */}
            <div className="split-right">
                <div className="auth-form-container">
                    {/* MOBILE LOGO (Visible only on small screens) */}
                    <div className="text-center mb-4 d-md-none">
                        <img src="/images/logo.png" alt="Logo" width="60" />
                    </div>

                    {!needsVerification ? (
                        // === STANDARD LOGIN FORM ===
                        <>
                            <div className="mb-4">
                                {/* DESKTOP LOGO (Next to Sign In Text) */}
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    width="50"
                                    className="d-none d-md-inline-block me-2 mb-2"
                                />
                                <h2
                                    className="fw-bold d-inline-block align-middle"
                                    style={{ color: "#F96E5B" }}
                                >
                                    Sign In
                                </h2>
                                <p className="text-muted small">
                                    Please enter your credentials to access your
                                    account.
                                </p>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="fw-bold small mb-1">
                                        EMAIL ADDRESS
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="ex. juan.delacruz@student.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="mb-4 position-relative">
                                    <label className="fw-bold small mb-1">
                                        PASSWORD
                                    </label>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="form-control"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
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
                                            !isLoading &&
                                            setShowPassword(!showPassword)
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

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input border-dark"
                                            id="rememberMe"
                                            checked={remember}
                                            onChange={(e) =>
                                                setRemember(e.target.checked)
                                            }
                                            disabled={isLoading}
                                        />
                                        <label
                                            className="form-check-label small fw-bold"
                                            htmlFor="rememberMe"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <Link
                                        to="/forgot-password"
                                        style={{
                                            color: "#F96E5B",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-retro w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="bi bi-mortarboard-fill fs-5 toga-spin"></i>
                                            <span>LOGGING IN...</span>
                                        </>
                                    ) : (
                                        <span>ACCESS PORTAL</span>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        // === VERIFICATION PROMPT ===
                        <div className="text-center py-4 fade-in">
                            <div className="mb-4 text-warning">
                                <i
                                    className="bi bi-envelope-exclamation-fill"
                                    style={{ fontSize: "4rem" }}
                                ></i>
                            </div>
                            <h3 className="fw-bold mb-3">Verify Your Email</h3>
                            <p className="text-muted mb-4">
                                Your account <strong>{email}</strong> is not yet
                                verified.
                                <br />
                                Please check your email inbox or click the
                                button below to send a new link.
                            </p>

                            <button
                                onClick={handleResend}
                                className="btn btn-retro w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                                disabled={isResending}
                            >
                                {isResending ? (
                                    <>
                                        <i className="bi bi-mortarboard-fill fs-5 toga-spin"></i>
                                        <span>SENDING...</span>
                                    </>
                                ) : (
                                    <span>RESEND VERIFICATION LINK</span>
                                )}
                            </button>

                            <button
                                onClick={() => setNeedsVerification(false)}
                                className="btn btn-link text-dark fw-bold text-decoration-none"
                            >
                                <i className="bi bi-arrow-left"></i> Back to
                                Login
                            </button>
                        </div>
                    )}

                    <div className="text-center mt-3">
                        {!needsVerification && (
                            <button
                                className="btn btn-link text-dark text-decoration-none small fw-bold"
                                onClick={() => setShowTerms(true)}
                                disabled={isLoading}
                            >
                                Terms & Policy
                            </button>
                        )}
                        <p className="small text-muted mt-2 mb-0">
                            © {new Date().getFullYear()} SmartEnroll System
                        </p>
                    </div>
                </div>
            </div>

            <TermsModal
                show={showTerms}
                handleClose={() => setShowTerms(false)}
            />
        </div>
    );
}
