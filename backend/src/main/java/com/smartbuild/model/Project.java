package com.smartbuild.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    private String location;

    @Column(name = "land_length", nullable = false)
    private Double landLength;

    @Column(name = "land_width", nullable = false)
    private Double landWidth;

    @Column(name = "land_area", nullable = false)
    private Double landArea;

    @Column(name = "road_width")
    private Double roadWidth;

    private String facing;
    private String floors;
    private Double budget;

    @Column(name = "construction_quality")
    private String constructionQuality;

    @Column(name = "design_style")
    private String designStyle;

    @Column(name = "exterior_style")
    private String exteriorStyle;

    @Column(name = "living_room_style")
    private String livingRoomStyle;

    @Column(name = "bedroom_style")
    private String bedroomStyle;

    @Column(name = "kitchen_style")
    private String kitchenStyle;

    @Column(name = "bathroom_style")
    private String bathroomStyle;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Project() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getLandLength() { return landLength; }
    public void setLandLength(Double landLength) { this.landLength = landLength; }

    public Double getLandWidth() { return landWidth; }
    public void setLandWidth(Double landWidth) { this.landWidth = landWidth; }

    public Double getLandArea() { return landArea; }
    public void setLandArea(Double landArea) { this.landArea = landArea; }

    public Double getRoadWidth() { return roadWidth; }
    public void setRoadWidth(Double roadWidth) { this.roadWidth = roadWidth; }

    public String getFacing() { return facing; }
    public void setFacing(String facing) { this.facing = facing; }

    public String getFloors() { return floors; }
    public void setFloors(String floors) { this.floors = floors; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public String getConstructionQuality() { return constructionQuality; }
    public void setConstructionQuality(String constructionQuality) { this.constructionQuality = constructionQuality; }

    public String getDesignStyle() { return designStyle; }
    public void setDesignStyle(String designStyle) { this.designStyle = designStyle; }

    public String getExteriorStyle() { return exteriorStyle; }
    public void setExteriorStyle(String exteriorStyle) { this.exteriorStyle = exteriorStyle; }

    public String getLivingRoomStyle() { return livingRoomStyle; }
    public void setLivingRoomStyle(String livingRoomStyle) { this.livingRoomStyle = livingRoomStyle; }

    public String getBedroomStyle() { return bedroomStyle; }
    public void setBedroomStyle(String bedroomStyle) { this.bedroomStyle = bedroomStyle; }

    public String getKitchenStyle() { return kitchenStyle; }
    public void setKitchenStyle(String kitchenStyle) { this.kitchenStyle = kitchenStyle; }

    public String getBathroomStyle() { return bathroomStyle; }
    public void setBathroomStyle(String bathroomStyle) { this.bathroomStyle = bathroomStyle; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
