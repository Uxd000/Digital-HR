import { useState } from 'react';

function Bar({ value, max = 100, color }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${color}`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

function getRisk(emp) {
  let score = 0;
  if (emp.performance < 65) score += 3;
  else if (emp.performance < 75) score += 1;
  if (emp.attendance < 80) score += 3;
  else if (emp.attendance < 88) score += 1;
  if (emp.tasksPending > 10) score += 2;
  else if (emp.tasksPending > 5) score += 1;
  if (emp.status === 'On Leave') score += 1;
  if (score >= 5) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
}

const riskColors = {
  High: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  Medium: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
  Low: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
};

function AutoAction({ emp, onAction }) {
  const actions = [];
  if (emp.performance < 70) actions.push({ label: 'Send PIP Notice', type: 'pip' });
  if (emp.attendance < 80) actions.push({ label: 'Schedule 1:1', type: 'meeting' });
  if (emp.tasksPending > 8) actions.push({ label: 'Assign Mentor', type: 'mentor' });
  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {actions.map(a => (
        <button
          key={a.type}
          onClick={() => onAction(emp, a)}
          className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

function PerformanceDashboard({ employees }) {
  const [actionLog, setActionLog] = useState([]);
  const [filter, setFilter] = useState('All');

  const risky = employees
    .map(e => ({ ...e, risk: getRisk(e) }))
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.risk] - order[b.risk];
    });

  const filtered = filter === 'All' ? risky : risky.filter(e => e.risk === filter);

  const highCount = risky.filter(e => e.risk === 'High').length;
  const medCount = risky.filter(e => e.risk === 'Medium').length;
  const avgPerf = Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length);
  const avgAtt = Math.round(employees.reduce((s, e) => s + e.attendance, 0) / employees.length);

  const handleAction = (emp, action) => {
    const messages = {
      pip: `📋 PIP notice sent to ${emp.name}`,
      meeting: `📅 1:1 meeting scheduled with ${emp.name}`,
      mentor: `🎓 Mentor assigned to ${emp.name}`,
    };
    setActionLog(prev => [{ id: Date.now(), msg: messages[action.type], time: new Date().toLocaleTimeString() }, ...prev]);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">Performance Dashboard</h1>
        <p className="mt-2 text-white/60">Monitor employee performance and take automated actions for at-risk employees.</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <p className="text-sm text-rose-300/70">High Risk</p>
          <p className="text-3xl font-bold text-rose-300 mt-1">{highCount}</p>
          <p className="text-xs text-white/40 mt-1">employees need attention</p>
        </div>
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm text-yellow-300/70">Medium Risk</p>
          <p className="text-3xl font-bold text-yellow-300 mt-1">{medCount}</p>
          <p className="text-xs text-white/40 mt-1">monitor closely</p>
        </div>
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-sm text-blue-300/70">Avg Performance</p>
          <p className="text-3xl font-bold text-blue-300 mt-1">{avgPerf}%</p>
          <Bar value={avgPerf} color="bg-blue-400" />
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
          <p className="text-sm text-purple-300/70">Avg Attendance</p>
          <p className="text-3xl font-bold text-purple-300 mt-1">{avgAtt}%</p>
          <Bar value={avgAtt} color="bg-purple-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Employee Risk Monitor</h2>
            <div className="flex gap-2">
              {['All', 'High', 'Medium', 'Low'].map(r => (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    filter === r ? 'bg-white/15 border-white/30 text-white' : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(emp => (
              <div key={emp.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center text-white font-bold text-xs border border-white/10">
                      {emp.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{emp.name}</p>
                      <p className="text-xs text-white/50">{emp.role} · {emp.department}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium flex-shrink-0 ${riskColors[emp.risk]}`}>
                    {emp.risk} Risk
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">Performance</span>
                      <span className="text-white">{emp.performance}%</span>
                    </div>
                    <Bar value={emp.performance} color={emp.performance >= 80 ? 'bg-emerald-400' : emp.performance >= 65 ? 'bg-yellow-400' : 'bg-rose-400'} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">Attendance</span>
                      <span className="text-white">{emp.attendance}%</span>
                    </div>
                    <Bar value={emp.attendance} color={emp.attendance >= 85 ? 'bg-emerald-400' : emp.attendance >= 75 ? 'bg-yellow-400' : 'bg-rose-400'} />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                  <span>✅ {emp.tasksCompleted} done</span>
                  <span>⏳ {emp.tasksPending} pending</span>
                  <span className={emp.status === 'On Leave' ? 'text-rose-300' : 'text-emerald-300'}>{emp.status}</span>
                </div>

                {(emp.risk === 'High' || emp.risk === 'Medium') && (
                  <AutoAction emp={emp} onAction={handleAction} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Action Log</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-[200px]">
            {actionLog.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-8">No actions taken yet.<br/>Use the buttons on risky employees.</p>
            ) : (
              <div className="space-y-3">
                {actionLog.map(a => (
                  <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm text-white">{a.msg}</p>
                    <p className="text-xs text-white/40 mt-1">{a.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">Insights</h2>
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Attendance improved by</p>
                <p className="text-2xl font-bold text-emerald-300 mt-1">10%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Employee satisfaction</p>
                <p className="text-2xl font-bold text-purple-300 mt-1">+8%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Avg task completion rate</p>
                <p className="text-2xl font-bold text-blue-300 mt-1">
                  {Math.round(employees.reduce((s, e) => s + (e.tasksCompleted / (e.tasksCompleted + e.tasksPending)) * 100, 0) / employees.length)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceDashboard;
