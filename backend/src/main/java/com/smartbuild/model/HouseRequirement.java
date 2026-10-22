package com.smartbuild.model;

import jakarta.persistence.*;

@Entity
@Table(name = "house_requirements")
public class HouseRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    private Integer bedrooms = 3;
    private Integer bathrooms = 3;
    private Integer kitchen = 1;

    @Column(name = "living_room")
    private Integer livingRoom = 1;

    @Column(name = "dining_room")
    private Integer diningRoom = 1;

    @Column(name = "pooja_room")
    private Integer poojaRoom = 1;

    private Integer balcony = 2;
    private Integer parking = 1;
    private Integer garden = 1;

    @Column(name = "home_office")
    private Integer homeOffice = 1;

    @Column(name = "store_room")
    private Integer storeRoom = 1;

    @Column(name = "utility_room")
    private Integer utilityRoom = 1;

    public HouseRequirement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public Integer getKitchen() { return kitchen; }
    public void setKitchen(Integer kitchen) { this.kitchen = kitchen; }

    public Integer getLivingRoom() { return livingRoom; }
    public void setLivingRoom(Integer livingRoom) { this.livingRoom = livingRoom; }

    public Integer getDiningRoom() { return diningRoom; }
    public void setDiningRoom(Integer diningRoom) { this.diningRoom = diningRoom; }

    public Integer getPoojaRoom() { return poojaRoom; }
    public void setPoojaRoom(Integer poojaRoom) { this.poojaRoom = poojaRoom; }

    public Integer getBalcony() { return balcony; }
    public void setBalcony(Integer balcony) { this.balcony = balcony; }

    public Integer getParking() { return parking; }
    public void setParking(Integer parking) { this.parking = parking; }

    public Integer getGarden() { return garden; }
    public void setGarden(Integer garden) { this.garden = garden; }

    public Integer getHomeOffice() { return homeOffice; }
    public void setHomeOffice(Integer homeOffice) { this.homeOffice = homeOffice; }

    public Integer getStoreRoom() { return storeRoom; }
    public void setStoreRoom(Integer storeRoom) { this.storeRoom = storeRoom; }

    public Integer getUtilityRoom() { return utilityRoom; }
    public void setUtilityRoom(Integer utilityRoom) { this.utilityRoom = utilityRoom; }
}
