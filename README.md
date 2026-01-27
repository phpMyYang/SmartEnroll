# 🎓 SmartEnroll: SHS Enrollment System

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

**SmartEnroll** is a modern, web-based enrollment management system designed for Senior High Schools. It features a unique **Retro / Neobrutalism UI** design, real-time section capacity management, and a comprehensive reporting suite.

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation Guide](#-installation-guide)
- [Default Credentials](#-default-credentials)
- [System Modules](#-system-modules)

---

## 🎨 About the Project

The system streamlines the enrollment process from student application (Public Portal) to section assignment and records management (Staff Portal). It enforces strict validation rules to prevent section overbooking and ensures data integrity through soft deletes and activity logging.

**Key Design Philosophy:**

- **User Interface:** Retro/Neobrutalism style (Bold borders, high contrast, pastel palette).
- **User Experience:** Fast, responsive, and intuitive using ReactJS & Laravel API.

---

## 🚀 Key Features

### 🌍 Public Portal (Student Side)

- **Online Enrollment Form:** Students can enroll as _Face-to-Face_ or _Modular_.
- **LRN Status Check:** Real-time checking of enrollment status via 12-digit LRN.
- **Maintenance Page:** Auto-redirects users when the system is under maintenance (with countdown timer).

### 🏫 Staff & Admin Portal

- **Dashboard Analytics:** Real-time view of total enrollees, modality breakdown, and gender distribution.
- **Student Management:**
    - Full CRUD (Create, Read, Update, Delete) operations.
    - **Smart Section Assignment:** Prevents enrolling students into FULL sections (Capacity Check).
    - **Status Management:** Update status to Enrolled, Dropped, Released, Graduate, etc.
- **Section Management:**
    - Visual progress bars for section capacity (Green/Yellow/Red indicators).
    - Automatic blocking when capacity is reached.
- **Recycle Bin (Smart Restore):**
    - Restores deleted records safely.
    - **Safety Logic:** If a student's previous section is NOW full, they are restored as _Pending_ instead of _Enrolled_.

### 📄 Reports & Documents

- **Certificate of Registration (COR):** Auto-generated PDF with subject load and fees.
- **Summary Reports:** Enrollment Summary, List of Graduates, Dropouts, etc. (PDF).
- **Masterlist Export:** Export student data to CSV (separated by Gender and Modality).

---

## 🛠 Tech Stack

**Backend:**

- ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white) **Laravel 12** (API, Eloquent ORM)
- ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white) **PHP 8.2**
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) **MySQL** (Database)

**Frontend:**

- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React.js** (Vite)
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white) **Bootstrap 5** (Layouts)
- **Axios** (HTTP Requests)
- **SweetAlert2 & Toast** (Notifications)

**Tools & Libraries:**

- **dompdf/dompdf:** PDF Generation
- **React Router:** Navigation
- **FontAwesome / Bootstrap Icons**

---

## ⚙️ Installation Guide

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL Server

### 1. Backend Setup (Laravel)

```bash
# Clone the repository
git clone [https://github.com/yourusername/smartenroll.git](https://github.com/yourusername/smartenroll.git)
cd smartenroll

# Install PHP dependencies
composer install

# Create environment file
cp .env.example .env

# Configure database in .env
DB_DATABASE=smartenroll_db
DB_USERNAME=root
DB_PASSWORD=

# Generate App Key
php artisan key:generate

# Run Migrations & Seeders (Creates Admin Account)
php artisan migrate --seed

# Start the Server
php artisan serve
```

### 2. Frontend Setup (React/Vite)

```bash
# Open a new terminal in the project root
npm install

# Run the development server
npm run dev

```

---

## 🔐 Default Credentials

Use these accounts to access the system after seeding:

| Role            | Email                   | Password      |
| --------------- | ----------------------- | ------------- |
| **Super Admin** | `admin@smartenroll.com` | `password123` |
| **Staff**       | `staff@smartenroll.com` | `password123` |

---

## 📦 System Modules Overview

### 1. Maintenance Mode

Controlled via Admin Settings. When enabled:

- **Public:** Redirected to a "System Under Maintenance" screen.
- **Staff:** Can still log out but cannot access the dashboard.
- **Admin:** Has full access to bypass maintenance.

### 2. Section Capacity Logic

The system strictly enforces section limits.

- _Example:_ If Section A has 40/40 students, you cannot enroll a new student there.
- _Error Message:_ "FAILED: Section 'Tycoon' is already FULL (40/40)."

### 3. Report Generation

- **Input Validation:** School Year must be in `YYYY-YYYY` format (e.g., 2025-2026).
- **Registrar:** Required for signing PDF reports.

---

## 📝 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

---

**Developed with ❤️ by phpMyYang**
