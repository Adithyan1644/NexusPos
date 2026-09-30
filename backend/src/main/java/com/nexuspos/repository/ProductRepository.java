package com.nexuspos.repository;

import com.nexuspos.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategoryIgnoreCase(String category);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR p.barcode LIKE CONCAT('%', :query, '%')")
    List<Product> search(String query);

    @Query("SELECT p FROM Product p WHERE p.stock <= p.minAlert")
    List<Product> findLowStock();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock <= p.minAlert")
    long countLowStock();
}
