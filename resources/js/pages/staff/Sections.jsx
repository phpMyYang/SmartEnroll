import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast"; // Using Toast
import SectionDrawer from "../../components/SectionDrawer";

export default function StaffSections() {
    // STATES
    const [sections, setSections] = useState([]);
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // DRAWER STATES
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerType, setDrawerType] = useState("create");
    const [selectedSection, setSelectedSection] = useState(null);

    // MASTER LIST MODAL STATES
    const [showMasterList, setShowMasterList] = useState(false);
    const [masterData, setMasterData] = useState(null);
    const [loadingMaster, setLoadingMaster] = useState(false);

    // 1. FETCH DATA (Using Staff API)
    const fetchData = async () => {
        try {
            const [secRes, strandRes] = await Promise.all([
                axios.get("/api/staff/sections"), // Staff Endpoint
                axios.get("/api/staff/strands"), // Staff Endpoint
            ]);
            setSections(secRes.data);
            setStrands(strandRes.data);
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to load data." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. HANDLERS
    const handleOpenCreate = () => {
        setDrawerType("create");
        setSelectedSection(null);
        setShowDrawer(true);
    };

    const handleOpenEdit = (section) => {
        setDrawerType("edit");
        setSelectedSection(section);
        setShowDrawer(true);
    };

    // DELETE HANDLER (Swal Confirm + Toast Result)
    const handleDelete = (id) => {
        // CONFIRMATION: Center Modal (Swal)
        Swal.fire({
            title: "DELETE SECTION?",
            text: "This cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "YES, DELETE IT!",
            background: "#FFE2AF",
            color: "#000",
            customClass: {
                popup: "card-retro",
                confirmButton: "btn-retro bg-danger border-dark",
                cancelButton: "btn-retro bg-dark border-dark",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // UPDATED: Staff Endpoint
                    await axios.delete(`/api/staff/sections/${id}`);
                    fetchData();
                    // SUCCESS TOAST
                    Toast.fire({ icon: "success", title: "Section removed." });
                } catch (error) {
                    // ERROR TOAST
                    Toast.fire({
                        icon: "error",
                        title: "Failed to delete section.",
                    });
                }
            }
        });
    };

    // 3. MASTER LIST FUNCTIONS (Staff)
    const handleViewMasterList = async (sectionId) => {
        setShowMasterList(true);
        setLoadingMaster(true);
        setMasterData(null);
        try {
            // UPDATED: Staff Endpoint
            const res = await axios.get(
                `/api/staff/sections/${sectionId}/masterlist`,
            );
            setMasterData(res.data);
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to load list." });
            setShowMasterList(false);
        } finally {
            setLoadingMaster(false);
        }
    };

    const handleDownloadPDF = async (sectionId, sectionName) => {
        Toast.fire({ icon: "info", title: "Generating PDF..." });

        try {
            // UPDATED: Staff Endpoint
            const response = await axios.get(
                `/api/staff/sections/${sectionId}/masterlist/generate-url`,
            );
            const secureUrl = response.data.url;
            window.open(secureUrl, "_blank");
            Toast.fire({ icon: "success", title: "Download Started!" });
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to generate link." });
        }
    };

    const filteredSections = sections.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.strand.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="container-fluid fade-in mb-5">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-dark">
                <div>
                    <h2
                        className="fw-bold text-dark mb-0 font-monospace"
                        style={{ textShadow: "2px 2px 0px #FFFFFF" }}
                    >
                        SECTION MANAGEMENT
                    </h2>
                    <p className="text-muted small mb-0 font-monospace">
                        Organize Classes & Capacity
                    </p>
                </div>
                <button
                    className="btn btn-retro px-4 py-2 d-flex align-items-center gap-2"
                    onClick={handleOpenCreate}
                >
                    <i className="bi bi-plus-square-fill"></i> NEW SECTION
                </button>
            </div>

            {/* SEARCH */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-dark border-2 border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-dark border-2 border-start-0 ps-2 font-monospace"
                            placeholder="Search section..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* CARDS GRID */}
            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border"></div>
                    </div>
                ) : filteredSections.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted fw-bold">NO SECTIONS FOUND.</p>
                    </div>
                ) : (
                    filteredSections.map((section) => {
                        const enrolled = section.enrolled_count || 0;
                        const capacity = section.capacity || 40;
                        const isFull = enrolled >= capacity;

                        return (
                            <div
                                key={section.id}
                                className="col-md-6 col-lg-4 col-xl-3"
                            >
                                <div
                                    className="card h-100 position-relative bg-white"
                                    style={{
                                        border: "3px solid #000",
                                        borderRadius: "12px",
                                        boxShadow: "6px 6px 0px #000",
                                    }}
                                >
                                    {/* COLOR STRIP */}
                                    <div
                                        style={{
                                            height: "14px",
                                            backgroundColor:
                                                section.grade_level === "11"
                                                    ? "#F96E5B"
                                                    : "#F4D03F",
                                            borderBottom: "3px solid #000",
                                            borderTopLeftRadius: "9px",
                                            borderTopRightRadius: "9px",
                                        }}
                                    ></div>

                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h3
                                                    className="fw-bold mb-1 font-monospace text-uppercase"
                                                    style={{
                                                        fontSize: "1.4rem",
                                                        color: "#2d3436",
                                                    }}
                                                >
                                                    {section.name}
                                                </h3>
                                                <div className="small text-muted font-monospace fw-bold">
                                                    {section.strand?.code}{" "}
                                                    &bull; Grade{" "}
                                                    {section.grade_level}
                                                </div>
                                            </div>
                                            <i className="bi bi-bookmark-fill fs-4 text-muted opacity-25"></i>
                                        </div>

                                        <div className="my-3">
                                            <div className="d-flex justify-content-between small fw-bold font-monospace mb-1">
                                                <span>STUDENTS:</span>
                                                <span
                                                    className={
                                                        isFull
                                                            ? "text-danger"
                                                            : "text-success"
                                                    }
                                                >
                                                    {enrolled} / {capacity}
                                                </span>
                                            </div>
                                            <div
                                                className="progress border border-2 border-dark rounded-pill"
                                                style={{
                                                    height: "10px",
                                                    backgroundColor: "#f1f2f6",
                                                }}
                                            >
                                                <div
                                                    className={`progress-bar rounded-pill ${isFull ? "bg-danger" : "bg-success"}`}
                                                    style={{
                                                        width: `${(enrolled / capacity) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <hr className="my-3 border-top border-2 border-dark opacity-100" />

                                        <div className="mt-auto">
                                            <button
                                                className="btn w-100 mb-2 font-monospace fw-bold btn-retro-effect"
                                                style={{
                                                    backgroundColor: "#dff9fb",
                                                    color: "#000",
                                                    borderRadius: "6px",
                                                }}
                                                onClick={() =>
                                                    handleViewMasterList(
                                                        section.id,
                                                    )
                                                }
                                            >
                                                <i className="bi bi-list-task me-2"></i>{" "}
                                                MASTER LIST
                                            </button>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn flex-grow-1 font-monospace fw-bold btn-retro-effect"
                                                    style={{
                                                        backgroundColor:
                                                            "#f6e58d",
                                                        color: "#000",
                                                        borderRadius: "6px",
                                                    }}
                                                    onClick={() =>
                                                        handleOpenEdit(section)
                                                    }
                                                >
                                                    <i className="bi bi-pencil-fill me-2"></i>{" "}
                                                    EDIT
                                                </button>
                                                <button
                                                    className="btn font-monospace fw-bold px-3 btn-retro-effect"
                                                    style={{
                                                        backgroundColor:
                                                            "#ff7675",
                                                        color: "#fff",
                                                        borderRadius: "6px",
                                                    }}
                                                    onClick={() =>
                                                        handleDelete(section.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* MASTER LIST MODAL */}
            {showMasterList && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                    ></div>
                    <div className="modal fade show d-block">
                        <div className="modal-dialog modal-lg modal-dialog-scrollable">
                            <div className="modal-content border-2 border-dark rounded-0 shadow-lg">
                                <div className="modal-header bg-dark text-white border-bottom border-dark rounded-0 py-3">
                                    <h5 className="modal-title fw-bold font-monospace mx-auto">
                                        <i className="bi bi-file-earmark-person-fill me-2 text-warning"></i>{" "}
                                        CLASS MASTER LIST
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white position-absolute end-0 me-3"
                                        onClick={() => setShowMasterList(false)}
                                    ></button>
                                </div>
                                <div className="modal-body bg-secondary p-4 bg-opacity-10">
                                    {loadingMaster || !masterData ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border"></div>
                                        </div>
                                    ) : (
                                        <div
                                            className="bg-white border border-dark shadow p-4 mx-auto"
                                            style={{
                                                maxWidth: "95%",
                                                minHeight: "500px",
                                            }}
                                        >
                                            <div className="text-center border-bottom border-dark border-2 pb-3 mb-4">
                                                <h1 className="fw-bold text-uppercase display-6 font-monospace mb-0">
                                                    {masterData.section.name}
                                                </h1>
                                                <p className="text-muted font-monospace fw-bold mb-2">
                                                    {
                                                        masterData.section
                                                            .strand.description
                                                    }
                                                </p>
                                                <div className="d-flex justify-content-center gap-2 mt-3">
                                                    <span className="badge bg-white text-dark border border-dark rounded-0 px-3">
                                                        GRADE{" "}
                                                        {
                                                            masterData.section
                                                                .grade_level
                                                        }
                                                    </span>
                                                    <span className="badge bg-white text-dark border border-dark rounded-0 px-3">
                                                        {masterData.semester}
                                                    </span>
                                                    <span className="badge bg-white text-dark border border-dark rounded-0 px-3">
                                                        SY{" "}
                                                        {masterData.school_year}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-bordered border-dark mb-0 font-monospace small align-middle">
                                                    <thead className="bg-light text-center">
                                                        <tr>
                                                            <th
                                                                style={{
                                                                    width: "5%",
                                                                }}
                                                            >
                                                                #
                                                            </th>
                                                            <th
                                                                style={{
                                                                    width: "40%",
                                                                }}
                                                            >
                                                                STUDENT NAME
                                                            </th>
                                                            <th
                                                                style={{
                                                                    width: "5%",
                                                                }}
                                                            >
                                                                SEX
                                                            </th>
                                                            {/* ADDED: MODALITY HEADER */}
                                                            <th
                                                                style={{
                                                                    width: "20%",
                                                                }}
                                                            >
                                                                MODALITY
                                                            </th>
                                                            <th
                                                                style={{
                                                                    width: "30%",
                                                                }}
                                                            >
                                                                LRN
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="table-secondary fw-bold border-top border-dark">
                                                            <td
                                                                colSpan="5"
                                                                className="ps-3"
                                                            >
                                                                <i className="bi bi-gender-male me-2"></i>{" "}
                                                                MALE
                                                            </td>
                                                        </tr>
                                                        {masterData.males.map(
                                                            (s, i) => (
                                                                <tr key={s.id}>
                                                                    <td className="text-center fw-bold">
                                                                        {i + 1}
                                                                    </td>
                                                                    <td className="text-uppercase fw-bold text-primary">
                                                                        {
                                                                            s.last_name
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            s.first_name
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        M
                                                                    </td>
                                                                    {/* ADDED: MODALITY DATA */}
                                                                    <td className="text-center text-uppercase small fw-bold">
                                                                        {s.learning_modality ||
                                                                            "N/A"}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {s.lrn}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                        {masterData.males
                                                            .length === 0 && (
                                                            <tr>
                                                                <td
                                                                    colSpan="5"
                                                                    className="text-center text-muted fst-italic py-2"
                                                                >
                                                                    No Male
                                                                    Students
                                                                </td>
                                                            </tr>
                                                        )}

                                                        <tr className="table-secondary fw-bold border-top border-dark">
                                                            <td
                                                                colSpan="5"
                                                                className="ps-3"
                                                            >
                                                                <i className="bi bi-gender-female me-2"></i>{" "}
                                                                FEMALE
                                                            </td>
                                                        </tr>
                                                        {masterData.females.map(
                                                            (s, i) => (
                                                                <tr key={s.id}>
                                                                    <td className="text-center fw-bold">
                                                                        {i + 1}
                                                                    </td>
                                                                    <td className="text-uppercase fw-bold text-danger">
                                                                        {
                                                                            s.last_name
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            s.first_name
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        F
                                                                    </td>
                                                                    {/* ADDED: MODALITY DATA */}
                                                                    <td className="text-center text-uppercase small fw-bold">
                                                                        {s.learning_modality ||
                                                                            "N/A"}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {s.lrn}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                        {masterData.females
                                                            .length === 0 && (
                                                            <tr>
                                                                <td
                                                                    colSpan="5"
                                                                    className="text-center text-muted fst-italic py-2"
                                                                >
                                                                    No Female
                                                                    Students
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer bg-light border-top border-dark d-flex justify-content-between py-3">
                                    {masterData && (
                                        <button
                                            className="btn btn-success rounded-0 fw-bold px-4 btn-retro-effect"
                                            onClick={() =>
                                                handleDownloadPDF(
                                                    masterData.section.id,
                                                    masterData.section.name,
                                                )
                                            }
                                        >
                                            <i className="bi bi-file-earmark-pdf-fill me-2"></i>{" "}
                                            DOWNLOAD PDF
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-secondary rounded-0 fw-bold px-4 btn-retro-effect"
                                        onClick={() => setShowMasterList(false)}
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* SMART DRAWER with apiPrefix */}
            <SectionDrawer
                show={showDrawer}
                type={drawerType}
                selectedSection={selectedSection}
                strands={strands}
                onClose={() => setShowDrawer(false)}
                onSuccess={fetchData} // Auto-refresh
                apiPrefix="/api/staff" // PASSING STAFF PREFIX
            />
        </div>
    );
}
