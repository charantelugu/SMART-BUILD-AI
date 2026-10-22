package com.smartbuild.service;

import com.smartbuild.dto.ChatMessageRequest;
import com.smartbuild.dto.ChatMessageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class AIService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public ChatMessageResponse processChat(ChatMessageRequest req) {
        String userQuery = req.getMessage() != null ? req.getMessage().trim() : "";
        Map<String, Object> ctx = req.getProjectContext() != null ? req.getProjectContext() : Collections.emptyMap();
        String timeStr = new SimpleDateFormat("hh:mm a").format(new Date());

        // Check if user has provided Gemini API key in environment
        if (geminiApiKey != null && !geminiApiKey.isBlank() && !geminiApiKey.equals("your_api_key_here")) {
            try {
                String reply = callGeminiApi(userQuery, ctx);
                if (reply != null && !reply.isBlank()) {
                    return new ChatMessageResponse(reply, timeStr);
                }
            } catch (Exception e) {
                System.err.println("Gemini API call failed, falling back to rule-based engine: " + e.getMessage());
            }
        }

        // Domain-Expert Construction Knowledge Fallback
        String reply = generateExpertResponse(userQuery, ctx);
        return new ChatMessageResponse(reply, timeStr);
    }

    private String callGeminiApi(String userQuery, Map<String, Object> ctx) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        String systemPrompt = "You are Smart Build AI, an expert civil engineer, architect, and quantity surveyor specializing in residential house construction in India. " +
                "Project context: Name=" + ctx.getOrDefault("projectName", "Dream House") +
                ", Land=" + ctx.getOrDefault("landArea", "1500") + " sq.ft, BuiltUp=" + ctx.getOrDefault("builtUpArea", "2400") + " sq.ft" +
                ", Floors=" + ctx.getOrDefault("floors", "G+1") + ", Budget=Rs." + ctx.getOrDefault("budget", "5500000") +
                ", Facing=" + ctx.getOrDefault("facing", "North-East") + ". Provide professional, practical, IS-code compliant advice with thumb rules and concrete numbers.";

        Map<String, Object> part = Map.of("text", systemPrompt + "\n\nUser Question: " + userQuery);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> body = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map bodyMap = response.getBody();
            List candidates = (List) bodyMap.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map first = (Map) candidates.get(0);
                Map contentMap = (Map) first.get("content");
                if (contentMap != null) {
                    List parts = (List) contentMap.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        Map p = (Map) parts.get(0);
                        return (String) p.get("text");
                    }
                }
            }
        }
        return null;
    }

    private String generateExpertResponse(String query, Map<String, Object> ctx) {
        String lower = query.toLowerCase();
        Object builtUpAreaObj = ctx.getOrDefault("builtUpArea", 2400);
        long builtUp = builtUpAreaObj instanceof Number ? ((Number) builtUpAreaObj).longValue() : 2400L;

        if (lower.contains("cement") || lower.contains("bag")) {
            long cementBags = Math.round(builtUp * 0.42);
            return "### 🧱 Cement Quantity & Grade Engineering Advice\n\n" +
                    "- **Standard Consumption Rule**: Residential RCC construction consumes **0.40 to 0.45 bags per sq.ft** of built-up area.\n" +
                    "- For your **" + builtUp + " sq.ft** project, you will need approximately **" + cementBags + " bags** (50kg each).\n" +
                    "- **Grade Recommendations**:\n" +
                    "  - Use **OPC 53 Grade** (e.g. UltraTech, ACC) for RCC footing, column, beam, and slab casting.\n" +
                    "  - Use **PPC (Portland Pozzolana)** for brickwork and external plastering to prevent shrinkage cracks.\n" +
                    "- Always maintain a water-cement ratio of **0.45 to 0.50** for M20 grade mixes.";
        }

        if (lower.contains("steel") || lower.contains("tmt") || lower.contains("iron") || lower.contains("rebar")) {
            long steelKg = Math.round(builtUp * 3.8);
            return "### ⚙️ Steel (TMT Rebars) Engineering Estimation\n\n" +
                    "- **Standard Consumption**: Standard Indian residential frames require **3.5 kg to 4.2 kg steel per sq.ft**.\n" +
                    "- Estimated total steel for your project: **" + steelKg + " kg** (~" + String.format("%.2f", steelKg / 1000.0) + " Metric Tons).\n" +
                    "- **Grade Specification**: Specify **Fe 550D** (High Ductility) from primary producers (Tata Tiscon, Jindal Panther, SAIL).\n" +
                    "- **Structural Rule**: Maintain minimum 40mm clear cover for columns and 20mm for slabs to prevent corrosion.";
        }

        if (lower.contains("cost") || lower.contains("budget") || lower.contains("estimate") || lower.contains("price")) {
            Object budgetObj = ctx.getOrDefault("budget", 5500000);
            return "### 💰 Construction Budget Strategy\n\n" +
                    "- **Average Construction Rate (2026)**: ₹1,650 to ₹2,200 per sq.ft for turnkey civil + standard finishes.\n" +
                    "- **Your Configured Budget**: ₹" + budgetObj + "\n" +
                    "- **Cost Distribution Breakdown**:\n" +
                    "  - Structural Materials (Cement, Steel, Sand, Aggregates, Bricks): **~50%**\n" +
                    "  - Finishes (Tiles, Paint, Electrical, Plumbing, Joinery): **~25%**\n" +
                    "  - Labour & Machinery: **~20%**\n" +
                    "  - Approvals & Contingency: **~5%**\n" +
                    "- You can use our **Budget Optimizer** to simulate savings by switching to AAC blocks and optimizing tile layouts.";
        }

        if (lower.contains("vastu") || lower.contains("direction") || lower.contains("facing")) {
            return "### 🧭 Architectural & Vastu Principles\n\n" +
                    "- **Kitchen (Fire Element)**: Locate in the **South-East (Agni)** corner. Cook should face East.\n" +
                    "- **Master Bedroom (Earth Element)**: Place in the **South-West (Nairuthi)** corner for stability.\n" +
                    "- **Pooja Room (Water/Air Element)**: Prime orientation is **North-East (Ishanya)** corner.\n" +
                    "- **Living Room / Foyer**: Best in **North** or **East** to welcome positive morning energy.\n" +
                    "- **Overhead Water Tank**: Position over South-West or West zone to balance building weight.";
        }

        return "### 🏗️ Smart Build AI Assistant\n\n" +
                "I am monitoring your project **\"" + ctx.getOrDefault("projectName", "Custom House") + "\"**.\n\n" +
                "Key construction checks for your stage:\n" +
                "1. **Soil Bearing Capacity (SBC)**: Verify soil test before casting isolated footings.\n" +
                "2. **Curing Time**: Ensure continuous 14-day wet ponding for roof slabs and hessian cloth for columns.\n" +
                "3. **Anti-Termite Treatment**: Apply chemical soil treatment at foundation plinth level prior to PCC bed.\n\n" +
                "Feel free to ask about cement bags, steel tonnage, brick counts, or budget optimization!";
    }
}
