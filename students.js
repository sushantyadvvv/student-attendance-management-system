
const STUDENTS_KEY = "students";

// Get student records
function getStudents() {
    try {
        return JSON.parse(
            localStorage.getItem(STUDENTS_KEY)
        ) || [];
    } catch {
        return [];
    }
}

// Save student records
function saveStudents(students) {
    localStorage.setItem(
        STUDENTS_KEY,
        JSON.stringify(students)
    );
}

// Add student
function addStudent(roll, name, course) {
    const students = getStudents();

    if (!roll || !name || !course) {
        alert("Please enter all student details.");
        return;
    }

    if (students.some(s => s.roll === roll)) {
        alert("Roll number already exists.");
        return;
    }

    students.push({
        roll: roll.trim(),
        name: name.trim(),
        course: course.trim()
    });

    saveStudents(students);

    alert("Student added successfully!");
}

// Update student
function updateStudent(roll, newName, newCourse) {
    const students = getStudents();

    const student = students.find(
        s => s.roll === roll
    );

    if (!student) {
        alert("Student not found.");
        return;
    }

    student.name = newName.trim();
    student.course = newCourse.trim();

    saveStudents(students);
}

// Delete student
function deleteStudent(roll) {
    const students = getStudents();

    const updatedStudents = students.filter(
        s => s.roll !== roll
    );

    saveStudents(updatedStudents);
}
