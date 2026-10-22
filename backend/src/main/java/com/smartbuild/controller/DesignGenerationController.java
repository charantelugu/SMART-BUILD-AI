package com.smartbuild.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DesignGenerationController {

    @PostMapping("/exterior/generate")
    public ResponseEntity<Map<String, Object>> generateExterior(@RequestBody Map<String, Object> params) {
        String style = (String) params.getOrDefault("style", "Modern");
        String floors = (String) params.getOrDefault("floors", "G + 1");

        Map<String, Object> response = Map.of(
                "conceptTitle", style + " Villa Concept (" + floors + ")",
                "style", style,
                "floors", floors,
                "features", List.of(
                        "Double-height cantilevered balcony projection with safety glass balustrades",
                        "Vertical composite louvers providing solar shading and privacy",
                        "Weather-shield textured stone and wood composite facade cladding",
                        "Covered carport with concealed warm LED strip downlights"
                ),
                "lightingModes", List.of("Daylight Elevation", "Twilight Accent Glow", "Architectural Spotlight")
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/interior/generate")
    public ResponseEntity<Map<String, Object>> generateInterior(@RequestBody Map<String, Object> params) {
        String room = (String) params.getOrDefault("room", "Living Room");
        String style = (String) params.getOrDefault("style", "Modern Minimalist");

        Map<String, Object> response = Map.of(
                "room", room,
                "style", style,
                "conceptTitle", room + " • " + style + " Scheme",
                "finishes", Map.of(
                        "flooring", "Large format vitrified 4x2 ft Italian finish tiles",
                        "walls", "Acoustic fluted wooden panelling with brass profile trims",
                        "lighting", "Perimeter ceiling cove glow with anti-glare downlight tracks"
                )
        );

        return ResponseEntity.ok(response);
    }
}
