// ==========================================
// WACF REPORTS SYSTEM
// PART 1
// ==========================================

// -------------------------
// VARIABLES
// -------------------------

let allMembers = [];
let presentMembers = [];
let absentMembers = [];
let currentView = "all";

// -------------------------
// ELEMENTS
// -------------------------

const reportDate = document.getElementById("reportDate");
const loadReportBtn = document.getElementById("loadReport");

const totalMembersText = document.getElementById("totalMembers");
const presentCountText = document.getElementById("presentCount");
const absentCountText = document.getElementById("absentCount");
const percentageText = document.getElementById("percentage");

const reportTable = document.getElementById("reportTable");

const allTab = document.getElementById("allTab");
const presentTab = document.getElementById("presentTab");
const absentTab = document.getElementById("absentTab");

const searchReport = document.getElementById("searchReport");

// ==========================================
// TODAY
// ==========================================

function today() {

    return new Date().toISOString().split("T")[0];

}

// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    reportDate.value = today();

    loadReportData();

});

// ==========================================
// LOAD BUTTON
// ==========================================

loadReportBtn.addEventListener("click", loadReportData);

// ==========================================
// LOAD REPORT
// ==========================================

async function loadReportData() {

    reportTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-8">
                Loading report...
            </td>
        </tr>
    `;

    const date = reportDate.value;

    // -------------------------
    // MEMBERS
    // -------------------------

    const { data: members, error: memberError } =
        await window.supabaseClient
        .from("members")
        .select("*")
        .order("full_name");

    if (memberError) {

        alert(memberError.message);

        return;

    }

    // -------------------------
    // ATTENDANCE
    // -------------------------

    const { data: attendance, error: attendanceError } =
        await window.supabaseClient
        .from("attendance")
        .select("member_id")
        .eq("attendance_date", date);

    if (attendanceError) {

        alert(attendanceError.message);

        return;

    }

    const presentIDs = attendance.map(item => item.member_id);

    allMembers = members.map(member => {

        return {

            ...member,

            status: presentIDs.includes(member.id)
                ? "Present"
                : "Absent"

        };

    });

    presentMembers = allMembers.filter(m => m.status === "Present");

    absentMembers = allMembers.filter(m => m.status === "Absent");

    // -------------------------
    // DASHBOARD CARDS
    // -------------------------

    totalMembersText.textContent = allMembers.length;

    presentCountText.textContent = presentMembers.length;

    absentCountText.textContent = absentMembers.length;

    let percent = 0;

    if (allMembers.length > 0) {

        percent = Math.round(

            (presentMembers.length / allMembers.length) * 100

        );

    }

    percentageText.textContent = percent + "%";

    currentView = "all";

    activateTab(allTab);

    displayMembers(allMembers);

}

// ==========================================
// DISPLAY TABLE
// ==========================================

function displayMembers(list) {

    reportTable.innerHTML = "";

    if (list.length === 0) {

        reportTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-10">
                    No records found.
                </td>
            </tr>
        `;

        return;

    }

    list.forEach(member => {

        reportTable.innerHTML += `

        <tr class="border-b hover:bg-gray-50">

            <td class="p-3">
                ${member.member_no}
            </td>

            <td class="p-3">
                ${member.full_name}
            </td>

            <td class="p-3">
                ${member.department || "-"}
            </td>

            <td class="p-3">
                ${member.level || "-"}
            </td>

            <td class="p-3">
                ${member.phone1 || "-"}
            </td>

            <td class="p-3">

                <span class="
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold

                    ${member.status === "Present"

                        ? "bg-green-100 text-green-700"

                        : "bg-red-100 text-red-700"}

                ">

                    ${member.status}

                </span>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// ACTIVE TAB
// ==========================================

function activateTab(tab) {

    [allTab, presentTab, absentTab].forEach(button => {

        if (button) {

            button.classList.remove("active");

        }

    });

    if (tab) {

        tab.classList.add("active");

    }

}

// ==========================================
// TAB EVENTS
// ==========================================

allTab.onclick = () => {

    currentView = "all";

    activateTab(allTab);

    displayMembers(allMembers);

};

presentTab.onclick = () => {

    currentView = "present";

    activateTab(presentTab);

    displayMembers(presentMembers);

};

absentTab.onclick = () => {

    currentView = "absent";

    activateTab(absentTab);

    displayMembers(absentMembers);

};

// ==========================================
// SEARCH
// ==========================================

searchReport.addEventListener("input", () => {

    let list = [];

    if (currentView === "all") {

        list = allMembers;

    } else if (currentView === "present") {

        list = presentMembers;

    } else {

        list = absentMembers;

    }

    const keyword = searchReport.value.toLowerCase().trim();

    if (keyword === "") {

        displayMembers(list);

        return;

    }

    const filtered = list.filter(member => {

        return (

            (member.member_no || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (member.full_name || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (member.department || "")
            .toLowerCase()
            .includes(keyword)

            ||

            String(member.level || "")
            .includes(keyword)

            ||

            (member.phone1 || "")
            .includes(keyword)

        );

    });

    displayMembers(filtered);

});
// ==========================================
// PRINT REPORT
// ==========================================

document.getElementById("printReport").addEventListener("click", printReport);

function printReport() {

    const date = reportDate.value;

    const win = window.open("", "_blank");

    win.document.write(`
    <html>

    <head>

    <title>Attendance Report</title>

    <style>

    body{
        font-family:Arial,sans-serif;
        padding:30px;
    }

    h1,h3{
        text-align:center;
        margin:5px;
    }

    table{
        width:100%;
        border-collapse:collapse;
        margin-top:20px;
    }

    th,td{
        border:1px solid #999;
        padding:10px;
        text-align:left;
    }

    th{
        background:#f3f3f3;
    }

    </style>

    </head>

    <body>

    <h1>WORD ASSEMBLY CAMPUS FELLOWSHIP</h1>

    <h3>Attendance Report</h3>

    <p><strong>Date:</strong> ${date}</p>

    <p>
    <strong>Total:</strong> ${allMembers.length}
    &nbsp;&nbsp;&nbsp;
    <strong>Present:</strong> ${presentMembers.length}
    &nbsp;&nbsp;&nbsp;
    <strong>Absent:</strong> ${absentMembers.length}
    </p>

    ${document.querySelector("table").outerHTML}

    </body>

    </html>
    `);

    win.document.close();

    win.focus();

    win.print();

}
// ==========================================
// EXPORT TO EXCEL
// ==========================================

document.getElementById("excelReport").addEventListener("click", exportExcel);

function exportExcel() {

    let data = [];

    if(currentView === "all"){

        data = allMembers;

    }

    if(currentView === "present"){

        data = presentMembers;

    }

    if(currentView === "absent"){

        data = absentMembers;

    }

    const rows = data.map(member=>({

        "Member No": member.member_no,

        "Full Name": member.full_name,

        "Department": member.department,

        "Level": member.level,

        "Phone": member.phone1,

        "Status": member.status

    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Attendance Report"
    );

    XLSX.writeFile(

        workbook,

        `Attendance_${reportDate.value}.xlsx`

    );

}