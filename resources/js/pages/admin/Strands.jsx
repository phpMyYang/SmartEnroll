import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast";
import StrandDrawer from "../../components/StrandDrawer";

export default function Strands() {
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Drawer States
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerType, setDrawerType] = useState("create");
    const [selectedStrand, setSelectedStrand] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. FETCH STRANDS
    const fetchStrands = async () => {
        try {
            const res = await axios.get("/api/strands");
            setStrands(res.data);
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to load strands." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStrands();
    }, []);

    // 2. HANDLERS
    const handleOpenCreate = () => {
        setDrawerType("create");
        setSelectedStrand(null);
        setShowDrawer(true);
    };

    const handleOpenEdit = (strand) => {
        setDrawerType("edit");
        setSelectedStrand(strand);
        setShowDrawer(true);
    };

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (drawerType === "create") {
                await axios.post("/api/strands", formData);
                Toast.fire({
                    icon: "success",
                    title: "Strand created successfully!",
                });
            } else {
                await axios.put(`/api/strands/${selectedStrand.id}`, formData);
                Toast.fire({
                    icon: "success",
                    title: "Strand updated successfully!",
                });
            }
            fetchStrands();
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
            title: "DELETE STRAND?",
            text: "This action cannot be undone.",
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
                    await axios.delete(`/api/strands/${id}`);
                    fetchStrands();
                    Swal.fire(
                        "Deleted!",
                        "Strand has been removed.",
                        "success"
                    );
                } catch (error) {
                    Swal.fire("Error", "Failed to delete strand.", "error");
                }
            }
        });
    };

    // Filter Logic
    const filteredStrands = strands.filter(
        (s) =>
            s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                        STRANDS MANAGEMENT
                    </h2>
                    <p className="text-muted small mb-0 font-monospace">
                        Manage Senior High School Strands
                    </p>
                </div>
                <button
                    className="btn btn-retro px-4 py-2 d-flex align-items-center gap-2"
                    onClick={handleOpenCreate}
                >
                    <i className="bi bi-plus-square-fill"></i> NEW STRAND
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
                            placeholder="Search strand code or description..."
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
                            LOADING STRANDS...
                        </p>
                    </div>
                ) : filteredStrands.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted font-monospace fw-bold">
                            NO STRANDS FOUND.
                        </p>
                    </div>
                ) : (
                    filteredStrands.map((strand) => (
                        <div
                            key={strand.id}
                            className="col-md-6 col-lg-4 col-xl-3"
                        >
                            <div className="card-retro h-100 position-relative overflow-hidden group-hover-effect">
                                {/* DECORATIVE STRIP */}
                                <div
                                    style={{
                                        height: "8px",
                                        backgroundColor: "var(--color-primary)",
                                        borderBottom: "2px solid black",
                                    }}
                                ></div>

                                <div className="card-body p-4 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h3
                                            className="fw-bold mb-0 text-uppercase font-monospace text-primary"
                                            style={{ letterSpacing: "1px" }}
                                        >
                                            {strand.code}
                                        </h3>
                                        <i className="bi bi-bookmark-fill text-muted opacity-25 fs-4"></i>
                                    </div>

                                    <p
                                        className="text-muted small flex-grow-1 border-bottom border-dark pb-3 mb-3 border-opacity-10"
                                        style={{ lineHeight: "1.6" }}
                                    >
                                        {strand.description}
                                    </p>

                                    {/* ACTION BUTTONS */}
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm w-100 rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center"
                                            style={{
                                                backgroundColor: "#F4D03F",
                                                boxShadow: "2px 2px 0 #000",
                                            }}
                                            onClick={() =>
                                                handleOpenEdit(strand)
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
                                                handleDelete(strand.id)
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
            <StrandDrawer
                show={showDrawer}
                type={drawerType}
                selectedStrand={selectedStrand}
                onClose={() => setShowDrawer(false)}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
}
