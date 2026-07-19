# Running Galaxy of Art

## Requirements
- Java 19 (JDK)
- MySQL Server running on `localhost:3306`

## 1. Set up the database
1. Start MySQL and create a database named `galaxyofart`.
2. Import the schema:
   ```
   mysql -u root -p galaxyofart < create_tables.sql
   ```
   (Tables are also auto-created/updated on startup via `spring.jpa.hibernate.ddl-auto=update`, so this step is optional if you're OK with Hibernate generating them.)

## 2. Configure database credentials
Edit `src/main/resources/application.properties` if your MySQL username/password differ from the defaults:
```
spring.datasource.url=jdbc:mysql://localhost:3306/galaxyofart
spring.datasource.username=root
spring.datasource.password=root
```

## 3. Run the app

**Option A — command line (Gradle wrapper):**
```
./gradlew bootRun
```
(On Windows: `gradlew.bat bootRun`)

**Option B — VS Code:**
Use the included launch config `GalaxyofartApplication` (Run and Debug panel).

## 4. Open the app
Visit **http://localhost:8080** in your browser.

## Automatic migration and dummy data
You don't need to run any migration or seed script by hand — it all happens automatically on every startup:

- **Schema migration**: `spring.jpa.hibernate.ddl-auto=update` makes Hibernate create/update tables from the JPA entities on boot.
- **Dummy data**: two `CommandLineRunner` beans run right after startup:
  - `DataSeeder.java` — seeds lookup tables, modules, roles, and login users.
  - `DemoDataSeeder.java` — seeds sample artists, suppliers, products, inventory, customers, invoices, purchase orders, GRNs, payments, employees, and production jobs, all dated relative to "now".

Both checks are guarded (they check if their data already exists), so restarting the app repeatedly will **not** duplicate rows — data is seeded once and left alone after that.

### Default login accounts (password: `12345` for all)
| Username | Role |
|---|---|
| `admin` | Admin |
| `generalmanager` | GeneralManager |
| `inventorymanager` | InventoryManager |
| `productionmanager` | ProductionManager |
| `managmentassistant` | ManagmentAssistant |
| `cashier` | cashier |
