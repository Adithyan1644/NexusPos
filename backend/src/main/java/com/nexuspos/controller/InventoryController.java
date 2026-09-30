package com.nexuspos.controller;

import com.nexuspos.model.InventoryLog;
import com.nexuspos.model.Product;
import com.nexuspos.repository.InventoryLogRepository;
import com.nexuspos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/logs")
    public List<InventoryLog> getLogs() {
        return inventoryLogRepository.findAll();
    }

    @PostMapping("/adjust")
    @Transactional
    public ResponseEntity<?> adjustStock(@RequestBody Map<String, Object> payload) {
        String productId = (String) payload.get("productId");
        String type = (String) payload.get("type"); // "Stock In", "Stock Out", "Adjustment"
        Number qtyNum = (Number) payload.get("quantity");
        String reason = (String) payload.get("reason");

        if (productId == null || qtyNum == null) {
            return ResponseEntity.badRequest().body("productId and quantity are required.");
        }

        int qty = qtyNum.intValue();
        Optional<Product> prodOpt = productRepository.findById(productId);
        if (prodOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product prod = prodOpt.get();
        int delta = 0;
        int newStock = prod.getStock();

        if ("Stock In".equalsIgnoreCase(type)) {
            delta = Math.abs(qty);
            newStock += delta;
        } else if ("Stock Out".equalsIgnoreCase(type) || "Damaged".equalsIgnoreCase(type)) {
            delta = -Math.abs(qty);
            newStock = Math.max(0, newStock + delta);
        } else {
            // Adjustment
            delta = qty;
            newStock = Math.max(0, newStock + delta);
        }

        prod.setStock(newStock);
        productRepository.save(prod);

        long count = inventoryLogRepository.count();
        String ref = "ADJ-" + String.format("%05d", 113 + count);

        InventoryLog log = new InventoryLog(
                prod.getName(),
                type != null ? type : "Adjustment",
                ref,
                delta,
                newStock,
                "Just now",
                reason != null && !reason.isBlank() ? reason : "Store Manager"
        );

        InventoryLog savedLog = inventoryLogRepository.save(log);

        return ResponseEntity.ok(Map.of(
                "product", prod,
                "log", savedLog,
                "newStock", newStock
        ));
    }
}
