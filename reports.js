
function calculateAttendance() {

    const students = JSON.parse(
        localStorage.getItem("students")
    ) || [];

    const records = JSON.parse(
        localStorage.getItem("attendanceRecords")
    ) || [];

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
