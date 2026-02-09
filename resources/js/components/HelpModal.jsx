import React from "react";
import { Modal, Accordion } from "react-bootstrap";

export default function HelpModal({ show, onClose }) {
    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <div className="modal-content border-2 border-dark rounded-0 shadow-lg font-monospace">
                {/* HEADER */}
                <div className="modal-header bg-dark text-white border-bottom border-dark rounded-0 py-3">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-question-circle-fill text-warning fs-4"></i>
                        <h5 className="modal-title fw-bold m-0 ls-1">
                            HELP & INSTRUCTIONS
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
                        Select a topic below to view the step-by-step guide.
                    </p>

                    <Accordion defaultActiveKey="0">
                        {/* ITEM 1: NEW STUDENTS */}
                        <Accordion.Item eventKey="0" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-person-plus-fill me-2"></i>{" "}
                                HOW TO ENROLL (NEW STUDENTS)
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <span className="step-badge">1</span>
                                        Click the <b>"ENROLL NOW"</b> button on
                                        the home page.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">2</span>
                                        Select <b>"NEW STUDENT"</b> when
                                        prompted.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">3</span>
                                        Fill out the <b>Enrollment Form</b>{" "}
                                        (Personal, Academic, Family).
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">4</span>
                                        Upload/Submit required documents if
                                        available.
                                    </li>
                                    <li>
                                        <span className="step-badge">5</span>
                                        Submit and wait for the confirmation
                                        email.
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 2: OLD STUDENTS */}
                        <Accordion.Item eventKey="1" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-person-badge-fill me-2"></i>{" "}
                                HOW TO ENROLL (OLD STUDENTS)
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <span className="step-badge">1</span>
                                        Click <b>"ENROLL NOW"</b> and select{" "}
                                        <b>"OLD STUDENT"</b>.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">2</span>
                                        Enter your <b>12-Digit LRN</b> to
                                        retrieve your record.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">3</span>
                                        Review your information. The system will
                                        automatically set your new Grade
                                        Level/Semester.
                                    </li>
                                    <li>
                                        <span className="step-badge">4</span>
                                        Click <b>"Update Enrollment"</b> to
                                        finish.
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 3: CHECK STATUS */}
                        <Accordion.Item eventKey="2" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-search me-2"></i> HOW TO
                                CHECK STATUS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted mb-2">
                                    You can check if your application is
                                    Approved, Pending, or if you are officially
                                    Enrolled.
                                </p>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <span className="step-badge">1</span>
                                        Go to the <b>"CHECK YOUR STATUS"</b> bar
                                        at the top of the page.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">2</span>
                                        Enter your <b>LRN</b> and press Enter.
                                    </li>
                                    <li>
                                        <span className="step-badge">3</span>A
                                        window will appear showing your current{" "}
                                        <b>Enrollment Status</b> and{" "}
                                        <b>Section</b> (if assigned).
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 4: REQUIREMENTS */}
                        <Accordion.Item eventKey="3" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-folder-check me-2"></i> LIST
                                OF REQUIREMENTS
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="list-group list-group-flush small fw-bold">
                                            <li className="list-group-item px-0">
                                                <i className="bi bi-check-lg text-success me-2"></i>{" "}
                                                PSA Birth Certificate
                                            </li>
                                            <li className="list-group-item px-0">
                                                <i className="bi bi-check-lg text-success me-2"></i>{" "}
                                                Report Card (Form 138)
                                            </li>
                                            <li className="list-group-item px-0">
                                                <i className="bi bi-check-lg text-success me-2"></i>{" "}
                                                Certificate of Good Moral
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="list-group list-group-flush small fw-bold">
                                            <li className="list-group-item px-0">
                                                <i className="bi bi-check-lg text-success me-2"></i>{" "}
                                                Form 137 / SF10
                                            </li>
                                            <li className="list-group-item px-0">
                                                <i className="bi bi-check-lg text-success me-2"></i>{" "}
                                                2x2 Picture (2pcs)
                                            </li>
                                            <li className="list-group-item px-0">
                                                <i className="bi bi-check-lg text-success me-2"></i>{" "}
                                                Diploma / Cert of Completion
                                            </li>
                                        </ul>
                                    </div>
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
