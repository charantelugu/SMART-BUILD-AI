import React from 'react';
import { AlertCircle, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-glass)',
      padding: '32px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              SMART BUILD AI
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              AI-Powered House Planning & Construction Cost Management
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} color="var(--primary-light)" />
              Powered by Spring Boot & Gemini AI
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--success)" />
              IS-456:2000 Civil Engineering Standards
            </span>
          </div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          fontSize: '0.8rem',
          color: 'var(--accent-light)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Disclaimer:</strong> All generated floor plans, room zoning arrangements, 3D exterior/interior concepts, and material estimations provided by SMART BUILD AI are conceptual planning aids. They do not substitute for certified structural engineering drawings, local municipal building sanction approvals, or soil-bearing certification.
          </span>
        </div>

        <div style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          borderTop: '1px solid var(--border)',
          paddingTop: '16px'
        }}>
          &copy; {new Date().getFullYear()} SMART BUILD AI. All rights reserved. Designed for Next-Gen Construction Technology.
        </div>
      </div>
    </footer>
  );
}
