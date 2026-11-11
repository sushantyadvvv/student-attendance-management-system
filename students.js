const STUDENTS_KEY = "students";

// Get student records
function getStudents() {
    try {
        return JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [];
    } catch {
        return [];
    }
}

// Save student records
function saveStudents(students) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

// Add student (returns true if added)
function addStudent(roll, name, course, email) {
    roll = (roll || "").trim();
    name = (name || "").trim();
    course = (course || "").trim();
    email = (email || "").trim();

    if (!roll || !name || !course) {
        alert("Please enter roll number, name and course.");
        return false;
    }

    const students = getStudents();

    if (students.some(s => s.roll === roll)) {
        alert("Roll number already exists.");
        return false;
    }

    students.push({ roll, name, course, email });
    saveStudents(students);
    return true;
}

// Update student
function updateStudent(roll, newName, newCourse, newEmail) {
    const students = getStudents();
    const student = students.find(s => s.roll === roll);

    if (!student) {
        alert("Student not found.");
        return;
    }

    student.name = newName.trim();
    student.course = newCourse.trim();
    student.email = (newEmail || "").trim();

    saveStudents(students);
}

// Delete student
function deleteStudent(roll) {
    const students = getStudents().filter(s => s.roll !== roll);
    saveStudents(students);
}

// ---------- Page code ----------

function currentSearch() {
    const box = document.getElementById("searchStudent");
    return box ? box.value : "";
}

function editStudent(roll) {
    const student = getStudents().find(s => s.roll === roll);
    if (!student) return;

    const newName = prompt("Student name:", student.name);
    if (newName === null) return;

    const newCourse = prompt("Course:", student.course);
    if (newCourse === null) return;

    const newEmail = prompt("Email:", student.email || "");
    if (newEmail === null) return;

    if (!newName.trim() || !newCourse.trim()) {
        alert("Name and course cannot be empty.");
        return;
    }

    updateStudent(roll, newName, newCourse, newEmail);
    renderStudents(currentSearch());
}

function renderStudents(filterText = "") {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    const text = filterText.trim().toLowerCase();

    const students = getStudents().filter(s =>
        String(s.roll).toLowerCase().includes(text) ||
        String(s.name).toLowerCase().includes(text)
    );

    tbody.innerHTML = "";

    if (students.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.textContent = "No students found.";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    students.forEach(student => {
        const row = document.createElement("tr");

        [student.roll, student.name, student.course, student.email || "-"]
            .forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

        const actionCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editStudent(student.roll));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            if (confirm("Delete " + student.name + "?")) {
                deleteStudent(student.roll);
                renderStudents(currentSearch());
            }
        });

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("addStudentButton");
    const searchBox = document.getElementById("searchStudent");

    if (addButton) {
        addButton.addEventListener("click", () => {
            const roll = document.getElementById("newRoll");
            const name = document.getElementById("newName");
            const course = document.getElementById("newCourse");
            const email = document.getElementById("newEmail");

            const added = addStudent(
                roll.value, name.value, course.value, email.value
            );

            if (added) {
                roll.value = "";
                name.value = "";
                course.value = "";
                email.value = "";
                renderStudents(currentSearch());
            }
        });
    }

    if (searchBox) {
        searchBox.addEventListener("input", () => {
            renderStudents(searchBox.value);
        });
    }

    renderStudents();
});