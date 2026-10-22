import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Sliders,
  ArrowLeft,
  Sparkles,
  Check,
  X,
  RefreshCw,
  Award,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { estimateService } from '../services/api';

export default function BudgetComparison({ project, estimateData, setActivePage }) {
  const userBudget = Number(project?.budget || 5500000);
  const originalEstimate = Number(estimateData?.totalEstimatedCost || 6150000);

  const [acceptedSuggestions, setAcceptedSuggestions] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSuggestions() {
      setLoading(true);
      try {
        const res = await estimateService.optimizeBudget({
          budget: userBudget,
          estimatedCost: originalEstimate
        });
        setSuggestions(res.suggestions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSuggestions();
  }, [userBudget, originalEstimate]);

  // Calculate savings from accepted suggestions
  const totalSavings = Object.keys(acceptedSuggestions).reduce((sum, sId) => {
    if (acceptedSuggestions[sId]) {
      const item = suggestions.find((s) => s.id === sId);
      return sum + (item ? item.potentialSavings : 0);
    }
    return sum;
  }, 0);

  const revisedEstimate = originalEstimate - totalSavings;
  const isOverBudget = revisedEstimate > userBudget;
  const costDiff = Math.abs(revisedEstimate - userBudget);
  const budgetUtilization = Math.round((revisedEstimate / userBudget) * 100);

  const toggleSuggestion = (sId) => {
    setAcceptedSuggestions((prev) => ({
      ...prev,
      [sId]: !prev[sId]
    }));
  };

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
            onClick={() => setActivePage('house-cost-estimate')}
            style={{ marginBottom: '10px' }}
          >
            <ArrowLeft size={16} /> Back to Cost Breakdown
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-badge">FINANCIAL VARIANCE ANALYSIS</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interactive Value Engineering</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Budget Comparison &amp; Optimization</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Compare your entered budget against the algorithmic estimate and evaluate cost adjustments
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setActivePage('ai-assistant')}
        >
          Consult AI on Financing <ArrowRight size={18} />
        </button>
      </div>

      {/* Comparison Cards: User Budget vs Estimated Cost */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            USER ENTERED BUDGET
          </div>
          <div className="mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '8px 0' }}>
            ₹{userBudget.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Target allocated for {project?.projectName || 'House Plan'}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ESTIMATED PROJECT COST {totalSavings > 0 ? '(REVISED)' : ''}
          </div>
          <div className="mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: isOverBudget ? 'var(--warning)' : 'var(--success)', margin: '8px 0' }}>
            ₹{revisedEstimate.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {totalSavings > 0 ? (
              <span style={{ color: 'var(--success)' }}>
                Applied Savings: -₹{totalSavings.toLocaleString('en-IN')}
              </span>
            ) : (
              `Baseline construction thumb-rule estimate`
            )}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BUDGET VARIANCE STATUS
          </div>
          <div className="mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: isOverBudget ? 'var(--danger)' : 'var(--success)', margin: '8px 0' }}>
            {isOverBudget ? `+₹${costDiff.toLocaleString('en-IN')}` : `-₹${costDiff.toLocaleString('en-IN')}`}
          </div>
          <div style={{ fontSize: '0.85rem', color: isOverBudget ? 'var(--danger)' : 'var(--success)' }}>
            {isOverBudget ? 'Over Budget' : 'Within Budget Safe Zone'} ({budgetUtilization}% utilization)
          </div>
        </div>
      </div>

      {/* Warning Notice if Over Budget (Exact Prompt Requirement) */}
      {isOverBudget ? (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AlertTriangle size={28} color="var(--danger)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fca5a5', marginBottom: '4px' }}>
                Your estimated project cost is above your entered budget.
              </h3>
              <p style={{ color: '#fed7d7', fontSize: '0.9rem' }}>
                Current estimate exceeds your target ceiling by <strong>₹{costDiff.toLocaleString('en-IN')}</strong>. Review the value-engineering suggestions below to reconcile your budget.
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 16px',
            fontSize: '0.88rem',
            color: '#fff',
            fontWeight: 700
          }}>
            DIFFERENCE: +₹{costDiff.toLocaleString('en-IN')}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <CheckCircle size={28} color="var(--success)" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#a7f3d0', marginBottom: '4px' }}>
              Project Estimate Is Within Your Target Budget!
            </h3>
            <p style={{ color: '#d1fae5', fontSize: '0.9rem' }}>
              Your estimated construction cost is comfortably within your budget with a cushion of <strong>₹{costDiff.toLocaleString('en-IN')}</strong> for contingency.
            </p>
          </div>
        </div>
      )}

      {/* OPTIMIZE MY BUDGET Engine */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '18px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sliders size={20} color="var(--accent-light)" />
              <h2 style={{ fontSize: '1.4rem' }}>OPTIMIZE MY BUDGET</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Actionable engineering &amp; material adjustment suggestions. Click Accept or Reject on each item. Choices are never altered automatically.
            </p>
          </div>

          {totalSavings > 0 && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              fontSize: '0.85rem',
              color: 'var(--success)',
              fontWeight: 700
            }}>
              Active Reductions: ₹{totalSavings.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Suggestions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {suggestions.map((sug) => {
            const isAccepted = !!acceptedSuggestions[sug.id];

            return (
              <div
                key={sug.id}
                style={{
                  background: isAccepted ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                  border: `1.5px solid ${isAccepted ? 'var(--success)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ maxWidth: '680px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#60a5fa'
                    }}>
                      {sug.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', color: isAccepted ? 'var(--success)' : 'var(--text-main)' }}>
                      {sug.title}
                    </h4>
                    {sug.recommended && (
                      <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        High ROI
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {sug.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Potential Savings
                    </div>
                    <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                      -₹{sug.potentialSavings.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    className={`btn btn-sm ${isAccepted ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => toggleSuggestion(sug.id)}
                    style={{ minWidth: '100px' }}
                  >
                    {isAccepted ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)' }}>
                        <X size={16} /> Reject
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={16} /> Accept
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Action Summary */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setAcceptedSuggestions({})}
          >
            <RefreshCw size={14} /> Reset All Suggestions
          </button>

          <button
            className="btn btn-accent"
            onClick={() => {
              alert(`Value-engineering configuration locked! Total project savings: ₹${totalSavings.toLocaleString('en-IN')}`);
              setActivePage('cost-summary');
            }}
          >
            Apply Revised Estimates to BOQ <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
