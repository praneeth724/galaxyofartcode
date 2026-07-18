// fixed categorical order, per the dataviz skill's validated palette
const CATEGORICAL_COLORS = ["#2a78d6", "#008300", "#e87ba4", "#eda100", "#1baf7a", "#eb6834", "#4a3aa7", "#e34948"];

window.addEventListener("load", () => {

    let today = new Date();
    let firstDay = new Date(today.getFullYear() - 5, today.getMonth(), 1);
    document.querySelector("#fromDate").value = firstDay.toISOString().split("T")[0];
    document.querySelector("#toDate").value = today.toISOString().split("T")[0];

    refreshReport();
});

function renderKpis(kpis) {
    let kpiRow = document.querySelector("#kpiRow");
    kpiRow.innerHTML = "";

    const icons = { "users": "fa-users", "user-check": "fa-user-check", "user-xmark": "fa-user-xmark", "building": "fa-building" };

    kpis.forEach(kpi => {
        kpiRow.innerHTML += `
            <div class="col-6 col-lg-3">
                <div class="kpi-card d-flex align-items-center gap-3">
                    <div class="kpi-icon"><i class="fa-solid ${icons[kpi.icon] || 'fa-circle'}"></i></div>
                    <div>
                        <div class="kpi-label">${kpi.label}</div>
                        <div class="kpi-value">${kpi.value}</div>
                    </div>
                </div>
            </div>`;
    });
}

function renderTable(rows) {
    let tbody = document.querySelector("#tableBodyEmployee");
    tbody.innerHTML = "";

    rows.forEach((row, index) => {
        let statusClass = row.status == "Active" ? "status-active" : "status-inactive";
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${row.number || ""}</td>
                <td>${row.fullname || ""}</td>
                <td>${row.department || ""}</td>
                <td>${row.email || ""}</td>
                <td>${row.mobilenumber || ""}</td>
                <td><span class="status-pill ${statusClass}">${row.status || ""}</span></td>
                <td>${row.joindate || ""}</td>
            </tr>`;
    });
}

function refreshReport() {

    let from = document.querySelector("#fromDate").value;
    let to = document.querySelector("#toDate").value;

    if (!from || !to) {
        swal("Please Select Both Dates..!", "", "warning");
        return false;
    }

    let report = getServiceRequest("/reports/employee/data?from=" + from + "&to=" + to);

    renderKpis(report.kpis || []);
    renderTable(report.rows || []);
    drawDonutChart(
        document.querySelector("#employeeChart"),
        report.chartSeries || [],
        CATEGORICAL_COLORS,
        document.querySelector("#employeeLegend")
    );
    return true;
}

// refreshes the on-screen report for the selected date range, then downloads it as a PDF
function generateReport() {

    if (!refreshReport()) {
        return;
    }

    let from = document.querySelector("#fromDate").value;
    let to = document.querySelector("#toDate").value;

    window.location.href = "/reports/employee/pdf?from=" + from + "&to=" + to;
}
