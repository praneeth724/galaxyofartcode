package lk.galaxyofart.productdetails;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatuesController {

    @Autowired
    private StatuesRepository statuesDao;

    @GetMapping(value = "/statues/alldata", produces = "application/json")
    public List<Statues> getAllData() {
        return statuesDao.findAll();
    }
}
