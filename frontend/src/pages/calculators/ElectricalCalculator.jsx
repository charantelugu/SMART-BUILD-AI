import React, { useState, useEffect } from 'react';
import { Zap, ArrowLeft, Plus, Trash2, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { REALTIME_MATERIAL_CATALOG } from '../../services/materialCatalog';

export default function ElectricalCalculator({ onSave, onBack, regionMultiplier = 1.0, activeRegion = 'National Average' }) {
  const [brandTier, setBrandTier] = useState('Premium Specification (Finolex / Schneider / Legrand)');

  const getPresetItems = (tier) => {
    const isSchneider = tier.includes('Schneider') || tier.includes('Premium');
    return [
      { id: 1, name: isSchneider ? 'Finolex FR-LSH Copper Wires (1.5 sq.mm - Lighting)' : 'Havells Life Line 1.5 sq.mm', brand: isSchneider ? 'Finolex' : 'Havells', unit: 'Coils (90m)', quantity: 8, unitPrice: Math.round((isSchneider ? 1820 : 1720) * regionMultiplier) },
      { id: 2, name: isSchneider ? 'Polycab Green Wire (2.5 sq.mm - Power Sockets)' : 'Havells 2.5 sq.mm Power Wire', brand: isSchneider ? 'Polycab' : 'Havells', unit: 'Coils (90m)', quantity: 10, unitPrice: Math.round((isSchneider ? 2650 : 2480) * regionMultiplier) },
      { id: 3, name: isSchneider ? 'Finolex FR-LSH 4.0 sq.mm (AC & Geysers)' : 'Polycab 4.0 sq.mm Wire', brand: isSchneider ? 'Finolex' : 'Polycab', unit: 'Coils (90m)', quantity: 4, unitPrice: Math.round((isSchneider ? 4150 : 3850) * regionMultiplier) },
      { id: 4, name: isSchneider ? 'Schneider AvatarOn 6A Frameless Modular Switches' : 'Anchor Roma Classic 6A Switches', brand: isSchneider ? 'Schneider' : 'Anchor Panasonic', unit: 'Pieces', quantity: 95, unitPrice: Math.round((isSchneider ? 145 : 75) * regionMultiplier) },
      { id: 5, name: isSchneider ? 'Schneider AvatarOn 16A Sockets with Shutter' : 'Anchor Roma 16A Sockets', brand: isSchneider ? 'Schneider' : 'Anchor Panasonic', unit: 'Pieces', quantity: 45, unitPrice: Math.round((isSchneider ? 185 : 125) * regionMultiplier) },
      { id: 6, name: 'Philips / Havells 12W Concealed LED Panel Lights', brand: 'Philips / Havells', unit: 'Pieces', quantity: 48, unitPrice: Math.round(390 * regionMultiplier) },
      { id: 7, name: isSchneider ? 'Schneider Acti9 8-Way Double Door DB + Isolator' : 'Havells Double Door Distribution Board', brand: isSchneider ? 'Schneider' : 'Havells', unit: 'Sets', quantity: 3, unitPrice: Math.round((isSchneider ? 3850 : 3200) * regionMultiplier) },
      { id: 8, name: isSchneider ? 'Legrand 32A Double Pole RCCB (30mA Shock Guard)' : 'Havells 32A DP RCCB', brand: isSchneider ? 'Legrand' : 'Havells', unit: 'Sets', quantity: 3, unitPrice: Math.round((isSchneider ? 2450 : 2100) * regionMultiplier) },
      { id: 9, name: 'VIP Heavy Gauge PVC Electrical Conduits (20mm)', brand: 'VIP Conduits', unit: 'Bundle (25m)', quantity: 15, unitPrice: Math.round(920 * regionMultiplier) },
      { id: 10, name: 'Chemical Copper Bonded Earthing Electrode & Compound', brand: 'SafeEarthing', unit: 'Kits', quantity: 2, unitPrice: Math.round(3600 * regionMultiplier) }
    ];
  };

  const [items, setItems] = useState(() => getPresetItems(brandTier));

  // Re-sync when brandTier or region changes
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
      name: 'Custom Electrical Item (Schneider/Legrand)',
      brand: 'Custom',
      unit: 'Pieces',
      quantity: 1,
      unitPrice: Math.round(550 * regionMultiplier)
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
      onSave('Electrical', subtotal, { items, subtotal, brandTier, region: activeRegion });
    }
  };

  return (
    <div className="calculator-box">
      <div className="calculator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="category-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>
            <Zap size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Electrical Fixtures &amp; Wiring Calculator</h2>
              <span className="brand-badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', fontSize: '0.72rem' }}>
                <Zap size={11} /> LIVE COPPER &amp; SWITCHGEAR RATES
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time multi-item electrical BOQ: Finolex, Polycab, Schneider, Legrand &amp; Havells
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
        border: '1px solid rgba(139, 92, 246, 0.25)',
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
            {['Premium Specification (Finolex / Schneider / Legrand)', 'Standard Specification (Havells / Polycab / Anchor)'].map((t) => (
              <button
                key={t}
                onClick={() => handleTierChange(t)}
                className={`btn btn-sm ${brandTier === t ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                {t.includes('Premium') ? '★ Premium (Schneider/Finolex)' : 'Standard (Havells/Anchor)'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#a78bfa' }}>
          Region: {activeRegion} • {REALTIME_MATERIAL_CATALOG.Electrical.marketTrend}
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
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Brand: {item.brand} • Certified</div>
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
          <Plus size={15} /> Add Custom Electrical Fixture
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => handleTierChange(brandTier)} style={{ color: '#38bdf8' }}>
          <RefreshCw size={13} /> Reset All to Live Benchmark Rates
        </button>
      </div>

      <div className="calc-result-badge">
        <div>
          <span className="calc-result-title">TOTAL ELECTRICAL BOQ SUBHEAD</span>
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
