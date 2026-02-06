import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Toast from "../../utils/toast"; // Using Toast

export default function StaffReports() {
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // INPUT STATES
    const [schoolYear, setSchoolYear] = useState("");
    const [registrar, setRegistrar] = useState("");

    const [loading, setLoading] = useState(false);

    // REPORT OPTIONS (Same as Admin)
    const reportOptions = [
        {
            title: "Enrollment Summary",
            desc: "Formal report of Total Enrolled, Freshmen, Old Students per Strand/Section.",
            type: "enrollment",
            format: "pdf",
            icon: "bi-file-earmark-pdf-fill",
            color: "#3F9AAE",
        },
        {
            title: "Pending Applications",
            desc: "List of all Pending and Passed students waiting for enrollment.",
            type: "pending",
            format: "pdf",
            icon: "bi-hourglass-split",
            color: "#F4D03F",
        },
        {
            title: "Dropout Report",
            desc: "Breakdown of dropped students per Grade, Strand, and Section.",
            type: "dropouts",
            format: "pdf",
            icon: "bi-person-x-fill",
            color: "#F96E5B",
        },
        {
            title: "List of Graduates",
            desc: "Official list of students who graduated in the selected School Year.",
            type: "graduates",
            format: "pdf",
            icon: "bi-mortarboard-fill",
            color: "#27ae60",
        },
        {
            title: "Released Students",
            desc: "List of students who transferred out or were officially released.",
            type: "released",
            format: "pdf",
            icon: "bi-arrow-up-right-square-fill",
            color: "#e67e22",
        },
        {
            title: "Masterlist Export (CSV)",
            desc: "Full student list. Alphabetical order, separated by Male and Female.",
            type: "masterlist",
            format: "csv",
            icon: "bi-file-earmark-spreadsheet-fill",
            color: "#2D3436",
        },
    ];

    const handleCardClick = (report) => {
        setSelectedReport(report);
        setSchoolYear("");
        setRegistrar("");
        setShowModal(true);
    };

    const handleGenerate = async () => {
        // 1. VALIDATION: Check if Empty
        if (!schoolYear) {
            Toast.fire({
                icon: "warning",
                title: "Please enter a School Year.",
            });
            return;
        }

        // 2. STRICT FORMAT CHECK (YYYY-YYYY)
        const syFormatRegex = /^\d{4}-\d{4}$/;

        if (!syFormatRegex.test(schoolYear.trim())) {
            Toast.fire({
                icon: "warning",
                title: "Invalid Format! Use YYYY-YYYY (e.g., 2025-2026).",
            });
            return;
        }

        // 3. REGISTRAR CHECK (Only for PDF)
        if (selectedReport.format === "pdf" && !registrar) {
            Toast.fire({
                icon: "warning",
                title: "Please enter the Registrar's Name.",
            });
            return;
        }

        setLoading(true);

        try {
            let url = "";
            let filename = "";
            const apiPrefix = "/api/staff"; // STAFF API PREFIX

            // PASS PARAMETERS TO BACKEND
            if (selectedReport.format === "pdf") {
                url = `${apiPrefix}/reports/summary?type=${selectedReport.type}&school_year=${schoolYear}&registrar=${encodeURIComponent(registrar)}`;
                filename = `${selectedReport.title}_${schoolYear}.pdf`;
            } else {
                url = `${apiPrefix}/reports/masterlist?school_year=${schoolYear}`;
                filename = `Masterlist_${schoolYear}.csv`;
            }

            const response = await axios.get(url, { responseType: "blob" });
            const downloadUrl = window.URL.createObjectURL(
                new Blob([response.data]),
            );
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setShowModal(false); // Close modal

            // SUCCESS TOAST
            Toast.fire({
                icon: "success",
                title: "Report Generated! Download starting...",
            });
        } catch (error) {
            console.error(error);
            // ERROR TOAST
            Toast.fire({
                icon: "error",
                title: "No data found or server error.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid fade-in mb-5">
            {/* HEADER */}
            <div
                className="d-flex justify-content-between align-items-center mb-4 pb-3"
                style={{ borderBottom: "2px solid black" }}
            >
                <div>
                    <h2
                        className="fw-bold mb-0 font-monospace text-uppercase"
                        style={{ textShadow: "2px 2px 0 #fff" }}
                    >
                        SYSTEM REPORTS
                    </h2>
                    <p className="text-muted small mb-0 font-monospace fw-bold">
                        Generate Official Documents & Exports
                    </p>
                </div>
            </div>

            {/* GRID CARDS */}
            <div className="row g-4">
                {reportOptions.map((report, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                        <div
                            className="card-retro h-100 p-0 cursor-pointer hover-scale"
                            style={{
                                backgroundColor: "#fff",
                                transition: "0.2s",
                            }}
                            onClick={() => handleCardClick(report)}
                        >
                            <div className="card-body text-center py-5 d-flex flex-column align-items-center">
                                <div
                                    className="d-flex align-items-center justify-content-center border border-2 border-dark mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        backgroundColor: report.color,
                                        borderRadius: "50%",
                                        boxShadow: "4px 4px 0 #000",
                                    }}
                                >
                                    <i
                                        className={`bi ${report.icon} fs-2 text-white`}
                                    ></i>
                                </div>
                                <h5 className="fw-bold font-monospace text-uppercase mb-2">
                                    {report.title}
                                </h5>
                                <p className="text-muted small px-3 mb-0">
                                    {report.desc}
                                </p>

                                <button className="btn btn-sm btn-dark font-monospace mt-4 rounded-0">
                                    GENERATE{" "}
                                    <i className="bi bi-arrow-right ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* GENERATE MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <div className="card-retro border-0 shadow-lg">
                    {/* MODAL HEADER */}
                    <div className="modal-header bg-dark text-white border-bottom border-dark rounded-0 py-3 position-relative justify-content-center">
                        <h5 className="modal-title fw-bold font-monospace text-center m-0">
                            <i className="bi bi-printer-fill me-2"></i>
                            GENERATE REPORT
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white position-absolute end-0 me-3"
                            onClick={() => setShowModal(false)}
                        ></button>
                    </div>

                    <div className="modal-body bg-white p-4">
                        <p className="font-monospace small mb-3 text-muted text-center">
                            Generating:{" "}
                            <strong className="text-dark text-uppercase">
                                {selectedReport?.title}
                            </strong>
                        </p>

                        <div className="form-group mb-3">
                            <label className="fw-bold font-monospace small mb-1">
                                SCHOOL YEAR (e.g., 2025-2026)
                            </label>
                            <input
                                type="text"
                                className="form-control font-monospace border-2 border-dark rounded-0 fw-bold"
                                placeholder="YYYY-YYYY"
                                value={schoolYear}
                                onChange={(e) => setSchoolYear(e.target.value)}
                            />
                        </div>

                        {selectedReport?.format === "pdf" && (
                            <div className="form-group">
                                <label className="fw-bold font-monospace small mb-1">
                                    SCHOOL REGISTRAR NAME
                                </label>
                                <input
                                    type="text"
                                    className="form-control font-monospace border-2 border-dark rounded-0 fw-bold text-uppercase"
                                    placeholder="e.g. MARIA CLARA DE LOS SANTOS"
                                    value={registrar}
                                    onChange={(e) =>
                                        setRegistrar(e.target.value)
                                    }
                                />
                                <small
                                    className="text-muted font-monospace"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    * This name will appear in the "Certified
                                    Correct by" signature block.
                                </small>
                            </div>
                        )}
                    </div>

                    {/* MODAL FOOTER */}
                    <div className="modal-footer bg-light border-top border-dark d-flex justify-content-between py-3 rounded-0">
                        <button
                            className="btn btn-success rounded-0 fw-bold px-4 btn-retro-effect"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="bi bi-mortarboard-fill fs-5 me-2 toga-spin"></i>
                                    <span>PROCESSING...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-download me-2"></i>{" "}
                                    DOWNLOAD FILE
                                </>
                            )}
                        </button>

                        <button
                            className="btn btn-secondary rounded-0 fw-bold px-4 btn-retro-effect"
                            onClick={() => setShowModal(false)}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
