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

    document.getElementById("statuePercent").innerText = pct(summary.totalStatueProducts);
    document.getElementById("mugPercent").innerText = pct(summary.totalMugProducts);
    document.getElementById("artPercent").innerText = pct(summary.totalArtProducts);

    document.getElementById("revenueLast10Days").innerText = money(summary.revenueLast10Days);
    document.getElementById("newCustomersLast10Days").innerText = summary.newCustomersLast10Days || 0;
    document.getElementById("pendingInvoices").innerText = summary.pendingInvoices || 0;
    document.getElementById("lowStockItems").innerText = summary.lowStockItems || 0;

});
