import React, { useState } from 'react';
import {
  X,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Maximize2,
  Home,
  Layers,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function DimensionEditorModal({
  isOpen,
  onClose,
  initialDimensions,
  onSave,
  floors = 'G + 1'
}) {
  if (!isOpen) return null;

  // Local working copy of dimensions
  const [dims, setDims] = useState(() => JSON.parse(JSON.stringify(initialDimensions)));
  const [activeTab, setActiveTab] = useState('ground'); // 'plot', 'ground', 'upper'

  // Helper to safely update a room dimension
  const updateRoom = (roomKey, field, deltaOrVal, isDelta = false) => {
    setDims((prev) => {
      const room = prev[roomKey] || { length: 12, width: 12 };
      let newVal = isDelta ? Number(room[field] || 0) + deltaOrVal : Number(deltaOrVal);
      if (newVal < 4) newVal = 4; // minimum threshold
      if (newVal > 60) newVal = 60; // maximum threshold
      return {
        ...prev,
        [roomKey]: {
          ...room,
          [field]: Math.round(newVal * 10) / 10
        }
      };
    });
  };

  // Helper for plot dimensions
  const updatePlot = (field, deltaOrVal, isDelta = false) => {
    setDims((prev) => {
      let newVal = isDelta ? Number(prev[field] || 0) + deltaOrVal : Number(deltaOrVal);
      if (newVal < 10) newVal = 10;
      if (newVal > 250) newVal = 250;
      return {
        ...prev,
        [field]: Math.round(newVal)
      };
    });
  };

  // Preset Handlers
  const applyPreset = (type) => {
    setDims((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (type === 'spacious_living') {
        copy.livingRoom = { ...copy.livingRoom, length: 22, width: 16 };
        copy.diningRoom = { ...copy.diningRoom, length: 16, width: 14 };
      } else if (type === 'master_suite') {
        copy.masterBedroom = { ...copy.masterBedroom, length: 18, width: 16 };
        copy.ensuiteBath = { ...copy.ensuiteBath, length: 10, width: 8 };
      } else if (type === 'chef_kitchen') {
        copy.kitchen = { ...copy.kitchen, length: 14, width: 14 };
        copy.diningRoom = { ...copy.diningRoom, length: 15, width: 13 };
      } else if (type === 'reset') {
        return JSON.parse(JSON.stringify(initialDimensions));
      }
      return copy;
    });
  };

  // Calculations
  const plotArea = Number(dims.landLength || 50) * Number(dims.landWidth || 30);
  
  // Ground floor rooms sum
  const groundRooms = ['livingRoom', 'masterBedroom', 'kitchen', 'diningRoom', 'poojaRoom', 'carPorch', 'ensuiteBath'];
  const groundCarpet = groundRooms.reduce((acc, key) => {
    const r = dims[key];
    return acc + (r ? Number(r.length || 0) * Number(r.width || 0) : 0);
  }, 0);

  // Upper floor rooms sum
  const upperRooms = ['familyLounge', 'bedroom2', 'bedroom3', 'balcony'];
  const upperCarpet = upperRooms.reduce((acc, key) => {
    const r = dims[key];
    return acc + (r ? Number(r.length || 0) * Number(r.width || 0) : 0);
  }, 0);

  // Approximate built-up area (carpet + 18% for external/internal walls & circulation)
  const isMultiFloor = floors.includes('G +');
  const totalCarpet = isMultiFloor ? groundCarpet + upperCarpet : groundCarpet;
  const estimatedBuiltUp = Math.round(totalCarpet * 1.20);
  
  // Ground coverage %
  const coveragePercent = Math.round((groundCarpet / (plotArea || 1)) * 100);
  const isCoverageHigh = coveragePercent > 70; // NBC recommends <= 65-70% for residential plots

  const handleSave = () => {
    onSave({
      ...dims,
      calculatedBuiltUpArea: estimatedBuiltUp,
      calculatedCarpetArea: totalCarpet
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                CUSTOM ARCHITECTURAL TUNER
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interactive CAD Sizing</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 0' }}>Edit Plot &amp; Room Dimensions</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Real-time Metrics & Compliance Banner */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(30, 41, 59, 0.4)',
          borderBottom: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Plot Dimensions</span>
            <div className="mono" style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {dims.landLength}′ × {dims.landWidth}′ ({plotArea} sq.ft)
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ground Carpet</span>
            <div className="mono" style={{ fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
              {groundCarpet.toLocaleString()} sq.ft
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Est. Built-up Area</span>
            <div className="mono" style={{ fontWeight: 700, color: 'var(--primary-light)', marginTop: '2px' }}>
              {estimatedBuiltUp.toLocaleString()} sq.ft
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Plot Coverage Ratio</span>
            <div className="mono" style={{
              fontWeight: 700,
              color: isCoverageHigh ? '#f87171' : '#34d399',
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {coveragePercent}% {isCoverageHigh ? '(Exceeds 70% Limit)' : '(NBC Compliant)'}
            </div>
          </div>
        </div>

        {/* 1-Click Preset Bar */}
        <div style={{
          padding: '10px 24px',
          background: 'rgba(15, 23, 42, 0.3)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Quick Presets:
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => applyPreset('spacious_living')}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            <Sparkles size={12} /> Spacious Living
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => applyPreset('master_suite')}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            <Home size={12} /> Luxury Master Suite
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => applyPreset('chef_kitchen')}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            🍳 Chef's Kitchen
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => applyPreset('reset')}
            style={{ fontSize: '0.75rem', padding: '4px 10px', color: 'var(--text-muted)' }}
          >
            <RotateCcw size={12} /> Reset to Default
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(15, 23, 42, 0.2)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('ground')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'ground' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
              borderBottom: activeTab === 'ground' ? '2px solid var(--primary-light)' : 'none',
              color: activeTab === 'ground' ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Home size={16} /> Ground Floor Rooms ({groundRooms.length})
          </button>

          {isMultiFloor && (
            <button
              type="button"
              onClick={() => setActiveTab('upper')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: activeTab === 'upper' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                borderBottom: activeTab === 'upper' ? '2px solid var(--primary-light)' : 'none',
                color: activeTab === 'upper' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Layers size={16} /> Upper Floor Rooms ({upperRooms.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('plot')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'plot' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
              borderBottom: activeTab === 'plot' ? '2px solid var(--primary-light)' : 'none',
              color: activeTab === 'plot' ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Maximize2 size={16} /> Plot &amp; Setbacks
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* TAB: Ground Floor Rooms */}
          {activeTab === 'ground' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Adjust each room's Length and Width in feet. The 2D CAD blueprint will adjust its partitions and dimension tags immediately.
              </div>

              {groundRooms.map((key) => {
                const room = dims[key] || { name: key, length: 12, width: 12, zone: 'Central' };
                const area = Math.round(Number(room.length || 0) * Number(room.width || 0));

                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ minWidth: '180px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {room.name || key}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)' }}>
                        Zone: {room.zone || 'Vastu Compliant'}
                      </div>
                    </div>

                    {/* Steppers for Length & Width */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Length */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', width: '45px' }}>Length:</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'length', -1, true)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="input-field"
                          style={{ width: '65px', padding: '4px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                          value={room.length || ''}
                          onChange={(e) => updateRoom(key, 'length', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'length', 1, true)}
                        >
                          +
                        </button>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ft</span>
                      </div>

                      {/* Width */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', width: '40px' }}>Width:</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'width', -1, true)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="input-field"
                          style={{ width: '65px', padding: '4px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                          value={room.width || ''}
                          onChange={(e) => updateRoom(key, 'width', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'width', 1, true)}
                        >
                          +
                        </button>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ft</span>
                      </div>

                      {/* Calculated Room Sq.Ft */}
                      <div style={{ minWidth: '90px', textAlign: 'right' }}>
                        <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '0.95rem' }}>
                          {area} sq.ft
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: Upper Floor Rooms */}
          {activeTab === 'upper' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Adjust sizes for first floor suites, family lounge, and cantilevered terrace decks.
              </div>

              {upperRooms.map((key) => {
                const room = dims[key] || { name: key, length: 14, width: 13, zone: 'First Floor' };
                const area = Math.round(Number(room.length || 0) * Number(room.width || 0));

                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ minWidth: '180px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {room.name || key}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)' }}>
                        Zone: {room.zone || 'First Floor'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Length */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', width: '45px' }}>Length:</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'length', -1, true)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="input-field"
                          style={{ width: '65px', padding: '4px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                          value={room.length || ''}
                          onChange={(e) => updateRoom(key, 'length', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'length', 1, true)}
                        >
                          +
                        </button>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ft</span>
                      </div>

                      {/* Width */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', width: '40px' }}>Width:</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'width', -1, true)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="input-field"
                          style={{ width: '65px', padding: '4px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                          value={room.width || ''}
                          onChange={(e) => updateRoom(key, 'width', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                          onClick={() => updateRoom(key, 'width', 1, true)}
                        >
                          +
                        </button>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ft</span>
                      </div>

                      <div style={{ minWidth: '90px', textAlign: 'right' }}>
                        <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '0.95rem' }}>
                          {area} sq.ft
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: Plot & Setbacks */}
          {activeTab === 'plot' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>
                  Plot Length (Depth in Feet)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    className="input-field"
                    style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                    value={dims.landLength || ''}
                    onChange={(e) => updatePlot('landLength', e.target.value)}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ft</span>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>
                  Plot Width (Frontage in Feet)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    className="input-field"
                    style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                    value={dims.landWidth || ''}
                    onChange={(e) => updatePlot('landWidth', e.target.value)}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ft</span>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>
                  Front Road Width
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    className="input-field"
                    style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                    value={dims.roadWidth || ''}
                    onChange={(e) => updatePlot('roadWidth', e.target.value)}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ft</span>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px'
              }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>
                  Front Setback (Garden / Driveway)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    className="input-field"
                    style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                    value={dims.frontSetback || 5}
                    onChange={(e) => updatePlot('frontSetback', e.target.value)}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ft</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            * Changes update the 2D blueprint in real-time and flow directly into cost estimation.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Check size={18} /> Apply &amp; Update Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
