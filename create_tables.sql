-- ============================================================================
-- Galaxy of Art - Complete Database Schema
-- ============================================================================
-- This file is a faithful, complete mirror of the schema Hibernate generates
-- from the JPA entities under lk.galaxyofart.** (spring.jpa.hibernate.ddl-auto
-- = update in application.properties). It was generated directly from a live
-- `galaxyofart` MySQL schema built by the running application, so it is
-- guaranteed consistent with the entities - unlike the previous version of
-- this file, which predated the Product/Inventory/Quotation/PurchaseOrder/
-- GRN/Payment/Invoice/Production modules and diverged from the JPA schema in
-- several tables (statues/mugs shape, quotation fields, missing FKs).
--
-- All 21 tables and every foreign key relationship in the corrected ER model
-- are included below, in dependency order. You do not need to run this file
-- to use the app: on every boot, ddl-auto=update creates/updates the schema
-- automatically, and DataSeeder (lk.galaxyofart.DataSeeder) seeds the lookup
-- tables (mugs, statues, designation_table, employee_status, module_table),
-- the 6 default roles/users (password "12345" for all), and the per-role
-- privilege matrix. This script exists purely as documentation / for manual
-- inspection in MySQL Workbench or a DB client - running it against an empty
-- schema will also produce a working database on its own.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS galaxyofart CHARACTER SET utf8mb4;
USE galaxyofart;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `user_table_has_role_table`;
DROP TABLE IF EXISTS `user_table`;
DROP TABLE IF EXISTS `privilage_table`;
DROP TABLE IF EXISTS `roles_table`;
DROP TABLE IF EXISTS `module_table`;
DROP TABLE IF EXISTS `employee_table`;
DROP TABLE IF EXISTS `employee_status`;
DROP TABLE IF EXISTS `designation_table`;
DROP TABLE IF EXISTS `grn`;
DROP TABLE IF EXISTS `purchaseorder`;
DROP TABLE IF EXISTS `quotation`;
DROP TABLE IF EXISTS `pricerequest`;
DROP TABLE IF EXISTS `invoice`;
DROP TABLE IF EXISTS `payment`;
DROP TABLE IF EXISTS `production`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `mugs`;
DROP TABLE IF EXISTS `statues`;
DROP TABLE IF EXISTS `customerdetails`;
DROP TABLE IF EXISTS `artistsupplierdetails`;

-- ----------------------------------------------------------------------------
-- Identity / auth cluster
-- ----------------------------------------------------------------------------

CREATE TABLE `designation_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `employee_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `employee_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `callingname` varchar(255) DEFAULT NULL,
  `civilstatus` varchar(255) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `landnumber` varchar(255) DEFAULT NULL,
  `mobilenumber` varchar(255) DEFAULT NULL,
  `namewithinitial` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `designation_table_id` int(11) DEFAULT NULL,
  `employee_status_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj4wwx73x05pcu4fgr4vyrkimu` (`designation_table_id`),
  KEY `FKrtka25j7t0pqrwv9rrs9lwrv1` (`employee_status_id`),
  CONSTRAINT `FKj4wwx73x05pcu4fgr4vyrkimu` FOREIGN KEY (`designation_table_id`) REFERENCES `designation_table` (`id`),
  CONSTRAINT `FKrtka25j7t0pqrwv9rrs9lwrv1` FOREIGN KEY (`employee_status_id`) REFERENCES `employee_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `module_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `roles_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `privilage_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `privi_delete` bit(1) DEFAULT NULL,
  `privi_insert` bit(1) DEFAULT NULL,
  `privi_select` bit(1) DEFAULT NULL,
  `privi_update` bit(1) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `module_table_id` int(11) NOT NULL,
  `roles_table_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKch0fqtm8t1cvopvkhjphtnmpn` (`module_table_id`),
  KEY `FKfxqgb6rvgcr9o2ff1junomteq` (`roles_table_id`),
  CONSTRAINT `FKch0fqtm8t1cvopvkhjphtnmpn` FOREIGN KEY (`module_table_id`) REFERENCES `module_table` (`id`),
  CONSTRAINT `FKfxqgb6rvgcr9o2ff1junomteq` FOREIGN KEY (`roles_table_id`) REFERENCES `roles_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) NOT NULL,
  `deleteddatetime` datetime(6) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` bit(1) NOT NULL,
  `updateddatetime` datetime(6) DEFAULT NULL,
  `user_photo` varbinary(255) DEFAULT NULL,
  `useremail` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `employee_table_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9sxxg661pw7af1xxgrb51by18` (`useremail`),
  UNIQUE KEY `UKen3wad7p8qfu8pcmh62gvef6v` (`username`),
  KEY `FKg67n978nmw8mafskw8m2tmgi0` (`employee_table_id`),
  CONSTRAINT `FKg67n978nmw8mafskw8m2tmgi0` FOREIGN KEY (`employee_table_id`) REFERENCES `employee_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_table_has_role_table` (
  `user_table_id` int(11) NOT NULL,
  `role_table_id` int(11) NOT NULL,
  PRIMARY KEY (`user_table_id`,`role_table_id`),
  KEY `FKmix32ocb4uyj620jg3vh92hhp` (`role_table_id`),
  CONSTRAINT `FKc3fapscf5bj2v0k2utjj0fgu8` FOREIGN KEY (`user_table_id`) REFERENCES `user_table` (`id`),
  CONSTRAINT `FKmix32ocb4uyj620jg3vh92hhp` FOREIGN KEY (`role_table_id`) REFERENCES `roles_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Business data: parties, products, lookups
-- ----------------------------------------------------------------------------

CREATE TABLE `artistsupplierdetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `beneficiary` varchar(255) DEFAULT NULL,
  `brn` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `producttype` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `customerdetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `statues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `mugs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `artdescription` varchar(255) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `itemcode` varchar(255) DEFAULT NULL,
  `medium` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `producttype` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `mug_id` int(11) DEFAULT NULL,
  `statue_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK46ocn49yqb1hm97ukl3bre9vq` (`mug_id`),
  KEY `FK497v9xk10ky382urtk54uxehk` (`statue_id`),
  CONSTRAINT `FK46ocn49yqb1hm97ukl3bre9vq` FOREIGN KEY (`mug_id`) REFERENCES `mugs` (`id`),
  CONSTRAINT `FK497v9xk10ky382urtk54uxehk` FOREIGN KEY (`statue_id`) REFERENCES `statues` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Sourcing chain: price request -> quotation -> purchase order -> GRN
-- ----------------------------------------------------------------------------

CREATE TABLE `pricerequest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `requestdate` date DEFAULT NULL,
  `requestid` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjip0edgah19rjxvqt9xfo44gx` (`product_id`),
  KEY `FKl160aogqlb5l60m5tbmgxbgca` (`supplier_id`),
  CONSTRAINT `FKjip0edgah19rjxvqt9xfo44gx` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKl160aogqlb5l60m5tbmgxbgca` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `quotation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `quotationid` varchar(255) DEFAULT NULL,
  `requestdate` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `pricerequest_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnsq6e21uacofnly8waoct40in` (`pricerequest_id`),
  KEY `FKqt13c7j4ll8pvlnp0va2f0s9y` (`product_id`),
  KEY `FKpnhrai07uhf3ldbnonup72qj` (`supplier_id`),
  CONSTRAINT `FKnsq6e21uacofnly8waoct40in` FOREIGN KEY (`pricerequest_id`) REFERENCES `pricerequest` (`id`),
  CONSTRAINT `FKpnhrai07uhf3ldbnonup72qj` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`),
  CONSTRAINT `FKqt13c7j4ll8pvlnp0va2f0s9y` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `purchaseorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `orderdate` date DEFAULT NULL,
  `orderid` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `requireddate` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2ht9iu6ct1lp5loub0m7ye782` (`product_id`),
  KEY `FK9qqhi8igl1hyxwouosc2so3p5` (`quotation_id`),
  KEY `FKcw9tqdi11x29rf1plptfqhgyw` (`supplier_id`),
  CONSTRAINT `FK2ht9iu6ct1lp5loub0m7ye782` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FK9qqhi8igl1hyxwouosc2so3p5` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`),
  CONSTRAINT `FKcw9tqdi11x29rf1plptfqhgyw` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `grn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `damagedquantity` int(11) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `grnno` varchar(255) DEFAULT NULL,
  `orderdate` date DEFAULT NULL,
  `paymethod` varchar(255) DEFAULT NULL,
  `receiveddate` date DEFAULT NULL,
  `receivedquantity` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `totalamount` double DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `purchaseorder_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK97sa8qv7lggigq8vc6g65sh67` (`purchaseorder_id`),
  KEY `FKoi9txygpx7q2pjqlq6a1e3x7` (`supplier_id`),
  CONSTRAINT `FK97sa8qv7lggigq8vc6g65sh67` FOREIGN KEY (`purchaseorder_id`) REFERENCES `purchaseorder` (`id`),
  CONSTRAINT `FKoi9txygpx7q2pjqlq6a1e3x7` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Inventory, production, and money-in/money-out (invoice + artist payment)
-- ----------------------------------------------------------------------------

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `available` int(11) DEFAULT NULL,
  `damaged` int(11) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `rop` int(11) DEFAULT NULL,
  `roq` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp7gj4l80fx8v0uap3b2crjwp5` (`product_id`),
  CONSTRAINT `FKp7gj4l80fx8v0uap3b2crjwp5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `advance` double DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `colormode` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `customername` varchar(255) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `deliverydate` date DEFAULT NULL,
  `designcategory` varchar(255) DEFAULT NULL,
  `designcost` double DEFAULT NULL,
  `designfile` varchar(255) DEFAULT NULL,
  `designformat` varchar(255) DEFAULT NULL,
  `designsize` varchar(255) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `discountamount` double DEFAULT NULL,
  `inkcost` double DEFAULT NULL,
  `jobid` varchar(255) DEFAULT NULL,
  `jobstatus` varchar(255) DEFAULT NULL,
  `ordereddate` date DEFAULT NULL,
  `papercost` double DEFAULT NULL,
  `printarea` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `unitcost` double DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpc5stjfj9s2o6cpmlop3f8d10` (`product_id`),
  CONSTRAINT `FKpc5stjfj9s2o6cpmlop3f8d10` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `commissionrate` double DEFAULT NULL,
  `commissiontype` varchar(255) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `paybleamount` double DEFAULT NULL,
  `paydate` date DEFAULT NULL,
  `payduedate` date DEFAULT NULL,
  `paymethod` varchar(255) DEFAULT NULL,
  `payno` varchar(255) DEFAULT NULL,
  `paystatus` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKeh1xerlifuorw7h40pwk7jryu` (`artist_id`),
  KEY `FK95mdx4gcoy5aacmes6h5fxhwr` (`product_id`),
  CONSTRAINT `FK95mdx4gcoy5aacmes6h5fxhwr` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKeh1xerlifuorw7h40pwk7jryu` FOREIGN KEY (`artist_id`) REFERENCES `artistsupplierdetails` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `invoicedate` date DEFAULT NULL,
  `invoiceno` varchar(255) DEFAULT NULL,
  `payamount` double DEFAULT NULL,
  `paymethod` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd63klm8y2rtq2jrrnqlod27nl` (`customer_id`),
  KEY `FKr006i8cut2ges4x52xnp9g68i` (`product_id`),
  CONSTRAINT `FKd63klm8y2rtq2jrrnqlod27nl` FOREIGN KEY (`customer_id`) REFERENCES `customerdetails` (`id`),
  CONSTRAINT `FKr006i8cut2ges4x52xnp9g68i` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Lookup-value seed data (also seeded automatically by DataSeeder on boot)
-- ----------------------------------------------------------------------------

INSERT INTO `designation_table` (`name`) VALUES ('Manager'), ('Assistant Manager'), ('Cashier'), ('Artist'), ('Supplier');

INSERT INTO `employee_status` (`name`) VALUES ('Active'), ('Inactive'), ('On Leave'), ('Terminated');

INSERT INTO `statues` (`name`, `code`) VALUES
  ('Buddha Large White', 'S15597'), ('Buddha Large Black', 'S15598'),
  ('Buddha Small White', 'S14497'), ('Buddha Small Black', 'S14498'),
  ('Buddha Large Coloured', 'S15599'), ('Buddha Small Coloured', 'S14499'),
  ('Jesus Large White', 'S25597'), ('Jesus Large Black', 'S25598'),
  ('Jesus Small White', 'S24497'), ('Jesus Small Black', 'S24498'),
  ('Jesus Large Coloured', 'S25599'), ('Jesus Small Coloured', 'S24499'),
  ('Ganesh Large White', 'S35597'), ('Ganesh Large Black', 'S35598'),
  ('Ganesh Small White', 'S34497'), ('Ganesh Small Black', 'S34498'),
  ('Ganesh Large Coloured', 'S35599'), ('Ganesh Small Coloured', 'S34499'),
  ('Paththini Large White', 'S45597'), ('Paththini Large Black', 'S45598'),
  ('Paththini Small White', 'S44497'), ('Paththini Small Black', 'S44498'),
  ('Paththini Large Coloured', 'S45599'), ('Paththini Small Coloured', 'S44499');

INSERT INTO `mugs` (`name`, `code`) VALUES
  ('Mug Large White', 'M5597'), ('Mug Large Black', 'M5598'),
  ('Mug Small White', 'M4497'), ('Mug Small Black', 'M4498');

INSERT INTO `roles_table` (`name`) VALUES
  ('Admin'), ('GeneralManager'), ('InventoryManager'), ('ProductionManager'),
  ('ManagmentAssistant'), ('cashier');

INSERT INTO `module_table` (`name`) VALUES
  ('employee'), ('user'), ('privilage'), ('roles'), ('artistsupplierdetails'),
  ('customerdetails'), ('product'), ('inventory'), ('supplierpricerequest'),
  ('quotation'), ('purchaseorder'), ('grn'), ('artistsupplierpayment'),
  ('invoice'), ('production'), ('reports');

-- Default users (password "12345" bcrypt-hashed) and the full privilege
-- matrix are seeded by DataSeeder on application startup, not here, since
-- they require BCryptPasswordEncoder at runtime.
