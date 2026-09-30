package com.nexuspos.dto;

import com.nexuspos.model.Order;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private double todayRevenue;
    private long ordersToday;
    private long lowStockCount;
    private long activeCustomersCount;
    private List<Order> recentInvoices;
    private Map<String, Integer> paymentBreakdown;
    private List<Map<String, Object>> weeklySales;

    public DashboardStatsResponse() {}

    public double getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(double todayRevenue) { this.todayRevenue = todayRevenue; }

    public long getOrdersToday() { return ordersToday; }
    public void setOrdersToday(long ordersToday) { this.ordersToday = ordersToday; }

    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }

    public long getActiveCustomersCount() { return activeCustomersCount; }
    public void setActiveCustomersCount(long activeCustomersCount) { this.activeCustomersCount = activeCustomersCount; }

    public List<Order> getRecentInvoices() { return recentInvoices; }
    public void setRecentInvoices(List<Order> recentInvoices) { this.recentInvoices = recentInvoices; }

    public Map<String, Integer> getPaymentBreakdown() { return paymentBreakdown; }
    public void setPaymentBreakdown(Map<String, Integer> paymentBreakdown) { this.paymentBreakdown = paymentBreakdown; }

    public List<Map<String, Object>> getWeeklySales() { return weeklySales; }
    public void setWeeklySales(List<Map<String, Object>> weeklySales) { this.weeklySales = weeklySales; }
}
