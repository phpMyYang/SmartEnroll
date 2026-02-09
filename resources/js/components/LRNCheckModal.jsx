import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

export default function LRNCheckModal({ show, onClose, onProceed }) {
    const [lrn, setLrn] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCheck = async (e) => {
        e.preventDefault();
        if (lrn.length !== 12)
            return Swal.fire("Invalid", "LRN must be 12 digits.", "warning");
        setLoading(true);

        try {
            const res = await axios.post("/api/public/check-lrn", { lrn });
            const student = res.data;

            // EXISTING STUDENT LOGIC
            if (student) {
                if (student.status === "passed") {
                    onProceed({ type: "old", student }); // Go to Wizard (Edit)
                } else {
                    Swal.fire({
                        title: "Cannot Proceed",
                        html: `Status is <b>${student.status.toUpperCase()}</b>. <br>Please visit the Registrar.`,
                        icon: "info",
                        confirmButtonColor: "#2d3436",
                        customClass: { popup: "card-retro" },
                    });
                }
            }
        } catch (error) {
            // NEW STUDENT LOGIC (404)
            if (error.response && error.response.status === 404) {
                onProceed({ type: "new", lrn }); // Go to Wizard (New)
            } else {
                Swal.fire("Error", "Server Error", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static"
            keyboard={false}
        >
            <div className="modal-content modal-retro-content font-monospace">
                {/* --- HEADER --- */}
                <div className="modal-header-retro d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-shield-lock-fill fs-4"></i>
                        <h5 className="fw-black m-0 ls-1">VERIFY LRN</h5>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                    ></button>
                </div>

                {/* --- BODY --- */}
                <div
                    className="modal-body p-4"
                    style={{ backgroundColor: "#fcfbf4" }}
                >
                    <form onSubmit={handleCheck}>
                        <div className="mb-4 text-center">
                            <label className="form-label fw-bold small text-muted">
                                PLEASE ENTER YOUR LEARNER REFERENCE NO.
                            </label>
                            <input
                                type="text"
                                className="form-control border-2 border-dark rounded-0 fw-bold text-center fs-4"
                                placeholder="123456789012"
                                value={lrn}
                                onChange={(e) =>
                                    setLrn(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 12),
                                    )
                                }
                                maxLength={12}
                                required
                                style={{ letterSpacing: "3px" }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-dark w-100 rounded-0 fw-bold btn-retro-effect py-2"
                            disabled={loading}
                            style={{ letterSpacing: "1px" }}
                        >
                            {loading ? (
                                <span>
                                    {/* TOGA SPINNER HERE */}
                                    <i className="bi bi-mortarboard-fill spinner-toga me-2"></i>
                                    CHECKING...
                                </span>
                            ) : (
                                <span>
                                    PROCEED{" "}
                                    <i className="bi bi-arrow-right-short"></i>
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
