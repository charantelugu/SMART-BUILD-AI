import React, { useState } from 'react';
import {
  Palette,
  ArrowLeft,
  ArrowRight,
  Sofa,
  Bed,
  Utensils,
  Coffee,
  Bath,
  Briefcase,
  Sparkles,
  Download,
  CheckCircle2,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import ArchitecturalVisualizer from '../components/ArchitecturalVisualizer';

export default function InteriorDesign({ project, setActivePage }) {
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [activeStyle, setActiveStyle] = useState(project?.livingRoomStyle || 'Modern');
  const [lightingMode, setLightingMode] = useState('Warm Ambient');
  const [loading, setLoading] = useState(false);

  const rooms = [
    { id: 'Living Room', name: 'Formal Living Room', icon: Sofa, desc: 'L-sofa, 85" OLED TV & acoustic slat wall' },
    { id: 'Bedroom', name: 'Master Bedroom', icon: Bed, desc: 'King bed, tufted headboard & glass wardrobe' },
    { id: 'Kitchen', name: 'Modular Kitchen', icon: Utensils, desc: 'Quartz counter, induction island & cabinets' },
    { id: 'Dining Room', name: 'Central Dining Hall', icon: Coffee, desc: 'Oak dining table, chandelier & crockery unit' },
    { id: 'Bathroom', name: 'Ensuite Bathroom', icon: Bath, desc: 'Double vanity, LED mirror & glass shower' },
    { id: 'Home Office', name: 'Home Office / Study', icon: Briefcase, desc: 'Executive desk, dual monitors & library' },
    { id: 'Pooja Room', name: 'Pooja Sacred Room', icon: Sparkles, desc: 'Teak Mandir, marble altar & brass lamps' }
  ];

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  const handleStyleSelect = (st) => {
    setActiveStyle(st);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  const interiorSpecs = {
    'Living Room': {
      title: 'Formal Living Room & Media Lounge',
      palette: [
        { name: 'Emerald Velvet', hex: '#047857' },
        { name: 'American Walnut', hex: '#78350f' },
        { name: 'Mustard Gold', hex: '#eab308' },
        { name: 'Sapphire Blue', hex: '#1e40af' },
        { name: 'Calacatta Ivory', hex: '#f8fafc' }
      ],
      flooring: '4×2 ft High-Gloss Calacatta Vitrified Marble tiles with acoustic sapphire-and-gold geometric rug',
      walls: 'Vertical acoustic fluted teakwood slats in warm walnut with concealed golden LED cove and brass trim',
      ceiling: 'Gypsum false ceiling with magnetic track lighting, warm perimeter cove, and brass ring chandelier',
      joinery: '85-inch integrated OLED TV wall panel with floating walnut media console, emerald sofa, and marble coffee table'
    },
    'Bedroom': {
      title: 'Master Bedroom Luxury Suite',
      palette: [
        { name: 'Royal Indigo', hex: '#1e3a8a' },
        { name: 'Honey Herringbone', hex: '#a16207' },
        { name: 'Saffron Terracotta', hex: '#d97706' },
        { name: 'Alabaster Glow', hex: '#fef08a' },
        { name: 'Egyptian Linen', hex: '#f8fafc' }
      ],
      flooring: 'Warm natural herringbone engineered oak wood planks with acoustic underlay',
      walls: 'Custom cushioned royal indigo velvet tufted headboard feature wall with vertical brass dividers',
      ceiling: 'Perimeter floating ceiling tray with anti-glare warm reading spotlight channels and soft lavender tint',
      joinery: 'Floor-to-ceiling sliding smoked bronze glass wardrobes with motion sensor interior LED lights and floating nightstands'
    },
    'Kitchen': {
      title: 'Ergonomic Modular Kitchen & Breakfast Island',
      palette: [
        { name: 'Forest Green', hex: '#064e3b' },
        { name: 'Carrara Quartz', hex: '#ffffff' },
        { name: 'Brushed Brass', hex: '#f59e0b' },
        { name: 'Cognac Leather', hex: '#c2410c' },
        { name: 'Sage Subway', hex: '#cbd5e1' }
      ],
      flooring: 'Anti-skid satin Carrara stone tiles (oil, water, and scratch resistant)',
      walls: 'Full-height seamless sintered stone slab backsplash behind induction hob and stainless chimney',
      ceiling: 'Moisture-resistant green gypsum false ceiling with recessed IP65 downlights',
      joinery: 'Forest green marine-grade cabinetry with brushed brass handles, quartz waterfall island & cognac leather barstools'
    },
    'Dining Room': {
      title: 'Central Dining Hall & Entertaining Space',
      palette: [
        { name: 'Rich Walnut', hex: '#451a03' },
        { name: 'Mustard Velvet', hex: '#d97706' },
        { name: 'Radiant Brass', hex: '#fbbf24' },
        { name: 'Burnt Orange', hex: '#ea580c' },
        { name: 'Porcelain White', hex: '#f8fafc' }
      ],
      flooring: 'Seamless polished continuous porcelain matching living foyer without threshold step',
      walls: 'Warm champagne Venetian plaster accent wall with framed abstract modern art piece',
      ceiling: 'Recessed floating ceiling tray with sculptural dual-ring brushed brass geometric halo chandelier',
      joinery: '6-seater solid natural walnut dining table with mustard gold velvet upholstered chairs and built-in buffet sideboard'
    },
    'Bathroom': {
      title: 'Ensuite Bathroom & Spa Shower',
      palette: [
        { name: 'Statuario Marble', hex: '#ffffff' },
        { name: 'Warm Teakwood', hex: '#9a3412' },
        { name: 'Halo Amber', hex: '#fef08a' },
        { name: 'Matte Anthracite', hex: '#0f172a' },
        { name: 'Seafoam Teal', hex: '#0d9488' }
      ],
      flooring: 'R10 anti-slip textured ceramic tiles sloped to concealed linear drain channel',
      walls: 'Large format 8×4 ft Italian Statuario marble wall slabs with zero grout lines and warm backlighting',
      ceiling: 'Calcium silicate moisture-proof ceiling with inline high-CFM exhaust system',
      joinery: 'Floating double-sink rich teakwood vanity counter with dual backlit LED oval mirrors & frameless glass shower'
    },
    'Home Office': {
      title: 'Executive Home Office & Study Library',
      palette: [
        { name: 'Oxford Navy', hex: '#1e3a8a' },
        { name: 'Racing Green', hex: '#047857' },
        { name: 'American Walnut', hex: '#78350f' },
        { name: 'Caramel Leather', hex: '#b45309' },
        { name: 'Curved Sky Blue', hex: '#38bdf8' }
      ],
      flooring: 'Warm engineered walnut herringbone wood finish with low-pile acoustic zone rug',
      walls: 'Oxford navy sound-absorbing felt acoustic slat panelling with floor-to-ceiling built-in bookshelf',
      ceiling: 'Uniform glare-free 4000K daylight work lighting with indirect perimeter glow',
      joinery: 'Cantilevered dual-monitor executive walnut desk, cognac leather swivel chair, and brass banker\'s lamp'
    },
    'Pooja Room': {
      title: 'Pooja Sacred Room & Mandir Shrine',
      palette: [
        { name: 'Makrana Marble', hex: '#ffffff' },
        { name: 'Burma Teak', hex: '#78350f' },
        { name: 'Crimson Velvet', hex: '#991b1b' },
        { name: 'Divine Gold Sun', hex: '#fbbf24' },
        { name: 'Marigold Bloom', hex: '#f97316' }
      ],
      flooring: 'Pure white Makrana marble with brass floral inlay perimeter borders',
      walls: 'Warm white acoustic plaster with radiant backlit laser-cut brass Om & Sun halo panel',
      ceiling: 'Pyramidal traditional false ceiling with central suspended brass bell fixture and spotlight',
      joinery: 'Carved Burma teakwood temple Mandir shrine with stepped marble altar, crimson cloth, and brass oil lamps (Diyas)'
    }
  }[selectedRoom] || {};

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
            <span className="brand-badge">3D INTERIOR VISUALIZATION ENGINE</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>360° Rotatable Architectural Models</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Interior Concept Designs</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Select any room below to inspect in interactive 3D 360° orbit with detailed joinery, materials &amp; ambient schemes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('exterior-design')}
          >
            View 3D Exterior Elevation
          </button>
          <button
            className="btn btn-accent btn-sm"
            onClick={() => setActivePage('house-cost-estimate')}
          >
            Calculate Project Cost <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Room Selector Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {rooms.map((rm) => {
          const Icon = rm.icon;
          const isSelected = selectedRoom === rm.id;

          return (
            <div
              key={rm.id}
              onClick={() => handleRoomSelect(rm.id)}
              style={{
                background: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'var(--bg-card)',
                border: `1.5px solid ${isSelected ? 'var(--primary-light)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} />
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#fff' : 'var(--text-main)' }}>
                  {rm.name}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', lineHeight: '1.2' }}>
                  {rm.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual 3D Render Window */}
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
          gap: '12px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
              {interiorSpecs.title || selectedRoom}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Style: <strong>{activeStyle}</strong> • Budget: <strong>{project?.constructionQuality || 'Standard'} Quality</strong> • Package: <strong>₹{Number(project?.interiorBudget || 850000).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>STYLE:</span>
            {['Modern', 'Minimalist', 'Luxury', 'Contemporary'].map((st) => (
              <button
                key={st}
                onClick={() => handleStyleSelect(st)}
                className={`btn btn-sm ${activeStyle === st ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', background: '#090d16', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={32} className="animate-spin" color="var(--primary-light)" />
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Rendering 3D {selectedRoom} Space &amp; Materials...</span>
          </div>
        ) : (
          <ArchitecturalVisualizer
            type="interior"
            room={selectedRoom}
            style={activeStyle}
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
            Rotate 360° around the space to inspect joinery, ceiling coves, furniture clearances &amp; ambient lighting.
          </span>
          <button className="btn btn-outline btn-sm" onClick={() => alert(`${selectedRoom} interior concept snapshot saved.`)}>
            <Download size={14} /> Download 3D View
          </button>
        </div>
      </div>

      {/* Materials & Joinery Specs */}
      <div style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{selectedRoom} Architectural Specifications &amp; Finishes</h3>

        {/* Curated Attractive Color Palette Swatches */}
        {interiorSpecs.palette && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} color="var(--primary-light)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Curated Attractive Color Palette:
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {interiorSpecs.palette.map((c, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--bg-surface)',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: '1px solid var(--border)'
                }}>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: c.hex,
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: `0 0 8px ${c.hex}66`
                  }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Flooring &amp; Base Spec</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>{interiorSpecs.flooring}</p>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Wall Finishes &amp; Accent Cladding</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>{interiorSpecs.walls}</p>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>False Ceiling &amp; Lighting Cove</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>{interiorSpecs.ceiling}</p>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Modular Joinery &amp; Ergonomics</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>{interiorSpecs.joinery}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
