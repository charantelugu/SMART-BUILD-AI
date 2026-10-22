import React, { useState, useEffect } from 'react';
import { Paintbrush, ArrowLeft, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function PaintCalculator({ onSave, onBack, initialPrice, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const paintData = REALTIME_MATERIAL_CATALOG.Paint;
  const [selectedGradeId, setSelectedGradeId] = useState(paintData.products[0].id);
  const [selectedSubproductName, setSelectedSubproductName] = useState(paintData.products[0].subproducts[0].name);
  const [paintableArea, setPaintableArea] = useState(4800);
  const [numberOfCoats, setNumberOfCoats] = useState(2);
  const [paintCoverage, setPaintCoverage] = useState(110); // sq.ft per litre per coat
  const [pricePerLitre, setPricePerLitre] = useState(540);
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const activeProduct = paintData.products.find(p => p.id === selectedGradeId) || paintData.products[0];
  const activeSubproduct = activeProduct.subproducts.find(s => s.name === selectedSubproductName) || activeProduct.subproducts[0];

  useEffect(() => {
    if (!isCustomPrice && activeSubproduct) {
      const livePrice = Math.round(activeSubproduct.price * regionMultiplier * 10) / 10;
      setPricePerLitre(livePrice);
    }
  }, [selectedGradeId, selectedSubproductName, regionMultiplier, isCustomPrice, activeSubproduct]);

  const handleGradeChange = (gradeId) => {
    setSelectedGradeId(gradeId);
    const prod = paintData.products.find(p => p.id === gradeId);
    if (prod && prod.subproducts.length > 0) {
      setSelectedSubproductName(prod.subproducts[0].name);
    }
    // Adjust default coverage depending on primer/putty vs emulsion
    if (prod.grade.includes('Primer')) setPaintCoverage(140);
    else if (prod.grade.includes('Putty')) setPaintCoverage(20);
    else setPaintCoverage(110);
    setIsCustomPrice(false);
  };

  const handleSubproductChange = (subName) => {
    setSelectedSubproductName(subName);
    setIsCustomPrice(false);
  };

  const effectiveArea = Number(paintableArea || 0) * Number(numberOfCoats || 1);
  const requiredLitres = Math.ceil(effectiveArea / Math.max(1, Number(paintCoverage || 110)));
  const totalCost = Math.round(requiredLitres * Number(pricePerLitre || 0));

  const handleSave = () => {
    if (onSave) {
      onSave('Paint', totalCost, {
        paintableArea,
        numberOfCoats,
        paintCoverage,
        pricePerLitre,
        requiredLitres,
        paintType: activeProduct.grade,
        brand: activeSubproduct.brand,
        subproduct: activeSubproduct.name,
        region: activeRegion
      });
    }
  };

  return (
    <div className="calculator-box">
      <div className="calculator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="category-icon" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf' }}>
            <Paintbrush size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Paint &amp; Coatings Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE PAINT WHOLESALE INDEX
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Live litre rates for Asian Paints Royale/Apex, Dulux Velvet Touch &amp; Berger WeatherCoat
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
        border: '1px solid rgba(20, 184, 166, 0.25)',
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#14b8a6', boxShadow: '0 0 6px #14b8a6' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Market Region: {activeRegion}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: '#2dd4bf' }}>Trend: {paintData.marketTrend}</span>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          {paintData.lastSync}
        </span>
      </div>

      <div className="calc-grid">
        {/* 1. Paint Classification */}
        <div className="form-group">
          <label className="form-label">Paint Specification Tier</label>
          <select
            className="form-select"
            value={selectedGradeId}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {paintData.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.grade}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {activeProduct.desc}
          </span>
        </div>

        {/* 2. Subproduct & Brand Variant */}
        <div className="form-group">
          <label className="form-label">
            Brand / Subproduct Variant (Live Rate)
          </label>
          <select
            className="form-select"
            value={selectedSubproductName}
            onChange={(e) => handleSubproductChange(e.target.value)}
          >
            {activeProduct.subproducts.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.name} — ₹{sub.price.toFixed(1)} / Litre ({sub.certified})
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.76rem', color: '#2dd4bf' }}>
            <ShieldCheck size={13} />
            <span>Specification Quality: {activeSubproduct.certified}</span>
          </div>
        </div>

        {/* 3. Surface Area */}
        <div className="form-group">
          <label className="form-label">Paintable Surface Area (sq.ft)</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={paintableArea}
              onChange={(e) => setPaintableArea(e.target.value)}
              min="0"
            />
            <span className="input-unit-tag">sq.ft</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Walls + Ceilings (Approx 3.5× to 4× built-up carpet area)
          </span>
        </div>

        {/* 4. Number of Coats */}
        <div className="form-group">
          <label className="form-label">Number of Coats</label>
          <select
            className="form-select"
            value={numberOfCoats}
            onChange={(e) => setNumberOfCoats(Number(e.target.value))}
          >
            <option value="1">1 Coat (Touch-up / Refresh)</option>
            <option value="2">2 Coats (Standard New Construction - Recommended)</option>
            <option value="3">3 Coats (High-Depth Luxury Sheen)</option>
          </select>
        </div>

        {/* 5. Coverage */}
        <div className="form-group">
          <label className="form-label">Coverage (sq.ft per Litre / Coat)</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={paintCoverage}
              onChange={(e) => setPaintCoverage(e.target.value)}
              min="10"
            />
            <span className="input-unit-tag">sq.ft/L</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Yields approximately <strong>{requiredLitres} Litres</strong> of paint
          </span>
        </div>

        {/* 6. Live Price per Litre */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Price per Litre (₹)
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
              step="1"
              className="form-input mono"
              value={pricePerLitre}
              onChange={(e) => {
                setPricePerLitre(e.target.value);
                setIsCustomPrice(true);
              }}
              min="0"
            />
            <span className="input-unit-tag">₹ / Litre</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: isCustomPrice ? '#fbbf24' : '#34d399', marginTop: '4px' }}>
            {isCustomPrice
              ? '⚡ Custom quote entered'
              : `🟢 Live Rate: ₹${pricePerLitre} / Litre • ${activeSubproduct.brand}`}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        background: 'rgba(20, 184, 166, 0.08)',
        border: '1px solid rgba(20, 184, 166, 0.2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: '#99f6e4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>💡 <strong>Painting Rule:</strong> For smooth unblemished finish, apply 2 coats of polymer putty followed by 1 coat primer before the 2 topcoats.</span>
        <span className="mono" style={{ color: 'var(--accent-light)' }}>Low-VOC &lt; 50 g/L</span>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL ESTIMATED PAINT &amp; COATINGS COST</span>
          <div className="calc-result-value">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            For {requiredLitres} Litres ({numberOfCoats} coats across {Number(paintableArea || 0).toLocaleString('en-IN')} sq.ft) • {activeSubproduct.name}
          </span>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={18} /> Update Cost Summary
        </button>
      </div>
    </div>
  );
}
