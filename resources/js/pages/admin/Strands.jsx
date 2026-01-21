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

    // DELETE HANDLER (Swal Confirm + Toast Result)
    const handleDelete = (id) => {
        // CONFIRMATION: Center Modal (Swal)
        Swal.fire({
            title: "DELETE STRAND?",
            text: "This action cannot be undone.",
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
                    await axios.delete(`/api/strands/${id}`);
                    fetchStrands();
                    // RESULT: TOAST
                    Toast.fire({
                        icon: "success",
                        title: "Strand has been removed.",
                    });
                } catch (error) {
                    // ERROR: TOAST
                    Toast.fire({
                        icon: "error",
                        title: "Failed to delete strand.",
                    });
                }
            }
        });
    };

    // Filter Logic
    const filteredStrands = strands.filter(
        (s) =>
            s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="container-fluid fade-in mb-5">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-dark">
                <div>
                    <h2
                        className="fw-bold text-dark mb-0 font-monospace"
                        style={{ textShadow: "2px 2px 0 #FFFFFF" }}
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
                            className="form-control border-dark border-2 border-start-0 ps-2 font-monospace"
                            placeholder="Search strand code or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* GRID CARDS LAYOUT */}
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
                                {/* DECORATIVE STRIP */}
                                <div
                                    style={{
                                        height: "14px",
                                        backgroundColor: "#48dbfb",
                                        borderBottom: "3px solid #000",
                                        borderTopLeftRadius: "9px",
                                        borderTopRightRadius: "9px",
                                    }}
                                ></div>

                                <div className="card-body p-4 d-flex flex-column">
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
                                    <p
                                        className="text-muted small font-monospace flex-grow-1"
                                        style={{ lineHeight: "1.5" }}
                                    >
                                        {strand.description}
                                    </p>
                                    <hr className="my-3 border-top border-2 border-dark opacity-100" />

                                    {/* ACTION BUTTONS */}
                                    <div className="d-flex gap-2 mt-auto">
                                        <button
                                            className="btn flex-grow-1 font-monospace fw-bold btn-retro-effect"
                                            style={{
                                                backgroundColor: "#f6e58d",
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
                                        <button
                                            className="btn font-monospace fw-bold px-3 btn-retro-effect"
                                            style={{
                                                backgroundColor: "#ff7675",
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

            {/* SMART DRAWER */}
            <StrandDrawer
                show={showDrawer}
                type={drawerType}
                selectedStrand={selectedStrand}
                onClose={() => setShowDrawer(false)}
                onSuccess={fetchStrands} // Auto refresh
                apiPrefix="/api"
            />
        </div>
    );
}
