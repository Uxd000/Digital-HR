import { useState } from 'react';

const STATUS_CONFIG = {
  present: { label: 'Present', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', dot: 'bg-emerald-400' },
  wfh: { label: 'Work From Home', color: 'bg-blue-500/15 border-blue-500/30 text-blue-300', dot: 'bg-blue-400' },
  leave: { label: 'On Leave', color: 'bg-purple-500/15 border-purple-500/30 text-purple-300', dot: 'bg-purple-400' },
  absent: { label: 'Absent', color: 'bg-rose-500/15 border-rose-500/30 text-rose-300', dot: 'bg-rose-400' },
  pending: { label: 'Pending', color: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300', dot: 'bg-yellow-400' },
};

function AttendanceTracker({ employees, attendance, setAttendance, leaveRequests, setLeaveRequests }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [tab, setTab] = useState('attendance'); // 'attendance' | 'leave' | 'wfh'

  const todayAttendance = attendance[selectedDate] || {};

  const getStatus = (empId) => todayAttendance[empId] || { status: 'absent', checkIn: null, checkOut: null };

  const setStatus = (empId, status) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setAttendance(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [empId]: {
          status,
          checkIn: status === 'present' || status === 'wfh' ? timeStr : null,
          checkOut: null,
        }
      }
    }));
  };

  const markCheckout = (empId) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setAttendance(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [empId]: { ...(prev[selectedDate]?.[empId] || {}), checkOut: timeStr }
      }
    }));
  };

  const presentCount = employees.filter(e => getStatus(e.id).status === 'present').length;
  const wfhCount = employees.filter(e => getStatus(e.id).status === 'wfh').length;
  const leaveCount = employees.filter(e => getStatus(e.id).status === 'leave').length;
  const absentCount = employees.filter(e => getStatus(e.id).status === 'absent').length;

  const pendingLeave = leaveRequests.filter(r => r.status === 'pending' && r.type === 'leave');
  const pendingWFH = leaveRequests.filter(r => r.status === 'pending' && r.type === 'wfh');
  const approvedToday = leaveRequests.filter(r => r.status === 'approved' && r.date === todayStr);

  const handleLeaveAction = (id, action) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">Attendance Tracker</h1>
        <p className="mt-2 text-white/60">Real-time attendance, leave approvals, and WFH management.</p>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Present', val: presentCount, cfg: STATUS_CONFIG.present },
          { label: 'Work From Home', val: wfhCount, cfg: STATUS_CONFIG.wfh },
          { label: 'On Leave', val: leaveCount, cfg: STATUS_CONFIG.leave },
          { label: 'Absent', val: absentCount, cfg: STATUS_CONFIG.absent },
        ].map(k => (
          <div key={k.label} className={`rounded-2xl border p-5 ${k.cfg.color}`}>
            <p className="text-sm opacity-70">{k.label}</p>
            <p className="text-3xl font-bold mt-1">{k.val}</p>
            <p className="text-xs opacity-50 mt-1">of {employees.length} total</p>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'attendance', label: '📋 Daily Attendance' },
          { id: 'leave', label: `📩 Leave Requests ${pendingLeave.length > 0 ? `(${pendingLeave.length})` : ''}` },
          { id: 'wfh', label: `🏠 WFH Requests ${pendingWFH.length > 0 ? `(${pendingWFH.length})` : ''}` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              tab === t.id ? 'bg-white/15 border-white/30 text-white' : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'attendance' && (
        <>
          <div className="flex items-center gap-4 mb-5">
            <label className="text-sm text-white/60">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
            {selectedDate === todayStr && (
              <span className="text-xs px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">Today</span>
            )}
          </div>

          <div className="space-y-3">
            {employees.map(emp => {
              const rec = getStatus(emp.id);
              const cfg = STATUS_CONFIG[rec.status] || STATUS_CONFIG.absent;
              return (
                <div key={emp.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 flex-wrap">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center text-white font-bold text-xs border border-white/10 flex-shrink-0">
                    {emp.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{emp.name}</p>
                    <p className="text-xs text-white/50">{emp.role}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    {rec.checkIn && <span>In: <span className="text-white">{rec.checkIn}</span></span>}
                    {rec.checkOut && <span>Out: <span className="text-white">{rec.checkOut}</span></span>}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  {selectedDate === todayStr && (
                    <div className="flex gap-1.5 flex-wrap">
                      {['present', 'wfh', 'absent'].map(s => (
                        <button
                          key={s}
                          onClick={() => setStatus(emp.id, s)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                            rec.status === s
                              ? STATUS_CONFIG[s].color
                              : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {s === 'present' ? '✓ Present' : s === 'wfh' ? '🏠 WFH' : '✗ Absent'}
                        </button>
                      ))}
                      {rec.status === 'present' && !rec.checkOut && (
                        <button
                          onClick={() => markCheckout(emp.id)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 transition-colors"
                        >
                          Clock Out
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'leave' && (
        <div className="space-y-4">
          {pendingLeave.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Pending Approval</h3>
              <div className="space-y-3">
                {pendingLeave.map(req => (
                  <div key={req.id} className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold text-white">{req.employeeName}</p>
                      <p className="text-sm text-white/60 mt-1">{req.days} day{req.days !== 1 ? 's' : ''} · {req.date}</p>
                      {req.reason && <p className="text-sm text-white/50 mt-1 italic">"{req.reason}"</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleLeaveAction(req.id, 'approved')} className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors">
                        ✓ Approve
                      </button>
                      <button onClick={() => handleLeaveAction(req.id, 'rejected')} className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors">
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Approved Leaves Today</h3>
            {approvedToday.filter(r => r.type === 'leave').length === 0
              ? <p className="text-sm text-white/30">No approved leaves today.</p>
              : approvedToday.filter(r => r.type === 'leave').map(req => (
                <div key={req.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{req.employeeName}</p>
                    <p className="text-xs text-white/50">{req.days} day{req.days !== 1 ? 's' : ''} · {req.reason}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full border bg-emerald-500/15 border-emerald-500/30 text-emerald-300">Approved</span>
                </div>
              ))
            }
          </div>

          {pendingLeave.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/40">No pending leave requests</p>
            </div>
          )}
        </div>
      )}

      {tab === 'wfh' && (
        <div className="space-y-4">
          {pendingWFH.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Pending WFH Requests</h3>
              <div className="space-y-3">
                {pendingWFH.map(req => (
                  <div key={req.id} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold text-white">{req.employeeName}</p>
                      <p className="text-sm text-white/60 mt-1">{req.days} day{req.days !== 1 ? 's' : ''} · {req.date}</p>
                      {req.reason && <p className="text-sm text-white/50 mt-1 italic">"{req.reason}"</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleLeaveAction(req.id, 'approved')} className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors">
                        ✓ Approve WFH
                      </button>
                      <button onClick={() => handleLeaveAction(req.id, 'rejected')} className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors">
                        ✗ Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Approved WFH Today</h3>
            {approvedToday.filter(r => r.type === 'wfh').length === 0
              ? <p className="text-sm text-white/30">No approved WFH today.</p>
              : approvedToday.filter(r => r.type === 'wfh').map(req => (
                <div key={req.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{req.employeeName}</p>
                    <p className="text-xs text-white/50">{req.reason}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full border bg-blue-500/15 border-blue-500/30 text-blue-300">WFH Approved</span>
                </div>
              ))
            }
          </div>

          {pendingWFH.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/40">No pending WFH requests</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendanceTracker;
