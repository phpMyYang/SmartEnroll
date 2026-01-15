import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function ActivityLogsModal({ show, onClose }) {
    if (!show) return null;

    // DATA STATES
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // DATATABLE STATES
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items

    // INITIAL FETCH
    useEffect(() => {
        setLoading(true);
        axios
            .get("/api/activity-logs")
            .then((res) => {
                setLogs(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // 1. FILTER LOGIC (Search)
    const filteredLogs = logs.filter((log) => {
        const user = log.user ? log.user.name.toLowerCase() : "system";
        const action = log.action.toLowerCase();
        const desc = log.description.toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
            user.includes(search) ||
            action.includes(search) ||
            desc.includes(search)
        );
    });

    // 2. PAGINATION LOGIC
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // HANDLERS
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 pag nag-search
    };

    const handleItemsPerPage = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 pag nagbago ng view limit
    };

    return (
        <>
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1050, backgroundColor: "rgba(0,0,0,0.5)" }}
            ></div>
            <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content border-2 border-dark rounded-0 shadow-lg">
                        {/* HEADER */}
                        <div className="modal-header bg-dark text-white rounded-0 py-3">
                            <h5 className="modal-title fw-bold font-monospace mx-auto">
                                <i className="bi bi-clock-history me-2 text-warning"></i>{" "}
                                SYSTEM ACTIVITY LOGS
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white position-absolute end-0 me-3"
                                onClick={onClose}
                            ></button>
                        </div>

                        {/* CONTROLS (Search & Show Entries) - MATCHING USERS STYLE */}
                        <div
                            className="bg-white p-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
                            style={{ borderBottom: "2px solid black" }}
                        >
                            {/* Show Entries */}
                            <div className="d-flex align-items-center gap-2">
                                <span className="small fw-bold font-monospace">
                                    SHOW:
                                </span>
                                <select
                                    className="form-select form-select-sm font-monospace fw-bold border-2 border-dark rounded-0"
                                    style={{ width: "80px" }}
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPage}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>

                            {/* Search Bar */}
                            <div
                                className="input-group"
                                style={{ maxWidth: "300px" }}
                            >
                                <span className="input-group-text bg-white border-dark border-2 border-end-0 rounded-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark border-2 border-start-0 ps-2 font-monospace rounded-0"
                                    placeholder="Search logs..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        {/* TABLE BODY */}
                        <div className="modal-body bg-white p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border border-dark"></div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped mb-0 font-monospace small align-middle">
                                        <thead
                                            style={{
                                                backgroundColor:
                                                    "var(--color-secondary)", // Matches Users
                                                borderBottom: "2px solid black",
                                            }}
                                        >
                                            <tr className="text-white bg-secondary">
                                                <th className="py-3 ps-4">
                                                    USER
                                                </th>
                                                <th className="py-3 text-center">
                                                    ACTION
                                                </th>
                                                <th className="py-3">
                                                    DESCRIPTION
                                                </th>
                                                <th className="py-3 text-end pe-4">
                                                    DATE / TIME
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((log) => (
                                                <tr
                                                    key={log.id}
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #000",
                                                    }}
                                                >
                                                    <td className="ps-4 fw-bold text-primary">
                                                        {log.user
                                                            ? log.user.name
                                                            : "SYSTEM"}
                                                    </td>
                                                    <td className="text-center">
                                                        <span
                                                            className={`badge rounded-0 border border-dark text-dark px-2 py-1 ${
                                                                log.action ===
                                                                    "login" ||
                                                                log.action ===
                                                                    "logout"
                                                                    ? "bg-info bg-opacity-25"
                                                                    : log.action ===
                                                                      "delete"
                                                                    ? "bg-danger text-white"
                                                                    : log.action ===
                                                                      "create"
                                                                    ? "bg-success text-white"
                                                                    : "bg-warning"
                                                            }`}
                                                        >
                                                            {log.action.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="text-muted text-break"
                                                        style={{
                                                            maxWidth: "300px",
                                                        }}
                                                    >
                                                        {log.description}
                                                    </td>
                                                    <td className="text-end pe-4 fw-bold">
                                                        {moment(
                                                            log.created_at
                                                        ).format(
                                                            "MMM D, YYYY h:mm A"
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {currentItems.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center py-5 text-muted fw-bold"
                                                    >
                                                        NO LOGS FOUND.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* PAGINATION FOOTER - MATCHING USERS.JSX STYLE */}
                        <div
                            className="modal-footer bg-light py-3 px-4 d-flex justify-content-between align-items-center"
                            style={{ borderTop: "2px solid black" }}
                        >
                            <small className="text-muted font-monospace">
                                Showing{" "}
                                <strong>
                                    {currentItems.length > 0
                                        ? indexOfFirstItem + 1
                                        : 0}
                                </strong>{" "}
                                to{" "}
                                <strong>
                                    {Math.min(
                                        indexOfLastItem,
                                        filteredLogs.length
                                    )}
                                </strong>{" "}
                                of <strong>{filteredLogs.length}</strong>
                            </small>

                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    {/* PREV BUTTON */}
                                    <li
                                        className={`page-item ${
                                            currentPage === 1 ? "disabled" : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link border-2 border-dark text-dark fw-bold rounded-0 me-1"
                                            onClick={() =>
                                                paginate(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            &laquo; PREV
                                        </button>
                                    </li>

                                    {/* CURRENT PAGE INDICATOR */}
                                    <li className="page-item disabled">
                                        <span className="page-link border-2 border-dark text-dark fw-bold rounded-0 mx-1 bg-warning">
                                            PAGE {currentPage}
                                        </span>
                                    </li>

                                    {/* NEXT BUTTON */}
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
                                            onClick={() =>
                                                paginate(currentPage + 1)
                                            }
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
            </div>
        </>
    );
}
