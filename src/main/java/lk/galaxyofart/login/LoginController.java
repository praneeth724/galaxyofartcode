package lk.galaxyofart.login;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

// Marks the class as a Spring MVC controller, capable of handling incoming web requests.
// Bind the return value of a method directly to the web response body.
@RestController
public class LoginController {

    // create mappping for return login ui url [/login]
    @RequestMapping("/login")
    public ModelAndView loginPage() {
        ModelAndView loginUI = new ModelAndView();
        loginUI.setViewName("login.html");

        return loginUI;
    }

    // create mapping for return dashbrd ui url [/dashboard]
    @RequestMapping("/dashboard")
    public ModelAndView dashboardPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView dashboardUI = new ModelAndView();
        dashboardUI.addObject("loggedusername",authentication.getName() ); //log wena kenge nama genwagnwa
        dashboardUI.setViewName("dashboard.html");

        return dashboardUI;
    }

    // create mapping for return errorpage ui url [/errorpage]
    @RequestMapping("/errorpage")
    public ModelAndView errorpage() {
        ModelAndView errorUI = new ModelAndView();
        errorUI.setViewName("errorpage.html");

        return errorUI;
    }
}
