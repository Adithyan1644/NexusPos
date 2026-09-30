package com.nexuspos.controller;

import com.nexuspos.model.Order;
import com.nexuspos.model.Product;
import com.nexuspos.model.ReturnRecord;
import com.nexuspos.model.Supplier;
import com.nexuspos.repository.OrderRepository;
import com.nexuspos.repository.ProductRepository;
import com.nexuspos.repository.ReturnRecordRepository;
import com.nexuspos.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReturnRecordRepository returnRecordRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @GetMapping("/summary")
    public Map<String, Object> getReportsSummary() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<ReturnRecord> returns = returnRecordRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findAll();

        double totalRevenue = orders.stream().mapToDouble(Order::getTotal).sum();
        double totalTax = orders.stream().mapToDouble(Order::getTax).sum();
        double totalDiscount = orders.stream().mapToDouble(Order::getDiscount).sum();

        double inventoryCostValue = products.stream().mapToDouble(p -> p.getCost() * p.getStock()).sum();
        double inventoryRetailValue = products.stream().mapToDouble(p -> p.getPrice() * p.getStock()).sum();

        double totalRefunded = returns.stream().mapToDouble(ReturnRecord::getRefund).sum();
        double totalSupplierOutstanding = suppliers.stream().mapToDouble(Supplier::getOutstanding).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("totalOrders", orders.size());
        summary.put("totalTaxCollected", totalTax);
        summary.put("totalDiscountGiven", totalDiscount);
        summary.put("inventoryCostValue", inventoryCostValue);
        summary.put("inventoryRetailValue", inventoryRetailValue);
        summary.put("totalProducts", products.size());
        summary.put("totalReturnsCount", returns.size());
        summary.put("totalRefundedValue", totalRefunded);
        summary.put("totalSupplierOutstanding", totalSupplierOutstanding);

        return summary;
    }
}
