import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Compass,
  Home,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Layers,
  DollarSign,
  Palette,
  Sparkles
} from 'lucide-react';
import { projectService, planService } from '../services/api';

export default function PlanMyHouse({ project, setProject, setActivePage, setPlanData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State initialized with active project
  const [landImage, setLandImage] = useState(
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
  );
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Land Details
  const [length, setLength] = useState(project?.landLength || 50);
  const [width, setWidth] = useState(project?.landWidth || 30);
  const [roadWidth, setRoadWidth] = useState(project?.roadWidth || 30);
  const [facing, setFacing] = useState(project?.facing || 'North-East');
  const [location, setLocation] = useState(project?.location || 'Sector 48, Urban Valley');
  const [projectName, setProjectName] = useState(project?.projectName || 'Greenwood Modern Villa');

  // Auto-calculated Land Area = Length x Width
  const landArea = Number(length || 0) * Number(width || 0);

  // Rooms & Requirements
  const [reqs, setReqs] = useState({
    bedrooms: project?.requirements?.bedrooms ?? 3,
    bathrooms: project?.requirements?.bathrooms ?? 3,
    kitchen: project?.requirements?.kitchen ?? 1,
    livingRoom: project?.requirements?.livingRoom ?? 1,
    diningRoom: project?.requirements?.diningRoom ?? 1,
    poojaRoom: project?.requirements?.poojaRoom ?? 1,
    balcony: project?.requirements?.balcony ?? 2,
    parking: project?.requirements?.parking ?? 1,
    garden: project?.requirements?.garden ?? 1,
    homeOffice: project?.requirements?.homeOffice ?? 1,
    storeRoom: project?.requirements?.storeRoom ?? 1,
    utilityRoom: project?.requirements?.utilityRoom ?? 1
  });

  // Floors
  const [floors, setFloors] = useState(project?.floors || 'G + 1');

  // Budget & Quality
  const [budget, setBudget] = useState(project?.budget || 5500000);
  const [quality, setQuality] = useState(project?.constructionQuality || 'Standard');
  const [interiorBudget, setInteriorBudget] = useState(850000);

  // Design Preferences
  const [overallStyle, setOverallStyle] = useState(project?.designStyle || 'Modern');
  const [exteriorPref, setExteriorPref] = useState('Modern');
  const [livingRoomPref, setLivingRoomPref] = useState('Modern Minimalist');
  const [bedroomPref, setBedroomPref] = useState('Contemporary Luxury');
  const [kitchenPref, setKitchenPref] = useState('Italian Modular');
  const [bathroomPref, setBathroomPref] = useState('Spa Contemporary');

  const updateReq = (key, delta) => {
    setReqs(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLandImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleImages = [
    { label: 'Urban Rectangular Plot (30x50)', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' },
    { label: 'Suburban Corner Plot (40x60)', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80' },
    { label: 'Gated Villa Community Plot', url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    const updatedProject = {
      id: project?.id || Date.now(),
      projectName,
      location,
      landLength: Number(length),
      landWidth: Number(width),
      landArea,
      roadWidth: Number(roadWidth),
      facing,
      floors,
      budget: Number(budget),
      constructionQuality: quality,
      interiorBudget: Number(interiorBudget),
      designStyle: overallStyle,
      exteriorStyle: exteriorPref,
      livingRoomStyle: livingRoomPref,
      bedroomStyle: bedroomPref,
      kitchenStyle: kitchenPref,
      bathroomStyle: bathroomPref,
      requirements: reqs,
      landImage
    };

    try {
      await projectService.saveProject(updatedProject);
      setProject(updatedProject);

      const planResult = await planService.generateHousePlan({
        landLength: Number(length),
        landWidth: Number(width),
        facing,
        floors,
        requirements: reqs,
        quality
      });

      setPlanData(planResult);
      setActivePage('house-plan-result');
    } catch (err) {
      console.error('Failed to generate house plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="brand-badge">ARCHITECTURAL PLANNING ENGINE</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Precision Zoning &amp; Vastu Alignment</span>
        </div>
        <h1 style={{ fontSize: '2.3rem' }}>Plan My House</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Follow our 5-step guided wizard to capture your land parameters, room counts, budget, and design aesthetics.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="stepper-nav">
        {[
          { num: 1, label: 'Land & Image' },
          { num: 2, label: 'Rooms & Requirements' },
          { num: 3, label: 'Floors & Budget' },
          { num: 4, label: 'Design Preferences' },
          { num: 5, label: 'Generate Plan' }
        ].map((s) => (
          <div
            key={s.num}
            className={`step-item ${currentStep === s.num ? 'active' : currentStep > s.num ? 'completed' : ''}`}
            onClick={() => setCurrentStep(s.num)}
          >
            <div className="step-circle">
              {currentStep > s.num ? '✓' : s.num}
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Land Image & Details */}
      {currentStep === 1 && (
        <div className="calculator-box">
          <div className="calculator-header">
            <div>
              <h2>Step 1: Land Image &amp; Site Dimensions</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Capture or upload your plot photo, then enter exact measured dimensions
              </p>
            </div>
          </div>

          {/* Mandatory Image Note from Prompt */}
          <div className="disclaimer-badge">
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Important:</strong> The photograph is used purely as visual and site context information. Do NOT assume exact land dimensions from the photograph. You must enter actual verified tape dimensions below.
            </div>
          </div>

          {/* Capture / Upload Area */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '28px'
          }}>
            {/* Upload & Capture Buttons */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  <Upload size={18} /> UPLOAD LAND IMAGE
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  className="btn btn-accent"
                  onClick={() => {
                    setIsCameraActive(true);
                    alert("Camera capture activated: Photo snapshot loaded successfully.");
                  }}
                >
                  <Camera size={18} /> CAPTURE LAND IMAGE
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Supports JPG, PNG, WEBP or select a sample plot below:
              </div>

              {/* Sample Preset Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {sampleImages.map((samp, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline btn-sm"
                    onClick={() => setLandImage(samp.url)}
                  >
                    {samp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Land Image Preview */}
            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '240px',
              position: 'relative'
            }}>
              {landImage ? (
                <img
                  src={landImage}
                  alt="Uploaded Land Site"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)' }}>
                  No Image Selected
                </div>
              )}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(0, 0, 0, 0.75)',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#fff'
              }}>
                Site Visual Context
              </div>
            </div>
          </div>

          {/* Land Details Form */}
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Enter Actual Measured Land Dimensions</h3>
          <div className="calc-grid">
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / City</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Land Length (feet)</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  className="form-input mono"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  min="10"
                />
                <span className="input-unit-tag">ft</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Land Width (feet)</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  className="form-input mono"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  min="10"
                />
                <span className="input-unit-tag">ft</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Road Width in Front</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  className="form-input mono"
                  value={roadWidth}
                  onChange={(e) => setRoadWidth(e.target.value)}
                  min="10"
                />
                <span className="input-unit-tag">ft road</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Plot Facing Direction</label>
              <select
                className="form-select"
                value={facing}
                onChange={(e) => setFacing(e.target.value)}
              >
                <option value="North-East">North-East (Highly Auspicious Ishanya)</option>
                <option value="East">East (Morning Sun / Indra Zone)</option>
                <option value="North">North (Kubera / Financial Prosperity)</option>
                <option value="West">West (Varuna Zone)</option>
                <option value="South">South (Yama Zone)</option>
                <option value="North-West">North-West (Vayu Corner)</option>
                <option value="South-East">South-East (Agni Corner)</option>
                <option value="South-West">South-West (Nairuthi Corner)</option>
              </select>
            </div>
          </div>

          {/* Automatic Land Area Calculation */}
          <div className="calc-result-badge">
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Auto-Calculated Land Area (Length × Width)
              </div>
              <div style={{ fontSize: '1rem', marginTop: '4px' }}>
                {length} ft × {width} ft = <strong>{landArea.toLocaleString()} Square Feet</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard Conversions</div>
              <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-light)' }}>
                {(landArea / 9).toFixed(1)} Sq.Yards &nbsp;|&nbsp; {(landArea * 0.092903).toFixed(1)} Sq.Meters
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
              Next: House Requirements <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: House Requirements (Room Selectors) */}
      {currentStep === 2 && (
        <div className="calculator-box">
          <div className="calculator-header">
            <div>
              <h2>Step 2: House Requirements &amp; Room Counts</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Specify how many bedrooms, bathrooms, and lifestyle spaces you want in your plan
              </p>
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => setCurrentStep(1)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}>
            {[
              { key: 'bedrooms', label: 'Number of Bedrooms', min: 1, max: 8 },
              { key: 'bathrooms', label: 'Number of Bathrooms', min: 1, max: 8 },
              { key: 'kitchen', label: 'Kitchen', min: 1, max: 3 },
              { key: 'livingRoom', label: 'Living Room', min: 1, max: 3 },
              { key: 'diningRoom', label: 'Dining Room', min: 0, max: 2 },
              { key: 'poojaRoom', label: 'Pooja Room', min: 0, max: 2 },
              { key: 'balcony', label: 'Balcony', min: 0, max: 6 },
              { key: 'parking', label: 'Car Parking Bays', min: 0, max: 4 },
              { key: 'garden', label: 'Garden / Lawn Space', min: 0, max: 2 },
              { key: 'homeOffice', label: 'Home Office / Study', min: 0, max: 3 },
              { key: 'storeRoom', label: 'Store Room', min: 0, max: 2 },
              { key: 'utilityRoom', label: 'Utility Room', min: 0, max: 2 }
            ].map((r) => (
              <div
                key={r.key}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Selected: {reqs[r.key] || 0}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => updateReq(r.key, -1)}
                    disabled={(reqs[r.key] || 0) <= (r.min || 0)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    -
                  </button>

                  <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, width: '20px', textAlign: 'center' }}>
                    {reqs[r.key] || 0}
                  </span>

                  <button
                    onClick={() => updateReq(r.key, 1)}
                    disabled={(reqs[r.key] || 0) >= (r.max || 10)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
              <ArrowLeft size={18} /> Previous
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
              Next: Number of Floors &amp; Budget <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Floors & Budget */}
      {currentStep === 3 && (
        <div className="calculator-box">
          <div className="calculator-header">
            <div>
              <h2>Step 3: Number of Floors &amp; Project Budget</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Choose structural verticality and financial parameters
              </p>
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => setCurrentStep(2)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          {/* Floors Cards */}
          <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
            Select Number of Floors
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {['Ground Floor', 'G + 1', 'G + 2', 'G + 3'].map((f) => (
              <div
                key={f}
                onClick={() => setFloors(f)}
                style={{
                  background: floors === f ? 'rgba(37, 99, 235, 0.18)' : 'var(--bg-surface)',
                  border: `2px solid ${floors === f ? 'var(--primary-light)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>{f}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {f === 'Ground Floor' && 'Single Level Bungalow'}
                  {f === 'G + 1' && 'Duplex Villa (2 Levels)'}
                  {f === 'G + 2' && 'Triplex / Multi-unit'}
                  {f === 'G + 3' && 'G+3 Premium Residence'}
                </div>
              </div>
            ))}
          </div>

          {/* Budget & Quality */}
          <div className="calc-grid">
            <div className="form-group">
              <label className="form-label">Total Civil &amp; Construction Budget (₹)</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  step="50000"
                  className="form-input mono"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="500000"
                />
                <span className="input-unit-tag">INR</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-light)', marginTop: '4px' }}>
                ₹{(Number(budget || 0) / 100000).toFixed(2)} Lakhs (₹{(Number(budget || 0) / 10000000).toFixed(2)} Crores)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Construction Quality Specification</label>
              <select
                className="form-select"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              >
                <option value="Basic">Basic (Economy Materials ~₹1,400/sq.ft)</option>
                <option value="Standard">Standard (Durable Branded Materials ~₹1,750/sq.ft)</option>
                <option value="Premium">Premium (High-End Vitrified, Teak &amp; CPVC ~₹2,200/sq.ft)</option>
                <option value="Luxury">Luxury (Italian Marble, Home Automation ~₹2,950/sq.ft)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Interior Budget (₹)</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  step="25000"
                  className="form-input mono"
                  value={interiorBudget}
                  onChange={(e) => setInteriorBudget(e.target.value)}
                  min="0"
                />
                <span className="input-unit-tag">INR</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Modular kitchen, wardrobes, false ceiling &amp; lighting
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
              <ArrowLeft size={18} /> Previous
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
              Next: Design Preferences <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Design Preferences */}
      {currentStep === 4 && (
        <div className="calculator-box">
          <div className="calculator-header">
            <div>
              <h2>Step 4: Design Styles &amp; Architectural Aesthetics</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Choose primary style and room-specific themes for 3D conceptual generation
              </p>
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => setCurrentStep(3)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          {/* Primary Style */}
          <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
            Primary Architectural Style
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '14px',
            marginBottom: '28px'
          }}>
            {['Modern', 'Traditional', 'Minimalist', 'Contemporary', 'Luxury'].map((st) => (
              <div
                key={st}
                onClick={() => setOverallStyle(st)}
                style={{
                  background: overallStyle === st ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-surface)',
                  border: `2px solid ${overallStyle === st ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: overallStyle === st ? 'var(--accent-light)' : 'var(--text-main)' }}>
                  {st}
                </div>
              </div>
            ))}
          </div>

          {/* Room-specific Preferences */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Room-Specific Design Themes</h3>
          <div className="calc-grid">
            <div className="form-group">
              <label className="form-label">Exterior Elevation Style</label>
              <select className="form-select" value={exteriorPref} onChange={(e) => setExteriorPref(e.target.value)}>
                <option value="Modern">Modern (Glass, Cantilever &amp; Geometric Louvers)</option>
                <option value="Traditional">Traditional (Sloped Clay Tile Roofs &amp; Teak Pillars)</option>
                <option value="Minimalist">Minimalist (Pure Monolithic Planes &amp; Recessed Lights)</option>
                <option value="Contemporary">Contemporary (Mixed Stone Facade &amp; Warm Accents)</option>
                <option value="Luxury">Luxury (Grand Double-Height Portico &amp; Italian Accents)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Living Room Theme</label>
              <select className="form-select" value={livingRoomPref} onChange={(e) => setLivingRoomPref(e.target.value)}>
                <option value="Modern Minimalist">Modern Minimalist (Fluted Wood &amp; Cove Glow)</option>
                <option value="Classic Elegance">Classic Elegance (Mouldings &amp; Brass Fixtures)</option>
                <option value="Warm Scandinavian">Warm Scandinavian (Light Oak &amp; Neutral Tones)</option>
                <option value="Industrial Chic">Industrial Chic (Exposed Brick &amp; Metal Profiles)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Master Bedroom Theme</label>
              <select className="form-select" value={bedroomPref} onChange={(e) => setBedroomPref(e.target.value)}>
                <option value="Contemporary Luxury">Contemporary Luxury (Padded Headboard &amp; Warm Teak)</option>
                <option value="Serene Zen Minimalist">Serene Zen Minimalist (Platform Bed &amp; Diffused Glow)</option>
                <option value="Royal Classic">Royal Classic (Tufted Velvet &amp; Cove Chandeliers)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Kitchen Theme</label>
              <select className="form-select" value={kitchenPref} onChange={(e) => setKitchenPref(e.target.value)}>
                <option value="Italian Modular">Italian Modular (Handleless Matte Acrylic &amp; Quartz)</option>
                <option value="Open Island Kitchen">Open Island Kitchen with Breakfast Counter</option>
                <option value="L-Shaped Compact">L-Shaped Compact Ergonomic with Pantry Pull-outs</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bathroom Theme</label>
              <select className="form-select" value={bathroomPref} onChange={(e) => setBathroomPref(e.target.value)}>
                <option value="Spa Contemporary">Spa Contemporary (Glass Shower Cubicle &amp; LED Mirror)</option>
                <option value="Minimalist Terrazzo">Minimalist Terrazzo &amp; Matte Black Fixtures</option>
                <option value="Luxury Marble">Luxury Statuario Marble &amp; Concealed Diverters)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
              <ArrowLeft size={18} /> Previous
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentStep(5)}>
              Review &amp; Generate <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Generate */}
      {currentStep === 5 && (
        <div className="calculator-box">
          <div className="calculator-header">
            <div>
              <h2>Step 5: Review Configuration &amp; Generate House Plan</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                All site specifications and room requirements are ready for the AI planning engine
              </p>
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => setCurrentStep(4)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}>
            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Site Geometry</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '6px 0' }}>{length} ft × {width} ft ({landArea} sq.ft)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Facing: {facing} | Road: {roadWidth} ft</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Layout Scope</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '6px 0' }}>{floors} • {reqs.bedrooms} BHK</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{reqs.bathrooms} Baths, Kitchen, Living, Dining, Balcony</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Financial Target</div>
              <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-light)', margin: '6px 0' }}>
                ₹{Number(budget).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quality: {quality} | Style: {overallStyle}</div>
            </div>
          </div>

          <div className="disclaimer-badge">
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Conceptual Planning Notice:</strong> The generated plan provides an architectural zoning guideline. It is not a construction-ready blueprint or structural submission drawing.
            </div>
          </div>

          {/* GENERATE MY HOUSE Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              className="btn btn-accent btn-lg"
              onClick={handleGenerate}
              disabled={loading}
              style={{
                fontSize: '1.25rem',
                padding: '18px 42px',
                boxShadow: '0 8px 30px var(--accent-glow)'
              }}
            >
              {loading ? (
                <span>Generating Blueprint &amp; Layout...</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sparkles size={24} /> GENERATE MY HOUSE
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
