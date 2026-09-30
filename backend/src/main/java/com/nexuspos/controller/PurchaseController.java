package com.nexuspos.controller;

import com.nexuspos.model.PurchaseOrder;
import com.nexuspos.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @GetMapping
    public List<PurchaseOrder> getAllPurchases() {
        return purchaseOrderRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public PurchaseOrder createPurchase(@RequestBody PurchaseOrder order) {
        if (order.getId() == null || order.getId().isBlank()) {
            long count = purchaseOrderRepository.count();
            order.setId("PO-2024-" + String.format("%04d", 235 + count));
        }

        if (order.getDate() == null || order.getDate().isBlank()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            order.setDate(LocalDate.now().format(formatter));
        }

        return purchaseOrderRepository.save(order);
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrder> receivePurchase(@PathVariable String id) {
        Optional<PurchaseOrder> poOpt = purchaseOrderRepository.findById(id);
        if (poOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PurchaseOrder po = poOpt.get();
        po.setStatus("Received");
        po.setPayment("Paid");
        return ResponseEntity.ok(purchaseOrderRepository.save(po));
    }
}
