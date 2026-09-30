package com.nexuspos.controller;

import com.nexuspos.model.Product;
import com.nexuspos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (search != null && !search.trim().isEmpty()) {
            return productRepository.search(search.trim());
        }

        if (category != null && !category.equalsIgnoreCase("All Items") && !category.equalsIgnoreCase("All Categories")) {
            return productRepository.findByCategoryIgnoreCase(category);
        }

        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        if (product.getId() == null || product.getId().isBlank()) {
            product.setId("prod-" + System.currentTimeMillis());
        }
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product updates) {
        Optional<Product> prodOpt = productRepository.findById(id);
        if (prodOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product p = prodOpt.get();
        if (updates.getName() != null) p.setName(updates.getName());
        if (updates.getSku() != null) p.setSku(updates.getSku());
        if (updates.getBarcode() != null) p.setBarcode(updates.getBarcode());
        if (updates.getCategory() != null) p.setCategory(updates.getCategory());
        if (updates.getPrice() > 0) p.setPrice(updates.getPrice());
        if (updates.getCost() > 0) p.setCost(updates.getCost());
        p.setStock(updates.getStock());
        if (updates.getMinAlert() > 0) p.setMinAlert(updates.getMinAlert());
        if (updates.getEmoji() != null) p.setEmoji(updates.getEmoji());
        if (updates.getStatus() != null) p.setStatus(updates.getStatus());

        return ResponseEntity.ok(productRepository.save(p));
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStock() {
        return productRepository.findLowStock();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
