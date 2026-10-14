-- Day 6 Assignment: School Database
PRAGMA foreign_keys = ON;

-- 1. Create the students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE
);

-- 3. Create the enrolments table
CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
);

-- 4. Insert students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Alice Kamau', 'alice@example.com'),
(2, 'Brian Otieno', 'brian@example.com'),
(3, 'Diana Wanjiku', 'diana@example.com');

-- 5. Insert courses
INSERT INTO courses (course_id, course_name) VALUES
(1, 'Database Systems'),
(2, 'Web Development'),
(3, 'Computer Networks');

-- 6. Insert enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'B'),
(1, 2, 'A'),
(1, 3, 'B'),
(2, 1, 'A'),
(2, 3, 'C');

-- QUERY 1: All courses for one student
SELECT students.name, courses.course_name, enrolments.grade
FROM students
JOIN enrolments
    ON students.student_id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE students.name = 'Alice Kamau';

-- QUERY 2: All students on one course
SELECT students.name, students.email, courses.course_name
FROM students
JOIN enrolments
    ON students.student_id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE courses.course_name = 'Database Systems';

-- QUERY 3: Number of students per course
SELECT courses.course_name,
       COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments
    ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.course_name;

-- QUERY 4: Students with no enrolments
SELECT students.student_id, students.name, students.email
FROM students
LEFT JOIN enrolments
    ON students.student_id = enrolments.student_id
WHERE enrolments.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1
  AND course_id = 1;

-- 7. Index to help searches by course
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);