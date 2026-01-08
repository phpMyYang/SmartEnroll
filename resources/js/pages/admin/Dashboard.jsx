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
    const [schoolYear, setSchoolYear] = useState("");

    const fetchData = async (yearFilter = "") => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/api/admin/analytics?year=${yearFilter}`
            );
            setData(res.data);
            if (yearFilter)
                Toast.fire({ icon: "info", title: `Filtered: ${yearFilter}` });
        } catch (error) {
            console.error("Error:", error);
            Toast.fire({ icon: "error", title: "Failed to load analytics" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterSubmit = (e) => {
        if (e.key === "Enter") fetchData(schoolYear);
    };

    if (loading)
        return (
            <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ height: "60vh" }}
            >
                <div
                    className="spinner-border"
                    style={{
                        width: "3rem",
                        height: "3rem",
                        borderWidth: "4px",
                        color: "#000",
                    }}
                    role="status"
                ></div>
                <span className="mt-3 fw-bold font-monospace">
                    LOADING DATA...
                </span>
            </div>
        );

    if (!data)
        return <div className="p-5 text-center fw-bold">NO DATA AVAILABLE</div>;

    const { cards, charts } = data;

    // 🎨 RETRO CHART PALETTE
    const retroColors = [
        "#3F9AAE", // Primary (Teal)
        "#F96E5B", // Danger (Red/Orange)
        "#79C9C5", // Secondary (Light Teal)
        "#F4D03F", // Mustard (Yellow)
        "#2D3436", // Dark
    ];
    const retroBorder = "#000000";

    // --- CHART CONFIGURATIONS ---
    const strandData = {
        labels: charts.students_per_strand.map((i) => i.label),
        datasets: [
            {
                data: charts.students_per_strand.map((i) => i.value),
                backgroundColor: retroColors,
                borderColor: retroBorder,
                borderWidth: 2,
            },
        ],
    };

    const sectionData = {
        labels: charts.sections_per_strand.map((i) => i.label),
        datasets: [
            {
                data: charts.sections_per_strand.map((i) => i.value),
                backgroundColor: [...retroColors].reverse(),
                borderColor: retroBorder,
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
                backgroundColor: ["#3F9AAE", "#F4D03F"],
                borderColor: retroBorder,
                borderWidth: 2,
                borderRadius: 0,
            },
        ],
    };

    // ✅ FIXED: Added "Released" dataset back & Retro Styling
    const trendData = {
        labels: charts.enrollment_trend.labels,
        datasets: [
            {
                label: "Enrolled",
                data: charts.enrollment_trend.enrolled,
                borderColor: "#3F9AAE", // Teal
                backgroundColor: "#3F9AAE",
                pointBackgroundColor: "#fff",
                pointBorderColor: "#000",
                pointBorderWidth: 2,
                pointRadius: 6,
                tension: 0,
                borderWidth: 3,
            },
            {
                label: "Graduates",
                data: charts.enrollment_trend.graduate,
                borderColor: "#79C9C5", // Light Teal
                backgroundColor: "#79C9C5",
                pointBackgroundColor: "#fff",
                pointBorderColor: "#000",
                pointBorderWidth: 2,
                pointRadius: 6,
                tension: 0,
                borderWidth: 3,
            },
            {
                label: "Dropouts",
                data: charts.enrollment_trend.dropped,
                borderColor: "#F96E5B", // Red
                backgroundColor: "#F96E5B",
                pointBackgroundColor: "#fff",
                pointBorderColor: "#000",
                pointBorderWidth: 2,
                pointRadius: 6,
                tension: 0,
                borderWidth: 3,
            },
            {
                // ✅ ADDED BACK: Released Line (Mustard)
                label: "Released",
                data: charts.enrollment_trend.released,
                borderColor: "#F4D03F", // Mustard Yellow
                backgroundColor: "#F4D03F",
                pointBackgroundColor: "#fff",
                pointBorderColor: "#000",
                pointBorderWidth: 2,
                pointRadius: 6,
                tension: 0,
                borderWidth: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: { family: "'Courier New', monospace", size: 12 },
                    color: "#000",
                },
            },
        },
    };

    return (
        <div className="container-fluid fade-in mb-5">
            {/* FILTER HEADER */}
            <div
                className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3"
                style={{ borderBottom: "2px solid black" }}
            >
                {/* 🔥 UPDATED HEADER: May Description na sa baba */}
                <div>
                    <h2
                        className="fw-bold mb-0 font-monospace text-uppercase"
                        style={{ textShadow: "2px 2px 0 #fff" }}
                    >
                        ANALYTICS DASHBOARD
                    </h2>
                    <p className="text-muted small mb-0 font-monospace">
                        Overview of enrollment status & trends
                    </p>
                </div>

                {/* Filter Input (Walang pagbabago dito) */}
                <div className="d-flex align-items-center mt-2 mt-md-0">
                    <div
                        className="input-group"
                        style={{
                            maxWidth: "250px",
                            boxShadow: "4px 4px 0 #000",
                        }}
                    >
                        <span
                            className="input-group-text bg-white border-end-0 fw-bold"
                            style={{ border: "2px solid black" }}
                        >
                            SY:
                        </span>
                        <input
                            type="text"
                            className="form-control ps-2 font-monospace fw-bold"
                            style={{
                                border: "2px solid black",
                                borderLeft: "none",
                                borderRadius: 0,
                            }}
                            placeholder="e.g. 2025"
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
                    bgColor="#3F9AAE"
                />
                <StatCard
                    title="Pending"
                    value={cards.total_pending}
                    icon="bi-hourglass-split"
                    bgColor="#F4D03F"
                />
                <StatCard
                    title="Freshmen (G11)"
                    value={cards.total_freshmen}
                    icon="bi-mortarboard"
                    bgColor="#79C9C5"
                />
                <StatCard
                    title="Old Students (G12)"
                    value={cards.total_old}
                    icon="bi-backpack-fill"
                    bgColor="#F96E5B"
                />
            </div>

            <div className="row g-3 mb-4">
                <StatCard
                    title="Total Grade 11"
                    value={cards.total_g11}
                    icon="11"
                    isTextIcon
                    bgColor="#ffffff"
                    textColor="#000"
                />
                <StatCard
                    title="Total Grade 12"
                    value={cards.total_g12}
                    icon="12"
                    isTextIcon
                    bgColor="#ffffff"
                    textColor="#000"
                />
                <StatCard
                    title="Total Male"
                    value={cards.total_male}
                    icon="bi-gender-male"
                    bgColor="#3F9AAE"
                />
                <StatCard
                    title="Total Female"
                    value={cards.total_female}
                    icon="bi-gender-female"
                    bgColor="#F96E5B"
                />
            </div>

            {/* 2. CHARTS ROW */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card-retro h-100">
                        {/* ✅ FIX: Added 'px-4' for better left padding */}
                        <div
                            className="card-header bg-white fw-bold border-bottom-0 py-3 px-4 font-monospace"
                            style={{ borderBottom: "2px solid black" }}
                        >
                            Students per Strand
                        </div>
                        <div
                            className="card-body p-3"
                            style={{ height: "300px" }}
                        >
                            <Doughnut
                                data={strandData}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card-retro h-100">
                        {/* ✅ FIX: Added 'px-4' */}
                        <div
                            className="card-header bg-white fw-bold border-bottom-0 py-3 px-4 font-monospace"
                            style={{ borderBottom: "2px solid black" }}
                        >
                            Sections per Strand
                        </div>
                        <div
                            className="card-body p-3"
                            style={{ height: "300px" }}
                        >
                            <Pie data={sectionData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card-retro h-100">
                        {/* ✅ FIX: Added 'px-4' */}
                        <div
                            className="card-header bg-white fw-bold border-bottom-0 py-3 px-4 font-monospace"
                            style={{ borderBottom: "2px solid black" }}
                        >
                            Freshmen vs Old
                        </div>
                        <div
                            className="card-body p-3"
                            style={{ height: "300px" }}
                        >
                            <Bar data={demoData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. TREND CHART */}
            <div className="row">
                <div className="col-md-12">
                    <div className="card-retro">
                        {/* ✅ FIX: Added 'px-4' */}
                        <div
                            className="card-header bg-white fw-bold d-flex justify-content-between align-items-center py-3 px-4"
                            style={{ borderBottom: "2px solid black" }}
                        >
                            <span className="font-monospace">
                                Enrollment Trend (This Year)
                            </span>
                        </div>
                        <div
                            className="card-body p-4"
                            style={{ height: "400px" }}
                        >
                            <Line
                                data={trendData}
                                options={{
                                    ...chartOptions,
                                    scales: {
                                        x: {
                                            grid: {
                                                color: "#000",
                                                lineWidth: 0.5,
                                            },
                                        },
                                        y: {
                                            grid: {
                                                color: "#000",
                                                lineWidth: 0.5,
                                            },
                                        },
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

// RETRO STAT CARD COMPONENT
function StatCard({
    title,
    value,
    icon,
    bgColor,
    textColor = "#fff",
    isTextIcon,
}) {
    return (
        <div className="col-md-3 col-sm-6">
            <div
                className="card-retro h-100 p-3"
                style={{ backgroundColor: "#fff" }}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <p
                            className="mb-1 fw-bold font-monospace text-uppercase"
                            style={{ fontSize: "0.75rem", color: "#555" }}
                        >
                            {title}
                        </p>
                        <h2
                            className="fw-bold mb-0"
                            style={{
                                color: "#000",
                                textShadow: "1px 1px 0 #ddd",
                            }}
                        >
                            {value}
                        </h2>
                    </div>

                    <div
                        className="d-flex align-items-center justify-content-center border border-2 border-dark"
                        style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: bgColor,
                            color: textColor,
                            borderRadius: "8px",
                            boxShadow: "3px 3px 0 #000",
                        }}
                    >
                        {isTextIcon ? (
                            <span className="fw-bold fs-4">{icon}</span>
                        ) : (
                            <i className={`bi ${icon} fs-4`}></i>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
