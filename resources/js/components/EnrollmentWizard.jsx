import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import moment from "moment";
import { Modal } from "react-bootstrap";

export default function EnrollmentWizard({ initialData, settings, onClose }) {
    const isOldStudent = initialData.type === "old";
    const studentData = initialData.student || {};

    // STATES
    const [step, setStep] = useState(1);
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [captchaVal, setCaptchaVal] = useState(null);

    // FORM STATE
    const [form, setForm] = useState({
        // Personal
        last_name: "",
        first_name: "",
        middle_name: "",
        suffix: "",
        date_of_birth: "",
        age: "",
        gender: "Male",
        place_of_birth: "",
        citizenship: "Filipino",
        civil_status: "Single",
        religion: "Roman Catholic",
        email: "",
        contact_number: "",
        home_address: "",
        provincial_address: "",

        // Academic
        lrn: initialData.lrn || studentData.lrn || "",
        current_school_attended: "",
        strand_id: "",
        grade_level: "",
        section_id: null,
        section_name: "",
        school_year: settings?.school_year || "",
        semester: settings?.semester || "",
        learning_modality: "Face-to-Face", // ADDED FIELD

        // Employment
        is_employed: false,
        employer_name: "",
        employer_contact: "",

        // Family
        father_name: "",
        father_occupation: "",
        father_contact: "",
        mother_name: "",
        mother_occupation: "",
        mother_contact: "",
        guardian_name: "",
        guardian_occupation: "",
        guardian_contact: "",
    });

    // FETCH STRANDS
    useEffect(() => {
        axios.get("/api/public/strands").then((res) => setStrands(res.data));
    }, []);

    // OLD STUDENT LOGIC
    useEffect(() => {
        if (isOldStudent && studentData) {
            let newGrade = studentData.grade_level;
            let newSectionId = studentData.section_id;
            let newSectionName = studentData.section?.name || "";

            if (studentData.semester === "1st Semester") {
                // Retain
            } else if (studentData.semester === "2nd Semester") {
                if (studentData.grade_level == "11") {
                    newGrade = "12";
                }
                newSectionId = null;
                newSectionName = "";
            }

            setForm((prev) => ({
                ...prev,
                ...studentData,
                grade_level: newGrade,
                section_id: newSectionId,
                section_name: newSectionName,
                school_year: settings?.school_year,
                semester: settings?.semester,
                strand_id: studentData.strand_id,
                learning_modality:
                    studentData.learning_modality || "Face-to-Face", // Load if exists
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                grade_level: "11",
                school_year: settings?.school_year,
                semester: settings?.semester,
                section_id: null,
            }));
        }
    }, [isOldStudent, studentData, settings]);

    // AUTO AGE
    const handleDobChange = (e) => {
        const dob = e.target.value;
        if (dob) {
            const age = moment().diff(moment(dob), "years");
            setForm((prev) => ({ ...prev, date_of_birth: dob, age: age }));
        } else {
            setForm((prev) => ({ ...prev, date_of_birth: dob, age: "" }));
        }
    };

    // --- VALIDATION LOGIC PER STEP ---
    const validateCurrentStep = () => {
        let missingFields = [];

        if (step === 1) {
            if (!form.last_name) missingFields.push("Last Name");
            if (!form.first_name) missingFields.push("First Name");
            if (!form.date_of_birth) missingFields.push("Date of Birth");
            if (!form.place_of_birth) missingFields.push("Place of Birth");
            if (!form.citizenship) missingFields.push("Citizenship");
            if (!form.religion) missingFields.push("Religion");
            if (!form.home_address) missingFields.push("Home Address");
            if (!form.email) missingFields.push("Student Email");
            if (!form.contact_number) missingFields.push("Mobile Number");
        } else if (step === 2) {
            if (!form.lrn) missingFields.push("LRN");
            if (!form.current_school_attended)
                missingFields.push("Last School Attended");
            if (!form.strand_id) missingFields.push("Strand");
            if (!form.learning_modality)
                missingFields.push("Learning Modality"); // ✅ ADDED CHECK
        } else if (step === 3) {
            if (!form.guardian_name) missingFields.push("Guardian's Name");
            if (!form.guardian_occupation)
                missingFields.push("Guardian's Occupation");
            if (!form.guardian_contact)
                missingFields.push("Guardian's Contact");
        }

        if (missingFields.length > 0) {
            Swal.fire({
                title: "MISSING FIELDS",
                html: `Please fill out the following required fields:<br/><ul class='text-start mt-3 mb-0'><li>${missingFields.join("</li><li>")}</li></ul>`,
                icon: "warning",
                confirmButtonColor: "#2d3436",
                customClass: { popup: "card-retro" },
            });
            return false;
        }

        return true;
    };

    // --- NAVIGATION ---
    const nextStep = () => {
        if (validateCurrentStep()) {
            setStep(step + 1);
            document.querySelector(".modal")?.scrollTo(0, 0);
        }
    };

    const prevStep = () => setStep(step - 1);

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAgreed)
            return Swal.fire(
                "Required",
                "Please agree to the Terms & Policy.",
                "warning",
            );
        if (!captchaVal)
            return Swal.fire(
                "Required",
                "Please complete the CAPTCHA check.",
                "warning",
            );

        setLoading(true);

        try {
            const url = isOldStudent
                ? `/api/public/enroll-old/${studentData.id}`
                : "/api/public/enroll-new";

            await axios.post(url, form);

            Swal.fire({
                title: "APPLICATION SUBMITTED!",
                html: `
                    <div class="text-start small">
                        <p>Your enrollment application has been received.</p>
                        <p>Please check your <b>Email</b> for the schedule of requirements submission:</p>
                        <ul class="mb-0 fw-bold">
                            <li>PSA Birth Certificate</li>
                            <li>Form 138 / Report Card</li>
                            <li>2x2 Picture (2pcs)</li>
                            <li>Form 137</li>
                            <li>Certificate of Good Moral</li>
                            <li>Diploma / Certificate of Completion</li>
                        </ul>
                    </div>
                `,
                icon: "success",
                confirmButtonText: "OKAY, GOT IT!",
                confirmButtonColor: "#2d3436",
                customClass: { popup: "card-retro" },
            }).then(() => {
                onClose();
            });
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Submission failed.",
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    const Indicator = ({ num, label }) => (
        <div
            className={`d-flex flex-column align-items-center ${step >= num ? "text-dark" : "text-muted"}`}
            style={{ flex: 1 }}
        >
            <div
                className={`rounded-circle d-flex align-items-center justify-content-center fw-bold border border-2 border-dark mb-1 ${step >= num ? "bg-warning" : "bg-light"}`}
                style={{ width: "35px", height: "35px" }}
            >
                {num}
            </div>
            <small
                className="fw-bold d-none d-md-block"
                style={{ fontSize: "0.7rem" }}
            >
                {label}
            </small>
        </div>
    );

    const Label = ({ text, required = false }) => (
        <label className="form-label fw-bold small mb-1">
            {text} {required && <span className="text-danger">*</span>}
        </label>
    );

    return (
        <Modal
            show={true}
            onHide={onClose}
            backdrop="static"
            keyboard={false}
            size="xl"
            centered
        >
            <style>
                {`
                    .modal-retro-content {
                        border: 3px solid #000;
                        border-radius: 0px;
                        box-shadow: 10px 10px 0 #000;
                        background-color: #fff;
                    }
                    .modal-header-retro {
                        background-color: #F4D03F;
                        border-bottom: 3px solid #000;
                        color: #000;
                        padding: 15px 20px;
                    }
                    .form-control, .form-select {
                        border-color: #000 !important;
                        border-radius: 0 !important;
                        padding: 10px;
                        font-size: 0.9rem;
                    }
                    .form-control:focus, .form-select:focus {
                        box-shadow: none;
                        background-color: #fdfbf7;
                    }
                    
                    /* --- SPINNING TOGA ANIMATION --- */
                    @keyframes spin-toga { 
                        0% { transform: rotate(0deg); } 
                        100% { transform: rotate(360deg); } 
                    }
                    .spinner-toga { 
                        animation: spin-toga 2s linear infinite; 
                        display: inline-block; 
                    }
                `}
            </style>

            <div className="modal-content modal-retro-content font-monospace">
                {/* HEADER */}
                <div className="modal-header-retro d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-person-lines-fill fs-4"></i>
                        <h5 className="fw-black m-0 ls-1">ENROLLMENT WIZARD</h5>
                    </div>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {/* BODY */}
                <div className="modal-body p-4 p-md-5 bg-white">
                    {/* STEPPER */}
                    <div className="d-flex justify-content-between mb-4 position-relative px-md-5">
                        <div
                            className="position-absolute top-50 start-0 w-100 border-top border-2 border-dark"
                            style={{ zIndex: 0 }}
                        ></div>
                        <div
                            className="position-relative w-100 d-flex justify-content-between"
                            style={{ zIndex: 1 }}
                        >
                            <Indicator num={1} label="PERSONAL" />
                            <Indicator num={2} label="ACADEMIC" />
                            <Indicator num={3} label="FAMILY" />
                            <Indicator num={4} label="FINISH" />
                        </div>
                    </div>

                    {/* INSTRUCTIONS */}
                    <div className="alert alert-info border-2 border-dark rounded-0 mb-4 shadow-sm">
                        <div className="d-flex align-items-start gap-3">
                            <i className="bi bi-info-circle-fill fs-4 text-dark"></i>
                            <div>
                                <h6 className="fw-black m-0 text-uppercase">
                                    INSTRUCTIONS FOR ENROLLMENT
                                </h6>
                                <p className="small mb-0 mt-1">
                                    Please fill out the form completely. Fields
                                    marked with a red asterisk (
                                    <span className="text-danger fw-bold">
                                        *
                                    </span>
                                    ) are <strong>REQUIRED</strong>. Ensure all
                                    information is accurate and matches your
                                    official documents.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* --- STEP 1: PERSONAL INFORMATION --- */}
                        {step === 1 && (
                            <div className="row g-3">
                                <h4 className="fw-black border-bottom border-dark pb-2 mb-3">
                                    <i className="bi bi-person-circle me-2"></i>
                                    PERSONAL INFORMATION
                                </h4>

                                <div className="col-md-4">
                                    <Label text="LAST NAME" required />
                                    <input
                                        className="form-control"
                                        value={form.last_name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                last_name: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="e.g. Dela Cruz"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Label text="FIRST NAME" required />
                                    <input
                                        className="form-control"
                                        value={form.first_name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                first_name: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="e.g. Juan"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Label text="MIDDLE NAME" />
                                    <input
                                        className="form-control"
                                        value={form.middle_name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                middle_name: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. Santos (Optional)"
                                    />
                                </div>
                                <div className="col-md-1">
                                    <Label text="SUFFIX" />
                                    <input
                                        className="form-control"
                                        value={form.suffix}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                suffix: e.target.value,
                                            })
                                        }
                                        placeholder="Jr."
                                    />
                                </div>

                                <div className="col-md-3">
                                    <Label text="DATE OF BIRTH" required />
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.date_of_birth}
                                        onChange={handleDobChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-1">
                                    <Label text="AGE" required />
                                    <input
                                        className="form-control bg-light"
                                        value={form.age}
                                        readOnly
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-md-2">
                                    <Label text="GENDER" required />
                                    <select
                                        className="form-select"
                                        value={form.gender}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                gender: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <Label text="CIVIL STATUS" required />
                                    <select
                                        className="form-select"
                                        value={form.civil_status}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                civil_status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <Label text="RELIGION" required />
                                    <input
                                        className="form-control"
                                        value={form.religion}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                religion: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="e.g. Roman Catholic"
                                    />
                                </div>

                                <div className="col-md-8">
                                    <Label text="PLACE OF BIRTH" required />
                                    <input
                                        className="form-control"
                                        value={form.place_of_birth}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                place_of_birth: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="e.g. Quezon City"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Label text="CITIZENSHIP" required />
                                    <input
                                        className="form-control"
                                        value={form.citizenship}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                citizenship: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="e.g. Filipino"
                                    />
                                </div>

                                <div className="col-12">
                                    <Label text="HOME ADDRESS" required />
                                    <input
                                        className="form-control"
                                        value={form.home_address}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                home_address: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="House No., Street, Brgy, City, Province"
                                    />
                                </div>
                                <div className="col-12">
                                    <Label text="PROVINCIAL ADDRESS" />
                                    <input
                                        className="form-control"
                                        value={form.provincial_address}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                provincial_address:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="(Optional) If different from home address"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Label text="STUDENT EMAIL" required />
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                email: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="example@email.com"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Label text="MOBILE NUMBER" required />
                                    <input
                                        className="form-control"
                                        value={form.contact_number}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                contact_number: e.target.value,
                                            })
                                        }
                                        required
                                        maxLength="11"
                                        placeholder="09xxxxxxxxx"
                                    />
                                </div>
                            </div>
                        )}

                        {/* --- STEP 2: ACADEMIC & EMPLOYMENT --- */}
                        {step === 2 && (
                            <div className="row g-3">
                                <h4 className="fw-black border-bottom border-dark pb-2 mb-3">
                                    <i className="bi bi-mortarboard-fill me-2"></i>
                                    ACADEMIC INFORMATION
                                </h4>

                                <div className="col-md-4">
                                    <Label text="LRN" required />
                                    <input
                                        className="form-control bg-light"
                                        value={form.lrn}
                                        readOnly
                                        placeholder="12-digit LRN"
                                    />
                                </div>
                                <div className="col-md-8">
                                    <Label
                                        text="LAST SCHOOL ATTENDED"
                                        required
                                    />
                                    <input
                                        className="form-control"
                                        value={form.current_school_attended}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                current_school_attended:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="Name of previous school"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Label text="SCHOOL YEAR" required />
                                    <input
                                        className="form-control bg-light"
                                        value={form.school_year}
                                        readOnly
                                        placeholder="YYYY-YYYY"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Label text="SEMESTER" required />
                                    <input
                                        className="form-control bg-light"
                                        value={form.semester}
                                        readOnly
                                        placeholder="Current Sem"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <Label text="GRADE LEVEL" required />
                                    <input
                                        className={`form-control ${isOldStudent ? "bg-light" : ""}`}
                                        value={form.grade_level}
                                        onChange={(e) =>
                                            !isOldStudent &&
                                            setForm({
                                                ...form,
                                                grade_level: e.target.value,
                                            })
                                        }
                                        readOnly={isOldStudent}
                                        placeholder="11 or 12"
                                    />
                                </div>
                                <div className="col-md-8">
                                    <Label text="STRAND" required />
                                    {isOldStudent ? (
                                        <select
                                            className="form-select bg-light"
                                            value={form.strand_id}
                                            disabled
                                        >
                                            <option value="">
                                                -- Select Strand --
                                            </option>
                                            {strands.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.code} - {s.description}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            className="form-select"
                                            value={form.strand_id}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    strand_id: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">
                                                -- Select Strand --
                                            </option>
                                            {strands.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.code} - {s.description}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* ADDED: LEARNING MODALITY DROPDOWN */}
                                <div className="col-12">
                                    <Label text="LEARNING MODALITY" required />
                                    <select
                                        className="form-select"
                                        value={form.learning_modality}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                learning_modality:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="Face-to-Face">
                                            Face-to-Face (Regular)
                                        </option>
                                        <option value="Modular">
                                            Modular (Distance Learning)
                                        </option>
                                    </select>
                                </div>

                                {isOldStudent && form.section_name && (
                                    <div className="col-12">
                                        <div className="alert alert-warning border-dark rounded-0 small py-2 mt-2">
                                            <i className="bi bi-info-circle-fill me-2"></i>
                                            Your section{" "}
                                            <b>{form.section_name}</b> has been
                                            retained.
                                        </div>
                                    </div>
                                )}

                                <h4 className="fw-black border-bottom border-dark pb-2 mb-3 mt-4">
                                    <i className="bi bi-briefcase-fill me-2"></i>
                                    EMPLOYMENT INFO
                                </h4>
                                <div className="col-12">
                                    <div className="form-check p-2 border border-dark bg-light d-inline-block px-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={form.is_employed}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    is_employed:
                                                        e.target.checked,
                                                })
                                            }
                                            id="isEmployed"
                                        />
                                        <label
                                            className="form-check-label fw-bold small ms-2"
                                            htmlFor="isEmployed"
                                        >
                                            I AM CURRENTLY EMPLOYED (Optional)
                                        </label>
                                    </div>
                                </div>
                                {form.is_employed && (
                                    <>
                                        <div className="col-md-6">
                                            <Label text="EMPLOYER NAME" />
                                            <input
                                                className="form-control"
                                                value={form.employer_name}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        employer_name:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <Label text="EMPLOYER CONTACT" />
                                            <input
                                                className="form-control"
                                                value={form.employer_contact}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        employer_contact:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Company Contact No."
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* --- STEP 3: FAMILY BACKGROUND --- */}
                        {step === 3 && (
                            <div className="row g-3">
                                <h4 className="fw-black border-bottom border-dark pb-2 mb-3">
                                    <i className="bi bi-people-fill me-2"></i>
                                    FAMILY BACKGROUND
                                </h4>

                                <div className="col-12">
                                    <h6 className="fw-bold text-decoration-underline mt-2">
                                        FATHER'S INFORMATION
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <Label text="FULL NAME" />
                                    <input
                                        className="form-control"
                                        placeholder="Father's Full Name"
                                        value={form.father_name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                father_name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Label text="OCCUPATION" />
                                    <input
                                        className="form-control"
                                        placeholder="Job Title"
                                        value={form.father_occupation}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                father_occupation:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Label text="CONTACT NO." />
                                    <input
                                        className="form-control"
                                        placeholder="09xxxxxxxxx"
                                        value={form.father_contact}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                father_contact: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-12">
                                    <h6 className="fw-bold text-decoration-underline mt-3">
                                        MOTHER'S INFORMATION (MAIDEN NAME)
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <Label text="FULL NAME" />
                                    <input
                                        className="form-control"
                                        placeholder="Mother's Full Name"
                                        value={form.mother_name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                mother_name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Label text="OCCUPATION" />
                                    <input
                                        className="form-control"
                                        placeholder="Job Title"
                                        value={form.mother_occupation}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                mother_occupation:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Label text="CONTACT NO." />
                                    <input
                                        className="form-control"
                                        placeholder="09xxxxxxxxx"
                                        value={form.mother_contact}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                mother_contact: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-12">
                                    <h6 className="fw-bold text-decoration-underline mt-3">
                                        GUARDIAN'S INFORMATION
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <Label text="FULL NAME" required />
                                    <input
                                        className="form-control"
                                        placeholder="Guardian's Full Name"
                                        value={form.guardian_name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                guardian_name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Label text="OCCUPATION" required />
                                    <input
                                        className="form-control"
                                        placeholder="Job Title"
                                        value={form.guardian_occupation}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                guardian_occupation:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Label text="CONTACT NO." required />
                                    <input
                                        className="form-control"
                                        placeholder="09xxxxxxxxx"
                                        value={form.guardian_contact}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                guardian_contact:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* --- STEP 4: REVIEW & SUBMIT --- */}
                        {step === 4 && (
                            <div className="text-center">
                                <h4 className="fw-black mb-4">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    FINAL REVIEW
                                </h4>

                                <div className="alert alert-warning border-dark text-start rounded-0 shadow-sm">
                                    <h6 className="fw-bold">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        DECLARATION:
                                    </h6>
                                    <p className="small mb-0">
                                        I hereby certify that the information
                                        provided in this form is correct and
                                        up-to-date. I understand that any false
                                        information may be grounds for
                                        disqualification of my enrollment.
                                    </p>
                                </div>

                                <div
                                    className="form-check text-start d-flex justify-content-center gap-2 mb-4 p-3 border border-dark bg-light mx-auto"
                                    style={{ maxWidth: "600px" }}
                                >
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="agree"
                                        checked={isAgreed}
                                        onChange={(e) =>
                                            setIsAgreed(e.target.checked)
                                        }
                                        style={{ transform: "scale(1.2)" }}
                                    />
                                    <label
                                        className="form-check-label fw-bold"
                                        htmlFor="agree"
                                    >
                                        I UNDERSTAND & AGREE TO THE TERMS AND
                                        POLICY.
                                    </label>
                                </div>

                                <div className="d-flex justify-content-center mb-4">
                                    <ReCAPTCHA
                                        sitekey={
                                            import.meta.env
                                                .VITE_RECAPTCHA_SITE_KEY
                                        }
                                        onChange={(val) => setCaptchaVal(val)}
                                    />
                                </div>

                                {/* BUTTON WITH TOGA SPINNER */}
                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg w-50 rounded-0 border-2 border-dark fw-black btn-retro-effect"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span>
                                            <i className="bi bi-mortarboard-fill spinner-toga me-2"></i>
                                            SUBMITTING...
                                        </span>
                                    ) : (
                                        "SUBMIT APPLICATION"
                                    )}
                                </button>
                            </div>
                        )}

                        {/* NAVIGATION BUTTONS */}
                        <div className="d-flex justify-content-between mt-5 pt-3 border-top border-dark">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    className="btn btn-outline-dark rounded-0 fw-bold px-4"
                                    onClick={prevStep}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>{" "}
                                    BACK
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 4 && (
                                <button
                                    type="button"
                                    className="btn btn-dark rounded-0 fw-bold px-4 btn-retro-effect"
                                    onClick={nextStep}
                                >
                                    NEXT STEP{" "}
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
