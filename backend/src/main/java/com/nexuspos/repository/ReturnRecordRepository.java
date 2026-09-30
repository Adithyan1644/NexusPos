package com.nexuspos.repository;

import com.nexuspos.model.ReturnRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnRecordRepository extends JpaRepository<ReturnRecord, String> {
    List<ReturnRecord> findAllByOrderByCreatedAtDesc();
}
