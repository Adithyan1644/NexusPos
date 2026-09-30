package com.nexuspos.controller;

import com.nexuspos.model.Customer;
import com.nexuspos.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        if (customer.getId() == null || customer.getId().isBlank()) {
            customer.setId("cust-" + System.currentTimeMillis());
        }
        return customerRepository.save(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable String id, @RequestBody Customer updates) {
        Optional<Customer> custOpt = customerRepository.findById(id);
        if (custOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer c = custOpt.get();
        if (updates.getName() != null) c.setName(updates.getName());
        if (updates.getPhone() != null) c.setPhone(updates.getPhone());
        if (updates.getEmail() != null) c.setEmail(updates.getEmail());
        if (updates.getType() != null) c.setType(updates.getType());
        c.setTotalSpent(updates.getTotalSpent());
        c.setOutstanding(updates.getOutstanding());
        if (updates.getLastVisit() != null) c.setLastVisit(updates.getLastVisit());

        return ResponseEntity.ok(customerRepository.save(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
