import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../utils/toast";

export default function CORModal({
    show,
    student,
    onClose,
    apiPrefix = "/api", // DEFAULT: Admin (/api). Override sa Staff (/api/staff).
}) {
    if (!show || !student) return null;

    // --- STATES ---
    const [loading, setLoading] = useState(true);
    const [availableSections, setAvailableSections] = useState([]);

    // FORM DATA
    const [formData, setFormData] = useState({
        info: {
            name: "",
            lrn: "",
            strand: "",
            grade_level: "",
            section_id: "",
            section_name: "",
            school_year: "",
            semester: "",
        },
        subjects: [],
        fees: { tuition: 0, miscellaneous: 0, books: 0, total: 0 },
        signatories: {
            adviser: "",
            registrar: "MARIA ELENA S. REYES",
            finance: "FINANCE OFFICER",
        },
        or_number: "",
    });

    // --- INITIAL FETCH ---
    useEffect(() => {
        if (student) {
            setLoading(true);
            // DYNAMIC FETCH URL: Uses apiPrefix
            axios
                .get(`${apiPrefix}/students/${student.id}/cor-data`)
                .then((res) => {
                    const { available_sections, suggested_subjects } = res.data;
                    setAvailableSections(available_sections);

                    setFormData({
                        info: {
                            name: `${student.last_name}, ${student.first_name} ${student.middle_name || ""} ${student.suffix || ""}`.toUpperCase(),
                            lrn: student.lrn,
                            strand: student.strand?.code || "N/A",
                            grade_level: student.grade_level,
                            section_id: student.section_id || "",
                            section_name: student.section?.name || "",
                            school_year: student.school_year || "2025-2026",
                            semester: student.semester || "1st Semester",
                        },
                        // LOAD INITIAL SUBJECTS
                        subjects: suggested_subjects.map((s) => ({
                            code: s.code,
                            desc: s.description,
                            sched: "",
                            teacher: "",
                        })),
                        fees: {
                            tuition: 5000,
                            miscellaneous: 1500,
                            books: 2000,
                            total: 8500,
                        },
                        signatories: {
                            adviser: student.section?.adviser_name || "",
                            registrar: "MARIA ELENA S. REYES",
                            finance: "FINANCE OFFICER",
                        },
                        or_number:
                            "OR-" + Math.floor(100000 + Math.random() * 900000),
                    });
                })
                .catch((err) => {
                    console.error(err);
                    Toast.fire({
                        icon: "error",
                        title: "Failed to load data.",
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [student, apiPrefix]);

    // --- HANDLERS ---

    // 1. SECTION CHANGE
    const handleSectionChange = (e) => {
        const secId = e.target.value;
        const selectedSec = availableSections.find((s) => s.id == secId);

        setFormData((prev) => ({
            ...prev,
            info: {
                ...prev.info,
                section_id: secId,
                section_name: selectedSec ? selectedSec.name : "",
            },
            signatories: {
                ...prev.signatories,
                adviser: selectedSec ? selectedSec.adviser_name || "" : "",
            },
        }));
    };

    // 2. FEE CHANGE
    const handleFeeChange = (e) => {
        const { name, value } = e.target;
        const val = parseFloat(value) || 0;
        const newFees = { ...formData.fees, [name]: val };
        newFees.total = newFees.tuition + newFees.miscellaneous + newFees.books;
        setFormData((prev) => ({ ...prev, fees: newFees }));
    };

    // 3. SIGNATORY CHANGE
    const handleSigChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            signatories: {
                ...prev.signatories,
                [e.target.name]: e.target.value,
            },
        }));
    };

    // --- SUBJECT HANDLERS (ADD / EDIT / REMOVE) ---

    // A. EDIT CELL (Code, Desc, Sched, Teacher)
    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[index][field] = value;
        setFormData((prev) => ({ ...prev, subjects: updatedSubjects }));
    };

    // B. ADD NEW ROW
    const addRow = () => {
        const newSubject = { code: "", desc: "", sched: "", teacher: "" };
        setFormData((prev) => ({
            ...prev,
            subjects: [...prev.subjects, newSubject],
        }));
    };

    // C. REMOVE ROW
    const removeRow = (index) => {
        const updatedSubjects = [...formData.subjects];
        updatedSubjects.splice(index, 1);
        setFormData((prev) => ({ ...prev, subjects: updatedSubjects }));
    };

    // 5. DOWNLOAD PDF
    const handleDownloadPDF = async () => {
        try {
            Swal.fire({
                title: "Generating Document...",
                text: "Please wait...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            // DYNAMIC GENERATE URL: Uses apiPrefix
            const response = await axios.post(`${apiPrefix}/cor/generate-url`, {
                ...formData,
                printed_by: "Admin", // Pwede mo rin gawing dynamic ito kung gusto mo (e.g. currentUser.name)
            });

            window.open(response.data.url, "_blank");
            Swal.close();
        } catch (error) {
            Swal.fire("Error", "Failed to generate PDF.", "error");
        }
    };

    return (
        <>
            <div
                className="modal-backdrop fade show"
                style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1050 }}
            ></div>
            <div
                className="modal fade show d-block"
                style={{ zIndex: 1055, overflowY: "auto" }}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-2 border-dark rounded-0 shadow-lg">
                        {/* HEADER */}
                        <div className="modal-header bg-dark text-white border-bottom border-dark rounded-0 py-3">
                            <h5 className="modal-title fw-bold font-monospace mx-auto">
                                <i className="bi bi-printer-fill me-2 text-warning"></i>{" "}
                                PREVIEW & EDIT COR
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white position-absolute end-0 me-3"
                                onClick={onClose}
                            ></button>
                        </div>

                        {/* BODY */}
                        <div className="modal-body bg-light">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border"></div>
                                </div>
                            ) : (
                                <div className="container-fluid font-monospace small">
                                    {/* TOP: SECTION & OR */}
                                    <div className="row mb-3 g-2">
                                        <div className="col-md-7">
                                            <label className="fw-bold mb-1">
                                                SELECT SECTION:
                                            </label>
                                            <select
                                                className="form-select form-select-sm border-dark rounded-0 fw-bold"
                                                value={formData.info.section_id}
                                                onChange={handleSectionChange}
                                            >
                                                <option value="" disabled>
                                                    -- Select Section --
                                                </option>
                                                {availableSections.map(
                                                    (sec) => (
                                                        <option
                                                            key={sec.id}
                                                            value={sec.id}
                                                        >
                                                            {sec.name} (
                                                            {sec.enrolled_count}
                                                            /{sec.capacity})
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                        <div className="col-md-5">
                                            <label className="fw-bold mb-1">
                                                OFFICIAL RECEIPT NO:
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-dark rounded-0 text-danger fw-bold"
                                                value={formData.or_number}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        or_number:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* SUBJECTS TABLE - WITH ADD/REMOVE */}
                                    <div className="d-flex justify-content-between align-items-end mb-1">
                                        <label className="fw-bold">
                                            SUBJECTS (Editable):
                                        </label>
                                        <button
                                            className="btn btn-sm btn-dark rounded-0 py-0"
                                            onClick={addRow}
                                            style={{ fontSize: "10px" }}
                                        >
                                            <i className="bi bi-plus-lg"></i>{" "}
                                            ADD SUBJECT
                                        </button>
                                    </div>
                                    <div className="table-responsive bg-white border border-dark mb-3">
                                        <table
                                            className="table table-sm table-bordered mb-0"
                                            style={{ fontSize: "11px" }}
                                        >
                                            <thead className="table-secondary text-center">
                                                <tr>
                                                    <th width="15%">CODE</th>
                                                    <th width="35%">
                                                        DESCRIPTION
                                                    </th>
                                                    <th width="20%">
                                                        SCHEDULE
                                                    </th>
                                                    <th width="20%">TEACHER</th>
                                                    <th width="10%">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.subjects.map(
                                                    (sub, idx) => (
                                                        <tr key={idx}>
                                                            <td className="p-0">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm border-0 rounded-0 text-center fw-bold"
                                                                    value={
                                                                        sub.code
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleSubjectChange(
                                                                            idx,
                                                                            "code",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="p-0">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm border-0 rounded-0"
                                                                    value={
                                                                        sub.desc
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleSubjectChange(
                                                                            idx,
                                                                            "desc",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="p-0">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm border-0 rounded-0 text-center"
                                                                    placeholder="-- --"
                                                                    value={
                                                                        sub.sched
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleSubjectChange(
                                                                            idx,
                                                                            "sched",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="p-0">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm border-0 rounded-0 text-center"
                                                                    placeholder="-- --"
                                                                    value={
                                                                        sub.teacher
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleSubjectChange(
                                                                            idx,
                                                                            "teacher",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="text-center p-0 align-middle">
                                                                <button
                                                                    className="btn btn-sm text-danger"
                                                                    onClick={() =>
                                                                        removeRow(
                                                                            idx,
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bi bi-x-lg"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                                {formData.subjects.length ===
                                                    0 && (
                                                    <tr>
                                                        <td
                                                            colSpan="5"
                                                            className="text-center text-muted"
                                                        >
                                                            No subjects
                                                            enlisted. Click "Add
                                                            Subject".
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* BOTTOM: FEES & SIGNATORIES */}
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <div className="card rounded-0 border-dark h-100">
                                                <div className="card-header py-1 bg-warning fw-bold border-bottom border-dark small">
                                                    FEES
                                                </div>
                                                <div className="card-body p-2">
                                                    <div className="input-group input-group-sm mb-1">
                                                        <span className="input-group-text bg-white border-dark rounded-0 w-50">
                                                            Tuition:
                                                        </span>
                                                        <input
                                                            type="number"
                                                            name="tuition"
                                                            className="form-control border-dark rounded-0 text-end"
                                                            value={
                                                                formData.fees
                                                                    .tuition
                                                            }
                                                            onChange={
                                                                handleFeeChange
                                                            }
                                                        />
                                                    </div>
                                                    <div className="input-group input-group-sm mb-1">
                                                        <span className="input-group-text bg-white border-dark rounded-0 w-50">
                                                            Misc:
                                                        </span>
                                                        <input
                                                            type="number"
                                                            name="miscellaneous"
                                                            className="form-control border-dark rounded-0 text-end"
                                                            value={
                                                                formData.fees
                                                                    .miscellaneous
                                                            }
                                                            onChange={
                                                                handleFeeChange
                                                            }
                                                        />
                                                    </div>
                                                    <div className="input-group input-group-sm mb-1">
                                                        <span className="input-group-text bg-white border-dark rounded-0 w-50">
                                                            Books:
                                                        </span>
                                                        <input
                                                            type="number"
                                                            name="books"
                                                            className="form-control border-dark rounded-0 text-end"
                                                            value={
                                                                formData.fees
                                                                    .books
                                                            }
                                                            onChange={
                                                                handleFeeChange
                                                            }
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between fw-bold bg-secondary bg-opacity-25 p-1 border border-dark mt-2">
                                                        <span>TOTAL:</span>
                                                        <span>
                                                            PHP{" "}
                                                            {formData.fees.total.toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card rounded-0 border-dark h-100">
                                                <div className="card-header py-1 bg-info fw-bold border-bottom border-dark small">
                                                    SIGNATORIES
                                                </div>
                                                <div className="card-body p-2">
                                                    <label
                                                        className="fw-bold mb-0 text-muted"
                                                        style={{
                                                            fontSize: "10px",
                                                        }}
                                                    >
                                                        CLASS ADVISER:
                                                    </label>
                                                    <input
                                                        name="adviser"
                                                        className="form-control form-control-sm border-dark rounded-0 mb-1 fw-bold text-uppercase"
                                                        value={
                                                            formData.signatories
                                                                .adviser
                                                        }
                                                        onChange={
                                                            handleSigChange
                                                        }
                                                    />

                                                    <label
                                                        className="fw-bold mb-0 text-muted"
                                                        style={{
                                                            fontSize: "10px",
                                                        }}
                                                    >
                                                        REGISTRAR:
                                                    </label>
                                                    <input
                                                        name="registrar"
                                                        className="form-control form-control-sm border-dark rounded-0 mb-1 fw-bold text-uppercase"
                                                        value={
                                                            formData.signatories
                                                                .registrar
                                                        }
                                                        onChange={
                                                            handleSigChange
                                                        }
                                                    />

                                                    <label
                                                        className="fw-bold mb-0 text-muted"
                                                        style={{
                                                            fontSize: "10px",
                                                        }}
                                                    >
                                                        FINANCE:
                                                    </label>
                                                    <input
                                                        name="finance"
                                                        className="form-control form-control-sm border-dark rounded-0 fw-bold text-uppercase"
                                                        value={
                                                            formData.signatories
                                                                .finance
                                                        }
                                                        onChange={
                                                            handleSigChange
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="modal-footer bg-light border-top border-dark d-flex justify-content-between py-3">
                            <button
                                className="btn btn-success rounded-0 fw-bold px-4 btn-retro-effect"
                                onClick={handleDownloadPDF}
                                disabled={loading}
                            >
                                <i className="bi bi-file-earmark-pdf-fill me-2"></i>{" "}
                                DOWNLOAD COR
                            </button>
                            <button
                                className="btn btn-secondary rounded-0 fw-bold px-4 btn-retro-effect"
                                onClick={onClose}
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
