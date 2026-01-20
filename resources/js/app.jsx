import "./bootstrap";
import "../css/app.scss";
import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- LAYOUTS ---
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";

// --- PUBLIC PAGES ---
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Maintenance from "./pages/Maintenance";

// --- ADMIN PAGES ---
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import Strands from "./pages/admin/Strands";
import Sections from "./pages/admin/Sections";
import Subjects from "./pages/admin/Subjects";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import RecycleBin from "./pages/admin/RecycleBin";

// --- STAFF PAGES ---
import StaffDashboard from "./pages/staff/Dashboard";

// Placeholder Component
const Placeholder = ({ title }) => (
    <div className="container-fluid p-4 fade-in">
        <h2 className="fw-bold text-dark mb-3 font-monospace">{title}</h2>
        <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "#FFE2AF", border: "2px solid black" }}
        >
            <div className="card-body text-center py-5">
                <i
                    className="bi bi-cone-striped fs-1 text-warning mb-3"
                    style={{ textShadow: "2px 2px 0 #000" }}
                ></i>
                <h4 className="text-muted font-monospace">Work in Progress</h4>
                <p className="font-monospace">
                    This module (<strong>{title}</strong>) is currently under
                    development.
                </p>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ==============================
                    PUBLIC ROUTES
                ============================== */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/password-reset/:token"
                    element={<ResetPassword />}
                />
                <Route path="/maintenance" element={<Maintenance />} />

                {/* ==============================
                    ADMIN ROUTES
                ============================== */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route
                        index
                        element={<Navigate to="/admin/dashboard" replace />}
                    />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route
                        path="users"
                        element={<Users title="Users Management" />}
                    />
                    <Route
                        path="students"
                        element={<Students title="Student Management" />}
                    />
                    <Route
                        path="strands"
                        element={<Strands title="Strand Management" />}
                    />
                    <Route
                        path="sections"
                        element={<Sections title="Section Management" />}
                    />
                    <Route
                        path="subjects"
                        element={<Subjects title="Subject Management" />}
                    />
                    <Route
                        path="reports"
                        element={<Reports title="System Reports" />}
                    />
                    <Route
                        path="settings"
                        element={<Settings title="Enrollment Settings" />}
                    />
                    <Route
                        path="recycle-bin"
                        element={<RecycleBin title="Recycle Bin" />}
                    />
                </Route>

                {/* ==============================
                    STAFF ROUTES (NEW)
                ============================== */}
                <Route path="/staff" element={<StaffLayout />}>
                    <Route
                        index
                        element={<Navigate to="/staff/dashboard" replace />}
                    />

                    <Route path="dashboard" element={<StaffDashboard />} />
                    <Route
                        path="students"
                        element={<Placeholder title="Student Records" />}
                    />
                    <Route
                        path="strands"
                        element={<Placeholder title="Strands" />}
                    />
                    <Route
                        path="sections"
                        element={<Placeholder title="Sections" />}
                    />
                    <Route
                        path="subjects"
                        element={<Placeholder title="Subjects" />}
                    />
                    <Route
                        path="reports"
                        element={<Placeholder title="Reports" />}
                    />
                </Route>

                {/* ==============================
                    404 FALLBACK
                ============================== */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

if (document.getElementById("app")) {
    createRoot(document.getElementById("app")).render(<App />);
}
