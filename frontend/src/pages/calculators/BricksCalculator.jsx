import React, { useState, useEffect } from 'react';
import { Box, ArrowLeft, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function BricksCalculator({ onSave, onBack, initialPrice, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const bricksData = REALTIME_MATERIAL_CATALOG.Bricks;
  const [selectedGradeId, setSelectedGradeId] = useState(bricksData.products[0].id);
  const [selectedSubproductName, setSelectedSubproductName] = useState(bricksData.products[0].subproducts[0].name);
  const [numberOfBricks, setNumberOfBricks] = useState(18500);
  const [pricePerBrick, setPricePerBrick] = useState(9.5);
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const activeProduct = bricksData.products.find(p => p.id === selectedGradeId) || bricksData.products[0];
  const activeSubproduct = activeProduct.subproducts.find(s => s.name === selectedSubproductName) || activeProduct.subproducts[0];

  const isAAC = activeProduct.grade.includes('AAC');

  useEffect(() => {
    if (!isCustomPrice && activeSubproduct) {
      const livePrice = Math.round(activeSubproduct.price * regionMultiplier * 10) / 10;
      setPricePerBrick(livePrice);
    }
  }, [selectedGradeId, selectedSubproductName, regionMultiplier, isCustomPrice, activeSubproduct]);

  const handleGradeChange = (gradeId) => {
    setSelectedGradeId(gradeId);
    const prod = bricksData.products.find(p => p.id === gradeId);
    if (prod && prod.subproducts.length > 0) {
      setSelectedSubproductName(prod.subproducts[0].name);
    }
    // If switching to AAC blocks, adjust quantity since 1 AAC block replaces 8 bricks
    if (prod.grade.includes('AAC') && numberOfBricks > 5000) {
      setNumberOfBricks(Math.round(numberOfBricks / 8));
    } else if (!prod.grade.includes('AAC') && numberOfBricks < 5000) {
      setNumberOfBricks(numberOfBricks * 8);
    }
    setIsCustomPrice(false);
  };

  const handleSubproductChange = (subName) => {
    setSelectedSubproductName(subName);
    setIsCustomPrice(false);
  };

  const totalCost = Math.round(Number(numberOfBricks || 0) * Number(pricePerBrick || 0));

  const handleSave = () => {
    if (onSave) {
      onSave('Bricks', totalCost, {
        numberOfBricks,
        pricePerBrick,
        brickType: activeProduct.grade,
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
          <div className="category-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
            <Box size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Bricks &amp; Blocks Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE BRICK KILN &amp; AAC INDEX
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Live rates for Red Clay Kiln Bricks, Magicrete AAC Blocks, Fly Ash &amp; Solid Concrete Units
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
        border: '1px solid rgba(239, 68, 68, 0.25)',
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Market Region: {activeRegion}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: '#f87171' }}>Trend: {bricksData.marketTrend}</span>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          {bricksData.lastSync}
        </span>
      </div>

      <div className="calc-grid">
        {/* 1. Masonry Material Type */}
        <div className="form-group">
          <label className="form-label">Masonry Material Type</label>
          <select
            className="form-select"
            value={selectedGradeId}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {bricksData.products.map((p) => (
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
            Brand / Subproduct Variant (Live Market Rate)
          </label>
          <select
            className="form-select"
            value={selectedSubproductName}
            onChange={(e) => handleSubproductChange(e.target.value)}
          >
            {activeProduct.subproducts.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.name} — ₹{sub.price.toFixed(1)} / piece ({sub.certified})
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.76rem', color: '#f87171' }}>
            <ShieldCheck size={13} />
            <span>Specification Standard: {activeSubproduct.certified}</span>
          </div>
        </div>

        {/* 3. Number of Bricks / Blocks */}
        <div className="form-group">
          <label className="form-label">
            {isAAC ? 'Number of AAC Blocks (600×200mm)' : 'Number of Bricks / Blocks'}
          </label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={numberOfBricks}
              onChange={(e) => setNumberOfBricks(e.target.value)}
              min="0"
            />
            <span className="input-unit-tag">pieces</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {isAAC 
              ? '💡 1 AAC block replaces ~8 red clay bricks with 60% less joint mortar'
              : 'Includes standard ~5% handling & transit breakage'}
          </span>
        </div>

        {/* 4. Price per Brick / Block */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Price per Piece (₹)
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
              value={pricePerBrick}
              onChange={(e) => {
                setPricePerBrick(e.target.value);
                setIsCustomPrice(true);
              }}
              min="0"
            />
            <span className="input-unit-tag">₹ / piece</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: isCustomPrice ? '#fbbf24' : '#34d399', marginTop: '4px' }}>
            {isCustomPrice
              ? '⚡ Custom dealer rate entered'
              : `🟢 Live Rate: ₹${pricePerBrick} / piece • ${activeSubproduct.brand}`}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: '#fca5a5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>💡 <strong>Quantity Rule:</strong> 9-inch thick wall requires ~12 bricks per sq.ft; 4.5-inch partition requires ~6 bricks per sq.ft.</span>
        <span className="mono" style={{ color: 'var(--accent-light)' }}>IS:1077 &amp; IS:2185</span>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL ESTIMATED MASONRY COST</span>
          <div className="calc-result-value">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            For {Number(numberOfBricks || 0).toLocaleString('en-IN')} units • {activeSubproduct.name}
          </span>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={18} /> Update Cost Summary
        </button>
      </div>
    </div>
  );
}
