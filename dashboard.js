function readList(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function getTodayDate() {
    const today = new Date();
    return (
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0")
    );
}

function calculateDashboard() {
    const students = readList("students");
    const records = readList("attendanceRecords");
    const date = getTodayDate();

    const todayRecords = records.filter(
        record => record.date === date
    );

    const present = todayRecords.filter(
        record => record.status === "Present"
    ).length;

    const absent = todayRecords.filter(
        record => record.status === "Absent"
    ).length;

    return {
        totalStudents: students.length,
        present: present,
        absent: absent
    };
}

function renderDashboard() {
    const stats = calculateDashboard();

    const totalEl = document.getElementById("totalStudents");
    const presentEl = document.getElementById("presentToday");
    const absentEl = document.getElementById("absentToday");

    if (totalEl) totalEl.textContent = stats.totalStudents;
    if (presentEl) presentEl.textContent = stats.present;
    if (absentEl) absentEl.textContent = stats.absent;

    const tbody = document.getElementById("dashboardTableBody");
    if (!tbody) return;

    tbody.replaceChildren();

    const students = readList("students");

    if (students.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.textContent = "No students yet. Add students on the Students page.";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    students.forEach(student => {
        const row = document.createElement("tr");

        [student.roll, student.name, student.course]
            .forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", renderDashboard);