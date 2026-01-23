import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "../utils/toast"; // Using Toast for alerts
import moment from "moment";

export default function StudentDrawer({
    show,
    type,
    selectedStudent,
    strands,
    onClose,
    onSuccess,
    apiPrefix = "/api", // Dynamic API prefix (Admin/Staff)
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [sectionsList, setSectionsList] = useState([]);
    const [activeSettings, setActiveSettings] = useState({
        semester: "1st Semester",
        school_year:
            new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
    });

    const initialForm = {
        // Personal
        last_name: "",
        first_name: "",
        middle_name: "",
        suffix: "",
        lrn: "",
        date_of_birth: "",
        age: "",
        gender: "Male",
        place_of_birth: "",
        citizenship: "Filipino",
        civil_status: "Single",
        religion: "Roman Catholic",
        // Contact
        home_address: "",
        provincial_address: "",
        email: "",
        contact_number: "",
        // Academic
        current_school_attended: "",
        strand_id: "",
        grade_level: "11",
        section_id: "",
        semester: "",
        school_year: "",
        learning_modality: "Face-to-Face", // ✅ ADDED MODALITY
        // Family & Work
        employer_name: "",
        employer_contact: "",
        father_name: "",
        father_occupation: "",
        father_contact: "",
        mother_name: "",
        mother_occupation: "",
        mother_contact: "",
        guardian_name: "",
        guardian_occupation: "",
        guardian_contact: "",
        // Requirements
        requirements: {
            psa: false,
            form137: false,
            good_moral: false,
            diploma: false,
            card: false,
            picture: false, // ✅ ADDED 2x2 PICTURE
        },
        // System
        status: "",
        released_by: "",
        released_at: "",
    };

    const [form, setForm] = useState(initialForm);

    // FETCH INIT DATA
    useEffect(() => {
        const fetchInit = async () => {
            try {
                const sectionUrl = `${apiPrefix}/sections`;
                const [setRes, secRes] = await Promise.all([
                    axios.get("/api/settings").catch(() => ({ data: null })),
                    axios.get(sectionUrl).catch(() => ({ data: [] })),
                ]);

                if (setRes.data) {
                    const settingsData = Array.isArray(setRes.data)
                        ? setRes.data[0]
                        : setRes.data;
                    if (settingsData) setActiveSettings(settingsData);
                }
                if (secRes.data) setSectionsList(secRes.data);
            } catch (e) {
                console.error("Init Error:", e);
            }
        };
        if (show) fetchInit();
    }, [show, apiPrefix]);

    // POPULATE FORM
    useEffect(() => {
        if ((type === "edit" || type === "view") && selectedStudent) {
            // SAFE REQUIREMENT PARSING
            let parsedReqs = initialForm.requirements;
            if (selectedStudent.requirements) {
                parsedReqs =
                    typeof selectedStudent.requirements === "string"
                        ? JSON.parse(selectedStudent.requirements)
                        : selectedStudent.requirements;
            }

            setForm({
                ...selectedStudent,
                date_of_birth: selectedStudent.date_of_birth
                    ? selectedStudent.date_of_birth.split("T")[0]
                    : "",
                section_id: selectedStudent.section_id || "",
                // Ensure modality exists, default to F2F
                learning_modality:
                    selectedStudent.learning_modality || "Face-to-Face",
                requirements: { ...initialForm.requirements, ...parsedReqs },
                school_year:
                    selectedStudent.school_year || activeSettings.school_year,
                semester: selectedStudent.semester || activeSettings.semester,
            });
        } else if (type === "create") {
            setForm((prev) => ({
                ...initialForm,
                semester: activeSettings.semester,
                school_year: activeSettings.school_year,
            }));
        }
    }, [show, selectedStudent, type, activeSettings]);

    // AUTO AGE
    useEffect(() => {
        if (form.date_of_birth && type !== "view") {
            const birth = new Date(form.date_of_birth);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            if (
                today.getMonth() < birth.getMonth() ||
                (today.getMonth() === birth.getMonth() &&
                    today.getDate() < birth.getDate())
            )
                age--;
            setForm((prev) => ({ ...prev, age: age >= 0 ? age : 0 }));
        }
    }, [form.date_of_birth]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name.startsWith("req_")) {
            setForm((prev) => ({
                ...prev,
                requirements: {
                    ...prev.requirements,
                    [name.replace("req_", "")]: checked,
                },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (type === "create") {
                await axios.post(`${apiPrefix}/students`, form);
                Toast.fire({
                    icon: "success",
                    title: "Application Sent Successfully!",
                });
            } else {
                await axios.put(
                    `${apiPrefix}/students/${selectedStudent.id}`,
                    form,
                );
                Toast.fire({
                    icon: "success",
                    title: "Student Record Updated!",
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            let msg = "Action Failed";
            if (error.response?.data?.message)
                msg = error.response.data.message;
            Toast.fire({ icon: "error", title: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSections = sectionsList.filter(
        (s) =>
            s.strand_id == form.strand_id && s.grade_level == form.grade_level,
    );
    const isReadOnly = type === "view";
    const drawerClass = show
        ? "offcanvas offcanvas-end show"
        : "offcanvas offcanvas-end";
    const backdropClass = show ? "offcanvas-backdrop fade show" : "";
    const labelStyle = "form-label small fw-bold font-monospace";
    const inputStyle = "form-control border-dark rounded-0";
    const selectStyle = "form-select border-dark rounded-0";

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
                    width: "700px",
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
                    <div className="d-flex align-items-center gap-2">
                        <i
                            className={`bi ${type === "create" ? "bi-person-plus-fill" : type === "edit" ? "bi-pencil-square" : "bi-person-badge-fill"} fs-4`}
                        ></i>
                        <h5 className="offcanvas-title fw-bold font-monospace m-0">
                            {type === "create"
                                ? "NEW STUDENT APPLICATION"
                                : type === "edit"
                                  ? "UPDATE STUDENT RECORD"
                                  : "STUDENT PROFILE"}
                        </h5>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white opacity-100"
                        onClick={onClose}
                    ></button>
                </div>

                <div
                    className="offcanvas-body"
                    style={{ backgroundColor: "#f8f9fa" }}
                >
                    {type === "view" && form.status === "released" && (
                        <div className="alert alert-dark border-2 border-dark rounded-0 mb-4 font-monospace shadow-sm bg-white">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-archive-fill fs-1 me-3"></i>
                                <div>
                                    <h6 className="fw-bold mb-1">
                                        RECORD RELEASED
                                    </h6>
                                    <p className="mb-0 small">
                                        BY: {form.released_by || "System Admin"}{" "}
                                        <br /> DATE:{" "}
                                        {moment(form.released_at).format(
                                            "MMMM Do YYYY, h:mm A",
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <form
                        onSubmit={handleSubmit}
                        className="d-flex flex-column gap-4"
                    >
                        {/* 1. PERSONAL */}
                        <div className="card-retro p-3 bg-retro-bg">
                            <h6 className="fw-bold mb-3 pb-2 border-bottom border-dark font-monospace">
                                <i className="bi bi-person-lines-fill me-2"></i>{" "}
                                PERSONAL INFORMATION
                            </h6>
                            <div className="row g-2 mb-3">
                                <div className="col-12">
                                    <label className={labelStyle}>LRN *</label>
                                    <input
                                        type="text"
                                        name="lrn"
                                        className={`${inputStyle} fw-bold bg-warning bg-opacity-10`}
                                        value={form.lrn}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="Enter 12-Digit LRN"
                                    />
                                </div>
                                <div className="col-4">
                                    <label className={labelStyle}>
                                        LAST NAME *
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className={inputStyle}
                                        value={form.last_name}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="Enter Last Name"
                                    />
                                </div>
                                <div className="col-4">
                                    <label className={labelStyle}>
                                        FIRST NAME *
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        className={inputStyle}
                                        value={form.first_name}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="Enter First Name"
                                    />
                                </div>
                                <div className="col-4">
                                    <label className={labelStyle}>
                                        MIDDLE NAME
                                    </label>
                                    <input
                                        type="text"
                                        name="middle_name"
                                        className={inputStyle}
                                        value={form.middle_name}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                        placeholder="(Optional)"
                                    />
                                </div>
                                <div className="col-4">
                                    <label className={labelStyle}>SUFFIX</label>
                                    <input
                                        type="text"
                                        name="suffix"
                                        className={inputStyle}
                                        value={form.suffix}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                        placeholder="e.g. Jr."
                                    />
                                </div>
                                <div className="col-4">
                                    <label className={labelStyle}>
                                        BIRTH DATE *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        className={inputStyle}
                                        value={form.date_of_birth}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-4">
                                    <label className={labelStyle}>AGE *</label>
                                    <input
                                        type="text"
                                        className={`${inputStyle} bg-light`}
                                        value={form.age}
                                        readOnly
                                        disabled
                                        placeholder="Auto"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        GENDER *
                                    </label>
                                    <select
                                        name="gender"
                                        className={selectStyle}
                                        value={form.gender}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        CIVIL STATUS *
                                    </label>
                                    <select
                                        name="civil_status"
                                        className={selectStyle}
                                        value={form.civil_status}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className={labelStyle}>
                                        PLACE OF BIRTH *
                                    </label>
                                    <input
                                        type="text"
                                        name="place_of_birth"
                                        className={inputStyle}
                                        value={form.place_of_birth}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="City / Municipality / Province"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        CITIZENSHIP *
                                    </label>
                                    <input
                                        type="text"
                                        name="citizenship"
                                        className={inputStyle}
                                        value={form.citizenship}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="e.g. Filipino"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        RELIGION *
                                    </label>
                                    <input
                                        type="text"
                                        name="religion"
                                        className={inputStyle}
                                        value={form.religion}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="e.g. Roman Catholic"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. CONTACT */}
                        <div className="card-retro p-3 bg-white">
                            <h6 className="fw-bold mb-3 pb-2 border-bottom border-dark font-monospace">
                                <i className="bi bi-geo-alt-fill me-2"></i>{" "}
                                CONTACT & ADDRESS
                            </h6>
                            <div className="mb-2">
                                <label className={labelStyle}>
                                    HOME ADDRESS *
                                </label>
                                <input
                                    type="text"
                                    name="home_address"
                                    className={inputStyle}
                                    value={form.home_address}
                                    onChange={handleChange}
                                    required
                                    disabled={isReadOnly}
                                    placeholder="House No., Street, Brgy, City, Province"
                                />
                            </div>
                            <div className="mb-2">
                                <label className={labelStyle}>
                                    PROVINCIAL ADDRESS
                                </label>
                                <input
                                    type="text"
                                    name="provincial_address"
                                    className={inputStyle}
                                    value={form.provincial_address}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                    placeholder="Provincial Address (If applicable)"
                                />
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        EMAIL ADDRESS *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={inputStyle}
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="student@example.com"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        MOBILE NO. *
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        className={inputStyle}
                                        value={form.contact_number}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                        placeholder="09xxxxxxxxx"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. ACADEMIC */}
                        <div className="card-retro p-3 bg-retro-bg">
                            <h6 className="fw-bold mb-3 pb-2 border-bottom border-dark font-monospace">
                                <i className="bi bi-mortarboard-fill me-2"></i>{" "}
                                ACADEMIC DETAILS
                            </h6>
                            <div className="alert alert-warning border-dark p-2 mb-3 small font-monospace d-flex justify-content-between rounded-0">
                                <span>
                                    <strong>SY:</strong>{" "}
                                    {form.school_year ||
                                        activeSettings.school_year}
                                </span>
                                <span>
                                    <strong>SEM:</strong>{" "}
                                    {form.semester || activeSettings.semester}
                                </span>
                            </div>
                            <div className="mb-2">
                                <label className={labelStyle}>
                                    PREVIOUS SCHOOL *
                                </label>
                                <input
                                    type="text"
                                    name="current_school_attended"
                                    className={inputStyle}
                                    value={form.current_school_attended}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                    placeholder="Name of Last School Attended"
                                />
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        STRAND *
                                    </label>
                                    <select
                                        name="strand_id"
                                        className={selectStyle}
                                        value={form.strand_id}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                    >
                                        <option value="">
                                            -- Select Strand --
                                        </option>
                                        {strands.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className={labelStyle}>
                                        GRADE LEVEL *
                                    </label>
                                    <select
                                        name="grade_level"
                                        className={selectStyle}
                                        value={form.grade_level}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                    >
                                        <option value="11">Grade 11</option>
                                        <option value="12">Grade 12</option>
                                    </select>
                                </div>
                                {/* ADDED LEARNING MODALITY DROPDOWN */}
                                <div className="col-12">
                                    <label className={labelStyle}>
                                        LEARNING MODALITY *
                                    </label>
                                    <select
                                        name="learning_modality"
                                        className={`${selectStyle} bg-info bg-opacity-10 fw-bold`}
                                        value={form.learning_modality}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    >
                                        <option value="Face-to-Face">
                                            Face-to-Face (Regular)
                                        </option>
                                        <option value="Modular">
                                            Modular (Distance Learning)
                                        </option>
                                    </select>
                                </div>

                                {type !== "create" && (
                                    <div className="col-12">
                                        <label className={labelStyle}>
                                            SECTION (Update Only)
                                        </label>
                                        <select
                                            name="section_id"
                                            className={`${selectStyle} bg-success bg-opacity-10 fw-bold`}
                                            value={form.section_id}
                                            onChange={handleChange}
                                            disabled={
                                                isReadOnly || !form.strand_id
                                            }
                                        >
                                            <option value="">
                                                -- Select Section --
                                            </option>
                                            {filteredSections.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} ({s.enrolled_count}
                                                    /{s.capacity})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. FAMILY & WORK */}
                        <div className="card-retro p-3 bg-white">
                            <h6 className="fw-bold mb-3 pb-2 border-bottom border-dark font-monospace">
                                <i className="bi bi-people-fill me-2"></i>{" "}
                                FAMILY & WORK
                            </h6>
                            <div className="row g-2 mb-3">
                                <div className="col-12 text-muted small fw-bold font-monospace border-bottom mb-1">
                                    FATHER'S INFO
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="father_name"
                                        className={inputStyle}
                                        placeholder="Father's Full Name"
                                        value={form.father_name}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="father_occupation"
                                        className={inputStyle}
                                        placeholder="Occupation"
                                        value={form.father_occupation}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="father_contact"
                                        className={inputStyle}
                                        placeholder="Contact No."
                                        value={form.father_contact}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-12 text-muted small fw-bold font-monospace border-bottom mb-1 mt-2">
                                    MOTHER'S INFO (MAIDEN NAME)
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="mother_name"
                                        className={inputStyle}
                                        placeholder="Mother's Full Name"
                                        value={form.mother_name}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="mother_occupation"
                                        className={inputStyle}
                                        placeholder="Occupation"
                                        value={form.mother_occupation}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="mother_contact"
                                        className={inputStyle}
                                        placeholder="Contact No."
                                        value={form.mother_contact}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-12 text-muted small fw-bold font-monospace border-bottom mb-1 mt-2">
                                    GUARDIAN'S INFO *
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="guardian_name"
                                        className={inputStyle}
                                        placeholder="Guardian's Full Name *"
                                        value={form.guardian_name}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="guardian_occupation"
                                        className={inputStyle}
                                        placeholder="Occupation *"
                                        value={form.guardian_occupation}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        name="guardian_contact"
                                        className={inputStyle}
                                        placeholder="Contact No. *"
                                        value={form.guardian_contact}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-12 text-muted small fw-bold font-monospace border-bottom mb-1">
                                    EMPLOYMENT (If Working Student)
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        name="employer_name"
                                        className={inputStyle}
                                        placeholder="Name of Company / Employer"
                                        value={form.employer_name}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        name="employer_contact"
                                        className={inputStyle}
                                        placeholder="Company / Employer Contact No."
                                        value={form.employer_contact}
                                        onChange={handleChange}
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 5. REQUIREMENTS */}
                        <div className="card-retro p-3 bg-retro-bg">
                            <h6 className="fw-bold mb-3 pb-2 border-bottom border-dark font-monospace">
                                <i className="bi bi-folder-check me-2"></i>{" "}
                                REQUIREMENTS
                            </h6>
                            <div className="row">
                                {[
                                    "psa",
                                    "form137",
                                    "good_moral",
                                    "diploma",
                                    "card",
                                    "picture", // ADDED 2x2 PICTURE
                                ].map((req) => (
                                    <div className="col-6 mb-2" key={req}>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input border-dark rounded-0"
                                                type="checkbox"
                                                name={`req_${req}`}
                                                checked={
                                                    form.requirements[req] ||
                                                    false
                                                }
                                                onChange={handleChange}
                                                disabled={isReadOnly}
                                            />
                                            <label className="form-check-label font-monospace fw-bold text-uppercase small ms-2">
                                                {/* UPDATED LABELS WITH 2x2 PICTURE */}
                                                {req === "psa"
                                                    ? "PSA Birth Cert"
                                                    : req === "form137"
                                                      ? "Form 137 / SF10"
                                                      : req === "good_moral"
                                                        ? "Good Moral Cert"
                                                        : req === "card"
                                                          ? "Report Card (F138)"
                                                          : req === "picture"
                                                            ? "2x2 Picture (2pcs)"
                                                            : "Grade 10 Diploma"}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!isReadOnly && (
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
                                ) : type === "create" ? (
                                    "SUBMIT APPLICATION"
                                ) : (
                                    "SAVE CHANGES"
                                )}
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
