
function calculateDashboard() {

    const students = JSON.parse(
        localStorage.getItem("students")
    ) || [];

    const records = JSON.parse(
        localStorage.getItem("attendanceRecords")
    ) || [];

    const today = new Date();
    const date =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

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

console.log(calculateDashboard());
