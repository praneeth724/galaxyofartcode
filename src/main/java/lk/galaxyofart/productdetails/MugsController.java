package lk.galaxyofart.productdetails;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MugsController {

    @Autowired
    private MugsRepository mugsDao;

    @GetMapping(value = "/mugs/alldata", produces = "application/json")
    public List<Mugs> getAllData() {
        return mugsDao.findAll();
    }
}
