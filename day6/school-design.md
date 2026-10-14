# School Database Design

## 1. Tables

- **Students:** Stores each student's ID, name, and email. The student ID is the primary key, and the email is unique to prevent two students from using the same email address.
- **Courses:** Stores each course's ID and name. The course ID is the primary key, while the course name is unique.
- **Enrolments:** Connects students and courses and stores each student's grade in a course. It uses foreign keys to reference the students and courses tables. Its composite primary key (`student_id`, `course_id`) prevents the same student from enrolling in the same course twice.

## 2. Relationships

One student can have many enrolments, creating a one-to-many relationship between students and enrolments.

One course can also have many enrolments, creating a one-to-many relationship between courses and enrolments.

Students and courses have a many-to-many relationship because one student can take several courses, and one course can have many students.

The enrolments table acts as a join table that connects students and courses. It also stores extra information, such as grades, without unnecessarily repeating student or course details.

## 3. Index

I would create an index on `enrolments(course_id)` to help the database find students enrolled in a particular course more quickly. This is useful when searching for all students taking a course. The composite primary key starts with `student_id`, so a separate index on `course_id` can improve searches by course.

## 4. SQL or NoSQL?

I would choose a relational SQL database for this school system because students, courses, and enrolments have clear relationships. SQL supports primary keys, foreign keys, unique constraints, and transactions that help maintain accurate and consistent data. SQL JOINs also make it easier to find students taking particular courses and calculate enrolment numbers. Although NoSQL databases are useful for flexible or less structured data, SQL is a better fit for this system's structured records and relationships.