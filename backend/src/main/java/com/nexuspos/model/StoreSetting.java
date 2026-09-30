package com.nexuspos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "store_settings")
public class StoreSetting {

    @Id
    private Long id = 1L;

    private String storeName = "Nexus Retail Supermarket";

    @Column(length = 500)
    private String address = "42 MG Road, Bengaluru, Karnataka 560001";

    private String gstin = "29ABCDE1234F1Z5";

    private String phone = "+91 80 4567 8900";

    private String email = "hello@nexusretail.com";

    private String currency = "₹";

    private int defaultTax = 18;

    private String roundingMode = "Nearest ₹1";

    private String invoicePrefix = "INV-2024-";

    private int lowStockThreshold = 20;

    @Column(length = 500)
    private String footerNote = "Thank you for shopping with us! Returns accepted within 7 days with original invoice.";

    public StoreSetting() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public int getDefaultTax() { return defaultTax; }
    public void setDefaultTax(int defaultTax) { this.defaultTax = defaultTax; }

    public String getRoundingMode() { return roundingMode; }
    public void setRoundingMode(String roundingMode) { this.roundingMode = roundingMode; }

    public String getInvoicePrefix() { return invoicePrefix; }
    public void setInvoicePrefix(String invoicePrefix) { this.invoicePrefix = invoicePrefix; }

    public int getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(int lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public String getFooterNote() { return footerNote; }
    public void setFooterNote(String footerNote) { this.footerNote = footerNote; }
}
