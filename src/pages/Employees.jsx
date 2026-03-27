import { useState } from 'react';

const departmentColors = {
  Engineering: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  Design: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  Infrastructure: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  Analytics: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
};

function PerformanceBadge({ score }) {
  if (score >= 85) return <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-medium">High</span>;
  if (score >= 70) return <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/15 border-yellow-500/30 text-yellow-300 font-medium">Medium</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full border bg-rose-500/15 border-rose-500/30 text-rose-300 font-medium">Low</span>;
}

function Bar({ value, color }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function EmployeeDetailModal({ emp, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[520px] rounded-2xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {emp.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{emp.name}</h2>
                <p className="text-white/60 text-sm">{emp.role}</p>
                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full border ${departmentColors[emp.department] || 'bg-white/10 border-white/20 text-white/60'}`}>
                  {emp.department}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white text-xl px-2">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 mb-1">Email</p>
              <p className="text-sm text-white">{emp.email}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 mb-1">Phone</p>
              <p className="text-sm text-white">{emp.phone}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 mb-1">Join Date</p>
              <p className="text-sm text-white">{emp.joinDate}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 mb-1">Manager</p>
              <p className="text-sm text-white">{emp.manager}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 mb-1">Salary (Annual)</p>
              <p className="text-sm text-white font-semibold">{emp.salary}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 mb-1">Status</p>
              <span className={`text-xs font-semibold rounded-full px-2.5 py-1 border ${
                emp.status === 'On Leave' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              }`}>{emp.status}</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Performance</span>
                <span className="text-white font-medium">{emp.performance}%</span>
              </div>
              <Bar value={emp.performance} color={emp.performance >= 80 ? 'bg-emerald-400' : emp.performance >= 60 ? 'bg-yellow-400' : 'bg-rose-400'} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Attendance</span>
                <span className="text-white font-medium">{emp.attendance}%</span>
              </div>
              <Bar value={emp.attendance} color="bg-blue-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-300">{emp.tasksCompleted}</p>
              <p className="text-xs text-white/50 mt-1">Tasks Completed</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-300">{emp.tasksPending}</p>
              <p className="text-xs text-white/50 mt-1">Tasks Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Employees({ employees }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const departments = ['All', ...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">Employees</h1>
        <p className="mt-2 text-white/60">Browse and manage your workforce.</p>
      </header>

      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                deptFilter === d
                  ? 'bg-white/15 border-white/30 text-white'
                  : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-400 w-56"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(emp => (
          <div
            key={emp.id}
            onClick={() => setSelected(emp)}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 cursor-pointer hover:bg-white/10 hover:-translate-y-0.5 transition-all shadow-lg group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/40 to-purple-600/40 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                {emp.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{emp.name}</p>
                <p className="text-xs text-white/50 truncate">{emp.role}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${
                emp.status === 'On Leave' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              }`}>{emp.status}</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Performance</span>
                  <span className="text-white/70">{emp.performance}%</span>
                </div>
                <Bar value={emp.performance} color={emp.performance >= 80 ? 'bg-emerald-400' : emp.performance >= 60 ? 'bg-yellow-400' : 'bg-rose-400'} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Attendance</span>
                  <span className="text-white/70">{emp.attendance}%</span>
                </div>
                <Bar value={emp.attendance} color="bg-blue-400" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${departmentColors[emp.department] || 'bg-white/10 border-white/20 text-white/60'}`}>
                {emp.department}
              </span>
              <PerformanceBadge score={emp.performance} />
            </div>
          </div>
        ))}
      </div>

      {selected && <EmployeeDetailModal emp={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default Employees;
