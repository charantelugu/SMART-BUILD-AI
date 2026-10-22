import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  FileText,
  Sliders,
  CheckCircle2,
  HardHat,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { estimateService } from '../services/api';
import CostBreakdownChart from '../components/CostBreakdownChart';

export default function HouseCostEstimate({ project, setActivePage, setEstimateData }) {
  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState(null);

  const plotArea = (project?.landLength || 50) * (project?.landWidth || 30);
  const floors = project?.floors || 'G + 1';
  const multiplier = floors === 'Ground Floor' ? 0.75 : floors === 'G + 1' ? 1.45 : floors === 'G + 2' ? 2.15 : 2.85;
  const builtUpArea = project?.customBuiltUpArea || Math.round(plotArea * multiplier);

  useEffect(() => {
    async function calculate() {
      setLoading(true);
      try {
        const payload = {
          landArea: plotArea,
          builtUpArea,
          floors,
          constructionQuality: project?.constructionQuality || 'Standard',
          interiorBudget: project?.interiorBudget || 850000,
          roomCounts: project?.requirements || {}
        };
        const result = await estimateService.calculateCostEstimate(payload);
        setEstimate(result);
        if (setEstimateData) setEstimateData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    calculate();
  }, [project]);

  if (loading || !estimate) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <Sparkles size={36} className="animate-spin" color="var(--primary-light)" style={{ margin: '0 auto 16px' }} />
        <h2>Calculating Automated House Cost Estimate...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Aggregating civil materials, labour thumb-rules, and finishes.</p>
      </div>
    );
  }

  const { breakdown, totalMaterialCost, totalEstimatedCost } = estimate;

  // Complete list required by Section 14
  const costLines = [
    { name: 'Cement', cost: breakdown.cement, category: 'Material', desc: 'OPC 53 RCC casting & PPC plastering' },
    { name: 'Steel', cost: breakdown.steel, category: 'Material', desc: 'Fe 550D High-Ductility TMT Rebars' },
    { name: 'Bricks', cost: breakdown.bricks, category: 'Material', desc: 'Kiln burned clay & lightweight AAC blocks' },
    { name: 'Tiles', cost: breakdown.tiles, category: 'Material', desc: 'Double charge vitrified & anti-skid tiles' },
    { name: 'Pipes', cost: breakdown.pipes, category: 'Material', desc: 'CPVC internal & SWR drainage piping' },
    { name: 'Electrical', cost: breakdown.electrical, category: 'Material', desc: 'FR-LSH copper wires, modular switches & DBs' },
    { name: 'Plumbing', cost: breakdown.plumbing, category: 'Material', desc: 'Chrome plated fittings, EWCs & overhead tank' },
    { name: 'Paint', cost: breakdown.paint, category: 'Material', desc: 'Acrylic primer, wall putty & luxury emulsions' },
    { name: 'Sand', cost: breakdown.sand, category: 'Material', desc: 'Zone-II M-Sand for concrete & fine plastering sand' },
    { name: 'Aggregates', cost: breakdown.aggregates, category: 'Material', desc: '20mm & 10mm crushed blue granite metal' },
    { name: 'Labour', cost: breakdown.labour, category: 'Execution', desc: 'Shuttering, bar bending, masonry & casting labour' },
    { name: 'Doors/Windows', cost: breakdown.doorsWindows, category: 'Joinery', desc: 'Flush teak-finish doors & UPVC safety glass windows' },
    { name: 'Interior', cost: breakdown.interior, category: 'Finishes', desc: 'Modular kitchen, wardrobes & false ceiling' },
    { name: 'Other costs', cost: breakdown.otherCosts, category: 'Contingency', desc: 'Soil testing, water curing, electricity & logistics' }
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setActivePage('house-plan-result')}
            style={{ marginBottom: '10px' }}
          >
            <ArrowLeft size={16} /> Back to House Plan
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-badge">AUTOMATED THUMB-RULE ESTIMATION</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>IS-456 Civil Engineering Model</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Automatic House Cost Estimation</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Complete itemized expenditure for {builtUpArea.toLocaleString()} sq.ft built-up area • Quality: {project?.constructionQuality || 'Standard'}
          </p>
        </div>

        <button
          className="btn btn-accent"
          onClick={() => setActivePage('budget-comparison')}
        >
          Compare With Your Budget <ArrowRight size={18} />
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Full 14-Item List */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '14px',
            marginBottom: '18px'
          }}>
            <h3 style={{ fontSize: '1.2rem' }}>Itemized Cost Breakdown</h3>
            <span className="brand-badge">₹ INR</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {costLines.map((item, idx) => {
              const isMaterial = item.category === 'Material';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: isMaterial ? 'rgba(255, 255, 255, 0.02)' : 'rgba(37, 99, 235, 0.05)',
                    border: `1px solid ${isMaterial ? 'rgba(255, 255, 255, 0.04)' : 'rgba(37, 99, 235, 0.2)'}`
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</span>
                      {!isMaterial && (
                        <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '4px' }}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.desc}</div>
                  </div>

                  <div className="mono" style={{ fontWeight: 700, fontSize: '1.05rem', color: isMaterial ? 'var(--text-main)' : 'var(--accent-light)' }}>
                    ₹{item.cost.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotals & TOTAL ESTIMATED COST */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Subtotal Materials (10 Categories):</span>
              <span className="mono" style={{ fontWeight: 600 }}>₹{totalMaterialCost.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Labour, Finishes &amp; Contingency:</span>
              <span className="mono" style={{ fontWeight: 600 }}>₹{(totalEstimatedCost - totalMaterialCost).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Prominent TOTAL ESTIMATED COST */}
          <div style={{
            marginTop: '20px',
            padding: '22px 24px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                TOTAL ESTIMATED COST
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Rate: ~₹{Math.round(totalEstimatedCost / builtUpArea)} / sq.ft built-up
              </div>
            </div>

            <div className="mono" style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--accent-light)' }}>
              ₹{totalEstimatedCost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Visual Charts & Budget Comparison Trigger */}
        <div>
          <CostBreakdownChart
            breakdown={breakdown}
            totalCost={totalMaterialCost}
          />

          <div style={{
            marginTop: '24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Budget Health Check</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Your Target Budget:</span>
              <strong className="mono">₹{Number(project?.budget || 5500000).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Estimated Cost:</span>
              <strong className="mono" style={{ color: 'var(--accent-light)' }}>₹{totalEstimatedCost.toLocaleString('en-IN')}</strong>
            </div>

            <button
              className="btn btn-accent"
              onClick={() => setActivePage('budget-comparison')}
              style={{ width: '100%' }}
            >
              Go to Budget Comparison &amp; Optimization Engine <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
