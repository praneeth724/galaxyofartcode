package lk.galaxyofart.Reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeReportRow {
    private String number;
    private String fullname;
    private String department;
    private String position;
    private String email;
    private String mobilenumber;
    private String status;
    private String joindate;
}
