-- SMART BUILD AI Database Schema
-- Compatible with MySQL 8.x and ANSI SQL / H2

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'HOMEOWNER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    project_name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    land_length DOUBLE NOT NULL,
    land_width DOUBLE NOT NULL,
    land_area DOUBLE NOT NULL,
    road_width DOUBLE,
    facing VARCHAR(50),
    floors VARCHAR(50),
    budget DOUBLE,
    construction_quality VARCHAR(50),
    design_style VARCHAR(50),
    exterior_style VARCHAR(50),
    living_room_style VARCHAR(50),
    bedroom_style VARCHAR(50),
    kitchen_style VARCHAR(50),
    bathroom_style VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    minimum_stock INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(50),
    email VARCHAR(100),
    address VARCHAR(255),
    rating DOUBLE DEFAULT 4.5
);

CREATE TABLE IF NOT EXISTS material_prices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_id BIGINT,
    supplier VARCHAR(200),
    location VARCHAR(150),
    quality VARCHAR(100),
    price DOUBLE NOT NULL,
    updated_at VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS house_requirements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    bedrooms INT DEFAULT 3,
    bathrooms INT DEFAULT 3,
    kitchen INT DEFAULT 1,
    living_room INT DEFAULT 1,
    dining_room INT DEFAULT 1,
    pooja_room INT DEFAULT 1,
    balcony INT DEFAULT 2,
    parking INT DEFAULT 1,
    garden INT DEFAULT 1,
    home_office INT DEFAULT 1,
    store_room INT DEFAULT 1,
    utility_room INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS room_requirements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    room_name VARCHAR(100) NOT NULL,
    target_area_sqft DOUBLE,
    target_floor INT DEFAULT 0,
    vastu_zone VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS cost_estimates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    built_up_area DOUBLE NOT NULL,
    rate_per_sqft DOUBLE NOT NULL,
    total_material_cost DOUBLE NOT NULL,
    labour_cost DOUBLE NOT NULL,
    interior_cost DOUBLE NOT NULL,
    doors_windows_cost DOUBLE NOT NULL,
    other_costs DOUBLE NOT NULL,
    total_estimated_cost DOUBLE NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    material_name VARCHAR(150),
    category VARCHAR(100),
    quantity DOUBLE,
    unit VARCHAR(50),
    rate DOUBLE,
    total_cost DOUBLE
);
