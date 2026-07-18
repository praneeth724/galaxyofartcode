package lk.galaxyofart.employee;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.privilage.Privilage;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class EmployeeController {

    @Autowired // create an object of employeeDao
    private EmployeeRepository employeeDao;

    @Autowired
    private AuthController authController;

    // create mapping for return employee ui URL [/employee]
    @RequestMapping("employee")
    public ModelAndView employeePage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // must include in all
                                                                                                // controllers
        ModelAndView employeeUI = new ModelAndView();
        employeeUI.addObject("loggedusername", authentication.getName()); // must include in all controllers
        employeeUI.setViewName("13.employee.html");

        return employeeUI;
    }

    // Create get mapping for get employee object by given id (path variable)
    // [url/employee/byid/1]
    /**
     * @GetMapping(value = "/employee/byid/{empid}", produces = "application/json")
     *                   public Employee getEmployeeById(@PathVariable("empid")
     *                   Integer empid) {
     *                   return employeeDao.getReferenceById(empid);
     *                   }
     **/

    // Create get mapping for get employee object by given id (reqst param)
    // [url/employee/byid?id= ]
    @GetMapping(value = "/employee/byid", params = { "id" }, produces = "application/json")
    public Employee getEmployeeByIdQP(@RequestParam("id") Integer id) {
        return employeeDao.getReferenceById(id);
    }

    // create mapping for get all emp data URL [/employee/list]
    @RequestMapping(value = "/employee/alldata", method = RequestMethod.GET, produces = "application/json")
    public List<Employee> getAllEmployeesData() {
        // return employeeDao.findAll();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "employee");
        if (userPriv.getPrivi_select()) {
            return employeeDao.getSelectedColumn();
        } else {
            return new ArrayList<>();
        }
    }

    // create delete mapping for delete givenemployee
    @DeleteMapping(value = "/employee/delete")
    public String deleteEmployee(@RequestBody Employee employee) {

        // 1. need to check log user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "employee");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        // 2. need to chek data existances or data duplicate
        Employee extEmployee = employeeDao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Delete Not Completed..! :" + employee.getFullname() + "is Not Available..!";
        }

        // 3. use try catch
        try {

            // 1.do operation
            employeeDao.delete(employee);

            // 2.dependanceses check

            return "OK";

        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }

    }

    // create post mapping for save given employee object
    @PostMapping(value = "/employee/save")
    public String saveEmployee(@RequestBody Employee employee) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "employee");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        // 2.need to check data existance or data duplicate

        // nic duplicate cheking
        Employee extEmployeeByNic = employeeDao.getByNic(employee.getNic());
        if (extEmployeeByNic != null) {
            return "Save Not Completed..! : Given NIC Allready Exist ..!";
        }

        // Mno duplicatr checking
        Employee extEmployeeByMobile = employeeDao.getByMobilenumber(employee.getMobilenumber());
        if (extEmployeeByMobile != null) {
            return "Save Not Completed..! : Given Mobile No Allready Exist ..!";
        }

        // email duplicate checking
        Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
        if (extEmployeeByEmail != null) {
            return "Save Not Completed..! : Given Email Allready Exist ..!";
        }

        // 3.try catch
        try {

            // add auto set values
            employee.setAddeddatetime(LocalDateTime.now());
            // employee.setNumber("000002");
            employee.setNumber(employeeDao.getNextNumber());

            // do operation
            employeeDao.save(employee);

            // dependanceses check

            return "OK";
            
        } catch (Exception e) {
            // handle exception
            return "Save Not Completed..!" + employee.getFullname();
        }

    }

    // create mapping for update employee record
    @PutMapping(value = "/employee/update")
    public String updateEmployee(@RequestBody Employee employee) {

        // 1.need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "employee");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        // 2.need to check data existance
        Employee extEmployee = employeeDao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Update Not Completed..! :" + employee.getFullname() + " is Not Available ..!";
        }

        // 3.check duplicate
        Employee extEmployeeByNic = employeeDao.getByNic(employee.getNic());
        // already nic thiynwa . thamma or wena knk. thnmanm ok. wena knk nm errro mg
        // enwa
        if (extEmployeeByNic != null && !extEmployeeByNic.getId().equals(extEmployee.getId())) {
            return "Save Not Completed..! : Given NIC Allready Exist ..!";
        }

        // 4.try catch
        try {
            // add auto set values
            employee.setUpdatedatetime(LocalDateTime.now());

            // do operation
            employeeDao.save(employee);

            // dependanceses check
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + employee.getFullname();
        }

    }
}
