import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast";
import SectionDrawer from "../../components/SectionDrawer";

export default function Sections() {
    const [sections, setSections] = useState([]);
    const [strands, setStrands] = useState([]); // Need natin to para sa dropdown
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Drawer States
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerType, setDrawerType] = useState("create");
    const [selectedSection, setSelectedSection] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. FETCH DATA (Sections + Strands)
    const fetchData = async () => {
        try {
            const [secRes, strandRes] = await Promise.all([
                axios.get("/api/sections"),
                axios.get("/api/strands"),
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

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (drawerType === "create") {
                await axios.post("/api/sections", formData);
                Toast.fire({ icon: "success", title: "Section created!" });
            } else {
                await axios.put(
                    `/api/sections/${selectedSection.id}`,
                    formData
                );
                Toast.fire({ icon: "success", title: "Section updated!" });
            }
            fetchData(); // Refresh Data
            setShowDrawer(false);
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error.response?.data?.message || "Error occurred.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "DELETE SECTION?",
            text: "This will remove the section permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F96E5B",
            cancelButtonColor: "#2d3436",
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
                    await axios.delete(`/api/sections/${id}`);
                    fetchData();
                    Swal.fire(
                        "Deleted!",
                        "Section has been removed.",
                        "success"
                    );
                } catch (error) {
                    Swal.fire("Error", "Failed to delete section.", "error");
                }
            }
        });
    };

    // Filter Logic
    const filteredSections = sections.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.strand.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid fade-in mb-5">
            {/* HEADER */}
            <div
                className="d-flex justify-content-between align-items-center mb-4 pb-3"
                style={{ borderBottom: "2px solid black" }}
            >
                <div>
                    <h2
                        className="fw-bold text-dark mb-0 font-monospace"
                        style={{ textShadow: "2px 2px 0 #fff" }}
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

            {/* SEARCH BAR */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-dark border-2 border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-dark border-2 border-start-0 ps-0 font-monospace"
                            placeholder="Search section or strand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 🔥 GRID CARDS LAYOUT */}
            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div
                            className="spinner-border"
                            style={{ borderWidth: "4px", color: "black" }}
                        ></div>
                        <p className="mt-2 font-monospace fw-bold">
                            LOADING SECTIONS...
                        </p>
                    </div>
                ) : filteredSections.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted font-monospace fw-bold">
                            NO SECTIONS FOUND.
                        </p>
                    </div>
                ) : (
                    filteredSections.map((section) => (
                        <div
                            key={section.id}
                            className="col-md-6 col-lg-4 col-xl-3"
                        >
                            <div className="card-retro h-100 position-relative overflow-hidden group-hover-effect">
                                {/* DECORATIVE STRIP (Color coded by Grade) */}
                                <div
                                    style={{
                                        height: "8px",
                                        backgroundColor:
                                            section.grade_level === "11"
                                                ? "var(--color-primary)"
                                                : "var(--color-danger)",
                                        borderBottom: "2px solid black",
                                    }}
                                ></div>

                                <div className="card-body p-4 d-flex flex-column">
                                    {/* HEADER INFO */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <span
                                                className="badge border border-dark text-dark rounded-0 mb-2"
                                                style={{
                                                    backgroundColor: "#FFE2AF",
                                                }}
                                            >
                                                GRADE {section.grade_level}
                                            </span>
                                            <h3 className="fw-bold mb-0 text-uppercase font-monospace">
                                                {section.name}
                                            </h3>
                                            <small className="fw-bold text-primary">
                                                {section.strand
                                                    ? section.strand.code
                                                    : "NO STRAND"}
                                            </small>
                                        </div>
                                        <div className="text-center border border-dark p-2 rounded-0 bg-light">
                                            <small
                                                className="d-block fw-bold"
                                                style={{ fontSize: "0.6rem" }}
                                            >
                                                CAPACITY
                                            </small>
                                            <span className="fw-bold fs-5">
                                                {section.capacity}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-grow-1"></div>

                                    {/* ACTION BUTTONS */}
                                    <div className="d-flex gap-2 mt-3">
                                        <button
                                            className="btn btn-sm w-100 rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center"
                                            style={{
                                                backgroundColor: "#F4D03F",
                                                boxShadow: "2px 2px 0 #000",
                                            }}
                                            onClick={() =>
                                                handleOpenEdit(section)
                                            }
                                        >
                                            <i className="bi bi-pencil-fill me-2"></i>{" "}
                                            EDIT
                                        </button>
                                        <button
                                            className="btn btn-sm rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center px-3"
                                            style={{
                                                backgroundColor: "#F96E5B",
                                                boxShadow: "2px 2px 0 #000",
                                            }}
                                            onClick={() =>
                                                handleDelete(section.id)
                                            }
                                        >
                                            <i className="bi bi-trash-fill text-white"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* DRAWER */}
            <SectionDrawer
                show={showDrawer}
                type={drawerType}
                selectedSection={selectedSection}
                strands={strands} // Pass strands to drawer
                onClose={() => setShowDrawer(false)}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
}
