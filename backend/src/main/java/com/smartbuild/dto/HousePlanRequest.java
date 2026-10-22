package com.smartbuild.dto;

import java.util.Map;

public class HousePlanRequest {
    private Double landLength;
    private Double landWidth;
    private String facing;
    private Double roadWidth;
    private String floors;
    private String quality;
    private Map<String, Integer> requirements;

    public HousePlanRequest() {}

    public Double getLandLength() { return landLength; }
    public void setLandLength(Double landLength) { this.landLength = landLength; }

    public Double getLandWidth() { return landWidth; }
    public void setLandWidth(Double landWidth) { this.landWidth = landWidth; }

    public String getFacing() { return facing; }
    public void setFacing(String facing) { this.facing = facing; }

    public Double getRoadWidth() { return roadWidth; }
    public void setRoadWidth(Double roadWidth) { this.roadWidth = roadWidth; }

    public String getFloors() { return floors; }
    public void setFloors(String floors) { this.floors = floors; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }

    public Map<String, Integer> getRequirements() { return requirements; }
    public void setRequirements(Map<String, Integer> requirements) { this.requirements = requirements; }
}
