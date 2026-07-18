package lk.galaxyofart;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lk.galaxyofart.artistsupplierdetails.Asdetails;
import lk.galaxyofart.artistsupplierdetails.AsdetailsRepository;
import lk.galaxyofart.customerdetails.Customer;
import lk.galaxyofart.customerdetails.CustomerRepository;
import lk.galaxyofart.employee.Designation;
import lk.galaxyofart.employee.DesignationRepository;
import lk.galaxyofart.employee.Employee;
import lk.galaxyofart.employee.EmployeeRepository;
import lk.galaxyofart.employee.EmployeeStatusRepository;
import lk.galaxyofart.employee.Employeestatus;
import lk.galaxyofart.grn.Grn;
import lk.galaxyofart.grn.GrnRepository;
import lk.galaxyofart.inventory.Inventory;
import lk.galaxyofart.inventory.InventoryRepository;
import lk.galaxyofart.invoice.Invoice;
import lk.galaxyofart.invoice.InvoiceRepository;
import lk.galaxyofart.payment.ArtistPayment;
import lk.galaxyofart.payment.ArtistPaymentRepository;
import lk.galaxyofart.pricerequest.SupplierPriceRequest;
import lk.galaxyofart.pricerequest.SupplierPriceRequestRepository;
import lk.galaxyofart.production.Production;
import lk.galaxyofart.production.ProductionRepository;
import lk.galaxyofart.productdetails.Mugs;
import lk.galaxyofart.productdetails.MugsRepository;
import lk.galaxyofart.productdetails.Products;
import lk.galaxyofart.productdetails.ProductsRepository;
import lk.galaxyofart.productdetails.Statues;
import lk.galaxyofart.productdetails.StatuesRepository;
import lk.galaxyofart.purchaseorder.PurchaseOrder;
import lk.galaxyofart.purchaseorder.PurchaseOrderRepository;
import lk.galaxyofart.quotation.Quotation;
import lk.galaxyofart.quotation.QuotationRepository;

/**
 * Seeds sample transactional data (artists/suppliers, products, inventory,
 * customers, invoices, sourcing pipeline, payments, employees, production
 * jobs) so the dashboard and report pages have something to show without
 * manually entering every row by hand. Runs after DataSeeder (which seeds
 * the lookup tables, roles and users this depends on) and only fires once,
 * guarded on the artistsupplierdetails table being empty.
 */
@Component
@Order(2)
public class DemoDataSeeder implements CommandLineRunner {

    @Autowired
    private AsdetailsRepository asdetailsRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private StatuesRepository statuesRepository;

    @Autowired
    private MugsRepository mugsRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private SupplierPriceRequestRepository supplierPriceRequestRepository;

    @Autowired
    private QuotationRepository quotationRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private GrnRepository grnRepository;

    @Autowired
    private ArtistPaymentRepository artistPaymentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DesignationRepository designationRepository;

    @Autowired
    private EmployeeStatusRepository employeeStatusRepository;

    @Autowired
    private ProductionRepository productionRepository;

    @Override
    public void run(String... args) throws Exception {

        boolean alreadySeeded = asdetailsRepository.findAll().stream()
                .anyMatch(a -> "nimal.perera@example.com".equalsIgnoreCase(a.getEmail()));
        if (alreadySeeded) {
            System.out.println("[DEMO SEEDER] Skipped - demo data already present.");
            return;
        }

        System.out.println("========== DEMO DATA SEEDER STARTING ==========");

        List<Asdetails> artists = seedArtists();
        List<Asdetails> suppliers = seedSuppliers();
        List<Products> products = seedProducts();
        seedInventory(products);
        List<Customer> customers = seedCustomers();
        seedInvoices(customers, products);
        List<SupplierPriceRequest> priceRequests = seedSupplierPriceRequests(suppliers, products);
        List<Quotation> quotations = seedQuotations(priceRequests, suppliers, products);
        List<PurchaseOrder> purchaseOrders = seedPurchaseOrders(quotations, suppliers, products);
        seedGrns(purchaseOrders, suppliers);
        seedArtistPayments(artists, products);
        seedEmployees();
        seedProduction(products);

        System.out.println("========== DEMO DATA SEEDER DONE ==========");
    }

    private List<Asdetails> seedArtists() {
        String[][] rows = {
                { "Nimal Perera", "912345678V", "nimal.perera@example.com", "0771234567", "art" },
                { "Sithara Fernando", "923456789V", "sithara.f@example.com", "0772345678", "art" },
                { "Kasun Jayasuriya", "934567890V", "kasun.j@example.com", "0773456789", "art" },
        };
        List<Asdetails> saved = new ArrayList<>();
        int i = 0;
        for (String[] r : rows) {
            Asdetails a = new Asdetails();
            a.setType("artist");
            a.setName(r[0]);
            a.setNic(r[1]);
            a.setEmail(r[2]);
            a.setContact(r[3]);
            a.setProducttype(r[4]);
            a.setBeneficiary(r[0]);
            a.setBank("Bank of Ceylon");
            a.setAccount("00812345" + (67 + i));
            a.setAddress("Colombo, Sri Lanka");
            a.setAddeddatetime(LocalDateTime.now().minusDays(60 - i * 5));
            saved.add(asdetailsRepository.save(a));
            i++;
        }
        System.out.println("[DEMO SEEDER] Artists seeded: " + saved.size());
        return saved;
    }

    private List<Asdetails> seedSuppliers() {
        String[][] rows = {
                { "Lanka Statue House", "supplier1@example.com", "0761112233", "statue" },
                { "Ceylon Craft Supplies", "supplier2@example.com", "0762223344", "statue" },
                { "Golden Mug Traders", "supplier3@example.com", "0763334455", "mug" },
        };
        List<Asdetails> saved = new ArrayList<>();
        int i = 0;
        for (String[] r : rows) {
            Asdetails a = new Asdetails();
            a.setType("supplier");
            a.setName(r[0]);
            a.setEmail(r[1]);
            a.setContact(r[2]);
            a.setProducttype(r[3]);
            a.setBeneficiary(r[0]);
            a.setBank("Commercial Bank");
            a.setAccount("00998877" + (10 + i));
            a.setBrn("BRN00" + (100 + i));
            a.setAddress("Kandy, Sri Lanka");
            a.setAddeddatetime(LocalDateTime.now().minusDays(55 - i * 5));
            saved.add(asdetailsRepository.save(a));
            i++;
        }
        System.out.println("[DEMO SEEDER] Suppliers seeded: " + saved.size());
        return saved;
    }

    private List<Products> seedProducts() {
        List<Products> saved = new ArrayList<>();
        List<Statues> statueLookups = statuesRepository.findAll();
        List<Mugs> mugLookups = mugsRepository.findAll();

        String[][] arts = {
                { "Sunset Over Sigiriya", "ART-0001", "Oil Painting", "12500" },
                { "Village Life", "ART-0002", "Watercolour Painting", "8500" },
                { "Elephant Family", "ART-0003", "Pencil Art", "6200" },
                { "Kandyan Dancer", "ART-0004", "Pastel Painting", "9800" },
        };
        for (String[] r : arts) {
            Products p = new Products();
            p.setProducttype("art");
            p.setName(r[0]);
            p.setItemcode(r[1]);
            p.setMedium(r[2]);
            p.setArtdescription("Handmade " + r[2].toLowerCase() + " titled '" + r[0] + "'.");
            p.setPrice(Double.valueOf(r[3]));
            p.setAddeddatetime(LocalDateTime.now().minusDays(40));
            saved.add(productsRepository.save(p));
        }

        for (int i = 0; i < Math.min(4, statueLookups.size()); i++) {
            Statues s = statueLookups.get(i);
            Products p = new Products();
            p.setProducttype("statue");
            p.setName(s.getName());
            p.setItemcode(s.getCode());
            p.setStatue_id(s);
            p.setPrice(4500.0 + (i * 750));
            p.setAddeddatetime(LocalDateTime.now().minusDays(38));
            saved.add(productsRepository.save(p));
        }

        for (int i = 0; i < mugLookups.size(); i++) {
            Mugs m = mugLookups.get(i);
            Products p = new Products();
            p.setProducttype("mug");
            p.setName(m.getName());
            p.setItemcode(m.getCode());
            p.setMug_id(m);
            p.setPrice(1200.0 + (i * 150));
            p.setAddeddatetime(LocalDateTime.now().minusDays(36));
            saved.add(productsRepository.save(p));
        }

        System.out.println("[DEMO SEEDER] Products seeded: " + saved.size());
        return saved;
    }

    private void seedInventory(List<Products> products) {
        int i = 0;
        for (Products p : products) {
            Inventory inv = new Inventory();
            inv.setProduct_id(p);
            int total = 20 + (i * 3);
            int damaged = i % 3;
            // make every 4th item low-stock so the dashboard's "Low Stock Items" KPI is non-zero
            int available = (i % 4 == 0) ? 2 : total - damaged - 5;
            inv.setTotal(total);
            inv.setDamaged(damaged);
            inv.setAvailable(available);
            inv.setRop(5);
            inv.setRoq(15);
            inv.setAddeddatetime(LocalDateTime.now().minusDays(30 - i));
            inventoryRepository.save(inv);
            i++;
        }
        System.out.println("[DEMO SEEDER] Inventory rows seeded: " + products.size());
    }

    private List<Customer> seedCustomers() {
        String[][] rows = {
                { "Amaya Silva", "0711112222", "amaya.s@example.com", "3" },
                { "Ruwan Bandara", "0712223333", "ruwan.b@example.com", "7" },
                { "Dilani Wickramasinghe", "0713334444", "dilani.w@example.com", "9" },
                { "Tharindu Gunasekara", "0714445555", "tharindu.g@example.com", "18" },
                { "Nadeesha Rathnayake", "0715556666", "nadeesha.r@example.com", "25" },
                { "Chamara Kumarasinghe", "0716667777", "chamara.k@example.com", "42" },
        };
        List<Customer> saved = new ArrayList<>();
        for (String[] r : rows) {
            Customer c = new Customer();
            c.setName(r[0]);
            c.setContact(r[1]);
            c.setEmail(r[2]);
            c.setAddress("Colombo, Sri Lanka");
            c.setAddeddatetime(LocalDateTime.now().minusDays(Long.parseLong(r[3])));
            saved.add(customerRepository.save(c));
        }
        System.out.println("[DEMO SEEDER] Customers seeded: " + saved.size());
        return saved;
    }

    private void seedInvoices(List<Customer> customers, List<Products> products) {
        int[] daysAgo = { 1, 2, 4, 6, 8, 15, 20, 27 };
        String[] statuses = { "Paid", "Paid", "Pending", "Paid", "Pending", "Paid", "Paid", "Pending" };
        int count = Math.min(daysAgo.length, customers.size());

        for (int i = 0; i < count; i++) {
            Customer customer = customers.get(i % customers.size());
            Products product = products.get(i % products.size());
            int quantity = 1 + (i % 3);
            double price = product.getPrice() != null ? product.getPrice() : 5000.0;
            double discount = (i % 4 == 0) ? price * 0.05 : 0.0;
            double total = (price * quantity) - discount;
            boolean paid = "Paid".equals(statuses[i]);

            Invoice invoice = new Invoice();
            invoice.setCustomer_id(customer);
            invoice.setProduct_id(product);
            invoice.setInvoiceno(String.format("INV-%04d", i + 1));
            invoice.setInvoicedate(LocalDate.now().minusDays(daysAgo[i]));
            invoice.setQuantity(quantity);
            invoice.setPrice(price);
            invoice.setDiscount(discount);
            invoice.setTotal(total);
            invoice.setPaymethod(i % 2 == 0 ? "Cash" : "Card");
            invoice.setPayamount(paid ? total : total / 2);
            invoice.setBalance(paid ? 0.0 : total - (total / 2));
            invoice.setStatus(statuses[i]);
            invoice.setAddeddatetime(LocalDateTime.now().minusDays(daysAgo[i]));
            invoiceRepository.save(invoice);
        }
        System.out.println("[DEMO SEEDER] Invoices seeded: " + count);
    }

    private List<SupplierPriceRequest> seedSupplierPriceRequests(List<Asdetails> suppliers, List<Products> products) {
        List<SupplierPriceRequest> saved = new ArrayList<>();
        String[] statuses = { "Responded", "Responded", "Pending", "Rejected" };
        for (int i = 0; i < statuses.length; i++) {
            Asdetails supplier = suppliers.get(i % suppliers.size());
            Products product = products.get((i + 4) % products.size());

            SupplierPriceRequest req = new SupplierPriceRequest();
            req.setSupplier_id(supplier);
            req.setProduct_id(product);
            req.setPrice(product.getPrice() != null ? product.getPrice() * 0.6 : 3000.0);
            req.setQuantity(10 + (i * 5));
            req.setRequestid(String.format("PR-%04d", i + 1));
            req.setRequestdate(LocalDate.now().minusDays(35 - (i * 5)));
            req.setStatus(statuses[i]);
            req.setAddeddatetime(LocalDateTime.now().minusDays(35 - (i * 5)));
            saved.add(supplierPriceRequestRepository.save(req));
        }
        System.out.println("[DEMO SEEDER] Supplier price requests seeded: " + saved.size());
        return saved;
    }

    private List<Quotation> seedQuotations(List<SupplierPriceRequest> priceRequests, List<Asdetails> suppliers,
            List<Products> products) {
        List<Quotation> saved = new ArrayList<>();
        String[] statuses = { "Approved", "Approved", "Pending" };
        for (int i = 0; i < statuses.length; i++) {
            SupplierPriceRequest req = priceRequests.get(i % priceRequests.size());
            Asdetails supplier = suppliers.get(i % suppliers.size());
            Products product = products.get((i + 4) % products.size());

            Quotation q = new Quotation();
            q.setPricerequest_id(req);
            q.setSupplier_id(supplier);
            q.setProduct_id(product);
            q.setQuotationid(String.format("QT-%04d", i + 1));
            q.setRequestdate(LocalDate.now().minusDays(30 - (i * 5)));
            q.setDeadline(LocalDate.now().minusDays(20 - (i * 5)));
            q.setPrice(req.getPrice());
            q.setDiscount(i == 0 ? 200.0 : 0.0);
            q.setQuantity(req.getQuantity());
            q.setStatus(statuses[i]);
            q.setAddeddatetime(LocalDateTime.now().minusDays(30 - (i * 5)));
            saved.add(quotationRepository.save(q));
        }
        System.out.println("[DEMO SEEDER] Quotations seeded: " + saved.size());
        return saved;
    }

    private List<PurchaseOrder> seedPurchaseOrders(List<Quotation> quotations, List<Asdetails> suppliers,
            List<Products> products) {
        List<PurchaseOrder> saved = new ArrayList<>();
        String[] statuses = { "Received", "Approved", "Pending" };
        for (int i = 0; i < statuses.length; i++) {
            Quotation quotation = quotations.get(i % quotations.size());
            Asdetails supplier = suppliers.get(i % suppliers.size());
            Products product = products.get((i + 4) % products.size());

            PurchaseOrder po = new PurchaseOrder();
            po.setQuotation_id(quotation);
            po.setSupplier_id(supplier);
            po.setProduct_id(product);
            po.setOrderid(String.format("PO-%04d", i + 1));
            po.setOrderdate(LocalDate.now().minusDays(25 - (i * 5)));
            po.setRequireddate(LocalDate.now().minusDays(10 - (i * 5)));
            po.setQuantity(quotation.getQuantity());
            po.setTotal((quotation.getPrice() != null ? quotation.getPrice() : 3000.0)
                    * (quotation.getQuantity() != null ? quotation.getQuantity() : 10));
            po.setStatus(statuses[i]);
            po.setAddeddatetime(LocalDateTime.now().minusDays(25 - (i * 5)));
            saved.add(purchaseOrderRepository.save(po));
        }
        System.out.println("[DEMO SEEDER] Purchase orders seeded: " + saved.size());
        return saved;
    }

    private void seedGrns(List<PurchaseOrder> purchaseOrders, List<Asdetails> suppliers) {
        int[] daysAgo = { 3, 9, 16 };
        String[] statuses = { "Paid", "Received", "Pending" };
        int count = Math.min(daysAgo.length, purchaseOrders.size());
        for (int i = 0; i < count; i++) {
            PurchaseOrder po = purchaseOrders.get(i);
            Asdetails supplier = suppliers.get(i % suppliers.size());

            Grn grn = new Grn();
            grn.setPurchaseorder_id(po);
            grn.setSupplier_id(supplier);
            grn.setGrnno(String.format("GRN-%04d", i + 1));
            grn.setOrderdate(po.getOrderdate());
            grn.setReceiveddate(LocalDate.now().minusDays(daysAgo[i]));
            grn.setReceivedquantity(po.getQuantity());
            grn.setDamagedquantity(i == 1 ? 1 : 0);
            grn.setTotalamount(po.getTotal());
            grn.setPaymethod(i % 2 == 0 ? "Bank Transfer" : "Cheque");
            grn.setStatus(statuses[i]);
            grn.setAddeddatetime(LocalDateTime.now().minusDays(daysAgo[i]));
            grnRepository.save(grn);
        }
        System.out.println("[DEMO SEEDER] GRNs seeded: " + count);
    }

    private void seedArtistPayments(List<Asdetails> artists, List<Products> products) {
        int[] daysAgo = { 5, 12, 22 };
        String[] payStatuses = { "Paid", "Paid", "Pending" };
        int count = Math.min(daysAgo.length, artists.size());
        for (int i = 0; i < count; i++) {
            Asdetails artist = artists.get(i);
            Products product = products.get(i % Math.min(4, products.size()));
            double price = product.getPrice() != null ? product.getPrice() : 8000.0;
            int quantity = 1 + i;
            double total = price * quantity;
            double commissionRate = 20.0;
            double payable = total * (commissionRate / 100);
            boolean paid = "Paid".equals(payStatuses[i]);

            ArtistPayment payment = new ArtistPayment();
            payment.setArtist_id(artist);
            payment.setProduct_id(product);
            payment.setCommissiontype("Percentage");
            payment.setCommissionrate(commissionRate);
            payment.setPrice(price);
            payment.setQuantity(quantity);
            payment.setTotal(total);
            payment.setPaybleamount(payable);
            payment.setPaymethod("Bank Transfer");
            payment.setPaydate(LocalDate.now().minusDays(daysAgo[i]));
            payment.setPaystatus(payStatuses[i]);
            payment.setPayno(String.format("PAY-%04d", i + 1));
            payment.setBalance(paid ? 0.0 : payable);
            payment.setPayduedate(LocalDate.now().plusDays(10));
            payment.setAddeddatetime(LocalDateTime.now().minusDays(daysAgo[i]));
            artistPaymentRepository.save(payment);
        }
        System.out.println("[DEMO SEEDER] Artist payments seeded: " + count);
    }

    private void seedEmployees() {
        List<Designation> designations = designationRepository.findAll();
        List<Employeestatus> statuses = employeeStatusRepository.findAll();
        if (designations.isEmpty() || statuses.isEmpty()) {
            System.out.println("[DEMO SEEDER] Skipped employees - designation/status lookups not seeded yet.");
            return;
        }

        String[][] rows = {
                { "Saman Kumara", "851234567V", "saman.k@example.com", "0721112233", "Male", "1985-04-12" },
                { "Priyanka Silva", "902345678V", "priyanka.s@example.com", "0722223344", "Female", "1990-08-23" },
                { "Ashan Fonseka", "883456789V", "ashan.f@example.com", "0723334455", "Male", "1988-01-30" },
                { "Chathurika Perera", "934567891V", "chathurika.p@example.com", "0724445566", "Female", "1993-11-05" },
        };

        int i = 0;
        for (String[] r : rows) {
            Employee e = new Employee();
            e.setNumber(String.format("%05d", i + 1));
            e.setFullname(r[0]);
            e.setCallingname(r[0].split(" ")[0]);
            e.setNamewithinitial(r[0]);
            e.setNic(r[1]);
            e.setEmail(r[2]);
            e.setMobilenumber(r[3]);
            e.setAddress("Colombo, Sri Lanka");
            e.setDob(LocalDate.parse(r[5]));
            e.setGender(r[4]);
            e.setCivilstatus("Single");
            e.setDesignation_table_id(designations.get(i % designations.size()));
            e.setEmployee_status_id(statuses.get(0)); // Active
            e.setAddeddatetime(LocalDateTime.now().minusDays(90 - (i * 10)));
            employeeRepository.save(e);
            i++;
        }
        System.out.println("[DEMO SEEDER] Employees seeded: " + rows.length);
    }

    private void seedProduction(List<Products> products) {
        String[][] rows = {
                { "Amaya Silva", "0711112222", "Completed", "10", "3" },
                { "Ruwan Bandara", "0712223333", "Printing", "6", "1" },
                { "Dilani Wickramasinghe", "0713334444", "Pending", "2", "-2" },
        };
        List<Mugs> mugLookups = mugsRepository.findAll();
        int i = 0;
        for (String[] r : rows) {
            Products product = products.get(products.size() - 1 - (i % Math.max(1, mugLookups.size())));
            int quantity = 5 + i;
            double unitCost = 300.0;
            double inkCost = 50.0 * quantity;
            double paperCost = 20.0 * quantity;
            double designCost = 500.0;
            double total = (unitCost * quantity) + inkCost + paperCost + designCost;
            double advance = total * 0.3;

            Production p = new Production();
            p.setCustomername(r[0]);
            p.setContact(r[1]);
            p.setJobid(String.format("JOB-%04d", i + 1));
            p.setJobstatus(r[2]);
            p.setOrdereddate(LocalDate.now().minusDays(Long.parseLong(r[3])));
            p.setDeliverydate(LocalDate.now().plusDays(Long.parseLong(r[4]) < 0 ? -Long.parseLong(r[4]) : 3));
            p.setProduct_id(product);
            p.setDesigncategory("Custom Design");
            p.setDesignformat("PNG");
            p.setPrintarea("Full Wrap");
            p.setColormode("CMYK");
            p.setDesignsize("10x10");
            p.setQuantity(quantity);
            p.setUnitcost(unitCost);
            p.setInkcost(inkCost);
            p.setPapercost(paperCost);
            p.setDesigncost(designCost);
            p.setDiscount(0.0);
            p.setDiscountamount(0.0);
            p.setTotal(total);
            p.setAdvance(advance);
            p.setBalance(total - advance);
            p.setAddeddatetime(LocalDateTime.now().minusDays(Long.parseLong(r[3])));
            productionRepository.save(p);
            i++;
        }
        System.out.println("[DEMO SEEDER] Production jobs seeded: " + rows.length);
    }
}
