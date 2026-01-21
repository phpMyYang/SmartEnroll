import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast"; // ✅ Using Toast
import moment from "moment";

// Components
import EnrollmentDrawer from "../../components/EnrollmentDrawer";
import ActivityLogsModal from "../../components/ActivityLogsModal";

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic Time & Maintenance Timer
    const [currentTime, setCurrentTime] = useState(moment());
    const [maintenanceCounter, setMaintenanceCounter] = useState(3600); // 1 Hour (in seconds)

    // UI States
    const [showEnrollmentDrawer, setShowEnrollmentDrawer] = useState(false);
    const [showLogsModal, setShowLogsModal] = useState(false);

    // 1. FETCH SETTINGS
    const fetchSettings = async () => {
        try {
            const res = await axios.get("/api/settings");
            setSettings(res.data);
        } catch (error) {
            console.error(error);
            Toast.fire({ icon: "error", title: "Failed to load settings." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // 2. CLOCK & COUNTDOWN LOGIC
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(moment()); // Update Time every second

            // Maintenance Countdown Loop (Only if Active)
            if (settings?.maintenance_mode) {
                setMaintenanceCounter((prev) => {
                    if (prev <= 0) return 3600; // Loop back to 1 hour
                    return prev - 1;
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [settings?.maintenance_mode]);

    // Formatter for Countdown (HH:MM:SS)
    const formatCountdown = (seconds) => {
        const h = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    // 3. HANDLERS

    // HANDLE RESET SCHEDULE
    const handleDeleteSchedule = () => {
        // ✅ CONFIRMATION: Swal Center
        Swal.fire({
            title: "RESET SCHEDULE?",
            text: "This will remove the current enrollment dates.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F96E5B",
            confirmButtonText: "YES, RESET",
            background: "#FFE2AF",
            color: "#000",
            customClass: {
                popup: "card-retro",
                confirmButton: "btn-retro bg-danger border-dark",
                cancelButton: "btn-retro bg-dark border-dark",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/settings/reset`);
                    fetchSettings();

                    // TRIGGER EVENT: Update Header Agad!
                    window.dispatchEvent(new Event("settings-updated"));

                    // ✅ SUCCESS: Toast
                    Toast.fire({ icon: "success", title: "Schedule reset." });
                } catch (error) {
                    // ✅ ERROR: Toast
                    Toast.fire({ icon: "error", title: "Action failed." });
                }
            }
        });
    };

    // HANDLE MAINTENANCE MODE
    const handleToggleMaintenance = async () => {
        const newStatus = !settings?.maintenance_mode;

        // ✅ CONFIRMATION: Swal Center
        const result = await Swal.fire({
            title: newStatus ? "LOCK SYSTEM?" : "UNLOCK SYSTEM?",
            html: newStatus
                ? "Enable <b>Maintenance Mode</b>? <br/>Staff access will be restricted."
                : "Disable <b>Maintenance Mode</b>? <br/>Access will be restored.",
            icon: newStatus ? "warning" : "question",
            showCancelButton: true,
            confirmButtonColor: newStatus ? "#2d3436" : "#27ae60",
            confirmButtonText: newStatus ? "YES, LOCK IT" : "YES, UNLOCK",
            background: "#FFE2AF",
            color: "#000",
            customClass: {
                popup: "card-retro",
                confirmButton: "btn-retro bg-dark text-white",
                cancelButton: "btn-retro bg-dark border-dark",
            },
        });

        if (result.isConfirmed) {
            try {
                await axios.put("/api/settings/maintenance", {
                    maintenance_mode: newStatus,
                });
                fetchSettings();
                setMaintenanceCounter(3600); // Reset timer on toggle

                // TRIGGER EVENT: Update Header Agad!
                window.dispatchEvent(new Event("settings-updated"));

                // ✅ SUCCESS: Toast (Imbis na Swal)
                Toast.fire({
                    icon: "success",
                    title: newStatus ? "SYSTEM LOCKED" : "SYSTEM UNLOCKED",
                });
            } catch (error) {
                // ✅ ERROR: Toast
                Toast.fire({
                    icon: "error",
                    title: "Failed to update status.",
                });
            }
        }
    };

    if (loading)
        return (
            <div className="text-center py-5">
                <div
                    className="spinner-border border-dark"
                    style={{ width: "3rem", height: "3rem" }}
                ></div>
            </div>
        );

    // Helpers for Enrollment Progress
    const isActive =
        settings && moment().isBetween(settings.start_date, settings.end_date);
    const totalDays = settings
        ? moment(settings.end_date).diff(moment(settings.start_date), "days")
        : 1;
    const daysPassed = settings
        ? moment().diff(moment(settings.start_date), "days")
        : 0;
    const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);

    // Common Card Style
    const cardStyle = {
        border: "3px solid #000",
        borderRadius: "12px",
        boxShadow: "6px 6px 0px #000",
        backgroundColor: "#fff",
        height: "100%",
        position: "relative",
    };

    const stripStyle = (color) => ({
        height: "14px",
        backgroundColor: color,
        borderBottom: "3px solid #000",
        borderTopLeftRadius: "9px",
        borderTopRightRadius: "9px",
    });

    return (
        <div className="container-fluid fade-in mb-5">
            {/* PAGE HEADER */}
            <div
                className="d-flex justify-content-between align-items-center mb-4 pb-3"
                style={{ borderBottom: "2px solid black" }}
            >
                <div>
                    <h1
                        className="fw-black text-dark mb-0 font-monospace"
                        style={{
                            textShadow: "2px 2px 0 #fff",
                            fontSize: "2.5rem",
                        }}
                    >
                        SYSTEM CONTROL
                    </h1>
                    <p className="text-muted small mb-0 font-monospace fw-bold">
                        CONFIGURATION & LOGS PANEL
                    </p>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="row g-4">
                {/* 1. ENROLLMENT SCHEDULER */}
                <div className="col-md-6 col-lg-4">
                    <div className="card" style={cardStyle}>
                        <div style={stripStyle("#F4D03F")}></div>
                        <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h3
                                        className="fw-bold mb-1 font-monospace text-uppercase"
                                        style={{
                                            fontSize: "1.4rem",
                                            color: "#2d3436",
                                        }}
                                    >
                                        ENROLLMENT
                                    </h3>
                                    <div className="small text-muted font-monospace fw-bold">
                                        Manage Schedule
                                    </div>
                                </div>
                                <i className="bi bi-calendar-week-fill fs-4 text-muted opacity-25"></i>
                            </div>

                            <div className="font-monospace text-center my-3">
                                {settings && settings.start_date ? (
                                    <>
                                        <div className="display-6 fw-bold mb-1">
                                            {settings.school_year}
                                        </div>
                                        <div className="badge bg-dark text-white rounded-0 mb-3 border border-dark">
                                            {settings.semester}
                                        </div>

                                        {/* PROGRESS INDICATOR */}
                                        <div className="px-2 mb-3">
                                            <div className="d-flex justify-content-between small fw-bold mb-1">
                                                <span>
                                                    {moment(
                                                        settings.start_date,
                                                    ).format("MMM D")}
                                                </span>
                                                <span
                                                    className={
                                                        isActive
                                                            ? "text-success"
                                                            : "text-danger"
                                                    }
                                                >
                                                    {isActive
                                                        ? "OPEN"
                                                        : "CLOSED"}
                                                </span>
                                                <span>
                                                    {moment(
                                                        settings.end_date,
                                                    ).format("MMM D")}
                                                </span>
                                            </div>
                                            <div
                                                className="progress border border-dark rounded-0"
                                                style={{ height: "10px" }}
                                            >
                                                <div
                                                    className={`progress-bar ${
                                                        isActive
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                    }`}
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-4 text-muted">
                                        <i className="bi bi-calendar-x fs-1 opacity-25"></i>
                                        <p className="mt-2 fw-bold small">
                                            NO SCHEDULE SET
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto d-flex gap-2">
                                <button
                                    className="btn flex-grow-1 font-monospace fw-bold btn-retro-effect"
                                    style={{
                                        backgroundColor: "#f6e58d",
                                        color: "#000",
                                        borderRadius: "6px",
                                    }}
                                    onClick={() =>
                                        setShowEnrollmentDrawer(true)
                                    }
                                >
                                    <i className="bi bi-pencil-fill me-2"></i>{" "}
                                    {settings?.start_date ? "EDIT" : "SETUP"}
                                </button>
                                {settings?.start_date && (
                                    <button
                                        className="btn font-monospace fw-bold px-3 btn-retro-effect"
                                        style={{
                                            backgroundColor: "#ff7675",
                                            color: "#fff",
                                            borderRadius: "6px",
                                        }}
                                        onClick={handleDeleteSchedule}
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SYSTEM LOGS (Dynamic Time & DB Status) */}
                <div className="col-md-6 col-lg-4">
                    <div className="card" style={cardStyle}>
                        <div style={stripStyle("#71C9CE")}></div>
                        <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h3
                                        className="fw-bold mb-1 font-monospace text-uppercase"
                                        style={{
                                            fontSize: "1.4rem",
                                            color: "#2d3436",
                                        }}
                                    >
                                        AUDIT TRAIL
                                    </h3>
                                    <div className="small text-muted font-monospace fw-bold">
                                        System Activities
                                    </div>
                                </div>
                                <i className="bi bi-terminal-fill fs-4 text-muted opacity-25"></i>
                            </div>

                            {/* DYNAMIC CONSOLE */}
                            <div className="font-monospace text-center my-3 bg-light p-3 border border-dark rounded-0">
                                <div
                                    className="text-start"
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "0.75rem",
                                        lineHeight: "1.5",
                                        color: "#27ae60",
                                    }}
                                >
                                    <span className="d-block text-dark fw-bold border-bottom border-dark mb-2 pb-1">
                                        STATUS MONITOR
                                    </span>
                                    <span className="d-block">
                                        &gt; Database connection:{" "}
                                        <span className="fw-bold">
                                            {loading ? "CHECKING..." : "OK"}
                                        </span>
                                    </span>
                                    <span className="d-block">
                                        &gt; System Time:
                                    </span>
                                    <span className="d-block ps-3 text-primary fw-bold">
                                        {currentTime.format(
                                            "YYYY-MM-DD HH:mm:ss",
                                        )}
                                    </span>
                                    <span className="d-block mt-1">
                                        &gt; Status:{" "}
                                        <span className="blinking-cursor">
                                            READY
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button
                                    className="btn w-100 font-monospace fw-bold btn-retro-effect"
                                    style={{
                                        backgroundColor: "#dff9fb",
                                        color: "#000",
                                        borderRadius: "6px",
                                    }}
                                    onClick={() => setShowLogsModal(true)}
                                >
                                    <i className="bi bi-eye-fill me-2"></i> VIEW
                                    FULL LOGS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MAINTENANCE MODE (Looping Countdown) */}
                <div className="col-md-6 col-lg-4">
                    <div
                        className="card"
                        style={{
                            ...cardStyle,
                            backgroundColor: settings?.maintenance_mode
                                ? "#2d3436"
                                : "#fff",
                            color: settings?.maintenance_mode ? "#fff" : "#000",
                        }}
                    >
                        <div style={stripStyle("#F96E5B")}></div>
                        <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h3
                                        className="fw-bold mb-1 font-monospace text-uppercase"
                                        style={{
                                            fontSize: "1.4rem",
                                            color: settings?.maintenance_mode
                                                ? "#fff"
                                                : "#2d3436",
                                        }}
                                    >
                                        MAINTENANCE
                                    </h3>
                                    <div
                                        className={`small font-monospace fw-bold ${
                                            settings?.maintenance_mode
                                                ? "text-white-50"
                                                : "text-muted"
                                        }`}
                                    >
                                        Danger Zone
                                    </div>
                                </div>
                                <i className="bi bi-cone-striped fs-4 opacity-50"></i>
                            </div>

                            <div className="font-monospace text-center my-auto py-4">
                                {settings?.maintenance_mode ? (
                                    <>
                                        <i className="bi bi-lock-fill text-danger display-1 mb-2 d-block"></i>
                                        <h2 className="fw-black text-white mb-0 text-danger">
                                            LOCKED
                                        </h2>
                                        <div className="display-4 fw-bold text-warning my-2">
                                            {formatCountdown(
                                                maintenanceCounter,
                                            )}
                                        </div>
                                        <p className="small text-white-50 mb-0">
                                            System is undergoing maintenance.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-unlock-fill text-success display-1 mb-3 d-block"></i>
                                        <h4 className="fw-black mb-2">
                                            SYSTEM ACCESSIBLE
                                        </h4>
                                        <p className="small text-muted px-3">
                                            All systems operational.
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="mt-auto">
                                <button
                                    className="btn w-100 font-monospace fw-bold btn-retro-effect"
                                    style={{
                                        backgroundColor:
                                            settings?.maintenance_mode
                                                ? "#2ecc71"
                                                : "#ff7675",
                                        color: "#fff",
                                        borderRadius: "6px",
                                    }}
                                    onClick={handleToggleMaintenance}
                                >
                                    {settings?.maintenance_mode
                                        ? "RESTORE ACCESS"
                                        : "ACTIVATE MAINTENANCE"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <EnrollmentDrawer
                show={showEnrollmentDrawer}
                onClose={() => setShowEnrollmentDrawer(false)}
                onSuccess={() => {
                    setShowEnrollmentDrawer(false);
                    fetchSettings();

                    // TRIGGER EVENT: Update Header Agad!
                    window.dispatchEvent(new Event("settings-updated"));
                }}
                currentSettings={settings}
            />

            <ActivityLogsModal
                show={showLogsModal}
                onClose={() => setShowLogsModal(false)}
            />
        </div>
    );
}
