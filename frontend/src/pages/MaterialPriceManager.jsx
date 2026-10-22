import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  Edit2,
  Check,
  X,
  Plus,
  ArrowLeft,
  Calendar,
  Building,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { materialService } from '../services/api';

export default function MaterialPriceManager({ materialPrices, setMaterialPrices, setActivePage }) {
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editSupplier, setEditSupplier] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editQuality, setEditQuality] = useState('');
  const [message, setMessage] = useState(null);

  const startEdit = (mat) => {
    setEditingId(mat.id);
    setEditPrice(mat.price);
    setEditSupplier(mat.supplier || '');
    setEditLocation(mat.location || '');
    setEditQuality(mat.quality || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (mat) => {
    const updatedPrice = {
      materialId: mat.id,
      category: mat.category,
      price: Number(editPrice),
      supplier: editSupplier,
      location: editLocation,
      quality: editQuality,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      await materialService.updateMaterialPrice(updatedPrice);
      setMaterialPrices((prev) =>
        prev.map((item) => (item.id === mat.id ? { ...item, ...updatedPrice } : item))
      );
      setEditingId(null);
      setMessage(`Price for ${mat.category} successfully updated to ₹${editPrice}!`);
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      console.error(err);
    }
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
            onClick={() => setActivePage('cost-estimator')}
            style={{ marginBottom: '10px' }}
          >
            <ArrowLeft size={16} /> Back to Cost Estimator
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-badge">DATABASE-SYNCHRONIZED PRICING</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest Available Stored Rates</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Material Price Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time market prices, suppliers, locations, and quality grades stored in the database.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setActivePage('cost-estimator')}
        >
          Use Prices in Calculators
        </button>
      </div>

      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          color: 'var(--success)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* Database Price Records Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-md)'
      }}>
        <table className="dynamic-table">
          <thead>
            <tr>
              <th>Material / Category</th>
              <th>Unit</th>
              <th>Current Price (₹)</th>
              <th>Supplier</th>
              <th>Location</th>
              <th>Quality / Grade</th>
              <th>Date Updated</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materialPrices.map((mat) => {
              const isEditing = editingId === mat.id;

              return (
                <tr key={mat.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{mat.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>{mat.category}</div>
                  </td>

                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {mat.unit}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-input mono"
                        style={{ padding: '6px 10px', width: '100px' }}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        min="0"
                      />
                    ) : (
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '1.05rem' }}>
                        ₹{Number(mat.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', width: '140px' }}
                        value={editSupplier}
                        onChange={(e) => setEditSupplier(e.target.value)}
                      />
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {mat.supplier}
                      </div>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', width: '110px' }}
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                      />
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        {mat.location}
                      </div>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', width: '130px' }}
                        value={editQuality}
                        onChange={(e) => setEditQuality(e.target.value)}
                      />
                    ) : (
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                        {mat.quality}
                      </span>
                    )}
                  </td>

                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {mat.updatedAt || '2026-09-20'}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => saveEdit(mat)}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '4px 8px' }}
                          title="Save price"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '4px 8px' }}
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(mat)}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        <Edit2 size={12} /> Edit Price
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
