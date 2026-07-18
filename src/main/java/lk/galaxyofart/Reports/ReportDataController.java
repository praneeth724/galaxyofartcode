package lk.galaxyofart.Reports;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.employee.Employee;
import lk.galaxyofart.employee.EmployeeRepository;
import lk.galaxyofart.grn.Grn;
import lk.galaxyofart.grn.GrnRepository;
import lk.galaxyofart.invoice.Invoice;
import lk.galaxyofart.invoice.InvoiceRepository;
import lk.galaxyofart.privilage.Privilage;

@RestController
public class ReportDataController {

    @Autowired
    private InvoiceRepository invoiceDao;

    @Autowired
    private GrnRepository grnDao;

    @Autowired
    private EmployeeRepository employeeDao;

    @Autowired
    private AuthController authController;

    private boolean canView() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "reports");
        return userPriv.getPrivi_select();
    }

    @GetMapping(value = "/reports/sales/data", produces = "application/json")
    public ReportResponse<SalesReportRow> getSalesReport(
            @RequestParam("from") String from, @RequestParam("to") String to) {

        if (!canView()) {
            return new ReportResponse<>(new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        }

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        List<Invoice> invoices = invoiceDao.getByDateRange(fromDate, toDate);

        double totalSales = invoices.stream().mapToDouble(i -> i.getTotal() != null ? i.getTotal() : 0).sum();
        long totalOrders = invoices.size();
        long totalCustomers = invoices.stream()
                .map(i -> i.getCustomer_id() != null ? i.getCustomer_id().getId() : null)
                .distinct().count();
        double avgOrderValue = totalOrders == 0 ? 0 : totalSales / totalOrders;

        List<KpiCard> kpis = List.of(
                new KpiCard("Total Sales", String.format("Rs. %,.2f", totalSales), "dollar-sign"),
                new KpiCard("Total Orders", String.valueOf(totalOrders), "clipboard-list"),
                new KpiCard("Total Customers", String.valueOf(totalCustomers), "users"),
                new KpiCard("Average Order Value", String.format("Rs. %,.2f", avgOrderValue), "arrow-trend-up")
        );

        List<SalesReportRow> rows = invoices.stream()
                .sorted(Comparator.comparing(Invoice::getInvoicedate))
                .map(i -> new SalesReportRow(
                        i.getInvoiceno(),
                        i.getInvoicedate() != null ? i.getInvoicedate().toString() : "",
                        i.getCustomer_id() != null ? i.getCustomer_id().getName() : "",
                        i.getTotal(),
                        i.getPaymethod(),
                        i.getStatus()))
                .collect(Collectors.toList());

        Map<String, Double> dailyTotals = new TreeMap<>();
        for (Invoice i : invoices) {
            if (i.getInvoicedate() == null) continue;
            String day = i.getInvoicedate().format(DateTimeFormatter.ofPattern("MM/dd"));
            dailyTotals.merge(day, i.getTotal() != null ? i.getTotal() : 0, Double::sum);
        }
        List<ChartPoint> chartSeries = dailyTotals.entrySet().stream()
                .map(e -> new ChartPoint(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        return new ReportResponse<>(kpis, rows, chartSeries);
    }

    @GetMapping(value = "/reports/purchase/data", produces = "application/json")
    public ReportResponse<PurchaseReportRow> getPurchaseReport(
            @RequestParam("from") String from, @RequestParam("to") String to) {

        if (!canView()) {
            return new ReportResponse<>(new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        }

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        List<Grn> grns = grnDao.getByDateRange(fromDate, toDate);

        double totalPurchases = grns.stream().mapToDouble(g -> g.getTotalamount() != null ? g.getTotalamount() : 0).sum();
        long totalPurchaseCount = grns.size();
        long totalSuppliers = grns.stream()
                .map(g -> g.getSupplier_id() != null ? g.getSupplier_id().getId() : null)
                .distinct().count();
        double avgPurchaseValue = totalPurchaseCount == 0 ? 0 : totalPurchases / totalPurchaseCount;

        List<KpiCard> kpis = List.of(
                new KpiCard("Total Purchases", String.format("Rs. %,.2f", totalPurchases), "dollar-sign"),
                new KpiCard("Total Purchases", String.valueOf(totalPurchaseCount), "clipboard-list"),
                new KpiCard("Total Suppliers", String.valueOf(totalSuppliers), "users"),
                new KpiCard("Average Purchase Value", String.format("Rs. %,.2f", avgPurchaseValue), "arrow-trend-up")
        );

        List<PurchaseReportRow> rows = grns.stream()
                .sorted(Comparator.comparing(Grn::getReceiveddate))
                .map(g -> new PurchaseReportRow(
                        g.getGrnno(),
                        g.getReceiveddate() != null ? g.getReceiveddate().toString() : "",
                        g.getSupplier_id() != null ? g.getSupplier_id().getName() : "",
                        g.getTotalamount(),
                        g.getPaymethod(),
                        g.getStatus()))
                .collect(Collectors.toList());

        Map<String, Double> dailyTotals = new TreeMap<>();
        for (Grn g : grns) {
            if (g.getReceiveddate() == null) continue;
            String day = g.getReceiveddate().format(DateTimeFormatter.ofPattern("MM/dd"));
            dailyTotals.merge(day, g.getTotalamount() != null ? g.getTotalamount() : 0, Double::sum);
        }
        List<ChartPoint> chartSeries = dailyTotals.entrySet().stream()
                .map(e -> new ChartPoint(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        return new ReportResponse<>(kpis, rows, chartSeries);
    }

    @GetMapping(value = "/reports/employee/data", produces = "application/json")
    public ReportResponse<EmployeeReportRow> getEmployeeReport(
            @RequestParam("from") String from, @RequestParam("to") String to) {

        if (!canView()) {
            return new ReportResponse<>(new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        }

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        List<Employee> employees = employeeDao.findAll().stream()
                .filter(e -> e.getAddeddatetime() != null
                        && !e.getAddeddatetime().toLocalDate().isBefore(fromDate)
                        && !e.getAddeddatetime().toLocalDate().isAfter(toDate))
                .collect(Collectors.toList());

        long totalEmployees = employees.size();
        long activeEmployees = employees.stream()
                .filter(e -> e.getEmployee_status_id() != null && "Active".equalsIgnoreCase(e.getEmployee_status_id().getName()))
                .count();
        long inactiveEmployees = totalEmployees - activeEmployees;
        long departments = employees.stream()
                .map(e -> e.getDesignation_table_id() != null ? e.getDesignation_table_id().getId() : null)
                .distinct().count();

        List<KpiCard> kpis = List.of(
                new KpiCard("Total Employees", String.valueOf(totalEmployees), "users"),
                new KpiCard("Active Employees", String.valueOf(activeEmployees), "user-check"),
                new KpiCard("Inactive Employees", String.valueOf(inactiveEmployees), "user-xmark"),
                new KpiCard("Departments", String.valueOf(departments), "building")
        );

        List<EmployeeReportRow> rows = employees.stream()
                .map(e -> new EmployeeReportRow(
                        e.getNumber(),
                        e.getFullname(),
                        e.getDesignation_table_id() != null ? e.getDesignation_table_id().getName() : "",
                        e.getDesignation_table_id() != null ? e.getDesignation_table_id().getName() : "",
                        e.getEmail(),
                        e.getMobilenumber(),
                        e.getEmployee_status_id() != null ? e.getEmployee_status_id().getName() : "",
                        e.getAddeddatetime() != null ? e.getAddeddatetime().toLocalDate().toString() : ""))
                .collect(Collectors.toList());

        Map<String, Long> deptCounts = employees.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDesignation_table_id() != null ? e.getDesignation_table_id().getName() : "Other",
                        Collectors.counting()));

        List<ChartPoint> chartSeries = deptCounts.entrySet().stream()
                .map(e -> new ChartPoint(e.getKey(), e.getValue().doubleValue()))
                .collect(Collectors.toList());

        return new ReportResponse<>(kpis, rows, chartSeries);
    }
}
