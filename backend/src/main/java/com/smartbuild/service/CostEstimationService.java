package com.smartbuild.service;

import com.smartbuild.dto.CostEstimateRequest;
import com.smartbuild.dto.CostEstimateResponse;
import com.smartbuild.model.CostEstimate;
import com.smartbuild.repository.CostEstimateRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class CostEstimationService {

    private final CostEstimateRepository costEstimateRepository;

    public CostEstimationService(CostEstimateRepository costEstimateRepository) {
        this.costEstimateRepository = costEstimateRepository;
    }

    public CostEstimateResponse calculateAndSaveEstimate(CostEstimateRequest req) {
        double area = req.getBuiltUpArea() != null ? req.getBuiltUpArea() : 
                (req.getLandArea() != null ? req.getLandArea() * 1.6 : 2400.0);

        String quality = req.getConstructionQuality() != null ? req.getConstructionQuality() : "Standard";

        double ratePerSqFt = 1750.0;
        if ("Basic".equalsIgnoreCase(quality)) ratePerSqFt = 1400.0;
        else if ("Premium".equalsIgnoreCase(quality)) ratePerSqFt = 2200.0;
        else if ("Luxury".equalsIgnoreCase(quality)) ratePerSqFt = 2950.0;

        double baseCivilCost = area * ratePerSqFt;

        Map<String, Long> breakdown = new HashMap<>();
        long cementCost = Math.round(baseCivilCost * 0.16);
        long steelCost = Math.round(baseCivilCost * 0.20);
        long bricksCost = Math.round(baseCivilCost * 0.08);
        long tilesCost = Math.round(baseCivilCost * 0.07);
        long pipesCost = Math.round(baseCivilCost * 0.03);
        long electricalCost = Math.round(baseCivilCost * 0.06);
        long plumbingCost = Math.round(baseCivilCost * 0.05);
        long paintCost = Math.round(baseCivilCost * 0.04);
        long sandCost = Math.round(baseCivilCost * 0.06);
        long aggregatesCost = Math.round(baseCivilCost * 0.05);

        long labourCost = Math.round(baseCivilCost * 0.12);
        long doorsWindowsCost = Math.round(baseCivilCost * 0.05);
        long interiorCost = req.getInteriorBudget() != null ? Math.round(req.getInteriorBudget()) : Math.round(baseCivilCost * 0.15);
        long otherCosts = Math.round(baseCivilCost * 0.04);

        breakdown.put("cement", cementCost);
        breakdown.put("steel", steelCost);
        breakdown.put("bricks", bricksCost);
        breakdown.put("tiles", tilesCost);
        breakdown.put("pipes", pipesCost);
        breakdown.put("electrical", electricalCost);
        breakdown.put("plumbing", plumbingCost);
        breakdown.put("paint", paintCost);
        breakdown.put("sand", sandCost);
        breakdown.put("aggregates", aggregatesCost);
        breakdown.put("labour", labourCost);
        breakdown.put("doorsWindows", doorsWindowsCost);
        breakdown.put("interior", interiorCost);
        breakdown.put("otherCosts", otherCosts);

        long totalMaterialCost = cementCost + steelCost + bricksCost + tilesCost + pipesCost +
                electricalCost + plumbingCost + paintCost + sandCost + aggregatesCost;

        long totalEstimatedCost = totalMaterialCost + labourCost + doorsWindowsCost + interiorCost + otherCosts;

        // Persist to database
        CostEstimate entity = new CostEstimate();
        entity.setProjectId(req.getProjectId() != null ? req.getProjectId() : 101L);
        entity.setBuiltUpArea(area);
        entity.setRatePerSqFt(ratePerSqFt);
        entity.setTotalMaterialCost((double) totalMaterialCost);
        entity.setLabourCost((double) labourCost);
        entity.setInteriorCost((double) interiorCost);
        entity.setDoorsWindowsCost((double) doorsWindowsCost);
        entity.setOtherCosts((double) otherCosts);
        entity.setTotalEstimatedCost((double) totalEstimatedCost);
        entity.setCalculatedAt(LocalDateTime.now());
        costEstimateRepository.save(entity);

        CostEstimateResponse res = new CostEstimateResponse();
        res.setBuiltUpArea(area);
        res.setQuality(quality);
        res.setRatePerSqFt(ratePerSqFt);
        res.setBreakdown(breakdown);
        res.setTotalMaterialCost(totalMaterialCost);
        res.setTotalEstimatedCost(totalEstimatedCost);

        return res;
    }
}
