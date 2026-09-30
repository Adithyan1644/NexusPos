package com.nexuspos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String sku;

    private String barcode;

    private String category;

    private double cost;

    private double price;

    private int stock;

    private int minAlert = 15;

    private String emoji = "📦";

    private String status = "Active";

    public Product() {}

    public Product(String id, String name, String sku, String barcode, String category, double cost, double price, int stock, int minAlert, String emoji, String status) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.barcode = barcode;
        this.category = category;
        this.cost = cost;
        this.price = price;
        this.stock = stock;
        this.minAlert = minAlert;
        this.emoji = emoji;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public int getMinAlert() { return minAlert; }
    public void setMinAlert(int minAlert) { this.minAlert = minAlert; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
