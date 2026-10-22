package com.smartbuild.dto;

import java.util.Map;

public class CostEstimateRequest {
    private Long projectId;
    private Double landArea;
    private Double builtUpArea;
    private String floors;
    private String constructionQuality;
    private Double interiorBudget;
    private Map<String, Integer> roomCounts;

    public CostEstimateRequest() {}

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Double getLandArea() { return landArea; }
    public void setLandArea(Double landArea) { this.landArea = landArea; }

    public Double getBuiltUpArea() { return builtUpArea; }
    public void setBuiltUpArea(Double builtUpArea) { this.builtUpArea = builtUpArea; }

    public String getFloors() { return floors; }
    public void setFloors(String floors) { this.floors = floors; }

    public String getConstructionQuality() { return constructionQuality; }
    public void setConstructionQuality(String constructionQuality) { this.constructionQuality = constructionQuality; }

    public Double getInteriorBudget() { return interiorBudget; }
    public void setInteriorBudget(Double interiorBudget) { this.interiorBudget = interiorBudget; }

    public Map<String, Integer> getRoomCounts() { return roomCounts; }
    public void setRoomCounts(Map<String, Integer> roomCounts) { this.roomCounts = roomCounts; }
}
