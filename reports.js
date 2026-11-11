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

function calculateAttendance() {
    const students = readList("students");
    const records = readList("attendanceRecords");

    return students.map(student => {
        const studentRecords = records.filter(
            record => record.roll === student.roll
        );

        const present = studentRecords.filter(
            record => record.status === "Present"
        ).length;

        const absent = studentRecords.filter(
            record => record.status === "Absent"
        ).length;

        const total = present + absent;

        const percentage = total > 0
            ? (present / total) * 100
            : 0;

        return {
            roll: student.roll,
            name: student.name,
            present: present,
            absent: absent,
            total: total,
            percentage: percentage.toFixed(2),
            status: percentage < 75
                ? "Below 75%"
                : "Eligible"
        };
    });
}

function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
}

function renderReports() {
    const students = readList("students");
    const records = readList("attendanceRecords");
    const today = getTodayDate();

    const todayRecords = records.filter(record => record.date === today);
    const presentToday = todayRecords.filter(r => r.status === "Present").length;
    const absentToday = todayRecords.filter(r => r.status === "Absent").length;

    const totalEl = document.getElementById("totalStudents");
    const presentEl = document.getElementById("presentCount");
    const absentEl = document.getElementById("absentCount");

    if (totalEl) totalEl.textContent = students.length;
    if (presentEl) presentEl.textContent = presentToday;
    if (absentEl) absentEl.textContent = absentToday;

    const tbody = document.getElementById("reportsTableBody");
    if (!tbody) return;

    tbody.replaceChildren();

    const report = calculateAttendance();

    if (report.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.textContent = "No students yet. Add students on the Students page.";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    report.forEach(item => {
        const row = document.createElement("tr");
        addCell(row, item.roll);
        addCell(row, item.name);
        addCell(row, item.present);
        addCell(row, item.absent);
        addCell(row, item.percentage + "%");
        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", renderReports);