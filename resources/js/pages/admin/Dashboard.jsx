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
import Toast from "../../utils/toast";

// Register ChartJS Components
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

    // State para sa Filter Input
    const [schoolYear, setSchoolYear] = useState("");

    // Fetch Function with Filter
    const fetchData = async (yearFilter = "") => {
        setLoading(true);
        try {
            // Ipapasa ang ?year=XXXX sa backend
            const res = await axios.get(
                `/api/admin/analytics?year=${yearFilter}`
            );
            setData(res.data);

            if (yearFilter) {
                Toast.fire({
                    icon: "info",
                    title: `Data loaded for SY: ${yearFilter}`,
                });
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            Toast.fire({ icon: "error", title: "Failed to load analytics" });
        } finally {
            setLoading(false);
        }
    };

    // Initial Load (Current Year)
    useEffect(() => {
        fetchData();
    }, []);

    // Handle Enter Key sa Input Box
    const handleFilterSubmit = (e) => {
        if (e.key === "Enter") {
            fetchData(schoolYear);
        }
    };

    // Loading State
    if (loading)
        return (
            <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ height: "60vh" }}
            >
                <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                ></div>
                <span className="text-muted fw-bold">Loading Analytics...</span>
            </div>
        );

    // Empty State
    if (!data)
        return (
            <div className="p-5 text-center text-muted">No Data Available</div>
        );

    const { cards, charts } = data;

    // --- CHART CONFIGURATIONS ---

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
                borderColor: "#fff",
                borderWidth: 2,
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
                borderColor: "#fff",
                borderWidth: 2,
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
                borderRadius: 5,
            },
        ],
    };

    // Multi-Line Chart Configuration
    const trendData = {
        labels: charts.enrollment_trend.labels, // Jan, Feb, Mar...
        datasets: [
            {
                label: "Enrolled",
                data: charts.enrollment_trend.enrolled,
                borderColor: "#36A2EB", // Blue
                backgroundColor: "#36A2EB",
                tension: 0.3,
            },
            {
                label: "Graduates",
                data: charts.enrollment_trend.graduate,
                borderColor: "#4BC0C0", // Green
                backgroundColor: "#4BC0C0",
                tension: 0.3,
            },
            {
                label: "Dropouts",
                data: charts.enrollment_trend.dropped,
                borderColor: "#FF6384", // Red
                backgroundColor: "#FF6384",
                tension: 0.3,
            },
            {
                label: "Released",
                data: charts.enrollment_trend.released,
                borderColor: "#FF9F40", // Orange
                backgroundColor: "#FF9F40",
                tension: 0.3,
            },
        ],
    };

    // Common options for Doughnut/Pie to make them look cleaner
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 15,
                    padding: 15,
                    font: {
                        size: 11,
                    },
                },
            },
        },
        layout: {
            padding: {
                top: 20,
                bottom: 10,
            },
        },
    };

    return (
        <div className="container-fluid fade-in mb-5">
            {/* HEADER ROW WITH FILTER INPUT */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h2 className="fw-bold text-dark mb-0">Analytics Dashboard</h2>

                <div className="d-flex align-items-center mt-2 mt-md-0">
                    <span className="me-2 fw-bold text-muted small text-uppercase">
                        Filter School Year:
                    </span>
                    <div className="input-group" style={{ maxWidth: "220px" }}>
                        <span className="input-group-text bg-white border-end-0 text-primary">
                            <i className="bi bi-calendar-range"></i>
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

            {/* 1. STATS CARDS ROW (8 Cards) */}
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

            {/* 2. CHARTS ROW - ✅ UPDATED SIZES */}
            <div className="row g-4 mb-4">
                {/* Strand Population (Doughnut) */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-header bg-white fw-bold border-bottom py-3">
                            Students per Strand
                        </div>
                        {/* ✅ Binigyan ng fixed height na 350px at tinanggal ang dating constraints */}
                        <div
                            className="card-body p-3"
                            style={{ height: "350px" }}
                        >
                            <Doughnut
                                data={strandData}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Distribution (Pie) */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-header bg-white fw-bold border-bottom py-3">
                            Sections per Strand
                        </div>
                        {/* ✅ Binigyan ng fixed height na 350px */}
                        <div
                            className="card-body p-3"
                            style={{ height: "350px" }}
                        >
                            <Pie data={sectionData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Freshmen vs Old (Bar) */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-header bg-white fw-bold border-bottom py-3">
                            Freshmen vs Old Students
                        </div>
                        {/* ✅ Binigyan din ng fixed height na 350px para pantay sila */}
                        <div
                            className="card-body p-3"
                            style={{ height: "350px" }}
                        >
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
            </div>

            {/* 3. LINE CHART ROW */}
            <div className="row">
                {/* Student Status Trend (Multi-Line Graph) */}
                <div className="col-md-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white fw-bold border-bottom d-flex justify-content-between align-items-center py-3">
                            <span>Student Status Trends</span>
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                                {schoolYear
                                    ? `SY: ${schoolYear}`
                                    : "Current Year"}
                            </span>
                        </div>
                        <div
                            className="card-body p-4"
                            style={{ height: "400px" }}
                        >
                            <Line
                                data={trendData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: "bottom" },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: { color: "#f0f0f0" },
                                        },
                                        x: { grid: { display: false } },
                                    },
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
                className={`card shadow-sm border-0 border-start border-5 border-${color} h-100 transition-hover`}
            >
                <div className="card-body d-flex align-items-center justify-content-between p-4">
                    <div>
                        <p
                            className="text-muted mb-1 small fw-bold text-uppercase"
                            style={{
                                letterSpacing: "0.5px",
                                fontSize: "0.75rem",
                            }}
                        >
                            {title}
                        </p>
                        <h2 className="fw-bold mb-0 text-dark">{value}</h2>
                    </div>
                    <div
                        className={`rounded-circle bg-${color} bg-opacity-10 p-3 d-flex align-items-center justify-content-center shadow-sm`}
                        style={{ width: "60px", height: "60px" }}
                    >
                        {isTextIcon ? (
                            <span className={`fw-bold fs-4 text-${color}`}>
                                {icon}
                            </span>
                        ) : (
                            <i className={`bi ${icon} fs-3 text-${color}`}></i>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
