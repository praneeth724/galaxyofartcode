package lk.galaxyofart.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
public class EmployeeStatusController {

    @Autowired
    private EmployeeStatusRepository employeeStatusRepository;


    //create get mapping for get employee status alldata [/employeestatus/alldata]
    @GetMapping(value = "/employeestatus/alldata", produces = "application/json")
    public List<Employeestatus> getAllData() {
        return employeeStatusRepository.findAll();
    }

}
