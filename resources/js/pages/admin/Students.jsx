import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast";

// Modals
import StudentDrawer from "../../components/StudentDrawer";
import CORModal from "../../components/CORModal";

export default function Students(props) {
    const { auth } = props;

    // --- STATES ---
    const [students, setStudents] = useState([]);
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modals
    const [drawerState, setDrawerState] = useState({
        show: false,
        type: "create",
        data: null,
    });
    const [corState, setCorState] = useState({ show: false, data: null });

    // UI States (Dropdown)
    const [openActionId, setOpenActionId] = useState(null);

    // NEW: Dinagdagan natin ng 'bottom' property para sa auto-flip
    const [dropdownPos, setDropdownPos] = useState({
        top: "auto",
        right: 0,
        bottom: "auto",
    });

    // --- EFFECTS ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".custom-dropdown-trigger")) {
                setOpenActionId(null);
            }
        };
        const handleScroll = () => {
            if (openActionId) setOpenActionId(null);
        };

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [openActionId]);

    const fetchData = async () => {
        try {
            const [std, str] = await Promise.all([
                axios.get("/api/students"),
                axios.get("/api/strands"),
            ]);
            setStudents(std.data);
            setStrands(str.data);
        } catch (e) {
            console.error(e);
            Toast.fire({ icon: "error", title: "Failed to load data." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- HANDLERS ---
    const handleOpenDrawer = (type, student = null) => {
        setDrawerState({ show: true, type: type, data: student });
        setOpenActionId(null);
    };

    // UPDATED: AUTO-FLIP LOGIC
    // Dito natin chine-check kung kakasya pa ba sa baba o dapat sa taas na bumukas
    const toggleDropdown = (id, e) => {
        e.stopPropagation();

        if (openActionId === id) {
            setOpenActionId(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Kwentahin ang space sa ilalim ng button
            const spaceBelow = viewportHeight - rect.bottom;
            const dropdownHeightEstimate = 320; // Tantya natin sa height ng dropdown menu

            let newPos = {};

            if (spaceBelow < dropdownHeightEstimate) {
                // KUNG MASIKIP SA BABA: Buksan PATAAS (Flip Up)
                newPos = {
                    bottom: viewportHeight - rect.top, // Didikit sa taas ng button
                    right: window.innerWidth - rect.right,
                    top: "auto", // I-disable ang top
                };
            } else {
                // KUNG MALUWAG SA BABA: Buksan PABABA (Default)
                newPos = {
                    top: rect.bottom, // Didikit sa ilalim ng button
                    right: window.innerWidth - rect.right,
                    bottom: "auto", // I-disable ang bottom
                };
            }

            setDropdownPos(newPos);
            setOpenActionId(id);
        }
    };

    // --- STATUS CHANGE ---
    const handleChangeStatus = async (student, newStatus) => {
        setOpenActionId(null);
        if (newStatus === "released") {
            const res = await Swal.fire({
                title: "CONFIRM RELEASE?",
                text: "This will lock the record. Proceed?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "YES, RELEASE",
                cancelButtonText: "CANCEL",
                background: "#FFE2AF",
                color: "#000",
                customClass: {
                    popup: "card-retro",
                    confirmButton: "btn-retro bg-danger border-dark",
                    cancelButton: "btn-retro bg-dark border-dark",
                },
            });
            if (!res.isConfirmed) return;
        }

        try {
            await axios.put(`/api/students/${student.id}/status`, {
                status: newStatus,
            });
            fetchData();
            Swal.fire({
                title: "UPDATED",
                text: `Status changed to: ${newStatus.toUpperCase()}`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: "#FFE2AF",
                color: "#000",
                customClass: { popup: "card-retro" },
            });
        } catch (e) {
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    // --- DELETE HANDLER ---
    const handleDelete = (id) => {
        setOpenActionId(null);
        Swal.fire({
            title: "DELETE RECORD?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "YES, DELETE IT!",
            cancelButtonText: "CANCEL",
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
                    await axios.delete(`/api/students/${id}`);
                    fetchData();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Record removed.",
                        icon: "success",
                        background: "#FFE2AF",
                        color: "#000",
                        customClass: {
                            popup: "card-retro",
                            confirmButton: "btn-retro bg-success border-dark",
                        },
                    });
                } catch (error) {
                    Swal.fire("Error", "Failed to delete.", "error");
                }
            }
        });
    };

    // --- FILTER & PAGINATION ---
    const filteredStudents = students.filter(
        (s) =>
            s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.lrn.includes(searchTerm),
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStudents.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid fade-in mb-5">
            {/* PAGE HEADER */}
            <div
                className="d-flex justify-content-between align-items-center mb-4 pb-3"
                style={{ borderBottom: "2px solid black" }}
            >
                <div>
                    <h2
                        className="fw-bold text-dark mb-0 font-monospace"
                        style={{ textShadow: "2px 2px 0 #fff" }}
                    >
                        STUDENT MANAGEMENT
                    </h2>
                    <p className="text-muted small mb-0 font-monospace">
                        Manage Enrollment Records
                    </p>
                </div>

                <button
                    className="btn btn-retro px-4 py-2 d-flex align-items-center gap-2"
                    onClick={() => handleOpenDrawer("create")}
                >
                    <i className="bi bi-plus-square-fill"></i> NEW STUDENT
                </button>
            </div>

            {/* TABLE CARD */}
            <div className="card-retro">
                <div
                    className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
                    style={{ borderBottom: "2px solid black" }}
                >
                    <div className="d-flex align-items-center gap-2">
                        <span className="small fw-bold font-monospace">
                            SHOW:
                        </span>
                        <select
                            className="form-select form-select-sm font-monospace fw-bold"
                            style={{ width: "80px", border: "2px solid black" }}
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <div className="input-group" style={{ maxWidth: "300px" }}>
                        <span className="input-group-text bg-white border-dark border-2 border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-dark border-2 border-start-0 ps-2 font-monospace"
                            placeholder="Search surname or LRN..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 text-nowrap">
                            <thead
                                style={{
                                    backgroundColor: "var(--color-secondary)",
                                    borderBottom: "2px solid black",
                                }}
                            >
                                <tr className="text-uppercase small fw-bold">
                                    <th className="ps-4 py-3 font-monospace text-dark">
                                        #
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Name / Email
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        LRN
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Strand
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Grade/Sec
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Gender
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Contact
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Status
                                    </th>
                                    <th className="text-end pe-4 py-3 font-monospace text-dark">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-5"
                                        >
                                            <div
                                                className="spinner-border"
                                                style={{
                                                    borderWidth: "3px",
                                                    color: "black",
                                                }}
                                            ></div>
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-5 fw-bold font-monospace"
                                        >
                                            NO RECORDS FOUND
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((s, index) => (
                                        <tr
                                            key={s.id}
                                            style={{
                                                borderBottom: "1px solid #000",
                                            }}
                                        >
                                            <td className="ps-4 py-3 fw-bold font-monospace">
                                                {indexOfFirstItem + index + 1}
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${s.first_name}+${s.last_name}&background=random&color=fff&size=40`}
                                                        className="rounded-circle me-3 border border-2 border-dark"
                                                        alt="Avatar"
                                                    />
                                                    <div>
                                                        <div className="fw-bold text-dark text-uppercase">
                                                            {s.last_name},{" "}
                                                            {s.first_name}
                                                        </div>
                                                        <div className="small text-muted font-monospace">
                                                            {s.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 font-monospace fw-bold">
                                                {s.lrn}
                                            </td>
                                            <td className="py-3">
                                                <span className="badge bg-white text-dark border border-dark rounded-0 px-2 py-1">
                                                    {s.strand?.code}
                                                </span>
                                            </td>
                                            <td className="py-3 font-monospace fw-bold">
                                                G{s.grade_level}{" "}
                                                <span className="fw-normal text-muted">
                                                    / {s.section?.name || "-"}
                                                </span>
                                            </td>
                                            <td className="py-3 font-monospace small">
                                                {s.gender}
                                            </td>
                                            <td className="py-3 font-monospace small">
                                                {s.contact_number}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`badge rounded-0 border border-dark px-3 py-1 text-uppercase text-dark ${
                                                        s.status === "enrolled"
                                                            ? "bg-success text-white"
                                                            : s.status ===
                                                                "pending"
                                                              ? "bg-warning"
                                                              : s.status ===
                                                                  "released"
                                                                ? "bg-secondary text-white"
                                                                : "bg-light"
                                                    }`}
                                                >
                                                    {s.status}
                                                </span>
                                            </td>

                                            <td className="text-end pe-4 py-3">
                                                <div className="d-flex justify-content-end gap-2 position-relative">
                                                    <button
                                                        className="btn btn-sm rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            backgroundColor:
                                                                "#ffffff",
                                                            boxShadow:
                                                                "2px 2px 0 #000",
                                                        }}
                                                        onClick={() =>
                                                            handleOpenDrawer(
                                                                "view",
                                                                s,
                                                            )
                                                        }
                                                        title="View"
                                                    >
                                                        <i className="bi bi-eye-fill text-dark"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            backgroundColor:
                                                                "#F4D03F",
                                                            boxShadow:
                                                                "2px 2px 0 #000",
                                                        }}
                                                        onClick={() =>
                                                            handleOpenDrawer(
                                                                "edit",
                                                                s,
                                                            )
                                                        }
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-fill text-dark"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center custom-dropdown-trigger"
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            backgroundColor:
                                                                "#34495e",
                                                            boxShadow:
                                                                "2px 2px 0 #000",
                                                        }}
                                                        onClick={(e) =>
                                                            toggleDropdown(
                                                                s.id,
                                                                e,
                                                            )
                                                        }
                                                        title="More Actions"
                                                    >
                                                        <i className="bi bi-three-dots text-white"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            backgroundColor:
                                                                "#F96E5B",
                                                            boxShadow:
                                                                "2px 2px 0 #000",
                                                        }}
                                                        onClick={() =>
                                                            handleDelete(s.id)
                                                        }
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash-fill text-white"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div
                    className="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center"
                    style={{ borderTop: "2px solid black" }}
                >
                    <small className="text-muted font-monospace">
                        Showing{" "}
                        <strong>
                            {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}
                        </strong>{" "}
                        to{" "}
                        <strong>
                            {Math.min(indexOfLastItem, filteredStudents.length)}
                        </strong>{" "}
                        of <strong>{filteredStudents.length}</strong>
                    </small>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li
                                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                            >
                                <button
                                    className="page-link border-2 border-dark text-dark fw-bold rounded-0 me-1"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &laquo; PREV
                                </button>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link border-2 border-dark text-dark fw-bold rounded-0 mx-1 bg-warning">
                                    PAGE {currentPage}
                                </span>
                            </li>
                            <li
                                className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
                            >
                                <button
                                    className="page-link border-2 border-dark text-dark fw-bold rounded-0 ms-1"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                >
                                    NEXT &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* UPDATED: FLOATING DROPDOWN MENU (Auto-Flip Supported) */}
            {openActionId && (
                <div
                    className="dropdown-menu show border-2 border-dark rounded-0 shadow p-0 fade-in"
                    style={{
                        position: "fixed",
                        // Dynamic positioning (top or bottom)
                        top: dropdownPos.top,
                        bottom: dropdownPos.bottom,
                        right: `${dropdownPos.right}px`,
                        zIndex: 9999,
                        minWidth: "200px",
                    }}
                >
                    {(() => {
                        const s = students.find((st) => st.id === openActionId);
                        if (!s) return null;

                        return (
                            <>
                                <div className="bg-light border-bottom border-dark p-2 text-center small fw-bold font-monospace">
                                    STATUS ACTIONS
                                </div>
                                <button
                                    className="dropdown-item font-monospace small fw-bold py-2 text-success"
                                    onClick={() =>
                                        handleChangeStatus(s, "passed")
                                    }
                                >
                                    <i className="bi bi-check-circle me-2"></i>{" "}
                                    Passed
                                </button>
                                <button
                                    className="dropdown-item font-monospace small fw-bold py-2 text-primary"
                                    onClick={() =>
                                        handleChangeStatus(s, "enrolled")
                                    }
                                >
                                    <i className="bi bi-person-check me-2"></i>{" "}
                                    Enrolled
                                </button>
                                <button
                                    className="dropdown-item font-monospace small fw-bold py-2 text-danger"
                                    onClick={() =>
                                        handleChangeStatus(s, "dropped")
                                    }
                                >
                                    <i className="bi bi-x-circle me-2"></i>{" "}
                                    Dropped
                                </button>
                                <button
                                    className="dropdown-item font-monospace small fw-bold py-2 text-info"
                                    onClick={() =>
                                        handleChangeStatus(s, "graduate")
                                    }
                                >
                                    <i className="bi bi-mortarboard me-2"></i>{" "}
                                    Graduate
                                </button>
                                <button
                                    className="dropdown-item font-monospace small fw-bold py-2 text-dark"
                                    onClick={() =>
                                        handleChangeStatus(s, "released")
                                    }
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>{" "}
                                    Released
                                </button>
                                <div className="dropdown-divider border-dark m-0"></div>
                                <button
                                    className="dropdown-item font-monospace small fw-bold py-2"
                                    onClick={() =>
                                        setCorState({ show: true, data: s })
                                    }
                                >
                                    <i className="bi bi-file-earmark-arrow-down me-2"></i>{" "}
                                    Download COR
                                </button>
                                <button
                                    className="dropdown-item font-monospace small fw-bold py-2 text-secondary"
                                    onClick={() =>
                                        handleChangeStatus(s, "reset")
                                    }
                                >
                                    <i className="bi bi-arrow-counterclockwise me-2"></i>{" "}
                                    Reset Status
                                </button>
                            </>
                        );
                    })()}
                </div>
            )}

            <StudentDrawer
                show={drawerState.show}
                type={drawerState.type}
                selectedStudent={drawerState.data}
                strands={strands}
                onClose={() => setDrawerState({ ...drawerState, show: false })}
                onSuccess={() => {
                    fetchData();
                    setDrawerState({ ...drawerState, show: false });
                }}
            />

            <CORModal
                show={corState.show}
                student={corState.data}
                onClose={() => setCorState({ ...corState, show: false })}
                currentUser={auth?.user}
            />
        </div>
    );
}
