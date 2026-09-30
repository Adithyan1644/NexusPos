package com.nexuspos.controller;

import com.nexuspos.model.Supplier;
import com.nexuspos.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable String id) {
        return supplierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        if (supplier.getId() == null || supplier.getId().isBlank()) {
            supplier.setId("sup-" + System.currentTimeMillis());
        }
        return supplierRepository.save(supplier);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable String id, @RequestBody Supplier updates) {
        Optional<Supplier> supOpt = supplierRepository.findById(id);
        if (supOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Supplier s = supOpt.get();
        if (updates.getName() != null) s.setName(updates.getName());
        if (updates.getGstin() != null) s.setGstin(updates.getGstin());
        if (updates.getContact() != null) s.setContact(updates.getContact());
        if (updates.getPhone() != null) s.setPhone(updates.getPhone());
        if (updates.getStatus() != null) s.setStatus(updates.getStatus());
        s.setOrders(updates.getOrders());
        s.setOutstanding(updates.getOutstanding());

        return ResponseEntity.ok(supplierRepository.save(s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable String id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
