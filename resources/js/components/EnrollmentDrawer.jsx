import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function EnrollmentDrawer({
    show,
    onClose,
    onSuccess,
    currentSettings,
}) {
    const [form, setForm] = useState({
        start_date: "",
        end_date: "",
        school_year: "",
        semester: "1st Semester",
    });
    const [isLoading, setIsLoading] = useState(false);

    // Load Data when Drawer Opens
    useEffect(() => {
        if (show) {
            setForm({
                start_date: currentSettings?.start_date || "",
                end_date: currentSettings?.end_date || "",
                school_year: currentSettings?.school_year || "",
                semester: currentSettings?.semester || "1st Semester",
            });
        }
    }, [show, currentSettings]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post("/api/settings", form);
            Swal.fire({
                title: "Saved!",
                text: "Enrollment settings updated successfully.",
                icon: "success",
                background: "#FFE2AF",
                customClass: { popup: "card-retro" },
            });
            onSuccess();
        } catch (error) {
            Swal.fire("Error", "Failed to save settings.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const drawerClass = show
        ? "offcanvas offcanvas-end show"
        : "offcanvas offcanvas-end";
    const backdropClass = show ? "offcanvas-backdrop fade show" : "";
    const inputStyle = "form-control border-dark rounded-0 font-monospace";

    // FIX: Determine button text based on existing data
    const isUpdateMode = currentSettings && currentSettings.start_date;

    return (
        <>
            {show && (
                <div
                    className={backdropClass}
                    onClick={onClose}
                    style={{ zIndex: 1045 }}
                ></div>
            )}
            <div
                className={drawerClass}
                style={{
                    zIndex: 1050,
                    width: "450px",
                    borderLeft: "2px solid black",
                }}
            >
                {/* HEADER */}
                <div
                    className="offcanvas-header text-white"
                    style={{
                        backgroundColor: "var(--color-primary)",
                        borderBottom: "2px solid black",
                    }}
                >
                    <h5 className="offcanvas-title fw-bold font-monospace">
                        <i className="bi bi-calendar-event me-2"></i> ENROLLMENT
                        SCHEDULE
                    </h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={onClose}
                    ></button>
                </div>

                {/* BODY */}
                <div className="offcanvas-body bg-light">
                    <form
                        onSubmit={handleSubmit}
                        className="d-flex flex-column gap-3"
                    >
                        {/* SINGLE CARD CONTAINER (Clean Look) */}
                        <div className="card-retro p-3 bg-white">
                            <h6 className="fw-bold border-bottom border-dark pb-2 mb-3 small font-monospace text-muted">
                                CONFIGURATION
                            </h6>

                            <div className="mb-3">
                                <label className="small fw-bold font-monospace mb-1">
                                    START DATE
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    className={inputStyle}
                                    value={form.start_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="small fw-bold font-monospace mb-1">
                                    END DATE
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    className={inputStyle}
                                    value={form.end_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="small fw-bold font-monospace mb-1">
                                    SCHOOL YEAR
                                </label>
                                <input
                                    type="text"
                                    name="school_year"
                                    className={inputStyle}
                                    value={form.school_year}
                                    onChange={handleChange}
                                    placeholder="e.g. 2025-2026"
                                    required
                                />
                            </div>

                            <div>
                                <label className="small fw-bold font-monospace mb-1">
                                    SEMESTER
                                </label>
                                <select
                                    name="semester"
                                    className="form-select border-dark rounded-0 font-monospace"
                                    value={form.semester}
                                    onChange={handleChange}
                                >
                                    <option value="1st Semester">
                                        1st Semester
                                    </option>
                                    <option value="2nd Semester">
                                        2nd Semester
                                    </option>
                                    <option value="Summer">Summer</option>
                                </select>
                            </div>
                        </div>

                        {/* TOGA SPINNER BUTTON */}
                        <button
                            type="submit"
                            className="btn btn-retro py-3 fw-bold w-100 d-flex align-items-center justify-content-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="bi bi-mortarboard-fill fs-5 me-2 toga-spin"></i>
                                    <span>PROCESSING...</span>
                                </>
                            ) : isUpdateMode ? (
                                "SAVE CHANGES"
                            ) : (
                                "CREATE SCHEDULE"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
