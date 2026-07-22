window.addEventListener("load", () => {

    let summary = getServiceRequest("/dashboard/summary");

    const money = (v) => "Rs. " + Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

    document.getElementById("currentMonthEarnings").innerText = money(summary.currentMonthEarnings);
    document.getElementById("currentMonthSales").innerText = summary.currentMonthSales || 0;

    document.getElementById("totalSalesAllTime").innerText = money(summary.totalSalesAllTime);
    document.getElementById("totalPurchasesAllTime").innerText = money(summary.totalPurchasesAllTime);
    document.getElementById("totalCustomers").innerText = summary.totalCustomers || 0;
    document.getElementById("totalSuppliers").innerText = summary.totalSuppliers || 0;

    let totalProducts = (summary.totalArtProducts || 0) + (summary.totalStatueProducts || 0) + (summary.totalMugProducts || 0);
    const pct = (n) => totalProducts > 0 ? Math.round((n / totalProducts) * 100) + "%" : "0%";
    const share = (n) => totalProducts > 0 ? (n / totalProducts) * 100 : 0;

    document.getElementById("statuePercent").innerText = pct(summary.totalStatueProducts);
    document.getElementById("mugPercent").innerText = pct(summary.totalMugProducts);
    document.getElementById("artPercent").innerText = pct(summary.totalArtProducts);

    // build the Products by Type circle from the real counts instead of a fixed gradient
    const statueShare = share(summary.totalStatueProducts);
    const mugShare = share(summary.totalMugProducts);
    const trafficCircle = document.querySelector(".traffic-circle");
    if (trafficCircle) {
        if (totalProducts > 0) {
            trafficCircle.style.background = "conic-gradient(" +
                "#dd659d 0% " + statueShare + "%, " +
                "#6a5cff " + statueShare + "% " + (statueShare + mugShare) + "%, " +
                "#af6133 " + (statueShare + mugShare) + "% 100%)";
        } else {
            trafficCircle.style.background = "conic-gradient(#dcdcdc 0% 100%)";
        }
    }

    document.getElementById("revenueLast10Days").innerText = money(summary.revenueLast10Days);
    document.getElementById("newCustomersLast10Days").innerText = summary.newCustomersLast10Days || 0;
    document.getElementById("pendingInvoices").innerText = summary.pendingInvoices || 0;
    document.getElementById("lowStockItems").innerText = summary.lowStockItems || 0;

    // revenue trend bar chart, built from the last 7 days of real invoice totals
    let trendLabels = summary.revenueTrendLabels || [];
    let trendValues = summary.revenueTrendValues || [];
    let maxValue = Math.max(...trendValues, 1);

    let trackEl = document.getElementById("revenueTrendChart");
    let labelsEl = document.getElementById("revenueTrendLabels");

    trendValues.forEach((value, index) => {
        let heightPct = Math.max((value / maxValue) * 100, 2);
        let isToday = index === trendValues.length - 1;

        let bar = document.createElement("div");
        bar.className = "bar-chart-bar" + (isToday ? " is-today" : "");
        bar.style.height = heightPct + "%";
        bar.title = trendLabels[index] + ": " + money(value);

        let valueTag = document.createElement("span");
        valueTag.className = "bar-value";
        valueTag.innerText = value > 0 ? Math.round(value).toLocaleString() : "";
        bar.appendChild(valueTag);

        trackEl.appendChild(bar);

        let label = document.createElement("span");
        label.innerText = trendLabels[index];
        labelsEl.appendChild(label);
    });

});
