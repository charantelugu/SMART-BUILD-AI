import { INITIAL_MATERIALS, INITIAL_PROJECT } from './mockData';

const currentHost = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
const BASE_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) 
  ? import.meta.env.VITE_API_URL 
  : `http://${currentHost}:8080/api`;

// Helper for fetch with fallback
async function request(endpoint, options = {}, fallbackFn = null) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${endpoint} failed or backend offline. Using reliable local engine.`, err.message);
    if (fallbackFn) {
      return fallbackFn();
    }
    throw err;
  }
}

// In-memory / localStorage cache for client consistency
const STORAGE_KEY_MATERIALS = 'smartbuild_materials';
const STORAGE_KEY_PROJECT = 'smartbuild_project';
const STORAGE_KEY_ESTIMATE = 'smartbuild_estimate';

export const materialService = {
  async getMaterials() {
    return request('/materials', { method: 'GET' }, () => {
      const stored = localStorage.getItem(STORAGE_KEY_MATERIALS);
      return stored ? JSON.parse(stored) : INITIAL_MATERIALS;
    });
  },

  async getMaterialPrices() {
    return request('/material-prices', { method: 'GET' }, () => {
      const stored = localStorage.getItem(STORAGE_KEY_MATERIALS);
      return stored ? JSON.parse(stored) : INITIAL_MATERIALS;
    });
  },

  async updateMaterialPrice(priceData) {
    return request('/material-prices', {
      method: 'POST',
      body: JSON.stringify(priceData)
    }, () => {
      const current = (localStorage.getItem(STORAGE_KEY_MATERIALS)
        ? JSON.parse(localStorage.getItem(STORAGE_KEY_MATERIALS))
        : INITIAL_MATERIALS).map(m => {
          if (m.id === priceData.materialId || m.category === priceData.category) {
            return {
              ...m,
              price: Number(priceData.price),
              supplier: priceData.supplier || m.supplier,
              quality: priceData.quality || m.quality,
              location: priceData.location || m.location,
              updatedAt: new Date().toISOString().split('T')[0]
            };
          }
          return m;
        });
      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(current));
      return { success: true, updated: priceData };
    });
  }
};

export const projectService = {
  async getProject(id = 101) {
    return request(`/projects/${id}`, { method: 'GET' }, () => {
      const stored = localStorage.getItem(STORAGE_KEY_PROJECT);
      return stored ? JSON.parse(stored) : INITIAL_PROJECT;
    });
  },

  async saveProject(projectData) {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    }, () => {
      const updated = {
        ...INITIAL_PROJECT,
        ...projectData,
        id: projectData.id || Date.now(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(updated));
      return updated;
    });
  },

  async saveHouseRequirements(reqData) {
    return request('/house-requirements', {
      method: 'POST',
      body: JSON.stringify(reqData)
    }, () => {
      const current = localStorage.getItem(STORAGE_KEY_PROJECT)
        ? JSON.parse(localStorage.getItem(STORAGE_KEY_PROJECT))
        : INITIAL_PROJECT;
      current.requirements = { ...(current.requirements || {}), ...reqData };
      localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(current));
      return current;
    });
  }
};

export const estimateService = {
  async calculateCostEstimate(payload) {
    return request('/cost-estimate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, () => {
      // Construction Thumb-Rule Calculation Engine
      const area = Number(payload.builtUpArea || (payload.landArea ? payload.landArea * 1.6 : 2400));
      const quality = payload.constructionQuality || 'Standard';

      // Cost per sq.ft based on quality (Standard Indian Metro construction rates)
      let ratePerSqFt = 1750; // Standard
      if (quality === 'Basic') ratePerSqFt = 1400;
      else if (quality === 'Premium') ratePerSqFt = 2200;
      else if (quality === 'Luxury') ratePerSqFt = 2950;

      const totalCivilLabour = area * ratePerSqFt;
      
      // Standard engineering material distribution percentages
      const breakdown = {
        cement: Math.round(totalCivilLabour * 0.16),
        steel: Math.round(totalCivilLabour * 0.20),
        bricks: Math.round(totalCivilLabour * 0.08),
        tiles: Math.round(totalCivilLabour * 0.07),
        pipes: Math.round(totalCivilLabour * 0.03),
        electrical: Math.round(totalCivilLabour * 0.06),
        plumbing: Math.round(totalCivilLabour * 0.05),
        paint: Math.round(totalCivilLabour * 0.04),
        sand: Math.round(totalCivilLabour * 0.06),
        aggregates: Math.round(totalCivilLabour * 0.05),
        labour: Math.round(totalCivilLabour * 0.12),
        doorsWindows: Math.round(totalCivilLabour * 0.05),
        interior: Number(payload.interiorBudget || Math.round(totalCivilLabour * 0.15)),
        otherCosts: Math.round(totalCivilLabour * 0.04)
      };

      const totalMaterialCost = breakdown.cement + breakdown.steel + breakdown.bricks +
        breakdown.tiles + breakdown.pipes + breakdown.electrical + breakdown.plumbing +
        breakdown.paint + breakdown.sand + breakdown.aggregates;

      const totalEstimatedCost = totalMaterialCost + breakdown.labour + breakdown.doorsWindows +
        breakdown.interior + breakdown.otherCosts;

      const result = {
        builtUpArea: area,
        quality,
        ratePerSqFt,
        breakdown,
        totalMaterialCost,
        totalEstimatedCost
      };

      localStorage.setItem(STORAGE_KEY_ESTIMATE, JSON.stringify(result));
      return result;
    });
  },

  async optimizeBudget(payload) {
    return request('/budget/optimize', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, () => {
      const budget = Number(payload.budget || 5000000);
      const estimatedCost = Number(payload.estimatedCost || 5800000);
      const diff = estimatedCost - budget;

      const suggestions = [
        {
          id: 'opt_1',
          title: 'Switch to Fly-Ash / AAC Blocks',
          description: 'Replacing standard red clay bricks with AAC lightweight blocks reduces masonry cost and dead load by 18%.',
          potentialSavings: Math.round(diff * 0.22),
          category: 'Bricks & Masonry',
          recommended: true
        },
        {
          id: 'opt_2',
          title: 'Optimize Tile Specifications',
          description: 'Use 2x2 ft Double Charge tiles in common areas and ceramic in utility/balconies instead of large slab tiles.',
          potentialSavings: Math.round(diff * 0.18),
          category: 'Tiles',
          recommended: true
        },
        {
          id: 'opt_3',
          title: 'Value-Engineered Interior Package',
          description: 'Use factory-finished prelaminated MDF/HDF for wardrobes and select acrylic laminate finishes over natural veneer.',
          potentialSavings: Math.round(diff * 0.35),
          category: 'Interior',
          recommended: true
        },
        {
          id: 'opt_4',
          title: 'Premium Paint Optimization',
          description: 'Use Royal Luxury Emulsion on focal walls and Premium Washable Emulsion on ceilings and secondary rooms.',
          potentialSavings: Math.round(diff * 0.14),
          category: 'Paint',
          recommended: false
        },
        {
          id: 'opt_5',
          title: 'Consolidate Plumbing Vertical Shafts',
          description: 'Stack bathrooms directly over ground floor wet areas to reduce pipe length and elbow fittings by 20%.',
          potentialSavings: Math.round(diff * 0.11),
          category: 'Plumbing',
          recommended: true
        }
      ];

      return {
        budget,
        estimatedCost,
        overBudgetBy: diff > 0 ? diff : 0,
        isOverBudget: diff > 0,
        suggestions
      };
    });
  }
};

export const planService = {
  async generateHousePlan(params) {
    return request('/house-plan/generate', {
      method: 'POST',
      body: JSON.stringify(params)
    }, () => {
      // Conceptual Architectural Engine
      const { landLength = 50, landWidth = 30, facing = 'North-East', floors = 'G + 1', requirements = {} } = params;
      const plotArea = landLength * landWidth;
      const setbackFront = Math.max(5, Math.round(landLength * 0.1));
      const setbackRear = Math.max(3, Math.round(landLength * 0.08));
      const setbackSide = Math.max(3, Math.round(landWidth * 0.08));
      const builtLength = landLength - (setbackFront + setbackRear);
      const builtWidth = landWidth - (setbackSide * 2);

      return {
        plotArea,
        builtUpGroundArea: builtLength * builtWidth,
        totalBuiltUpArea: (builtLength * builtWidth) * (floors === 'Ground Floor' ? 1 : floors === 'G + 1' ? 1.85 : floors === 'G + 2' ? 2.7 : 3.5),
        orientation: facing,
        setbacks: { front: setbackFront, rear: setbackRear, sides: setbackSide },
        zones: [
          { name: "Parking & Portico", dimensions: `${setbackFront + 8}x${Math.round(builtWidth * 0.45)} ft`, vastu: "North-West / North", color: "#334155" },
          { name: "Living Room (Formal & Family)", dimensions: `${Math.round(builtLength * 0.35)}x${Math.round(builtWidth * 0.55)} ft`, vastu: "North-East / East", color: "#1e3a8a" },
          { name: "Pooja Room", dimensions: "6x7 ft", vastu: "North-East (Ishan Corner)", color: "#b45309" },
          { name: "Modular Kitchen & Utility", dimensions: `${Math.round(builtLength * 0.28)}x${Math.round(builtWidth * 0.35)} ft`, vastu: "South-East (Agni Corner)", color: "#831843" },
          { name: "Dining Hall", dimensions: "12x14 ft", vastu: "East / Central", color: "#065f46" },
          { name: "Master Bedroom with Ensuite", dimensions: `${Math.round(builtLength * 0.32)}x${Math.round(builtWidth * 0.45)} ft`, vastu: "South-West (Nairuthi Corner)", color: "#1e293b" },
          { name: "Guest / Children Bedroom", dimensions: "12x12 ft", vastu: "North-West", color: "#374151" },
          { name: "Common Bath & Powder Room", dimensions: "7x5 ft", vastu: "West", color: "#475569" },
          { name: "Covered Balcony / Sit-out", dimensions: "14x6 ft", vastu: "North / East", color: "#0f766e" }
        ],
        disclaimer: "Conceptual planning aid. It is not a construction-ready architectural or structural drawing. Please consult a licensed structural engineer before breaking ground."
      };
    });
  },

  async generateExterior(params) {
    return request('/exterior/generate', {
      method: 'POST',
      body: JSON.stringify(params)
    }, () => {
      const style = params.style || 'Modern';
      const floors = params.floors || 'G + 1';
      return {
        conceptTitle: `${style} Villa (${floors})`,
        style,
        floors,
        lightingOptions: ["Daylight Elevation", "Twilight Accent Glow", "Architectural Spotlight"],
        features: [
          "Double-height cantilevered balcony projection",
          "Vertical wooden composite louvers & louvred parapet",
          "Weather-resistant textured stone-cladding facade",
          "Covered car-port with concealed warm LED strip profiles",
          "Large tinted low-E safety glazing windows"
        ],
        palette: ["#1e293b (Slate)", "#e2e8f0 (Off-white)", "#b45309 (Warm Teak)", "#3b82f6 (Glass Reflection)"],
        conceptVisualKey: `${style.toLowerCase()}_exterior`
      };
    });
  },

  async generateInterior(params) {
    return request('/interior/generate', {
      method: 'POST',
      body: JSON.stringify(params)
    }, () => {
      const room = params.room || 'Living Room';
      const style = params.style || 'Modern';
      return {
        room,
        style,
        mood: `${style} luxury with ambient ergonomics`,
        materials: [
          "Acoustic fluted wall panels with integrated brass T-profiles",
          "Quartz composite countertops with waterfall edge",
          "Seamless vitrified 4x2 Italian marble finish flooring",
          "False ceiling with cove dimmable magnetic track lights"
        ],
        conceptVisualKey: `${room.toLowerCase().replace(/\s+/g, '_')}_${style.toLowerCase()}`
      };
    });
  }
};

export const aiService = {
  async sendMessage(message, projectContext = {}) {
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, projectContext })
    }, () => {
      // Smart Fallback Construction AI Consultant
      const query = message.toLowerCase();
      let response = "";

      if (query.includes("cement") || query.includes("bag")) {
        response = `### 🧱 Cement Requirement Analysis\n\nFor standard RCC construction (slab, columns, beams, brickwork, and plastering):\n- **Thumb Rule**: Approximately **0.4 to 0.45 bags per sq.ft** of total built-up area.\n- For your project (${projectContext.builtUpArea || '2400'} sq.ft), you will require approximately **${Math.round((projectContext.builtUpArea || 2400) * 0.42)} bags** of cement.\n- **Recommended Grades**: Use **OPC 53** for structural RCC casting (beams, columns, slab) and **PPC** (Portland Pozzolana Cement) for brick masonry and wall plastering to avoid thermal cracking.`;
      } else if (query.includes("steel") || query.includes("tmt") || query.includes("iron")) {
        response = `### ⚙️ Steel (TMT) Engineering Estimation\n\n- **Standard Consumption**: Residential G+1 to G+3 frames consume **3.5 kg to 4.2 kg of steel per sq.ft**.\n- For your ${projectContext.builtUpArea || '2400'} sq.ft built-up area, estimated steel requirement is **${Math.round((projectContext.builtUpArea || 2400) * 3.8)} kg** (~${((projectContext.builtUpArea || 2400) * 3.8 / 1000).toFixed(2)} Metric Tons).\n- **Grade Recommendation**: Specify **Fe 550D** (with high ductility for seismic safety). Ensure minimum bar dia of 12mm for main column bars and 8mm for lateral stirrups.`;
      } else if (query.includes("cost") || query.includes("budget") || query.includes("price") || query.includes("estimate")) {
        response = `### 💰 Construction Cost & Budget Assessment\n\n- **Current Market Rate**: High-quality residential construction in 2026 averages **₹1,650 to ₹2,200 per sq.ft** for civil construction with standard finishes.\n- **Your Active Project Budget**: ₹${(projectContext.budget || 5500000).toLocaleString('en-IN')}\n- **Cost Distribution Tip**: In residential construction, Materials account for ~65%, Labour takes ~25%, and Approvals/Architecture/Contingency take ~10%.\n- Use our **Cost Summary** and **Budget Optimizer** tools to simulate live adjustments in tile grades, paint layers, and block specifications to stay strictly within your target budget.`;
      } else if (query.includes("vastu") || query.includes("facing") || query.includes("direction")) {
        response = `### 🧭 Architectural & Vastu Recommendations\n\n- **Main Entrance**: Auspicious alignments are North, North-East, and East.\n- **Kitchen**: Best placed in the **South-East (Agni)** corner with the cook facing East. Alternative is North-West.\n- **Master Bedroom**: Ideal in the **South-West (Nairuthi)** zone to provide stability, strength, and privacy.\n- **Pooja Room**: Prime location is North-East (Ishan corner); avoid placing adjacent to or below toilets.\n- **Staircase**: Place on South or West side, rotating clockwise as you ascend.`;
      } else {
        response = `### 🏗️ Smart Build AI Assistant Guidance\n\nThank you for consulting me about your construction planning for **"${projectContext.projectName || 'Your House Project'}"**.\n\nHere are key recommendations based on your parameters:\n1. **Soil Testing & Foundation**: Always conduct a standard core drill soil test before determining footings (isolated footing for hard soil, raft/pile for black cotton soil).\n2. **Waterproofing**: Never skip 2-coat crystalline waterproofing on terrace slabs, sunken toilet slabs, and basement retaining walls.\n3. **Curing Time**: Ensure minimum 14 days wet curing for columns and slabs to achieve 95%+ characteristic compressive strength.\n\nFeel free to ask specific questions about any material category, floor plan zoning, or ways to optimize your budget!`;
      }

      return {
        reply: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
  }
};
