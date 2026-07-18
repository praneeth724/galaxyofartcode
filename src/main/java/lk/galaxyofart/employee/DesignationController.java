package lk.galaxyofart.employee;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
public class DesignationController {

    @Autowired
    private DesignationRepository designationDao;

    // create get mapping for get designation all data url [designation/alldata] - for test
    @GetMapping(value = "/designation/alldata", produces = "application/json")
    public List<Designation> getAllData() {
        return designationDao.findAll();
    }

}
