package com.smartbuild.controller;

import com.smartbuild.dto.HousePlanRequest;
import com.smartbuild.dto.HousePlanResponse;
import com.smartbuild.service.HousePlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/house-plan")
@CrossOrigin(origins = "*")
public class HousePlanController {

    private final HousePlanService housePlanService;

    public HousePlanController(HousePlanService housePlanService) {
        this.housePlanService = housePlanService;
    }

    @PostMapping("/generate")
    public ResponseEntity<HousePlanResponse> generatePlan(@RequestBody HousePlanRequest request) {
        HousePlanResponse plan = housePlanService.generateConceptualPlan(request);
        return ResponseEntity.ok(plan);
    }
}
