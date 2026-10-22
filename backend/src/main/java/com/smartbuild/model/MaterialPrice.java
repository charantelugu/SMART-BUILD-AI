package com.smartbuild.model;

import jakarta.persistence.*;

@Entity
@Table(name = "material_prices")
public class MaterialPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "material_id")
    private Long materialId;

    private String supplier;
    private String location;
    private String quality;

    @Column(nullable = false)
    private Double price;

    @Column(name = "updated_at")
    private String updatedAt;

    public MaterialPrice() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMaterialId() { return materialId; }
    public void setMaterialId(Long materialId) { this.materialId = materialId; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
