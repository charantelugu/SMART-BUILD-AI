package com.smartbuild.dto;

import java.util.List;
import java.util.Map;

public class BudgetOptimizationResponse {
    private Double budget;
    private Double estimatedCost;
    private Double overBudgetBy;
    private Boolean isOverBudget;
    private List<Map<String, Object>> suggestions;

    public BudgetOptimizationResponse() {}

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public Double getOverBudgetBy() { return overBudgetBy; }
    public void setOverBudgetBy(Double overBudgetBy) { this.overBudgetBy = overBudgetBy; }

    public Boolean getIsOverBudget() { return isOverBudget; }
    public void setIsOverBudget(Boolean overBudget) { isOverBudget = overBudget; }

    public List<Map<String, Object>> getSuggestions() { return suggestions; }
    public void setSuggestions(List<Map<String, Object>> suggestions) { this.suggestions = suggestions; }
}
