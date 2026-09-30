package com.nexuspos.controller;

import com.nexuspos.dto.CheckoutItemDto;
import com.nexuspos.dto.CheckoutRequest;
import com.nexuspos.model.Customer;
import com.nexuspos.model.InventoryLog;
import com.nexuspos.model.Order;
import com.nexuspos.model.OrderItem;
import com.nexuspos.model.Product;
import com.nexuspos.repository.CustomerRepository;
import com.nexuspos.repository.InventoryLogRepository;
import com.nexuspos.repository.OrderRepository;
import com.nexuspos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class PosOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart cannot be empty.");
        }

        // Generate unique Invoice ID e.g. INV-2024-0895
        long count = orderRepository.count();
        String invoiceId = "INV-2024-" + String.format("%04d", 892 + count);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
        String formattedDate = LocalDateTime.now().format(formatter);

        String customerName = request.getCustomerName() != null ? request.getCustomerName() : "Walk-in Customer";
        String customerPhone = request.getCustomerPhone() != null ? request.getCustomerPhone() : "—";

        Order order = new Order(
                invoiceId,
                customerName,
                customerPhone,
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI",
                "Paid",
                request.getSubtotal(),
                request.getDiscount(),
                request.getTax(),
                request.getTotal(),
                formattedDate
        );

        // Process line items and decrement product inventory
        for (CheckoutItemDto itemDto : request.getItems()) {
            OrderItem item = new OrderItem(
                    itemDto.getName(),
                    itemDto.getPrice(),
                    itemDto.getQty(),
                    itemDto.getPrice() * itemDto.getQty()
            );
            order.addItem(item);

            // Deduct stock in database
            if (itemDto.getId() != null) {
                Optional<Product> prodOpt = productRepository.findById(itemDto.getId());
                if (prodOpt.isPresent()) {
                    Product prod = prodOpt.get();
                    int newStock = Math.max(0, prod.getStock() - itemDto.getQty());
                    prod.setStock(newStock);
                    productRepository.save(prod);

                    // Add to inventory ledger log
                    InventoryLog log = new InventoryLog(
                            prod.getName(),
                            "Stock Out",
                            invoiceId,
                            -itemDto.getQty(),
                            newStock,
                            "Just now",
                            "POS Cashier"
                    );
                    inventoryLogRepository.save(log);
                }
            }
        }

        // Update customer total spending if known customer
        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(c -> {
                c.setTotalSpent(c.getTotalSpent() + request.getTotal());
                c.setLastVisit("Today");
                customerRepository.save(c);
            });
        }

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }
}
