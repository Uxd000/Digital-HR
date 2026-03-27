import { useState } from 'react';

const GOALS = [
  { id: 'g1', empId: 'e1', title: 'Complete AWS Certification', deadline: '2026-06-30', status: 'in-progress', progress: 60 },
  { id: 'g2', empId: 'e2', title: 'Lead 2 product design sprints', deadline: '2026-05-15', status: 'in-progress', progress: 50 },
  { id: 'g3', empId: 'e4', title: 'Mentor junior engineers', deadline: '2026-04-30', status: 'completed', progress: 100 },
  { id: 'g4', empId: 'e6', title: 'Implement CI/CD pipeline', deadline: '2026-04-01', status: 'overdue', progress: 30 },
  { id: 'g5', empId: 'e5', title: 'Build analytics dashboard', deadline: '2026-05-01', status: 'not-started', progress: 0 },
];

const TRAINING = [
  { id: 't1', title: 'Advanced React Patterns', dept: 'Engineering', duration: '4h', enrolled: ['e1', 'e6'], status: 'available' },
  { id: 't2', title: 'Design Systems Mastery', dept: 'Design', duration: '6h', enrolled: ['e2'], status: 'available' },
  { id: 't3', title: 'Leadership Essentials', dept: 'All', duration: '8h', enrolled: ['e4'], status: 'available' },
  { id: 't4', title: 'Data Storytelling with Python', dept: 'Analytics', duration: '5h', enrolled: [], status: 'available' },
  { id: 't5', title: 'Performance Improvement Workshop', dept: 'All', duration: '3h', enrolled: ['e3', 'e5'], status: 'pip-recommended' },
];

const SUCCESSION = [
  { role: 'Senior Engineer', readyNow: 'e4', readySoon: 'e1', developing: 'e6' },
  { role: 'Design Lead', readyNow: null, readySoon: 'e2', developing: null },
  { role: 'Analytics Lead', readyNow: null, readySoon: null, developing: 'e5' },
];

const statusConfig = {
  'completed': 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  'in-progress': 'text-blue-300 border-blue-500/30 bg-blue-500/10',
  'overdue': 'text-rose-300 border-rose-500/30 bg-rose-500/10',
  'not-started': 'text-white/40 border-white/10 bg-white/5',
  'available': 'text-teal-300 border-teal-500/30 bg-teal-500/10',
  'pip-recommended': 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10',
};

export default function TalentManagement({ employees }) {
  const [tab, setTab] = useState('goals');
  const [goals, setGoals] = useState(GOALS);
  const [training] = useState(TRAINING);
  const [newGoal, setNewGoal] = useState({ empId: '', title: '', deadline: '' });
  const [showGoalForm, setShowGoalForm] = useState(false);

  const getEmp = (id) => employees.find(e => e.id === id);

  const addGoal = () => {
    if (!newGoal.empId || !newGoal.title) return;
    setGoals(prev => [...prev, { id: `g${Date.now()}`, ...newGoal, status: 'not-started', progress: 0 }]);
    setNewGoal({ empId: '', title: '', deadline: '' });
    setShowGoalForm(false);
  };

  const updateProgress = (id, progress) => {
    setGoals(prev => prev.map(g => g.id === id ? {
      ...g, progress: Number(progress),
      status: Number(progress) === 100 ? 'completed' : Number(progress) > 0 ? 'in-progress' : 'not-started'
    } : g));
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">Talent Management</h1>
        <p className="mt-2 text-white/60">Goal tracking, training programs, and succession planning.</p>
      </header>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'goals', label: '🎯 Goals & OKRs' },
          { id: 'training', label: '📚 Training' },
          { id: 'succession', label: '🏆 Succession Planning' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${tab === t.id ? 'bg-white/15 border-white/30 text-white' : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'goals' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-3 text-sm">
              <span className="text-emerald-300">{goals.filter(g => g.status === 'completed').length} completed</span>
              <span className="text-blue-300">{goals.filter(g => g.status === 'in-progress').length} in progress</span>
              <span className="text-rose-300">{goals.filter(g => g.status === 'overdue').length} overdue</span>
            </div>
            <button onClick={() => setShowGoalForm(v => !v)} className="text-sm px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors">
              + Add Goal
            </button>
          </div>

          {showGoalForm && (
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 mb-5">
              <h3 className="text-sm font-semibold text-white mb-3">New Goal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select value={newGoal.empId} onChange={e => setNewGoal(p => ({ ...p, empId: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="">Select employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <input value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))}
                  placeholder="Goal title" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-400" />
                <input type="date" value={newGoal.deadline} onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <button onClick={addGoal} className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors">
                Add Goal
              </button>
            </div>
          )}

          <div className="space-y-3">
            {goals.map(goal => {
              const emp = getEmp(goal.empId);
              return (
                <div key={goal.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                        {emp?.avatar || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{goal.title}</p>
                        <p className="text-xs text-white/50">{emp?.name} · Due {goal.deadline}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusConfig[goal.status]}`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${goal.status === 'completed' ? 'bg-emerald-400' : goal.status === 'overdue' ? 'bg-rose-400' : 'bg-blue-400'}`}
                        style={{ width: `${goal.progress}%` }} />
                    </div>
                    <input type="range" min={0} max={100} value={goal.progress}
                      onChange={e => updateProgress(goal.id, e.target.value)}
                      className="w-20 accent-purple-500" />
                    <span className="text-xs text-white/50 w-8 text-right">{goal.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'training' && (
        <div className="space-y-4">
          {training.map(t => (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-white">{t.title}</p>
                    {t.status === 'pip-recommended' && (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/15 border-yellow-500/30 text-yellow-300">PIP Recommended</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50">{t.dept} · {t.duration}</p>
                  {t.enrolled.length > 0 && (
                    <div className="mt-2 flex gap-1.5">
                      {t.enrolled.map(id => {
                        const emp = getEmp(id);
                        return emp ? (
                          <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/60">{emp.name.split(' ')[0]}</span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-white/40">{t.enrolled.length} enrolled</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'succession' && (
        <div className="space-y-4">
          <p className="text-sm text-white/50 mb-4">Succession planning ensures leadership continuity across critical roles.</p>
          {SUCCESSION.map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white mb-4">{s.role}</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Ready Now', id: s.readyNow, color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' },
                  { label: 'Ready in 6–12 months', id: s.readySoon, color: 'border-blue-500/30 bg-blue-500/5 text-blue-300' },
                  { label: 'In Development', id: s.developing, color: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300' },
                ].map(col => {
                  const emp = col.id ? getEmp(col.id) : null;
                  return (
                    <div key={col.label} className={`rounded-xl border p-4 ${col.color}`}>
                      <p className="text-xs opacity-70 mb-2">{col.label}</p>
                      {emp ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">{emp.avatar}</div>
                          <div>
                            <p className="text-sm font-semibold text-white">{emp.name.split(' ')[0]}</p>
                            <p className="text-xs opacity-60">{emp.role}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs opacity-40">Not identified</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
