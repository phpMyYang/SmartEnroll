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
        >
            {/* --- CUSTOM CSS FOR MODAL --- */}
            <style>
                {`
                    /* Retro Card Modal Style */
                    .modal-retro-content {
                        border: 3px solid #000;
                        border-radius: 0px;
                        box-shadow: 10px 10px 0 #000;
                        background-color: #fff;
                    }
                    .modal-header-retro {
                        background-color: #F4D03F; /* Yellow Header */
                        border-bottom: 3px solid #000;
                        color: #000;
                        padding: 15px 20px;
                    }
                    .info-row {
                        border-bottom: 1px dashed #000;
                        padding: 8px 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .label-retro {
                        font-weight: bold;
                        color: #555;
                        text-transform: uppercase;
                        font-size: 0.85rem;
                    }
                    .value-retro {
                        font-weight: 900;
                        color: #000;
                        text-transform: uppercase;
                        font-size: 1rem;
                    }
                `}
            </style>

            <div className="modal-content modal-retro-content font-monospace">
                {/* --- HEADER --- */}
                <div className="modal-header-retro d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-person-fill fs-4"></i>
                        <h5 className="fw-black m-0 ls-1">STUDENT RECORD</h5>
                    </div>
                    {/* Close "X" Button */}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        style={{ filter: "opacity(1)" }}
                    ></button>
                </div>

                {/* --- BODY --- */}
                <div
                    className="modal-body p-4"
                    style={{ backgroundColor: "#fcfbf4" }}
                >
                    {/* Status Badge (Centered) */}
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
                        {/* LRN */}
                        <div className="info-row">
                            <span className="label-retro">
                                <i className="bi bi-upc-scan me-2"></i>LRN
                            </span>
                            <span className="value-retro text-primary">
                                {student.lrn || "N/A"}
                            </span>
                        </div>

                        {/* NAME */}
                        <div className="info-row">
                            <span className="label-retro">
                                <i className="bi bi-person-circle me-2"></i>Name
                            </span>
                            <span className="value-retro">
                                {student.last_name}, {student.first_name}
                            </span>
                        </div>

                        {/* GRADE LEVEL */}
                        <div className="info-row">
                            <span className="label-retro">
                                <i className="bi bi-ladder me-2"></i>Level
                            </span>
                            <span className="value-retro">
                                Grade {student.grade_level}
                            </span>
                        </div>

                        {/* STRAND */}
                        <div className="info-row">
                            <span className="label-retro">
                                <i className="bi bi-book-half me-2"></i>Strand
                            </span>
                            <span className="value-retro">
                                {student.strand?.code || "N/A"}
                            </span>
                        </div>

                        {/* SECTION (Fixed Error: added .name) */}
                        <div className="info-row">
                            <span className="label-retro">
                                <i className="bi bi-people-fill me-2"></i>
                                Section
                            </span>
                            <span className="value-retro">
                                {student.section?.name || "TBA"}
                            </span>
                        </div>

                        {/* SEMESTER */}
                        <div className="info-row">
                            <span className="label-retro">
                                <i className="bi bi-calendar-event me-2"></i>
                                Semester
                            </span>
                            <span className="value-retro">
                                {student.semester ? student.semester : "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-4">
                        <p className="small text-muted mb-3 fst-italic">
                            * This is a system generated status report.
                        </p>

                        {/* UPDATED BUTTON: MATCHING LRNCHECKMODAL STYLE */}
                        <button
                            className="btn btn-dark w-100 rounded-0 fw-bold btn-retro-effect"
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
