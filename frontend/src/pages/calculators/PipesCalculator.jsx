import React, { useState, useEffect } from 'react';
import { Disc, ArrowLeft, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function PipesCalculator({ onSave, onBack, initialPrice, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const pipesData = REALTIME_MATERIAL_CATALOG.Pipes;
  const [selectedGradeId, setSelectedGradeId] = useState(pipesData.products[0].id);
  const [selectedSubproductName, setSelectedSubproductName] = useState(pipesData.products[0].subproducts[0].name);
  const [requiredLength, setRequiredLength] = useState(320);
  const [pricePerMetre, setPricePerMetre] = useState(225);
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const activeProduct = pipesData.products.find(p => p.id === selectedGradeId) || pipesData.products[0];
  const activeSubproduct = activeProduct.subproducts.find(s => s.name === selectedSubproductName) || activeProduct.subproducts[0];

  useEffect(() => {
    if (!isCustomPrice && activeSubproduct) {
      const liveRate = Math.round(activeSubproduct.price * regionMultiplier * 10) / 10;
      setPricePerMetre(liveRate);
    }
  }, [selectedGradeId, selectedSubproductName, regionMultiplier, isCustomPrice, activeSubproduct]);

  const handleGradeChange = (gradeId) => {
    setSelectedGradeId(gradeId);
    const prod = pipesData.products.find(p => p.id === gradeId);
    if (prod && prod.subproducts.length > 0) {
      setSelectedSubproductName(prod.subproducts[0].name);
    }
    setIsCustomPrice(false);
  };

  const handleSubproductChange = (subName) => {
    setSelectedSubproductName(subName);
    setIsCustomPrice(false);
  };

  const totalCost = Math.round(Number(requiredLength || 0) * Number(pricePerMetre || 0));

  const handleSave = () => {
    if (onSave) {
      onSave('Pipes', totalCost, {
        pipeType: activeProduct.grade,
        brand: activeSubproduct.brand,
        subproduct: activeSubproduct.name,
        requiredLength,
        pricePerMetre,
        region: activeRegion
      });
    }
  };

  return (
    <div className="calculator-box">
      <div className="calculator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="category-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
            <Disc size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Pipes &amp; Conduits Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE POLYMER &amp; PLUMBING RATES
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Live rates for Astral, Supreme, Ashirvad &amp; Prince across CPVC, UPVC &amp; SWR drainage diameters
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
        border: '1px solid rgba(6, 182, 212, 0.25)',
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Market Region: {activeRegion}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: '#22d3ee' }}>Trend: {pipesData.marketTrend}</span>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          {pipesData.lastSync}
        </span>
      </div>

      <div className="calc-grid">
        {/* 1. Pipe System Class */}
        <div className="form-group">
          <label className="form-label">Pipe Material System</label>
          <select
            className="form-select"
            value={selectedGradeId}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {pipesData.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.grade}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {activeProduct.desc}
          </span>
        </div>

        {/* 2. Subproduct & Diameter Specification */}
        <div className="form-group">
          <label className="form-label">
            Brand, Diameter &amp; SDR Grade (Live Rate)
          </label>
          <select
            className="form-select"
            value={selectedSubproductName}
            onChange={(e) => handleSubproductChange(e.target.value)}
          >
            {activeProduct.subproducts.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.name} — ₹{sub.price.toFixed(1)} / meter (~₹{(sub.price / 3.28).toFixed(1)}/ft)
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.76rem', color: '#22d3ee' }}>
            <ShieldCheck size={13} />
            <span>Standard Compliance: {activeSubproduct.certified}</span>
          </div>
        </div>

        {/* 3. Required Length */}
        <div className="form-group">
          <label className="form-label">Required Length in Metres</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={requiredLength}
              onChange={(e) => setRequiredLength(e.target.value)}
              min="0"
            />
            <span className="input-unit-tag">metres</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            ~{(Number(requiredLength || 0) * 3.28084).toFixed(0)} Running Feet
          </span>
        </div>

        {/* 4. Price per Metre */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Price per Metre (₹)
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
              step="0.5"
              className="form-input mono"
              value={pricePerMetre}
              onChange={(e) => {
                setPricePerMetre(e.target.value);
                setIsCustomPrice(true);
              }}
              min="0"
            />
            <span className="input-unit-tag">₹ / m</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: isCustomPrice ? '#fbbf24' : '#34d399', marginTop: '4px' }}>
            {isCustomPrice
              ? '⚡ Custom dealer quote entered'
              : `🟢 Live Rate: ₹${pricePerMetre} / meter (~₹${(pricePerMetre / 3.28).toFixed(1)}/ft) • ${activeSubproduct.brand}`}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        background: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: '#a5f3fc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>💡 <strong>Plumbing Code:</strong> Hot water lines require minimum SDR 11 CPVC rated for 82°C at 6.9 bar working pressure.</span>
        <span className="mono" style={{ color: 'var(--accent-light)' }}>IS:15778 Lead-Free Standard</span>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL ESTIMATED PIPING RUNS COST</span>
          <div className="calc-result-value">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            For {Number(requiredLength || 0).toLocaleString('en-IN')} meters (~{(Number(requiredLength || 0) * 3.28084).toFixed(0)} ft) • {activeSubproduct.name}
          </span>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={18} /> Update Cost Summary
        </button>
      </div>
    </div>
  );
}
