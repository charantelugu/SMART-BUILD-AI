import React, { useState, useRef } from 'react';
import {
  Compass,
  DoorOpen,
  Eye,
  EyeOff,
  Sliders,
  RotateCcw,
  Hand,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Maximize,
  Grid,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function BlueprintCanvas({
  project,
  planData,
  customDimensions,
  onDimensionsChange,
  onOpenDimensionEditor
}) {
  const [activeFloor, setActiveFloor] = useState(0);
  const [showDoors, setShowDoors] = useState(true);
  const [showWindows, setShowWindows] = useState(true);
  const [isDragMode, setIsDragMode] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null); // 'master', 'living', 'kitchen', 'dining', 'pooja', 'porch', 'bath', 'dressing', etc.

  const svgRef = useRef(null);

  // Active custom dimensions or project defaults
  const dims = customDimensions || {};
  const length = Number(dims.landLength || project?.landLength || 50);
  const width = Number(dims.landWidth || project?.landWidth || 30);
  const facing = project?.facing || 'North-East';
  const floors = project?.floors || 'G + 1';

  // Floor List
  const floorList = ['Ground Floor'];
  if (floors.includes('G + 1')) floorList.push('First Floor');
  if (floors.includes('G + 2')) { floorList.push('First Floor'); floorList.push('Second Floor'); }
  if (floors.includes('G + 3')) { floorList.push('First Floor'); floorList.push('Second Floor'); floorList.push('Third Floor'); }

  // Canvas Geometry
  const canvasWidth = 840;
  const canvasHeight = 560;
  const margin = 55;
  const plotW = canvasWidth - (margin * 2);
  const plotH = canvasHeight - (margin * 2);

  // Initial Wall Coordinates (SVG pixel coordinates for every partition wall)
  // Perfectly tiled geometry with ZERO gaps between rooms and outer setbacks
  const defaultWalls = {
    // Outer boundaries (setback walls)
    left: margin + 30,
    right: margin + plotW - 30,
    top: margin + 30,
    bottom: margin + plotH - 45,

    // Ground Floor Partitions
    masterDining: margin + 30 + (plotW - 60) * 0.44, // Vertical: Left Wing (Master/Bath) vs Central Dining
    bathEast: margin + 30 + (plotW - 60) * 0.26,     // Vertical: Ensuite Bath vs Walk-in Dressing
    diningKitchen: margin + 30 + (plotW - 60) * 0.72, // Vertical: Central Dining vs Right Wing (Kitchen/Pooja)
    porchLiving: margin + 30 + (plotW - 60) * 0.42,   // Vertical: Car Porch vs Formal Living Room
    frontBand: margin + plotH - 45 - 115,             // Horizontal: Front Band (Living/Porch) vs Rear Wing (Dining/Bed/Kitchen)
    masterBath: margin + 30 + (plotH - 45 - 115 - (margin + 30)) * 0.65, // Horizontal: Master Bed vs Bath/Dressing
    kitchenPooja: margin + 30 + (plotH - 45 - 115 - (margin + 30)) * 0.35, // Horizontal: Pooja vs Modular Kitchen

    // Upper Floor Partitions
    upperBed2: margin + 30 + (plotW - 60) * 0.40,     // Vertical: Bed 2 vs Family Lounge
    upperBed3: margin + 30 + (plotW - 60) * 0.60,     // Vertical: Family Lounge vs Bed 3
    upperBalcony: margin + plotH - 45 - 100           // Horizontal: Upper Rooms vs Cantilevered Balcony
  };

  const [rawWalls, setWalls] = useState(defaultWalls);
  const walls = { ...defaultWalls, ...rawWalls };

  // Active Drag State
  const [activeDrag, setActiveDrag] = useState(null); // { wallKey, axis, startX, startY, currentX, currentY, wallName }
  const [hoveredWall, setHoveredWall] = useState(null);

  // Scale factor: real-world feet per SVG pixel
  const houseSpanX = Math.max(100, walls.right - walls.left);
  const houseSpanY = Math.max(100, walls.bottom - walls.top);
  const feetPerPixelX = width / houseSpanX;
  const feetPerPixelY = length / houseSpanY;

  const toFeetX = (px) => Math.round(px * feetPerPixelX * 2) / 2;
  const toFeetY = (px) => Math.round(px * feetPerPixelY * 2) / 2;

  // Real-time room geometries & feet dimensions (100% GAP-FREE TESSELLATION)
  const rooms = {
    master: {
      id: 'master',
      name: 'Master Bedroom',
      zone: 'SW (Nairuthi)',
      x: walls.left,
      y: walls.top,
      w: Math.max(20, walls.masterDining - walls.left),
      h: Math.max(20, walls.masterBath - walls.top),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    bath: {
      id: 'bath',
      name: 'Ensuite Bathroom',
      zone: 'West / SW',
      x: walls.left,
      y: walls.masterBath,
      w: Math.max(20, walls.bathEast - walls.left),
      h: Math.max(20, walls.frontBand - walls.masterBath),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    dressing: {
      id: 'dressing',
      name: 'Walk-in Dressing & Vanity',
      zone: 'SW Internal',
      x: walls.bathEast,
      y: walls.masterBath,
      w: Math.max(20, walls.masterDining - walls.bathEast),
      h: Math.max(20, walls.frontBand - walls.masterBath),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    dining: {
      id: 'dining',
      name: 'Central Dining Hall',
      zone: 'East / Central',
      x: walls.masterDining,
      y: walls.top, // Seamless flush start - NO GAP!
      w: Math.max(20, walls.diningKitchen - walls.masterDining),
      h: Math.max(20, walls.frontBand - walls.top), // Seamless flush end - NO GAP!
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    pooja: {
      id: 'pooja',
      name: 'Pooja Sacred Room',
      zone: 'NE (Ishanya)',
      x: walls.diningKitchen,
      y: walls.top,
      w: Math.max(20, walls.right - walls.diningKitchen),
      h: Math.max(20, walls.kitchenPooja - walls.top),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    kitchen: {
      id: 'kitchen',
      name: 'Modular Kitchen',
      zone: 'SE (Agni)',
      x: walls.diningKitchen,
      y: walls.kitchenPooja,
      w: Math.max(20, walls.right - walls.diningKitchen),
      h: Math.max(20, walls.frontBand - walls.kitchenPooja),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    porch: {
      id: 'porch',
      name: 'Car Porch & Entry',
      zone: 'NW / North',
      x: walls.left,
      y: walls.frontBand,
      w: Math.max(20, walls.porchLiving - walls.left),
      h: Math.max(20, walls.bottom - walls.frontBand),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    living: {
      id: 'living',
      name: 'Formal Living Room',
      zone: 'NE / East',
      x: walls.porchLiving,
      y: walls.frontBand,
      w: Math.max(20, walls.right - walls.porchLiving),
      h: Math.max(20, walls.bottom - walls.frontBand),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    // Upper Floor (100% GAP-FREE TESSELLATION)
    lounge: {
      id: 'lounge',
      name: 'Upper Family Lounge',
      zone: 'Central',
      x: walls.upperBed2,
      y: walls.top, // Seamless flush start - NO GAP!
      w: Math.max(20, walls.upperBed3 - walls.upperBed2),
      h: Math.max(20, walls.upperBalcony - walls.top), // Seamless flush end - NO GAP!
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    bed2: {
      id: 'bed2',
      name: 'Bedroom 2 (Suite)',
      zone: 'North / NW',
      x: walls.left,
      y: walls.top,
      w: Math.max(20, walls.upperBed2 - walls.left),
      h: Math.max(20, walls.upperBalcony - walls.top),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    bed3: {
      id: 'bed3',
      name: 'Bedroom 3 / Study',
      zone: 'South / SE',
      x: walls.upperBed3,
      y: walls.top,
      w: Math.max(20, walls.right - walls.upperBed3),
      h: Math.max(20, walls.upperBalcony - walls.top),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    },
    balcony: {
      id: 'balcony',
      name: 'Cantilevered Deck / Balcony',
      zone: 'Front Facade',
      x: walls.left,
      y: walls.upperBalcony,
      w: Math.max(20, walls.right - walls.left),
      h: Math.max(20, walls.bottom - walls.upperBalcony),
      get lFt() { return toFeetY(this.h); },
      get wFt() { return toFeetX(this.w); },
      get sqft() { return Math.round(this.lFt * this.wFt); }
    }
  };

  // Comprehensive 4-Side Mapping for Every Single Room
  const roomSideConfigs = {
    master: {
      name: 'Master Bedroom',
      icon: '🛏️',
      north: { wallKey: 'outerTop', axis: 'y', label: 'North Outer Wall (Top)' },
      south: { wallKey: 'masterBath', axis: 'y', label: 'Bath Partition Wall (Bottom)' },
      west: { wallKey: 'outerLeft', axis: 'x', label: 'West Outer Wall (Left)' },
      east: { wallKey: 'masterDining', axis: 'x', label: 'Dining Partition Wall (Right)' }
    },
    bath: {
      name: 'Ensuite Bathroom',
      icon: '🚿',
      north: { wallKey: 'masterBath', axis: 'y', label: 'Master Bed Divider (Top)' },
      south: { wallKey: 'frontBand', axis: 'y', label: 'Front Porch Divider (Bottom)' },
      west: { wallKey: 'outerLeft', axis: 'x', label: 'West Outer Wall (Left)' },
      east: { wallKey: 'bathEast', axis: 'x', label: 'Dressing Partition Wall (Right)' }
    },
    dressing: {
      name: 'Walk-in Dressing & Vanity',
      icon: '👔',
      north: { wallKey: 'masterBath', axis: 'y', label: 'Master Bed Divider (Top)' },
      south: { wallKey: 'frontBand', axis: 'y', label: 'Front Divider (Bottom)' },
      west: { wallKey: 'bathEast', axis: 'x', label: 'Ensuite Bath Partition (Left)' },
      east: { wallKey: 'masterDining', axis: 'x', label: 'Dining Hall Divider (Right)' }
    },
    dining: {
      name: 'Central Dining Hall',
      icon: '🍽️',
      north: { wallKey: 'outerTop', axis: 'y', label: 'North Rear Wall (Top)' },
      south: { wallKey: 'frontBand', axis: 'y', label: 'Living Room Divider (Bottom)' },
      west: { wallKey: 'masterDining', axis: 'x', label: 'Master Bed Divider (Left)' },
      east: { wallKey: 'diningKitchen', axis: 'x', label: 'Kitchen / Pooja Divider (Right)' }
    },
    pooja: {
      name: 'Pooja Sacred Room',
      icon: '🪔',
      north: { wallKey: 'outerTop', axis: 'y', label: 'North Ishan Wall (Top)' },
      south: { wallKey: 'kitchenPooja', axis: 'y', label: 'Kitchen Partition Wall (Bottom)' },
      west: { wallKey: 'diningKitchen', axis: 'x', label: 'Dining Hall Divider (Left)' },
      east: { wallKey: 'outerRight', axis: 'x', label: 'East Outer Wall (Right)' }
    },
    kitchen: {
      name: 'Modular Kitchen',
      icon: '🍳',
      north: { wallKey: 'kitchenPooja', axis: 'y', label: 'Pooja Partition Wall (Top)' },
      south: { wallKey: 'frontBand', axis: 'y', label: 'Living Hall Divider (Bottom)' },
      west: { wallKey: 'diningKitchen', axis: 'x', label: 'Dining Hall Divider (Left)' },
      east: { wallKey: 'outerRight', axis: 'x', label: 'East Outer Wall (Right)' }
    },
    porch: {
      name: 'Car Porch & Entry',
      icon: '🚗',
      north: { wallKey: 'frontBand', axis: 'y', label: 'Rear Partition Wall (Top)' },
      south: { wallKey: 'outerBottom', axis: 'y', label: 'South Front Wall (Bottom)' },
      west: { wallKey: 'outerLeft', axis: 'x', label: 'West Boundary Wall (Left)' },
      east: { wallKey: 'porchLiving', axis: 'x', label: 'Living Room Divider (Right)' }
    },
    living: {
      name: 'Formal Living Room',
      icon: '🛋️',
      north: { wallKey: 'frontBand', axis: 'y', label: 'Dining / Kitchen Divider (Top)' },
      south: { wallKey: 'outerBottom', axis: 'y', label: 'South Main Facade (Bottom)' },
      west: { wallKey: 'porchLiving', axis: 'x', label: 'Car Porch Divider (Left)' },
      east: { wallKey: 'outerRight', axis: 'x', label: 'East Outer Wall (Right)' }
    },
    // Upper Floor
    lounge: {
      name: 'Upper Family Lounge',
      icon: '🛋️',
      north: { wallKey: 'outerTop', axis: 'y', label: 'North Rear Wall (Top)' },
      south: { wallKey: 'upperBalcony', axis: 'y', label: 'Balcony Slider Divider (Bottom)' },
      west: { wallKey: 'upperBed2', axis: 'x', label: 'Bed 2 Divider (Left)' },
      east: { wallKey: 'upperBed3', axis: 'x', label: 'Bed 3 Divider (Right)' }
    },
    bed2: {
      name: 'Bedroom 2 (Suite)',
      icon: '🛏️',
      north: { wallKey: 'outerTop', axis: 'y', label: 'North Rear Wall (Top)' },
      south: { wallKey: 'upperBalcony', axis: 'y', label: 'Front Terrace Divider (Bottom)' },
      west: { wallKey: 'outerLeft', axis: 'x', label: 'West Boundary Wall (Left)' },
      east: { wallKey: 'upperBed2', axis: 'x', label: 'Lounge Divider (Right)' }
    },
    bed3: {
      name: 'Bedroom 3 / Study',
      icon: '📚',
      north: { wallKey: 'outerTop', axis: 'y', label: 'North Rear Wall (Top)' },
      south: { wallKey: 'upperBalcony', axis: 'y', label: 'Front Terrace Divider (Bottom)' },
      west: { wallKey: 'upperBed3', axis: 'x', label: 'Lounge Divider (Left)' },
      east: { wallKey: 'outerRight', axis: 'x', label: 'East Boundary Wall (Right)' }
    },
    balcony: {
      name: 'Cantilevered Balcony',
      icon: '🌅',
      north: { wallKey: 'upperBalcony', axis: 'y', label: 'Lounge & Bed Divider (Top)' },
      south: { wallKey: 'outerBottom', axis: 'y', label: 'Front Glass Railing (Bottom)' },
      west: { wallKey: 'outerLeft', axis: 'x', label: 'West Boundary Wall (Left)' },
      east: { wallKey: 'outerRight', axis: 'x', label: 'East Boundary Wall (Right)' }
    }
  };

  // SVG coordinate transformation
  const getSvgPoint = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    let cx = e.clientX;
    let cy = e.clientY;

    if (e.touches && e.touches.length > 0) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      cx = e.changedTouches[0].clientX;
      cy = e.changedTouches[0].clientY;
    }

    pt.x = cx;
    pt.y = cy;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  // Synchronize updated dimensions with parent project state & cost estimator
  const syncDimensions = (wMap) => {
    if (!onDimensionsChange) return;
    const w = wMap || walls;

    const spanX = Math.max(100, w.right - w.left);
    const spanY = Math.max(100, w.bottom - w.top);
    const fppX = width / spanX;
    const fppY = length / spanY;
    const fX = (px) => Math.round(px * fppX * 2) / 2;
    const fY = (px) => Math.round(px * fppY * 2) / 2;

    const updatedDims = {
      ...dims,
      livingRoom: { ...dims.livingRoom, length: fY(w.bottom - w.frontBand), width: fX(w.right - w.porchLiving) },
      masterBedroom: { ...dims.masterBedroom, length: fY(w.masterBath - w.top), width: fX(w.masterDining - w.left) },
      diningRoom: { ...dims.diningRoom, length: fY(w.frontBand - w.top), width: fX(w.diningKitchen - w.masterDining) },
      kitchen: { ...dims.kitchen, length: fY(w.frontBand - w.kitchenPooja), width: fX(w.right - w.diningKitchen) },
      poojaRoom: { ...dims.poojaRoom, length: fY(w.kitchenPooja - w.top), width: fX(w.right - w.diningKitchen) },
      carPorch: { ...dims.carPorch, length: fY(w.bottom - w.frontBand), width: fX(w.porchLiving - w.left) },
      ensuiteBath: { ...dims.ensuiteBath, length: fY(w.frontBand - w.masterBath), width: fX(w.bathEast - w.left) },
      familyLounge: { ...dims.familyLounge, length: fY(w.upperBalcony - w.top), width: fX(w.upperBed3 - w.upperBed2) },
      bedroom2: { ...dims.bedroom2, length: fY(w.upperBalcony - w.top), width: fX(w.upperBed2 - w.left) },
      bedroom3: { ...dims.bedroom3, length: fY(w.upperBalcony - w.top), width: fX(w.right - w.upperBed3) },
      balcony: { ...dims.balcony, length: fY(w.bottom - w.upperBalcony), width: fX(w.right - w.left) }
    };

    const groundCarpet =
      Math.round(updatedDims.livingRoom.length * updatedDims.livingRoom.width) +
      Math.round(updatedDims.masterBedroom.length * updatedDims.masterBedroom.width) +
      Math.round(updatedDims.diningRoom.length * updatedDims.diningRoom.width) +
      Math.round(updatedDims.kitchen.length * updatedDims.kitchen.width) +
      Math.round(updatedDims.poojaRoom.length * updatedDims.poojaRoom.width) +
      Math.round(updatedDims.carPorch.length * updatedDims.carPorch.width) +
      Math.round(updatedDims.ensuiteBath.length * updatedDims.ensuiteBath.width);

    const upperCarpet =
      Math.round(updatedDims.familyLounge.length * updatedDims.familyLounge.width) +
      Math.round(updatedDims.bedroom2.length * updatedDims.bedroom2.width) +
      Math.round(updatedDims.bedroom3.length * updatedDims.bedroom3.width) +
      Math.round(updatedDims.balcony.length * updatedDims.balcony.width);

    const totalCarpet = floors.includes('G +') ? groundCarpet + upperCarpet : groundCarpet;
    updatedDims.calculatedBuiltUpArea = Math.round(totalCarpet * 1.20);
    updatedDims.calculatedCarpetArea = totalCarpet;

    onDimensionsChange(updatedDims);
  };

  // Start dragging any wall handle or side bar
  const startDrag = (wallKey, axis, wallName, e) => {
    if (!isDragMode) return;
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = getSvgPoint(e);

    setActiveDrag({
      wallKey,
      axis,
      wallName,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y
    });
  };

  // Move handle on mouse move or finger touch move with smooth clamping
  const onPointerMove = (e) => {
    if (!activeDrag || !isDragMode) return;
    e.preventDefault();
    const { x, y } = getSvgPoint(e);

    setWalls((prev) => {
      const next = { ...defaultWalls, ...prev };
      const k = activeDrag.wallKey;

      if (k === 'outerLeft') {
        next.left = Math.min(next.bathEast - 35, Math.max(margin + 10, x));
      } else if (k === 'outerRight') {
        next.right = Math.max(next.diningKitchen + 45, Math.min(canvasWidth - margin - 10, x));
      } else if (k === 'outerTop') {
        next.top = Math.min(Math.min(next.kitchenPooja, next.masterBath) - 35, Math.max(margin + 10, y));
      } else if (k === 'outerBottom') {
        next.bottom = Math.max(next.frontBand + 45, Math.min(canvasHeight - margin - 10, y));
      } else if (k === 'masterDining') {
        next.masterDining = Math.min(next.diningKitchen - 45, Math.max(next.bathEast + 25, next.left + 45, x));
      } else if (k === 'bathEast') {
        next.bathEast = Math.min(next.masterDining - 25, Math.max(next.left + 30, x));
      } else if (k === 'diningKitchen') {
        next.diningKitchen = Math.min(next.right - 45, Math.max(next.masterDining + 45, x));
      } else if (k === 'porchLiving') {
        next.porchLiving = Math.min(next.right - 45, Math.max(next.left + 45, x));
      } else if (k === 'frontBand') {
        next.frontBand = Math.min(next.bottom - 45, Math.max(next.masterBath + 30, next.kitchenPooja + 30, y));
      } else if (k === 'masterBath') {
        next.masterBath = Math.min(next.frontBand - 35, Math.max(next.top + 45, y));
      } else if (k === 'kitchenPooja') {
        next.kitchenPooja = Math.min(next.frontBand - 35, Math.max(next.top + 35, y));
      } else if (k === 'upperBed2') {
        next.upperBed2 = Math.min(next.upperBed3 - 40, Math.max(next.left + 40, x));
      } else if (k === 'upperBed3') {
        next.upperBed3 = Math.min(next.right - 40, Math.max(next.upperBed2 + 40, x));
      } else if (k === 'upperBalcony') {
        next.upperBalcony = Math.min(next.bottom - 40, Math.max(next.top + 60, y));
      }

      return next;
    });

    setActiveDrag((prev) => (prev ? { ...prev, currentX: x, currentY: y } : null));
  };

  // Finish dragging and synchronize updated dimensions
  const onPointerUp = () => {
    if (!activeDrag) return;
    syncDimensions();
    setActiveDrag(null);
  };

  // Direct 1-foot incremental nudger for precision adjustments on mobile/desktop
  const nudgeWall = (wallKey, axis, deltaFt) => {
    const deltaPx = axis === 'x' ? deltaFt / feetPerPixelX : deltaFt / feetPerPixelY;
    setWalls((prev) => {
      const next = { ...defaultWalls, ...prev };
      const currentVal = next[wallKey];
      const targetVal = currentVal + deltaPx;

      if (wallKey === 'outerLeft') {
        next.left = Math.min(next.bathEast - 35, Math.max(margin + 10, targetVal));
      } else if (wallKey === 'outerRight') {
        next.right = Math.max(next.diningKitchen + 45, Math.min(canvasWidth - margin - 10, targetVal));
      } else if (wallKey === 'outerTop') {
        next.top = Math.min(Math.min(next.kitchenPooja, next.masterBath) - 35, Math.max(margin + 10, targetVal));
      } else if (wallKey === 'outerBottom') {
        next.bottom = Math.max(next.frontBand + 45, Math.min(canvasHeight - margin - 10, targetVal));
      } else if (wallKey === 'masterDining') {
        next.masterDining = Math.min(next.diningKitchen - 45, Math.max(next.bathEast + 25, next.left + 45, targetVal));
      } else if (wallKey === 'bathEast') {
        next.bathEast = Math.min(next.masterDining - 25, Math.max(next.left + 30, targetVal));
      } else if (wallKey === 'diningKitchen') {
        next.diningKitchen = Math.min(next.right - 45, Math.max(next.masterDining + 45, targetVal));
      } else if (wallKey === 'porchLiving') {
        next.porchLiving = Math.min(next.right - 45, Math.max(next.left + 45, targetVal));
      } else if (wallKey === 'frontBand') {
        next.frontBand = Math.min(next.bottom - 45, Math.max(next.masterBath + 30, next.kitchenPooja + 30, targetVal));
      } else if (wallKey === 'masterBath') {
        next.masterBath = Math.min(next.frontBand - 35, Math.max(next.top + 45, targetVal));
      } else if (wallKey === 'kitchenPooja') {
        next.kitchenPooja = Math.min(next.frontBand - 35, Math.max(next.top + 35, targetVal));
      } else if (wallKey === 'upperBed2') {
        next.upperBed2 = Math.min(next.upperBed3 - 40, Math.max(next.left + 40, targetVal));
      } else if (wallKey === 'upperBed3') {
        next.upperBed3 = Math.min(next.right - 40, Math.max(next.upperBed2 + 40, targetVal));
      } else if (wallKey === 'upperBalcony') {
        next.upperBalcony = Math.min(next.bottom - 40, Math.max(next.top + 60, targetVal));
      }

      syncDimensions(next);
      return next;
    });
  };

  // Reset to default wall positions
  const handleReset = () => {
    setWalls(defaultWalls);
    setSelectedRoom(null);
    syncDimensions(defaultWalls);
  };

  // Helper to render an interactive draggable wall handle knob
  const renderWallHandle = (wallKey, axis, x, y, label, isHighlighted = false) => {
    const isHovered = hoveredWall === wallKey;
    const isDraggingThis = activeDrag?.wallKey === wallKey;
    const isVertical = axis === 'x';

    return (
      <g
        key={`${wallKey}-${x}-${y}`}
        className={isVertical ? 'canvas-handle-vertical' : 'canvas-handle-horizontal'}
        onMouseDown={(e) => startDrag(wallKey, axis, label, e)}
        onTouchStart={(e) => startDrag(wallKey, axis, label, e)}
        onMouseEnter={() => setHoveredWall(wallKey)}
        onMouseLeave={() => setHoveredWall(null)}
      >
        {/* Large invisible touch hit area for mobile thumb */}
        <circle cx={x} cy={y} r="26" fill="transparent" style={{ touchAction: 'none', cursor: isVertical ? 'ew-resize' : 'ns-resize' }} />

        {/* Visible glowing handle knob */}
        <circle
          cx={x}
          cy={y}
          r={isDraggingThis || isHovered || isHighlighted ? 12 : 9}
          fill={isVertical ? '#0284c7' : '#d97706'}
          stroke="#ffffff"
          strokeWidth={isDraggingThis || isHovered || isHighlighted ? '3' : '2'}
          filter={isDraggingThis || isHovered || isHighlighted ? 'drop-shadow(0 0 12px #38bdf8)' : 'none'}
        />
        <text
          x={x}
          y={y + 3}
          fill="#ffffff"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          pointerEvents="none"
        >
          {isVertical ? '↔' : '↕'}
        </text>
      </g>
    );
  };

  // Helper to render an entire full-span wall dragging corridor + line
  const renderWallCorridor = (wallKey, axis, x1, y1, x2, y2, label) => {
    const isHovered = hoveredWall === wallKey;
    const isDraggingThis = activeDrag?.wallKey === wallKey;
    const isVertical = axis === 'x';

    return (
      <g key={`corridor-${wallKey}`}>
        {/* Visible architectural partition line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isDraggingThis || isHovered ? '#38bdf8' : (isVertical ? 'rgba(56, 189, 248, 0.45)' : 'rgba(245, 158, 11, 0.45)')}
          strokeWidth={isDraggingThis || isHovered ? 4 : 2.5}
          strokeDasharray={isDraggingThis ? 'none' : '4 2'}
        />

        {/* Wide transparent touch hit area along the ENTIRE partition wall line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth="38"
          style={{
            cursor: isVertical ? 'ew-resize' : 'ns-resize',
            touchAction: 'none'
          }}
          onMouseDown={(e) => startDrag(wallKey, axis, label, e)}
          onTouchStart={(e) => startDrag(wallKey, axis, label, e)}
          onMouseEnter={() => setHoveredWall(wallKey)}
          onMouseLeave={() => setHoveredWall(null)}
        />
      </g>
    );
  };

  // Helper to render All-4-Sides Interactive Overlays for Selected Room
  const renderRoom4SidesOverlay = (roomId) => {
    const rm = rooms[roomId];
    const cfg = roomSideConfigs[roomId];
    if (!rm || !cfg) return null;

    const midX = rm.x + (rm.w / 2);
    const midY = rm.y + (rm.h / 2);

    return (
      <g id={`room-4sides-${roomId}`}>
        {/* Selected Room Highlighter Box with Animated Glow */}
        <rect
          x={rm.x}
          y={rm.y}
          width={rm.w}
          height={rm.h}
          fill="rgba(56, 189, 248, 0.12)"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="6 3"
          pointerEvents="none"
        />

        {/* ================= NORTH SIDE HANDLE ================= */}
        <g
          className="canvas-handle-side"
          style={{ cursor: 'ns-resize', touchAction: 'none' }}
          onMouseDown={(e) => startDrag(cfg.north.wallKey, 'y', `${rm.name}: North Wall (Top)`, e)}
          onTouchStart={(e) => startDrag(cfg.north.wallKey, 'y', `${rm.name}: North Wall (Top)`, e)}
        >
          <line x1={rm.x} y1={rm.y} x2={rm.x + rm.w} y2={rm.y} stroke="#38bdf8" strokeWidth="4" />
          <line x1={rm.x} y1={rm.y} x2={rm.x + rm.w} y2={rm.y} stroke="transparent" strokeWidth="32" />
          <rect x={midX - 32} y={rm.y - 12} width="64" height="20" rx="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
          <text x={midX} y={rm.y + 2} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none">
            ▲ TOP ▼
          </text>
        </g>

        {/* ================= SOUTH SIDE HANDLE ================= */}
        <g
          className="canvas-handle-side"
          style={{ cursor: 'ns-resize', touchAction: 'none' }}
          onMouseDown={(e) => startDrag(cfg.south.wallKey, 'y', `${rm.name}: South Wall (Bottom)`, e)}
          onTouchStart={(e) => startDrag(cfg.south.wallKey, 'y', `${rm.name}: South Wall (Bottom)`, e)}
        >
          <line x1={rm.x} y1={rm.y + rm.h} x2={rm.x + rm.w} y2={rm.y + rm.h} stroke="#38bdf8" strokeWidth="4" />
          <line x1={rm.x} y1={rm.y + rm.h} x2={rm.x + rm.w} y2={rm.y + rm.h} stroke="transparent" strokeWidth="32" />
          <rect x={midX - 34} y={rm.y + rm.h - 8} width="68" height="20" rx="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
          <text x={midX} y={rm.y + rm.h + 6} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none">
            ▲ BOTTOM ▼
          </text>
        </g>

        {/* ================= WEST SIDE HANDLE ================= */}
        <g
          className="canvas-handle-side"
          style={{ cursor: 'ew-resize', touchAction: 'none' }}
          onMouseDown={(e) => startDrag(cfg.west.wallKey, 'x', `${rm.name}: West Wall (Left)`, e)}
          onTouchStart={(e) => startDrag(cfg.west.wallKey, 'x', `${rm.name}: West Wall (Left)`, e)}
        >
          <line x1={rm.x} y1={rm.y} x2={rm.x} y2={rm.y + rm.h} stroke="#38bdf8" strokeWidth="4" />
          <line x1={rm.x} y1={rm.y} x2={rm.x} y2={rm.y + rm.h} stroke="transparent" strokeWidth="32" />
          <rect x={rm.x - 12} y={midY - 24} width="20" height="48" rx="8" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #f59e0b)" />
          <text x={rm.x - 2} y={midY + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none" transform={`rotate(-90 ${rm.x - 2} ${midY + 4})`}>
            ◄ LEFT ►
          </text>
        </g>

        {/* ================= EAST SIDE HANDLE ================= */}
        <g
          className="canvas-handle-side"
          style={{ cursor: 'ew-resize', touchAction: 'none' }}
          onMouseDown={(e) => startDrag(cfg.east.wallKey, 'x', `${rm.name}: East Wall (Right)`, e)}
          onTouchStart={(e) => startDrag(cfg.east.wallKey, 'x', `${rm.name}: East Wall (Right)`, e)}
        >
          <line x1={rm.x + rm.w} y1={rm.y} x2={rm.x + rm.w} y2={rm.y + rm.h} stroke="#38bdf8" strokeWidth="4" />
          <line x1={rm.x + rm.w} y1={rm.y} x2={rm.x + rm.w} y2={rm.y + rm.h} stroke="transparent" strokeWidth="32" />
          <rect x={rm.x + rm.w - 8} y={midY - 24} width="20" height="48" rx="8" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #f59e0b)" />
          <text x={rm.x + rm.w + 2} y={midY + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none" transform={`rotate(-90 ${rm.x + rm.w + 2} ${midY + 4})`}>
            ◄ RIGHT ►
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className="blueprint-wrapper">
      <div className="blueprint-grid-overlay"></div>

      {/* Comprehensive Direct Touch/Mouse Drag Banner */}
      <div className="drag-instruction-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: isDragMode ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isDragMode ? '0 0 12px rgba(37, 99, 235, 0.6)' : 'none'
          }}>
            <Hand size={15} /> {isDragMode ? 'ALL-SIDE DIRECT DRAG: ZERO-GAP MODE' : 'VIEW ONLY'}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
            <strong>Touch on mobile</strong> or <strong>drag with mouse on PC</strong> on <em>any partition wall or side</em> to resize rooms seamlessly with <strong>zero gaps</strong>.
            {selectedRoom && <span style={{ color: 'var(--accent-light)', marginLeft: '6px' }}>• Active: <strong>{rooms[selectedRoom]?.name}</strong> (Showing 4 draggable sides)</span>}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {selectedRoom && (
            <button
              onClick={() => setSelectedRoom(null)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Clear Room Focus
            </button>
          )}
          <button
            onClick={() => setIsDragMode(!isDragMode)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
          >
            {isDragMode ? 'Pause Dragging' : 'Enable Touch Drag'}
          </button>
          <button
            onClick={handleReset}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '4px 10px', color: 'var(--text-muted)' }}
          >
            <RotateCcw size={13} /> Reset Layout
          </button>
        </div>
      </div>

      {/* QUICK ROOM SELECTOR CHIPS BAR (Touch-friendly room focus on any device) */}
      <div style={{
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '6px',
        WebkitOverflowScrolling: 'touch'
      }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          SELECT ROOM TO ADJUST ALL 4 SIDES:
        </span>
        <button
          onClick={() => setSelectedRoom(null)}
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            border: !selectedRoom ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
            background: !selectedRoom ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            color: !selectedRoom ? '#38bdf8' : 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All Partition Walls (Free Drag)
        </button>

        {activeFloor === 0 ? (
          <>
            <button
              onClick={() => setSelectedRoom('master')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'master' ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'master' ? 'rgba(52, 211, 153, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'master' ? '#34d399' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🛏️ Master Bed ({rooms.master.wFt}′×{rooms.master.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('bath')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'bath' ? '1px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'bath' ? 'rgba(45, 212, 191, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'bath' ? '#2dd4bf' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🚿 Ensuite Bath ({rooms.bath.wFt}′×{rooms.bath.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('dressing')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'dressing' ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'dressing' ? 'rgba(96, 165, 250, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'dressing' ? '#60a5fa' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              👔 Dressing &amp; Closet ({rooms.dressing.wFt}′×{rooms.dressing.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('dining')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'dining' ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'dining' ? 'rgba(129, 140, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'dining' ? '#818cf8' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🍽️ Dining Hall ({rooms.dining.wFt}′×{rooms.dining.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('kitchen')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'kitchen' ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'kitchen' ? 'rgba(192, 132, 252, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'kitchen' ? '#c084fc' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🍳 Modular Kitchen ({rooms.kitchen.wFt}′×{rooms.kitchen.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('pooja')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'pooja' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'pooja' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'pooja' ? '#f59e0b' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🪔 Pooja ({rooms.pooja.wFt}′×{rooms.pooja.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('living')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'living' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'living' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'living' ? '#38bdf8' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🛋️ Living ({rooms.living.wFt}′×{rooms.living.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('porch')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'porch' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'porch' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'porch' ? '#38bdf8' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🚗 Car Porch ({rooms.porch.wFt}′×{rooms.porch.lFt}′)
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedRoom('lounge')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'lounge' ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'lounge' ? 'rgba(129, 140, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'lounge' ? '#818cf8' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🛋️ Lounge ({rooms.lounge.wFt}′×{rooms.lounge.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('bed2')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'bed2' ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'bed2' ? 'rgba(52, 211, 153, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'bed2' ? '#34d399' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🛏️ Bedroom 2 ({rooms.bed2.wFt}′×{rooms.bed2.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('bed3')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'bed3' ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'bed3' ? 'rgba(96, 165, 250, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'bed3' ? '#60a5fa' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              📚 Bedroom 3 ({rooms.bed3.wFt}′×{rooms.bed3.lFt}′)
            </button>
            <button
              onClick={() => setSelectedRoom('balcony')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: selectedRoom === 'balcony' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                background: selectedRoom === 'balcony' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedRoom === 'balcony' ? '#10b981' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🌅 Balcony ({rooms.balcony.wFt}′×{rooms.balcony.lFt}′)
            </button>
          </>
        )}
      </div>

      {/* Top Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(37, 99, 235, 0.25)',
            border: '1px solid var(--primary-light)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#60a5fa',
            fontFamily: 'var(--font-mono)'
          }}>
            PLOT: {length}′ × {width}′ ({length * width} SQ.FT)
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            Facing: <strong style={{ color: 'var(--accent-light)' }}>{facing}</strong>
          </div>

          {/* Optional Numeric View modal button */}
          {onOpenDimensionEditor && (
            <button
              onClick={onOpenDimensionEditor}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.8rem', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sliders size={14} /> Numeric View
            </button>
          )}

          {/* Door Toggle Button */}
          <button
            onClick={() => setShowDoors(!showDoors)}
            className={`btn btn-sm ${showDoors ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            <DoorOpen size={15} /> {showDoors ? 'Hide Door Markers' : 'Show All Doors (D1-D6)'}
          </button>

          {/* Window Toggle Button */}
          <button
            onClick={() => setShowWindows(!showWindows)}
            className={`btn btn-sm ${showWindows ? 'btn-secondary' : 'btn-outline'}`}
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            {showWindows ? <Eye size={14} /> : <EyeOff size={14} />} Windows
          </button>
        </div>

        {/* Floor Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.4)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          {floorList.map((fName, idx) => (
            <button
              key={fName}
              onClick={() => { setActiveFloor(idx); setSelectedRoom(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeFloor === idx ? 'var(--primary)' : 'transparent',
                color: activeFloor === idx ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {fName}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Architectural Blueprint Canvas with Full Touch-Action None */}
      <div
        className="interactive-canvas-container"
        style={{
          position: 'relative',
          background: '#080f1d',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.85)',
          border: activeDrag ? '2px solid #38bdf8' : '1px solid rgba(59, 130, 246, 0.35)'
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          onTouchCancel={onPointerUp}
        >
          {/* Compass Rose */}
          <g transform={`translate(${canvasWidth - 55}, 55)`}>
            <circle cx="0" cy="0" r="24" fill="rgba(15, 23, 42, 0.85)" stroke="#3b82f6" strokeWidth="1.5" />
            <polygon points="0,-18 5,0 -5,0" fill="#ef4444" />
            <polygon points="0,18 5,0 -5,0" fill="#94a3b8" />
            <text x="0" y="-8" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">N</text>
            <text x="12" y="3" fill="#94a3b8" fontSize="8" textAnchor="middle">E</text>
            <text x="0" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle">S</text>
            <text x="-12" y="3" fill="#94a3b8" fontSize="8" textAnchor="middle">W</text>
          </g>

          {/* Outer Plot Boundary */}
          <rect
            x={margin}
            y={margin}
            width={plotW}
            height={plotH}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text x={margin + 8} y={margin + 16} fill="#60a5fa" fontSize="10" fontFamily="monospace">PLOT BOUNDARY</text>

          {/* Plot Dimension Callouts */}
          <text x={canvasWidth / 2} y={margin - 12} fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
            WIDTH: {width}′-0″
          </text>
          <text x={margin - 16} y={canvasHeight / 2} fill="#94a3b8" fontSize="11" textAnchor="middle" transform={`rotate(-90 ${margin - 16} ${canvasHeight / 2})`} fontFamily="monospace">
            LENGTH: {length}′-0″
          </text>

          {/* Front Road Indicator */}
          <rect
            x={margin}
            y={canvasHeight - margin + 10}
            width={plotW}
            height={28}
            fill="rgba(245, 158, 11, 0.08)"
            stroke="rgba(245, 158, 11, 0.3)"
            strokeWidth="1"
          />
          <text
            x={canvasWidth / 2}
            y={canvasHeight - margin + 28}
            fill="#fbbf24"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            textAnchor="middle"
          >
            ▲ {project?.roadWidth || 30} FT WIDE ACCESS ROAD ({facing.toUpperCase()} FACING) ▲
          </text>

          {/* ===================== GROUND FLOOR (100% GAP-FREE) ===================== */}
          {activeFloor === 0 ? (
            <g>
              {/* External House Envelope (Outer Perimeter) */}
              <rect
                x={walls.left}
                y={walls.top}
                width={walls.right - walls.left}
                height={walls.bottom - walls.top}
                fill="rgba(15, 23, 42, 0.9)"
                stroke="#93c5fd"
                strokeWidth="4"
              />

              {/* 1. CAR PORCH & ENTRY */}
              <rect
                x={rooms.porch.x}
                y={rooms.porch.y}
                width={rooms.porch.w}
                height={rooms.porch.h}
                fill={selectedRoom === 'porch' ? 'rgba(56, 189, 248, 0.25)' : '#1e293b'}
                stroke={selectedRoom === 'porch' ? '#38bdf8' : '#38bdf8'}
                strokeWidth={selectedRoom === 'porch' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'porch' ? null : 'porch')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.porch.x + (rooms.porch.w / 2)} y={rooms.porch.y + (rooms.porch.h * 0.48)} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                CAR PORCH &amp; ENTRY
              </text>
              <text x={rooms.porch.x + (rooms.porch.w / 2)} y={rooms.porch.y + (rooms.porch.h * 0.48) + 16} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.porch.wFt}′ × {rooms.porch.lFt}′ ({rooms.porch.sqft} sq.ft)
              </text>

              {/* 2. FORMAL LIVING ROOM */}
              <rect
                x={rooms.living.x}
                y={rooms.living.y}
                width={rooms.living.w}
                height={rooms.living.h}
                fill={selectedRoom === 'living' ? 'rgba(56, 189, 248, 0.25)' : '#0f172a'}
                stroke={selectedRoom === 'living' ? '#38bdf8' : '#38bdf8'}
                strokeWidth={selectedRoom === 'living' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'living' ? null : 'living')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.living.x + (rooms.living.w / 2)} y={rooms.living.y + (rooms.living.h * 0.48)} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                FORMAL LIVING ROOM
              </text>
              <text x={rooms.living.x + (rooms.living.w / 2)} y={rooms.living.y + (rooms.living.h * 0.48) + 16} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.living.wFt}′ × {rooms.living.lFt}′ ({rooms.living.sqft} sq.ft)
              </text>

              {/* 3. CENTRAL DINING HALL (Starts flush at walls.top with ZERO GAPS) */}
              <rect
                x={rooms.dining.x}
                y={rooms.dining.y}
                width={rooms.dining.w}
                height={rooms.dining.h}
                fill={selectedRoom === 'dining' ? 'rgba(129, 140, 248, 0.25)' : '#1e1b4b'}
                stroke={selectedRoom === 'dining' ? '#818cf8' : '#818cf8'}
                strokeWidth={selectedRoom === 'dining' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'dining' ? null : 'dining')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.dining.x + (rooms.dining.w / 2)} y={rooms.dining.y + (rooms.dining.h * 0.52)} fill="#c7d2fe" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                CENTRAL DINING HALL
              </text>
              <text x={rooms.dining.x + (rooms.dining.w / 2)} y={rooms.dining.y + (rooms.dining.h * 0.52) + 16} fill="#a5b4fc" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.dining.wFt}′ × {rooms.dining.lFt}′ ({rooms.dining.sqft} sq.ft)
              </text>

              {/* Architectural Staircase inside Dining Hall Lobby */}
              <g transform={`translate(${walls.masterDining + 6}, ${walls.top + 6})`}>
                <rect width={Math.min(65, rooms.dining.w * 0.55)} height={32} fill="rgba(15, 23, 42, 0.9)" stroke="#64748b" strokeWidth="1" rx="2" />
                <line x1={Math.min(65, rooms.dining.w * 0.55) * 0.25} y1="0" x2={Math.min(65, rooms.dining.w * 0.55) * 0.25} y2="32" stroke="#475569" strokeWidth="1" />
                <line x1={Math.min(65, rooms.dining.w * 0.55) * 0.5} y1="0" x2={Math.min(65, rooms.dining.w * 0.55) * 0.5} y2="32" stroke="#475569" strokeWidth="1" />
                <line x1={Math.min(65, rooms.dining.w * 0.55) * 0.75} y1="0" x2={Math.min(65, rooms.dining.w * 0.55) * 0.75} y2="32" stroke="#475569" strokeWidth="1" />
                <text x={Math.min(65, rooms.dining.w * 0.55) / 2} y="19" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">STAIRS UP ▲</text>
              </g>

              {/* 4. MODULAR KITCHEN */}
              <rect
                x={rooms.kitchen.x}
                y={rooms.kitchen.y}
                width={rooms.kitchen.w}
                height={rooms.kitchen.h}
                fill={selectedRoom === 'kitchen' ? 'rgba(192, 132, 252, 0.25)' : '#3b0764'}
                stroke={selectedRoom === 'kitchen' ? '#c084fc' : '#c084fc'}
                strokeWidth={selectedRoom === 'kitchen' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'kitchen' ? null : 'kitchen')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.kitchen.x + (rooms.kitchen.w / 2)} y={rooms.kitchen.y + (rooms.kitchen.h * 0.5)} fill="#f5d0fe" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                MODULAR KITCHEN
              </text>
              <text x={rooms.kitchen.x + (rooms.kitchen.w / 2)} y={rooms.kitchen.y + (rooms.kitchen.h * 0.5) + 15} fill="#d8b4fe" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.kitchen.wFt}′ × {rooms.kitchen.lFt}′ (SE)
              </text>

              {/* 5. POOJA SACRED ROOM */}
              <rect
                x={rooms.pooja.x}
                y={rooms.pooja.y}
                width={rooms.pooja.w}
                height={rooms.pooja.h}
                fill={selectedRoom === 'pooja' ? 'rgba(245, 158, 11, 0.25)' : '#451a03'}
                stroke={selectedRoom === 'pooja' ? '#f59e0b' : '#f59e0b'}
                strokeWidth={selectedRoom === 'pooja' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'pooja' ? null : 'pooja')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.pooja.x + (rooms.pooja.w / 2)} y={rooms.pooja.y + (rooms.pooja.h * 0.45)} fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                POOJA ROOM
              </text>
              <text x={rooms.pooja.x + (rooms.pooja.w / 2)} y={rooms.pooja.y + (rooms.pooja.h * 0.45) + 14} fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.pooja.wFt}′ × {rooms.pooja.lFt}′ (Ishan)
              </text>

              {/* 6. MASTER BEDROOM */}
              <rect
                x={rooms.master.x}
                y={rooms.master.y}
                width={rooms.master.w}
                height={rooms.master.h}
                fill={selectedRoom === 'master' ? 'rgba(52, 211, 153, 0.25)' : '#064e3b'}
                stroke={selectedRoom === 'master' ? '#34d399' : '#34d399'}
                strokeWidth={selectedRoom === 'master' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'master' ? null : 'master')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.master.x + (rooms.master.w / 2)} y={rooms.master.y + (rooms.master.h * 0.45)} fill="#a7f3d0" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                MASTER BEDROOM
              </text>
              <text x={rooms.master.x + (rooms.master.w / 2)} y={rooms.master.y + (rooms.master.h * 0.45) + 16} fill="#6ee7b7" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.master.wFt}′ × {rooms.master.lFt}′ ({rooms.master.sqft} sq.ft)
              </text>

              {/* 7. ENSUITE BATHROOM (Flush with walls.left and walls.bathEast) */}
              <rect
                x={rooms.bath.x}
                y={rooms.bath.y}
                width={rooms.bath.w}
                height={rooms.bath.h}
                fill={selectedRoom === 'bath' ? 'rgba(45, 212, 191, 0.25)' : '#134e4a'}
                stroke={selectedRoom === 'bath' ? '#2dd4bf' : '#2dd4bf'}
                strokeWidth={selectedRoom === 'bath' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'bath' ? null : 'bath')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.bath.x + (rooms.bath.w / 2)} y={rooms.bath.y + (rooms.bath.h * 0.52)} fill="#99f6e4" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                ENSUITE BATH
              </text>
              <text x={rooms.bath.x + (rooms.bath.w / 2)} y={rooms.bath.y + (rooms.bath.h * 0.52) + 13} fill="#5eead4" fontSize="8" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.bath.wFt}′×{rooms.bath.lFt}′
              </text>

              {/* 8. WALK-IN DRESSING & CLOSET (Tiles between bathEast and masterDining with ZERO GAPS) */}
              <rect
                x={rooms.dressing.x}
                y={rooms.dressing.y}
                width={rooms.dressing.w}
                height={rooms.dressing.h}
                fill={selectedRoom === 'dressing' ? 'rgba(96, 165, 250, 0.25)' : '#1e293b'}
                stroke={selectedRoom === 'dressing' ? '#60a5fa' : '#3b82f6'}
                strokeWidth={selectedRoom === 'dressing' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'dressing' ? null : 'dressing')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.dressing.x + (rooms.dressing.w / 2)} y={rooms.dressing.y + (rooms.dressing.h * 0.48)} fill="#93c5fa" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                WALK-IN CLOSET
              </text>
              <text x={rooms.dressing.x + (rooms.dressing.w / 2)} y={rooms.dressing.y + (rooms.dressing.h * 0.48) + 14} fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.dressing.wFt}′ × {rooms.dressing.lFt}′
              </text>

              {/* ===================== ALL-SIDE PARTITION CORRIDORS & HANDLES ===================== */}
              {isDragMode && (
                <g id="ground-partition-elements">
                  {/* Outer Left Wall (West Setback) */}
                  {renderWallCorridor('outerLeft', 'x', walls.left, walls.top, walls.left, walls.bottom, 'West Outer Wall')}
                  {renderWallHandle('outerLeft', 'x', walls.left, (walls.top + walls.bottom) / 2, 'West Outer Wall', selectedRoom === 'master' || selectedRoom === 'porch' || selectedRoom === 'bath')}

                  {/* Outer Right Wall (East Setback) */}
                  {renderWallCorridor('outerRight', 'x', walls.right, walls.top, walls.right, walls.bottom, 'East Outer Wall')}
                  {renderWallHandle('outerRight', 'x', walls.right, (walls.top + walls.bottom) / 2, 'East Outer Wall', selectedRoom === 'living' || selectedRoom === 'kitchen' || selectedRoom === 'pooja')}

                  {/* Outer Top Wall (North Rear Setback) */}
                  {renderWallCorridor('outerTop', 'y', walls.left, walls.top, walls.right, walls.top, 'North Outer Wall')}
                  {renderWallHandle('outerTop', 'y', (walls.left + walls.right) / 2, walls.top, 'North Outer Wall', selectedRoom === 'master' || selectedRoom === 'pooja' || selectedRoom === 'dining')}

                  {/* Outer Bottom Wall (South Front Facade) */}
                  {renderWallCorridor('outerBottom', 'y', walls.left, walls.bottom, walls.right, walls.bottom, 'South Front Wall')}
                  {renderWallHandle('outerBottom', 'y', (walls.left + walls.right) / 2, walls.bottom, 'South Front Wall', selectedRoom === 'living' || selectedRoom === 'porch')}

                  {/* Partition 1: Master Bed vs Dining (Vertical Partition flush from top to frontBand) */}
                  {renderWallCorridor('masterDining', 'x', walls.masterDining, walls.top, walls.masterDining, walls.frontBand, 'Master Bed / Dining Partition')}
                  {renderWallHandle('masterDining', 'x', walls.masterDining, (walls.top + walls.frontBand) / 2, 'Master Bed / Dining Divider', selectedRoom === 'master' || selectedRoom === 'dining' || selectedRoom === 'dressing')}

                  {/* Partition 2: Master Bed vs Bath/Dressing (Horizontal Partition flush from left to masterDining) */}
                  {renderWallCorridor('masterBath', 'y', walls.left, walls.masterBath, walls.masterDining, walls.masterBath, 'Master Bed / Bath Partition')}
                  {renderWallHandle('masterBath', 'y', walls.left + (rooms.master.w / 2), walls.masterBath, 'Master Bed / Bath Divider', selectedRoom === 'master' || selectedRoom === 'bath' || selectedRoom === 'dressing')}

                  {/* Partition 3: Ensuite Bath vs Walk-in Dressing (Vertical Partition flush from masterBath to frontBand) */}
                  {renderWallCorridor('bathEast', 'x', walls.bathEast, walls.masterBath, walls.bathEast, walls.frontBand, 'Bathroom / Dressing Partition')}
                  {renderWallHandle('bathEast', 'x', walls.bathEast, (walls.masterBath + walls.frontBand) / 2, 'Bathroom / Dressing Divider', selectedRoom === 'bath' || selectedRoom === 'dressing')}

                  {/* Partition 4: Dining vs Kitchen / Pooja (Vertical Partition flush from top to frontBand) */}
                  {renderWallCorridor('diningKitchen', 'x', walls.diningKitchen, walls.top, walls.diningKitchen, walls.frontBand, 'Dining / Kitchen Partition')}
                  {renderWallHandle('diningKitchen', 'x', walls.diningKitchen, (walls.top + walls.kitchenPooja) / 2, 'Dining / Pooja Divider', selectedRoom === 'dining' || selectedRoom === 'pooja')}
                  {renderWallHandle('diningKitchen', 'x', walls.diningKitchen, (walls.kitchenPooja + walls.frontBand) / 2, 'Dining / Kitchen Divider', selectedRoom === 'dining' || selectedRoom === 'kitchen')}

                  {/* Partition 5: Pooja vs Modular Kitchen (Horizontal Partition flush from diningKitchen to right) */}
                  {renderWallCorridor('kitchenPooja', 'y', walls.diningKitchen, walls.kitchenPooja, walls.right, walls.kitchenPooja, 'Pooja / Kitchen Partition')}
                  {renderWallHandle('kitchenPooja', 'y', walls.diningKitchen + (rooms.kitchen.w / 2), walls.kitchenPooja, 'Pooja / Kitchen Divider', selectedRoom === 'pooja' || selectedRoom === 'kitchen')}

                  {/* Partition 6: Front Band (Living/Porch vs Dining/Kitchen/Master) (Full width horizontal partition) */}
                  {renderWallCorridor('frontBand', 'y', walls.left, walls.frontBand, walls.right, walls.frontBand, 'Main Living / Rear Divider')}
                  {renderWallHandle('frontBand', 'y', (walls.left + walls.porchLiving) / 2, walls.frontBand, 'Porch Divider', selectedRoom === 'porch' || selectedRoom === 'bath' || selectedRoom === 'dressing')}
                  {renderWallHandle('frontBand', 'y', (walls.porchLiving + walls.diningKitchen) / 2, walls.frontBand, 'Living / Dining Divider', selectedRoom === 'living' || selectedRoom === 'dining')}
                  {renderWallHandle('frontBand', 'y', (walls.diningKitchen + walls.right) / 2, walls.frontBand, 'Living / Kitchen Divider', selectedRoom === 'living' || selectedRoom === 'kitchen')}

                  {/* Partition 7: Car Porch vs Formal Living Room (Vertical Partition flush from frontBand to bottom) */}
                  {renderWallCorridor('porchLiving', 'x', walls.porchLiving, walls.frontBand, walls.porchLiving, walls.bottom, 'Car Porch / Living Partition')}
                  {renderWallHandle('porchLiving', 'x', walls.porchLiving, (walls.frontBand + walls.bottom) / 2, 'Car Porch / Living Divider', selectedRoom === 'porch' || selectedRoom === 'living')}

                  {/* ACTIVE SELECTED ROOM 4-SIDE CROP OVERLAY */}
                  {selectedRoom && renderRoom4SidesOverlay(selectedRoom)}
                </g>
              )}

              {/* ===================== DOORS & MAIN DOOR PLACEMENTS ===================== */}
              {showDoors && (
                <g id="ground-floor-doors">
                  {/* D1: MAIN ENTRANCE DOOR */}
                  <g transform={`translate(${walls.porchLiving + 25}, ${walls.bottom - 4})`}>
                    <line x1="0" y1="0" x2="34" y2="0" stroke="#091322" strokeWidth="6" />
                    <line x1="0" y1="0" x2="0" y2="-30" stroke="#f59e0b" strokeWidth="3" />
                    <path d="M 0,-30 A 30 30 0 0 1 30,0" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
                    <rect x="36" y="-22" width="68" height="18" rx="4" fill="#b45309" stroke="#f59e0b" strokeWidth="1" />
                    <text x="70" y="-10" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">D1: MAIN DOOR</text>
                    <text x="16" y="16" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">▲ ENTRY</text>
                  </g>

                  {/* D2: MASTER BEDROOM DOOR */}
                  <g transform={`translate(${walls.masterDining - 4}, ${walls.top + (rooms.master.h * 0.6)})`}>
                    <line x1="0" y1="0" x2="0" y2="28" stroke="#091322" strokeWidth="6" />
                    <line x1="0" y1="0" x2="-26" y2="0" stroke="#34d399" strokeWidth="2.5" />
                    <path d="M -26,0 A 26 26 0 0 1 0,26" fill="none" stroke="#34d399" strokeWidth="1.2" strokeDasharray="3 2" />
                    <rect x="-62" y="6" width="30" height="14" rx="3" fill="#065f46" stroke="#34d399" strokeWidth="1" />
                    <text x="-47" y="17" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">D2</text>
                  </g>

                  {/* D3: ENSUITE BATHROOM DOOR (Anchored dynamically to walls.bathEast) */}
                  <g transform={`translate(${walls.bathEast - 4}, ${walls.masterBath + (rooms.bath.h * 0.35)})`}>
                    <line x1="0" y1="0" x2="0" y2="24" stroke="#091322" strokeWidth="5" />
                    <line x1="0" y1="0" x2="-22" y2="0" stroke="#2dd4bf" strokeWidth="2" />
                    <path d="M -22,0 A 22 22 0 0 1 0,22" fill="none" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="3 2" />
                    <rect x="-42" y="4" width="28" height="14" rx="3" fill="#134e4a" stroke="#2dd4bf" strokeWidth="1" />
                    <text x="-28" y="15" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">D3</text>
                  </g>

                  {/* D4: KITCHEN ENTRANCE */}
                  <g transform={`translate(${walls.diningKitchen + 4}, ${walls.kitchenPooja + 15})`}>
                    <line x1="-4" y1="0" x2="26" y2="0" stroke="#091322" strokeWidth="6" />
                    <line x1="0" y1="0" x2="0" y2="24" stroke="#c084fc" strokeWidth="2" />
                    <path d="M 0,24 A 24 24 0 0 1 24,0" fill="none" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 2" />
                    <rect x="2" y="-18" width="28" height="14" rx="3" fill="#581c87" stroke="#c084fc" strokeWidth="1" />
                    <text x="16" y="-7" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">D4</text>
                  </g>

                  {/* D5: POOJA ROOM DOUBLE DOOR */}
                  <g transform={`translate(${walls.diningKitchen + 4}, ${walls.top + 15})`}>
                    <line x1="-4" y1="0" x2="24" y2="0" stroke="#091322" strokeWidth="6" />
                    <line x1="0" y1="0" x2="0" y2="-12" stroke="#f59e0b" strokeWidth="2" />
                    <line x1="22" y1="0" x2="22" y2="-12" stroke="#f59e0b" strokeWidth="2" />
                    <path d="M 0,-12 A 12 12 0 0 1 11,0" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                    <path d="M 22,-12 A 12 12 0 0 0 11,0" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                    <rect x="-2" y="5" width="28" height="14" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                    <text x="12" y="16" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">D5</text>
                  </g>
                </g>
              )}

              {/* WINDOWS */}
              {showWindows && (
                <g id="ground-windows">
                  <rect x={walls.porchLiving + 20} y={walls.bottom - 4} width={Math.min(55, rooms.living.w * 0.5)} height="8" fill="#38bdf8" stroke="#0284c7" />
                  <text x={walls.porchLiving + 20 + Math.min(27, rooms.living.w * 0.25)} y={walls.bottom + 16} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">W1 (5′×4′)</text>

                  <rect x={walls.left + 30} y={walls.top - 4} width={Math.min(50, rooms.master.w * 0.6)} height="8" fill="#38bdf8" stroke="#0284c7" />
                  <text x={walls.left + 30 + Math.min(25, rooms.master.w * 0.3)} y={walls.top - 8} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">W2 (4′×4′)</text>

                  <rect x={walls.right - 4} y={walls.kitchenPooja + 15} width="8" height="40" fill="#38bdf8" stroke="#0284c7" />
                  <text x={walls.right + 24} y={walls.kitchenPooja + 35} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">W3</text>
                </g>
              )}
            </g>
          ) : (
            /* ===================== UPPER FLOOR (100% GAP-FREE) ===================== */
            <g>
              {/* Upper Envelope */}
              <rect x={walls.left} y={walls.top} width={walls.right - walls.left} height={walls.bottom - walls.top} fill="rgba(15, 23, 42, 0.9)" stroke="#93c5fd" strokeWidth="4" />

              {/* 1. Bedroom 2 (Suite) (Left Wing flush from walls.left to walls.upperBed2, top to upperBalcony) */}
              <rect
                x={rooms.bed2.x}
                y={rooms.bed2.y}
                width={rooms.bed2.w}
                height={rooms.bed2.h}
                fill={selectedRoom === 'bed2' ? 'rgba(52, 211, 153, 0.25)' : '#064e3b'}
                stroke={selectedRoom === 'bed2' ? '#34d399' : '#34d399'}
                strokeWidth={selectedRoom === 'bed2' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'bed2' ? null : 'bed2')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.bed2.x + (rooms.bed2.w / 2)} y={rooms.bed2.y + (rooms.bed2.h * 0.45)} fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">BEDROOM 2 (SUITE)</text>
              <text x={rooms.bed2.x + (rooms.bed2.w / 2)} y={rooms.bed2.y + (rooms.bed2.h * 0.45) + 16} fill="#6ee7b7" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.bed2.wFt}′ × {rooms.bed2.lFt}′ ({rooms.bed2.sqft} sq.ft)
              </text>

              {/* 2. Upper Family Lounge (Center Wing flush from upperBed2 to upperBed3, top to upperBalcony - ZERO GAPS) */}
              <rect
                x={rooms.lounge.x}
                y={rooms.lounge.y}
                width={rooms.lounge.w}
                height={rooms.lounge.h}
                fill={selectedRoom === 'lounge' ? 'rgba(129, 140, 248, 0.25)' : '#1e1b4b'}
                stroke={selectedRoom === 'lounge' ? '#818cf8' : '#818cf8'}
                strokeWidth={selectedRoom === 'lounge' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'lounge' ? null : 'lounge')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.lounge.x + (rooms.lounge.w / 2)} y={rooms.lounge.y + (rooms.lounge.h * 0.5)} fill="#c7d2fe" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">FAMILY LOUNGE &amp; FOYER</text>
              <text x={rooms.lounge.x + (rooms.lounge.w / 2)} y={rooms.lounge.y + (rooms.lounge.h * 0.5) + 16} fill="#a5b4fc" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.lounge.wFt}′ × {rooms.lounge.lFt}′ ({rooms.lounge.sqft} sq.ft)
              </text>

              {/* Upper Staircase Landing */}
              <g transform={`translate(${walls.upperBed2 + 6}, ${walls.top + 6})`}>
                <rect width={Math.min(65, rooms.lounge.w * 0.55)} height={30} fill="rgba(15, 23, 42, 0.9)" stroke="#64748b" strokeWidth="1" rx="2" />
                <line x1={Math.min(65, rooms.lounge.w * 0.55) * 0.25} y1="0" x2={Math.min(65, rooms.lounge.w * 0.55) * 0.25} y2="30" stroke="#475569" strokeWidth="1" />
                <line x1={Math.min(65, rooms.lounge.w * 0.55) * 0.5} y1="0" x2={Math.min(65, rooms.lounge.w * 0.55) * 0.5} y2="30" stroke="#475569" strokeWidth="1" />
                <line x1={Math.min(65, rooms.lounge.w * 0.55) * 0.75} y1="0" x2={Math.min(65, rooms.lounge.w * 0.55) * 0.75} y2="30" stroke="#475569" strokeWidth="1" />
                <text x={Math.min(65, rooms.lounge.w * 0.55) / 2} y="18" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">STAIRS DN ▼</text>
              </g>

              {/* 3. Bedroom 3 / Study (Right Wing flush from upperBed3 to right, top to upperBalcony) */}
              <rect
                x={rooms.bed3.x}
                y={rooms.bed3.y}
                width={rooms.bed3.w}
                height={rooms.bed3.h}
                fill={selectedRoom === 'bed3' ? 'rgba(96, 165, 250, 0.25)' : '#1e3a8a'}
                stroke={selectedRoom === 'bed3' ? '#60a5fa' : '#60a5fa'}
                strokeWidth={selectedRoom === 'bed3' ? 2.5 : 1.5}
                onClick={() => setSelectedRoom(selectedRoom === 'bed3' ? null : 'bed3')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.bed3.x + (rooms.bed3.w / 2)} y={rooms.bed3.y + (rooms.bed3.h * 0.45)} fill="#bfdbfe" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">BEDROOM 3 / STUDY</text>
              <text x={rooms.bed3.x + (rooms.bed3.w / 2)} y={rooms.bed3.y + (rooms.bed3.h * 0.45) + 16} fill="#93c5fd" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                {rooms.bed3.wFt}′ × {rooms.bed3.lFt}′ ({rooms.bed3.sqft} sq.ft)
              </text>

              {/* 4. Wide Covered Balcony (Front Wing flush from left to right, upperBalcony to bottom) */}
              <rect
                x={rooms.balcony.x}
                y={rooms.balcony.y}
                width={rooms.balcony.w}
                height={rooms.balcony.h}
                fill={selectedRoom === 'balcony' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)'}
                stroke="#10b981"
                strokeWidth={selectedRoom === 'balcony' ? 2.5 : 2}
                strokeDasharray="4 2"
                onClick={() => setSelectedRoom(selectedRoom === 'balcony' ? null : 'balcony')}
                style={{ cursor: 'pointer' }}
              />
              <text x={rooms.balcony.x + (rooms.balcony.w / 2)} y={rooms.balcony.y + (rooms.balcony.h * 0.5)} fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">WIDE VIEW TERRACE &amp; BALCONY</text>
              <text x={rooms.balcony.x + (rooms.balcony.w / 2)} y={rooms.balcony.y + (rooms.balcony.h * 0.5) + 16} fill="#6ee7b7" fontSize="9" textAnchor="middle" fontFamily="monospace" pointerEvents="none">
                CANTILEVERED DECK ({rooms.balcony.wFt}′ × {rooms.balcony.lFt}′ • {rooms.balcony.sqft} sq.ft)
              </text>

              {/* Upper Floor Draggable Handles & Corridors */}
              {isDragMode && (
                <g id="upper-partition-elements">
                  {renderWallCorridor('upperBed2', 'x', walls.upperBed2, walls.top, walls.upperBed2, walls.upperBalcony, 'Bed 2 / Lounge Partition')}
                  {renderWallHandle('upperBed2', 'x', walls.upperBed2, (walls.top + walls.upperBalcony) / 2, 'Bed 2 / Lounge Divider', selectedRoom === 'bed2' || selectedRoom === 'lounge')}

                  {renderWallCorridor('upperBed3', 'x', walls.upperBed3, walls.top, walls.upperBed3, walls.upperBalcony, 'Lounge / Bed 3 Partition')}
                  {renderWallHandle('upperBed3', 'x', walls.upperBed3, (walls.top + walls.upperBalcony) / 2, 'Lounge / Bed 3 Divider', selectedRoom === 'bed3' || selectedRoom === 'lounge')}

                  {renderWallCorridor('upperBalcony', 'y', walls.left, walls.upperBalcony, walls.right, walls.upperBalcony, 'Terrace Deck Divider')}
                  {renderWallHandle('upperBalcony', 'y', (walls.left + walls.right) / 2, walls.upperBalcony, 'Terrace Deck Divider', selectedRoom === 'balcony' || selectedRoom === 'lounge')}

                  {/* ACTIVE SELECTED UPPER ROOM 4-SIDE OVERLAY */}
                  {selectedRoom && renderRoom4SidesOverlay(selectedRoom)}
                </g>
              )}

              {/* UPPER DOORS */}
              {showDoors && (
                <g id="upper-doors">
                  <g transform={`translate(${walls.upperBed2 - 4}, ${walls.top + 50})`}>
                    <line x1="0" y1="0" x2="-26" y2="0" stroke="#34d399" strokeWidth="2.5" />
                    <path d="M -26,0 A 26 26 0 0 1 0,26" fill="none" stroke="#34d399" strokeWidth="1.2" strokeDasharray="3 2" />
                    <rect x="-62" y="6" width="30" height="14" rx="3" fill="#065f46" stroke="#34d399" strokeWidth="1" />
                    <text x="-47" y="17" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">D2</text>
                  </g>

                  <g transform={`translate(${walls.upperBed3 + 4}, ${walls.top + 50})`}>
                    <line x1="0" y1="0" x2="26" y2="0" stroke="#60a5fa" strokeWidth="2.5" />
                    <path d="M 26,0 A 26 26 0 0 0 0,26" fill="none" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 2" />
                    <rect x="32" y="6" width="30" height="14" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                    <text x="47" y="17" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">D2</text>
                  </g>

                  <g transform={`translate(${(walls.upperBed2 + walls.upperBed3) / 2}, ${walls.upperBalcony - 2})`}>
                    <line x1="-30" y1="0" x2="30" y2="0" stroke="#10b981" strokeWidth="4" />
                    <line x1="-15" y1="-3" x2="15" y2="-3" stroke="#34d399" strokeWidth="2" strokeDasharray="6 3" />
                    <rect x="-42" y="-18" width="84" height="15" rx="3" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                    <text x="0" y="-7" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">D6: SLIDING GLASS</text>
                  </g>
                </g>
              )}
            </g>
          )}

          {/* Real-time Dynamic Dragging Floating HUD Tooltip */}
          {activeDrag && (
            <g transform={`translate(${activeDrag.currentX}, ${Math.max(40, activeDrag.currentY - 36)})`}>
              <rect
                x="-145"
                y="-20"
                width="290"
                height="38"
                rx="6"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2"
                filter="drop-shadow(0 4px 14px rgba(0,0,0,0.95))"
              />
              <circle cx="-130" cy="-1" r="4" fill="#38bdf8" />
              <text x="0" y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                {activeDrag.wallName.toUpperCase()}
              </text>
              <text x="0" y="10" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                RELEASE FINGER OR MOUSE TO LOCK IN POSITION
              </text>
            </g>
          )}

          {/* Architectural Stamp */}
          <g transform={`translate(${margin + 12}, ${canvasHeight - margin - 35})`}>
            <rect width="260" height="30" fill="rgba(0,0,0,0.75)" stroke="#64748b" strokeWidth="0.8" rx="4" />
            <text x="8" y="14" fill="#cbd5e1" fontSize="8" fontWeight="bold">SMART BUILD AI SCHEMATIC</text>
            <text x="8" y="24" fill="#94a3b8" fontSize="7">SEAMLESS CAD ENGINE • 100% GAP-FREE TILING</text>
          </g>
        </svg>
      </div>

      {/* DEDICATED ALL-4-SIDES ACTIVE ROOM CONTROLLER PANEL */}
      {selectedRoom && roomSideConfigs[selectedRoom] && rooms[selectedRoom] && (
        <div style={{
          marginTop: '16px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          border: '1.5px solid #38bdf8',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>{roomSideConfigs[selectedRoom].icon}</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#38bdf8' }}>
                  {rooms[selectedRoom].name} • All 4 Sides Control
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Current Dimensions: <strong>{rooms[selectedRoom].wFt}′ Width × {rooms[selectedRoom].lFt}′ Length</strong> ({rooms[selectedRoom].sqft} sq.ft)
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedRoom(null)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              Done / Close Controls
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px'
          }}>
            {/* North Wall Controller */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#93c5fd' }}>
                  ▲ North Side (Top)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Length: {rooms[selectedRoom].lFt}′</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].north.wallKey, 'y', -1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronUp size={14} /> Expand (-1′)
                </button>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].north.wallKey, 'y', 1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronDown size={14} /> Shrink (+1′)
                </button>
              </div>
            </div>

            {/* South Wall Controller */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#93c5fd' }}>
                  ▼ South Side (Bottom)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Length: {rooms[selectedRoom].lFt}′</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].south.wallKey, 'y', -1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronUp size={14} /> Shrink (-1′)
                </button>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].south.wallKey, 'y', 1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronDown size={14} /> Expand (+1′)
                </button>
              </div>
            </div>

            {/* West Wall Controller */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b' }}>
                  ◄ West Side (Left)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Width: {rooms[selectedRoom].wFt}′</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].west.wallKey, 'x', -1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronLeft size={14} /> Expand (-1′)
                </button>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].west.wallKey, 'x', 1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronRight size={14} /> Shrink (+1′)
                </button>
              </div>
            </div>

            {/* East Wall Controller */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b' }}>
                  ► East Side (Right)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Width: {rooms[selectedRoom].wFt}′</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].east.wallKey, 'x', -1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronLeft size={14} /> Shrink (-1′)
                </button>
                <button
                  onClick={() => nudgeWall(roomSideConfigs[selectedRoom].east.wallKey, 'x', 1)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, padding: '4px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <ChevronRight size={14} /> Expand (+1′)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend Strip */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#b45309', borderRadius: '3px' }}></span>
            <strong>D1: Main Door</strong> (Grand Entrance)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#065f46', borderRadius: '3px' }}></span>
            <strong>D2: Room Doors</strong> (Bedrooms)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#134e4a', borderRadius: '3px' }}></span>
            <strong>D3: Bath Door</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#581c87', borderRadius: '3px' }}></span>
            <strong>D4: Kitchen Arch</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#78350f', borderRadius: '3px' }}></span>
            <strong>D5: Pooja Double Door</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#064e3b', borderRadius: '3px' }}></span>
            <strong>D6: Balcony Slider</strong>
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
          * 100% gap-free architectural tiling. Move any partition wall by finger on mobile or mouse on desktop.
        </div>
      </div>

      {/* DETAILED DOOR & WINDOW PLACEMENT SCHEDULE */}
      <div style={{
        marginTop: '24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <DoorOpen size={20} color="var(--accent-light)" />
          <h3 style={{ fontSize: '1.15rem' }}>Door &amp; Window Architectural Placement Schedule</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dynamic-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Tag</th>
                <th style={{ width: '22%' }}>Door / Window Type</th>
                <th style={{ width: '15%' }}>Size (W × H)</th>
                <th style={{ width: '25%' }}>Exact Wall Location</th>
                <th style={{ width: '15%' }}>Material Spec</th>
                <th style={{ width: '15%' }}>Vastu / NBC Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="brand-badge" style={{ background: '#b45309', color: '#fff' }}>D1</span></td>
                <td><strong>Main Entrance Door</strong></td>
                <td className="mono">3′6″ × 7′0″ (1050 × 2100 mm)</td>
                <td>Front facade facing {facing} road (Right of Car Porch, entering Living Room)</td>
                <td>First-class Burma/CP Teak Wood with heavy threshold (Ummar)</td>
                <td>Auspicious 3rd/4th Pada (Jayanta/Indra), opens clockwise inward</td>
              </tr>
              <tr>
                <td><span className="brand-badge" style={{ background: '#065f46', color: '#fff' }}>D2</span></td>
                <td><strong>Master Bedroom Door</strong></td>
                <td className="mono">3′0″ × 7′0″ (900 × 2100 mm)</td>
                <td>North-East wall of South-West master bedroom (corridor access)</td>
                <td>Flush door with teak veneer &amp; mortise lock</td>
                <td>Swing towards adjacent interior wall for maximum privacy</td>
              </tr>
              <tr>
                <td><span className="brand-badge" style={{ background: '#134e4a', color: '#fff' }}>D3</span></td>
                <td><strong>Ensuite Bathroom Door</strong></td>
                <td className="mono">2′6″ × 7′0″ (750 × 2100 mm)</td>
                <td>Internal bedroom corner wall, away from direct bed sightline</td>
                <td>FRP / Waterproof laminated door with PVC frame</td>
                <td>Opens inward against side wall; water splash clearance</td>
              </tr>
              <tr>
                <td><span className="brand-badge" style={{ background: '#581c87', color: '#fff' }}>D4</span></td>
                <td><strong>Modular Kitchen Entrance</strong></td>
                <td className="mono">3′0″ × 7′0″ (Open Arch / Slider)</td>
                <td>West partition wall connecting central Dining Hall directly to SE Kitchen</td>
                <td>Hardwood architrave or tinted fluted glass sliding pocket door</td>
                <td>Allows unhindered service from Agni corner without obstructing dining flow</td>
              </tr>
              <tr>
                <td><span className="brand-badge" style={{ background: '#78350f', color: '#fff' }}>D5</span></td>
                <td><strong>Pooja Room Sacred Door</strong></td>
                <td className="mono">2′6″ × 7′0″ (Double Shutter)</td>
                <td>West face of North-East Ishanya corner shrine room</td>
                <td>Carved Teak wood with brass lattice bells (Ghanta)</td>
                <td>Two-leaf shutter opening inward into holy shrine</td>
              </tr>
              <tr>
                <td><span className="brand-badge" style={{ background: '#064e3b', color: '#fff' }}>D6</span></td>
                <td><strong>Balcony French Sliding Door</strong></td>
                <td className="mono">6′0″ × 7′0″ (1800 × 2100 mm)</td>
                <td>Upper floor family lounge front wall opening onto cantilevered deck</td>
                <td>Heavy-duty UPVC sliding glass with toughened safety glazing</td>
                <td>Maximizes daylight factor &amp; natural cross-ventilation</td>
              </tr>
              <tr>
                <td><span className="brand-badge" style={{ background: '#0284c7', color: '#fff' }}>W1-W3</span></td>
                <td><strong>Exterior Windows</strong></td>
                <td className="mono">5′0″ × 4′0″ &amp; 4′0″ × 4′0″</td>
                <td>Front facade (Living), Rear (Master Bed), East (Kitchen)</td>
                <td>UPVC 3-track sliding with mosquito mesh</td>
                <td>Window area exceeds 15% of floor area for NBC ventilation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
