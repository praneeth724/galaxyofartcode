package lk.galaxyofart.Reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KpiCard {
    private String label;
    private String value;
    private String icon; // font-awesome class suffix, e.g. "dollar-sign"
}
