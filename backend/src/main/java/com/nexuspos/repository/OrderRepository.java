package com.nexuspos.repository;

import com.nexuspos.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(o.total), 0.0) FROM Order o WHERE o.createdAt >= :since")
    Double sumTotalSince(LocalDateTime since);

    long countByCreatedAtAfter(LocalDateTime since);
}
