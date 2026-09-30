package com.nexuspos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_logs")
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String product;

    @Column(nullable = false)
    private String type; // "Stock In", "Stock Out", "Adjustment"

    private String ref; // "INV-2024-XXXX" or "PO-2024-XXXX"

    @Column(name = "qty_change")
    private int change;

    private int balance;

    private String date;

    private String loggedBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    public InventoryLog() {}

    public InventoryLog(String product, String type, String ref, int change, int balance, String date, String loggedBy) {
        this.product = product;
        this.type = type;
        this.ref = ref;
        this.change = change;
        this.balance = balance;
        this.date = date;
        this.loggedBy = loggedBy;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRef() { return ref; }
    public void setRef(String ref) { this.ref = ref; }

    public int getChange() { return change; }
    public void setChange(int change) { this.change = change; }

    public int getBalance() { return balance; }
    public void setBalance(int balance) { this.balance = balance; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getLoggedBy() { return loggedBy; }
    public void setLoggedBy(String loggedBy) { this.loggedBy = loggedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
