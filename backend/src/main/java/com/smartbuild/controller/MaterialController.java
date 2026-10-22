package com.smartbuild.controller;

import com.smartbuild.model.Material;
import com.smartbuild.model.MaterialPrice;
import com.smartbuild.service.PricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MaterialController {

    private final PricingService pricingService;

    public MaterialController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping("/materials")
    public ResponseEntity<List<Material>> getMaterials() {
        return ResponseEntity.ok(pricingService.getAllMaterials());
    }

    @GetMapping("/material-prices")
    public ResponseEntity<List<Map<String, Object>>> getMaterialPrices() {
        return ResponseEntity.ok(pricingService.getAllMaterialPrices());
    }

    @PostMapping("/material-prices")
    public ResponseEntity<MaterialPrice> updateMaterialPrice(@RequestBody Map<String, Object> payload) {
        MaterialPrice updated = pricingService.updateOrAddPrice(payload);
        return ResponseEntity.ok(updated);
    }
}
