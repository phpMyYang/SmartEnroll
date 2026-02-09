import React from "react";
import { Modal, Accordion } from "react-bootstrap";

export default function AuthHelpModal({ show, onClose }) {
    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <div className="modal-content border-2 border-dark rounded-0 shadow-lg font-monospace">
                {/* HEADER */}
                <div className="modal-header bg-dark text-white border-bottom border-dark rounded-0 py-3">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-shield-lock-fill text-warning fs-4"></i>
                        <h5 className="modal-title fw-bold m-0 ls-1">
                            AUTHENTICATION GUIDE
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
                        Having trouble accessing the system? Check the guides
                        below.
                    </p>

                    <Accordion defaultActiveKey="0">
                        {/* ITEM 1: HOW TO LOGIN */}
                        <Accordion.Item eventKey="0" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-box-arrow-in-right me-2"></i>{" "}
                                HOW TO LOGIN (STAFF & ADMIN)
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <span className="step-badge">1</span>
                                        Enter your registered{" "}
                                        <b>Email Address</b>.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">2</span>
                                        Enter your secure <b>Password</b>.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">3</span>
                                        (Optional) Check <b>"Remember Me"</b> to
                                        stay logged in.
                                    </li>
                                    <li>
                                        <span className="step-badge">4</span>
                                        Click <b>"ACCESS PORTAL"</b>. You will
                                        be redirected to your dashboard based on
                                        your role.
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 2: FORGOT PASSWORD */}
                        <Accordion.Item eventKey="1" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-key-fill me-2"></i> I FORGOT
                                MY PASSWORD
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <span className="step-badge">1</span>
                                        Click the <b>"Forgot Password?"</b> link
                                        below the login form.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">2</span>
                                        Enter your registered email and complete
                                        the CAPTCHA check.
                                    </li>
                                    <li className="mb-2">
                                        <span className="step-badge">3</span>
                                        Check your email inbox (and spam folder)
                                        for the <b>Reset Link</b>.
                                    </li>
                                    <li>
                                        <span className="step-badge">4</span>
                                        Click the link and create a new
                                        password.
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* ITEM 3: EMAIL VERIFICATION */}
                        <Accordion.Item eventKey="2" className="rounded-0">
                            <Accordion.Header>
                                <i className="bi bi-envelope-check-fill me-2"></i>{" "}
                                EMAIL NOT VERIFIED?
                            </Accordion.Header>
                            <Accordion.Body className="bg-white">
                                <p className="small text-muted mb-2">
                                    For security, all accounts must verify their
                                    email address before logging in.
                                </p>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <span className="step-badge">1</span>
                                        If the system says{" "}
                                        <b>"Email not verified"</b>, check your
                                        inbox for the activation link sent upon
                                        registration.
                                    </li>
                                    <li>
                                        <span className="step-badge">2</span>
                                        If the link expired, try logging in
                                        again. You will see a button to{" "}
                                        <b>"RESEND VERIFICATION LINK"</b>.
                                    </li>
                                </ul>
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
