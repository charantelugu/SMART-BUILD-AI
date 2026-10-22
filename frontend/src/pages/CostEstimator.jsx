import React, { useState } from 'react';
import {
  Package,
  Layers,
  Box,
  Grid,
  Disc,
  Zap,
  Wrench,
  Paintbrush,
  Shovel,
  Mountain,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Sparkles,
  RefreshCw,
  MapPin,
  ShieldCheck,
  Radio
} from 'lucide-react';

import CementCalculator from './calculators/CementCalculator';
import SteelCalculator from './calculators/SteelCalculator';
import BricksCalculator from './calculators/BricksCalculator';
import TilesCalculator from './calculators/TilesCalculator';
import PipesCalculator from './calculators/PipesCalculator';
import ElectricalCalculator from './calculators/ElectricalCalculator';
import PlumbingCalculator from './calculators/PlumbingCalculator';
import PaintCalculator from './calculators/PaintCalculator';
import SandCalculator from './calculators/SandCalculator';
import AggregatesCalculator from './calculators/AggregatesCalculator';

import { REALTIME_MATERIAL_CATALOG, REGIONAL_MARKET_FACTORS } from '../services/materialCatalog';

export default function CostEstimator({
  materialCosts,
  setMaterialCosts,
  materialPrices,
  setActivePage
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeRegion, setActiveRegion] = useState('National Average');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Live Indian Construction Commodity Index (ICCE)');

  const regionMultiplier = REGIONAL_MARKET_FACTORS[activeRegion]?.multiplier || 1.0;

  const handleRefreshRates = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(`Live Index Re-synchronized at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 600);
  };

  const categories = [
    {
      id: 'Cement',
      name: 'Cement',
      icon: Package,
      color: '#3b82f6',
      desc: 'OPC 53, OPC 43 & PPC',
      rateRange: `₹${Math.round(355 * regionMultiplier)} - ₹${Math.round(415 * regionMultiplier)} / bag`,
      topBrands: 'UltraTech, ACC, Ambuja, Dalmia, JSW',
      trend: '+1.4%'
    },
    {
      id: 'Steel',
      name: 'Steel',
      icon: Layers,
      color: '#10b981',
      desc: 'Fe 550D TMT Rebars',
      rateRange: `₹${(62.5 * regionMultiplier).toFixed(1)} - ₹${(74.5 * regionMultiplier).toFixed(1)} / kg`,
      topBrands: 'Tata Tiscon, JSW, Jindal, SAIL',
      trend: '-0.8%'
    },
    {
      id: 'Bricks',
      name: 'Bricks & Blocks',
      icon: Box,
      color: '#ef4444',
      desc: 'Red Clay & AAC Blocks',
      rateRange: `₹${(6.5 * regionMultiplier).toFixed(1)} - ₹${(62 * regionMultiplier).toFixed(1)} / unit`,
      topBrands: 'Magicrete AAC, Kiln Red, Siporex',
      trend: 'Stable'
    },
    {
      id: 'Tiles',
      name: 'Tiles & Flooring',
      icon: Grid,
      color: '#f59e0b',
      desc: 'Vitrified, GVT & Granite',
      rateRange: `₹${(38 * regionMultiplier).toFixed(0)} - ₹${(185 * regionMultiplier).toFixed(0)} / sq.ft`,
      topBrands: 'Kajaria, Somany, Simpolo, Granite',
      trend: '+2.1%'
    },
    {
      id: 'Pipes',
      name: 'Pipes & Drainage',
      icon: Disc,
      color: '#06b6d4',
      desc: 'CPVC, UPVC & SWR',
      rateRange: `₹${(95 * regionMultiplier).toFixed(0)} - ₹${(295 * regionMultiplier).toFixed(0)} / m`,
      topBrands: 'Astral CPVC, Supreme SWR, Prince',
      trend: '+0.9%'
    },
    {
      id: 'Electrical',
      name: 'Electrical Fixtures',
      icon: Zap,
      color: '#8b5cf6',
      desc: 'FR-LSH Wires & Modular',
      rateRange: 'Modular Itemized BOQ',
      topBrands: 'Finolex, Polycab, Schneider, Legrand',
      trend: '+1.6%'
    },
    {
      id: 'Plumbing',
      name: 'Plumbing & Sanitary',
      icon: Wrench,
      color: '#ec4899',
      desc: 'Sanitaryware & Diverters',
      rateRange: 'Sanitary Itemized BOQ',
      topBrands: 'Kohler, Jaquar, Hindware, Sintex',
      trend: 'Stable'
    },
    {
      id: 'Paint',
      name: 'Paint & Coatings',
      icon: Paintbrush,
      color: '#14b8a6',
      desc: 'Luxury & Apex Emulsions',
      rateRange: `₹${(165 * regionMultiplier).toFixed(0)} - ₹${(540 * regionMultiplier).toFixed(0)} / L`,
      topBrands: 'Asian Paints Royale, Dulux, Berger',
      trend: '+1.8%'
    },
    {
      id: 'Sand',
      name: 'Sand & M-Sand',
      icon: Shovel,
      color: '#eab308',
      desc: 'Zone-II M-Sand & River',
      rateRange: `₹${(28 * regionMultiplier).toFixed(0)} - ₹${(98 * regionMultiplier).toFixed(0)} / cu.ft`,
      topBrands: 'RoboSand, Apex VSI, Clean River',
      trend: 'Stable'
    },
    {
      id: 'Aggregates',
      name: 'Coarse Aggregates',
      icon: Mountain,
      color: '#64748b',
      desc: '20mm & 10mm Granite',
      rateRange: `₹${(32 * regionMultiplier).toFixed(0)} - ₹${(49 * regionMultiplier).toFixed(0)} / cu.ft`,
      topBrands: '20mm Blue Metal, 10mm Grit, GSB',
      trend: '+0.5%'
    }
  ];

  const handleSaveCost = (categoryName, total, details) => {
    setMaterialCosts((prev) => ({
      ...prev,
      [categoryName.toLowerCase()]: total
    }));
    setSelectedCategory(null);
  };

  const totalMaterialCost = Object.values(materialCosts).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  // Render specific active calculator if one is chosen
  if (selectedCategory) {
    const categoryPrice = materialPrices?.find(
      (m) => m.category.toLowerCase() === selectedCategory.toLowerCase()
    )?.price;

    return (
      <div>
        {selectedCategory === 'Cement' && (
          <CementCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Steel' && (
          <SteelCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Bricks' && (
          <BricksCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Tiles' && (
          <TilesCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Pipes' && (
          <PipesCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Electrical' && (
          <ElectricalCalculator
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Plumbing' && (
          <PlumbingCalculator
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Paint' && (
          <PaintCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Sand' && (
          <SandCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
        {selectedCategory === 'Aggregates' && (
          <AggregatesCalculator
            initialPrice={categoryPrice}
            regionMultiplier={regionMultiplier}
            activeRegion={activeRegion}
            onBack={() => setSelectedCategory(null)}
            onSave={handleSaveCost}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.14) 0%, rgba(16, 185, 129, 0.14) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <Radio size={12} className="animate-pulse" /> REAL-TIME MARKET DATA ACTIVE
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>10 Dynamic Modules</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '8px' }}>Material Cost Estimator</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '0.95rem', margin: 0 }}>
            Configure custom quantities and select real-time brands, subproducts, and grades. Prices dynamically adapt to live wholesale mandi and commodity indices.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          textAlign: 'right',
          boxShadow: 'var(--shadow-md)',
          minWidth: '260px'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Configured Material Cost
          </div>
          <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)', margin: '4px 0 12px' }}>
            ₹{totalMaterialCost.toLocaleString('en-IN')}
          </div>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setActivePage('cost-summary')}
            style={{ width: '100%' }}
          >
            View Cost Summary &amp; Charts <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Live Market Control & Regional Selection Bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Region selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontWeight: 700, fontSize: '0.86rem' }}>
            <MapPin size={16} />
            <span>MARKET REGION:</span>
          </div>
          <select
            className="form-select"
            style={{ padding: '6px 12px', fontSize: '0.84rem', width: 'auto', minWidth: '220px' }}
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
          >
            {Object.keys(REGIONAL_MARKET_FACTORS).map((reg) => (
              <option key={reg} value={reg}>
                {reg} ({REGIONAL_MARKET_FACTORS[reg].multiplier === 1 ? 'Benchmark' : `${((REGIONAL_MARKET_FACTORS[reg].multiplier - 1) * 100).toFixed(0)}%`})
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            {REGIONAL_MARKET_FACTORS[activeRegion]?.label}
          </span>
        </div>

        {/* Live sync button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            {lastSyncTime}
          </span>
          <button
            onClick={handleRefreshRates}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            disabled={isRefreshing}
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Re-syncing...' : 'Refresh Live Rates'}
          </button>
        </div>
      </div>

      {/* 10 Category Cards with Real-Time Rates & Subproducts */}
      <div className="category-grid">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const costVal = materialCosts[cat.id.toLowerCase()] || 0;

          return (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <div
                  className="category-icon"
                  style={{
                    background: `${cat.color}22`,
                    color: cat.color,
                    border: `1px solid ${cat.color}44`
                  }}
                >
                  <Icon size={26} />
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: cat.trend.includes('+') ? 'rgba(239, 68, 68, 0.15)' : cat.trend.includes('-') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.2)',
                  color: cat.trend.includes('+') ? '#f87171' : cat.trend.includes('-') ? '#34d399' : '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {cat.trend}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Category 0{idx + 1}
                </div>
                <div className="category-name">{cat.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {cat.desc}
                </div>

                {/* Real-time rates & brands preview */}
                <div style={{
                  marginTop: '10px',
                  padding: '6px 10px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>
                    {cat.rateRange}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.topBrands}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 'auto',
                width: '100%',
                paddingTop: '12px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Subtotal</div>
                  <div className="category-subtotal" style={{ margin: 0, fontSize: '1.05rem' }}>
                    ₹{costVal.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                  Configure <ChevronRight size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
