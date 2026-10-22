package com.smartbuild.controller;

import com.smartbuild.dto.CostEstimateRequest;
import com.smartbuild.dto.CostEstimateResponse;
import com.smartbuild.model.CostEstimate;
import com.smartbuild.repository.CostEstimateRepository;
import com.smartbuild.service.CostEstimationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cost-estimate")
@CrossOrigin(origins = "*")
public class CostEstimateController {

    private final CostEstimationService costEstimationService;
    private final CostEstimateRepository costEstimateRepository;

    public CostEstimateController(CostEstimationService costEstimationService, CostEstimateRepository costEstimateRepository) {
        this.costEstimationService = costEstimationService;
        this.costEstimateRepository = costEstimateRepository;
    }

    @PostMapping
    public ResponseEntity<CostEstimateResponse> calculateEstimate(@RequestBody CostEstimateRequest req) {
        CostEstimateResponse res = costEstimationService.calculateAndSaveEstimate(req);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<CostEstimate> getLatestEstimateByProject(@PathVariable Long projectId) {
        Optional<CostEstimate> est = costEstimateRepository.findFirstByProjectIdOrderByCalculatedAtDesc(projectId);
        return est.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
