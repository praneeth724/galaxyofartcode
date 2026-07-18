package lk.galaxyofart.Reports;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponse<T> {
    private List<KpiCard> kpis;
    private List<T> rows;
    private List<ChartPoint> chartSeries;
}
