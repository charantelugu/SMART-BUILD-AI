// Initial realistic market prices for construction materials (INR - India baseline)
export const INITIAL_MATERIALS = [
  {
    id: 1,
    name: "Cement (OPC 53 / PPC)",
    category: "Cement",
    unit: "Bags (50kg)",
    price: 395,
    supplier: "UltraTech & ACC Building Solutions",
    location: "National Average",
    quality: "Grade 53 Premium",
    updatedAt: "2026-09-20"
  },
  {
    id: 2,
    name: "TMT Steel Rebars (Fe 550D)",
    category: "Steel",
    unit: "kg",
    price: 68,
    supplier: "Tata Tiscon / Jindal Panther",
    location: "National Average",
    quality: "Fe 550D High Tensile",
    updatedAt: "2026-09-21"
  },
  {
    id: 3,
    name: "Red Clay Kiln Bricks",
    category: "Bricks",
    unit: "Pieces",
    price: 9.5,
    supplier: "Standard Brick Kiln Suppliers",
    location: "National Average",
    quality: "Class 1 Red Kiln",
    updatedAt: "2026-09-18"
  },
  {
    id: 4,
    name: "Vitrified Floor Tiles (4x2 ft)",
    category: "Tiles",
    unit: "sq.ft",
    price: 65,
    supplier: "Kajaria / Somany Ceramics",
    location: "National Average",
    quality: "Double Charge GVT",
    updatedAt: "2026-09-19"
  },
  {
    id: 5,
    name: "CPVC & SWR Plumbing Pipes",
    category: "Pipes",
    unit: "meter",
    price: 185,
    supplier: "Astral / Supreme Industries",
    location: "National Average",
    quality: "SDR 11 Lead Free",
    updatedAt: "2026-09-15"
  },
  {
    id: 6,
    name: "Electrical Fixtures & Wiring",
    category: "Electrical",
    unit: "Subtotal Pack",
    price: 1,
    supplier: "Havells / Schneider / Finolex",
    location: "National Average",
    quality: "FR-LSH Flame Retardant",
    updatedAt: "2026-09-20"
  },
  {
    id: 7,
    name: "Plumbing Fixtures & Sanitary",
    category: "Plumbing",
    unit: "Subtotal Pack",
    price: 1,
    supplier: "Jaquar / Kohler / Hindware",
    location: "National Average",
    quality: "Brass & Vitreous China",
    updatedAt: "2026-09-20"
  },
  {
    id: 8,
    name: "Interior & Exterior Emulsion Paint",
    category: "Paint",
    unit: "Litre",
    price: 360,
    supplier: "Asian Paints Royale / Apex",
    location: "National Average",
    quality: "Anti-fungal Luxury Emulsion",
    updatedAt: "2026-09-17"
  },
  {
    id: 9,
    name: "Manufactured Sand (M-Sand / River)",
    category: "Sand",
    unit: "cu.ft",
    price: 58,
    supplier: "Apex Aggregates & Sand Co.",
    location: "National Average",
    quality: "Zone II River Sand / Plastering M-Sand",
    updatedAt: "2026-09-19"
  },
  {
    id: 10,
    name: "Coarse Aggregates (20mm Blue Metal)",
    category: "Aggregates",
    unit: "cu.ft",
    price: 46,
    supplier: "Granite Quarry Consortium",
    location: "National Average",
    quality: "20mm Angular Crushed Granite",
    updatedAt: "2026-09-19"
  }
];

export const INITIAL_PROJECT = {
  id: 101,
  projectName: "Greenwood Modern Villa",
  location: "Sector 48, Urban Heights",
  landLength: 50,
  landWidth: 30,
  landArea: 1500,
  roadWidth: 30,
  facing: "North-East",
  floors: "G + 1",
  budget: 5500000,
  constructionQuality: "Premium",
  designStyle: "Modern",
  exteriorStyle: "Modern",
  livingRoomStyle: "Modern Minimalist",
  bedroomStyle: "Contemporary Luxury",
  kitchenStyle: "Italian Modular",
  bathroomStyle: "Spa Contemporary",
  requirements: {
    bedrooms: 3,
    bathrooms: 3,
    kitchen: 1,
    livingRoom: 1,
    diningRoom: 1,
    poojaRoom: 1,
    balcony: 2,
    parking: 1,
    garden: 1,
    homeOffice: 1,
    storeRoom: 1,
    utilityRoom: 1
  }
};
