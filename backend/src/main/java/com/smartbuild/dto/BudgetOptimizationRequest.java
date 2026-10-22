package com.smartbuild.dto;

public class BudgetOptimizationRequest {
    private Double budget;
    private Double estimatedCost;

    public BudgetOptimizationRequest() {}

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
}
