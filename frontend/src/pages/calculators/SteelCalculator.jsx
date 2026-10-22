import React, { useState, useEffect } from 'react';
import { Layers, ArrowLeft, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function SteelCalculator({ onSave, onBack, initialPrice, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const steelData = REALTIME_MATERIAL_CATALOG.Steel;
  const [selectedGradeId, setSelectedGradeId] = useState(steelData.products[0].id);
  const [selectedSubproductName, setSelectedSubproductName] = useState(steelData.products[0].subproducts[0].name);
  const [diameter, setDiameter] = useState('Standard Mix (10mm - 20mm)');
  const [quantityKg, setQuantityKg] = useState(3800);
  const [pricePerKg, setPricePerKg] = useState(74.5);
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const activeProduct = steelData.products.find(p => p.id === selectedGradeId) || steelData.products[0];
  const activeSubproduct = activeProduct.subproducts.find(s => s.name === selectedSubproductName) || activeProduct.subproducts[0];

  // Diameter adjustments (8mm has higher drawing cost, heavy bars have lower cost)
  const diameterDiff = diameter.includes('8mm') ? 1.5 : diameter.includes('Heavy 25mm') ? -0.8 : 0;

  useEffect(() => {
    if (!isCustomPrice && activeSubproduct) {
      const baseRate = activeSubproduct.price * regionMultiplier;
      const finalRate = Math.round((baseRate + diameterDiff) * 10) / 10;
      setPricePerKg(finalRate);
    }
  }, [selectedGradeId, selectedSubproductName, diameter, regionMultiplier, isCustomPrice, activeSubproduct, diameterDiff]);

  const handleGradeChange = (gradeId) => {
    setSelectedGradeId(gradeId);
    const prod = steelData.products.find(p => p.id === gradeId);
    if (prod && prod.subproducts.length > 0) {
      setSelectedSubproductName(prod.subproducts[0].name);
    }
    setIsCustomPrice(false);
  };

  const handleSubproductChange = (subName) => {
    setSelectedSubproductName(subName);
    setIsCustomPrice(false);
  };

  const totalCost = Math.round(Number(quantityKg || 0) * Number(pricePerKg || 0));

  const handleSave = () => {
    if (onSave) {
      onSave('Steel', totalCost, {
        quantityKg,
        pricePerKg,
        steelGrade: activeProduct.grade,
        brand: activeSubproduct.brand,
        subproduct: activeSubproduct.name,
        diameter,
        tonnage: (Number(quantityKg || 0) / 1000).toFixed(2),
        region: activeRegion
      });
    }
  };

  return (
    <div className="calculator-box">
      <div className="calculator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="category-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <Layers size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Steel (TMT Rebars) Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE STEEL MANDI FEED
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Live primary &amp; secondary mill prices for Fe 550D, Fe 500D &amp; CRS rebar specifications
            </p>
          </div>
        </div>

        {onBack && (
          <button className="btn btn-outline btn-sm" onClick={onBack}>
            <ArrowLeft size={16} /> All Categories
          </button>
        )}
      </div>

      {/* Real-Time Market Status Banner */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '0.84rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Market Region: {activeRegion}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: '#34d399' }}>Trend: {steelData.marketTrend}</span>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          {steelData.lastSync}
        </span>
      </div>

      <div className="calc-grid">
        {/* 1. Grade Selector */}
        <div className="form-group">
          <label className="form-label">Steel Rebar Grade</label>
          <select
            className="form-select"
            value={selectedGradeId}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {steelData.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.grade}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {activeProduct.desc}
          </span>
        </div>

        {/* 2. Brand & Subproduct Selector */}
        <div className="form-group">
          <label className="form-label">
            Brand / Mill Subproduct (Real-Time Rate)
          </label>
          <select
            className="form-select"
            value={selectedSubproductName}
            onChange={(e) => handleSubproductChange(e.target.value)}
          >
            {activeProduct.subproducts.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.name} — ₹{sub.price.toFixed(1)}/kg (₹{(sub.price * 1000).toLocaleString('en-IN')}/Ton)
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.76rem', color: '#34d399' }}>
            <ShieldCheck size={13} />
            <span>Certified Standard: {activeSubproduct.certified}</span>
          </div>
        </div>

        {/* 3. Rebar Bar Diameter Size */}
        <div className="form-group">
          <label className="form-label">Rebar Section / Diameter</label>
          <select
            className="form-select"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
          >
            <option value="Standard Mix (10mm - 20mm)">Standard Structural Mix (10mm, 12mm, 16mm &amp; 20mm)</option>
            <option value="8mm Ring / Stirrups (+₹1.50/kg)">8mm Rebars (Shear Stirrups / Ring Ties - +₹1.50/kg)</option>
            <option value="Heavy 25mm / 32mm Raft (-₹0.80/kg)">25mm / 32mm (Heavy Foundation Raft - ₹0.80/kg discount)</option>
          </select>
        </div>

        {/* 4. Quantity in Kilograms */}
        <div className="form-group">
          <label className="form-label">Quantity in Kilograms (kg)</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              min="0"
            />
            <span className="input-unit-tag">kg</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Equivalent to <strong>{(Number(quantityKg || 0) / 1000).toFixed(2)} Metric Tons</strong>
          </span>
        </div>

        {/* 5. Price per Kilogram */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Price per Kilogram (₹)
            </label>
            {isCustomPrice && (
              <button
                type="button"
                onClick={() => setIsCustomPrice(false)}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={11} /> Reset to Live Rate
              </button>
            )}
          </div>
          <div className="input-with-unit">
            <input
              type="number"
              step="0.1"
              className="form-input mono"
              value={pricePerKg}
              onChange={(e) => {
                setPricePerKg(e.target.value);
                setIsCustomPrice(true);
              }}
              min="0"
            />
            <span className="input-unit-tag">₹ / kg</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: isCustomPrice ? '#fbbf24' : '#34d399', marginTop: '4px' }}>
            {isCustomPrice
              ? '⚡ Custom dealer quote entered'
              : `🟢 Live Rate: ₹${pricePerKg}/kg (₹${Math.round(pricePerKg * 1000).toLocaleString('en-IN')}/Ton) • ${activeSubproduct.brand}`}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: '#a7f3d0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>💡 <strong>Structural Rule:</strong> Residential RCC structures consume approx 3.5 - 4.5 kg of steel per sq.ft of built-up area.</span>
        <span className="mono" style={{ color: 'var(--accent-light)' }}>IS:456 &amp; IS:13920 Ductile Detailing</span>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL ESTIMATED STEEL COST</span>
          <div className="calc-result-value">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            For {Number(quantityKg || 0).toLocaleString('en-IN')} kg ({(Number(quantityKg || 0) / 1000).toFixed(2)} Tons) • {activeSubproduct.name}
          </span>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={18} /> Update Cost Summary
        </button>
      </div>
    </div>
  );
}
