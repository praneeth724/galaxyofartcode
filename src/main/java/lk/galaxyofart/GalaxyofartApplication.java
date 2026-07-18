package lk.galaxyofart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;

@SpringBootApplication
@RestController  // if you add @RequestMapping, you should add @RestController. Otherwise, won't work (Implement karana mapping serverlet container ekata add wenne meken)
public class GalaxyofartApplication {

	public static void main(String[] args) {
		SpringApplication.run(GalaxyofartApplication.class, args);
		System.out.println(".............start application.............");
	}

	// create simple mapping
	@RequestMapping("/")
	public String indexPage() {
		return "<h2>Hello World</h2>";
	}

	// create mapping for url [/test]
	@RequestMapping("/test")
	public ModelAndView testPage() {
		ModelAndView testUi = new ModelAndView();
		testUi.setViewName("test.html");

		return testUi;
	}

}
