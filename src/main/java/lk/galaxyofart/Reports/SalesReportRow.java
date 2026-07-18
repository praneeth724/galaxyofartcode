package lk.galaxyofart.Reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesReportRow {
    private String invoiceno;
    private String invoicedate;
    private String customerName;
    private Double total;
    private String paymethod;
    private String status;
}
