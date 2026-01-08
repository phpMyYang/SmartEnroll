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
    const [drawerType, setDrawerType] = useState("create"); // create, edit, view
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. INITIAL LOAD (Fetch Users & Current User)
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

        // Get Current Logged-in User from LocalStorage (for Safety Lock)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // 2. FILTERING & PAGINATION LOGIC
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 3. HANDLERS (Open Drawer)
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

    // 4. SUBMIT LOGIC (Create & Update)
    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (drawerType === "create") {
                await axios.post("/api/users", formData);
                Toast.fire({
                    icon: "success",
                    title: "User created & credentials sent!",
                });
            } else {
                await axios.put(`/api/users/${selectedUser.id}`, formData);
                Toast.fire({
                    icon: "success",
                    title: "User updated successfully!",
                });
            }
            fetchUsers(); // Refresh Table
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

    // 5. DELETE LOGIC (With Safety Lock on Backend too)
    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete User?",
            text: "This action cannot be undone. The user will lose access immediately.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/users/${id}`);
                    fetchUsers();
                    Swal.fire("Deleted!", "User has been removed.", "success");
                } catch (error) {
                    // Handle specifically if backend blocked self-deletion
                    const msg =
                        error.response?.data?.message ||
                        "Failed to delete user.";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container-fluid fade-in mb-5">
            {/* PAGE HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Users Management</h2>
                    <p className="text-muted small mb-0">
                        Manage system administrators and staff accounts.
                    </p>
                </div>
                <button
                    className="btn btn-retro px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                    onClick={handleOpenCreate}
                >
                    <i className="bi bi-plus-lg"></i> New User
                </button>
            </div>

            {/* MAIN CARD */}
            <div className="card shadow-sm border-0">
                {/* TOOLBAR (Rows per page & Search) */}
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom-0">
                    <div className="d-flex align-items-center gap-2">
                        <span className="small text-muted fw-bold">SHOW</span>
                        <select
                            className="form-select form-select-sm border-secondary-subtle"
                            style={{ width: "70px" }}
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1); // Reset to page 1
                            }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span className="small text-muted fw-bold">
                            ENTRIES
                        </span>
                    </div>

                    <div className="input-group" style={{ maxWidth: "300px" }}>
                        <span className="input-group-text bg-white border-end-0 text-muted">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Search name or email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset page on search
                            }}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-uppercase small text-muted">
                                <tr>
                                    <th
                                        className="ps-4 py-3 text-secondary"
                                        width="5%"
                                    >
                                        #
                                    </th>
                                    <th width="30%">User Details</th>
                                    <th width="10%">Role</th>
                                    <th width="10%">Gender</th>
                                    <th width="15%">Birthday</th>
                                    <th width="10%">Status</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-5"
                                        >
                                            <div className="spinner-border text-primary"></div>
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-5 text-muted"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((user, index) => {
                                        // 🔒 SAFETY CHECK: Is this the current user?
                                        const isSelf =
                                            currentUser &&
                                            user.id === currentUser.id;

                                        return (
                                            <tr
                                                key={user.id}
                                                className={
                                                    isSelf
                                                        ? "bg-primary bg-opacity-10"
                                                        : ""
                                                }
                                            >
                                                {/* 1. NUMBERING COLUMN */}
                                                <td className="ps-4 fw-bold text-black-50">
                                                    {indexOfFirstItem +
                                                        index +
                                                        1}
                                                </td>

                                                {/* 2. USER DETAILS */}
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`}
                                                            className="rounded-circle me-3 border"
                                                            width="40"
                                                            height="40"
                                                            alt="Avatar"
                                                        />
                                                        <div>
                                                            <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                                                {user.name}
                                                                {isSelf && (
                                                                    <span
                                                                        className="badge bg-primary text-white"
                                                                        style={{
                                                                            fontSize:
                                                                                "0.6rem",
                                                                        }}
                                                                    >
                                                                        YOU
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="small text-muted">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 3. ROLE BADGE */}
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill border ${
                                                            user.role ===
                                                            "admin"
                                                                ? "bg-primary border-primary"
                                                                : "bg-white text-dark border-secondary"
                                                        }`}
                                                    >
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </td>

                                                {/* 4. GENDER */}
                                                <td>{user.gender || "-"}</td>

                                                {/* 5. BIRTHDAY */}
                                                <td className="small font-monospace">
                                                    {user.birthday || "-"}
                                                </td>

                                                {/* 6. STATUS BADGE */}
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill ${
                                                            user.status ===
                                                            "active"
                                                                ? "bg-success bg-opacity-75"
                                                                : "bg-danger bg-opacity-75"
                                                        }`}
                                                    >
                                                        {user.status
                                                            ? user.status.toUpperCase()
                                                            : "ACTIVE"}
                                                    </span>
                                                </td>

                                                {/* 7. ACTIONS */}
                                                <td className="text-end pe-4">
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm"
                                                            title="View Details"
                                                            onClick={() =>
                                                                handleOpenView(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            title="Edit User"
                                                            onClick={() =>
                                                                handleOpenEdit(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>

                                                        {/* 🛑 DISABLE DELETE IF SELF */}
                                                        {isSelf ? (
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm disabled"
                                                                title="You cannot delete yourself"
                                                                disabled
                                                            >
                                                                <i className="bi bi-slash-circle"></i>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                title="Delete User"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-trash"></i>
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

                {/* PAGINATION FOOTER */}
                <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        Showing{" "}
                        <strong>
                            {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}
                        </strong>{" "}
                        to{" "}
                        <strong>
                            {Math.min(indexOfLastItem, filteredUsers.length)}
                        </strong>{" "}
                        of <strong>{filteredUsers.length}</strong> entries
                    </small>

                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li
                                className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                }`}
                            >
                                <button
                                    className="page-link border-0 text-dark"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="bi bi-chevron-left"></i>{" "}
                                    Previous
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${
                                        currentPage === i + 1 ? "active" : ""
                                    }`}
                                >
                                    <button
                                        className="page-link border-0 rounded-circle mx-1"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li
                                className={`page-item ${
                                    currentPage === totalPages ||
                                    totalPages === 0
                                        ? "disabled"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link border-0 text-dark"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                >
                                    Next <i className="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* DRAWER COMPONENT */}
            <UserDrawer
                show={showDrawer}
                type={drawerType}
                selectedUser={selectedUser}
                onClose={() => setShowDrawer(false)}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
}
