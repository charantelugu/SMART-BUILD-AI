import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Layers,
  DollarSign,
  Compass,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { aiService } from '../services/api';

export default function AIAssistant({ project, materialCosts }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello! I am your **Smart Build AI Construction Consultant**. 

I have access to your active project details:
- **Project:** ${project?.projectName || 'Custom Villa'} (${project?.landLength || 50}′ × ${project?.landWidth || 30}′, ${project?.floors || 'G + 1'})
- **Budget:** ₹${Number(project?.budget || 5500000).toLocaleString('en-IN')}
- **Target Quality:** ${project?.constructionQuality || 'Standard'}
- **Facing:** ${project?.facing || 'North-East'}

How can I help you today with material estimations, structural thumb-rules, Vastu guidelines, or cost optimization?`,
      timestamp: '10:00 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    'How many cement bags for my 1,500 sq.ft slab?',
    'What grade of TMT steel should I use for G+2 columns?',
    'How can I optimize my construction budget by 15%?',
    'What is the ideal Vastu orientation for my kitchen and pooja room?',
    'What is the recommended ratio for M20 grade concrete?'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText = null) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const projectContext = {
        projectName: project?.projectName,
        landArea: (project?.landLength || 50) * (project?.landWidth || 30),
        builtUpArea: project?.builtUpArea || 2400,
        floors: project?.floors,
        budget: project?.budget,
        quality: project?.constructionQuality,
        facing: project?.facing,
        materialCosts
      };

      const res = await aiService.sendMessage(textToSend, projectContext);

      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.reply,
        timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'I apologize, but I encountered an issue connecting to the AI service. Please verify your connection or try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown renderer for AI responses
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ margin: '12px 0 6px', color: 'var(--accent-light)', fontSize: '1.05rem' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- **') || line.startsWith('* **')) {
        const parts = line.split('**');
        return (
          <div key={idx} style={{ display: 'flex', gap: '8px', margin: '4px 0' }}>
            <span style={{ color: 'var(--primary-light)' }}>•</span>
            <div>
              <strong>{parts[1]}</strong>
              {parts.slice(2).join('')}
            </div>
          </div>
        );
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return <div key={idx} style={{ margin: '4px 0 4px 12px' }}>{line}</div>;
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '8px' }}></div>;
      }
      return <p key={idx} style={{ margin: '4px 0' }}>{line}</p>;
    });
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="brand-badge">GEMINI AI INTEGRATED</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Project-Grounded Construction Engine</span>
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>AI Construction Assistant</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Ask anything about engineering codes, materials, pricing, Vastu orientation, or cost reduction
          </p>
        </div>

        {/* Project Grounding Pill */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Grounded In Active Project</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {project?.projectName || 'Dream House'} ({project?.landLength}x{project?.landWidth} ft)
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="chat-container">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Smart Build AI Advisor</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>● Online &amp; Context Synchronized</div>
            </div>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setMessages([messages[0]])}
            title="Reset conversation"
          >
            <RefreshCw size={14} /> Clear History
          </button>
        </div>

        {/* Messages List */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                <span style={{ fontWeight: 600 }}>
                  {msg.sender === 'user' ? 'You' : 'Smart Build AI'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <div>{renderFormattedText(msg.text)}</div>
            </div>
          ))}

          {loading && (
            <div className="message-bubble message-ai" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} className="animate-spin" color="var(--primary-light)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Analyzing project engineering rules and formulating advice...
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Pills */}
        <div style={{
          padding: '10px 20px',
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '6px 14px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(37, 99, 235, 0.15)';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                e.target.style.color = 'var(--text-muted)';
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your construction question here (e.g., 'How much cement for G+1 slab?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="btn btn-primary"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <Send size={18} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
