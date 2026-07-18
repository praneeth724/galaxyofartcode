package lk.galaxyofart.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.CommonController;
import lk.galaxyofart.privilage.Privilage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

// Marks the class as a Spring MVC controller, capable of handling incoming web requests.
// Bind the return value of a method directly to the web response body.
@RestController
public class UserController implements CommonController<User> { // .....

	@Autowired // Annotation for create instance of reposotory file
	private UserRepository userDao; // ......

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private AuthController authcontroller;

	// Request mapping for load user UI [URL --> /user]...........
	@RequestMapping(value = "/user", method = RequestMethod.GET) // ....
	public ModelAndView getUserUI() { // .....

		// Retrieves the 'Authentication' object from the Spring SecurityContextHolder.
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Creates a new ModelAndView object
		ModelAndView userUI = new ModelAndView(); // .......
		userUI.addObject("loggedusername", authentication.getName()); // ...

		// Sets the name of the view (HTML template)
		userUI.setViewName("15.user.html"); // ..

		return userUI; // ......
	}

	// data genna gnna mapping [ URL -> /user/byid?id= ]
	@GetMapping(value = "/user/byid", params = { "id" }, produces = "application/json") // ...
	public User getRolesByUserId(@RequestParam("id") Integer id) { // ...
		return userDao.getReferenceById(id); // ...
	}

	// Request get mapping for load all user data [URL --> /user/alldata].......
	@GetMapping(value = "/user/alldata", produces = "application/json")
	@Override
	// type should be LIST <Entity class name>
	public List<User> getAllData() {

		// Check authentication and authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilage privilage = authcontroller.getPrivilageByUserAndModule(auth.getName(),
				"User");

		if (privilage.getPrivi_select()) {
			return userDao.getSelectedColumn();
		} else {
			return new ArrayList<>();
		}

	}

	// create delete mapping for delete givenemployee .............................
	@DeleteMapping(value = "/user/delete")
	@Override
	public String deleteData(@RequestBody User user) {

		// 1. need to check log user privilage
		// 1. need to check log user privilage
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Privilage userPriv = authcontroller.getPrivilageByUserAndModule(authentication.getName(),
				"user");
		if (!userPriv.getPrivi_delete()) {
			return "Delete Not Completed..! : You Haven't Any Permission..!";
		}

		// 2. need to chek data existances or data duplicate
		User extUser = userDao.getReferenceById(user.getId());
		if (extUser == null) {
			return "Delete Not Completed..! : " + user.getUsername() + "Given Record is Not Available..!";
		}

		// 3. use try catch
		try {

			// 1.do operation
			// userRepository.delete(user);
			// user.setStatus("false"); // wena wena task walata user sambanda wenna puln
			// nisa user delete krnne na
			userDao.save(user);

			// 2.dependanceses check

			return "OK";
		} catch (Exception e) {
			return "Delete Not Complete..! :" + e.getMessage();
		}

	}

	// Request Post mapping for insert user data [ URL -> /user/insert..............
	@PostMapping(value = "/user/save")
	@Override
	public String saveData(@RequestBody User user) {

		// Check logged user authorization

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Privilage userPriv = authcontroller.getPrivilageByUserAndModule(authentication.getName(), "user");
		if (!userPriv.getPrivi_insert()) {
			return "Save Not Completed..! : You Haven't Any Permission..!";
		}

		// Duplicate check

		// Email duplicate check
		User extUserBYEmail = userDao.getByUseremail(user.getUseremail());
		if (extUserBYEmail != null) {
			return "Save Not Completed..! : Given Email Allready Exists ..!";
		}

		// employee duplicate check
		if (user.getEmployee_table_id() != null) {
			User extUserByEmployee = userDao.getByEmployee_id(user.getEmployee_table_id().getId());
			if (extUserByEmployee != null) {
				return "Save Not Completed..! : Given Employee Allready Exists ..!";
			}
		}

		try {

			// add auto set values
			user.setAddeddatetime(LocalDateTime.now());
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

			// Save Operator
			userDao.save(user);

			return "OK"; // No errors
		} catch (Exception e) {
			// Return error with exception
			return "Save Not Completed..! " + e.getMessage();
		}

	}

	// Request Update mapping for user data [ URL -> /user/update].........
	@PutMapping(value = "/user/update")
	@Override
	public String updateData(@RequestBody User user) {

		// Check logged user authorization
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Privilage userPriv = authcontroller.getPrivilageByUserAndModule(authentication.getName(), "user");
		if (!userPriv.getPrivi_update()) {
			return "Update Not Completed..! : You Haven't Any Permission..!";
		}

		// need to check duplicetes

		// username check
		User extUser = userDao.getReferenceById(user.getId());
		if (extUser == null) {
			return "Update Not Completed..! : " + user.getUsername() + " is Not Available ..!";
		}

		// Email duplicate check
		User extUserByEmail = userDao.getByUseremail(user.getUseremail());
		if (extUserByEmail != null && !extUserByEmail.getId().equals(extUser.getId())) {
			return "Update Not Completed..! : Given Email Allready Exist ..!";
		}

		// emp id check
		if (user.getEmployee_table_id() != null) {
			User extUserByEmployee = userDao.getByEmployee_id(user.getEmployee_table_id().getId());
			if (extUserByEmployee != null && !extUserByEmployee.getId().equals(extUser.getId())) {
				return "Update Not Completed..! : Employee Allready Exist ..!";
			}
		}

		try {
			// Set auto added values for columns
			// Set updated date time
			user.setUpdateddatetime(LocalDateTime.now());

			// Save Operator
			userDao.save(user);

			// dependances

			return "OK"; // Indicates successful save.
		} catch (Exception e) {
			// Catches any exceptions that occur during the save process and returns an
			// error message
			return "Update Not Completed..! :" + e.getMessage();
		}
	}

}
