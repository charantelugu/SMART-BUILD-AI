import React, { useState, useEffect } from 'react';
import { Mountain, ArrowLeft, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function AggregatesCalculator({ onSave, onBack, initialPrice, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const aggData = REALTIME_MATERIAL_CATALOG.Aggregates;
  const [selectedGradeId, setSelectedGradeId] = useState(aggData.products[0].id);
  const [selectedSubproductName, setSelectedSubproductName] = useState(aggData.products[0].subproducts[0].name);
  const [quantity, setQuantity] = useState(2900);
  const [unit, setUnit] = useState('cu.ft (Cubic Feet)');
  const [pricePerUnit, setPricePerUnit] = useState(46);
  const [isCustomPrice, setIsCustomPrice] = useState(false);

  const activeProduct = aggData.products.find(p => p.id === selectedGradeId) || aggData.products[0];
  const activeSubproduct = activeProduct.subproducts.find(s => s.name === selectedSubproductName) || activeProduct.subproducts[0];

  useEffect(() => {
    if (!isCustomPrice && activeSubproduct) {
      const baseCuFtPrice = Math.round(activeSubproduct.price * regionMultiplier * 10) / 10;
      if (unit.includes('Brass')) {
        // 1 Brass = 100 cu.ft
        setPricePerUnit(Math.round(baseCuFtPrice * 100));
      } else if (unit.includes('Tons')) {
        // 1 Metric Ton ~ 22.5 cu.ft of dense granite
        setPricePerUnit(Math.round(baseCuFtPrice * 22.5));
      } else {
        setPricePerUnit(baseCuFtPrice);
      }
    }
  }, [selectedGradeId, selectedSubproductName, unit, regionMultiplier, isCustomPrice, activeSubproduct]);

  const handleGradeChange = (gradeId) => {
    setSelectedGradeId(gradeId);
    const prod = aggData.products.find(p => p.id === gradeId);
    if (prod && prod.subproducts.length > 0) {
      setSelectedSubproductName(prod.subproducts[0].name);
    }
    setIsCustomPrice(false);
  };

  const handleSubproductChange = (subName) => {
    setSelectedSubproductName(subName);
    setIsCustomPrice(false);
  };

  const totalCost = Math.round(Number(quantity || 0) * Number(pricePerUnit || 0));

  const handleSave = () => {
    if (onSave) {
      onSave('Aggregates', totalCost, {
        quantity,
        unit,
        pricePerUnit,
        aggregateType: activeProduct.grade,
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
          <div className="category-icon" style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8' }}>
            <Mountain size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Coarse Aggregates Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE QUARRY DISPATCH RATES
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Live crusher prices for 20mm Blue Granite, 10mm Down Aggregate, 40mm Ballast &amp; GSB
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
        border: '1px solid rgba(100, 116, 139, 0.25)',
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b', boxShadow: '0 0 6px #64748b' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Market Region: {activeRegion}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: '#94a3b8' }}>Trend: {aggData.marketTrend}</span>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          {aggData.lastSync}
        </span>
      </div>

      <div className="calc-grid">
        {/* 1. Aggregate Grade Category */}
        <div className="form-group">
          <label className="form-label">Coarse Aggregate Grading</label>
          <select
            className="form-select"
            value={selectedGradeId}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {aggData.products.map((p) => (
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
            Crusher Source / Subproduct Variant (Live Rate)
          </label>
          <select
            className="form-select"
            value={selectedSubproductName}
            onChange={(e) => handleSubproductChange(e.target.value)}
          >
            {activeProduct.subproducts.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.name} — ₹{sub.price.toFixed(1)} / cu.ft ({sub.certified})
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.76rem', color: '#94a3b8' }}>
            <ShieldCheck size={13} />
            <span>Crushing Standard: {activeSubproduct.certified}</span>
          </div>
        </div>

        {/* 3. Quantity */}
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input mono"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
            />
            <span className="input-unit-tag">{unit}</span>
          </div>
        </div>

        {/* 4. Unit of Measurement */}
        <div className="form-group">
          <label className="form-label">Unit of Measurement</label>
          <select
            className="form-select"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
              setIsCustomPrice(false);
            }}
          >
            <option value="cu.ft (Cubic Feet)">cu.ft (Cubic Feet)</option>
            <option value="Brass (100 cu.ft)">Brass (100 cu.ft Tipper Load)</option>
            <option value="Metric Tons">Metric Tons (~22.5 cu.ft/Ton)</option>
          </select>
        </div>

        {/* 5. Live Price per Unit */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Price per Unit (₹)
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
              value={pricePerUnit}
              onChange={(e) => {
                setPricePerUnit(e.target.value);
                setIsCustomPrice(true);
              }}
              min="0"
            />
            <span className="input-unit-tag">₹ / {unit}</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: isCustomPrice ? '#fbbf24' : '#34d399', marginTop: '4px' }}>
            {isCustomPrice
              ? '⚡ Custom crusher quote entered'
              : `🟢 Live Rate: ₹${pricePerUnit} / ${unit} • ${activeSubproduct.brand}`}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        background: 'rgba(100, 116, 139, 0.08)',
        border: '1px solid rgba(100, 116, 139, 0.2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: '#cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>💡 <strong>Grading Rule:</strong> Angular cubical 20mm granite with flakiness index &lt; 15% ensures optimum mechanical interlock in RCC slabs and columns.</span>
        <span className="mono" style={{ color: 'var(--accent-light)' }}>IS:383 Coarse Aggregates</span>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL ESTIMATED AGGREGATES COST</span>
          <div className="calc-result-value">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            For {Number(quantity || 0).toLocaleString('en-IN')} {unit} • {activeSubproduct.name}
          </span>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={18} /> Update Cost Summary
        </button>
      </div>
    </div>
  );
}
