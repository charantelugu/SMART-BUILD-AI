-- Seed Data for SMART BUILD AI

-- 1. Materials
INSERT INTO materials (id, name, category, unit, minimum_stock) VALUES
(1, 'Cement (OPC 53 / PPC)', 'Cement', 'Bags (50kg)', 100),
(2, 'TMT Steel Rebars (Fe 550D)', 'Steel', 'kg', 500),
(3, 'Red Clay Kiln Bricks', 'Bricks', 'Pieces', 5000),
(4, 'Vitrified Floor Tiles (4x2 ft)', 'Tiles', 'sq.ft', 200),
(5, 'CPVC & SWR Plumbing Pipes', 'Pipes', 'meter', 50),
(6, 'Electrical Fixtures & Wiring', 'Electrical', 'Subtotal Pack', 10),
(7, 'Plumbing Fixtures & Sanitary', 'Plumbing', 'Subtotal Pack', 10),
(8, 'Interior & Exterior Emulsion Paint', 'Paint', 'Litre', 50),
(9, 'Manufactured Sand (M-Sand / River)', 'Sand', 'cu.ft', 500),
(10, 'Coarse Aggregates (20mm Blue Metal)', 'Aggregates', 'cu.ft', 500);

-- 2. Material Prices (Latest Market Prices)
INSERT INTO material_prices (id, material_id, supplier, location, quality, price, updated_at) VALUES
(1, 1, 'UltraTech & ACC Building Solutions', 'National Average', 'Grade 53 Premium', 395.0, '2026-09-20'),
(2, 2, 'Tata Tiscon / Jindal Panther', 'National Average', 'Fe 550D High Tensile', 68.0, '2026-09-21'),
(3, 3, 'Standard Brick Kiln Suppliers', 'National Average', 'Class 1 Red Kiln', 9.5, '2026-09-18'),
(4, 4, 'Kajaria / Somany Ceramics', 'National Average', 'Double Charge GVT', 65.0, '2026-09-19'),
(5, 5, 'Astral / Supreme Industries', 'National Average', 'SDR 11 Lead Free', 185.0, '2026-09-15'),
(6, 6, 'Havells / Schneider / Finolex', 'National Average', 'FR-LSH Flame Retardant', 1.0, '2026-09-20'),
(7, 7, 'Jaquar / Kohler / Hindware', 'National Average', 'Brass & Vitreous China', 1.0, '2026-09-20'),
(8, 8, 'Asian Paints Royale / Apex', 'National Average', 'Anti-fungal Luxury Emulsion', 360.0, '2026-09-17'),
(9, 9, 'Apex Aggregates & Sand Co.', 'National Average', 'Zone II M-Sand', 58.0, '2026-09-19'),
(10, 10, 'Granite Quarry Consortium', 'National Average', '20mm Angular Crushed Granite', 46.0, '2026-09-19');

-- 3. Default Project
INSERT INTO projects (id, user_id, project_name, location, land_length, land_width, land_area, road_width, facing, floors, budget, construction_quality, design_style, exterior_style, living_room_style, bedroom_style, kitchen_style, bathroom_style) VALUES
(101, 1, 'Greenwood Modern Villa', 'Sector 48, Urban Heights', 50.0, 30.0, 1500.0, 30.0, 'North-East', 'G + 1', 5500000.0, 'Premium', 'Modern', 'Modern', 'Modern Minimalist', 'Contemporary Luxury', 'Italian Modular', 'Spa Contemporary');

-- 4. House Requirements
INSERT INTO house_requirements (id, project_id, bedrooms, bathrooms, kitchen, living_room, dining_room, pooja_room, balcony, parking, garden, home_office, store_room, utility_room) VALUES
(1, 101, 3, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1);
