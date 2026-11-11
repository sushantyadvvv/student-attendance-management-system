
const students = [
    { roll: "101", name: "Rahul Sharma" },
    { roll: "102", name: "Priya Verma" },
    { roll: "103", name: "Aman Singh" },
    { roll: "104", name: "Neha Gupta" },
    { roll: "105", name: "Arjun Kumar" }
];

const dateInput = document.getElementById("attendanceDate");
const table = document.getElementById("attendanceTable");
const recordsTable = document.getElementById("recordsTable");
const message = document.getElementById("message");

const today = new Date();
const localDate =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

dateInput.value = localDate;

function getRecords() {
    try {
        const records = JSON.parse(
            localStorage.getItem("attendanceRecords") || "[]"
        );
        return Array.isArray(records) ? records : [];
    } catch {
        return [];
    }
}

function renderStudents() {
    table.replaceChildren();

    const saved = getRecords().filter(
        record => record.date === dateInput.value
    );

    students.forEach(student => {
        const existing = saved.find(
            record => record.roll === student.roll
        );

        const row = document.createElement("tr");

        const rollCell = document.createElement("td");
        rollCell.textContent = student.roll;

        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        const statusCell = document.createElement("td");
        const select = document.createElement("select");
        select.dataset.roll = student.roll;
        select.setAttribute("aria-label", "Attendance for " + student.name);

        [
            ["", "Select status"],
            ["Present", "Present"],
            ["Absent", "Absent"]
        ].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            select.appendChild(option);
        });

        select.value = existing ? existing.status : "";
        statusCell.appendChild(select);

        row.append(rollCell, nameCell, statusCell);
        table.appendChild(row);
    });
}

function renderRecords() {
    recordsTable.replaceChildren();

    getRecords()
        .filter(record => record.date === dateInput.value)
        .forEach(record => {
            const row = document.createElement("tr");

            [record.date, record.roll, record.name, record.status]
                .forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

            recordsTable.appendChild(row);
        });
}

document.getElementById("markAllButton").addEventListener("click", () => {
    table.querySelectorAll("select").forEach(select => {
        select.value = "Present";
    });
    message.textContent = "All students marked Present. Save to confirm.";
});

document.getElementById("saveButton").addEventListener("click", () => {
    const selects = [...table.querySelectorAll("select")];

    if (!dateInput.value) {
        message.textContent = "Please select a date.";
        return;
    }

    if (selects.some(select => !select.value)) {
        message.textContent = "Please select a status for every student.";
        return;
    }

    const records = getRecords();
    const date = dateInput.value;

    const newRecords = students.map(student => {
        const select = selects.find(
            item => item.dataset.roll === student.roll
        );

        return {
            date,
            roll: student.roll,
            name: student.name,
            status: select.value
        };
    });

    const otherRecords = records.filter(
        record => record.date !== date
    );

    try {
        localStorage.setItem(
            "attendanceRecords",
            JSON.stringify([...otherRecords, ...newRecords])
        );

        message.textContent = "Attendance saved successfully!";
        renderStudents();
        renderRecords();
    } catch {
        message.textContent = "Could not save attendance. Check browser storage.";
    }
});

dateInput.addEventListener("change", () => {
    message.textContent = "";
    renderStudents();
    renderRecords();
});

renderStudents();
renderRecords();
