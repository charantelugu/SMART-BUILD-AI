import React from 'react';
import {
  DollarSign,
  ArrowLeft,
  FileSpreadsheet,
  Download,
  Bot,
  Sliders,
  CheckCircle2,
  Share2
} from 'lucide-react';
import CostBreakdownChart from '../components/CostBreakdownChart';

export default function CostSummary({
  materialCosts = {},
  setActivePage,
  project
}) {
  const materialsList = [
    { key: 'cement', name: 'Cement', note: 'OPC 53 & PPC Bags' },
    { key: 'steel', name: 'Steel', note: 'Fe 550D TMT Rebars' },
    { key: 'bricks', name: 'Bricks', note: 'Red Kiln & AAC Blocks' },
    { key: 'tiles', name: 'Tiles', note: 'Vitrified & Wall Tiles' },
    { key: 'pipes', name: 'Pipes', note: 'CPVC & SWR Plumbing Runs' },
    { key: 'electrical', name: 'Electrical', note: 'Wiring, Switches & DBs' },
    { key: 'plumbing', name: 'Plumbing', note: 'Fixtures & Sanitaryware' },
    { key: 'paint', name: 'Paint', note: 'Interior & Exterior Emulsions' },
    { key: 'sand', name: 'Sand', note: 'M-Sand & River Sand' },
    { key: 'aggregates', name: 'Aggregates', note: '20mm & 10mm Metal' }
  ];

  const totalMaterialCost = materialsList.reduce((acc, item) => {
    return acc + (Number(materialCosts[item.key]) || 0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Header bar */}
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
            onClick={() => setActivePage('cost-estimator')}
            style={{ marginBottom: '12px' }}
          >
            <ArrowLeft size={16} /> Back to Calculators
          </button>
          <h1 style={{ fontSize: '2.2rem' }}>Comprehensive Cost Summary</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Consolidated material bill of quantities (BOQ) and visual budget allocation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Download size={16} /> Export / Print BOQ
          </button>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setActivePage('ai-assistant')}
          >
            <Bot size={16} /> Ask AI to Optimize
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Table representation matching exact spec */}
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
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '1.2rem' }}>Material Cost Sheet</h3>
            <span className="brand-badge">INR (₹)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {materialsList.map((item) => {
              const amount = Number(materialCosts[item.key]) || 0;
              const percentage = totalMaterialCost > 0
                ? ((amount / totalMaterialCost) * 100).toFixed(1)
                : 0;

              return (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {item.note}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      ₹{amount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {percentage}% of materials
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TOTAL MATERIAL COST Banner */}
          <div style={{
            marginTop: '24px',
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(16, 185, 129, 0.18) 100%)',
            border: '2px solid rgba(37, 99, 235, 0.4)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                TOTAL MATERIAL COST
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Sum of 10 primary structural &amp; architectural categories
              </div>
            </div>

            <div className="mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-light)' }}>
              ₹{totalMaterialCost.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActivePage('plan-my-house')}
              style={{ width: '100%' }}
            >
              Continue to Complete House Planning
            </button>
          </div>
        </div>

        {/* Visual Chart.js Breakdown Component */}
        <div>
          <CostBreakdownChart
            breakdown={materialCosts}
            totalCost={totalMaterialCost}
          />

          {/* Quick Insights Card */}
          <div style={{
            marginTop: '24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="var(--success)" /> Procurement Insights
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>
                🔹 <strong>Steel &amp; Cement Dominance:</strong> Accounts for approximately {totalMaterialCost > 0 ? (((materialCosts.steel + materialCosts.cement) / totalMaterialCost) * 100).toFixed(0) : 0}% of your total material expenditure. Locking supplier rates early hedges inflation risks.
              </li>
              <li>
                🔹 <strong>Waste Factor:</strong> Tile and aggregate wastage factored at 10% ensures no stoppage during critical casting or tiling schedules.
              </li>
              <li>
                🔹 <strong>Ready for Project Linking:</strong> You can apply these calculated material estimates directly when running the <strong>Plan My House</strong> engine.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
