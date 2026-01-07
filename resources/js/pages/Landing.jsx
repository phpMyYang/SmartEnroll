import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div
            className="vh-100 d-flex flex-column"
            style={{ backgroundColor: "#79C9C5" }}
        >
            {" "}
            {/* Secondary Color Background */}
            {/* Navbar / Header */}
            <nav
                className="navbar navbar-expand-lg border-bottom border-dark border-2 px-4"
                style={{ backgroundColor: "#FFE2AF" }}
            >
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold fs-3">
                        🎓 SmartEnroll
                    </span>
                    <Link to="/login" className="btn btn-retro btn-sm">
                        Staff Login
                    </Link>
                </div>
            </nav>
            {/* Main Content */}
            <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center p-4">
                <div
                    className="card-retro p-5"
                    style={{ maxWidth: "800px", backgroundColor: "#FFF" }}
                >
                    <h1
                        className="display-3 fw-bold mb-3"
                        style={{ color: "#3F9AAE" }}
                    >
                        WELCOME SHS STUDENTS
                    </h1>
                    <p className="lead mb-4">
                        Ang <strong>SmartEnroll</strong> ay ang opisyal na
                        enrollment system. Mag-login o tingnan ang advisory para
                        sa enrollment schedule.
                    </p>

                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        {/* Phase 4 Logic: Future Enrollment Buttons */}
                        <button className="btn btn-retro bg-warning text-dark disabled">
                            Enrollment Closed (Coming Soon)
                        </button>
                        <Link
                            to="/login"
                            className="btn btn-retro bg-white text-dark"
                        >
                            Login Portal
                        </Link>
                    </div>
                </div>
            </div>
            {/* Footer [cite: 115] */}
            <footer
                className="text-center p-3 border-top border-dark border-2"
                style={{ backgroundColor: "#FFE2AF" }}
            >
                <small>
                    © {new Date().getFullYear()} SmartEnroll. All rights
                    reserved.
                </small>
            </footer>
        </div>
    );
}
