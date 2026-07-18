window.addEventListener("load", () => {

    let today = new Date();
    let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    document.querySelector("#fromDate").value = firstDay.toISOString().split("T")[0];
    document.querySelector("#toDate").value = today.toISOString().split("T")[0];

    refreshReport();
});

function renderKpis(kpis) {
    let kpiRow = document.querySelector("#kpiRow");
    kpiRow.innerHTML = "";

    const icons = { "dollar-sign": "fa-sack-dollar", "clipboard-list": "fa-clipboard-list", "users": "fa-truck-field", "arrow-trend-up": "fa-arrow-trend-up" };

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
    let tbody = document.querySelector("#tableBodyPurchase");
    tbody.innerHTML = "";

    rows.forEach((row, index) => {
        let statusClass = row.status == "Received" || row.status == "Paid" ? "status-received" : "status-pending";
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${row.grnno || ""}</td>
                <td>${row.receiveddate || ""}</td>
                <td>${row.supplierName || ""}</td>
                <td>Rs. ${Number(row.totalamount || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                <td>${row.paymethod || ""}</td>
                <td><span class="status-pill ${statusClass}">${row.status || ""}</span></td>
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

    let report = getServiceRequest("/reports/purchase/data?from=" + from + "&to=" + to);

    renderKpis(report.kpis || []);
    renderTable(report.rows || []);
    drawLineChart(document.querySelector("#purchaseChart"), report.chartSeries || [], "#eb6834");
    return true;
}

// refreshes the on-screen report for the selected date range, then downloads it as a PDF
function generateReport() {

    if (!refreshReport()) {
        return;
    }

    let from = document.querySelector("#fromDate").value;
    let to = document.querySelector("#toDate").value;

    window.location.href = "/reports/purchase/pdf?from=" + from + "&to=" + to;
}
