import React, { useEffect, useState } from "react";

export default function SubjectDrawer({
    show,
    type,
    selectedSubject,
    strands, // Need natin list ng strands para sa dropdown
    onClose,
    onSubmit,
    isLoading,
}) {
    const initialForm = {
        code: "",
        description: "",
        strand_id: "",
        grade_level: "11",
        semester: "1st",
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (type === "edit" && selectedSubject) {
            setFormData({
                code: selectedSubject.code,
                description: selectedSubject.description,
                strand_id: selectedSubject.strand_id || "", // Handle null
                grade_level: selectedSubject.grade_level,
                semester: selectedSubject.semester,
            });
        } else {
            setFormData(initialForm);
        }
    }, [type, selectedSubject, show]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

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
                        {type === "create" ? (
                            <>
                                <i className="bi bi-book-half me-2"></i>NEW
                                SUBJECT
                            </>
                        ) : (
                            <>
                                <i className="bi bi-pencil-square me-2"></i>EDIT
                                SUBJECT
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
                                Subject Information
                            </h6>

                            {/* CODE */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold font-monospace">
                                    SUBJECT CODE
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    className="form-control text-uppercase fw-bold"
                                    placeholder="e.g. CORE01"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold font-monospace">
                                    DESCRIPTION
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="2"
                                    placeholder="e.g. Oral Communication"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            {/* STRAND SELECTION */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold font-monospace">
                                    STRAND
                                </label>
                                <select
                                    name="strand_id"
                                    className="form-select"
                                    value={formData.strand_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        ALL STRANDS (Core Subject)
                                    </option>
                                    {strands.map((strand) => (
                                        <option
                                            key={strand.id}
                                            value={strand.id}
                                        >
                                            {strand.code} - {strand.description}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-text small fst-italic">
                                    Leave as "All Strands" if subject is for
                                    everyone.
                                </div>
                            </div>

                            {/* GRADE & SEMESTER */}
                            <div className="row">
                                <div className="col-6">
                                    <label className="form-label small fw-bold font-monospace">
                                        GRADE LEVEL
                                    </label>
                                    <select
                                        name="grade_level"
                                        className="form-select"
                                        value={formData.grade_level}
                                        onChange={handleChange}
                                    >
                                        <option value="11">Grade 11</option>
                                        <option value="12">Grade 12</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold font-monospace">
                                        SEMESTER
                                    </label>
                                    <select
                                        name="semester"
                                        className="form-select"
                                        value={formData.semester}
                                        onChange={handleChange}
                                    >
                                        <option value="1st">1st Sem</option>
                                        <option value="2nd">2nd Sem</option>
                                    </select>
                                </div>
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
                                    <span>SAVING...</span>
                                </>
                            ) : (
                                <span>
                                    {type === "create"
                                        ? "CREATE SUBJECT"
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
