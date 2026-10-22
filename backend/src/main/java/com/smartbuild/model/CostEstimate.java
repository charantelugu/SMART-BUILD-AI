package com.smartbuild.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cost_estimates")
public class CostEstimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "built_up_area", nullable = false)
    private Double builtUpArea;

    @Column(name = "rate_per_sqft", nullable = false)
    private Double ratePerSqFt;

    @Column(name = "total_material_cost", nullable = false)
    private Double totalMaterialCost;

    @Column(name = "labour_cost", nullable = false)
    private Double labourCost;

    @Column(name = "interior_cost", nullable = false)
    private Double interiorCost;

    @Column(name = "doors_windows_cost", nullable = false)
    private Double doorsWindowsCost;

    @Column(name = "other_costs", nullable = false)
    private Double otherCosts;

    @Column(name = "total_estimated_cost", nullable = false)
    private Double totalEstimatedCost;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt = LocalDateTime.now();

    public CostEstimate() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Double getBuiltUpArea() { return builtUpArea; }
    public void setBuiltUpArea(Double builtUpArea) { this.builtUpArea = builtUpArea; }

    public Double getRatePerSqFt() { return ratePerSqFt; }
    public void setRatePerSqFt(Double ratePerSqFt) { this.ratePerSqFt = ratePerSqFt; }

    public Double getTotalMaterialCost() { return totalMaterialCost; }
    public void setTotalMaterialCost(Double totalMaterialCost) { this.totalMaterialCost = totalMaterialCost; }

    public Double getLabourCost() { return labourCost; }
    public void setLabourCost(Double labourCost) { this.labourCost = labourCost; }

    public Double getInteriorCost() { return interiorCost; }
    public void setInteriorCost(Double interiorCost) { this.interiorCost = interiorCost; }

    public Double getDoorsWindowsCost() { return doorsWindowsCost; }
    public void setDoorsWindowsCost(Double doorsWindowsCost) { this.doorsWindowsCost = doorsWindowsCost; }

    public Double getOtherCosts() { return otherCosts; }
    public void setOtherCosts(Double otherCosts) { this.otherCosts = otherCosts; }

    public Double getTotalEstimatedCost() { return totalEstimatedCost; }
    public void setTotalEstimatedCost(Double totalEstimatedCost) { this.totalEstimatedCost = totalEstimatedCost; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}
