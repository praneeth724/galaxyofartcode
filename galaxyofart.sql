-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 21, 2026 at 11:05 AM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `galaxyofart`
--

-- --------------------------------------------------------

--
-- Table structure for table `artistsupplierdetails`
--

CREATE TABLE `artistsupplierdetails` (
  `id` int(11) NOT NULL,
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
  `updatedatetime` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `artistsupplierdetails`
--

INSERT INTO `artistsupplierdetails` (`id`, `account`, `addeddatetime`, `address`, `bank`, `beneficiary`, `brn`, `contact`, `deletedatetime`, `email`, `name`, `nic`, `producttype`, `type`, `updatedatetime`) VALUES
(1, '1234567890', '2026-07-16 22:26:05.552437', 'Colombo', 'BOC', 'DDM Ceramic', 'BRN-001', '0771234567', NULL, 'ddm@supplier.lk', 'DDM Ceramic Center', '', 'mug', 'supplier', NULL),
(2, '9876543210', '2026-07-16 22:26:05.646821', 'Kandy', 'BOC', 'Nimal Perera', '', '0779876543', NULL, 'nimal@artist.lk', 'Nimal Perera', '881234567V', 'art', 'artist', NULL),
(3, '0081234567', '2026-05-18 06:46:20.060749', 'Colombo, Sri Lanka', 'Bank of Ceylon', 'Nimal Perera', NULL, '0771234567', NULL, 'nimal.perera@example.com', 'Nimal Perera', '912345678V', 'art', 'artist', NULL),
(4, '0081234568', '2026-05-23 06:46:20.098460', 'Colombo, Sri Lanka', 'Bank of Ceylon', 'Sithara Fernando', NULL, '0772345678', NULL, 'sithara.f@example.com', 'Sithara Fernando', '923456789V', 'art', 'artist', NULL),
(5, '0081234569', '2026-05-28 06:46:20.100858', 'Colombo, Sri Lanka', 'Bank of Ceylon', 'Kasun Jayasuriya', NULL, '0773456789', NULL, 'kasun.j@example.com', 'Kasun Jayasuriya', '934567890V', 'art', 'artist', NULL),
(6, '0099887710', '2026-05-23 06:46:20.103860', 'Kandy, Sri Lanka', 'Commercial Bank', 'Lanka Statue House', 'BRN00100', '0761112233', NULL, 'supplier1@example.com', 'Lanka Statue House', NULL, 'statue', 'supplier', NULL),
(7, '0099887711', '2026-05-28 06:46:20.107857', 'Kandy, Sri Lanka', 'Commercial Bank', 'Ceylon Craft Supplies', 'BRN00101', '0762223344', NULL, 'supplier2@example.com', 'Ceylon Craft Supplies', NULL, 'statue', 'supplier', NULL),
(8, '0099887712', '2026-06-02 06:46:20.110857', 'Kandy, Sri Lanka', 'Commercial Bank', 'Golden Mug Traders', 'BRN00102', '0763334455', NULL, 'supplier3@example.com', 'Golden Mug Traders', NULL, 'mug', 'supplier', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customerdetails`
--

CREATE TABLE `customerdetails` (
  `id` int(11) NOT NULL,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customerdetails`
--

INSERT INTO `customerdetails` (`id`, `addeddatetime`, `address`, `contact`, `deletedatetime`, `email`, `name`, `note`, `updatedatetime`) VALUES
(1, '2026-07-16 22:38:49.132424', 'Galle', '0712223344', NULL, 'sunil@customer.lk', 'Sunil Perera', '', NULL),
(2, '2026-07-14 06:46:20.214839', 'Colombo, Sri Lanka', '0711112222', NULL, 'amaya.s@example.com', 'Amaya Silva', NULL, NULL),
(3, '2026-07-10 06:46:20.218475', 'Colombo, Sri Lanka', '0712223333', NULL, 'ruwan.b@example.com', 'Ruwan Bandara', NULL, NULL),
(4, '2026-07-08 06:46:20.221021', 'Colombo, Sri Lanka', '0713334444', NULL, 'dilani.w@example.com', 'Dilani Wickramasinghe', NULL, NULL),
(5, '2026-06-29 06:46:20.223295', 'Colombo, Sri Lanka', '0714445555', NULL, 'tharindu.g@example.com', 'Tharindu Gunasekara', NULL, NULL),
(6, '2026-06-22 06:46:20.225663', 'Colombo, Sri Lanka', '0715556666', NULL, 'nadeesha.r@example.com', 'Nadeesha Rathnayake', NULL, NULL),
(7, '2026-06-05 06:46:20.227946', 'Colombo, Sri Lanka', '0716667777', NULL, 'chamara.k@example.com', 'Chamara Kumarasinghe', NULL, NULL),
(8, '2026-07-19 23:11:29.187047', 'Nedalagamuwa Wadumunnegedara', '0764823372', NULL, 'kavindupraneeth8@gmail.com', 'Kavindu Praneeth', 'Deserunt dolor esse', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `designation_table`
--

CREATE TABLE `designation_table` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `designation_table`
--

INSERT INTO `designation_table` (`id`, `name`) VALUES
(1, 'Manager'),
(2, 'Assistant Manager'),
(3, 'Cashier'),
(4, 'Artist'),
(5, 'Supplier');

-- --------------------------------------------------------

--
-- Table structure for table `employee_status`
--

CREATE TABLE `employee_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee_status`
--

INSERT INTO `employee_status` (`id`, `name`) VALUES
(1, 'Active'),
(2, 'Inactive'),
(3, 'On Leave'),
(4, 'Terminated');

-- --------------------------------------------------------

--
-- Table structure for table `employee_table`
--

CREATE TABLE `employee_table` (
  `id` int(11) NOT NULL,
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
  `employee_status_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee_table`
--

INSERT INTO `employee_table` (`id`, `addeddatetime`, `address`, `callingname`, `civilstatus`, `deletedatetime`, `dob`, `email`, `fullname`, `gender`, `landnumber`, `mobilenumber`, `namewithinitial`, `nic`, `note`, `number`, `updatedatetime`, `designation_table_id`, `employee_status_id`) VALUES
(1, '2026-04-18 06:46:20.447598', 'Colombo, Sri Lanka', 'Saman', 'Single', NULL, '1985-04-12', 'saman.k@example.com', 'Saman Kumara', 'Male', NULL, '0721112233', 'Saman Kumara', '851234567V', NULL, '00001', NULL, 1, 1),
(2, '2026-04-28 06:46:20.452091', 'Colombo, Sri Lanka', 'Priyanka', 'Single', NULL, '1990-08-23', 'priyanka.s@example.com', 'Priyanka Silva', 'Female', NULL, '0722223344', 'Priyanka Silva', '902345678V', NULL, '00002', NULL, 2, 1),
(3, '2026-05-08 06:46:20.455092', 'Colombo, Sri Lanka', 'Ashan', 'Single', NULL, '1988-01-30', 'ashan.f@example.com', 'Ashan Fonseka', 'Male', NULL, '0723334455', 'Ashan Fonseka', '883456789V', NULL, '00003', NULL, 3, 1),
(4, '2026-05-18 06:46:20.458251', 'Colombo, Sri Lanka', 'Chathurika', 'Single', NULL, '1993-11-05', 'chathurika.p@example.com', 'Chathurika Perera', 'Female', NULL, '0724445566', 'Chathurika Perera', '934567891V', NULL, '00004', NULL, 4, 1),
(8, '2026-07-19 23:47:00.694123', 'Nedalagamuwa Wadumunnegedara', 'kavindu', 'Married', NULL, '2022-01-04', 'kavindupraneeth8@gmail.com', 'kavindu praneeth', 'male', NULL, '0764823372', 'K.Praneeth', '200007600124', NULL, '00005', NULL, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `grn`
--

CREATE TABLE `grn` (
  `id` int(11) NOT NULL,
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
  `supplier_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grn`
--

INSERT INTO `grn` (`id`, `addeddatetime`, `damagedquantity`, `deletedatetime`, `grnno`, `orderdate`, `paymethod`, `receiveddate`, `receivedquantity`, `status`, `totalamount`, `updatedatetime`, `purchaseorder_id`, `supplier_id`) VALUES
(1, '2026-07-16 22:34:17.368320', 2, NULL, 'GRN-0001', '2026-07-05', 'Bank Transfer', '2026-07-11', 48, 'Received', 39500, NULL, 1, 1),
(2, '2026-07-16 22:38:28.753070', 2, NULL, 'GRN-0002', '2026-07-05', 'Bank Transfer', '2026-07-11', 48, 'Received', 39500, NULL, 1, 1),
(3, '2026-07-14 06:46:20.347875', 0, NULL, 'GRN-0001', '2026-06-22', 'Bank Transfer', '2026-07-14', 10, 'Paid', 27000, NULL, 2, 6),
(4, '2026-07-08 06:46:20.354880', 1, NULL, 'GRN-0002', '2026-06-27', 'Cheque', '2026-07-08', 15, 'Received', 47250, NULL, 3, 7),
(5, '2026-07-01 06:46:20.358883', 0, NULL, 'GRN-0003', '2026-07-02', 'Bank Transfer', '2026-07-01', 20, 'Pending', 72000, NULL, 4, 8);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `available` int(11) DEFAULT NULL,
  `damaged` int(11) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `rop` int(11) DEFAULT NULL,
  `roq` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `addeddatetime`, `available`, `damaged`, `deletedatetime`, `rop`, `roq`, `total`, `updatedatetime`, `product_id`) VALUES
(1, '2026-07-16 22:38:28.811862', 41, 2, NULL, 0, 0, 48, '2026-07-16 22:38:49.247554', 1),
(2, '2026-06-17 06:46:20.155137', 2, 0, NULL, 5, 15, 20, NULL, 2),
(3, '2026-06-18 06:46:20.159137', 17, 1, NULL, 5, 15, 23, NULL, 3),
(4, '2026-06-19 06:46:20.161137', 19, 2, NULL, 5, 15, 26, NULL, 4),
(5, '2026-06-20 06:46:20.189036', 24, 0, NULL, 5, 15, 29, NULL, 5),
(6, '2026-06-21 06:46:20.192035', 2, 1, NULL, 5, 15, 32, NULL, 6),
(7, '2026-06-22 06:46:20.195036', 28, 2, NULL, 5, 15, 35, NULL, 7),
(8, '2026-06-23 06:46:20.198036', 33, 0, NULL, 5, 15, 38, NULL, 8),
(9, '2026-06-24 06:46:20.201040', 35, 1, NULL, 5, 15, 41, NULL, 9),
(10, '2026-06-25 06:46:20.204377', 2, 2, NULL, 5, 15, 44, NULL, 10),
(11, '2026-06-26 06:46:20.206779', 42, 0, NULL, 5, 15, 47, NULL, 11),
(12, '2026-06-27 06:46:20.210012', 44, 1, NULL, 5, 15, 50, NULL, 12),
(13, '2026-06-28 06:46:20.212218', 36, 2, NULL, 5, 15, 53, '2026-07-19 23:12:41.818037', 13);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL,
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
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `addeddatetime`, `balance`, `deletedatetime`, `discount`, `invoicedate`, `invoiceno`, `payamount`, `paymethod`, `price`, `quantity`, `status`, `total`, `updatedatetime`, `customer_id`, `product_id`) VALUES
(1, '2026-07-16 22:38:49.225468', 0, NULL, 0, '2026-07-16', 'INV-0001', 4250, 'Cash', 850, 5, 'Paid', 4250, NULL, 1, 1),
(2, '2026-07-16 06:46:20.230451', 0, NULL, 625, '2026-07-16', 'INV-0001', 11875, 'Cash', 12500, 1, 'Paid', 11875, NULL, 2, 2),
(3, '2026-07-15 06:46:20.236989', 0, NULL, 0, '2026-07-15', 'INV-0002', 17000, 'Card', 8500, 2, 'Paid', 17000, NULL, 3, 3),
(4, '2026-07-13 06:46:20.239575', 9300, NULL, 0, '2026-07-13', 'INV-0003', 9300, 'Cash', 6200, 3, 'Pending', 18600, NULL, 4, 4),
(5, '2026-07-11 06:46:20.262184', 0, NULL, 0, '2026-07-11', 'INV-0004', 9800, 'Card', 9800, 1, 'Paid', 9800, NULL, 5, 5),
(6, '2026-07-09 06:46:20.265694', 4387.5, NULL, 225, '2026-07-09', 'INV-0005', 4387.5, 'Cash', 4500, 2, 'Pending', 8775, NULL, 6, 6),
(7, '2026-07-02 06:46:20.268694', 0, NULL, 0, '2026-07-02', 'INV-0006', 15750, 'Card', 5250, 3, 'Paid', 15750, NULL, 7, 7),
(8, '2026-07-19 23:12:41.793193', -150, NULL, 10, '2026-07-22', 'INV-0008', 15000, 'Cash', 1650, 10, 'Paid', 14850, NULL, 8, 13);

-- --------------------------------------------------------

--
-- Table structure for table `module_table`
--

CREATE TABLE `module_table` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `module_table`
--

INSERT INTO `module_table` (`id`, `name`) VALUES
(1, 'employee'),
(2, 'user'),
(3, 'privilage'),
(4, 'roles'),
(5, 'artistsupplierdetails'),
(6, 'customerdetails'),
(7, 'product'),
(8, 'inventory'),
(9, 'supplierpricerequest'),
(10, 'quotation'),
(11, 'purchaseorder'),
(12, 'grn'),
(13, 'artistsupplierpayment'),
(14, 'invoice'),
(15, 'production'),
(16, 'reports');

-- --------------------------------------------------------

--
-- Table structure for table `mugs`
--

CREATE TABLE `mugs` (
  `id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mugs`
--

INSERT INTO `mugs` (`id`, `code`, `name`) VALUES
(1, 'M5597', 'Mug Large White'),
(2, 'M5598', 'Mug Large Black'),
(3, 'M4497', 'Mug Small White'),
(4, 'M4498', 'Mug Small Black');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
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
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `addeddatetime`, `balance`, `commissionrate`, `commissiontype`, `deletedatetime`, `paybleamount`, `paydate`, `payduedate`, `paymethod`, `payno`, `paystatus`, `price`, `quantity`, `total`, `updatedatetime`, `artist_id`, `product_id`) VALUES
(1, '2026-07-12 06:46:20.387431', 0, 20, 'Percentage', NULL, 2500, '2026-07-12', '2026-07-27', 'Bank Transfer', 'PAY-0001', 'Paid', 12500, 1, 12500, NULL, 3, 2),
(2, '2026-07-05 06:46:20.394941', 0, 20, 'Percentage', NULL, 3400, '2026-07-05', '2026-07-27', 'Bank Transfer', 'PAY-0002', 'Paid', 8500, 2, 17000, NULL, 4, 3),
(3, '2026-06-25 06:46:20.398957', 3720, 20, 'Percentage', NULL, 3720, '2026-06-25', '2026-07-27', 'Bank Transfer', 'PAY-0003', 'Pending', 6200, 3, 18600, NULL, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `pricerequest`
--

CREATE TABLE `pricerequest` (
  `id` int(11) NOT NULL,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `requestdate` date DEFAULT NULL,
  `requestid` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pricerequest`
--

INSERT INTO `pricerequest` (`id`, `addeddatetime`, `deletedatetime`, `price`, `quantity`, `requestdate`, `requestid`, `status`, `updatedatetime`, `product_id`, `supplier_id`) VALUES
(1, '2026-07-16 22:32:43.377956', NULL, 800, 50, '2026-07-01', 'PR-0001', 'Pending', NULL, 1, 1),
(2, '2026-06-12 06:46:20.271694', NULL, 2700, 10, '2026-06-12', 'PR-0001', 'Responded', NULL, 6, 6),
(3, '2026-06-17 06:46:20.277792', NULL, 3150, 15, '2026-06-17', 'PR-0002', 'Responded', NULL, 7, 7),
(4, '2026-06-22 06:46:20.280799', NULL, 3600, 20, '2026-06-22', 'PR-0003', 'Pending', NULL, 8, 8),
(5, '2026-06-27 06:46:20.294528', NULL, 4050, 25, '2026-06-27', 'PR-0004', 'Rejected', NULL, 9, 6),
(6, '2026-07-19 23:15:11.759448', NULL, 100, 50, '2026-07-23', 'PR-0006', 'Pending', NULL, 10, 7);

-- --------------------------------------------------------

--
-- Table structure for table `privilage_table`
--

CREATE TABLE `privilage_table` (
  `id` int(11) NOT NULL,
  `addeddatetime` datetime(6) DEFAULT NULL,
  `deletedatetime` datetime(6) DEFAULT NULL,
  `privi_delete` bit(1) DEFAULT NULL,
  `privi_insert` bit(1) DEFAULT NULL,
  `privi_select` bit(1) DEFAULT NULL,
  `privi_update` bit(1) DEFAULT NULL,
  `updatedatetime` datetime(6) DEFAULT NULL,
  `module_table_id` int(11) NOT NULL,
  `roles_table_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `privilage_table`
--

INSERT INTO `privilage_table` (`id`, `addeddatetime`, `deletedatetime`, `privi_delete`, `privi_insert`, `privi_select`, `privi_update`, `updatedatetime`, `module_table_id`, `roles_table_id`) VALUES
(1, '2026-07-16 22:18:11.979853', NULL, b'1', b'1', b'1', b'1', NULL, 1, 1),
(2, '2026-07-16 22:18:11.990055', NULL, b'1', b'1', b'1', b'1', NULL, 2, 1),
(3, '2026-07-16 22:18:11.998660', NULL, b'1', b'1', b'1', b'1', NULL, 3, 1),
(4, '2026-07-16 22:18:12.011260', NULL, b'1', b'1', b'1', b'1', NULL, 4, 1),
(5, '2026-07-16 22:18:12.021964', NULL, b'1', b'1', b'1', b'1', NULL, 5, 1),
(6, '2026-07-16 22:18:12.031836', NULL, b'1', b'1', b'1', b'1', NULL, 6, 1),
(7, '2026-07-16 22:18:12.036010', NULL, b'1', b'1', b'1', b'1', NULL, 7, 1),
(8, '2026-07-16 22:18:12.047683', NULL, b'1', b'1', b'1', b'1', NULL, 8, 1),
(9, '2026-07-16 22:18:12.058992', NULL, b'1', b'1', b'1', b'1', NULL, 9, 1),
(10, '2026-07-16 22:18:12.068377', NULL, b'1', b'1', b'1', b'1', NULL, 10, 1),
(11, '2026-07-16 22:18:12.075594', NULL, b'1', b'1', b'1', b'1', NULL, 11, 1),
(12, '2026-07-16 22:18:12.084287', NULL, b'1', b'1', b'1', b'1', NULL, 12, 1),
(13, '2026-07-16 22:18:12.093564', NULL, b'1', b'1', b'1', b'1', NULL, 13, 1),
(14, '2026-07-16 22:18:12.100475', NULL, b'1', b'1', b'1', b'1', NULL, 14, 1),
(15, '2026-07-16 22:18:12.108037', NULL, b'1', b'1', b'1', b'1', NULL, 15, 1),
(16, '2026-07-16 22:18:12.114551', NULL, b'1', b'1', b'1', b'1', NULL, 16, 1),
(17, '2026-07-16 22:18:12.220534', NULL, b'1', b'1', b'1', b'1', NULL, 1, 2),
(18, '2026-07-16 22:18:12.231175', NULL, b'1', b'1', b'1', b'1', NULL, 2, 2),
(19, '2026-07-16 22:18:12.238179', NULL, b'1', b'1', b'1', b'1', NULL, 3, 2),
(20, '2026-07-16 22:18:12.246096', NULL, b'1', b'1', b'1', b'1', NULL, 4, 2),
(21, '2026-07-16 22:18:12.248518', NULL, b'1', b'1', b'1', b'1', NULL, 5, 2),
(22, '2026-07-16 22:18:12.259144', NULL, b'1', b'1', b'1', b'1', NULL, 6, 2),
(23, '2026-07-16 22:18:12.265725', NULL, b'1', b'1', b'1', b'1', NULL, 7, 2),
(24, '2026-07-16 22:18:12.275299', NULL, b'1', b'1', b'1', b'1', NULL, 8, 2),
(25, '2026-07-16 22:18:12.281444', NULL, b'1', b'1', b'1', b'1', NULL, 9, 2),
(26, '2026-07-16 22:18:12.293388', NULL, b'1', b'1', b'1', b'1', NULL, 10, 2),
(27, '2026-07-16 22:18:12.296949', NULL, b'1', b'1', b'1', b'1', NULL, 11, 2),
(28, '2026-07-16 22:18:12.306061', NULL, b'1', b'1', b'1', b'1', NULL, 12, 2),
(29, '2026-07-16 22:18:12.307379', NULL, b'1', b'1', b'1', b'1', NULL, 13, 2),
(30, '2026-07-16 22:18:12.307379', NULL, b'1', b'1', b'1', b'1', NULL, 14, 2),
(31, '2026-07-16 22:18:12.326553', NULL, b'1', b'1', b'1', b'1', NULL, 15, 2),
(32, '2026-07-16 22:18:12.334050', NULL, b'1', b'1', b'1', b'1', NULL, 16, 2),
(33, '2026-07-16 22:18:12.448952', NULL, b'1', b'1', b'1', b'1', NULL, 8, 3),
(34, '2026-07-16 22:18:12.551584', NULL, b'1', b'1', b'1', b'1', NULL, 7, 4),
(35, '2026-07-16 22:18:12.558925', NULL, b'1', b'1', b'1', b'1', NULL, 15, 4),
(36, '2026-07-16 22:18:12.658142', NULL, b'1', b'1', b'1', b'1', NULL, 5, 5),
(37, '2026-07-16 22:18:12.666397', NULL, b'1', b'1', b'1', b'1', NULL, 6, 5),
(38, '2026-07-16 22:18:12.673043', NULL, b'1', b'1', b'1', b'1', NULL, 7, 5),
(39, '2026-07-16 22:18:12.678857', NULL, b'1', b'1', b'1', b'1', NULL, 9, 5),
(40, '2026-07-16 22:18:12.679863', NULL, b'1', b'1', b'1', b'1', NULL, 10, 5),
(41, '2026-07-16 22:18:12.679863', NULL, b'1', b'1', b'1', b'1', NULL, 8, 5),
(42, '2026-07-16 22:18:12.697014', NULL, b'1', b'1', b'1', b'1', NULL, 11, 5),
(43, '2026-07-16 22:18:12.702571', NULL, b'1', b'1', b'1', b'1', NULL, 13, 5),
(44, '2026-07-16 22:18:12.709603', NULL, b'1', b'1', b'1', b'1', NULL, 14, 5),
(45, '2026-07-16 22:18:12.811108', NULL, b'1', b'1', b'1', b'1', NULL, 7, 6),
(46, '2026-07-16 22:18:12.819216', NULL, b'1', b'1', b'1', b'1', NULL, 8, 6),
(47, '2026-07-16 22:18:12.825274', NULL, b'1', b'1', b'1', b'1', NULL, 11, 6),
(48, '2026-07-16 22:18:12.830383', NULL, b'1', b'1', b'1', b'1', NULL, 13, 6),
(49, '2026-07-16 22:18:12.830383', NULL, b'1', b'1', b'1', b'1', NULL, 14, 6);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
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
  `statue_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `addeddatetime`, `artdescription`, `deletedatetime`, `image`, `itemcode`, `medium`, `name`, `price`, `producttype`, `updatedatetime`, `mug_id`, `statue_id`) VALUES
(1, '2026-07-16 22:26:33.303756', NULL, NULL, 'mug1.jpg', 'M5597-T1', NULL, 'DDM Ceramic Center', 850, 'mug', NULL, 1, NULL),
(2, '2026-06-07 06:46:20.119368', 'Handmade oil painting titled \'Sunset Over Sigiriya\'.', NULL, NULL, 'ART-0001', 'Oil Painting', 'Sunset Over Sigiriya', 12500, 'art', NULL, NULL, NULL),
(3, '2026-06-07 06:46:20.124243', 'Handmade watercolour painting titled \'Village Life\'.', NULL, NULL, 'ART-0002', 'Watercolour Painting', 'Village Life', 8500, 'art', NULL, NULL, NULL),
(4, '2026-06-07 06:46:20.127365', 'Handmade pencil art titled \'Elephant Family\'.', NULL, NULL, 'ART-0003', 'Pencil Art', 'Elephant Family', 6200, 'art', NULL, NULL, NULL),
(5, '2026-06-07 06:46:20.129823', 'Handmade pastel painting titled \'Kandyan Dancer\'.', NULL, NULL, 'ART-0004', 'Pastel Painting', 'Kandyan Dancer', 9800, 'art', NULL, NULL, NULL),
(6, '2026-06-09 06:46:20.132463', NULL, NULL, NULL, 'S15597', NULL, 'Buddha Large White', 4500, 'statue', NULL, NULL, 1),
(7, '2026-06-09 06:46:20.134934', NULL, NULL, NULL, 'S15598', NULL, 'Buddha Large Black', 5250, 'statue', NULL, NULL, 2),
(8, '2026-06-09 06:46:20.138363', NULL, NULL, NULL, 'S14497', NULL, 'Buddha Small White', 6000, 'statue', NULL, NULL, 3),
(9, '2026-06-09 06:46:20.140489', NULL, NULL, NULL, 'S14498', NULL, 'Buddha Small Black', 6750, 'statue', NULL, NULL, 4),
(10, '2026-06-11 06:46:20.143834', NULL, NULL, NULL, 'M5597', NULL, 'Mug Large White', 1200, 'mug', NULL, 1, NULL),
(11, '2026-06-11 06:46:20.146566', NULL, NULL, NULL, 'M5598', NULL, 'Mug Large Black', 1350, 'mug', NULL, 2, NULL),
(12, '2026-06-11 06:46:20.149153', NULL, NULL, NULL, 'M4497', NULL, 'Mug Small White', 1500, 'mug', NULL, 3, NULL),
(13, '2026-06-11 06:46:20.151667', NULL, NULL, NULL, 'M4498', NULL, 'Mug Small Black', 1650, 'mug', NULL, 4, NULL),
(14, '2026-07-19 22:25:16.621358', NULL, NULL, 'C:\\fakepath\\ChatGPT Image May 23, 2026, 09_01_14 AM.png', '123456', NULL, 'fgfgfg', 500, NULL, NULL, NULL, 14),
(15, '2026-07-19 23:22:13.371692', NULL, NULL, 'C:\\fakepath\\AI_Powered_Websites_Smart_Business_202605241342.jpeg', '000123', NULL, 'test', 500, NULL, NULL, NULL, 11),
(16, '2026-07-19 23:41:35.005170', NULL, NULL, 'C:\\fakepath\\QR-Table 2.png', '00112', NULL, 'test', 1000, NULL, NULL, 2, NULL),
(17, '2026-07-19 23:43:17.739208', NULL, NULL, 'C:\\fakepath\\QR-Table 2.png', '001223', NULL, 'testshop', 5000, NULL, NULL, 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `production`
--

CREATE TABLE `production` (
  `id` int(11) NOT NULL,
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
  `approvedbymanager` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `production`
--

INSERT INTO `production` (`id`, `addeddatetime`, `advance`, `balance`, `colormode`, `contact`, `customername`, `deletedatetime`, `deliverydate`, `designcategory`, `designcost`, `designfile`, `designformat`, `designsize`, `discount`, `discountamount`, `inkcost`, `jobid`, `jobstatus`, `ordereddate`, `papercost`, `printarea`, `quantity`, `total`, `unitcost`, `updatedatetime`, `product_id`, `approvedbymanager`) VALUES
(1, '2026-07-07 06:46:20.463769', 705, 1645, 'CMYK', '0711112222', 'Amaya Silva', NULL, '2026-07-20', 'Custom Design', 500, NULL, 'PNG', '10x10', 0, 0, 250, 'JOB-0001', 'Completed', '2026-07-07', 100, 'Full Wrap', 5, 2350, 300, NULL, 13, NULL),
(2, '2026-07-11 06:46:20.468646', 816, 1904, 'CMYK', '0712223333', 'Ruwan Bandara', NULL, '2026-07-20', 'Custom Design', 500, NULL, 'PNG', '10x10', 0, 0, 300, 'JOB-0002', 'Printing', '2026-07-11', 120, 'Full Wrap', 6, 2720, 300, NULL, 12, NULL),
(3, '2026-07-15 06:46:20.472694', 927, 2163, 'CMYK', '0713334444', 'Dilani Wickramasinghe', NULL, '2026-07-19', 'Custom Design', 500, NULL, 'PNG', '10x10', 0, 0, 350, 'JOB-0003', 'Pending', '2026-07-15', 140, 'Full Wrap', 7, 3090, 300, NULL, 11, NULL),
(4, '2026-07-19 23:10:43.279966', 78, 10567.549999999996, 'CMYK', '0764823372', 'kavindu', NULL, '1978-07-03', 'Photo', 49, 'C:\\fakepath\\ChatGPT Image May 23, 2026, 09_01_14 AM.png', 'png', '30', 77, 35639.450000000004, 32, 'JOB-0004', 'Pending', '2023-08-22', 28, 'Full Wrap', 888, 10645.549999999996, 52, NULL, 13, b'1'),
(5, '2026-07-19 23:24:23.435125', 1000, 485, 'RGB', '0764823963', 'sunera', NULL, '2026-07-24', 'Quote', 500, 'C:\\fakepath\\QR-Table 2.png', 'png', '80*100', 10, 165, 100, 'JOB-0005', 'Printing', '2026-07-12', 50, 'Full Wrap', 10, 1485, 100, NULL, 10, b'1'),
(6, '2026-07-19 23:50:14.206025', 35000, 1981, 'RGB', '0764852369', 'sunera nuwandika', NULL, '2026-07-23', 'Photo', 1000, 'C:\\fakepath\\QR-Table 2.png', 'png', '80*100', 10, 4109, 40, 'JOB-0006', 'Pending', '2026-07-13', 50, 'Full Wrap', 100, 36981, 400, NULL, 11, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorder`
--

CREATE TABLE `purchaseorder` (
  `id` int(11) NOT NULL,
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
  `supplier_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `purchaseorder`
--

INSERT INTO `purchaseorder` (`id`, `addeddatetime`, `deletedatetime`, `orderdate`, `orderid`, `quantity`, `requireddate`, `status`, `total`, `updatedatetime`, `product_id`, `quotation_id`, `supplier_id`) VALUES
(1, '2026-07-16 22:33:44.636734', NULL, '2026-07-05', 'PO-0001', 50, '2026-07-12', 'Approved', 39500, NULL, 1, 1, 1),
(2, '2026-06-22 06:46:20.310535', NULL, '2026-06-22', 'PO-0001', 10, '2026-07-07', 'Received', 27000, NULL, 6, 2, 6),
(3, '2026-06-27 06:46:20.316563', NULL, '2026-06-27', 'PO-0002', 15, '2026-07-12', 'Approved', 47250, NULL, 7, 3, 7),
(4, '2026-07-02 06:46:20.319563', NULL, '2026-07-02', 'PO-0003', 20, '2026-07-17', 'Pending', 72000, NULL, 8, 4, 8);

-- --------------------------------------------------------

--
-- Table structure for table `quotation`
--

CREATE TABLE `quotation` (
  `id` int(11) NOT NULL,
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
  `supplier_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `quotation`
--

INSERT INTO `quotation` (`id`, `addeddatetime`, `deadline`, `deletedatetime`, `discount`, `price`, `quantity`, `quotationid`, `requestdate`, `status`, `updatedatetime`, `pricerequest_id`, `product_id`, `supplier_id`) VALUES
(1, '2026-07-16 22:33:10.911796', '2026-07-10', NULL, 0, 790, 50, 'QT-0001', '2026-07-01', 'Approved', NULL, 1, 1, 1),
(2, '2026-06-17 06:46:20.297528', '2026-06-27', NULL, 200, 2700, 10, 'QT-0001', '2026-06-17', 'Approved', NULL, 2, 6, 6),
(3, '2026-06-22 06:46:20.304532', '2026-07-02', NULL, 0, 3150, 15, 'QT-0002', '2026-06-22', 'Approved', NULL, 3, 7, 7),
(4, '2026-06-27 06:46:20.307532', '2026-07-07', NULL, 0, 3600, 20, 'QT-0003', '2026-06-27', 'Pending', NULL, 4, 8, 8);

-- --------------------------------------------------------

--
-- Table structure for table `roles_table`
--

CREATE TABLE `roles_table` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles_table`
--

INSERT INTO `roles_table` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'GeneralManager'),
(3, 'InventoryManager'),
(4, 'ProductionManager'),
(5, 'ManagmentAssistant'),
(6, 'cashier');

-- --------------------------------------------------------

--
-- Table structure for table `statues`
--

CREATE TABLE `statues` (
  `id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `statues`
--

INSERT INTO `statues` (`id`, `code`, `name`) VALUES
(1, 'S15597', 'Buddha Large White'),
(2, 'S15598', 'Buddha Large Black'),
(3, 'S14497', 'Buddha Small White'),
(4, 'S14498', 'Buddha Small Black'),
(5, 'S15599', 'Buddha Large Coloured'),
(6, 'S14499', 'Buddha Small Coloured'),
(7, 'S25597', 'Jesus Large White'),
(8, 'S25598', 'Jesus Large Black'),
(9, 'S24497', 'Jesus Small White'),
(10, 'S24498', 'Jesus Small Black'),
(11, 'S25599', 'Jesus Large Coloured'),
(12, 'S24499', 'Jesus Small Coloured'),
(13, 'S35597', 'Ganesh Large White'),
(14, 'S35598', 'Ganesh Large Black'),
(15, 'S34497', 'Ganesh Small White'),
(16, 'S34498', 'Ganesh Small Black'),
(17, 'S35599', 'Ganesh Large Coloured'),
(18, 'S34499', 'Ganesh Small Coloured'),
(19, 'S45597', 'Paththini Large White'),
(20, 'S45598', 'Paththini Large Black'),
(21, 'S44497', 'Paththini Small White'),
(22, 'S44498', 'Paththini Small Black'),
(23, 'S45599', 'Paththini Large Coloured'),
(24, 'S44499', 'Paththini Small Coloured');

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `id` int(11) NOT NULL,
  `addeddatetime` datetime(6) NOT NULL,
  `deleteddatetime` datetime(6) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` bit(1) NOT NULL,
  `updateddatetime` datetime(6) DEFAULT NULL,
  `user_photo` varbinary(255) DEFAULT NULL,
  `useremail` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `employee_table_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`id`, `addeddatetime`, `deleteddatetime`, `note`, `password`, `status`, `updateddatetime`, `user_photo`, `useremail`, `username`, `employee_table_id`) VALUES
(1, '2026-07-16 22:18:11.927635', NULL, NULL, '$2a$10$xk/3HoB5mM2J2acoPadMKezsBv46NahqvxdRDRRvU6Yl/Iip0/BC.', b'1', NULL, NULL, 'admin@gmail.com', 'admin', NULL),
(2, '2026-07-16 22:18:12.188963', NULL, NULL, '$2a$10$TaSCr0KiaJoiofLF3JHapesnvVrPJ9mSfSdfJrpLzJqik2U62eNmK', b'1', NULL, NULL, 'generalmanager@gmail.com', 'generalmanager', NULL),
(3, '2026-07-16 22:18:12.429683', NULL, NULL, '$2a$10$LKcDZuRnDcp/vYOU.woGtuPtFpOcarfWG4vP8rC8K3S/5GJCqsQr6', b'1', NULL, NULL, 'inventorymanager@gmail.com', 'inventorymanager', NULL),
(4, '2026-07-16 22:18:12.534093', NULL, NULL, '$2a$10$rrbkkzcNeXQiO5ftbQF4/OuMAbrc/QZsMM5jo81SFIIn0NU/XTojK', b'1', NULL, NULL, 'productionmanager@gmail.com', 'productionmanager', NULL),
(5, '2026-07-16 22:18:12.638937', NULL, NULL, '$2a$10$rUWpjJyqxGOHlscVUUWoy.J2sojTn8SlYQqYRQLGVIOk.q2U0Ozha', b'1', NULL, NULL, 'managmentassistant@gmail.com', 'managmentassistant', NULL),
(6, '2026-07-16 22:18:12.783583', NULL, NULL, '$2a$10$0l4JoWOxv4nwlgMGtJpHbeVp6wGUX1W7qKDWFSRBxDcDBtZvtC1tK', b'1', NULL, NULL, 'cashier@gmail.com', 'cashier', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_table_has_role_table`
--

CREATE TABLE `user_table_has_role_table` (
  `user_table_id` int(11) NOT NULL,
  `role_table_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_table_has_role_table`
--

INSERT INTO `user_table_has_role_table` (`user_table_id`, `role_table_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artistsupplierdetails`
--
ALTER TABLE `artistsupplierdetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customerdetails`
--
ALTER TABLE `customerdetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `designation_table`
--
ALTER TABLE `designation_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_status`
--
ALTER TABLE `employee_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_table`
--
ALTER TABLE `employee_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKj4wwx73x05pcu4fgr4vyrkimu` (`designation_table_id`),
  ADD KEY `FKrtka25j7t0pqrwv9rrs9lwrv1` (`employee_status_id`);

--
-- Indexes for table `grn`
--
ALTER TABLE `grn`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK97sa8qv7lggigq8vc6g65sh67` (`purchaseorder_id`),
  ADD KEY `FKoi9txygpx7q2pjqlq6a1e3x7` (`supplier_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKp7gj4l80fx8v0uap3b2crjwp5` (`product_id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKd63klm8y2rtq2jrrnqlod27nl` (`customer_id`),
  ADD KEY `FKr006i8cut2ges4x52xnp9g68i` (`product_id`);

--
-- Indexes for table `module_table`
--
ALTER TABLE `module_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mugs`
--
ALTER TABLE `mugs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKeh1xerlifuorw7h40pwk7jryu` (`artist_id`),
  ADD KEY `FK95mdx4gcoy5aacmes6h5fxhwr` (`product_id`);

--
-- Indexes for table `pricerequest`
--
ALTER TABLE `pricerequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjip0edgah19rjxvqt9xfo44gx` (`product_id`),
  ADD KEY `FKl160aogqlb5l60m5tbmgxbgca` (`supplier_id`);

--
-- Indexes for table `privilage_table`
--
ALTER TABLE `privilage_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKch0fqtm8t1cvopvkhjphtnmpn` (`module_table_id`),
  ADD KEY `FKfxqgb6rvgcr9o2ff1junomteq` (`roles_table_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK46ocn49yqb1hm97ukl3bre9vq` (`mug_id`),
  ADD KEY `FK497v9xk10ky382urtk54uxehk` (`statue_id`);

--
-- Indexes for table `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpc5stjfj9s2o6cpmlop3f8d10` (`product_id`);

--
-- Indexes for table `purchaseorder`
--
ALTER TABLE `purchaseorder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2ht9iu6ct1lp5loub0m7ye782` (`product_id`),
  ADD KEY `FK9qqhi8igl1hyxwouosc2so3p5` (`quotation_id`),
  ADD KEY `FKcw9tqdi11x29rf1plptfqhgyw` (`supplier_id`);

--
-- Indexes for table `quotation`
--
ALTER TABLE `quotation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKnsq6e21uacofnly8waoct40in` (`pricerequest_id`),
  ADD KEY `FKqt13c7j4ll8pvlnp0va2f0s9y` (`product_id`),
  ADD KEY `FKpnhrai07uhf3ldbnonup72qj` (`supplier_id`);

--
-- Indexes for table `roles_table`
--
ALTER TABLE `roles_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `statues`
--
ALTER TABLE `statues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK9sxxg661pw7af1xxgrb51by18` (`useremail`),
  ADD UNIQUE KEY `UKen3wad7p8qfu8pcmh62gvef6v` (`username`),
  ADD KEY `FKg67n978nmw8mafskw8m2tmgi0` (`employee_table_id`);

--
-- Indexes for table `user_table_has_role_table`
--
ALTER TABLE `user_table_has_role_table`
  ADD PRIMARY KEY (`user_table_id`,`role_table_id`),
  ADD KEY `FKmix32ocb4uyj620jg3vh92hhp` (`role_table_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artistsupplierdetails`
--
ALTER TABLE `artistsupplierdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customerdetails`
--
ALTER TABLE `customerdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `designation_table`
--
ALTER TABLE `designation_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_status`
--
ALTER TABLE `employee_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee_table`
--
ALTER TABLE `employee_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `grn`
--
ALTER TABLE `grn`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `module_table`
--
ALTER TABLE `module_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `mugs`
--
ALTER TABLE `mugs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pricerequest`
--
ALTER TABLE `pricerequest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `privilage_table`
--
ALTER TABLE `privilage_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `production`
--
ALTER TABLE `production`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `purchaseorder`
--
ALTER TABLE `purchaseorder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quotation`
--
ALTER TABLE `quotation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles_table`
--
ALTER TABLE `roles_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `statues`
--
ALTER TABLE `statues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_table`
--
ALTER TABLE `employee_table`
  ADD CONSTRAINT `FKj4wwx73x05pcu4fgr4vyrkimu` FOREIGN KEY (`designation_table_id`) REFERENCES `designation_table` (`id`),
  ADD CONSTRAINT `FKrtka25j7t0pqrwv9rrs9lwrv1` FOREIGN KEY (`employee_status_id`) REFERENCES `employee_status` (`id`);

--
-- Constraints for table `grn`
--
ALTER TABLE `grn`
  ADD CONSTRAINT `FK97sa8qv7lggigq8vc6g65sh67` FOREIGN KEY (`purchaseorder_id`) REFERENCES `purchaseorder` (`id`),
  ADD CONSTRAINT `FKoi9txygpx7q2pjqlq6a1e3x7` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`);

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `FKp7gj4l80fx8v0uap3b2crjwp5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `FKd63klm8y2rtq2jrrnqlod27nl` FOREIGN KEY (`customer_id`) REFERENCES `customerdetails` (`id`),
  ADD CONSTRAINT `FKr006i8cut2ges4x52xnp9g68i` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `FK95mdx4gcoy5aacmes6h5fxhwr` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKeh1xerlifuorw7h40pwk7jryu` FOREIGN KEY (`artist_id`) REFERENCES `artistsupplierdetails` (`id`);

--
-- Constraints for table `pricerequest`
--
ALTER TABLE `pricerequest`
  ADD CONSTRAINT `FKjip0edgah19rjxvqt9xfo44gx` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKl160aogqlb5l60m5tbmgxbgca` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`);

--
-- Constraints for table `privilage_table`
--
ALTER TABLE `privilage_table`
  ADD CONSTRAINT `FKch0fqtm8t1cvopvkhjphtnmpn` FOREIGN KEY (`module_table_id`) REFERENCES `module_table` (`id`),
  ADD CONSTRAINT `FKfxqgb6rvgcr9o2ff1junomteq` FOREIGN KEY (`roles_table_id`) REFERENCES `roles_table` (`id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK46ocn49yqb1hm97ukl3bre9vq` FOREIGN KEY (`mug_id`) REFERENCES `mugs` (`id`),
  ADD CONSTRAINT `FK497v9xk10ky382urtk54uxehk` FOREIGN KEY (`statue_id`) REFERENCES `statues` (`id`);

--
-- Constraints for table `production`
--
ALTER TABLE `production`
  ADD CONSTRAINT `FKpc5stjfj9s2o6cpmlop3f8d10` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `purchaseorder`
--
ALTER TABLE `purchaseorder`
  ADD CONSTRAINT `FK2ht9iu6ct1lp5loub0m7ye782` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FK9qqhi8igl1hyxwouosc2so3p5` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`id`),
  ADD CONSTRAINT `FKcw9tqdi11x29rf1plptfqhgyw` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`);

--
-- Constraints for table `quotation`
--
ALTER TABLE `quotation`
  ADD CONSTRAINT `FKnsq6e21uacofnly8waoct40in` FOREIGN KEY (`pricerequest_id`) REFERENCES `pricerequest` (`id`),
  ADD CONSTRAINT `FKpnhrai07uhf3ldbnonup72qj` FOREIGN KEY (`supplier_id`) REFERENCES `artistsupplierdetails` (`id`),
  ADD CONSTRAINT `FKqt13c7j4ll8pvlnp0va2f0s9y` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `user_table`
--
ALTER TABLE `user_table`
  ADD CONSTRAINT `FKg67n978nmw8mafskw8m2tmgi0` FOREIGN KEY (`employee_table_id`) REFERENCES `employee_table` (`id`);

--
-- Constraints for table `user_table_has_role_table`
--
ALTER TABLE `user_table_has_role_table`
  ADD CONSTRAINT `FKc3fapscf5bj2v0k2utjj0fgu8` FOREIGN KEY (`user_table_id`) REFERENCES `user_table` (`id`),
  ADD CONSTRAINT `FKmix32ocb4uyj620jg3vh92hhp` FOREIGN KEY (`role_table_id`) REFERENCES `roles_table` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
