import { useState } from 'react';

const RECOGNITION_BADGES = ['🌟 Star Performer', '🤝 Team Player', '💡 Innovator', '📈 Most Improved', '🎯 Goal Crusher', '❤️ Culture Champion'];

const PULSE_QUESTIONS = [
  'How satisfied are you with your work-life balance?',
  'Do you feel your contributions are recognized?',
  'How would you rate your manager\'s support?',
  'Do you feel you have growth opportunities?',
  'How connected do you feel to the company culture?',
];

const MORALE_ACTIVITIES = [
  { id: 'a1', title: 'Team Lunch Friday', date: '2026-03-29', type: 'social', votes: 12, icon: '🍕' },
  { id: 'a2', title: 'Hackathon Day', date: '2026-04-05', type: 'learning', votes: 8, icon: '💻' },
  { id: 'a3', title: 'Wellness Wednesday Walk', date: '2026-04-02', type: 'wellness', votes: 15, icon: '🚶' },
  { id: 'a4', title: 'Shoutout Board Reset', date: 'Ongoing', type: 'recognition', votes: 20, icon: '📢' },
];

export default function EmployeeExperience({ employees, feedback, setFeedback, morale, setMorale }) {
  const [tab, setTab] = useState('feedback');
  const [feedbackForm, setFeedbackForm] = useState({ toId: '', type: 'praise', message: '', anonymous: false });
  const [pulseAnswers, setPulseAnswers] = useState({});
  const [pulseSubmitted, setPulseSubmitted] = useState(false);
  const [activities, setActivities] = useState(MORALE_ACTIVITIES);
  const [recognitions, setRecognitions] = useState([
    { id: 'r1', from: 'Sarah Kim', to: 'James Wilson', badge: '🌟 Star Performer', note: 'Exceptional CI/CD work this quarter', date: '2026-03-25' },
    { id: 'r2', from: 'Lisa Park', to: 'Ava Johnson', badge: '🎯 Goal Crusher', note: 'Crushed all Q1 OKRs ahead of schedule', date: '2026-03-24' },
  ]);
  const [newRecognition, setNewRecognition] = useState({ toId: '', badge: '', note: '' });
  const [showRecogForm, setShowRecogForm] = useState(false);

  const submitFeedback = () => {
    if (!feedbackForm.toId || !feedbackForm.message) return;
    const emp = employees.find(e => e.id === feedbackForm.toId);
    setFeedback(prev => [...prev, {
      id: Date.now(),
      to: emp?.name,
      toId: feedbackForm.toId,
      type: feedbackForm.type,
      message: feedbackForm.message,
      anonymous: feedbackForm.anonymous,
      from: feedbackForm.anonymous ? 'Anonymous' : 'HR',
      date: new Date().toLocaleDateString(),
    }]);
    setFeedbackForm({ toId: '', type: 'praise', message: '', anonymous: false });
  };

  const submitPulse = () => {
    const avg = Object.values(pulseAnswers).reduce((s, v) => s + v, 0) / PULSE_QUESTIONS.length;
    setMorale(prev => [...prev, { date: new Date().toLocaleDateString(), score: Math.round(avg * 20), answers: pulseAnswers }]);
    setPulseSubmitted(true);
  };

  const voteActivity = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a));
  };

  const addRecognition = () => {
    if (!newRecognition.toId || !newRecognition.badge) return;
    const emp = employees.find(e => e.id === newRecognition.toId);
    setRecognitions(prev => [{
      id: Date.now(),
      from: 'HR',
      to: emp?.name,
      badge: newRecognition.badge,
      note: newRecognition.note,
      date: new Date().toLocaleDateString(),
    }, ...prev]);
    setNewRecognition({ toId: '', badge: '', note: '' });
    setShowRecogForm(false);
  };

  const avgMorale = morale.length > 0 ? Math.round(morale.reduce((s, m) => s + m.score, 0) / morale.length) : null;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">Employee Experience</h1>
        <p className="mt-2 text-white/60">Feedback, recognition, pulse surveys, and morale boosters.</p>
      </header>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'feedback', label: '💬 Feedback' },
          { id: 'recognition', label: '🏅 Recognition' },
          { id: 'pulse', label: '📊 Pulse Survey' },
          { id: 'morale', label: '🎉 Morale' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${tab === t.id ? 'bg-white/15 border-white/30 text-white' : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Send Personalized Feedback</h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">To Employee</label>
                <select value={feedbackForm.toId} onChange={e => setFeedbackForm(p => ({ ...p, toId: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="">Select employee...</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Feedback Type</label>
                <div className="flex gap-2">
                  {['praise', 'constructive', 'development'].map(type => (
                    <button key={type} onClick={() => setFeedbackForm(p => ({ ...p, type }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-colors ${
                        feedbackForm.type === type ? 'bg-white/15 border-white/30 text-white' : 'border-white/10 text-white/50 hover:bg-white/10'
                      }`}>
                      {type === 'praise' ? '🌟 Praise' : type === 'constructive' ? '💡 Constructive' : '📈 Development'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Message</label>
                <textarea value={feedbackForm.message} onChange={e => setFeedbackForm(p => ({ ...p, message: e.target.value }))}
                  rows={4} placeholder="Write personalized, specific feedback..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder:text-white/30 outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" checked={feedbackForm.anonymous} onChange={e => setFeedbackForm(p => ({ ...p, anonymous: e.target.checked }))} className="accent-purple-500" />
                  Send anonymously
                </label>
                <button onClick={submitFeedback} disabled={!feedbackForm.toId || !feedbackForm.message}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Send Feedback
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Feedback Sent</h2>
            {feedback.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
                <p className="text-white/30 text-sm">No feedback sent yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedback.slice(0, 6).map(f => (
                  <div key={f.id} className={`rounded-2xl border p-4 ${
                    f.type === 'praise' ? 'border-emerald-500/20 bg-emerald-500/5' :
                    f.type === 'constructive' ? 'border-yellow-500/20 bg-yellow-500/5' :
                    'border-blue-500/20 bg-blue-500/5'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white">→ {f.to}</p>
                      <div className="flex items-center gap-2">
                        {f.anonymous && <span className="text-xs text-white/30">anon</span>}
                        <span className="text-xs text-white/40">{f.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">{f.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'recognition' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Employee Recognition Wall</h2>
            <button onClick={() => setShowRecogForm(v => !v)} className="text-sm px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors">
              🏅 Give Recognition
            </button>
          </div>

          {showRecogForm && (
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <select value={newRecognition.toId} onChange={e => setNewRecognition(p => ({ ...p, toId: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none">
                  <option value="">Select employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <select value={newRecognition.badge} onChange={e => setNewRecognition(p => ({ ...p, badge: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none">
                  <option value="">Select badge</option>
                  {RECOGNITION_BADGES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <input value={newRecognition.note} onChange={e => setNewRecognition(p => ({ ...p, note: e.target.value }))}
                  placeholder="Short note..." className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder:text-white/40 outline-none" />
              </div>
              <button onClick={addRecognition} className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors">
                Award Badge
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recognitions.map(r => (
              <div key={r.id} className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{r.badge.split(' ')[0]}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white">{r.to}</p>
                    <p className="text-sm text-yellow-300 font-medium">{r.badge}</p>
                    {r.note && <p className="text-sm text-white/60 mt-1 italic">"{r.note}"</p>}
                    <p className="text-xs text-white/30 mt-2">By {r.from} · {r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pulse' && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-white mb-2">Monthly Pulse Survey</h2>
          <p className="text-sm text-white/50 mb-6">Anonymous · Takes 2 minutes · Helps HR understand team wellbeing</p>

          {pulseSubmitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
              <p className="text-3xl mb-3">🎉</p>
              <p className="text-emerald-200 font-semibold text-lg">Thank you for your feedback!</p>
              <p className="text-white/50 text-sm mt-2">Your responses help us improve your work experience.</p>
              {avgMorale && <p className="text-white/70 text-sm mt-3">Current team morale score: <span className="text-emerald-300 font-bold">{avgMorale}%</span></p>}
            </div>
          ) : (
            <div className="space-y-5">
              {PULSE_QUESTIONS.map((q, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white mb-4">{q}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => setPulseAnswers(p => ({ ...p, [i]: v }))}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                          pulseAnswers[i] === v
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-purple-400 text-white'
                            : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                        }`}>
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-1 px-1">
                    <span>Very Low</span><span>Very High</span>
                  </div>
                </div>
              ))}
              <button
                onClick={submitPulse}
                disabled={Object.keys(pulseAnswers).length < PULSE_QUESTIONS.length}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Submit Survey
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'morale' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Upcoming Activities</h2>
              <div className="space-y-3">
                {activities.sort((a, b) => b.votes - a.votes).map(a => (
                  <div key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4">
                    <span className="text-3xl">{a.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{a.title}</p>
                      <p className="text-xs text-white/50">{a.date} · {a.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-300">{a.votes}</p>
                        <p className="text-xs text-white/40">votes</p>
                      </div>
                      <button onClick={() => voteActivity(a.id)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 hover:text-white text-sm transition-colors">
                        👍 Vote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Morale Score</h2>
              {morale.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
                  <p className="text-white/30 text-sm">No pulse data yet.<br/>Complete a pulse survey.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {morale.slice(-5).map((m, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-white/50">{m.date}</span>
                        <span className={`text-sm font-bold ${m.score >= 70 ? 'text-emerald-300' : m.score >= 50 ? 'text-yellow-300' : 'text-rose-300'}`}>{m.score}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className={`h-2 rounded-full ${m.score >= 70 ? 'bg-emerald-400' : m.score >= 50 ? 'bg-yellow-400' : 'bg-rose-400'}`} style={{ width: `${m.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50 mb-3">Quick Morale Boosters</p>
                <div className="space-y-2">
                  {['🏆 Announce top performer of month', '☕ Surprise coffee breaks', '🎮 30-min team gaming', '📝 Thank-you note campaign'].map(tip => (
                    <p key={tip} className="text-xs text-white/60 flex items-start gap-2"><span className="mt-0.5">{tip.slice(0, 2)}</span><span>{tip.slice(3)}</span></p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
