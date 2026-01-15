import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast";
import StrandDrawer from "../../components/StrandDrawer";

export default function Strands() {
    // STATES
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // DRAWER STATES
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
            confirmButtonColor: "#d33",
            confirmButtonText: "YES, DELETE IT!",
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
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-dark">
                <div>
                    <h2
                        className="fw-bold text-dark mb-0 font-monospace"
                        style={{ textShadow: "2px 2px 0 #FFFFFF" }} // White Shadow (Retro Style)
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
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-dark border-2 border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            // PINALITAN KO: ps-0 -> ps-2
                            className="form-control border-dark border-2 border-start-0 ps-2 font-monospace"
                            placeholder="Search strand code or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* GRID CARDS LAYOUT (RETRO STYLE MATCHING SECTIONS) */}
            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border"></div>
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
                            <div
                                className="card h-100 position-relative bg-white"
                                style={{
                                    border: "3px solid #000",
                                    borderRadius: "12px",
                                    boxShadow: "6px 6px 0px #000",
                                }}
                            >
                                {/* DECORATIVE STRIP (Light Blue for all Strands) */}
                                <div
                                    style={{
                                        height: "14px",
                                        backgroundColor: "#48dbfb", // Retro Cyan/Light Blue
                                        borderBottom: "3px solid #000",
                                        borderTopLeftRadius: "9px",
                                        borderTopRightRadius: "9px",
                                    }}
                                ></div>

                                <div className="card-body p-4 d-flex flex-column">
                                    {/* HEADER: Code & Icon */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h3
                                            className="fw-bold mb-1 text-uppercase font-monospace"
                                            style={{
                                                fontSize: "1.4rem",
                                                color: "#2d3436",
                                            }}
                                        >
                                            {strand.code}
                                        </h3>
                                        <i className="bi bi-bookmark-fill text-muted opacity-25 fs-4"></i>
                                    </div>

                                    {/* DESCRIPTION */}
                                    <p
                                        className="text-muted small font-monospace flex-grow-1"
                                        style={{ lineHeight: "1.5" }}
                                    >
                                        {strand.description}
                                    </p>

                                    {/* DIVIDER LINE */}
                                    <hr className="my-3 border-top border-2 border-dark opacity-100" />

                                    {/* ACTION BUTTONS */}
                                    <div className="d-flex gap-2 mt-auto">
                                        {/* Edit Button */}
                                        <button
                                            className="btn flex-grow-1 font-monospace fw-bold btn-retro-effect" // ADDED CLASS
                                            style={{
                                                backgroundColor: "#f6e58d", // Retro Yellow
                                                color: "#000",
                                                borderRadius: "6px",
                                            }}
                                            onClick={() =>
                                                handleOpenEdit(strand)
                                            }
                                        >
                                            <i className="bi bi-pencil-fill me-2"></i>{" "}
                                            EDIT
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            className="btn font-monospace fw-bold px-3 btn-retro-effect" // ADDED CLASS
                                            style={{
                                                backgroundColor: "#ff7675", // Retro Red
                                                color: "#fff",
                                                borderRadius: "6px",
                                            }}
                                            onClick={() =>
                                                handleDelete(strand.id)
                                            }
                                        >
                                            <i className="bi bi-trash-fill"></i>
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
