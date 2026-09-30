package com.nexuspos.controller;

import com.nexuspos.model.InventoryLog;
import com.nexuspos.model.Product;
import com.nexuspos.model.ReturnRecord;
import com.nexuspos.repository.InventoryLogRepository;
import com.nexuspos.repository.ProductRepository;
import com.nexuspos.repository.ReturnRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/returns")
public class ReturnController {

    @Autowired
    private ReturnRecordRepository returnRecordRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @GetMapping
    public List<ReturnRecord> getAllReturns() {
        return returnRecordRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    @Transactional
    public ReturnRecord createReturn(@RequestBody ReturnRecord ret) {
        if (ret.getId() == null || ret.getId().isBlank()) {
            long count = returnRecordRepository.count();
            ret.setId("RET-2024-" + String.format("%04d", 43 + count));
        }

        if (ret.getDate() == null || ret.getDate().isBlank()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            ret.setDate(LocalDate.now().format(formatter));
        }

        if (ret.getStatus() == null || ret.getStatus().isBlank()) {
            ret.setStatus("Approved");
        }

        // If approved, automatically restore 1 unit back into stock
        if ("Approved".equalsIgnoreCase(ret.getStatus()) && ret.getItem() != null) {
            Optional<Product> prodOpt = productRepository.findAll().stream()
                    .filter(p -> p.getName().equalsIgnoreCase(ret.getItem().trim()))
                    .findFirst();

            if (prodOpt.isPresent()) {
                Product prod = prodOpt.get();
                prod.setStock(prod.getStock() + 1);
                productRepository.save(prod);

                // Add inventory ledger record
                InventoryLog log = new InventoryLog(
                        prod.getName(),
                        "Stock In",
                        ret.getId(),
                        1,
                        prod.getStock(),
                        "Just now",
                        "Customer Return"
                );
                inventoryLogRepository.save(log);
            }
        }

        return returnRecordRepository.save(ret);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReturnRecord> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<ReturnRecord> retOpt = returnRecordRepository.findById(id);
        if (retOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ReturnRecord r = retOpt.get();
        if (body.containsKey("status")) {
            r.setStatus(body.get("status"));
        }
        return ResponseEntity.ok(returnRecordRepository.save(r));
    }
}
