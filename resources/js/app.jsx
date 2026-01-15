import "./bootstrap";
import "../css/app.scss";
import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- LAYOUTS ---
import AdminLayout from "./layouts/AdminLayout";

// --- PUBLIC PAGES ---
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// --- ADMIN PAGES ---
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import Strands from "./pages/admin/Strands";
import Sections from "./pages/admin/Sections";
import Subjects from "./pages/admin/Subjects";
import Settings from "./pages/admin/Settings";

// Placeholder Component (Para sa mga modules na gagawin pa lang)
const Placeholder = ({ title }) => (
    <div className="container-fluid p-4 fade-in">
        <h2 className="fw-bold text-dark mb-3">{title}</h2>
        <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
                <i className="bi bi-cone-striped fs-1 text-warning mb-3"></i>
                <h4 className="text-muted">Work in Progress</h4>
                <p>
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

                {/* ==============================
                    ADMIN PROTECTED ROUTES
                ============================== */}
                <Route path="/admin" element={<AdminLayout />}>
                    {/* Default Redirect: /admin -> /admin/dashboard */}
                    <Route
                        index
                        element={<Navigate to="/admin/dashboard" replace />}
                    />

                    {/* 1. Dashboard */}
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* 2. User Management */}
                    <Route
                        path="users"
                        element={<Users title="Users Management" />}
                    />

                    {/* 3. Student Management */}
                    <Route
                        path="students"
                        element={<Students title="Student Management" />}
                    />

                    {/* 4. Strand Management */}
                    <Route
                        path="strands"
                        element={<Strands title="Strand Management" />}
                    />

                    {/* 5. Section Management */}
                    <Route
                        path="sections"
                        element={<Sections title="Section Management" />}
                    />

                    {/* 6. Subject Management */}
                    <Route
                        path="subjects"
                        element={<Subjects title="Subject Management" />}
                    />

                    {/* 7. Reports (Placeholder) */}
                    <Route
                        path="reports"
                        element={<Placeholder title="System Reports" />}
                    />

                    {/* 8. Settings */}
                    <Route
                        path="settings"
                        element={<Settings title="Enrollment Settings" />}
                    />

                    {/* 9. Recycle Bin (Placeholder) */}
                    <Route
                        path="recycle-bin"
                        element={<Placeholder title="Recycle Bin" />}
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
