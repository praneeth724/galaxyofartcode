package lk.galaxyofart.Reports;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.privilage.Privilage;

// Downloadable PDF versions of the three /reports/*/data endpoints in
// ReportDataController - same query logic, rendered as a table instead of JSON.
@RestController
public class ReportPdfController {

    private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("dd MMM yyyy");

    @Autowired
    private ReportDataController reportDataController;

    @Autowired
    private AuthController authController;

    private boolean canView() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "reports");
        return userPriv.getPrivi_select();
    }

    @GetMapping("/reports/sales/pdf")
    public ResponseEntity<byte[]> salesReportPdf(@RequestParam("from") String from, @RequestParam("to") String to) {
        if (!canView()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ReportResponse<SalesReportRow> report = reportDataController.getSalesReport(from, to);
        String[] headers = { "#", "Invoice No", "Date", "Customer", "Total Amount", "Payment Method", "Status" };
        float[] widths = { 0.5f, 1.6f, 1.3f, 2.2f, 1.6f, 1.6f, 1.2f };

        byte[] pdf = buildPdf("Sales Report", from, to, report.getKpis(), headers, widths,
                report.getRows().stream().map(r -> new String[] {
                        r.getInvoiceno(), r.getInvoicedate(), r.getCustomerName(),
                        formatMoney(r.getTotal()), r.getPaymethod(), r.getStatus()
                }).toList());

        return pdfResponse(pdf, "sales-report_" + from + "_to_" + to + ".pdf");
    }

    @GetMapping("/reports/purchase/pdf")
    public ResponseEntity<byte[]> purchaseReportPdf(@RequestParam("from") String from, @RequestParam("to") String to) {
        if (!canView()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ReportResponse<PurchaseReportRow> report = reportDataController.getPurchaseReport(from, to);
        String[] headers = { "#", "GRN No", "Date", "Supplier", "Total Amount", "Payment Method", "Status" };
        float[] widths = { 0.5f, 1.6f, 1.3f, 2.2f, 1.6f, 1.6f, 1.2f };

        byte[] pdf = buildPdf("Purchase Report", from, to, report.getKpis(), headers, widths,
                report.getRows().stream().map(r -> new String[] {
                        r.getGrnno(), r.getReceiveddate(), r.getSupplierName(),
                        formatMoney(r.getTotalamount()), r.getPaymethod(), r.getStatus()
                }).toList());

        return pdfResponse(pdf, "purchase-report_" + from + "_to_" + to + ".pdf");
    }

    @GetMapping("/reports/employee/pdf")
    public ResponseEntity<byte[]> employeeReportPdf(@RequestParam("from") String from, @RequestParam("to") String to) {
        if (!canView()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ReportResponse<EmployeeReportRow> report = reportDataController.getEmployeeReport(from, to);
        String[] headers = { "#", "Number", "Full Name", "Designation", "Email", "Mobile", "Status", "Joined" };
        float[] widths = { 0.5f, 1f, 1.8f, 1.5f, 2.2f, 1.4f, 1f, 1.2f };

        byte[] pdf = buildPdf("Employee Report", from, to, report.getKpis(), headers, widths,
                report.getRows().stream().map(r -> new String[] {
                        r.getNumber(), r.getFullname(), r.getDepartment(),
                        r.getEmail(), r.getMobilenumber(), r.getStatus(), r.getJoindate()
                }).toList());

        return pdfResponse(pdf, "employee-report_" + from + "_to_" + to + ".pdf");
    }

    private String formatMoney(Double value) {
        return String.format("Rs. %,.2f", value != null ? value : 0.0);
    }

    private ResponseEntity<byte[]> pdfResponse(byte[] pdf, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    private byte[] buildPdf(String title, String from, String to, List<KpiCard> kpis,
            String[] headers, float[] widths, List<String[]> rows) {
        try {
            Document document = new Document(PageSize.A4.rotate(), 30, 30, 40, 40);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Font.ITALIC, Color.DARK_GRAY);
            Font kpiLabelFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, Color.GRAY);
            Font kpiValueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13);
            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Font.NORMAL, Color.WHITE);
            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

            Paragraph titlePara = new Paragraph("Galaxy of Art - " + title, titleFont);
            titlePara.setAlignment(Element.ALIGN_CENTER);
            document.add(titlePara);

            Paragraph sub = new Paragraph(
                    "Period: " + LocalDate.parse(from).format(DISPLAY_DATE) + "  -  "
                            + LocalDate.parse(to).format(DISPLAY_DATE)
                            + "      Generated: " + LocalDate.now().format(DISPLAY_DATE),
                    subFont);
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingAfter(16);
            document.add(sub);

            if (kpis != null && !kpis.isEmpty()) {
                PdfPTable kpiTable = new PdfPTable(kpis.size());
                kpiTable.setWidthPercentage(100);
                kpiTable.setSpacingAfter(16);
                for (KpiCard kpi : kpis) {
                    PdfPCell cell = new PdfPCell();
                    cell.setPadding(8);
                    cell.setBackgroundColor(new Color(0xf4, 0xf4, 0xf2));
                    Paragraph p = new Paragraph();
                    p.add(new Phrase(kpi.getLabel() + "\n", kpiLabelFont));
                    p.add(new Phrase(kpi.getValue(), kpiValueFont));
                    cell.addElement(p);
                    kpiTable.addCell(cell);
                }
                document.add(kpiTable);
            }

            PdfPTable table = new PdfPTable(widths);
            table.setWidthPercentage(100);

            Color headerBg = new Color(0x11, 0x18, 0x27);
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headFont));
                cell.setBackgroundColor(headerBg);
                cell.setPadding(6);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            int index = 1;
            for (String[] row : rows) {
                PdfPCell indexCell = new PdfPCell(new Phrase(String.valueOf(index++), cellFont));
                indexCell.setPadding(5);
                table.addCell(indexCell);
                for (String value : row) {
                    PdfPCell cell = new PdfPCell(new Phrase(value != null ? value : "", cellFont));
                    cell.setPadding(5);
                    table.addCell(cell);
                }
            }

            if (rows.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("No records found for the selected date range.", cellFont));
                empty.setColspan(headers.length);
                empty.setPadding(10);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(empty);
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }
}
