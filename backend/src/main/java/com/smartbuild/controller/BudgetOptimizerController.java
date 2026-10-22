package com.smartbuild.controller;

import com.smartbuild.dto.BudgetOptimizationRequest;
import com.smartbuild.dto.BudgetOptimizationResponse;
import com.smartbuild.service.BudgetOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*")
public class BudgetOptimizerController {

    private final BudgetOptimizationService budgetOptimizationService;

    public BudgetOptimizerController(BudgetOptimizationService budgetOptimizationService) {
        this.budgetOptimizationService = budgetOptimizationService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<BudgetOptimizationResponse> optimizeBudget(@RequestBody BudgetOptimizationRequest req) {
        BudgetOptimizationResponse response = budgetOptimizationService.generateOptimizationSuggestions(req);
        return ResponseEntity.ok(response);
    }
}
