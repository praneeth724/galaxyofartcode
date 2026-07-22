package lk.galaxyofart;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummary {
    private Double currentMonthEarnings;
    private Long currentMonthSales;
    private Long totalArtProducts;
    private Long totalStatueProducts;
    private Long totalMugProducts;
    private Long totalCustomers;
    private Long totalSuppliers;
    private Double totalSalesAllTime;
    private Double totalPurchasesAllTime;
    private Double revenueLast10Days;
    private Long newCustomersLast10Days;
    private Long pendingInvoices;
    private Long lowStockItems;
    private List<String> revenueTrendLabels;
    private List<Double> revenueTrendValues;
}
