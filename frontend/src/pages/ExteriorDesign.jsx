import React, { useState } from 'react';
import {
  Home,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Palette,
  Compass,
  Layers,
  ShieldCheck
} from 'lucide-react';
import ArchitecturalVisualizer from '../components/ArchitecturalVisualizer';

export default function ExteriorDesign({ project, setActivePage }) {
  const [activeStyle, setActiveStyle] = useState(project?.exteriorStyle || project?.designStyle || 'Modern');
  const [activeFloors, setActiveFloors] = useState(project?.floors || 'G + 3');
  const [lightingMode, setLightingMode] = useState('Daylight');
  const [loading, setLoading] = useState(false);

  const quality = project?.constructionQuality || 'Standard';

  const handleStyleChange = (st) => {
    setActiveStyle(st);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  const handleFloorsChange = (fl) => {
    setActiveFloors(fl);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const styleSpecs = {
    Modern: {
      tag: 'CUBIC & CANTILEVERED VOLUMES',
      desc: 'Clean horizontal geometry with staggered upper-floor projections and composite timber louvers.',
      features: [
        { title: 'Cantilevered Living Projection', desc: `Staggered upper cube extending 1.2m outward, creating natural shade below for ${activeFloors}.` },
        { title: 'Architectural Timber Louver Screen', desc: 'Vertical treated composite louvers providing solar heat reduction and natural ventilation.' },
        { title: 'Panoramic Curtain Wall Glazing', desc: 'High-performance solar low-E coated glass with realistic frames and mullions maximizing natural daylight.' },
        { title: 'Integrated Carport & Grand Entrance Door', desc: 'Solid teakwood pivot main door with stainless pull handle, canopy downlighting, and SUV carport.' }
      ]
    },
    Traditional: {
      tag: 'HERITAGE VEDIC & SLOPED ROOF',
      desc: 'Authentic sloped Mangalore terracotta tiled roofs, carved teakwood verandah pillars, and raised plinth.',
      features: [
        { title: 'Sloped Mangalore Clay Tiled Roof', desc: 'Authentic 35° pitched terracotta roof for rapid monsoon drainage and passive cooling.' },
        { title: 'Carved Teakwood Verandah Pillars', desc: 'Hand-fluted solid timber columns resting on chiseled stone plinth pedestals.' },
        { title: 'Raised Verandah Plinth (Thinnai)', desc: 'Comfortable semi-outdoor shaded seating plinth keeping internal living rooms cool.' },
        { title: 'Courtyard Brass Temple Lamp', desc: 'Hand-crafted traditional brass Kuthuvilakku set in stone-paved entrance walkway.' }
      ]
    },
    Minimalist: {
      tag: 'MONOLITHIC CONCRETE & FLUSH GLASS',
      desc: 'Pure intersecting cubic planes in raw concrete and off-white stucco with zero unnecessary ornamentation.',
      features: [
        { title: 'Monolithic Geometric Massing', desc: 'Sharp intersecting volumes in board-marked concrete and smooth white lime wash.' },
        { title: 'Frameless Panoramic Glass Apertures', desc: 'Flush floor-to-ceiling glass panes with concealed sub-frame architectural tracks.' },
        { title: 'Recessed Entrance Niche', desc: 'Concealed security doorway with vertical architectural warm LED wall wash illumination.' },
        { title: 'Zen Basalt & Gravel Planter', desc: 'Minimalist drought-resistant landscape bed with stepping stone walkways.' }
      ]
    },
    Contemporary: {
      tag: 'DYNAMIC ANGLED ROOFS & SLATE STONE',
      desc: 'Striking asymmetrical mono-pitch roofline with double-height natural split-face stone cladding tower.',
      features: [
        { title: 'Asymmetric Mono-Pitch Roofline', desc: 'Dynamic angled roof plane optimized for rooftop solar panel orientation and rainwater harvesting.' },
        { title: 'Double-Height Slate Stone Tower', desc: 'Natural split-face rough-hewn stone masonry providing rugged textural contrast.' },
        { title: 'Black Steel & Timber Trellis Pergola', desc: 'Heavy-duty powder-coated steel pergola with warm natural wood slats over terrace.' },
        { title: 'Cantilevered Frameless Glass Balconies', desc: 'Toughened laminated safety glass balustrades with continuous bottom shoe track.' }
      ]
    },
    Luxury: {
      tag: 'GRAND NEOCLASSICAL VILLA & PORTICO',
      desc: 'Majestic classical symmetry with double-height Corinthian columns, pediments, and fountain courtyard.',
      features: [
        { title: 'Grand Double-Height Entrance Portico', desc: 'Majestic monumental portico supported by four stately classical fluted columns.' },
        { title: 'Carved Classical Pediment & Cornices', desc: 'Artisanal architectural cornice moldings, friezes, and decorative window keystones.' },
        { title: 'Travertine Italian Marble Cladding', desc: 'Weatherproof high-density Italian travertine wall cladding meeting luxury specifications.' },
        { title: 'Circular Courtyard Fountain', desc: 'Paved cobblestone driveway encircling a tiered illuminated natural stone water fountain.' }
      ]
    }
  }[activeStyle] || {
    tag: 'CUSTOM ELEVATION',
    desc: 'Architectural 3D elevation tailored to your plot dimensions and floor requirements.',
    features: []
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setActivePage('house-plan-result')}
            style={{ marginBottom: '10px' }}
          >
            <ArrowLeft size={16} /> Back to Floor Plan
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-badge">EXTERIOR 3D ELEVATION ENGINE</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interactive 360° Inspection</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Exterior Concept Design</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Rendered for {activeFloors} • <strong style={{ color: 'var(--accent-light)' }}>{activeStyle} Style</strong> • Quality: {quality}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('interior-design')}
          >
            <Palette size={16} /> View 3D Interior Concepts
          </button>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setActivePage('house-cost-estimate')}
          >
            Calculate Project Cost <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar: Style, Floors & Lighting */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Style selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700 }}>STYLE:</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Modern', 'Traditional', 'Minimalist', 'Contemporary', 'Luxury'].map((st) => (
              <button
                key={st}
                onClick={() => handleStyleChange(st)}
                className={`btn btn-sm ${activeStyle === st ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '5px 12px' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Floor switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700 }}>FLOORS:</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Ground Floor', 'G + 1', 'G + 2', 'G + 3'].map((fl) => (
              <button
                key={fl}
                onClick={() => handleFloorsChange(fl)}
                className={`btn btn-sm ${activeFloors === fl ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '5px 10px' }}
              >
                {fl}
              </button>
            ))}
          </div>
        </div>

        {/* Lighting mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700 }}>LIGHTING:</span>
          <button
            className={`btn btn-sm ${lightingMode === 'Daylight' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setLightingMode('Daylight')}
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            <Sun size={13} /> Day
          </button>
          <button
            className={`btn btn-sm ${lightingMode === 'Twilight Accent' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setLightingMode('Twilight Accent')}
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            <Moon size={13} /> Dusk
          </button>
        </div>
      </div>

      {/* Main 3D Architectural Visualizer Canvas Container */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                {styleSpecs.tag}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                360° Rotatable WebGL Model • {activeFloors} Realistic Geometry
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: '6px 0 0' }}>
              {styleSpecs.desc}
            </p>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            * Drag with mouse/touch to orbit 360° • Scroll/pinch to zoom • Inspect doors, windows, and balconies
          </div>
        </div>

        {loading ? (
          <div style={{ height: '470px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: '#080f1d', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={32} className="animate-spin" color="var(--primary-light)" />
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Building 3D {activeStyle} ({activeFloors}) Elevation...</span>
          </div>
        ) : (
          <ArchitecturalVisualizer
            type="exterior"
            style={activeStyle}
            floors={activeFloors}
            lighting={lightingMode}
          />
        )}

        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Full 360-degree exterior orbit rendered with NBC setback clearances and IS:875 wind-load structural envelope standards.
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => alert(`${activeStyle} 3D exterior design snapshot downloaded.`)}>
              <Download size={14} /> Download 3D Snapshot
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => alert(`Shareable 3D viewer link generated for this ${activeStyle} design.`)}>
              <Share2 size={14} /> Share 3D View
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Style Architecture Features */}
      <div style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{activeStyle} Architectural Specifications &amp; Envelope Details</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {styleSpecs.features.map((feat, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} color="var(--accent-light)" />
                <h4 style={{ fontSize: '1rem', margin: 0 }}>{feat.title}</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
