import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
} from "chart.js";
import { Doughnut, Pie, Bar, Line } from "react-chartjs-2";
import Toast from "../../utils/toast"; // Optional: Para sa notifications

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement
);

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🆕 STATE PARA SA SCHOOL YEAR
    const [schoolYear, setSchoolYear] = useState(""); // E.g., "2025-2026"

    // 🆕 FETCH FUNCTION (Tumatanggap ng year)
    const fetchData = async (yearFilter = "") => {
        setLoading(true);
        try {
            // Ipapasa natin ang year sa URL query params
            const res = await axios.get(
                `/api/admin/analytics?year=${yearFilter}`
            );
            setData(res.data);

            if (yearFilter) {
                Toast.fire({
                    icon: "info",
                    title: `Filtered by SY: ${yearFilter}`,
                });
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchData();
    }, []);

    // 🆕 HANDLE ENTER KEY
    const handleFilterSubmit = (e) => {
        if (e.key === "Enter") {
            fetchData(schoolYear);
        }
    };

    if (loading)
        return (
            <div className="p-5 text-center">
                <i className="bi bi-arrow-repeat spin fs-1 text-primary"></i>{" "}
                <p>Loading Analytics...</p>
            </div>
        );
    if (!data) return <div className="p-5 text-center">No Data Available</div>;

    const { cards, charts } = data;

    // --- CHART CONFIGURATIONS (SAME AS BEFORE) ---
    const strandData = {
        labels: charts.students_per_strand.map((i) => i.label),
        datasets: [
            {
                data: charts.students_per_strand.map((i) => i.value),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                ],
            },
        ],
    };

    const sectionData = {
        labels: charts.sections_per_strand.map((i) => i.label),
        datasets: [
            {
                data: charts.sections_per_strand.map((i) => i.value),
                backgroundColor: [
                    "#FF9F40",
                    "#FF6384",
                    "#36A2EB",
                    "#9966FF",
                    "#4BC0C0",
                ],
            },
        ],
    };

    const demoData = {
        labels: charts.demographics.map((i) => i.label),
        datasets: [
            {
                label: "Students Count",
                data: charts.demographics.map((i) => i.value),
                backgroundColor: ["#36A2EB", "#FFCE56"],
            },
        ],
    };

    const trendData = {
        labels: charts.enrollment_trend.map((i) => i.month_name),
        datasets: [
            {
                label: "Enrollees",
                data: charts.enrollment_trend.map((i) => i.count),
                borderColor: "#4BC0C0",
                tension: 0.3,
                fill: false,
            },
        ],
    };

    return (
        <div className="container-fluid fade-in">
            {/* 🆕 HEADER ROW WITH FILTER INPUT */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark mb-0">Analytics Dashboard</h2>

                <div className="d-flex align-items-center">
                    <span className="me-2 fw-bold text-muted small">
                        FILTER S.Y:
                    </span>
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-calendar-range text-primary"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="e.g. 2025-2026"
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            onKeyDown={handleFilterSubmit}
                        />
                    </div>
                </div>
            </div>

            {/* 1. STATS CARDS ROW */}
            <div className="row g-3 mb-4">
                <StatCard
                    title="Total Enrolled"
                    value={cards.total_enrolled}
                    icon="bi-person-check-fill"
                    color="primary"
                />
                <StatCard
                    title="Pending Applicants"
                    value={cards.total_pending}
                    icon="bi-hourglass-split"
                    color="warning"
                />
                <StatCard
                    title="Freshmen (G11)"
                    value={cards.total_freshmen}
                    icon="bi-mortarboard"
                    color="success"
                />
                <StatCard
                    title="Old Students (G12)"
                    value={cards.total_old}
                    icon="bi-backpack-fill"
                    color="info"
                />
            </div>

            <div className="row g-3 mb-4">
                <StatCard
                    title="Total Grade 11"
                    value={cards.total_g11}
                    icon="11"
                    isTextIcon
                    color="secondary"
                />
                <StatCard
                    title="Total Grade 12"
                    value={cards.total_g12}
                    icon="12"
                    isTextIcon
                    color="secondary"
                />
                <StatCard
                    title="Total Male"
                    value={cards.total_male}
                    icon="bi-gender-male"
                    color="primary"
                />
                <StatCard
                    title="Total Female"
                    value={cards.total_female}
                    icon="bi-gender-female"
                    color="danger"
                />
            </div>

            {/* 2. CHARTS ROW */}
            <div className="row g-4">
                {/* Strand Population */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-white fw-bold">
                            Students per Strand
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <div
                                style={{
                                    maxHeight: "300px",
                                    maxWidth: "300px",
                                }}
                            >
                                <Doughnut data={strandData} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Distribution */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-white fw-bold">
                            Sections per Strand
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <div
                                style={{
                                    maxHeight: "300px",
                                    maxWidth: "300px",
                                }}
                            >
                                <Pie data={sectionData} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Freshmen vs Old Bar */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-white fw-bold">
                            Freshmen vs Old Students
                        </div>
                        <div className="card-body">
                            <Bar
                                data={demoData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Enrollment Trend */}
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white fw-bold">
                            Enrollment Trend ({schoolYear || "This Year"})
                        </div>
                        <div className="card-body" style={{ height: "300px" }}>
                            <Line
                                data={trendData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Card Component
function StatCard({ title, value, icon, color, isTextIcon }) {
    return (
        <div className="col-md-3 col-sm-6">
            <div
                className={`card shadow-sm border-start border-5 border-${color} h-100`}
            >
                <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <p className="text-muted mb-0 small fw-bold text-uppercase">
                            {title}
                        </p>
                        <h3 className="fw-bold mb-0 text-dark">{value}</h3>
                    </div>
                    <div
                        className={`rounded-circle bg-${color} bg-opacity-10 p-3 d-flex align-items-center justify-content-center`}
                        style={{ width: "50px", height: "50px" }}
                    >
                        {isTextIcon ? (
                            <span className={`fw-bold text-${color}`}>
                                {icon}
                            </span>
                        ) : (
                            <i className={`bi ${icon} fs-4 text-${color}`}></i>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
