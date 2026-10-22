// =========================================================================
// REAL-TIME CONSTRUCTION MATERIAL & SUBPRODUCT MARKET RATES CATALOG
// Benchmarked against Indian Construction Commodity Index (ICCE & Wholesale Mandi)
// =========================================================================

export const REGIONAL_MARKET_FACTORS = {
  'National Average': { multiplier: 1.00, label: 'National Benchmark (All-India Composite)' },
  'Delhi-NCR (North)': { multiplier: 0.98, label: 'Delhi-NCR (Haryana & UP Mandi Hub)' },
  'Mumbai / Pune (West)': { multiplier: 1.05, label: 'Mumbai-Pune MMR (Port & Logistics Adjusted)' },
  'Bengaluru (South)': { multiplier: 1.03, label: 'Bengaluru Urban & Karnataka Aggregates' },
  'Hyderabad (Telangana)': { multiplier: 0.97, label: 'Hyderabad Hub (Cement Belt & Steel Mills)' },
  'Chennai (Tamil Nadu)': { multiplier: 1.02, label: 'Chennai Metro & Coastal Marine Zone' },
  'Kolkata (East)': { multiplier: 0.96, label: 'Kolkata & Durgapur Steel Corridor' }
};

export const REALTIME_MATERIAL_CATALOG = {
  Cement: {
    category: 'Cement',
    baseUnit: 'Bags (50kg)',
    marketTrend: '+1.4% this week',
    trendDirection: 'up',
    lastSync: 'Live Feed Synchronized Today',
    products: [
      {
        id: 'cem-opc-53',
        grade: 'OPC 53 Grade',
        desc: 'High early strength for RCC Columns, Beams, Footings & Heavy Slabs',
        subproducts: [
          { name: 'UltraTech Super Cement (OPC 53)', brand: 'UltraTech', price: 415, rating: 4.9, certified: 'IS:12269' },
          { name: 'ACC Concrete+ Xtra Strong (OPC 53)', brand: 'ACC', price: 395, rating: 4.8, certified: 'IS:12269' },
          { name: 'Ambuja Special High Strength (OPC 53)', brand: 'Ambuja', price: 405, rating: 4.8, certified: 'IS:12269' },
          { name: 'Dalmia DSP Cement (OPC 53)', brand: 'Dalmia', price: 390, rating: 4.7, certified: 'IS:12269' },
          { name: 'JSW Concreel HD (OPC 53)', brand: 'JSW', price: 385, rating: 4.6, certified: 'IS:12269' }
        ]
      },
      {
        id: 'cem-opc-43',
        grade: 'OPC 43 Grade',
        desc: 'Standard structural grade for residential masonry and general concrete',
        subproducts: [
          { name: 'UltraTech Standard OPC 43', brand: 'UltraTech', price: 385, rating: 4.7, certified: 'IS:8112' },
          { name: 'ACC Suraksha Power 43', brand: 'ACC', price: 375, rating: 4.6, certified: 'IS:8112' },
          { name: 'Ambuja 43 Grade Standard', brand: 'Ambuja', price: 380, rating: 4.6, certified: 'IS:8112' },
          { name: 'Shree Ultra Jung Rodhak 43', brand: 'Shree Cement', price: 365, rating: 4.5, certified: 'IS:8112' }
        ]
      },
      {
        id: 'cem-ppc',
        grade: 'PPC Fly Ash Based',
        desc: 'Low heat of hydration, superior corrosion resistance for plaster & brickwork',
        subproducts: [
          { name: 'UltraTech Weather Pro (Hydrophobic PPC)', brand: 'UltraTech', price: 380, rating: 4.9, certified: 'IS:1489' },
          { name: 'ACC Gold Water Shield (Water Repellent PPC)', brand: 'ACC', price: 390, rating: 4.8, certified: 'IS:1489' },
          { name: 'Ambuja Kawach Waterproof PPC', brand: 'Ambuja', price: 395, rating: 4.8, certified: 'IS:1489' },
          { name: 'Birla Samruddhi PPC Standard', brand: 'Birla', price: 355, rating: 4.5, certified: 'IS:1489' },
          { name: 'JSW Compacting Green PPC', brand: 'JSW', price: 350, rating: 4.5, certified: 'IS:1489' }
        ]
      },
      {
        id: 'cem-white',
        grade: 'White Cement & Adhesives',
        desc: 'Architectural decorative finishes, terrazzo, marble jointing & tile fixing',
        subproducts: [
          { name: 'Birla White Polymer Modified (50kg bag)', brand: 'Birla White', price: 1150, rating: 4.9, certified: 'IS:8042' },
          { name: 'JK White Cement Maxx (50kg bag)', brand: 'JK White', price: 1120, rating: 4.8, certified: 'IS:8042' },
          { name: 'Roff New Construction Tile Adhesive T01 (20kg)', brand: 'Pidilite Roff', price: 420, rating: 4.7, certified: 'EN 12004' }
        ]
      }
    ]
  },

  Steel: {
    category: 'Steel',
    baseUnit: 'kg',
    marketTrend: '-0.8% price dip (Wholesale mill index)',
    trendDirection: 'down',
    lastSync: 'Live Steel Exchange (TMT Bar Index)',
    products: [
      {
        id: 'stl-550d-prim',
        grade: 'Fe 550D Primary Mills (Recommended)',
        desc: 'High-ductility earthquake-resistant rebars from integrated primary steel plants',
        subproducts: [
          { name: 'Tata Tiscon 550D Super Ductile Rebar', brand: 'Tata Steel', price: 74.5, rating: 4.9, certified: 'IS:1786 Fe550D' },
          { name: 'JSW Neosteel Fe 550D Pure TMT', brand: 'JSW Steel', price: 71.0, rating: 4.8, certified: 'IS:1786 Fe550D' },
          { name: 'Jindal Panther Fe 550D Rebars', brand: 'Jindal Steel', price: 70.5, rating: 4.8, certified: 'IS:1786 Fe550D' },
          { name: 'SAIL TMT EQR 550D High Tensile', brand: 'SAIL', price: 69.5, rating: 4.7, certified: 'IS:1786 Fe550D' },
          { name: 'Vizag Steel (RINL) Fe 550D TMT', brand: 'RINL', price: 68.5, rating: 4.7, certified: 'IS:1786 Fe550D' }
        ]
      },
      {
        id: 'stl-500d-sec',
        grade: 'Fe 500D Secondary Mills',
        desc: 'Cost-effective certified rebars for residential plinth, lintels & partition slabs',
        subproducts: [
          { name: 'Kamdhenu Nxt Fe 500D TMT', brand: 'Kamdhenu', price: 64.0, rating: 4.6, certified: 'IS:1786' },
          { name: 'Rathi Shaktiman Fe 500D Rebar', brand: 'Rathi', price: 62.5, rating: 4.5, certified: 'IS:1786' },
          { name: 'SRMB Srijan Fe 500D Wing Grip', brand: 'SRMB', price: 63.0, rating: 4.5, certified: 'IS:1786' },
          { name: 'Electrosteel Steelfast 500D', brand: 'Electrosteel', price: 63.5, rating: 4.5, certified: 'IS:1786' }
        ]
      },
      {
        id: 'stl-crs',
        grade: 'CRS Corrosion Resistant Steel',
        desc: 'Chromium and copper alloyed for coastal, saline or high groundwater areas',
        subproducts: [
          { name: 'Tata Tiscon CRS (Coastal Extreme)', brand: 'Tata Steel', price: 82.0, rating: 4.9, certified: 'IS:1786 CRS' },
          { name: 'JSW Neosteel CRS Anti-Rust', brand: 'JSW Steel', price: 78.5, rating: 4.8, certified: 'IS:1786 CRS' },
          { name: 'Jindal Panther CRS Corrosion Guard', brand: 'Jindal Steel', price: 77.0, rating: 4.7, certified: 'IS:1786 CRS' }
        ]
      },
      {
        id: 'stl-wire',
        grade: 'Binding Wire & Accessories',
        desc: 'Annealed tie wire for rebar fabrication & beam-column junctions',
        subproducts: [
          { name: 'Annealed 18-Gauge Soft GI Binding Wire', brand: 'Standard GI', price: 85.0, rating: 4.7, certified: 'IS:280' },
          { name: 'Heavy Duty 20-Gauge Black M.S. Wire', brand: 'Tata Wire', price: 88.0, rating: 4.8, certified: 'IS:280' }
        ]
      }
    ]
  },

  Bricks: {
    category: 'Bricks',
    baseUnit: 'Pieces',
    marketTrend: 'Stable (Kiln production season)',
    trendDirection: 'stable',
    lastSync: 'Regional Brick Kiln Association Index',
    products: [
      {
        id: 'brk-red-clay',
        grade: 'Red Clay Kiln Bricks',
        desc: 'Traditional high-strength baked clay bricks (9″×4.25″×2.75″)',
        subproducts: [
          { name: 'First Class Red Kiln Bricks (Handmade)', brand: 'Local Kiln Grade-1', price: 9.5, rating: 4.7, certified: 'IS:1077 Class 10' },
          { name: 'Wire-Cut Machine Moulded Red Bricks', brand: 'ClayTech Wire-Cut', price: 14.5, rating: 4.9, certified: 'IS:1077 Class 15' },
          { name: 'Exposed Architectural Facing Bricks', brand: 'Heritage Clinker', price: 18.0, rating: 4.8, certified: 'IS:2691' }
        ]
      },
      {
        id: 'brk-aac',
        grade: 'AAC Lightweight Blocks',
        desc: 'Thermal insulating autoclaved aerated concrete (Replaces 8 standard bricks)',
        subproducts: [
          { name: 'Magicrete AAC Blocks (600×200×150mm - 6 inch)', brand: 'Magicrete', price: 62.0, rating: 4.9, certified: 'IS:2185 Part 3' },
          { name: 'Siporex Lightweight AAC Blocks (6 inch)', brand: 'Siporex', price: 65.0, rating: 4.8, certified: 'IS:2185 Part 3' },
          { name: 'Ecolite AAC Partition Blocks (600×200×100mm - 4 inch)', brand: 'Ecolite', price: 44.0, rating: 4.7, certified: 'IS:2185 Part 3' },
          { name: 'Ultratech Seal & Fix AAC Mortar (40kg bag)', brand: 'UltraTech Fix', price: 380.0, rating: 4.8, certified: 'Dry-Mortar' }
        ]
      },
      {
        id: 'brk-flyash',
        grade: 'Fly Ash Cement Bricks',
        desc: 'Eco-friendly, uniform sharp edges with minimal plaster mortar requirement',
        subproducts: [
          { name: 'Standard Cement Fly Ash Bricks (9″×4″×3″)', brand: 'EcoGreen Flyash', price: 6.5, rating: 4.6, certified: 'IS:12894' },
          { name: 'Hydraulic High Compressive Fly Ash Bricks', brand: 'Apex PowerAsh', price: 7.8, rating: 4.7, certified: 'IS:12894 Class 7.5' }
        ]
      },
      {
        id: 'brk-concrete',
        grade: 'Solid Concrete Blocks',
        desc: 'High compressive load-bearing blocks for basements and compound walls',
        subproducts: [
          { name: 'Solid Concrete Blocks (400×200×200mm - 8 inch)', brand: 'Precast Solid', price: 48.0, rating: 4.7, certified: 'IS:2185 Part 1' },
          { name: 'Solid Concrete Partition Blocks (400×200×100mm - 4 inch)', brand: 'Precast Solid', price: 32.0, rating: 4.6, certified: 'IS:2185 Part 1' }
        ]
      }
    ]
  },

  Tiles: {
    category: 'Tiles',
    baseUnit: 'sq.ft',
    marketTrend: '+2.1% (LPG kiln fuel adjustment)',
    trendDirection: 'up',
    lastSync: 'Morbi Ceramic Association Index',
    products: [
      {
        id: 'til-vit-dc',
        grade: 'Vitrified Double Charge (4×2 ft)',
        desc: 'Thick wear layer, mirror gloss finish for living halls and bedrooms',
        subproducts: [
          { name: 'Kajaria Double Charge Vitrified (4′ × 2′)', brand: 'Kajaria', price: 68.0, rating: 4.9, certified: 'ISO 13006' },
          { name: 'Somany Duragres Double Charge (4′ × 2′)', brand: 'Somany', price: 64.0, rating: 4.8, certified: 'ISO 13006' },
          { name: 'Simpolo Supreme Touch (4′ × 2′)', brand: 'Simpolo', price: 72.0, rating: 4.8, certified: 'ISO 13006' },
          { name: 'Nitco Double Charge Vitrified Floor Tiles', brand: 'Nitco', price: 66.0, rating: 4.7, certified: 'ISO 13006' }
        ]
      },
      {
        id: 'til-gvt',
        grade: 'Glazed Vitrified GVT (2×2 ft & 4×2 ft)',
        desc: 'High-definition digital marble textures with anti-skid satin finish',
        subproducts: [
          { name: 'Kajaria Polished GVT Digital Marble (4′ × 2′)', brand: 'Kajaria GVT', price: 76.0, rating: 4.9, certified: 'ISO 13006' },
          { name: 'Somany Matte Anti-Skid GVT (2′ × 2′)', brand: 'Somany', price: 58.0, rating: 4.8, certified: 'ISO 13006' },
          { name: 'Cera Granito Glazed Vitrified Tiles', brand: 'Cera', price: 61.0, rating: 4.7, certified: 'ISO 13006' }
        ]
      },
      {
        id: 'til-wall',
        grade: 'Ceramic Digital Wall Tiles',
        desc: 'Stain-free moisture resistant tiles for bathrooms and kitchen dados',
        subproducts: [
          { name: 'Kajaria Glossy Ceramic Wall Tiles (18″ × 12″)', brand: 'Kajaria', price: 38.0, rating: 4.8, certified: 'IS:15622' },
          { name: 'Somany Beveled Subway White Tiles (6″ × 3″)', brand: 'Somany', price: 52.0, rating: 4.8, certified: 'IS:15622' },
          { name: 'Designer Moroccan Motif Highlighter Tiles', brand: 'Nitco Artisan', price: 85.0, rating: 4.9, certified: 'IS:15622' }
        ]
      },
      {
        id: 'til-granite',
        grade: 'Granite & Natural Stones',
        desc: 'Heavy-duty polished stone slabs for kitchen counters, thresholds & stairs',
        subproducts: [
          { name: 'Black Galaxy Premium Granite (18mm Slab)', brand: 'Andhra Granite', price: 185.0, rating: 4.9, certified: 'Natural Stone' },
          { name: 'Steel Grey / Tan Brown Granite (18mm Slab)', brand: 'Granite Quarry', price: 125.0, rating: 4.8, certified: 'Natural Stone' },
          { name: 'Makrana Pure White Marble Slabs', brand: 'Rajasthan Marble', price: 240.0, rating: 4.9, certified: 'Natural Stone' }
        ]
      },
      {
        id: 'til-paver',
        grade: 'Exterior Parking Pavers',
        desc: 'High-density interlocking concrete blocks for driveways and porches',
        subproducts: [
          { name: 'Heavy-Duty Zig-Zag Concrete Pavers (60mm)', brand: 'UltraPaver', price: 48.0, rating: 4.7, certified: 'IS:15658' },
          { name: 'Terrace Solar Reflective Cool Tiles (300×300mm)', brand: 'Endura Cool', price: 55.0, rating: 4.8, certified: 'SRI > 104' }
        ]
      }
    ]
  },

  Pipes: {
    category: 'Pipes',
    baseUnit: 'meter',
    marketTrend: '+0.9% (PVC polymer benchmark)',
    trendDirection: 'up',
    lastSync: 'Plumbing Manufacturers Association Feed',
    products: [
      {
        id: 'pip-cpvc',
        grade: 'CPVC (Hot & Cold Potable Lines)',
        desc: 'Chlorinated PVC with high heat & pressure resistance (SDR 11)',
        subproducts: [
          { name: 'Astral CPVC Pro SDR 11 (1 inch / 25mm)', brand: 'Astral', price: 225.0, rating: 4.9, certified: 'IS:15778' },
          { name: 'Astral CPVC Pro SDR 11 (3/4 inch / 20mm)', brand: 'Astral', price: 145.0, rating: 4.9, certified: 'IS:15778' },
          { name: 'Astral CPVC Pro SDR 11 (1/2 inch / 15mm)', brand: 'Astral', price: 95.0, rating: 4.9, certified: 'IS:15778' },
          { name: 'Ashirvad FlowGuard Plus CPVC (1 inch)', brand: 'Ashirvad', price: 215.0, rating: 4.8, certified: 'IS:15778' },
          { name: 'Supreme Lifeline CPVC (1.25 inch / 32mm)', brand: 'Supreme', price: 320.0, rating: 4.8, certified: 'IS:15778' }
        ]
      },
      {
        id: 'pip-upvc',
        grade: 'UPVC Pressure Pipes',
        desc: 'Lead-free rigid PVC for cold water external ring mains and plumbing downlines',
        subproducts: [
          { name: 'Astral Aquasafe Lead-Free UPVC (1 inch Class 2)', brand: 'Astral', price: 110.0, rating: 4.8, certified: 'IS:4985' },
          { name: 'Supreme UPVC Pressure Pipe (1.5 inch Class 2)', brand: 'Supreme', price: 165.0, rating: 4.8, certified: 'IS:4985' },
          { name: 'Prince SmartFit UPVC Plumbing Pipe (1 inch)', brand: 'Prince', price: 105.0, rating: 4.7, certified: 'IS:4985' }
        ]
      },
      {
        id: 'pip-swr',
        grade: 'SWR Drainage & Rainwater Pipes',
        desc: 'UV-stabilized soil, waste and rainwater drainage pipes with rubber ring joints',
        subproducts: [
          { name: 'Astral Silencio Noise-Free SWR Pipe (110mm / 4″)', brand: 'Astral', price: 295.0, rating: 4.9, certified: 'IS:13592' },
          { name: 'Supreme SWR Ring-Fit Drainage Pipe (110mm / 4″)', brand: 'Supreme', price: 275.0, rating: 4.8, certified: 'IS:13592' },
          { name: 'Supreme SWR Waste Pipe (75mm / 2.5″)', brand: 'Supreme', price: 180.0, rating: 4.8, certified: 'IS:13592' },
          { name: 'Prince Heavy Underground Drainage Pipe (160mm / 6″)', brand: 'Prince', price: 460.0, rating: 4.8, certified: 'IS:15328' }
        ]
      }
    ]
  },

  Electrical: {
    category: 'Electrical',
    baseUnit: 'Pack / Set',
    marketTrend: '+1.6% (Copper LME spot rate)',
    trendDirection: 'up',
    lastSync: 'National Copper & Electrical Goods Index',
    products: [
      {
        id: 'elec-wire',
        grade: 'FR-LSH Copper Building Wires',
        desc: 'Flame retardant low smoke halogen-free electrolytic copper wires (90m coils)',
        subproducts: [
          { name: 'Finolex FR-LSH 1.5 sq.mm (Lighting - 90m coil)', brand: 'Finolex', price: 1820.0, rating: 4.9, certified: 'IS:694' },
          { name: 'Havells Life Line Plus 1.5 sq.mm (90m coil)', brand: 'Havells', price: 1780.0, rating: 4.8, certified: 'IS:694' },
          { name: 'Polycab Green Wire 2.5 sq.mm (Power - 90m coil)', brand: 'Polycab', price: 2650.0, rating: 4.9, certified: 'IS:694' },
          { name: 'Finolex 4.0 sq.mm (Heavy AC/Geyser - 90m coil)', brand: 'Finolex', price: 4150.0, rating: 4.9, certified: 'IS:694' },
          { name: 'Polycab 6.0 sq.mm (Main Meter Inflow - 90m coil)', brand: 'Polycab', price: 6100.0, rating: 4.8, certified: 'IS:694' }
        ]
      },
      {
        id: 'elec-modular',
        grade: 'Modular Switches & Sockets',
        desc: 'Silver contact polycarbonate shock-proof modular switchgear',
        subproducts: [
          { name: 'Schneider AvatarOn Frameless Switch 6A', brand: 'Schneider', price: 145.0, rating: 4.9, certified: 'IS:3854' },
          { name: 'Legrand Mylinc Modular 6A Switch', brand: 'Legrand', price: 110.0, rating: 4.8, certified: 'IS:3854' },
          { name: 'Anchor Roma Classic 6A Switch', brand: 'Anchor Panasonic', price: 65.0, rating: 4.7, certified: 'IS:3854' },
          { name: 'Modular 16A Power Socket with Child Shutter', brand: 'Schneider', price: 185.0, rating: 4.9, certified: 'IS:1293' }
        ]
      },
      {
        id: 'elec-db',
        grade: 'MCBs, RCCBs & Distribution Boards',
        desc: 'Overload and earth-leakage electro-mechanical protection units',
        subproducts: [
          { name: 'Schneider Acti9 8-Way Double Door DB', brand: 'Schneider', price: 3850.0, rating: 4.9, certified: 'IS:13032' },
          { name: 'Legrand 32A Double Pole RCCB (30mA)', brand: 'Legrand', price: 2450.0, rating: 4.9, certified: 'IS:12640' },
          { name: 'Havells 10A/16A Single Pole C-Curve MCB', brand: 'Havells', price: 240.0, rating: 4.8, certified: 'IS:60898' }
        ]
      }
    ]
  },

  Plumbing: {
    category: 'Plumbing',
    baseUnit: 'Piece / Set',
    marketTrend: 'Stable (Sanitaryware catalog)',
    trendDirection: 'stable',
    lastSync: 'Sanitaryware & Bathware Manufacturers Feed',
    products: [
      {
        id: 'plm-sanitary',
        grade: 'Vitreous China Sanitaryware',
        desc: 'Rimless, anti-bacterial glazed water closets and ceramic wash basins',
        subproducts: [
          { name: 'Hindware Element Wall-Hung EWC with Soft Close', brand: 'Hindware', price: 7800.0, rating: 4.8, certified: 'IS:2556' },
          { name: 'Kohler Modern Rimless Wall-Hung Toilet', brand: 'Kohler', price: 14500.0, rating: 4.9, certified: 'ASME A112' },
          { name: 'Cera Designer Tabletop Wash Basin', brand: 'Cera', price: 2400.0, rating: 4.7, certified: 'IS:2556' },
          { name: 'Jaquar Ceramic Countertop Basin (Rectangular)', brand: 'Jaquar', price: 2900.0, rating: 4.8, certified: 'IS:2556' }
        ]
      },
      {
        id: 'plm-fittings',
        grade: 'CP Brass Faucets & Showers',
        desc: 'Lead-free forged brass chrome plated bath taps, diverters & rain showers',
        subproducts: [
          { name: 'Jaquar Florentine Concealed Diverter Set', brand: 'Jaquar', price: 4850.0, rating: 4.9, certified: 'IS:8931' },
          { name: 'Kohler Kumin Basin Mixer Faucet (Hot & Cold)', brand: 'Kohler', price: 3600.0, rating: 4.9, certified: 'EN 200' },
          { name: 'Jaquar Alive Basin Tap (Quarter-Turn)', brand: 'Jaquar', price: 1450.0, rating: 4.8, certified: 'IS:8931' },
          { name: 'Zoloto Forged Brass Ball Valve (1 inch)', brand: 'Zoloto', price: 680.0, rating: 4.8, certified: 'IS:9890' }
        ]
      },
      {
        id: 'plm-tank',
        grade: 'Overhead Tanks & Pressure Pumps',
        desc: 'Multi-layer virgin food-grade water storage & automatic booster pumps',
        subproducts: [
          { name: 'Sintex 4-Layer Antibacterial Overhead Tank (1000L)', brand: 'Sintex', price: 8900.0, rating: 4.9, certified: 'IS:12701' },
          { name: 'Supreme 5-Layer Foam Insulated Tank (1000L)', brand: 'Supreme', price: 9400.0, rating: 4.8, certified: 'IS:12701' },
          { name: 'Crompton 0.5 HP Automatic Pressure Booster Pump', brand: 'Crompton', price: 11200.0, rating: 4.8, certified: 'IS:8472' }
        ]
      }
    ]
  },

  Paint: {
    category: 'Paint',
    baseUnit: 'Litre',
    marketTrend: '+1.8% (Titanium dioxide global rate)',
    trendDirection: 'up',
    lastSync: 'Indian Paint Association Wholesale Index',
    products: [
      {
        id: 'pnt-lux-int',
        grade: 'Interior Luxury Emulsion',
        desc: 'Silky sheen, stain-resistant Teflon finish with ultra-low VOC',
        subproducts: [
          { name: 'Asian Paints Royale Luxury Emulsion (Teflon)', brand: 'Asian Paints', price: 540.0, rating: 4.9, certified: 'IS:15489' },
          { name: 'Dulux Velvet Touch Diamond Glow Emulsion', brand: 'Dulux', price: 510.0, rating: 4.8, certified: 'IS:15489' },
          { name: 'Berger Silk Glamor Luxury Emulsion', brand: 'Berger', price: 480.0, rating: 4.8, certified: 'IS:15489' }
        ]
      },
      {
        id: 'pnt-prem-int',
        grade: 'Interior Premium Acrylic',
        desc: 'Smooth matte/satin finish, washable for daily residential wear',
        subproducts: [
          { name: 'Asian Paints Apcolite Premium Emulsion', brand: 'Asian Paints', price: 360.0, rating: 4.8, certified: 'IS:15489' },
          { name: 'Dulux Promise Interior Acrylic Emulsion', brand: 'Dulux', price: 310.0, rating: 4.7, certified: 'IS:15489' },
          { name: 'Berger Easy Clean Stain-Resistant Acrylic', brand: 'Berger', price: 340.0, rating: 4.7, certified: 'IS:15489' }
        ]
      },
      {
        id: 'pnt-ext-apex',
        grade: 'Exterior Weather-Proof Emulsion',
        desc: 'Elastomeric silicon-enriched coating against UV, rain & algae',
        subproducts: [
          { name: 'Asian Paints Apex Ultima Protek (10-Yr Warranty)', brand: 'Asian Paints', price: 490.0, rating: 4.9, certified: 'IS:15489' },
          { name: 'Asian Paints Apex Weatherproof Emulsion', brand: 'Asian Paints', price: 380.0, rating: 4.8, certified: 'IS:15489' },
          { name: 'Berger WeatherCoat Long Life 10', brand: 'Berger', price: 440.0, rating: 4.8, certified: 'IS:15489' }
        ]
      },
      {
        id: 'pnt-primer-putty',
        grade: 'Primer & Wall Putty',
        desc: 'Substrate leveling and base sealer coat before emulsion application',
        subproducts: [
          { name: 'Birla White Wall Seal Waterproof Putty (40kg bag)', brand: 'Birla White', price: 920.0, rating: 4.9, certified: 'Polymer Base' },
          { name: 'Asian Paints TruCare Interior Wall Primer (1 Litre)', brand: 'Asian Paints', price: 165.0, rating: 4.8, certified: 'Water Based' },
          { name: 'Asian Paints Exterior Damp Proof Primer (1 Litre)', brand: 'Asian Paints', price: 240.0, rating: 4.9, certified: 'Elastomeric' }
        ]
      }
    ]
  },

  Sand: {
    category: 'Sand',
    baseUnit: 'cu.ft',
    marketTrend: 'Stable (Quarry dispatch quota)',
    trendDirection: 'stable',
    lastSync: 'Regional Mining & Aggregates Board Feed',
    products: [
      {
        id: 'snd-msand-conc',
        grade: 'Zone II M-Sand (Manufactured)',
        desc: 'VSI crushed granite cubical particles (0-4.75mm) for high-strength RCC',
        subproducts: [
          { name: 'Apex Double Washed Concrete M-Sand (Zone II)', brand: 'Apex VSI', price: 58.0, rating: 4.8, certified: 'IS:383 Zone II' },
          { name: 'RoboSand Concrete Grade (Triple Washed)', brand: 'RoboSilicon', price: 62.0, rating: 4.9, certified: 'IS:383 Zone II' },
          { name: 'UltraSand High Compaction M-Sand', brand: 'UltraSand', price: 56.0, rating: 4.7, certified: 'IS:383 Zone II' }
        ]
      },
      {
        id: 'snd-psand',
        grade: 'Plastering M-Sand (P-Sand)',
        desc: 'Superfine micro-filtered sand (0-2.36mm) for smooth zero-crack wall plastering',
        subproducts: [
          { name: 'Apex UltraFine P-Sand for Internal Plaster', brand: 'Apex VSI', price: 65.0, rating: 4.9, certified: 'IS:1542' },
          { name: 'RoboPlast Super Smooth Plastering Sand', brand: 'RoboSilicon', price: 68.0, rating: 4.9, certified: 'IS:1542' }
        ]
      },
      {
        id: 'snd-river',
        grade: 'Natural River Sand',
        desc: 'Natural riverbed quartz sand (Silt content rigorously filtered < 3%)',
        subproducts: [
          { name: 'Government Certified Clean Natural River Sand', brand: 'Govt Depot', price: 98.0, rating: 4.8, certified: 'IS:383' },
          { name: 'Screened Godavari / Kaveri River Sand', brand: 'Certified Mining', price: 105.0, rating: 4.9, certified: 'IS:383' }
        ]
      },
      {
        id: 'snd-filling',
        grade: 'Filling Sand / Pit Sand',
        desc: 'Soil/sand mix for basement plinth backfilling and ground stabilization',
        subproducts: [
          { name: 'Compacted Red Earth / Plinth Filling Sand', brand: 'Local Quarry', price: 28.0, rating: 4.6, certified: 'MoRTH' }
        ]
      }
    ]
  },

  Aggregates: {
    category: 'Aggregates',
    baseUnit: 'cu.ft',
    marketTrend: '+0.5% (Diesel transport surcharge)',
    trendDirection: 'up',
    lastSync: 'Crusher Owners Consortium Live Feed',
    products: [
      {
        id: 'agg-20mm',
        grade: '20mm Crushed Blue Metal (Granite)',
        desc: 'Angular crushed hard granite stone for RCC Slabs, Beams & Columns',
        subproducts: [
          { name: 'Apex 20mm VSI Angular Crushed Blue Granite', brand: 'Apex Quarry', price: 46.0, rating: 4.9, certified: 'IS:383' },
          { name: 'UltraStone 20mm Machine Crushed Aggregate', brand: 'UltraStone', price: 44.0, rating: 4.8, certified: 'IS:383' },
          { name: 'GMR Infra Clean Washed 20mm Granite', brand: 'GMR Quarry', price: 48.0, rating: 4.8, certified: 'IS:383' }
        ]
      },
      {
        id: 'agg-10mm',
        grade: '10mm Down Aggregate (Grit)',
        desc: 'Fine coarse aggregate for congested rebar sections, lintels & chajjas',
        subproducts: [
          { name: 'Apex 10mm Angular Crushed Granite Grit', brand: 'Apex Quarry', price: 49.0, rating: 4.8, certified: 'IS:383' },
          { name: 'RoboStone 10mm Micro Aggregate', brand: 'RoboSilicon', price: 51.0, rating: 4.8, certified: 'IS:383' }
        ]
      },
      {
        id: 'agg-40mm',
        grade: '40mm Ballast Stone',
        desc: 'Coarse ballast for PCC base concrete, foundation bedding & mass footing',
        subproducts: [
          { name: 'Standard 40mm Crushed Granite Ballast', brand: 'Local Crusher', price: 39.0, rating: 4.7, certified: 'IS:383' }
        ]
      },
      {
        id: 'agg-gsb',
        grade: 'Granular Sub-Base (GSB)',
        desc: 'Graded stone aggregate mix for driveways, flooring base & road pavement',
        subproducts: [
          { name: 'WMM / GSB Graded Sub-Base Mix', brand: 'Apex Quarry', price: 32.0, rating: 4.7, certified: 'MoRTH Sec 400' }
        ]
      }
    ]
  }
};

/**
 * Calculate the effective unit price for a subproduct considering regional market factor
 */
export const getEffectiveSubproductPrice = (category, subproductName, region = 'National Average') => {
  const cat = REALTIME_MATERIAL_CATALOG[category];
  if (!cat || !cat.products) return null;
  const multiplier = REGIONAL_MARKET_FACTORS[region]?.multiplier || 1.0;

  for (const prod of cat.products) {
    const sub = prod.subproducts.find(s => s.name === subproductName);
    if (sub) {
      return Math.round(sub.price * multiplier * 10) / 10;
    }
  }
  return null;
};

/**
 * Returns summary statistics and price ranges across all material categories
 */
export const getMaterialCatalogSummary = (region = 'National Average') => {
  const multiplier = REGIONAL_MARKET_FACTORS[region]?.multiplier || 1.0;
  const summary = {};

  for (const [catName, catData] of Object.entries(REALTIME_MATERIAL_CATALOG)) {
    let min = Infinity;
    let max = -Infinity;
    let count = 0;
    const brandsSet = new Set();

    if (catData.products) {
      for (const prod of catData.products) {
        for (const sub of prod.subproducts) {
          const p = Math.round(sub.price * multiplier * 10) / 10;
          if (p < min) min = p;
          if (p > max) max = p;
          if (sub.brand) brandsSet.add(sub.brand);
          count++;
        }
      }
    }

    summary[catName] = {
      category: catName,
      baseUnit: catData.baseUnit,
      marketTrend: catData.marketTrend,
      minPrice: min === Infinity ? 0 : min,
      maxPrice: max === -Infinity ? 0 : max,
      subproductCount: count,
      brands: Array.from(brandsSet)
    };
  }

  return summary;
};
