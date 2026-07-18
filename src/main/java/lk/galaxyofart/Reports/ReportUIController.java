package lk.galaxyofart.Reports;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    @RequestMapping("reports/sales")
    public ModelAndView salesReportPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("16.salesreport.html");
        return ui;
    }

    @RequestMapping("reports/purchase")
    public ModelAndView purchaseReportPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("17.purchasereport.html");
        return ui;
    }

    @RequestMapping("reports/employee")
    public ModelAndView employeeReportPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView ui = new ModelAndView();
        ui.addObject("loggedusername", authentication.getName());
        ui.setViewName("18.employeereport.html");
        return ui;
    }
}
