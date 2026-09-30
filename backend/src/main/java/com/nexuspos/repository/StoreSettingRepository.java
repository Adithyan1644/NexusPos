package com.nexuspos.repository;

import com.nexuspos.model.StoreSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreSettingRepository extends JpaRepository<StoreSetting, Long> {
}
