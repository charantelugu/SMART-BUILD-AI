import React, { useState, useEffect } from 'react';
import { Grid, ArrowLeft, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function TilesCalculator({ onSave, onBack, initialPrice, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const tilesData = REALTIME_MATERIAL_CATALOG.Tiles;
  const [selectedGradeId, setSelectedGradeId] = useState(tilesData.products[0].id);
  const [selectedSubproductName, setSelectedSubproductName] = useState(tilesData.products[0].subproducts[0].name);
  const [areaSqFt, setAreaSqFt] = useState(1800);
  const [pricePerSqFt, setPricePerSqFt] = useState(68);
  const [wastagePercent, setWastagePercent] = useState(10);
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const activeProduct = tilesData.products.find(p => p.id === selectedGradeId) || tilesData.products[0];
  const activeSubproduct = activeProduct.subproducts.find(s => s.name === selectedSubproductName) || activeProduct.subproducts[0];

  useEffect(() => {
    if (!isCustomPrice && activeSubproduct) {
      const livePrice = Math.round(activeSubproduct.price * regionMultiplier * 10) / 10;
      setPricePerSqFt(livePrice);
    }
  }, [selectedGradeId, selectedSubproductName, regionMultiplier, isCustomPrice, activeSubproduct]);

  const handleGradeChange = (gradeId) => {
    setSelectedGradeId(gradeId);
    const prod = tilesData.products.find(p => p.id === gradeId);
    if (prod && prod.subproducts.length > 0) {
      setSelectedSubproductName(prod.subproducts[0].name);
    }
    setIsCustomPrice(false);
  };

  const handleSubproductChange = (subName) => {
    setSelectedSubproductName(subName);
    setIsCustomPrice(false);
  };

  const wastageArea = (Number(areaSqFt || 0) * Number(wastagePercent || 0)) / 100;
  const requiredArea = Number(areaSqFt || 0) + wastageArea;
  const totalCost = Math.round(requiredArea * Number(pricePerSqFt || 0));

  const handleSave = () => {
    if (onSave) {
      onSave('Tiles', totalCost, {
        areaSqFt,
        wastagePercent,
        requiredArea: Math.round(requiredArea),
        pricePerSqFt,
        tileType: activeProduct.grade,
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
          <div className="category-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
            <Grid size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Tiles &amp; Flooring Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE MORBI &amp; GRANITE INDEX
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time sq.ft rates for Kajaria, Somany, Simpolo, Granite Slabs &amp; Exterior Pavers
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
        border: '1px solid rgba(245, 158, 11, 0.25)',
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Market Region: {activeRegion}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: '#fbbf24' }}>Trend: {tilesData.marketTrend}</span>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          {tilesData.lastSync}
        </span>
      </div>

      <div className="calc-grid">
        {/* 1. Tile Category Grade */}
        <div className="form-group">
          <label className="form-label">Tile Material / Finish Category</label>
          <select
            className="form-select"
            value={selectedGradeId}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {tilesData.products.map((p) => (
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
                {sub.name} — ₹{sub.price.toFixed(1)} / sq.ft ({sub.certified})
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.76rem', color: '#fbbf24' }}>
            <ShieldCheck size={13} />
            <span>Specification Standard: {activeSubproduct.certified}</span>
          </div>
        </div>

        {/* 3. Flooring Area in Sq.Ft */}
        <div className="form-group">
          <label className="form-label">Flooring / Wall Area (sq.ft)</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(e.target.value)}
              min="0"
            />
            <span className="input-unit-tag">sq.ft</span>
          </div>
        </div>

        {/* 4. Wastage Percentage */}
        <div className="form-group">
          <label className="form-label">Wastage &amp; Cutting Allowance (%)</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(e.target.value)}
              min="0"
              max="25"
            />
            <span className="input-unit-tag">%</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Requires <strong>{Math.round(requiredArea).toLocaleString('en-IN')} sq.ft</strong> including cutting margin
          </span>
        </div>

        {/* 5. Live Price per Sq.Ft */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Price per Square Foot (₹)
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
              value={pricePerSqFt}
              onChange={(e) => {
                setPricePerSqFt(e.target.value);
                setIsCustomPrice(true);
              }}
              min="0"
            />
            <span className="input-unit-tag">₹ / sq.ft</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: isCustomPrice ? '#fbbf24' : '#34d399', marginTop: '4px' }}>
            {isCustomPrice
              ? '⚡ Custom dealer quote entered'
              : `🟢 Live Rate: ₹${pricePerSqFt} / sq.ft • ${activeSubproduct.brand}`}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: '#fde68a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>💡 <strong>Flooring Rule:</strong> 4×2 ft large tiles need minimum 10% wastage margin for diagonal room cuts and skirting tiles.</span>
        <span className="mono" style={{ color: 'var(--accent-light)' }}>Epoxy Grout: ~1 kg / 60 sq.ft</span>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL ESTIMATED TILES &amp; FLOORING COST</span>
          <div className="calc-result-value">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            For {Math.round(requiredArea).toLocaleString('en-IN')} sq.ft total area • {activeSubproduct.name}
          </span>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={18} /> Update Cost Summary
        </button>
      </div>
    </div>
  );
}
