package com.nexuspos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String gstin;

    private String contact;

    private String phone;

    private int orders = 0;

    private double outstanding = 0.0;

    private String status = "Active";

    public Supplier() {}

    public Supplier(String id, String name, String gstin, String contact, String phone, int orders, double outstanding, String status) {
        this.id = id;
        this.name = name;
        this.gstin = gstin;
        this.contact = contact;
        this.phone = phone;
        this.orders = orders;
        this.outstanding = outstanding;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public int getOrders() { return orders; }
    public void setOrders(int orders) { this.orders = orders; }

    public double getOutstanding() { return outstanding; }
    public void setOutstanding(double outstanding) { this.outstanding = outstanding; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
