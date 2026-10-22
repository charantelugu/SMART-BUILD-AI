package com.smartbuild.dto;

import java.util.Map;

public class CostEstimateResponse {
    private Double builtUpArea;
    private String quality;
    private Double ratePerSqFt;
    private Map<String, Long> breakdown;
    private Long totalMaterialCost;
    private Long totalEstimatedCost;

    public CostEstimateResponse() {}

    public Double getBuiltUpArea() { return builtUpArea; }
    public void setBuiltUpArea(Double builtUpArea) { this.builtUpArea = builtUpArea; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }

    public Double getRatePerSqFt() { return ratePerSqFt; }
    public void setRatePerSqFt(Double ratePerSqFt) { this.ratePerSqFt = ratePerSqFt; }

    public Map<String, Long> getBreakdown() { return breakdown; }
    public void setBreakdown(Map<String, Long> breakdown) { this.breakdown = breakdown; }

    public Long getTotalMaterialCost() { return totalMaterialCost; }
    public void setTotalMaterialCost(Long totalMaterialCost) { this.totalMaterialCost = totalMaterialCost; }

    public Long getTotalEstimatedCost() { return totalEstimatedCost; }
    public void setTotalEstimatedCost(Long totalEstimatedCost) { this.totalEstimatedCost = totalEstimatedCost; }
}
