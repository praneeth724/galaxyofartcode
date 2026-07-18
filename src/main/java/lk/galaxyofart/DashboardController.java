package lk.galaxyofart;

import java.time.LocalDate;
import java.time.YearMonth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.galaxyofart.artistsupplierdetails.AsdetailsRepository;
import lk.galaxyofart.customerdetails.CustomerRepository;
import lk.galaxyofart.grn.GrnRepository;
import lk.galaxyofart.inventory.InventoryRepository;
import lk.galaxyofart.invoice.InvoiceRepository;
import lk.galaxyofart.productdetails.ProductsRepository;

@RestController
public class DashboardController {

    @Autowired
    private InvoiceRepository invoiceDao;

    @Autowired
    private GrnRepository grnDao;

    @Autowired
    private ProductsRepository productsDao;

    @Autowired
    private CustomerRepository customerDao;

    @Autowired
    private AsdetailsRepository asdetailsDao;

    @Autowired
    private InventoryRepository inventoryDao;

    @GetMapping(value = "/dashboard/summary", produces = "application/json")
    public DashboardSummary getSummary() {

        YearMonth currentMonth = YearMonth.now();
        LocalDate today = LocalDate.now();
        LocalDate tenDaysAgo = today.minusDays(10);

        var invoices = invoiceDao.findAll();
        var grns = grnDao.findAll();
        var products = productsDao.findAll();
        var customers = customerDao.findAll();

        double currentMonthEarnings = invoices.stream()
                .filter(i -> i.getInvoicedate() != null && YearMonth.from(i.getInvoicedate()).equals(currentMonth))
                .mapToDouble(i -> i.getTotal() != null ? i.getTotal() : 0)
                .sum();

        long currentMonthSales = invoices.stream()
                .filter(i -> i.getInvoicedate() != null && YearMonth.from(i.getInvoicedate()).equals(currentMonth))
                .count();

        long totalArt = products.stream().filter(p -> "art".equalsIgnoreCase(p.getProducttype())).count();
        long totalStatue = products.stream().filter(p -> "statue".equalsIgnoreCase(p.getProducttype())).count();
        long totalMug = products.stream().filter(p -> "mug".equalsIgnoreCase(p.getProducttype())).count();

        double totalSalesAllTime = invoices.stream().mapToDouble(i -> i.getTotal() != null ? i.getTotal() : 0).sum();
        double totalPurchasesAllTime = grns.stream().mapToDouble(g -> g.getTotalamount() != null ? g.getTotalamount() : 0).sum();

        double revenueLast10Days = invoices.stream()
                .filter(i -> i.getInvoicedate() != null && !i.getInvoicedate().isBefore(tenDaysAgo))
                .mapToDouble(i -> i.getTotal() != null ? i.getTotal() : 0)
                .sum();

        long newCustomersLast10Days = customers.stream()
                .filter(c -> c.getAddeddatetime() != null && !c.getAddeddatetime().toLocalDate().isBefore(tenDaysAgo))
                .count();

        long pendingInvoices = invoices.stream().filter(i -> "Pending".equalsIgnoreCase(i.getStatus())).count();

        long lowStockItems = inventoryDao.findAll().stream()
                .filter(inv -> inv.getAvailable() != null && inv.getRop() != null && inv.getAvailable() <= inv.getRop())
                .count();

        return new DashboardSummary(
                currentMonthEarnings, currentMonthSales,
                totalArt, totalStatue, totalMug,
                (long) customers.size(),
                (long) asdetailsDao.findByType("supplier").size(),
                totalSalesAllTime, totalPurchasesAllTime,
                revenueLast10Days, newCustomersLast10Days,
                pendingInvoices, lowStockItems);
    }
}
