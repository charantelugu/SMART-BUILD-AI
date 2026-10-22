package com.smartbuild.repository;

import com.smartbuild.model.CostEstimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CostEstimateRepository extends JpaRepository<CostEstimate, Long> {
    Optional<CostEstimate> findFirstByProjectIdOrderByCalculatedAtDesc(Long projectId);
}
