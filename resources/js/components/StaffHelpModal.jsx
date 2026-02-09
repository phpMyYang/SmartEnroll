import React from "react";
import { Modal, Accordion } from "react-bootstrap";

export default function StaffHelpModal({ show, onClose }) {
    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <div className="modal-content border-2 border-dark rounded-0 shadow-lg font-monospace">
                {/* HEADER */}
                <div className="modal-header bg-dark text-white border-bottom border-dark rounded-0 py-3">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-info-circle-fill text-warning fs-4"></i>
                        <h5 className="modal-title fw-bold m-0 ls-1">
                            STAFF SYSTEM GUIDE
                        </h5>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={onClose}
                    ></button>
                </div>

                {/* BODY */}
                <div className="modal-body bg-light p-4">
                    <p className="text-muted small mb-4 text-center">
                        Welcome, Staff! Select a module below to view the
                        complete instructions.
                    </p>

                    <Accordion defaultActiveKey="0">
                        {/* ITEM 1: DASHBOARD & ANALYTICS */}
                        <Accordion.Item eventKey="0" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-bar-chart-line-fill me-2"></i>{" "}
                                DASHBOARD & ANALYTICS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted border-bottom border-dark pb-2 mb-3">
                                    Monitor enrollment statistics and trends in
                                    real-time.
                                </p>
                                <div className="mb-3">
                                    <h6 className="fw-bold small text-primary mb-2">
                                        <i className="bi bi-funnel-fill me-1"></i>{" "}
                                        USING FILTERS
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                1
                                            </span>
                                            Locate the search bar at the top
                                            right.
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                2
                                            </span>
                                            Enter a <b>School Year</b> (e.g.,{" "}
                                            <i>2025-2026</i>) or a single year
                                            (e.g., <i>2025</i>).
                                        </li>
                                        <li>
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                3
                                            </span>
                                            Press <b>Enter</b>. All cards and
                                            charts will update to show data for
                                            that specific period.
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h6 className="fw-bold small text-success mb-2">
                                        <i className="bi bi-pie-chart-fill me-1"></i>{" "}
                                        READING CHARTS
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li>
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            <b>Enrolled Per Strand:</b> Doughnut
                                            chart showing the percentage of
                                            students per track.
                                        </li>
                                        <li>
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            <b>Enrollment Trend:</b> Line graph
                                            showing the influx of enrollees per
                                            month.
                                        </li>
                                    </ul>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 2: STUDENT RECORDS */}
                        <Accordion.Item eventKey="1" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-mortarboard-fill me-2"></i>{" "}
                                MANAGING STUDENT RECORDS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted border-bottom border-dark pb-2 mb-3">
                                    Process applications, enrollment, and
                                    requirements.
                                </p>

                                {/* A. REGISTRATION */}
                                <div className="mb-3">
                                    <h6 className="fw-bold small text-primary mb-2">
                                        A. NEW REGISTRATION & REQUIREMENTS
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <i className="bi bi-dot"></i>
                                            Click <b>
                                                "REGISTER NEW STUDENT"
                                            </b>{" "}
                                            to add a student manually.
                                        </li>
                                        <li className="mb-1">
                                            <i className="bi bi-dot"></i>
                                            To check requirements (PSA, Form
                                            137), click the{" "}
                                            <b>
                                                Action Menu{" "}
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </b>{" "}
                                            then select <b>"View / Edit"</b>.
                                        </li>
                                    </ul>
                                </div>

                                {/* B. ENROLLMENT */}
                                <div className="mb-3">
                                    <h6 className="fw-bold small text-success mb-2">
                                        B. HOW TO ENROLL (COR)
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                1
                                            </span>
                                            Find the student (Pending/Passed)
                                            and click <b>Action Menu</b>.
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                2
                                            </span>
                                            Select <b>"Enroll / Section"</b>.
                                            This opens the COR Preview.
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                3
                                            </span>
                                            <b>Select Section:</b> Choose from
                                            the dropdown (Full sections are
                                            disabled).
                                        </li>
                                        <li>
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                4
                                            </span>
                                            Click <b>"UPDATE & DOWNLOAD"</b>.
                                            The student is now <b>ENROLLED</b>.
                                        </li>
                                    </ul>
                                </div>

                                {/* C. OTHER STATUSES */}
                                <div>
                                    <h6 className="fw-bold small text-danger mb-2">
                                        C. OTHER STATUSES
                                    </h6>
                                    <p className="small ms-2 mb-0">
                                        Use the Action Menu to mark students as:
                                        <b> Dropped</b>, <b> Graduate</b>, or{" "}
                                        <b> Released</b>.
                                    </p>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 3: ACADEMIC STRANDS */}
                        <Accordion.Item eventKey="2" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-diagram-3-fill me-2"></i>{" "}
                                MANAGING ACADEMIC STRANDS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted border-bottom border-dark pb-2 mb-3">
                                    Configure tracks (STEM, ABM, HUMSS, etc.).
                                </p>
                                <div className="mb-3">
                                    <h6 className="fw-bold small text-primary mb-2">
                                        <i className="bi bi-plus-circle-fill me-1"></i>{" "}
                                        ADDING STRANDS
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                1
                                            </span>
                                            Click <b>"CREATE NEW STRAND"</b>.
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                2
                                            </span>
                                            <b>Code:</b> Short abbreviation
                                            (e.g., <i>STEM</i>).
                                        </li>
                                        <li>
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                3
                                            </span>
                                            <b>Description:</b> Full name (e.g.,{" "}
                                            <i>Science, Tech, Eng...</i>).
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h6 className="fw-bold small text-danger mb-2">
                                        <i className="bi bi-trash-fill me-1"></i>{" "}
                                        DELETING STRANDS
                                    </h6>
                                    <p className="small ms-2 mb-0">
                                        <i className="bi bi-exclamation-triangle-fill text-warning me-1"></i>
                                        <b>Warning:</b> Ensure no active
                                        students are assigned to a strand before
                                        deleting it.
                                    </p>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 4: CLASS SECTIONS */}
                        <Accordion.Item eventKey="3" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-grid-3x3-gap-fill me-2"></i>{" "}
                                MANAGING CLASS SECTIONS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted border-bottom border-dark pb-2 mb-3">
                                    Organize students into sections and monitor
                                    capacity.
                                </p>

                                <div className="mb-3">
                                    <h6 className="fw-bold small text-primary mb-2">
                                        <i className="bi bi-plus-square-fill me-1"></i>{" "}
                                        CREATING SECTIONS
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                1
                                            </span>
                                            Click <b>"CREATE NEW SECTION"</b>.
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                2
                                            </span>
                                            Define the <b>Name</b>,{" "}
                                            <b>Strand</b>, and{" "}
                                            <b>Grade Level</b>.
                                        </li>
                                        <li>
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                3
                                            </span>
                                            <b>Capacity:</b> Set max students
                                            (Default: 40). Enrollment stops when
                                            reached.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h6 className="fw-bold small text-success mb-2">
                                        <i className="bi bi-people-fill me-1"></i>{" "}
                                        MASTERLIST & MONITORING
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            <b>Population Bar:</b> Green bar
                                            shows occupancy. Turns <b>RED</b>{" "}
                                            when full.
                                        </li>
                                        <li>
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            <b>Download List:</b> Click the{" "}
                                            <i className="bi bi-list-task"></i>{" "}
                                            icon to view enrolled students and
                                            download the{" "}
                                            <b>Class Masterlist PDF</b>.
                                        </li>
                                    </ul>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 5: ACADEMIC SUBJECTS */}
                        <Accordion.Item eventKey="4" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-book-fill me-2"></i>{" "}
                                MANAGING ACADEMIC SUBJECTS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted border-bottom border-dark pb-2 mb-3">
                                    Manage curriculum subjects for each strand
                                    and grade level.
                                </p>

                                <div className="mb-3">
                                    <h6 className="fw-bold small text-primary mb-2">
                                        <i className="bi bi-plus-circle-fill me-1"></i>{" "}
                                        CREATING SUBJECTS
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                1
                                            </span>
                                            Click <b>"CREATE NEW SUBJECT"</b>.
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                2
                                            </span>
                                            <b>Code & Description:</b> Enter the
                                            subject code (e.g., <i>CORE 01</i>)
                                            and title.
                                        </li>
                                        <li>
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                3
                                            </span>
                                            <b>Assign Strand:</b>
                                            <ul className="list-unstyled ms-3 mt-1 text-muted small">
                                                <li>
                                                    • Select a{" "}
                                                    <b>Specific Strand</b>{" "}
                                                    (e.g., STEM) if it's
                                                    specialized.
                                                </li>
                                                <li>
                                                    • Select{" "}
                                                    <b>
                                                        "Core Subject (All
                                                        Strands)"
                                                    </b>{" "}
                                                    if it applies to everyone.
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h6 className="fw-bold small text-info mb-2">
                                        <i className="bi bi-funnel-fill me-1"></i>{" "}
                                        FILTERING & MANAGING
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            Use the dropdown filters to sort by{" "}
                                            <b>Grade</b>, <b>Semester</b>, or{" "}
                                            <b>Strand</b>.
                                        </li>
                                        <li>
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            <b>Actions:</b> Use{" "}
                                            <i className="bi bi-pencil-square text-warning"></i>{" "}
                                            to Edit or{" "}
                                            <i className="bi bi-trash-fill text-danger"></i>{" "}
                                            to Delete.
                                        </li>
                                    </ul>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 6: SYSTEM REPORTS & EXPORTS */}
                        <Accordion.Item eventKey="5" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-file-earmark-bar-graph-fill me-2"></i>{" "}
                                SYSTEM REPORTS & EXPORTS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted border-bottom border-dark pb-2 mb-3">
                                    Generate official PDF reports and CSV
                                    masterlists.
                                </p>

                                <div className="mb-3">
                                    <h6 className="fw-bold small text-primary mb-2">
                                        <i className="bi bi-file-earmark-pdf-fill me-1"></i>{" "}
                                        GENERATING PDF REPORTS
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                1
                                            </span>
                                            Select a report type (e.g.,{" "}
                                            <i>Enrollment Summary</i>,{" "}
                                            <i>List of Graduates</i>).
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                2
                                            </span>
                                            <b>School Year:</b> Enter the format{" "}
                                            <b>YYYY-YYYY</b> (e.g., 2025-2026).
                                        </li>
                                        <li className="mb-1">
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                3
                                            </span>
                                            <b>Registrar:</b> Enter the name of
                                            the signatory.
                                        </li>
                                        <li>
                                            <span
                                                className="step-badge step-badge-yellow"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    fontSize: "0.7rem",
                                                }}
                                            >
                                                4
                                            </span>
                                            Click <b>"DOWNLOAD FILE"</b>.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h6 className="fw-bold small text-success mb-2">
                                        <i className="bi bi-file-earmark-spreadsheet-fill me-1"></i>{" "}
                                        MASTERLIST EXPORT (CSV)
                                    </h6>
                                    <ul className="list-unstyled small ms-2">
                                        <li className="mb-1">
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            Select{" "}
                                            <b>"Masterlist Export (CSV)"</b> to
                                            get the full list of students.
                                        </li>
                                        <li>
                                            <i className="bi bi-caret-right-fill me-1"></i>
                                            This file is compatible with{" "}
                                            <b>Microsoft Excel</b>.
                                        </li>
                                    </ul>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                {/* FOOTER */}
                <div className="modal-footer bg-white border-top border-dark d-flex justify-content-center py-3">
                    <button
                        className="btn btn-dark rounded-0 fw-bold px-5 btn-retro-effect"
                        onClick={onClose}
                    >
                        GOT IT, THANKS!
                    </button>
                </div>
            </div>
        </Modal>
    );
}
