import React, { useState, useEffect } from 'react';
import { Wrench, ArrowLeft, Plus, Trash2, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function PlumbingCalculator({ onSave, onBack, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const [brandTier, setBrandTier] = useState('Luxury Specification (Kohler / Jaquar / Sintex)');

  const getPresetItems = (tier) => {
    const isKohler = tier.includes('Kohler') || tier.includes('Luxury');
    return [
      { id: 1, name: isKohler ? 'Astral CPVC Pro High-Pressure Concealed Water Lines' : 'Ashirvad FlowGuard CPVC Lines', brand: isKohler ? 'Astral' : 'Ashirvad', unit: 'Bundle (30m)', quantity: 8, unitPrice: Math.round((isKohler ? 4200 : 3600) * regionMultiplier) },
      { id: 2, name: isKohler ? 'Jaquar Brass Angle Valves & Concealed Stop Cocks' : 'Zoloto Quarter-Turn Angle Valves', brand: isKohler ? 'Jaquar' : 'Zoloto', unit: 'Pieces', quantity: 24, unitPrice: Math.round((isKohler ? 680 : 450) * regionMultiplier) },
      { id: 3, name: isKohler ? 'Kohler Kumin Basin Mixer Faucet (Hot & Cold)' : 'Jaquar Alive Quarter-Turn Basin Taps', brand: isKohler ? 'Kohler' : 'Jaquar', unit: 'Pieces', quantity: 14, unitPrice: Math.round((isKohler ? 3600 : 1450) * regionMultiplier) },
      { id: 4, name: isKohler ? 'Jaquar Florentine Concealed Diverter & Rain Shower' : 'Cera Single Lever Concealed Diverter', brand: isKohler ? 'Jaquar' : 'Cera', unit: 'Sets', quantity: 3, unitPrice: Math.round((isKohler ? 5400 : 3800) * regionMultiplier) },
      { id: 5, name: isKohler ? 'Kohler Rimless Wall-Hung Toilet with Soft-Close Seat' : 'Hindware Element Wall-Hung EWC', brand: isKohler ? 'Kohler' : 'Hindware', unit: 'Sets', quantity: 3, unitPrice: Math.round((isKohler ? 14500 : 7800) * regionMultiplier) },
      { id: 6, name: isKohler ? 'Jaquar Ceramic Countertop Wash Basins' : 'Cera Tabletop Vanity Basins', brand: isKohler ? 'Jaquar' : 'Cera', unit: 'Pieces', quantity: 4, unitPrice: Math.round((isKohler ? 2900 : 1950) * regionMultiplier) },
      { id: 7, name: isKohler ? 'Sintex 4-Layer Antibacterial 1000L Overhead Water Tank' : 'Supreme 4-Layer 1000L Tank', brand: isKohler ? 'Sintex' : 'Supreme', unit: 'Units', quantity: 1, unitPrice: Math.round((isKohler ? 8900 : 7900) * regionMultiplier) },
      { id: 8, name: isKohler ? 'Crompton 0.5 HP Automatic Pressure Booster Pump' : 'Kirloskar 0.5 HP Booster Pump', brand: isKohler ? 'Crompton' : 'Kirloskar', unit: 'Units', quantity: 1, unitPrice: Math.round((isKohler ? 11200 : 9200) * regionMultiplier) },
      { id: 9, name: 'Chilly / Supreme Stainless Steel Anti-Cockroach Floor Traps', brand: 'Chilly SS', unit: 'Kits', quantity: 6, unitPrice: Math.round(750 * regionMultiplier) }
    ];
  };

  const [items, setItems] = useState(() => getPresetItems(brandTier));

  const handleTierChange = (newTier) => {
    setBrandTier(newTier);
    setItems(getPresetItems(newTier));
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: Number(value) };
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'Custom Plumbing Fixture (Jaquar/Kohler)',
      brand: 'Custom',
      unit: 'Pieces',
      quantity: 1,
      unitPrice: Math.round(1400 * regionMultiplier)
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));
  }, 0);

  const handleSave = () => {
    if (onSave) {
      onSave('Plumbing', subtotal, { items, subtotal, brandTier, region: activeRegion });
    }
  };

  return (
    <div className="calculator-box">
      <div className="calculator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="category-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
            <Wrench size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Plumbing &amp; Sanitaryware Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE SANITARY &amp; CP FITTINGS RATES
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time multi-item plumbing BOQ: Astral, Jaquar, Kohler, Hindware &amp; Sintex
            </p>
          </div>
        </div>

        {onBack && (
          <button className="btn btn-outline btn-sm" onClick={onBack}>
            <ArrowLeft size={16} /> All Categories
          </button>
        )}
      </div>

      {/* Brand Tier & Region Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(236, 72, 153, 0.25)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0' }}>SELECT BRAND SPECIFICATION TIER:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Luxury Specification (Kohler / Jaquar / Sintex)', 'Standard Specification (Hindware / Cera / Astral)'].map((t) => (
              <button
                key={t}
                onClick={() => handleTierChange(t)}
                className={`btn btn-sm ${brandTier === t ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                {t.includes('Luxury') ? '★ Luxury (Kohler/Jaquar)' : 'Standard (Hindware/Cera)'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#f472b6' }}>
          Region: {activeRegion} • {REALTIME_MATERIAL_CATALOG.Plumbing.marketTrend}
        </div>
      </div>

      {/* Dynamic Itemized Table */}
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table className="boq-table">
          <thead>
            <tr>
              <th>Subproduct &amp; Brand Specification</th>
              <th>Unit</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Live Rate (₹)</th>
              <th style={{ textAlign: 'right' }}>Subtotal (₹)</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Brand: {item.brand} • Certified Quality</div>
                  </td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{item.unit}</td>
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      className="form-input mono"
                      style={{ width: '80px', padding: '4px 8px', textAlign: 'right', display: 'inline-block' }}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      min="0"
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      className="form-input mono"
                      style={{ width: '100px', padding: '4px 8px', textAlign: 'right', display: 'inline-block' }}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                      min="0"
                    />
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }} className="mono">
                    ₹{itemTotal.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button className="btn btn-outline btn-sm" onClick={addItem}>
          <Plus size={15} /> Add Custom Sanitary / CP Fitting
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => handleTierChange(brandTier)} style={{ color: '#38bdf8' }}>
          <RefreshCw size={13} /> Reset All to Live Benchmark Rates
        </button>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL PLUMBING &amp; SANITARY BOQ SUBHEAD</span>
          <div className="calc-result-value">
            ₹{subtotal.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Total for {items.length} subproduct line items ({brandTier.split('(')[0]})
          </span>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={18} /> Update Cost Summary
        </button>
      </div>
    </div>
  );
}
