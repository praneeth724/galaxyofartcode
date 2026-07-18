package lk.galaxyofart.privilage;

import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lk.galaxyofart.AuthController;

// Marks the class as a Spring MVC controller, capable of handling incoming web requests.
// Bind the return value of a method directly to the web response body.
@RestController
public class RolesController {

    @Autowired // Annotation for Generate instance
    private RolesRepository rolesRepository;

    @Autowired
    private AuthController authcontroller;

    // Request Get mapping for load all roles data [URL --> /roles/alldata]
   // @GetMapping(value = "/roles/alldata", produces = "application/json")     
    //public List<Roles> findAllData(){
       // return rolesRepository.findAll();
    //}

    // Get mapping for load filtered roles data from DB [ URL -> /roles/alldatawithoutadmin ]
    @GetMapping(value="/roles/alldatawithoutadmin", produces = "application/json")
    public List<Roles> getRolesWithoutAdmin(){
        return rolesRepository.getAllDataWithoutAdmin();
    }

    @GetMapping(value="/roles/byuser/{userId}", produces = "application/json")
    public List<Roles> getRolesByUserId(@PathVariable(name = "userId")Integer userId){
        return rolesRepository.getRolesByUserId(userId);
    }

    // @RequestBody = Can get values from POST body
    // Post mapping for insert roles data [ URL -> /roles/insert ]
    @PostMapping(value = "/roles/insert")
    public String saveRoleData(@RequestBody Roles rolesEntity) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // check what specific privileges (permissions) the user has for the module
        Privilage userPrivilage = authcontroller.getPrivilageByUserAndModule(auth.getName(), "roles");

        if (userPrivilage.getPrivi_insert()) {
            try {
                // Save Operator
                rolesRepository.save(rolesEntity);

                return "OK"; // Indicates successful save.
            } catch (Exception e) {
                // Catches any exceptions that occur during the save process and returns an error message.
                return "Save not completed..!" + e.getMessage();
            }
        }else{
            // returns a permission denied message.
            return "Save not completed. You have no permissions..!";
        }
    }
    
}
