import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast"; // Using Toast
import SubjectDrawer from "../../components/SubjectDrawer";

export default function StaffSubjects() {
    // STATES
    const [subjects, setSubjects] = useState([]);
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // DRAWER STATES
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerType, setDrawerType] = useState("create");
    const [selectedSubject, setSelectedSubject] = useState(null);

    // 1. FETCH DATA (Uses Staff API)
    const fetchData = async () => {
        try {
            const [subRes, strandRes] = await Promise.all([
                axios.get("/api/staff/subjects"), // Staff API
                axios.get("/api/staff/strands"), // Staff API
            ]);
            setSubjects(subRes.data);
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
        setSelectedSubject(null);
        setShowDrawer(true);
    };

    const handleOpenEdit = (subject) => {
        setDrawerType("edit");
        setSelectedSubject(subject);
        setShowDrawer(true);
    };

    // DELETE HANDLER (Swal Confirm + Toast Result)
    const handleDelete = (id) => {
        // CONFIRMATION: Center Modal (Swal)
        Swal.fire({
            title: "DELETE SUBJECT?",
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
                    // UPDATED: Staff Endpoint
                    await axios.delete(`/api/staff/subjects/${id}`);
                    fetchData(); // Auto Refresh

                    // SUCCESS TOAST
                    Toast.fire({ icon: "success", title: "Subject removed." });
                } catch (error) {
                    // ERROR TOAST
                    Toast.fire({
                        icon: "error",
                        title: "Failed to delete subject.",
                    });
                }
            }
        });
    };

    // 3. FILTER & PAGINATION
    const filteredSubjects = subjects.filter(
        (s) =>
            s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubjects.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
    const paginate = (n) => setCurrentPage(n);

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
                        SUBJECT MANAGEMENT
                    </h2>
                    <p className="text-muted small mb-0 font-monospace">
                        Curriculum & Subjects List
                    </p>
                </div>
                <button
                    className="btn btn-retro px-4 py-2 d-flex align-items-center gap-2"
                    onClick={handleOpenCreate}
                >
                    <i className="bi bi-plus-square-fill"></i> NEW SUBJECT
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
                            className="form-select form-select-sm border-dark border-2 fw-bold font-monospace"
                            style={{ width: "80px" }}
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
                            placeholder="Search subject..."
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
                        <table className="table table-hover align-middle mb-0">
                            <thead
                                style={{
                                    backgroundColor: "var(--color-secondary)",
                                    borderBottom: "2px solid black",
                                }}
                            >
                                <tr className="text-uppercase small fw-bold">
                                    <th
                                        className="ps-4 py-3 font-monospace text-dark"
                                        width="5%"
                                    >
                                        #
                                    </th>
                                    <th
                                        className="py-3 font-monospace text-dark"
                                        width="15%"
                                    >
                                        Code
                                    </th>
                                    <th
                                        className="py-3 font-monospace text-dark"
                                        width="30%"
                                    >
                                        Description
                                    </th>
                                    <th
                                        className="py-3 font-monospace text-dark"
                                        width="15%"
                                    >
                                        Strand
                                    </th>
                                    <th
                                        className="py-3 font-monospace text-dark"
                                        width="15%"
                                    >
                                        Grade / Sem
                                    </th>
                                    <th
                                        className="text-end pe-4 py-3 font-monospace text-dark"
                                        width="20%"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-5"
                                        >
                                            <div className="spinner-border"></div>
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-5 fw-bold font-monospace"
                                        >
                                            NO SUBJECTS FOUND.
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((subject, index) => (
                                        <tr
                                            key={subject.id}
                                            style={{
                                                borderBottom: "1px solid #000",
                                            }}
                                        >
                                            <td className="ps-4 py-3 fw-bold font-monospace">
                                                {indexOfFirstItem + index + 1}
                                            </td>
                                            <td className="py-3 fw-bold font-monospace">
                                                {subject.code}
                                            </td>
                                            <td className="py-3">
                                                {subject.description}
                                            </td>
                                            <td className="py-3">
                                                {subject.strand ? (
                                                    <span className="badge rounded-0 border border-dark text-dark bg-white">
                                                        {subject.strand.code}
                                                    </span>
                                                ) : (
                                                    <span className="badge rounded-0 border border-dark text-white bg-dark">
                                                        CORE / ALL
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 font-monospace small">
                                                G{subject.grade_level} -{" "}
                                                {subject.semester}
                                            </td>

                                            {/* BUTTONS UPDATED TO MATCH ADMIN EXACTLY */}
                                            <td className="text-end pe-4 py-3">
                                                <div className="d-flex justify-content-end gap-2">
                                                    {/* EDIT BUTTON */}
                                                    <button
                                                        className="btn btn-sm rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            backgroundColor:
                                                                "#F4D03F",
                                                            boxShadow:
                                                                "2px 2px 0 #000",
                                                            transition:
                                                                "transform 0.1s",
                                                        }}
                                                        onClick={() =>
                                                            handleOpenEdit(
                                                                subject,
                                                            )
                                                        }
                                                        onMouseEnter={(e) =>
                                                            (e.currentTarget.style.transform =
                                                                "translate(-1px, -1px)")
                                                        }
                                                        onMouseLeave={(e) =>
                                                            (e.currentTarget.style.transform =
                                                                "translate(0, 0)")
                                                        }
                                                    >
                                                        <i className="bi bi-pencil-fill text-dark"></i>
                                                    </button>

                                                    {/* DELETE BUTTON */}
                                                    <button
                                                        className="btn btn-sm rounded-0 border-2 border-dark fw-bold d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            backgroundColor:
                                                                "#F96E5B",
                                                            boxShadow:
                                                                "2px 2px 0 #000",
                                                            transition:
                                                                "transform 0.1s",
                                                        }}
                                                        onClick={() =>
                                                            handleDelete(
                                                                subject.id,
                                                            )
                                                        }
                                                        onMouseEnter={(e) =>
                                                            (e.currentTarget.style.transform =
                                                                "translate(-1px, -1px)")
                                                        }
                                                        onMouseLeave={(e) =>
                                                            (e.currentTarget.style.transform =
                                                                "translate(0, 0)")
                                                        }
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
                            {Math.min(indexOfLastItem, filteredSubjects.length)}
                        </strong>{" "}
                        of <strong>{filteredSubjects.length}</strong> entries
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
                                <span
                                    className="page-link border-2 border-dark text-dark fw-bold rounded-0 mx-1"
                                    style={{ backgroundColor: "#F4D03F" }}
                                >
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

            {/* PASSING STAFF PREFIX */}
            <SubjectDrawer
                show={showDrawer}
                type={drawerType}
                selectedSubject={selectedSubject}
                strands={strands}
                onClose={() => setShowDrawer(false)}
                onSuccess={fetchData} // Auto-refresh via Smart Drawer
                apiPrefix="/api/staff" // IMPORTANT
            />
        </div>
    );
}
