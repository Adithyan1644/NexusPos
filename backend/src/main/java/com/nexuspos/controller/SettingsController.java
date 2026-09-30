package com.nexuspos.controller;

import com.nexuspos.model.StoreSetting;
import com.nexuspos.repository.StoreSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private StoreSettingRepository storeSettingRepository;

    @GetMapping
    public StoreSetting getSettings() {
        return storeSettingRepository.findById(1L).orElseGet(() -> {
            StoreSetting defaults = new StoreSetting();
            return storeSettingRepository.save(defaults);
        });
    }

    @PutMapping
    public ResponseEntity<StoreSetting> updateSettings(@RequestBody StoreSetting updates) {
        StoreSetting settings = storeSettingRepository.findById(1L).orElseGet(StoreSetting::new);
        settings.setId(1L);

        if (updates.getStoreName() != null) settings.setStoreName(updates.getStoreName());
        if (updates.getAddress() != null) settings.setAddress(updates.getAddress());
        if (updates.getGstin() != null) settings.setGstin(updates.getGstin());
        if (updates.getPhone() != null) settings.setPhone(updates.getPhone());
        if (updates.getEmail() != null) settings.setEmail(updates.getEmail());
        if (updates.getCurrency() != null) settings.setCurrency(updates.getCurrency());
        if (updates.getDefaultTax() > 0) settings.setDefaultTax(updates.getDefaultTax());
        if (updates.getRoundingMode() != null) settings.setRoundingMode(updates.getRoundingMode());
        if (updates.getInvoicePrefix() != null) settings.setInvoicePrefix(updates.getInvoicePrefix());
        if (updates.getLowStockThreshold() > 0) settings.setLowStockThreshold(updates.getLowStockThreshold());
        if (updates.getFooterNote() != null) settings.setFooterNote(updates.getFooterNote());

        return ResponseEntity.ok(storeSettingRepository.save(settings));
    }
}
