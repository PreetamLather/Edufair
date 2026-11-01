# EduFair – Student & Teacher Performance Evaluation System

EduFair is an institutional-grade academic performance evaluation, curriculum governance, faculty salary ledger, and scholarship allocation system built with **Spring Boot 3**, **Java 21**, **Spring Data JPA**, **Spring Security 6**, **MySQL 8.0 / H2**, and **Thymeleaf**.

---

## 1. System Requirements & Software

Before running EduFair in Visual Studio Code, ensure the following software is installed on your computer:

| Software | Required Version | Verification Command | Download Link |
|---|---|---|---|
| **Java Development Kit (JDK)** | **Java 21** or higher (e.g., JDK 21 / 26) | `java -version` | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [Eclipse Adoptium](https://adoptium.net/) |
| **Visual Studio Code** | Latest Stable | `code --version` | [code.visualstudio.com](https://code.visualstudio.com/) |
| **VS Code Java Extension Pack** | Extension ID: `vscjava.vscode-java-pack` | In VS Code Extensions (`Ctrl+Shift+X`) | Search "Extension Pack for Java" |
| **MySQL Server** *(Optional if using H2)* | **MySQL 8.0+** | `mysql --version` | [dev.mysql.com/downloads](https://dev.mysql.com/downloads/installer/) |
| **Modern Web Browser** | Chrome, Edge, Firefox, or Safari | N/A | Any modern browser |

> **Note:** Apache Maven is **not** required to be pre-installed separately because the project includes the self-contained Maven Wrapper (`mvnw` and `mvnw.cmd`).

---

## 2. Project Directory Structure

```
EduFair/
├── .mvn/wrapper/               # Maven wrapper binaries & properties
├── .vscode/                    # VS Code pre-configured run and debug profiles
│   ├── extensions.json         # Recommended VS Code extensions
│   ├── launch.json             # F5 Debugger profiles (MySQL & H2 In-Memory)
│   ├── settings.json           # Java runtime and workspace settings
│   └── tasks.json              # VS Code build and run tasks
├── src/
│   ├── main/
│   │   ├── java/com/edufair/   # Backend Java 21 Spring Boot source code
│   │   │   ├── config/         # Security, audit interceptors, data initializers
│   │   │   ├── controller/     # REST & MVC controllers (Admin, Teacher, Student, Home)
│   │   │   ├── dto/            # Data transfer objects & import summaries
│   │   │   ├── entity/         # JPA entities (Student, Teacher, Course, Scholarship, etc.)
│   │   │   │   └── enums/      # Enumerations (Roles, ReviewStatus, FeedbackType, etc.)
│   │   │   ├── repository/     # Spring Data JPA repositories
│   │   │   └── service/        # Business logic & AI insight engine
│   │   └── resources/
│   │       ├── data/           # TSV & CSV master datasets (student_master_data.tsv)
│   │       ├── static/         # CSS stylesheets, JavaScript, and compiled PDF reports
│   │       ├── templates/      # Thymeleaf HTML5 templates (Admin, Faculty, Student)
│   │       ├── application.properties    # Production MySQL configuration
│   │       └── application-h2.properties # Zero-configuration local H2 database profile
│   └── test/                   # Unit and integration test suites
├── EduFair_Performance_Evaluation_Report.pdf  # 6-page A4 landscape evaluation report
├── pom.xml                     # Maven project configuration & dependencies
├── mvnw & mvnw.cmd             # Maven Wrapper scripts for Unix and Windows
├── scholarai_db.sql            # Full MySQL database creation & seed script
└── README.md                   # This project setup and user guide
```

---

## 3. Database Setup & Configuration

The application supports **two database options**:

### Option A: MySQL Database (Production & Persistent Mode)

1. **Start MySQL Service**: Ensure your local MySQL service is running (via MySQL Workbench, XAMPP, or Windows Services).
2. **Create Database**: Open MySQL Workbench or your terminal and execute:
   ```sql
   CREATE DATABASE IF NOT EXISTS scholarai_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Run Schema Script** *(Optional – Hibernate will auto-create tables)*:
   ```cmd
   mysql -u root -p scholarai_db < scholarai_db.sql
   ```
4. **Configure Credentials**:
   Open [`src/main/resources/application.properties`](file:///d:/projectjava/src/main/resources/application.properties) and update your MySQL username and password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/scholarai_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
   ```

### Option B: H2 In-Memory Database (Zero Configuration / Instant Test)

No database installation is required for H2 mode. Everything runs automatically in memory:
- Activate via CLI flag: `--spring.profiles.active=h2`
- H2 Web Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:scholarai_db`, Username: `sa`, Password: empty)

---

## 4. How to Open and Run the Project in Visual Studio Code

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Click **File > Open Folder...** (or press `Ctrl+K Ctrl+O`).
3. Select the **`EduFair`** folder (`D:\EduFair`).
4. When prompted "Do you trust the authors of the files in this folder?", click **Yes, I trust the authors**.
5. Recommended: Install the **Extension Pack for Java** if prompted.

### Step 2: Run the Project

#### Method 1: Using VS Code Run & Debug (F5)
1. In VS Code, click on the **Run and Debug** icon in the Activity Bar on the left (`Ctrl+Shift+D`).
2. At the top dropdown, select either:
   - **`ScholarAI - Run Application (H2 In-Memory)`** *(Recommended for instant test)*
   - **`ScholarAI - Run Application (MySQL)`**
3. Press **F5** (or click the green Play icon).
4. The integrated terminal will display Spring Boot startup logs.

#### Method 2: Using the Integrated Terminal
1. Open the terminal in VS Code (`Ctrl+` `) or **Terminal > New Terminal**.
2. Build the project using the Maven Wrapper:
   ```powershell
   .\mvnw.cmd clean package -DskipTests
   ```
3. Run the application:
   - **For H2 In-Memory mode:**
     ```powershell
     .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
     ```
     *or run the built JAR directly:*
     ```powershell
     java -jar target\edufair-1.0.0.jar --spring.profiles.active=h2
     ```
   - **For MySQL mode:**
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```

---

## 5. Opening the Website in Browser

Once the terminal outputs `Tomcat started on port 8080 (http)`:

1. Open your browser and navigate to:
   **[http://localhost:8080/](http://localhost:8080/)**

### Default Seed Credentials

The system automatically initializes default accounts upon first boot:

| Role | Username | Password | Dashboard URL | Primary Capabilities |
|---|---|---|---|---|
| **Administrator** | `admin` | `admin123` | [http://localhost:8080/admin/dashboard](http://localhost:8080/admin/dashboard) | Full executive overview, student & teacher master management, compensation ledger, audit logs |
| **Faculty Member** | `teacher1` | `teacher123` | [http://localhost:8080/teacher/dashboard](http://localhost:8080/teacher/dashboard) | Assigned sections, attendance recording, behavior rubric assessment, coursework grading |
| **Master Teacher** | `ashish.patil` | `teacher123` | [http://localhost:8080/teacher/profile](http://localhost:8080/teacher/profile) | OOPJ Faculty Profile, confidential salary ledger (₹80,000 INR), personal performance grade |
| **Enrolled Student** | `student1` | `student123` | [http://localhost:8080/student/dashboard](http://localhost:8080/student/dashboard) | Academic metrics, attendance tracking, scholarship application, explainable AI insights |
| **Master Student** | `2546569` | `student123` | [http://localhost:8080/student/dashboard](http://localhost:8080/student/dashboard) | Aditya Raj (BTCSE Data Science) student portal (displays verified attendance & CGPA out of 10.0) |

---

## 6. Student Academic Metrics Management (Attendance & CGPA)

- **Database Fields:** `attendance_percentage` (`DECIMAL(5,2)`) and `cgpa` (`DECIMAL(4,2)` on a scale of 10.0) on the `Student` entity.
- **Admin Management:**
  - Navigate to **Student Master Directory** (`/admin/students`) or search by Roll Number / Student Name.
  - Open any student profile (`/admin/students/{id}`) to view their current Attendance and CGPA.
  - Use the **Update Attendance & CGPA** card or edit form to input or modify academic metrics.
  - Search students dynamically using Roll Number or Student Name.
- **Student Dashboard:**
  - When logged in, students immediately view their verified Attendance Rate (%) and Cumulative GPA (Scale of 10.0).
  - If metrics have not been recorded yet by an administrator, the dashboard clearly displays **`Not Added Yet`** (no random or fictional values).
  - Metrics are persisted in the database and retained across page refreshes.

---

## 7. Student–Teacher Assignment, Weekly Timetable & Attendance Management

### A. Student–Teacher Assignment (Many-to-Many)
- **Database Table:** `student_teacher_assignments` dedicated join table linking students and teachers without duplicating records or changing IDs.
- **Auto-Linking:** All existing enrolled students are automatically linked to all faculty members upon boot without data loss.
- **Admin Management:**
  - Route: [`/admin/student-teacher-assignments`](http://localhost:8080/admin/student-teacher-assignments)
  - View all assignments, search by student name, roll number, or faculty member.
  - Create individual student–teacher assignments or trigger "Link All Students to All Teachers".
  - Remove individual assignments with audit logging.
- **Faculty View:** Faculty members view their linked student roster at [`/teacher/students`](http://localhost:8080/teacher/students).
- **Student View:** Students view their assigned faculty mentors at [`/student/profile`](http://localhost:8080/student/profile) and [`/student/teachers`](http://localhost:8080/student/teachers).

### B. Weekly Academic Timetable (Monday to Saturday)
- **Schedule Scope:** Monday through Saturday weekly class and lab schedules.
- **Overlap & Conflict Prevention:**
  - Strict validation: Start time must precede end time (`startTime.isBefore(endTime)`).
  - Automatically prevents overlapping classes for the same student on the same day.
  - Automatically prevents overlapping classes for the same teacher on the same day.
- **Admin Timetable CRUD:**
  - Route: [`/admin/timetables`](http://localhost:8080/admin/timetables)
  - Create: [`/admin/timetables/create`](http://localhost:8080/admin/timetables/create)
  - Edit: `/admin/timetables/edit/{id}`
  - Delete: `/admin/timetables/delete/{id}`
- **Faculty View:** [`/teacher/timetable`](http://localhost:8080/teacher/timetable) displays the teacher's scheduled lectures in a clean weekly grid with today's day highlighted.
- **Student View:** [`/student/timetable`](http://localhost:8080/student/timetable) displays the student's weekly schedule with today's day highlighted (read-only access). If not configured, strictly displays `"Timetable Not Added Yet"`.

### C. Faculty Attendance Management Dashboard
- **Route:** [`/teacher/attendance`](http://localhost:8080/teacher/attendance)
- **Features:**
  - Select session date and scheduled subject / class section.
  - View all linked students for the faculty member.
  - Mark each student as **Present**, **Absent**, or **Late** with individual optional remarks.
  - Quick bulk actions: **Mark All Present**, **Mark All Absent**, **Mark All Late**.
  - **Duplicate Prevention:** Submitting attendance for an existing date and class/subject seamlessly updates the existing record instead of creating duplicates.
  - **Audit Stamps:** Every marked record tracks `marked_by` and `marked_at` timestamp.
  - **Dynamic Recalculation:** Submitting attendance dynamically updates each student's `attendance_percentage` in the database.
  - **Attendance History:** [`/teacher/attendance/history`](http://localhost:8080/teacher/attendance/history) allows faculty to review past logs.
  - **Admin Reports:** [`/admin/attendance-reports`](http://localhost:8080/admin/attendance-reports) provides institutional attendance logs and audit filters.
  - **Student View:** Students review their session logs (read-only) at [`/student/attendance`](http://localhost:8080/student/attendance).

---

## 8. Official Academic PDF Report

A professional 6-page A4 landscape evaluation report is included in the project:
- **Direct PDF File:** `EduFair_Performance_Evaluation_Report.pdf`
- **Online Browser Endpoint:** [http://localhost:8080/reports/EduFair_Performance_Evaluation_Report.pdf](http://localhost:8080/reports/EduFair_Performance_Evaluation_Report.pdf)
- Features: 61 student records preserved, 6 master faculty records, ₹4,75,000 base salary pool, 6-criteria evaluation rubric, and strict privacy compliance.

---

## 7. Troubleshooting & Common Fixes

- **Port 8080 already in use:**
  ```powershell
  # Check which process is using port 8080
  Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
  # Stop process or restart
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess -Force
  ```
- **Java Home Mismatch:**
  Set your `JAVA_HOME` environment variable to JDK 21 or JDK 26:
  ```powershell
  $env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.2"
  ```
- **MySQL Connection Refused:**
  Ensure MySQL service is running on port 3306 or run with the H2 profile (`--spring.profiles.active=h2`).

---

&copy; 2026 EduFair Team. All rights reserved.
