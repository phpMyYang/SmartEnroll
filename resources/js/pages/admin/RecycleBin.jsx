import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast"; // ✅ Using Toast

export default function RecycleBin() {
    const [activeTab, setActiveTab] = useState("students");
    const [items, setItems] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);

    // PAGINATION & SEARCH STATES
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // TABS CONFIGURATION
    const tabs = [
        {
            id: "students",
            label: "Students",
            icon: "bi-people-fill",
            color: "#3F9AAE",
        },
        {
            id: "users",
            label: "Users/Admins",
            icon: "bi-person-badge-fill",
            color: "#F4D03F",
        },
        {
            id: "sections",
            label: "Sections",
            icon: "bi-grid-fill",
            color: "#F96E5B",
        },
        {
            id: "strands",
            label: "Strands",
            icon: "bi-diagram-3-fill",
            color: "#2D3436",
        },
        {
            id: "subjects",
            label: "Subjects",
            icon: "bi-book-fill",
            color: "#79C9C5",
        },
    ];

    // FETCH DATA
    const fetchTrash = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/recycle-bin?type=${activeTab}`);
            setItems(res.data);
            setSelectedIds([]);
            setCurrentPage(1);
            setSearchTerm("");
        } catch (error) {
            console.error(error);
            // ✅ ERROR TOAST
            Toast.fire({ icon: "error", title: "Failed to load trash." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, [activeTab]);

    // HELPER: Get Display Name (WITH SAFETY CHECK)
    const getDisplayName = (item) => {
        if (!item) return "";

        if (activeTab === "students" || activeTab === "users") {
            const last = item.last_name || "";
            const first = item.first_name || item.name || "";
            return last ? `${last}, ${first}` : first;
        }

        if (activeTab === "sections") return item.name || "Unknown Section";

        // Code only for Strands/Subjects
        if (activeTab === "strands") return item.code || "Unknown Strand";
        if (activeTab === "subjects") return item.code || "Unknown Subject";

        return item.name || item.id?.toString() || "";
    };

    // --- DATATABLE LOGIC ---

    // 1. FILTER
    const filteredItems = items.filter((item) => {
        const name = getDisplayName(item);
        const desc = item.description || "";
        const searchStr = `${name} ${desc}`.toLowerCase();

        return searchStr.includes(searchTerm.toLowerCase());
    });

    // 2. PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // --- CHECKBOX LOGIC ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const visibleIds = currentItems.map((item) => item.id);
            const newSelection = [...new Set([...selectedIds, ...visibleIds])];
            setSelectedIds(newSelection);
        } else {
            const visibleIds = currentItems.map((item) => item.id);
            setSelectedIds(
                selectedIds.filter((id) => !visibleIds.includes(id)),
            );
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // BULK RESTORE
    const handleRestore = async () => {
        if (selectedIds.length === 0) return;

        // ✅ CONFIRMATION: Swal Center
        Swal.fire({
            title: `RESTORE ${selectedIds.length} ITEMS?`,
            text: "Data will return to the active list.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#27ae60",
            cancelButtonColor: "#2d3436",
            confirmButtonText: "YES, RESTORE IT!",
            background: "#FFE2AF",
            color: "#000",
            customClass: {
                popup: "card-retro",
                confirmButton: "btn-retro bg-success border-dark",
                cancelButton: "btn-retro bg-dark border-dark",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("/api/recycle-bin/restore", {
                        type: activeTab,
                        ids: selectedIds,
                    });
                    // ✅ SUCCESS TOAST
                    Toast.fire({ icon: "success", title: "Items Restored!" });
                    fetchTrash();
                } catch (error) {
                    // ✅ ERROR TOAST
                    Toast.fire({ icon: "error", title: "Restore Failed" });
                }
            }
        });
    };

    // BULK FORCE DELETE
    const handleForceDelete = async () => {
        if (selectedIds.length === 0) return;

        // ✅ CONFIRMATION: Swal Center (Warning)
        Swal.fire({
            title: "PERMANENTLY DELETE?",
            text: "This action cannot be undone. Data will be gone forever.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F96E5B",
            cancelButtonColor: "#2d3436",
            confirmButtonText: "YES, DELETE FOREVER",
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
                    await axios.delete("/api/recycle-bin/force-delete", {
                        data: { type: activeTab, ids: selectedIds },
                    });
                    // ✅ SUCCESS TOAST
                    Toast.fire({
                        icon: "success",
                        title: "Items Permanently Deleted!",
                    });
                    fetchTrash();
                } catch (error) {
                    // ✅ ERROR TOAST
                    Toast.fire({ icon: "error", title: "Delete Failed" });
                }
            }
        });
    };

    const isAllSelected =
        currentItems.length > 0 &&
        currentItems.every((item) => selectedIds.includes(item.id));

    return (
        <div className="container-fluid fade-in mb-5">
            {/* HEADER */}
            <div
                className="d-flex justify-content-between align-items-center mb-4 pb-3"
                style={{ borderBottom: "2px solid black" }}
            >
                <div>
                    <h2
                        className="fw-bold mb-0 font-monospace text-uppercase"
                        style={{ textShadow: "2px 2px 0 #fff" }}
                    >
                        RECYCLE BIN
                    </h2>
                    <p className="text-muted small mb-0 font-monospace fw-bold">
                        Restore or Permanently Delete Data
                    </p>
                </div>

                <div className="d-flex gap-2">
                    {selectedIds.length > 0 && (
                        <>
                            <button
                                onClick={handleRestore}
                                className="btn btn-success fw-bold font-monospace border-2 border-dark rounded-0 btn-retro-effect"
                            >
                                <i className="bi bi-arrow-counterclockwise me-2"></i>{" "}
                                RESTORE ({selectedIds.length})
                            </button>
                            <button
                                onClick={handleForceDelete}
                                className="btn btn-danger fw-bold font-monospace border-2 border-dark rounded-0 btn-retro-effect"
                            >
                                <i className="bi bi-trash-fill me-2"></i>{" "}
                                PERMANENT DELETE ({selectedIds.length})
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* FOLDER TABS DESIGN */}
            <ul
                className="nav nav-tabs border-bottom-0 mb-0"
                style={{ paddingLeft: "10px" }}
            >
                {tabs.map((tab) => (
                    <li
                        className="nav-item"
                        key={tab.id}
                        style={{ marginRight: "5px" }}
                    >
                        <button
                            className={`nav-link font-monospace fw-bold border-2 border-dark rounded-top-2 px-4 py-2 d-flex align-items-center`}
                            style={{
                                backgroundColor:
                                    activeTab === tab.id ? "#fff" : "#e9ecef",
                                color:
                                    activeTab === tab.id ? "#000" : "#6c757d",
                                borderBottom:
                                    activeTab === tab.id
                                        ? "2px solid #fff"
                                        : "2px solid black",
                                marginBottom: "-2px",
                                zIndex: activeTab === tab.id ? 10 : 1,
                                position: "relative",
                                opacity: activeTab === tab.id ? 1 : 0.8,
                                transition: "0.2s",
                            }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i
                                className={`bi ${tab.icon} me-2`}
                                style={{
                                    color:
                                        activeTab === tab.id
                                            ? tab.color
                                            : "inherit",
                                }}
                            ></i>
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* MAIN CARD (DATATABLE) */}
            <div
                className="card-retro"
                style={{ borderTopLeftRadius: "0", marginTop: "0" }}
            >
                {/* TOOLBAR */}
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
                            <option value="100">100</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ maxWidth: "300px" }}>
                        <span className="input-group-text bg-white border-dark border-2 border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-dark border-2 border-start-0 ps-2 font-monospace"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 font-monospace">
                            <thead
                                style={{
                                    backgroundColor: "var(--color-secondary)",
                                    borderBottom: "2px solid black",
                                }}
                            >
                                <tr className="text-uppercase small fw-bold">
                                    <th
                                        className="ps-4 py-3 text-dark text-center"
                                        width="50px"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-check-input border-dark rounded-0"
                                            onChange={handleSelectAll}
                                            checked={isAllSelected}
                                            disabled={currentItems.length === 0}
                                        />
                                    </th>
                                    <th className="py-3 text-dark">
                                        Deleted Item Name
                                    </th>
                                    <th className="py-3 text-dark">Details</th>
                                    <th className="py-3 text-dark">
                                        Date Deleted
                                    </th>
                                    <th className="text-end pe-4 py-3 text-dark">
                                        ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-5"
                                        >
                                            <div className="spinner-border border-dark"></div>
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-5 text-muted fw-bold"
                                        >
                                            <i className="bi bi-recycle fs-1 d-block mb-2 opacity-50"></i>
                                            NO DELETED ITEMS FOUND
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom: "1px solid #000",
                                            }}
                                        >
                                            <td className="ps-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input border-dark rounded-0"
                                                    checked={selectedIds.includes(
                                                        item.id,
                                                    )}
                                                    onChange={() =>
                                                        handleSelectOne(item.id)
                                                    }
                                                />
                                            </td>
                                            <td className="py-3 fw-bold text-danger">
                                                {getDisplayName(item)}
                                            </td>
                                            <td className="py-3 small">
                                                {/* SECTION DETAILS */}
                                                {activeTab === "sections" &&
                                                    item.strand && (
                                                        <span className="badge bg-light text-dark border border-dark rounded-0">
                                                            {item.strand.code}
                                                        </span>
                                                    )}

                                                {/* USER DETAILS */}
                                                {activeTab === "users" && (
                                                    <span className="badge bg-light text-dark border border-dark rounded-0">
                                                        {item.role || "User"}
                                                    </span>
                                                )}

                                                {/* STUDENT DETAILS */}
                                                {activeTab === "students" && (
                                                    <span className="text-muted">
                                                        LRN: {item.lrn || "N/A"}
                                                    </span>
                                                )}

                                                {/* STRAND & SUBJECT DETAILS */}
                                                {(activeTab === "strands" ||
                                                    activeTab ===
                                                        "subjects") && (
                                                    <span className="text-muted fst-italic text-uppercase">
                                                        {item.description ||
                                                            "No description provided"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 small text-muted">
                                                <i className="bi bi-clock me-1"></i>
                                                {new Date(
                                                    item.deleted_at,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="text-end pe-4 py-3 text-muted small">
                                                #{item.id}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION FOOTER */}
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
                            {Math.min(indexOfLastItem, filteredItems.length)}
                        </strong>{" "}
                        of <strong>{filteredItems.length}</strong>
                    </small>

                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li
                                className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                }`}
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
                                className={`page-item ${
                                    currentPage === totalPages ||
                                    totalPages === 0
                                        ? "disabled"
                                        : ""
                                }`}
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
        </div>
    );
}
