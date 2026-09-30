package com.nexuspos.dto;

public class CheckoutItemDto {
    private String id; // Product id
    private String name;
    private double price;
    private int qty;

    public CheckoutItemDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
}
