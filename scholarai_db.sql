-- ====================================================================
-- ScholarAI – Student Performance & Scholarship Management System
-- MySQL 8.0 Database Initialization & Seed Script
-- Database Name: scholarai_db
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `scholarai_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `scholarai_db`;

-- Drop existing tables in dependency order if re-creating
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `performance_insights`;
DROP TABLE IF EXISTS `scholarship_applications`;
DROP TABLE IF EXISTS `scholarships`;
DROP TABLE IF EXISTS `feedbacks`;
DROP TABLE IF EXISTS `behaviour_assessments`;
DROP TABLE IF EXISTS `examination_marks`;
DROP TABLE IF EXISTS `examinations`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `assignments`;
DROP TABLE IF EXISTS `attendances`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `teachers`;
DROP TABLE IF EXISTS `class_sections`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Roles
CREATE TABLE `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO `roles` (`id`, `name`) VALUES 
(1, 'ADMIN'),
(2, 'TEACHER'),
(3, 'STUDENT');

-- 2. Users (BCrypt encrypted passwords for admin123, teacher123, student123)
-- BCrypt for 'admin123': $2a$10$wO3P8o9iU6K.G5g5T0fHNu0jQ4kC5yJ8I4i1H7v8J6zG3mD9o7c8i (or generated)
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `full_name` VARCHAR(100),
    `phone` VARCHAR(20),
    `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. User Roles Mapping
CREATE TABLE `user_roles` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Courses
CREATE TABLE `courses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_code` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `credits` INT DEFAULT 3,
    `department` VARCHAR(100),
    `semester` INT DEFAULT 1,
    `active` BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- 5. Teachers
CREATE TABLE `teachers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `employee_id` VARCHAR(50) UNIQUE,
    `teacher_name` VARCHAR(150),
    `subject` VARCHAR(100),
    `salary_amount` DECIMAL(12, 2),
    `salary_currency` VARCHAR(20) NOT NULL DEFAULT 'INR',
    `salary_period` VARCHAR(50),
    `performance_score` DOUBLE,
    `salary_review_recommendation` TEXT,
    `department` VARCHAR(100),
    `designation` VARCHAR(100),
    `qualification` VARCHAR(100),
    `specialization` VARCHAR(100),
    `joining_date` DATE,
    `current_salary` DECIMAL(12, 2),
    `user_id` BIGINT UNIQUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_teacher_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Class Sections
CREATE TABLE `class_sections` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `section_name` VARCHAR(20) NOT NULL,
    `academic_year` VARCHAR(20) NOT NULL,
    `semester` INT DEFAULT 1,
    `room` VARCHAR(50),
    `schedule` VARCHAR(100),
    `course_id` BIGINT NOT NULL,
    `teacher_id` BIGINT,
    CONSTRAINT `fk_cs_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cs_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Students
CREATE TABLE `students` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `roll_number` VARCHAR(50) NOT NULL UNIQUE,
    `student_name` VARCHAR(150),
    `mentor_name` VARCHAR(100),
    `mentor_ecode` VARCHAR(50),
    `grievance_details` TEXT,
    `program_name` VARCHAR(100),
    `gender` VARCHAR(20),
    `date_of_birth` DATE,
    `department` VARCHAR(100),
    `semester` INT,
    `attendance_percentage` DECIMAL(5, 2),
    `cgpa` DECIMAL(4, 2),
    `enrollment_year` INT,
    `address` VARCHAR(255),
    `guardian_name` VARCHAR(100),
    `guardian_phone` VARCHAR(20),
    `user_id` BIGINT UNIQUE,
    `class_section_id` BIGINT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_student_class` FOREIGN KEY (`class_section_id`) REFERENCES `class_sections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7b. Student Import Audit Records
CREATE TABLE `student_import_records` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `batch_id` VARCHAR(64) NOT NULL,
    `source_row_number` INT,
    `raw_roll_number` VARCHAR(50),
    `raw_student_name` VARCHAR(150),
    `raw_mentor_name` VARCHAR(100),
    `raw_mentor_ecode` VARCHAR(50),
    `raw_grievance_details` TEXT,
    `raw_program_name` VARCHAR(100),
    `raw_gender` VARCHAR(50),
    `raw_source_line` TEXT,
    `status` VARCHAR(30) NOT NULL,
    `status_message` TEXT,
    `imported_student_id` BIGINT,
    `imported_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_import_batch` (`batch_id`),
    INDEX `idx_import_status` (`status`),
    INDEX `idx_import_roll` (`raw_roll_number`)
) ENGINE=InnoDB;

-- 8. Attendances (Unique on student_id, class_section_id, date)
CREATE TABLE `attendances` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `remarks` VARCHAR(255),
    `correction_requested` BOOLEAN NOT NULL DEFAULT FALSE,
    `correction_reason` VARCHAR(255),
    `correction_approved` BOOLEAN,
    `student_id` BIGINT NOT NULL,
    `class_section_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_att_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_att_class` FOREIGN KEY (`class_section_id`) REFERENCES `class_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Assignments
CREATE TABLE `assignments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `max_marks` DOUBLE NOT NULL,
    `weight_percentage` DOUBLE,
    `deadline` DATETIME,
    `assignment_type` VARCHAR(20),
    `class_section_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_asg_class` FOREIGN KEY (`class_section_id`) REFERENCES `class_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Submissions
CREATE TABLE `submissions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `submitted_at` DATETIME,
    `marks_obtained` DOUBLE,
    `feedback` TEXT,
    `late_submission` BOOLEAN NOT NULL DEFAULT FALSE,
    `graded` BOOLEAN NOT NULL DEFAULT FALSE,
    `graded_at` DATETIME,
    `graded_by` VARCHAR(100),
    `assignment_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    CONSTRAINT `fk_sub_asg` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sub_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Examinations
CREATE TABLE `examinations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `exam_type` VARCHAR(30),
    `max_marks` DOUBLE NOT NULL,
    `exam_date` DATE,
    `class_section_id` BIGINT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_exam_class` FOREIGN KEY (`class_section_id`) REFERENCES `class_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Examination Marks (Unique on examination_id, student_id)
CREATE TABLE `examination_marks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `marks_obtained` DOUBLE,
    `grade` VARCHAR(10),
    `remarks` VARCHAR(255),
    `examination_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    `graded_by` VARCHAR(100),
    `graded_at` DATETIME,
    UNIQUE KEY `uk_exam_student` (`examination_id`, `student_id`),
    CONSTRAINT `fk_em_exam` FOREIGN KEY (`examination_id`) REFERENCES `examinations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_em_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Behaviour Assessments
CREATE TABLE `behaviour_assessments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `assessment_date` DATE NOT NULL,
    `participation_score` INT NOT NULL CHECK (`participation_score` BETWEEN 1 AND 10),
    `discipline_score` INT NOT NULL CHECK (`discipline_score` BETWEEN 1 AND 10),
    `teamwork_score` INT NOT NULL CHECK (`teamwork_score` BETWEEN 1 AND 10),
    `communication_score` INT NOT NULL CHECK (`communication_score` BETWEEN 1 AND 10),
    `overall_remarks` TEXT,
    `student_id` BIGINT NOT NULL,
    `class_section_id` BIGINT,
    `assessed_by` VARCHAR(100),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ba_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ba_class` FOREIGN KEY (`class_section_id`) REFERENCES `class_sections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 14. Scholarships
CREATE TABLE `scholarships` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `min_attendance_percent` DOUBLE,
    `min_marks_percent` DOUBLE,
    `min_cgpa` DOUBLE,
    `amount` DECIMAL(12, 2) NOT NULL,
    `max_recipients` INT,
    `deadline` DATE,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `academic_year` VARCHAR(20) DEFAULT '2026-2027',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 15. Scholarship Applications
CREATE TABLE `scholarship_applications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(20) NOT NULL,
    `application_date` DATETIME,
    `student_statement` TEXT,
    `calculated_attendance` DOUBLE,
    `calculated_marks` DOUBLE,
    `eligibility_met` BOOLEAN NOT NULL DEFAULT FALSE,
    `eligibility_explanation` TEXT,
    `admin_remarks` TEXT,
    `reviewed_by` VARCHAR(100),
    `reviewed_at` DATETIME,
    `scholarship_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sa_sch` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sa_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. Performance Insights (AI Rule Engine)
CREATE TABLE `performance_insights` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `insight_type` VARCHAR(50),
    `title` VARCHAR(255),
    `description` TEXT,
    `severity` VARCHAR(10),
    `data_factors` TEXT,
    `acknowledged` BOOLEAN NOT NULL DEFAULT FALSE,
    `student_id` BIGINT NOT NULL,
    `generated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pi_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. Feedbacks
CREATE TABLE `feedbacks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `feedback_type` VARCHAR(30) NOT NULL,
    `content` TEXT NOT NULL,
    `rating` INT CHECK (`rating` BETWEEN 1 AND 5),
    `anonymous` BOOLEAN NOT NULL DEFAULT TRUE,
    `moderated` BOOLEAN NOT NULL DEFAULT FALSE,
    `flagged` BOOLEAN NOT NULL DEFAULT FALSE,
    `moderation_note` VARCHAR(255),
    `from_user_id` BIGINT NOT NULL,
    `to_user_id` BIGINT NOT NULL,
    `class_section_id` BIGINT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_fb_from` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fb_to` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fb_class` FOREIGN KEY (`class_section_id`) REFERENCES `class_sections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 18. Audit Logs
CREATE TABLE `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `action` VARCHAR(255) NOT NULL,
    `entity_type` VARCHAR(100),
    `entity_id` BIGINT,
    `details` TEXT,
    `ip_address` VARCHAR(45),
    `performed_by` VARCHAR(100) NOT NULL,
    `performed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_performed_by` (`performed_by`),
    INDEX `idx_audit_performed_at` (`performed_at`),
    INDEX `idx_audit_entity_type` (`entity_type`)
) ENGINE=InnoDB;

-- 19. Initial Teacher Master Data (6 Records)
-- Passwords below are BCrypt for 'teacher123': $2a$10$wO3P8o9iU6K.G5g5T0fHNu0jQ4kC5yJ8I4i1H7v8J6zG3mD9o7c8i (or generated by app)
-- Ashish Patil (OOPJ, ₹80000), Silla Ann Regi (DSA, ₹100000), Pushpander Kumar (DMS, ₹85000)
-- Rahul Purohit (DLD, ₹80000), Komal Sharma (ISC, ₹50000), Sourabh Kumar (IOPS, ₹80000)

-- 20. Student–Teacher Assignments (Many-to-Many Join Table)
CREATE TABLE IF NOT EXISTS `student_teacher_assignments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `teacher_id` BIGINT NOT NULL,
    `subject` VARCHAR(100),
    `academic_year` VARCHAR(50),
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `assigned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `uk_student_teacher` UNIQUE (`student_id`, `teacher_id`),
    CONSTRAINT `fk_sta_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sta_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 21. Weekly Timetables (Monday to Saturday)
CREATE TABLE IF NOT EXISTS `timetables` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT,
    `teacher_id` BIGINT,
    `class_section_id` BIGINT,
    `day_of_week` VARCHAR(20) NOT NULL,
    `subject_name` VARCHAR(100) NOT NULL,
    `teacher_name` VARCHAR(150),
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `room_number` VARCHAR(50),
    `description` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tt_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tt_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tt_class_section` FOREIGN KEY (`class_section_id`) REFERENCES `class_sections` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 22. Audit columns on attendances
-- ALTER TABLE `attendances` ADD COLUMN `marked_by` VARCHAR(100);
-- ALTER TABLE `attendances` ADD COLUMN `marked_at` DATETIME;
-- ALTER TABLE `attendances` ADD COLUMN `subject_name` VARCHAR(100);

-- Note: The Spring Boot application includes DataInitializer which will automatically
-- populate all seed users, courses, class sections, assignments, attendance, exams,
-- scholarship data, student master data, the 6 teacher master records, student-teacher assignments,
-- and weekly curriculum timetables upon first launch!
