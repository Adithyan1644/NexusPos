package com.nexuspos.dto;

import java.util.List;

public class CheckoutRequest {
    private String customerId;
    private String customerName;
    private String customerPhone;
    private String paymentMethod = "UPI";
    private double subtotal;
    private double discount;
    private double tax;
    private double total;
    private List<CheckoutItemDto> items;

    public CheckoutRequest() {}

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public double getTax() { return tax; }
    public void setTax(double tax) { this.tax = tax; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public List<CheckoutItemDto> getItems() { return items; }
    public void setItems(List<CheckoutItemDto> items) { this.items = items; }
}
