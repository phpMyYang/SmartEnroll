import React, { useState, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import Toast from "../utils/toast";

export default function ForgotPassword() {
    // States
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const recaptchaRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Check Recaptcha first
        const token = recaptchaRef.current.getValue();
        if (!token) {
            Toast.fire({
                icon: "warning",
                title: "Please verify that you are not a robot.",
            });
            return;
        }

        // 2. Start Loading Process
        setIsLoading(true);

        try {
            await axios.post("/api/forgot-password", {
                email,
                recaptcha_token: token,
            });

            // Success Toast
            Toast.fire({
                icon: "success",
                title: "Reset link has been sent to your email!",
            });

            // Clear form
            setEmail("");
            recaptchaRef.current.reset();
        } catch (error) {
            // Error Toast
            let errorMessage = "Something went wrong.";

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
            <div className="split-left" style={{ backgroundColor: "#79C9C5" }}>
                <h2
                    className="fw-bold mb-3"
                    style={{ textShadow: "2px 2px 0 #000" }}
                >
                    ACCOUNT RECOVERY
                </h2>
                <p className="lead mb-4">Don't worry, we got you covered.</p>
                <img
                    src="/images/forgot.svg"
                    alt="Forgot Illustration"
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
                        <Link
                            to="/login"
                            className="btn btn-sm btn-outline-dark rounded-0 mb-3"
                        >
                            <i className="bi bi-arrow-left"></i> Back to Login
                        </Link>

                        {/* ✅ DESKTOP LOGO (Next to Heading) */}
                        <div className="mt-2">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                width="50"
                                className="d-none d-md-inline-block me-2 mb-2"
                            />
                            <h3
                                className="fw-bold d-inline-block align-middle"
                                style={{ color: "#F96E5B" }}
                            >
                                Forgot Password?
                            </h3>
                        </div>

                        <p className="text-muted small">
                            Enter your registered email address and we'll send
                            you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="fw-bold small mb-1">
                                REGISTERED EMAIL
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ex. juan.delacruz@student.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="mb-4 d-flex justify-content-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={
                                    import.meta.env.VITE_RECAPTCHA_SITE_KEY
                                }
                            />
                        </div>

                        {/* BUTTON WITH SPINNER */}
                        <button
                            type="submit"
                            className="btn btn-retro w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="bi bi-mortarboard-fill fs-5 toga-spin"></i>
                                    <span>SENDING...</span>
                                </>
                            ) : (
                                <span>SEND RESET LINK</span>
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
