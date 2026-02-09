import React from "react";
import { Modal } from "react-bootstrap";

export default function StatusCheckModal({ show, student, onClose }) {
    if (!student) return null;

    // Helper para sa kulay ng status badge
    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === "enrolled") return "bg-success text-white";
        if (s === "pending") return "bg-warning text-dark";
        if (s === "dropped") return "bg-danger text-white";
        return "bg-secondary text-white";
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-retro-wrapper"
        >
            <div className="modal-content modal-retro-content font-monospace">
                {/* --- HEADER --- */}
                <div className="modal-header-retro d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-person-fill fs-4"></i>
                        <h5 className="fw-black m-0 ls-1">STUDENT RECORD</h5>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                    ></button>
                </div>

                {/* --- BODY --- */}
                <div className="modal-body p-4 bg-retro-bg">
                    {/* Status Badge */}
                    <div className="text-center mb-4">
                        <div
                            className={`d-inline-block px-4 py-2 border border-2 border-dark ${getStatusColor(student.status)}`}
                            style={{
                                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
                                fontWeight: "bold",
                                letterSpacing: "2px",
                            }}
                        >
                            {student.status
                                ? student.status.toUpperCase()
                                : "UNKNOWN"}
                        </div>
                        <div className="small text-muted mt-2 fw-bold">
                            CURRENT STATUS
                        </div>
                    </div>

                    {/* Academic Information Details */}
                    <div className="border border-2 border-dark bg-white p-3">
                        {/* Info Rows - Gagamit tayo ng utility classes na idadagdag natin sa SCSS mamaya o inline para sa layout */}
                        {[
                            {
                                label: "LRN",
                                icon: "bi-upc-scan",
                                value: student.lrn,
                                color: "text-primary",
                            },
                            {
                                label: "Name",
                                icon: "bi-person-circle",
                                value: `${student.last_name}, ${student.first_name}`,
                            },
                            {
                                label: "Level",
                                icon: "bi-ladder",
                                value: `Grade ${student.grade_level}`,
                            },
                            {
                                label: "Strand",
                                icon: "bi-book-half",
                                value: student.strand?.code || "N/A",
                            },
                            {
                                label: "Section",
                                icon: "bi-people-fill",
                                value: student.section?.name || "TBA",
                            },
                            {
                                label: "Semester",
                                icon: "bi-calendar-event",
                                value: student.semester || "N/A",
                            },
                        ].map((row, idx, arr) => (
                            <div
                                key={row.label}
                                className={`d-flex justify-content-between align-items-center py-2 ${idx !== arr.length - 1 ? "border-bottom border-dark border-1 border-dashed" : ""}`}
                            >
                                <span className="fw-bold text-muted small text-uppercase">
                                    <i className={`bi ${row.icon} me-2`}></i>
                                    {row.label}
                                </span>
                                <span
                                    className={`fw-bolder text-uppercase ${row.color || "text-dark"}`}
                                >
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-4">
                        <p className="small text-muted mb-3 fst-italic">
                            * This is a system generated status report.
                        </p>

                        <button
                            className="btn btn-dark w-100 btn-retro-effect py-2"
                            onClick={onClose}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
