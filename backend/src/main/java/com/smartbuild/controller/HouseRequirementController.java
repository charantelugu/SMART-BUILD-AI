package com.smartbuild.controller;

import com.smartbuild.model.HouseRequirement;
import com.smartbuild.repository.HouseRequirementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/house-requirements")
@CrossOrigin(origins = "*")
public class HouseRequirementController {

    private final HouseRequirementRepository houseRequirementRepository;

    public HouseRequirementController(HouseRequirementRepository houseRequirementRepository) {
        this.houseRequirementRepository = houseRequirementRepository;
    }

    @PostMapping
    public ResponseEntity<HouseRequirement> saveRequirements(@RequestBody HouseRequirement req) {
        HouseRequirement saved = houseRequirementRepository.save(req);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<HouseRequirement> getByProjectId(@PathVariable Long projectId) {
        Optional<HouseRequirement> req = houseRequirementRepository.findByProjectId(projectId);
        return req.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
