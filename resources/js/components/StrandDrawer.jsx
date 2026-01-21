import React, { useEffect, useState } from "react";
import axios from "axios"; // Added axios import since we might move submit logic here or just for consistency

export default function StrandDrawer({
    show,
    type, // 'create' or 'edit'
    selectedStrand,
    onClose,
    onSubmit,
    isLoading,
    apiPrefix = "/api", // DEFAULT: Admin (/api). Override for Staff (/api/staff).
}) {
    const initialForm = { code: "", description: "" };
    const [formData, setFormData] = useState(initialForm);

    // Populate form kung Edit mode
    useEffect(() => {
        if (type === "edit" && selectedStrand) {
            setFormData(selectedStrand);
        } else {
            setFormData(initialForm);
        }
    }, [type, selectedStrand, show]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ipapasa natin ang apiPrefix sa onSubmit handler ng parent component
        // pero kung dito mo gusto i-handle ang axios, pwede rin.
        // For now, susundin natin ang structure na parent ang naghahandle ng submit.
        onSubmit(formData, apiPrefix);
    };

    // Drawer CSS Classes
    const drawerClass = show
        ? "offcanvas offcanvas-end show"
        : "offcanvas offcanvas-end";
    const backdropClass = show ? "offcanvas-backdrop fade show" : "";

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
                    visibility: show ? "visible" : "hidden",
                    width: "400px",
                    borderLeft: "2px solid black", // Retro Border
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
                        {type === "create" ? (
                            <>
                                <i className="bi bi-plus-circle me-2"></i>NEW
                                STRAND
                            </>
                        ) : (
                            <>
                                <i className="bi bi-pencil-square me-2"></i>EDIT
                                STRAND
                            </>
                        )}
                    </h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white opacity-100"
                        onClick={onClose}
                    ></button>
                </div>

                {/* BODY */}
                <div className="offcanvas-body bg-light">
                    <form
                        onSubmit={handleSubmit}
                        className="d-flex flex-column gap-4"
                    >
                        <div className="card-retro p-4 bg-white">
                            <h6 className="fw-bold mb-3 pb-2 border-bottom border-dark font-monospace text-uppercase text-primary">
                                Strand Details
                            </h6>

                            <div className="mb-3">
                                <label className="form-label small fw-bold font-monospace">
                                    STRAND CODE
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    className="form-control text-uppercase fw-bold"
                                    placeholder="e.g. STEM"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                    maxLength="10"
                                />
                                <div className="form-text small fst-italic">
                                    Unique identifier (ex. ABM, GAS)
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold font-monospace">
                                    DESCRIPTION
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    placeholder="e.g. Science, Technology, Engineering..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
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
                            ) : (
                                <span>
                                    {type === "create"
                                        ? "CREATE STRAND"
                                        : "SAVE CHANGES"}
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
