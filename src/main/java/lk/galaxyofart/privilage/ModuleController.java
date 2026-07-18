package lk.galaxyofart.privilage;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Marks the class as a Spring MVC controller, capable of handling incoming web requests.
// Bind the return value of a method directly to the web response body.
@RestController
public class ModuleController {

    @Autowired // Annotation for Generate DAO instance
    private ModuleRepository moduleDao;

    // Request get mapping for load all modules data [URL --> /modules/alldata]
    @GetMapping(value = "/module/alldata", produces = "application/json")
    public List <Modules> findAllData(){  //modules --> entity class eka
        return moduleDao.findAll(); 
    }

}
