import React, { useState } from 'react';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Eye,
  Home,
  DollarSign,
  AlertCircle,
  FileCheck,
  Sparkles,
  Layers,
  Palette,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import BlueprintCanvas from '../components/BlueprintCanvas';
import DimensionEditorModal from '../components/DimensionEditorModal';

export default function HousePlanResult({ project, setProject, planData, setActivePage }) {
  const floors = project?.floors || 'G + 1';

  // Initial default dimensions template
  const defaultDimensions = {
    landLength: Number(project?.landLength || 50),
    landWidth: Number(project?.landWidth || 30),
    roadWidth: Number(project?.roadWidth || 30),
    frontSetback: 5,
    rearSetback: 3,
    sideSetback: 3,
    livingRoom: { name: 'Formal Living Room', length: 18, width: 14, zone: 'North-East / East', desc: 'Double height with natural morning light cross-ventilation.' },
    masterBedroom: { name: 'Master Bedroom', length: 16, width: 14, zone: 'South-West (Nairuthi)', desc: 'Ensuite bath and walk-in wardrobe area.' },
    kitchen: { name: 'Modular Kitchen', length: 11, width: 12, zone: 'South-East (Agni)', desc: 'Direct access to utility yard and drying balcony.' },
    poojaRoom: { name: 'Pooja Sacred Room', length: 6, width: 8, zone: 'North-East (Ishanya)', desc: 'Spiritual quiet zone segregated from plumbing lines.' },
    diningRoom: { name: 'Central Dining Hall', length: 14, width: 12, zone: 'East / Central', desc: 'Adjacent to kitchen with view of light court.' },
    carPorch: { name: 'Covered Car Porch', length: 14, width: 16, zone: 'North-West / North', desc: 'Direct driveway access with concealed ceiling spotlights.' },
    ensuiteBath: { name: 'Ensuite Attached Bath', length: 8, width: 6, zone: 'West / SW', desc: 'Waterproof door and splash clearance.' },
    familyLounge: { name: 'Upper Family Lounge', length: 16, width: 14, zone: 'Central' },
    bedroom2: { name: 'Bedroom 2 (Suite)', length: 15, width: 13, zone: 'North / NW' },
    bedroom3: { name: 'Bedroom 3 / Study', length: 14, width: 13, zone: 'South / SE' },
    balcony: { name: 'Cantilevered Deck / Balcony', length: 28, width: 8, zone: 'Front Facade' }
  };

  const [customDimensions, setCustomDimensions] = useState(() => project?.customDimensions || defaultDimensions);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Dynamic plot and built-up area calculations
  const plotArea = Number(customDimensions.landLength || project?.landLength || 50) * Number(customDimensions.landWidth || project?.landWidth || 30);
  const multiplier = floors === 'Ground Floor' ? 0.75 : floors === 'G + 1' ? 1.45 : floors === 'G + 2' ? 2.15 : 2.85;
  const builtUpArea = customDimensions.calculatedBuiltUpArea || project?.customBuiltUpArea || Math.round(plotArea * multiplier);

  // Save handler from dimension editor
  const handleSaveDimensions = (newDims) => {
    setCustomDimensions(newDims);
    if (setProject) {
      setProject((prev) => {
        const updated = {
          ...prev,
          landLength: newDims.landLength,
          landWidth: newDims.landWidth,
          landArea: Number(newDims.landLength) * Number(newDims.landWidth),
          roadWidth: newDims.roadWidth,
          customDimensions: newDims,
          customBuiltUpArea: newDims.calculatedBuiltUpArea
        };
        try {
          localStorage.setItem('smartbuild_project', JSON.stringify(updated));
        } catch (e) {
          console.warn('Storage save ignored', e);
        }
        return updated;
      });
    }
  };

  return (
    <div>
      {/* Dimension Editor Modal */}
      <DimensionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialDimensions={customDimensions}
        onSave={handleSaveDimensions}
        floors={floors}
      />

      {/* Top action header */}
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
            onClick={() => setActivePage('plan-my-house')}
            style={{ marginBottom: '10px' }}
          >
            <ArrowLeft size={16} /> Edit Plot Parameters
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-badge">2D SCHEMATIC GENERATED</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI-Engineered Spatial Distribution</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Conceptual House Plan Result</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Optimized for {project?.facing || 'North-East'} facing, National Building Code setbacks, and Vastu zoning
          </p>
        </div>

        {/* Action Buttons to Next Modules */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setIsEditorOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders size={16} /> NUMERIC TUNER (OR DRAG PLAN)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('exterior-design')}
          >
            <Home size={16} /> GENERATE EXTERIOR
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('interior-design')}
          >
            <Palette size={16} /> GENERATE INTERIOR
          </button>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setActivePage('house-cost-estimate')}
          >
            <DollarSign size={16} /> ESTIMATE PROJECT COST
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Label from Prompt */}
      <div className="disclaimer-badge">
        <AlertCircle size={22} style={{ flexShrink: 0 }} />
        <div>
          <strong>IMPORTANT NOTICE:</strong> This generated floor-plan is a <strong>conceptual planning aid</strong>. It is not a construction-ready architectural or structural drawing. Prior to building, engage a licensed civil engineer or architect for structural load calculations and municipal building sanctions.
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Plot Dimensions</span>
            <button
              onClick={() => setIsEditorOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Edit ✎
            </button>
          </div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
            {customDimensions.landLength}′ × {customDimensions.landWidth}′
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Plot: {plotArea} sq.ft</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Built-up Area</div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-light)', marginTop: '4px' }}>
            {builtUpArea.toLocaleString()} SQ.FT
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{floors} Construction</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Orientation &amp; Frontage</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-light)', marginTop: '4px' }}>
            {project?.facing || 'North-East'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{customDimensions.roadWidth || 30} ft Front Road</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Quality</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
            {project?.constructionQuality || 'Standard'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Style: {project?.designStyle || 'Modern'}</div>
        </div>
      </div>

      {/* 2D Architectural Blueprint with Touch & Mouse Direct Dragging */}
      <BlueprintCanvas
        project={project}
        planData={planData}
        customDimensions={customDimensions}
        onDimensionsChange={handleSaveDimensions}
        onOpenDimensionEditor={() => setIsEditorOpen(true)}
      />

      {/* Room Spatial Allocations */}
      <div style={{
        marginTop: '28px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Zoning &amp; Room Allocations</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Dynamic room dimensions updated live from the architectural tuner
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsEditorOpen(true)}
            style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders size={14} /> Adjust Room Sizes
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {[
            {
              zone: customDimensions.livingRoom.name || 'Living Room',
              dim: `${customDimensions.livingRoom.length}′ × ${customDimensions.livingRoom.width}′ (${customDimensions.livingRoom.length * customDimensions.livingRoom.width} sq.ft)`,
              vastu: customDimensions.livingRoom.zone || 'North-East / East',
              desc: customDimensions.livingRoom.desc || 'Double height with natural morning light cross-ventilation.'
            },
            {
              zone: customDimensions.masterBedroom.name || 'Master Bedroom',
              dim: `${customDimensions.masterBedroom.length}′ × ${customDimensions.masterBedroom.width}′ (${customDimensions.masterBedroom.length * customDimensions.masterBedroom.width} sq.ft)`,
              vastu: customDimensions.masterBedroom.zone || 'South-West (Nairuthi)',
              desc: customDimensions.masterBedroom.desc || 'Ensuite bath and walk-in wardrobe area.'
            },
            {
              zone: customDimensions.kitchen.name || 'Modular Kitchen',
              dim: `${customDimensions.kitchen.length}′ × ${customDimensions.kitchen.width}′ (${customDimensions.kitchen.length * customDimensions.kitchen.width} sq.ft)`,
              vastu: customDimensions.kitchen.zone || 'South-East (Agni)',
              desc: customDimensions.kitchen.desc || 'Direct access to utility yard and drying balcony.'
            },
            {
              zone: customDimensions.poojaRoom.name || 'Pooja Room',
              dim: `${customDimensions.poojaRoom.length}′ × ${customDimensions.poojaRoom.width}′ (${customDimensions.poojaRoom.length * customDimensions.poojaRoom.width} sq.ft)`,
              vastu: customDimensions.poojaRoom.zone || 'North-East (Ishanya)',
              desc: customDimensions.poojaRoom.desc || 'Spiritual quiet zone segregated from plumbing lines.'
            },
            {
              zone: customDimensions.diningRoom.name || 'Dining Area',
              dim: `${customDimensions.diningRoom.length}′ × ${customDimensions.diningRoom.width}′ (${customDimensions.diningRoom.length * customDimensions.diningRoom.width} sq.ft)`,
              vastu: customDimensions.diningRoom.zone || 'East / Central',
              desc: customDimensions.diningRoom.desc || 'Adjacent to kitchen with direct view of light court.'
            },
            {
              zone: customDimensions.carPorch.name || 'Covered Car Porch',
              dim: `${customDimensions.carPorch.length}′ × ${customDimensions.carPorch.width}′ (${customDimensions.carPorch.length * customDimensions.carPorch.width} sq.ft)`,
              vastu: customDimensions.carPorch.zone || 'North-West / North',
              desc: customDimensions.carPorch.desc || 'Direct driveway access with concealed ceiling spotlights.'
            }
          ].map((z, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{z.zone}</strong>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--accent-light)', fontWeight: 600 }}>{z.dim}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)', marginBottom: '4px' }}>
                Vastu: {z.vastu}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {z.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Door Placement & Circulation Access Guide */}
      <div style={{
        marginTop: '28px',
        background: 'var(--bg-card)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--accent-light)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              DOOR SPECIFICATION
            </span>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Door Placements &amp; Entry Circulation</h3>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Visible in 2D Blueprint with CAD swing arcs &amp; labels
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderLeft: '4px solid #f59e0b',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ color: '#fbbf24', fontSize: '1.05rem' }}>🚪 D1: Main Entrance Door</strong>
              <span className="brand-badge" style={{ background: '#b45309', color: '#fff' }}>3′6″ × 7′0″</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              <strong>Location:</strong> Front facade right of the Car Porch, opening directly into the formal Living Foyer.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Vastu Rule:</strong> Located in the auspicious 3rd/4th pada (Jayanta/Indra), opening clockwise inward with a raised threshold (Ummar).
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderLeft: '4px solid #10b981',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>🚪 D2: Master &amp; Guest Bedrooms</strong>
              <span className="brand-badge" style={{ background: '#065f46', color: '#fff' }}>3′0″ × 7′0″</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              <strong>Location:</strong> North-East partition wall accessed via dining central hallway.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Circulation Rule:</strong> Swings against the adjacent wall for privacy, preventing direct outside sightlines to the bed.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(45, 212, 191, 0.25)',
            borderLeft: '4px solid #14b8a6',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ color: '#2dd4bf', fontSize: '1.05rem' }}>🚪 D3: Ensuite Attached Bathroom</strong>
              <span className="brand-badge" style={{ background: '#134e4a', color: '#fff' }}>2′6″ × 7′0″</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              <strong>Location:</strong> Rear corner wall of Master Suite with waterproof threshold.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Material Spec:</strong> Water-resistant PVC / FRP laminated shutter opening inward against the plumbing wet wall.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(192, 132, 252, 0.25)',
            borderLeft: '4px solid #a855f7',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ color: '#c084fc', fontSize: '1.05rem' }}>🚪 D4: Kitchen Dining Arch / Slider</strong>
              <span className="brand-badge" style={{ background: '#581c87', color: '#fff' }}>3′0″ × 7′0″</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              <strong>Location:</strong> Connecting the central Dining Area directly into South-East (Agni) Kitchen.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Design:</strong> Wide clear passage or pocket fluted glass slider to prevent kitchen aromas while dining.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderLeft: '4px solid #b45309',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ color: '#fbbf24', fontSize: '1.05rem' }}>🚪 D5: Pooja Sacred Double Door</strong>
              <span className="brand-badge" style={{ background: '#78350f', color: '#fff' }}>2′6″ × 7′0″</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              <strong>Location:</strong> West facing shutter in North-East (Ishanya) corner prayer room.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Design:</strong> Traditional two-shutter carved wooden door opening inward with brass lattice work.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderLeft: '4px solid #059669',
            borderRadius: 'var(--radius-sm)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>🚪 D6: Upper Floor Balcony Slider</strong>
              <span className="brand-badge" style={{ background: '#064e3b', color: '#fff' }}>6′0″ × 7′0″</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              <strong>Location:</strong> Upper Family Lounge front opening onto 28′ × 8′ cantilevered viewing deck.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Design:</strong> Heavy-duty UPVC sliding glass with safety tempered glass and insect mesh.
            </p>
          </div>
        </div>
      </div>

      {/* Next Step Nav Banner */}
      <div style={{
        marginTop: '32px',
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Ready to view visual elevations and costs?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Generate 3D exterior concepts, room interiors, or proceed to automatic cost estimation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setActivePage('exterior-design')}>
            <Home size={18} /> GENERATE EXTERIOR
          </button>
          <button className="btn btn-accent" onClick={() => setActivePage('house-cost-estimate')}>
            ESTIMATE COST &amp; BUDGET <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
