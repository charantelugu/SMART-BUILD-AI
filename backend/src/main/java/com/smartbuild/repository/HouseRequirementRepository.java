package com.smartbuild.repository;

import com.smartbuild.model.HouseRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HouseRequirementRepository extends JpaRepository<HouseRequirement, Long> {
    Optional<HouseRequirement> findByProjectId(Long projectId);
}
