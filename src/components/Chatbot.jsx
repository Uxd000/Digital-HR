import { useEffect, useRef, useState } from 'react';

const SUGGESTED = {
  hr: ['Show pending leaves', 'Who are low performers?', 'Recruitment summary', 'Schedule overview', 'Attendance today'],
  employee: ['What is my leave balance?', 'Check my attendance', 'My performance this month', 'How to apply WFH?', 'Company policies'],
};

async function callClaude(messages, systemPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.content?.[0]?.text || 'Sorry, no response.';
}

function Chatbot({ role, userName, employees, leaveRequests, candidates }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'ai-0', role: 'ai', text: `Hi ${userName || (role === 'hr' ? 'HR' : 'there')}! 👋 I'm your AI HR assistant. Ask me anything about ${role === 'hr' ? 'employees, recruitment, or HR operations' : 'your leave, attendance, performance, or company policies'}.` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const buildSystemPrompt = () => {
    if (role === 'hr') {
      const empSummary = employees?.map(e => `${e.name} (${e.role}, perf:${e.performance}%, attendance:${e.attendance}%, ${e.status}${e.pip ? ', ON PIP' : ''})`).join('; ') || '';
      const leaveSummary = leaveRequests?.filter(r => r.status === 'pending').map(r => `${r.employeeName}: ${r.days} days (${r.type || 'leave'})`).join('; ') || 'none';
      const candSummary = candidates?.map(c => `${c.name} (${c.role}, score:${c.score}%, stage:${c.stage})`).join('; ') || '';
      return `You are an intelligent HR assistant for a company. You have access to real-time HR data.
Current date: ${new Date().toLocaleDateString()}
Logged-in HR: ${userName}

EMPLOYEE DATA: ${empSummary}
PENDING LEAVE REQUESTS: ${leaveSummary}
RECRUITMENT PIPELINE: ${candSummary}

Answer HR questions concisely and helpfully. When asked about specific employees, use the data above. Give actionable advice. Keep responses under 150 words unless detail is requested. Use bullet points for lists.`;
    } else {
      const emp = employees?.find(e => e.name === userName);
      const myLeaves = leaveRequests?.filter(r => r.employeeName === userName) || [];
      return `You are a helpful HR assistant for an employee named ${userName}.
Their data: Role: ${emp?.role || 'N/A'}, Department: ${emp?.department || 'N/A'}, Performance: ${emp?.performance || 'N/A'}%, Attendance: ${emp?.attendance || 'N/A'}%, Leave balance: ${20 - myLeaves.filter(l => l.status === 'approved').reduce((s, l) => s + l.days, 0)} days remaining, Status: ${emp?.status || 'Active'}${emp?.pip ? ', Currently on PIP' : ''}.

Answer the employee's questions about their own data, HR policies, leave, attendance, and career growth. Be supportive, empathetic, and professional. Keep responses under 120 words. If asked about sensitive issues like PIP, be constructive and encouraging.`;
    }
  };

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const history = messages
      .filter(m => m.id !== 'ai-0')
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
    history.push({ role: 'user', content: trimmed });

    try {
      const reply = await callClaude(history, buildSystemPrompt());
      setMessages(prev => [...prev, { id: `ai-${Date.now()}`, role: 'ai', text: reply }]);
    } catch {
      // Fallback smart responses
      const t = trimmed.toLowerCase();
      let fallback = "I'm here to help! Ask me about leave, attendance, or performance.";
      if (t.includes('leave') && role === 'employee') fallback = `You have ${20 - (leaveRequests?.filter(l => l.employeeName === userName && l.status === 'approved').reduce((s, l) => s + l.days, 0) || 0)} leave days remaining. You can request leave from the Leave tab.`;
      else if (t.includes('performance') && role === 'employee') { const emp = employees?.find(e => e.name === userName); fallback = emp ? `Your current performance score is ${emp.performance}%. ${emp.performance < 30 ? '⚠️ You are currently on a PIP. Please connect with HR.' : emp.performance < 70 ? 'There is room for improvement. Consider discussing a development plan with your manager.' : 'Great work! Keep it up.'}` : fallback; }
      else if (t.includes('pending') && role === 'hr') { const p = leaveRequests?.filter(l => l.status === 'pending').length || 0; fallback = `There are ${p} pending leave request${p !== 1 ? 's' : ''} awaiting your review.`; }
      else if (t.includes('pip') && role === 'hr') { const p = employees?.filter(e => e.pip).length || 0; fallback = `${p} employee${p !== 1 ? 's are' : ' is'} currently on a PIP. Check the Performance Dashboard for details.`; }
      setMessages(prev => [...prev, { id: `ai-fb-${Date.now()}`, role: 'ai', text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggested = SUGGESTED[role] || [];

  return (
    <>
      <button
        aria-label="Open AI Assistant"
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105"
        onClick={() => setIsOpen(v => !v)}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      <div className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-200 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
        <div className="rounded-2xl bg-gray-900/95 backdrop-blur border border-white/10 shadow-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">HR AI Assistant</p>
              <p className="text-xs text-white/50">Powered by Claude · Always available</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white text-sm px-1">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/10 border border-white/10 text-white'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-white/5">
              <p className="text-xs text-white/30 mb-2">Suggested questions</p>
              <div className="flex flex-wrap gap-1.5">
                {suggested.map(s => (
                  <button key={s} onClick={() => handleSend(s)} className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder:text-white/30 outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
