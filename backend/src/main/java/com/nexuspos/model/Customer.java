package com.nexuspos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String phone;

    private String email;

    private String type = "Regular"; // Regular, Silver, Gold

    private double totalSpent = 0.0;

    private double outstanding = 0.0;

    private String lastVisit = "Today";

    public Customer() {}

    public Customer(String id, String name, String phone, String email, String type, double totalSpent, double outstanding, String lastVisit) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.type = type;
        this.totalSpent = totalSpent;
        this.outstanding = outstanding;
        this.lastVisit = lastVisit;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(double totalSpent) { this.totalSpent = totalSpent; }

    public double getOutstanding() { return outstanding; }
    public void setOutstanding(double outstanding) { this.outstanding = outstanding; }

    public String getLastVisit() { return lastVisit; }
    public void setLastVisit(String lastVisit) { this.lastVisit = lastVisit; }
}
