package com.nexuspos.config;

import com.nexuspos.model.*;
import com.nexuspos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private ReturnRecordRepository returnRecordRepository;

    @Autowired
    private StoreSettingRepository storeSettingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Demo Users if not present
        if (userRepository.count() == 0) {
            User admin = new User(
                    "Sarah Anderson",
                    "sarah@nexuspos.com",
                    passwordEncoder.encode("password"),
                    "SUPER_ADMIN"
            );
            User cashier = new User(
                    "Maya Pillai",
                    "maya@nexuspos.com",
                    passwordEncoder.encode("password"),
                    "CASHIER"
            );
            userRepository.saveAll(List.of(admin, cashier));
            System.out.println(">> Seeded default admin users: sarah@nexuspos.com / password");
        }

        // 2. Seed Products if not present
        if (productRepository.count() == 0) {
            List<Product> prods = List.of(
                    new Product("prod-1", "Basmati Rice 5kg", "SKU-0001", "8901234567890", "Grains", 520, 649, 42, 20, "🍚", "Active"),
                    new Product("prod-2", "Olive Oil 1L", "SKU-0002", "8901234567891", "Oils", 720, 899, 0, 15, "🫒", "Active"),
                    new Product("prod-3", "Whole Wheat Bread", "SKU-0003", "8901234567892", "Bakery", 32, 45, 128, 20, "🍞", "Active"),
                    new Product("prod-4", "Amul Milk 1L", "SKU-0004", "8901234567893", "Dairy", 52, 68, 9, 15, "🥛", "Active"),
                    new Product("prod-5", "Green Tea 100g", "SKU-0005", "8901234567894", "Beverages", 240, 320, 56, 15, "🍵", "Active"),
                    new Product("prod-6", "Dark Chocolate 70%", "SKU-0006", "8901234567895", "Snacks", 110, 150, 74, 20, "🍫", "Active"),
                    new Product("prod-7", "Orange Juice 1L", "SKU-0007", "8901234567896", "Beverages", 85, 120, 33, 10, "🧃", "Active"),
                    new Product("prod-8", "Potato Chips 200g", "SKU-0008", "8901234567897", "Snacks", 60, 85, 98, 25, "🍟", "Active"),
                    new Product("prod-9", "Toothpaste 150g", "SKU-0009", "8901234567898", "Personal Care", 80, 110, 14, 20, "🪥", "Active"),
                    new Product("prod-10", "Hand Sanitizer 500ml", "SKU-0010", "8901234567899", "Personal Care", 65, 95, 61, 15, "🧴", "Active"),
                    new Product("prod-11", "Coffee Beans 250g", "SKU-0011", "8901234567800", "Beverages", 360, 480, 28, 10, "☕", "Active"),
                    new Product("prod-12", "Yogurt 500g", "SKU-0012", "8901234567801", "Dairy", 55, 75, 7, 15, "🥣", "Active")
            );
            productRepository.saveAll(prods);
            System.out.println(">> Seeded default catalog products");
        }

        // 3. Seed Customers
        if (customerRepository.count() == 0) {
            List<Customer> customers = List.of(
                    new Customer("cust-1", "Priya Sharma", "+91 98765 43210", "priya@example.com", "Gold", 124500, 0, "Today"),
                    new Customer("cust-2", "Rahul Verma", "+91 98765 43211", "rahul.v@example.com", "Silver", 68200, 1800, "Today"),
                    new Customer("cust-3", "Amit Patel", "+91 98765 43212", "amit.p@example.com", "Gold", 204300, 4900, "Yesterday"),
                    new Customer("cust-4", "Sneha Reddy", "+91 98765 43213", "sneha.r@example.com", "Regular", 32100, 0, "Yesterday"),
                    new Customer("cust-5", "Manoj Kumar", "+91 98765 43214", "manoj@example.com", "Regular", 18450, 0, "3 days ago")
            );
            customerRepository.saveAll(customers);
            System.out.println(">> Seeded default customers");
        }

        // 4. Seed Initial Sample Invoices
        if (orderRepository.count() == 0) {
            Order o1 = new Order("INV-2024-0891", "Priya Sharma", "+91 98765 43210", "UPI", "Paid", 1705, 85, 292, 1912, "Today, 14:20");
            o1.addItem(new OrderItem("Basmati Rice 5kg", 649, 2, 1298));
            o1.addItem(new OrderItem("Whole Wheat Bread", 45, 3, 135));
            o1.addItem(new OrderItem("Amul Milk 1L", 68, 4, 272));

            Order o2 = new Order("INV-2024-0890", "Rahul Verma", "+91 98765 43211", "Card", "Paid", 1219, 61, 208, 1366, "Today, 13:05");
            o2.addItem(new OrderItem("Olive Oil 1L", 899, 1, 899));
            o2.addItem(new OrderItem("Green Tea 100g", 320, 1, 320));

            Order o3 = new Order("INV-2024-0889", "Walk-in Customer", "—", "Cash", "Paid", 580, 0, 104, 684, "Today, 11:45");
            o3.addItem(new OrderItem("Potato Chips 200g", 85, 4, 340));
            o3.addItem(new OrderItem("Orange Juice 1L", 120, 2, 240));

            orderRepository.saveAll(List.of(o1, o2, o3));

            // Initial logs
            InventoryLog l1 = new InventoryLog("Basmati Rice 5kg", "Stock In", "PO-2024-0234", 50, 42, "Today, 10:24", "Ravi K.");
            InventoryLog l2 = new InventoryLog("Amul Milk 1L", "Stock Out", "INV-2024-0891", -4, 9, "Today, 09:12", "Sarah A.");
            inventoryLogRepository.saveAll(List.of(l1, l2));
            System.out.println(">> Seeded initial sample invoices & inventory logs");
        }

        // 5. Seed Suppliers
        if (supplierRepository.count() == 0) {
            List<Supplier> sups = List.of(
                    new Supplier("sup-1", "Agro Supplies Pvt Ltd", "29ABCDE1234F1Z5", "Rajesh Kumar", "+91 98765 11111", 128, 0, "Active"),
                    new Supplier("sup-2", "Fresh Dairy Co.", "29FGHIJ5678K2Z6", "Suresh Patel", "+91 98765 22222", 92, 18240, "Active"),
                    new Supplier("sup-3", "Sunrise Beverages", "29KLMNO9012P3Z7", "Anita Sharma", "+91 98765 33333", 76, 9600, "Active"),
                    new Supplier("sup-4", "Packaging World", "29QRSTU3456V4Z8", "Vikram Singh", "+91 98765 44444", 54, 0, "Active")
            );
            supplierRepository.saveAll(sups);
            System.out.println(">> Seeded default suppliers");
        }

        // 6. Seed Purchase Orders
        if (purchaseOrderRepository.count() == 0) {
            List<PurchaseOrder> pos = List.of(
                    new PurchaseOrder("PO-2024-0234", "Agro Supplies Pvt Ltd", 4, 42500, "Paid", "Received", "17 Sep 2026"),
                    new PurchaseOrder("PO-2024-0233", "Fresh Dairy Co.", 6, 18240, "Partial", "Received", "17 Sep 2026"),
                    new PurchaseOrder("PO-2024-0232", "Sunrise Beverages", 3, 9600, "Unpaid", "Pending", "16 Sep 2026"),
                    new PurchaseOrder("PO-2024-0231", "Packaging World", 2, 5200, "Paid", "Received", "15 Sep 2026")
            );
            purchaseOrderRepository.saveAll(pos);
            System.out.println(">> Seeded default purchase orders");
        }

        // 7. Seed Returns
        if (returnRecordRepository.count() == 0) {
            List<ReturnRecord> rets = List.of(
                    new ReturnRecord("RET-2024-0042", "INV-2024-0887", "Sneha Reddy", "Basmati Rice 5kg", 649, "Damaged packaging", "Approved", "17 Sep 2026"),
                    new ReturnRecord("RET-2024-0041", "INV-2024-0883", "Amit Patel", "Olive Oil 1L", 899, "Wrong item selected", "Approved", "16 Sep 2026"),
                    new ReturnRecord("RET-2024-0040", "INV-2024-0879", "Rahul Verma", "Green Tea 100g", 320, "Changed mind", "Pending", "16 Sep 2026"),
                    new ReturnRecord("RET-2024-0039", "INV-2024-0871", "Priya Sharma", "Coffee Beans 250g", 480, "Quality dissatisfaction", "Approved", "15 Sep 2026")
            );
            returnRecordRepository.saveAll(rets);
            System.out.println(">> Seeded default return records");
        }

        // 8. Seed Store Settings
        if (storeSettingRepository.count() == 0) {
            StoreSetting setting = new StoreSetting();
            storeSettingRepository.save(setting);
            System.out.println(">> Seeded default store settings");
        }
    }
}
