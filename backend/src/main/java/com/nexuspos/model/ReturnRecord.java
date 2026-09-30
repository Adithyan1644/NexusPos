package com.nexuspos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "returns")
public class ReturnRecord {

    @Id
    private String id;

    private String invoice;

    private String customer;

    private String item;

    private double refund;

    private String reason;

    private String status = "Approved"; // Approved, Pending, Rejected

    private String date;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ReturnRecord() {}

    public ReturnRecord(String id, String invoice, String customer, String item, double refund, String reason, String status, String date) {
        this.id = id;
        this.invoice = invoice;
        this.customer = customer;
        this.item = item;
        this.refund = refund;
        this.reason = reason;
        this.status = status;
        this.date = date;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getInvoice() { return invoice; }
    public void setInvoice(String invoice) { this.invoice = invoice; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getItem() { return item; }
    public void setItem(String item) { this.item = item; }

    public double getRefund() { return refund; }
    public void setRefund(double refund) { this.refund = refund; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
