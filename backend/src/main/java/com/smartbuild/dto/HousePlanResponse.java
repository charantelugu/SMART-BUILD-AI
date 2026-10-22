package com.smartbuild.dto;

import java.util.List;
import java.util.Map;

public class HousePlanResponse {
    private Double plotArea;
    private Double builtUpGroundArea;
    private Double totalBuiltUpArea;
    private String orientation;
    private Map<String, Integer> setbacks;
    private List<Map<String, String>> zones;
    private String disclaimer;

    public HousePlanResponse() {}

    public Double getPlotArea() { return plotArea; }
    public void setPlotArea(Double plotArea) { this.plotArea = plotArea; }

    public Double getBuiltUpGroundArea() { return builtUpGroundArea; }
    public void setBuiltUpGroundArea(Double builtUpGroundArea) { this.builtUpGroundArea = builtUpGroundArea; }

    public Double getTotalBuiltUpArea() { return totalBuiltUpArea; }
    public void setTotalBuiltUpArea(Double totalBuiltUpArea) { this.totalBuiltUpArea = totalBuiltUpArea; }

    public String getOrientation() { return orientation; }
    public void setOrientation(String orientation) { this.orientation = orientation; }

    public Map<String, Integer> getSetbacks() { return setbacks; }
    public void setSetbacks(Map<String, Integer> setbacks) { this.setbacks = setbacks; }

    public List<Map<String, String>> getZones() { return zones; }
    public void setZones(List<Map<String, String>> zones) { this.zones = zones; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
