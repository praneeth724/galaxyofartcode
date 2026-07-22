package lk.galaxyofart.productdetails;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import lk.galaxyofart.AuthController;
import lk.galaxyofart.privilage.Privilage;

@RestController
public class ProductsController {

    @Autowired
    private ProductsRepository productsDao;

    @Autowired
    private AuthController authController;

    @RequestMapping("product")
    public ModelAndView productPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView productUI = new ModelAndView();
        productUI.addObject("loggedusername", authentication.getName());
        productUI.setViewName("2.productdetails.html");
        return productUI;
    }

    @GetMapping(value = "/product/byid", params = { "id" }, produces = "application/json")
    public Products getProductByIdQP(@RequestParam("id") Integer id) {
        return productsDao.getReferenceById(id);
    }

    @GetMapping(value = "/product/alldata", produces = "application/json")
    public List<Products> getAllData(@RequestParam(value = "type", required = false) String type) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "product");

        if (!userPriv.getPrivi_select()) {
            return new ArrayList<>();
        }

        if (type != null && !type.isEmpty()) {
            return productsDao.getSelectedColumnByType(type);
        }
        return productsDao.getSelectedColumn();
    }

    @DeleteMapping(value = "/product/delete")
    public String deleteProduct(@RequestBody Products product) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "product");
        if (!userPriv.getPrivi_delete()) {
            return "Delete Not Completed..! : You Haven't Any Permission..!";
        }

        Products extProduct = productsDao.getReferenceById(product.getId());
        if (extProduct == null) {
            return "Delete Not Completed..! :" + product.getName() + " is Not Available..!";
        }

        try {
            productsDao.delete(product);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed..! :" + e.getMessage();
        }
    }

    @PostMapping(value = "/product/uploadimage")
    public ResponseEntity<String> uploadProductImage(@RequestParam("file") MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "product");
        if (!userPriv.getPrivi_insert()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Upload Not Completed..! : You Haven't Any Permission..!");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Upload Not Completed..! : No File Selected..!");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : "";
        String storedName = UUID.randomUUID().toString() + extension;

        try {
            Path uploadDir = Paths.get("uploads", "products");
            Files.createDirectories(uploadDir);
            file.transferTo(uploadDir.resolve(storedName));
            return ResponseEntity.ok("/uploads/products/" + storedName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload Not Completed..! : " + e.getMessage());
        }
    }

    @PostMapping(value = "/product/save")
    public String saveProduct(@RequestBody Products product) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "product");
        if (!userPriv.getPrivi_insert()) {
            return "Save Not Completed..! : You Haven't Any Permission..!";
        }

        Products extByItemcode = productsDao.getByItemcode(product.getItemcode());
        if (extByItemcode != null) {
            return "Save Not Completed..! : Given Item Code Already Exists ..!";
        }

        try {
            product.setAddeddatetime(LocalDateTime.now());
            productsDao.save(product);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed..!" + e.getMessage();
        }
    }

    @PutMapping(value = "/product/update")
    public String updateProduct(@RequestBody Products product) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Privilage userPriv = authController.getPrivilageByUserAndModule(authentication.getName(), "product");
        if (!userPriv.getPrivi_update()) {
            return "Update Not Completed..! : You Haven't Any Permission..!";
        }

        Products extProduct = productsDao.getReferenceById(product.getId());
        if (extProduct == null) {
            return "Update Not Completed..! :" + product.getName() + " is Not Available ..!";
        }

        Products extByItemcode = productsDao.getByItemcode(product.getItemcode());
        if (extByItemcode != null && !extByItemcode.getId().equals(product.getId())) {
            return "Update Not Completed..! : Given Item Code Already Exists ..!";
        }

        try {
            product.setUpdatedatetime(LocalDateTime.now());
            productsDao.save(product);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed..! :" + e.getMessage();
        }
    }
}
