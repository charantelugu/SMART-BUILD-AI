package com.smartbuild.service;

import com.smartbuild.model.Material;
import com.smartbuild.model.MaterialPrice;
import com.smartbuild.repository.MaterialPriceRepository;
import com.smartbuild.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PricingService {

    private final MaterialRepository materialRepository;
    private final MaterialPriceRepository materialPriceRepository;

    public PricingService(MaterialRepository materialRepository, MaterialPriceRepository materialPriceRepository) {
        this.materialRepository = materialRepository;
        this.materialPriceRepository = materialPriceRepository;
    }

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public List<Map<String, Object>> getAllMaterialPrices() {
        List<Material> materials = materialRepository.findAll();
        List<Map<String, Object>> results = new ArrayList<>();

        for (Material m : materials) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("materialId", m.getId());
            map.put("name", m.getName());
            map.put("category", m.getCategory());
            map.put("unit", m.getUnit());

            Optional<MaterialPrice> priceOpt = materialPriceRepository.findByMaterialId(m.getId());
            if (priceOpt.isPresent()) {
                MaterialPrice p = priceOpt.get();
                map.put("price", p.getPrice());
                map.put("supplier", p.getSupplier());
                map.put("location", p.getLocation());
                map.put("quality", p.getQuality());
                map.put("updatedAt", p.getUpdatedAt());
            } else {
                map.put("price", 100.0);
                map.put("supplier", "Standard Supplier");
                map.put("location", "National Average");
                map.put("quality", "Standard");
                map.put("updatedAt", "2026-09-20");
            }
            results.add(map);
        }
        return results;
    }

    public MaterialPrice updateOrAddPrice(Map<String, Object> payload) {
        Long materialId = null;
        if (payload.get("materialId") != null) {
            materialId = Long.valueOf(payload.get("materialId").toString());
        }

        String category = (String) payload.get("category");
        if (materialId == null && category != null) {
            Optional<Material> mOpt = materialRepository.findByCategoryIgnoreCase(category);
            if (mOpt.isPresent()) {
                materialId = mOpt.get().getId();
            }
        }

        if (materialId == null) {
            materialId = 1L;
        }

        Optional<MaterialPrice> existingOpt = materialPriceRepository.findByMaterialId(materialId);
        MaterialPrice priceEntity = existingOpt.orElse(new MaterialPrice());

        priceEntity.setMaterialId(materialId);
        if (payload.get("price") != null) {
            priceEntity.setPrice(Double.valueOf(payload.get("price").toString()));
        }
        if (payload.get("supplier") != null) {
            priceEntity.setSupplier((String) payload.get("supplier"));
        }
        if (payload.get("location") != null) {
            priceEntity.setLocation((String) payload.get("location"));
        }
        if (payload.get("quality") != null) {
            priceEntity.setQuality((String) payload.get("quality"));
        }
        priceEntity.setUpdatedAt(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()));

        return materialPriceRepository.save(priceEntity);
    }
}
