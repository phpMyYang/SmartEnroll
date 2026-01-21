import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast";
import UserDrawer from "../../components/UserDrawer";

export default function Users() {
    // DATA STATES
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // PAGINATION STATES
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // DRAWER STATES
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerType, setDrawerType] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);

    // INITIAL LOAD
    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/users");
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            Toast.fire({ icon: "error", title: "Failed to load users." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // HANDLERS
    const handleOpenCreate = () => {
        setDrawerType("create");
        setSelectedUser(null);
        setShowDrawer(true);
    };

    const handleOpenEdit = (user) => {
        setDrawerType("edit");
        setSelectedUser(user);
        setShowDrawer(true);
    };

    const handleOpenView = (user) => {
        setDrawerType("view");
        setSelectedUser(user);
        setShowDrawer(true);
    };

    // DELETE LOGIC (Swal Confirm + Toast Result)
    const handleDelete = (id) => {
        Swal.fire({
            title: "DELETE USER?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F96E5B",
            cancelButtonColor: "#2d3436",
            confirmButtonText: "YES, DELETE IT!",
            background: "#FFE2AF", // Retro BG
            color: "#000",
            customClass: {
                popup: "card-retro",
                confirmButton: "btn-retro bg-danger border-dark",
                cancelButton: "btn-retro bg-dark border-dark",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/users/${id}`);
                    fetchUsers();
                    // Success is Toast
                    Toast.fire({
                        icon: "success",
                        title: "User removed successfully.",
                    });
                } catch (error) {
                    const msg =
                        error.response?.data?.message ||
                        "Failed to delete user.";
                    // Error is Toast
                    Toast.fire({ icon: "error", title: msg });
                }
            }
        });
    };

    // FILTERING & PAGINATION
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
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
                        USERS MANAGEMENT
                    </h2>
                    <p className="text-muted small mb-0 font-monospace">
                        Manage Administrators & Staff
                    </p>
                </div>
                <button
                    className="btn btn-retro px-4 py-2 d-flex align-items-center gap-2"
                    onClick={handleOpenCreate}
                >
                    <i className="bi bi-plus-square-fill"></i> NEW USER
                </button>
            </div>

            {/* MAIN CARD */}
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
                            placeholder="Search user..."
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
                                        User Details
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Role
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Gender
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Birthday
                                    </th>
                                    <th className="py-3 font-monospace text-dark">
                                        Status
                                    </th>
                                    <th className="text-end pe-4 py-3 font-monospace text-dark">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
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
                                            colSpan="7"
                                            className="text-center py-5 fw-bold font-monospace"
                                        >
                                            NO USERS FOUND
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((user, index) => {
                                        const isSelf =
                                            currentUser &&
                                            user.id === currentUser.id;
                                        return (
                                            <tr
                                                key={user.id}
                                                className={
                                                    isSelf
                                                        ? "bg-info bg-opacity-10"
                                                        : ""
                                                }
                                                style={{
                                                    borderBottom:
                                                        "1px solid #000",
                                                }}
                                            >
                                                <td className="ps-4 py-3 fw-bold font-monospace">
                                                    {indexOfFirstItem +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`}
                                                            className="rounded-circle me-3 border border-2 border-dark"
                                                            width="45"
                                                            height="45"
                                                            alt="Avatar"
                                                        />
                                                        <div>
                                                            <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                                                {user.name}
                                                                {isSelf && (
                                                                    <span
                                                                        className="badge bg-dark text-white border border-dark rounded-0"
                                                                        style={{
                                                                            fontSize:
                                                                                "0.6rem",
                                                                        }}
                                                                    >
                                                                        YOU
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="small text-muted font-monospace">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span
                                                        className={`badge rounded-0 border border-dark text-dark px-3 py-2 ${user.role === "admin" ? "bg-warning" : "bg-white"}`}
                                                    >
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="py-3 font-monospace">
                                                    {user.gender || "-"}
                                                </td>
                                                <td className="py-3 font-monospace small">
                                                    {user.birthday || "-"}
                                                </td>
                                                <td className="py-3">
                                                    <span
                                                        className={`badge rounded-0 border border-dark px-3 py-1 ${user.status === "active" ? "bg-success text-white" : "bg-danger text-white"}`}
                                                    >
                                                        {user.status
                                                            ? user.status.toUpperCase()
                                                            : "ACTIVE"}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4 py-3">
                                                    <div className="d-flex justify-content-end gap-2">
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
                                                                handleOpenView(
                                                                    user,
                                                                )
                                                            }
                                                            title="View Details"
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
                                                                handleOpenEdit(
                                                                    user,
                                                                )
                                                            }
                                                            title="Edit User"
                                                        >
                                                            <i className="bi bi-pencil-fill text-dark"></i>
                                                        </button>
                                                        {isSelf ? (
                                                            <button
                                                                className="btn btn-sm rounded-0 border-2 border-dark d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: "32px",
                                                                    height: "32px",
                                                                    backgroundColor:
                                                                        "#e0e0e0",
                                                                    cursor: "not-allowed",
                                                                    opacity: 0.6,
                                                                }}
                                                                disabled
                                                                title="You cannot delete yourself"
                                                            >
                                                                <i className="bi bi-slash-circle text-muted"></i>
                                                            </button>
                                                        ) : (
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
                                                                    handleDelete(
                                                                        user.id,
                                                                    )
                                                                }
                                                                title="Delete User"
                                                            >
                                                                <i className="bi bi-trash-fill text-white"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
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
                            {Math.min(indexOfLastItem, filteredUsers.length)}
                        </strong>{" "}
                        of <strong>{filteredUsers.length}</strong>
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

            {/* SMART DRAWER */}
            <UserDrawer
                show={showDrawer}
                type={drawerType}
                selectedUser={selectedUser}
                onClose={() => setShowDrawer(false)}
                onSuccess={fetchUsers} // Auto refresh
                apiPrefix="/api"
            />
        </div>
    );
}
