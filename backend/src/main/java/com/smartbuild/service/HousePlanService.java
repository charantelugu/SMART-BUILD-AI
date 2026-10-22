package com.smartbuild.service;

import com.smartbuild.dto.HousePlanRequest;
import com.smartbuild.dto.HousePlanResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HousePlanService {

    public HousePlanResponse generateConceptualPlan(HousePlanRequest req) {
        double length = req.getLandLength() != null ? req.getLandLength() : 50.0;
        double width = req.getLandWidth() != null ? req.getLandWidth() : 30.0;
        String facing = req.getFacing() != null ? req.getFacing() : "North-East";
        String floors = req.getFloors() != null ? req.getFloors() : "G + 1";

        double plotArea = length * width;
        int frontSetback = (int) Math.max(5, Math.round(length * 0.10));
        int rearSetback = (int) Math.max(3, Math.round(length * 0.08));
        int sideSetback = (int) Math.max(3, Math.round(width * 0.08));

        double builtLength = length - (frontSetback + rearSetback);
        double builtWidth = width - (sideSetback * 2);
        double builtUpGroundArea = builtLength * builtWidth;

        double floorMultiplier = 1.0;
        if (floors.contains("G + 1")) floorMultiplier = 1.85;
        else if (floors.contains("G + 2")) floorMultiplier = 2.70;
        else if (floors.contains("G + 3")) floorMultiplier = 3.50;

        double totalBuiltUpArea = builtUpGroundArea * floorMultiplier;

        HousePlanResponse response = new HousePlanResponse();
        response.setPlotArea(plotArea);
        response.setBuiltUpGroundArea(builtUpGroundArea);
        response.setTotalBuiltUpArea(Math.round(totalBuiltUpArea * 10.0) / 10.0);
        response.setOrientation(facing);

        Map<String, Integer> setbacks = new HashMap<>();
        setbacks.put("front", frontSetback);
        setbacks.put("rear", rearSetback);
        setbacks.put("sides", sideSetback);
        response.setSetbacks(setbacks);

        List<Map<String, String>> zones = new ArrayList<>();
        zones.add(Map.of("name", "Car Porch & Entry Foyer", "dimensions", (frontSetback + 8) + "x" + Math.round(builtWidth * 0.45) + " ft", "vastu", "North-West / North"));
        zones.add(Map.of("name", "Formal Living Room", "dimensions", Math.round(builtLength * 0.35) + "x" + Math.round(builtWidth * 0.55) + " ft", "vastu", "North-East / East"));
        zones.add(Map.of("name", "Pooja Room (Ishanya)", "dimensions", "6x8 ft", "vastu", "North-East Corner"));
        zones.add(Map.of("name", "Modular Kitchen & Utility", "dimensions", Math.round(builtLength * 0.28) + "x" + Math.round(builtWidth * 0.35) + " ft", "vastu", "South-East (Agni)"));
        zones.add(Map.of("name", "Central Dining Hall", "dimensions", "14x12 ft", "vastu", "Central / East"));
        zones.add(Map.of("name", "Master Bedroom with Ensuite", "dimensions", Math.round(builtLength * 0.32) + "x" + Math.round(builtWidth * 0.45) + " ft", "vastu", "South-West (Nairuthi)"));
        zones.add(Map.of("name", "Balcony & Sit-out Deck", "dimensions", "16x6 ft", "vastu", "North / East"));
        response.setZones(zones);

        response.setDisclaimer("Conceptual planning aid. It is not a construction-ready architectural or structural drawing. Prior to execution, please consult a certified structural engineer.");
        return response;
    }
}
