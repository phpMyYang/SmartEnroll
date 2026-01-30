import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Toast from "../../utils/toast";
import SubjectDrawer from "../../components/SubjectDrawer";

export default function Subjects() {
    // --- DATA STATES ---
    const [subjects, setSubjects] = useState([]);
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER STATES ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStrand, setFilterStrand] = useState("");
    const [filterGrade, setFilterGrade] = useState("");
    const [filterSemester, setFilterSemester] = useState("");

    // --- PAGINATION STATES ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- DRAWER STATES ---
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerType, setDrawerType] = useState("create");
    const [selectedSubject, setSelectedSubject] = useState(null);

    // 1. FETCH DATA
    const fetchData = async () => {
        try {
            const [subRes, strandRes] = await Promise.all([
                axios.get("/api/subjects"),
                axios.get("/api/strands"),
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

    const handleDelete = (id) => {
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
                    await axios.delete(`/api/subjects/${id}`);
                    fetchData();
                    Toast.fire({ icon: "success", title: "Subject removed." });
                } catch (error) {
                    Toast.fire({
                        icon: "error",
                        title: "Failed to delete subject.",
                    });
                }
            }
        });
    };

    // --- FILTERING LOGIC ---
    const filteredSubjects = subjects.filter((s) => {
        const matchesSearch =
            s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStrand =
            filterStrand === "" ||
            (filterStrand === "Core" && !s.strand) ||
            (s.strand && s.strand.id.toString() === filterStrand);

        const matchesGrade =
            filterGrade === "" || s.grade_level.toString() === filterGrade;

        const matchesSemester =
            filterSemester === "" || s.semester === filterSemester;

        return (
            matchesSearch && matchesStrand && matchesGrade && matchesSemester
        );
    });

    // --- PAGINATION CALCULATION ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubjects.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

            {/* MAIN CARD */}
            <div className="card-retro">
                {/* TOOLBAR (SINGLE ROW FIX) */}
                <div
                    className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between gap-3"
                    style={{
                        borderBottom: "2px solid black",
                        overflowX: "auto",
                    }} // Added overflow just in case
                >
                    {/* LEFT SIDE: FILTERS (One Line) */}
                    <div className="d-flex align-items-center gap-2">
                        {/* Show Entries */}
                        <div className="d-flex align-items-center me-2 text-nowrap">
                            <span className="small fw-bold font-monospace me-2">
                                SHOW:
                            </span>
                            <select
                                className="form-select form-select-sm border-dark border-2 fw-bold font-monospace"
                                style={{ width: "80px", cursor: "pointer" }}
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

                        {/* Strand Filter */}
                        <select
                            className="form-select form-select-sm border-dark border-2 font-monospace"
                            style={{ maxWidth: "160px", cursor: "pointer" }}
                            value={filterStrand}
                            onChange={(e) => {
                                setFilterStrand(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">ALL STRANDS</option>
                            <option value="Core">CORE (No Strand)</option>
                            {strands.map((st) => (
                                <option key={st.id} value={st.id}>
                                    {st.code}
                                </option>
                            ))}
                        </select>

                        {/* Grade Filter */}
                        <select
                            className="form-select form-select-sm border-dark border-2 font-monospace"
                            style={{ maxWidth: "130px", cursor: "pointer" }}
                            value={filterGrade}
                            onChange={(e) => {
                                setFilterGrade(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">ALL GRADES</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                        </select>

                        {/* Semester Filter */}
                        <select
                            className="form-select form-select-sm border-dark border-2 font-monospace"
                            style={{ maxWidth: "150px", cursor: "pointer" }}
                            value={filterSemester}
                            onChange={(e) => {
                                setFilterSemester(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">ALL SEMESTERS</option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                        </select>
                    </div>

                    {/* RIGHT SIDE: SEARCH BAR */}
                    <div
                        className="input-group"
                        style={{ maxWidth: "250px", minWidth: "200px" }}
                    >
                        <span className="input-group-text bg-white border-dark border-2 border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-dark border-2 border-start-0 ps-2 font-monospace"
                            placeholder="Search code/desc..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* TABLE CONTENT */}
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
                                            className="text-center py-5 fw-bold font-monospace text-muted"
                                        >
                                            <i className="bi bi-exclamation-circle me-2"></i>
                                            NO SUBJECTS FOUND MATCHING FILTERS.
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

                                            <td
                                                className="py-3"
                                                style={{ whiteSpace: "normal" }}
                                            >
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
                                                <span className="fw-bold">
                                                    G{subject.grade_level}
                                                </span>
                                                <span className="mx-1 text-muted">
                                                    -
                                                </span>
                                                {subject.semester ===
                                                "1st Semester"
                                                    ? "1st Semester"
                                                    : "2nd Semester"}
                                            </td>
                                            <td className="text-end pe-4 py-3">
                                                <div className="d-flex justify-content-end gap-2">
                                                    {/* RESTORED BUTTON EFFECTS HERE */}
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
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-fill text-dark"></i>
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

                {/* PAGINATION */}
                <div
                    className="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3"
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
                                <span
                                    className="page-link border-2 border-dark text-dark fw-bold rounded-0 mx-1"
                                    style={{ backgroundColor: "#F4D03F" }}
                                >
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

            {/* DRAWER */}
            <SubjectDrawer
                show={showDrawer}
                type={drawerType}
                selectedSubject={selectedSubject}
                strands={strands}
                onClose={() => setShowDrawer(false)}
                onSuccess={fetchData}
                apiPrefix="/api"
            />
        </div>
    );
}
