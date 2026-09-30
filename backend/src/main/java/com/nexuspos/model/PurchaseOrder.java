package com.nexuspos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    private String id;

    private String supplier;

    private int itemsCount;

    private double total;

    private String payment = "Paid"; // Paid, Partial, Unpaid

    private String status = "Received"; // Received, Pending

    private String date;

    private LocalDateTime createdAt = LocalDateTime.now();

    public PurchaseOrder() {}

    public PurchaseOrder(String id, String supplier, int itemsCount, double total, String payment, String status, String date) {
        this.id = id;
        this.supplier = supplier;
        this.itemsCount = itemsCount;
        this.total = total;
        this.payment = payment;
        this.status = status;
        this.date = date;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public int getItemsCount() { return itemsCount; }
    public void setItemsCount(int itemsCount) { this.itemsCount = itemsCount; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getPayment() { return payment; }
    public void setPayment(String payment) { this.payment = payment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
