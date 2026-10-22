import React from 'react';
import {
  Bot,
  Calculator,
  Compass,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function Home({ setActivePage, project, totalMaterialCost }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} /> Next-Gen Architectural Planning &amp; Estimation
        </div>

        <h1 className="hero-title">
          SMART BUILD <span className="hero-title-highlight">AI</span>
        </h1>

        <p className="hero-subtitle">
          "AI-Powered House Planning &amp; Construction Cost Management"
        </p>

        {/* Active Project Info Strip */}
        <div style={{
          maxWidth: '780px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Active Workspace:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {project?.projectName || 'Custom Villa'} ({project?.landLength || 50}′ × {project?.landWidth || 30}′)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Target: <strong style={{ color: 'var(--accent-light)' }}>₹{(Number(project?.budget || 5500000) / 100000).toFixed(1)}L</strong></span>
            <span style={{ color: 'var(--text-dim)' }}>Material BOQ: <strong className="mono" style={{ color: 'var(--primary-light)' }}>₹{totalMaterialCost.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>
      </section>

      {/* Exactly THREE Main Buttons/Cards as required by Section 1 */}
      <section className="main-actions-grid">
        {/* CARD 1: AI ASSISTANT */}
        <div
          className="action-card card-ai"
          onClick={() => setActivePage('ai-assistant')}
        >
          <div>
            <div className="card-icon-wrapper">
              <Bot size={32} />
            </div>

            <div className="card-title">
              <span>🤖 AI ASSISTANT</span>
              <ArrowRight size={20} color="var(--primary-light)" />
            </div>

            <p className="card-desc">
              Consult your real-time construction advisor for civil engineering codes, structural thumb-rules, material consumption, Vastu alignment, and project cost strategies grounded directly in your active project.
            </p>
          </div>

          <button
            className="card-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActivePage('ai-assistant');
            }}
          >
            Launch AI Assistant <ArrowRight size={18} />
          </button>
        </div>

        {/* CARD 2: COST ESTIMATOR */}
        <div
          className="action-card card-cost"
          onClick={() => setActivePage('cost-estimator')}
        >
          <div>
            <div className="card-icon-wrapper">
              <Calculator size={32} />
            </div>

            <div className="card-title">
              <span>💰 COST ESTIMATOR</span>
              <ArrowRight size={20} color="var(--success)" />
            </div>

            <p className="card-desc">
              Access 10 dedicated material calculators across Cement, Steel, Bricks, Tiles, Pipes, Electrical, Plumbing, Paint, Sand &amp; Aggregates with live supplier prices and interactive cost charts.
            </p>
          </div>

          <button
            className="card-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActivePage('cost-estimator');
            }}
          >
            Open Cost Estimator <ArrowRight size={18} />
          </button>
        </div>

        {/* CARD 3: PLAN MY HOUSE */}
        <div
          className="action-card card-plan"
          onClick={() => setActivePage('plan-my-house')}
        >
          <div>
            <div className="card-icon-wrapper">
              <Compass size={32} />
            </div>

            <div className="card-title">
              <span>📷 PLAN MY HOUSE</span>
              <ArrowRight size={20} color="var(--accent-light)" />
            </div>

            <p className="card-desc">
              Upload or capture land imagery, configure plot dimensions, floors, rooms, and budget to generate interactive 2D conceptual floor plans, 3D exterior concepts, room interiors, and value-engineered budget savings.
            </p>
          </div>

          <button
            className="card-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActivePage('plan-my-house');
            }}
          >
            Start Planning My House <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{
        margin: '40px 0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Cpu size={20} color="var(--primary-light)" />
            <h4 style={{ fontSize: '1rem' }}>Spring Boot &amp; MySQL</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Enterprise REST backend with dynamic material price tracking, multi-project persistence, and schema integrity.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldCheck size={20} color="var(--success)" />
            <h4 style={{ fontSize: '1rem' }}>IS-456 Thumb-Rules</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Engineered ratios for Fe550 rebar tonnages, M20 grade concrete bags, and wall masonry areas.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <TrendingUp size={20} color="var(--accent-light)" />
            <h4 style={{ fontSize: '1rem' }}>Value Engineering</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Interactive budget optimization suggesting high-ROI material switches to keep projects strictly within budget.
          </p>
        </div>
      </section>
    </div>
  );
}
