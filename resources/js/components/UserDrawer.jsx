import React, { useEffect, useState } from "react";

export default function UserDrawer({
    show,
    type,
    selectedUser,
    onClose,
    onSubmit,
    isLoading,
}) {
    // Initial State
    const initialForm = {
        name: "",
        email: "",
        contact_number: "",
        birthday: "",
        age: "",
        gender: "",
        role: "staff",
        status: "active",
        password: "",
    };

    const [formData, setFormData] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false); // 👁️ State para sa mata

    // Load data pag "Edit" or "View" mode
    useEffect(() => {
        if ((type === "edit" || type === "view") && selectedUser) {
            setFormData({ ...selectedUser, password: "" });
        } else {
            setFormData(initialForm);
        }
        setShowPassword(false); // Reset password view
    }, [type, selectedUser, show]);

    const handleBirthdayChange = (e) => {
        const bday = e.target.value;
        if (bday) {
            const age = new Date().getFullYear() - new Date(bday).getFullYear();
            setFormData({ ...formData, birthday: bday, age: age });
        } else {
            setFormData({ ...formData, birthday: "", age: "" });
        }
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const drawerClass = show
        ? "offcanvas offcanvas-end show"
        : "offcanvas offcanvas-end";
    const backdropClass = show ? "offcanvas-backdrop fade show" : "";
    const isReadOnly = type === "view";

    return (
        <>
            {show && (
                <div
                    className={backdropClass}
                    onClick={onClose}
                    style={{ zIndex: 1045 }}
                ></div>
            )}

            {/* 🔥 WIDER DRAWER using style width */}
            <div
                className={drawerClass}
                style={{
                    zIndex: 1050,
                    visibility: show ? "visible" : "hidden",
                    width: "400px",
                }}
            >
                <div className="offcanvas-header bg-primary text-white">
                    <h5 className="offcanvas-title fw-bold text-uppercase ls-1">
                        {type === "create" && (
                            <>
                                <i className="bi bi-person-plus-fill me-2"></i>
                                Create User
                            </>
                        )}
                        {type === "edit" && (
                            <>
                                <i className="bi bi-pencil-square me-2"></i>Edit
                                User
                            </>
                        )}
                        {type === "view" && (
                            <>
                                <i className="bi bi-person-vcard me-2"></i>User
                                Details
                            </>
                        )}
                    </h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={onClose}
                    ></button>
                </div>

                <div className="offcanvas-body bg-light">
                    <form
                        onSubmit={handleSubmit}
                        className="d-flex flex-column gap-3"
                    >
                        {/* PERSONAL INFO */}
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="fw-bold text-primary mb-3 text-uppercase small border-bottom pb-2">
                                    Personal Information
                                </h6>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">
                                        FULL NAME
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="e.g. Juan Dela Cruz"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-8">
                                        <label className="form-label small fw-bold text-muted">
                                            BIRTHDAY
                                        </label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            className="form-control"
                                            value={formData.birthday}
                                            onChange={handleBirthdayChange}
                                            required
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label small fw-bold text-muted">
                                            AGE
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-white"
                                            value={formData.age}
                                            readOnly
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="form-label small fw-bold text-muted">
                                        GENDER
                                    </label>
                                    <select
                                        name="gender"
                                        className="form-select"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ACCOUNT INFO */}
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="fw-bold text-primary mb-3 text-uppercase small border-bottom pb-2">
                                    Account Details
                                </h6>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">
                                        EMAIL ADDRESS
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">
                                        CONTACT NUMBER
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        className="form-control"
                                        placeholder="0912 345 6789"
                                        value={formData.contact_number}
                                        onChange={handleChange}
                                        required
                                        disabled={isReadOnly}
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-muted">
                                            ROLE
                                        </label>
                                        <select
                                            name="role"
                                            className="form-select"
                                            value={formData.role}
                                            onChange={handleChange}
                                            disabled={isReadOnly}
                                        >
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-muted">
                                            STATUS
                                        </label>
                                        <select
                                            name="status"
                                            className={`form-select fw-bold ${
                                                formData.status === "active"
                                                    ? "text-success"
                                                    : "text-danger"
                                            }`}
                                            value={formData.status}
                                            onChange={handleChange}
                                            disabled={isReadOnly}
                                        >
                                            <option
                                                value="active"
                                                className="text-success"
                                            >
                                                Active
                                            </option>
                                            <option
                                                value="inactive"
                                                className="text-danger"
                                            >
                                                Inactive
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* PASSWORD FIELD WITH EYE ICON */}
                                {!isReadOnly && (
                                    <div>
                                        <label className="form-label small fw-bold text-muted">
                                            {type === "edit"
                                                ? "NEW PASSWORD (Optional)"
                                                : "PASSWORD"}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                className="form-control"
                                                placeholder={
                                                    type === "edit"
                                                        ? "Leave blank to keep current"
                                                        : "Enter secure password"
                                                }
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={type === "create"}
                                                minLength="8"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                <i
                                                    className={`bi bi-eye${
                                                        showPassword
                                                            ? "-slash"
                                                            : ""
                                                    }`}
                                                ></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        {!isReadOnly && (
                            <button
                                type="submit"
                                className="btn btn-primary py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        {/* 👇 ITO ANG BINAGO PARTNER: Toga Hat Icon na umiikot */}
                                        <i className="bi bi-mortarboard-fill fs-5 me-2 toga-spin"></i>
                                        <span>PROCESSING...</span>
                                    </>
                                ) : type === "create" ? (
                                    "CREATE ACCOUNT"
                                ) : (
                                    "UPDATE ACCOUNT"
                                )}
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
