package lk.galaxyofart;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import lk.galaxyofart.User.User;
import lk.galaxyofart.User.UserRepository;
import lk.galaxyofart.privilage.Modules;
import lk.galaxyofart.privilage.ModuleRepository;
import lk.galaxyofart.privilage.Privilage;
import lk.galaxyofart.privilage.PrivilageRepository;
import lk.galaxyofart.privilage.Roles;
import lk.galaxyofart.privilage.RolesRepository;
import lk.galaxyofart.productdetails.Mugs;
import lk.galaxyofart.productdetails.MugsRepository;
import lk.galaxyofart.productdetails.Statues;
import lk.galaxyofart.productdetails.StatuesRepository;
import lk.galaxyofart.employee.Designation;
import lk.galaxyofart.employee.DesignationRepository;
import lk.galaxyofart.employee.Employeestatus;
import lk.galaxyofart.employee.EmployeeStatusRepository;

@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private PrivilageRepository privilageRepository;

    @Autowired
    private MugsRepository mugsRepository;

    @Autowired
    private StatuesRepository statuesRepository;

    @Autowired
    private DesignationRepository designationRepository;

    @Autowired
    private EmployeeStatusRepository employeeStatusRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private static final String[] DESIGNATIONS = { "Manager", "Assistant Manager", "Cashier", "Artist", "Supplier" };
    private static final String[] EMPLOYEE_STATUSES = { "Active", "Inactive", "On Leave", "Terminated" };

    // Statue/mug lookup values, migrated from the hard-coded client-side arrays
    // that used to be duplicated across 2.product.js / 6.purchaseorder.js /
    // 8.payment.js / 10.production.js
    private static final String[][] STATUES = {
            {"Buddha Large White", "S15597"}, {"Buddha Large Black", "S15598"},
            {"Buddha Small White", "S14497"}, {"Buddha Small Black", "S14498"},
            {"Buddha Large Coloured", "S15599"}, {"Buddha Small Coloured", "S14499"},
            {"Jesus Large White", "S25597"}, {"Jesus Large Black", "S25598"},
            {"Jesus Small White", "S24497"}, {"Jesus Small Black", "S24498"},
            {"Jesus Large Coloured", "S25599"}, {"Jesus Small Coloured", "S24499"},
            {"Ganesh Large White", "S35597"}, {"Ganesh Large Black", "S35598"},
            {"Ganesh Small White", "S34497"}, {"Ganesh Small Black", "S34498"},
            {"Ganesh Large Coloured", "S35599"}, {"Ganesh Small Coloured", "S34499"},
            {"Paththini Large White", "S45597"}, {"Paththini Large Black", "S45598"},
            {"Paththini Small White", "S44497"}, {"Paththini Small Black", "S44498"},
            {"Paththini Large Coloured", "S45599"}, {"Paththini Small Coloured", "S44499"}
    };

    private static final String[][] MUGS = {
            {"Mug Large White", "M5597"}, {"Mug Large Black", "M5598"},
            {"Mug Small White", "M4497"}, {"Mug Small Black", "M4498"}
    };

    // Module names, exactly as passed into AuthController.getPrivilageByUserAndModule(...)
    // across every controller in the app.
    private static final String[] ALL_MODULES = {
            "employee", "user", "privilage", "roles", "artistsupplierdetails", "customerdetails",
            "product", "inventory", "supplierpricerequest", "quotation", "purchaseorder", "grn",
            "artistsupplierpayment", "invoice", "production", "reports"
    };

    // Which modules each role gets full CRUD on, mirroring WebConfiguration's
    // per-path hasAnyAuthority() groupings (route-level access is already gated
    // there; this grants matching button-level select/insert/update/delete).
    private static final Map<String, List<String>> ROLE_MODULES = Map.of(
            "Admin", List.of(ALL_MODULES),
            "GeneralManager", List.of(ALL_MODULES),
            "InventoryManager", List.of("inventory"),
            "ProductionManager", List.of("product", "production"),
            "ManagmentAssistant", List.of("artistsupplierdetails", "customerdetails", "product",
                    "supplierpricerequest", "quotation", "inventory", "purchaseorder",
                    "artistsupplierpayment", "invoice"),
            "cashier", List.of("product", "inventory", "purchaseorder", "artistsupplierpayment", "invoice")
    );

    @Override
    public void run(String... args) throws Exception {

        String[][] seedData = {
            {"Admin",              "admin",              "admin@gmail.com"},
            {"GeneralManager",     "generalmanager",     "generalmanager@gmail.com"},
            {"InventoryManager",   "inventorymanager",   "inventorymanager@gmail.com"},
            {"ProductionManager",  "productionmanager",  "productionmanager@gmail.com"},
            {"ManagmentAssistant", "managmentassistant", "managmentassistant@gmail.com"},
            {"cashier",            "cashier",            "cashier@gmail.com"}
        };

        String defaultPassword = "12345";

        System.out.println("========== DATA SEEDER STARTING ==========");

        // Seed statue/mug lookup values
        if (statuesRepository.count() == 0) {
            for (String[] s : STATUES) {
                Statues statue = new Statues();
                statue.setName(s[0]);
                statue.setCode(s[1]);
                statuesRepository.save(statue);
            }
            System.out.println("[SEEDER] Statue lookup values seeded: " + STATUES.length);
        }
        if (mugsRepository.count() == 0) {
            for (String[] m : MUGS) {
                Mugs mug = new Mugs();
                mug.setName(m[0]);
                mug.setCode(m[1]);
                mugsRepository.save(mug);
            }
            System.out.println("[SEEDER] Mug lookup values seeded: " + MUGS.length);
        }

        // Seed employee designation/status lookup values
        if (designationRepository.count() == 0) {
            for (String name : DESIGNATIONS) {
                Designation designation = new Designation();
                designation.setName(name);
                designationRepository.save(designation);
            }
            System.out.println("[SEEDER] Designations seeded: " + DESIGNATIONS.length);
        }
        if (employeeStatusRepository.count() == 0) {
            for (String name : EMPLOYEE_STATUSES) {
                Employeestatus status = new Employeestatus();
                status.setName(name);
                employeeStatusRepository.save(status);
            }
            System.out.println("[SEEDER] Employee statuses seeded: " + EMPLOYEE_STATUSES.length);
        }

        // Seed modules first (Privilage rows below depend on these existing)
        for (String moduleName : ALL_MODULES) {
            Modules module = moduleRepository.findAll().stream()
                    .filter(m -> m.getName().equalsIgnoreCase(moduleName))
                    .findFirst().orElse(null);
            if (module == null) {
                module = new Modules();
                module.setName(moduleName);
                moduleRepository.save(module);
                System.out.println("[SEEDER] Module created: " + moduleName);
            }
        }

        for (String[] entry : seedData) {
            String roleName = entry[0];
            String username = entry[1];
            String email    = entry[2];

            // Create role if not exists
            Roles role = rolesRepository.getByName(roleName);
            if (role == null) {
                role = new Roles();
                role.setName(roleName);
                role = rolesRepository.save(role);
                System.out.println("[SEEDER] Role created: " + roleName);
            }

            // Create user if not exists
            User existingUser = userRepository.getByUsername(username);
            if (existingUser == null) {
                User user = new User();
                user.setUsername(username);
                user.setPassword(bCryptPasswordEncoder.encode(defaultPassword));
                user.setUseremail(email);
                user.setStatus(Boolean.TRUE);
                user.setAddeddatetime(LocalDateTime.now());

                Set<Roles> roleSet = new HashSet<>();
                roleSet.add(role);
                user.setRoles(roleSet);

                userRepository.save(user);
                System.out.println("[SEEDER] User created: " + username + " | password: " + defaultPassword + " | role: " + roleName);
            } else {
                System.out.println("[SEEDER] Already exists: " + username);
            }

            // Seed full CRUD privilege for every module this role should reach
            List<String> allowedModules = ROLE_MODULES.getOrDefault(roleName, List.of());
            for (String moduleName : allowedModules) {
                Modules module = moduleRepository.findAll().stream()
                        .filter(m -> m.getName().equalsIgnoreCase(moduleName))
                        .findFirst().orElse(null);
                if (module == null) {
                    continue;
                }
                Privilage existing = privilageRepository.getByRoleModule(role.getId(), module.getId());
                if (existing == null) {
                    Privilage privilage = new Privilage();
                    privilage.setRoles_table_id(role);
                    privilage.setModule_table_id(module);
                    privilage.setPrivi_select(Boolean.TRUE);
                    privilage.setPrivi_insert(Boolean.TRUE);
                    privilage.setPrivi_update(Boolean.TRUE);
                    privilage.setPrivi_delete(Boolean.TRUE);
                    privilage.setAddeddatetime(LocalDateTime.now());
                    privilageRepository.save(privilage);
                }
            }
        }

        System.out.println("========== DATA SEEDER DONE ==========");
    }
}
