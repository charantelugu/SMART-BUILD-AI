package com.smartbuild.service;

import com.smartbuild.dto.BudgetOptimizationRequest;
import com.smartbuild.dto.BudgetOptimizationResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BudgetOptimizationService {

    public BudgetOptimizationResponse generateOptimizationSuggestions(BudgetOptimizationRequest req) {
        double budget = req.getBudget() != null ? req.getBudget() : 5000000.0;
        double estimatedCost = req.getEstimatedCost() != null ? req.getEstimatedCost() : 5800000.0;
        double diff = estimatedCost - budget;

        BudgetOptimizationResponse res = new BudgetOptimizationResponse();
        res.setBudget(budget);
        res.setEstimatedCost(estimatedCost);
        res.setIsOverBudget(diff > 0);
        res.setOverBudgetBy(Math.max(0, diff));

        List<Map<String, Object>> suggestions = new ArrayList<>();

        suggestions.add(Map.of(
                "id", "opt_1",
                "title", "Switch to Fly-Ash / AAC Blocks",
                "description", "Replacing standard red clay bricks with AAC lightweight blocks reduces masonry cost and dead load by 18%.",
                "potentialSavings", Math.round(diff * 0.22),
                "category", "Bricks & Masonry",
                "recommended", true
        ));

        suggestions.add(Map.of(
                "id", "opt_2",
                "title", "Optimize Tile Specifications",
                "description", "Use 2x2 ft Double Charge tiles in common areas and ceramic in utility/balconies instead of large slab tiles.",
                "potentialSavings", Math.round(diff * 0.18),
                "category", "Tiles",
                "recommended", true
        ));

        suggestions.add(Map.of(
                "id", "opt_3",
                "title", "Value-Engineered Interior Package",
                "description", "Use factory-finished prelaminated MDF/HDF for wardrobes and select acrylic laminate finishes over natural veneer.",
                "potentialSavings", Math.round(diff * 0.35),
                "category", "Interior",
                "recommended", true
        ));

        suggestions.add(Map.of(
                "id", "opt_4",
                "title", "Premium Paint Optimization",
                "description", "Use Royal Luxury Emulsion on focal walls and Premium Washable Emulsion on ceilings and secondary rooms.",
                "potentialSavings", Math.round(diff * 0.14),
                "category", "Paint",
                "recommended", false
        ));

        suggestions.add(Map.of(
                "id", "opt_5",
                "title", "Consolidate Plumbing Vertical Shafts",
                "description", "Stack bathrooms directly over ground floor wet areas to reduce pipe length and elbow fittings by 20%.",
                "potentialSavings", Math.round(diff * 0.11),
                "category", "Plumbing",
                "recommended", true
        ));

        res.setSuggestions(suggestions);
        return res;
    }
}
