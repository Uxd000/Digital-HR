import { useState } from 'react';
import Chatbot from '../components/Chatbot';

const EMP_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'attendance', label: 'My Attendance', icon: '📅' },
  { id: 'leave', label: 'Leave & WFH', icon: '📋' },
  { id: 'goals', label: 'My Goals', icon: '🎯' },
  { id: 'feedback', label: 'My Feedback', icon: '💬' },
  { id: 'recognition', label: 'Recognition', icon: '🏅' },
  { id: 'growth', label: 'Career Growth', icon: '📈' },
];

const GROWTH_RESOURCES = [
  { title: 'Advanced React Patterns', type: 'Course', duration: '4h', tag: 'Engineering' },
  { title: 'Effective Communication', type: 'Workshop', duration: '2h', tag: 'Soft Skills' },
  { title: 'Leadership Essentials', type: 'Course', duration: '8h', tag: 'Leadership' },
  { title: 'Data-Driven Decisions', type: 'Webinar', duration: '1h', tag: 'Analytics' },
];

function EmployeeDashboard({ leaveRequests, setLeaveRequests, setRole, userName, userAccount, employees, attendance, setAttendance, feedback, setFeedback, morale, setMorale }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leaveDays, setLeaveDays] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveType, setLeaveType] = useState('leave');
  const [formError, setFormError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [mood, setMood] = useState(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const me = employees?.find(e => e.name === userName) || {};
  const myLeaves = leaveRequests.filter(r => r.employeeName === userName);
  const approvedDays = myLeaves.filter(l => l.status === 'approved').reduce((s, l) => s + l.days, 0);
  const leaveBalance = 20 - approvedDays;
  const myAttToday = attendance?.[todayStr]?.[userAccount?.id] || null;
  const myFeedback = feedback?.filter(f => f.toId === userAccount?.id) || [];

  const handleApplyLeave = () => {
    setFormError('');
    const days = parseInt(leaveDays, 10);
    if (!days || days <= 0) { setFormError('Days must be greater than 0.'); return; }
    if (!leaveReason.trim()) { setFormError('Please provide a reason.'); return; }
    setLeaveRequests(prev => [...prev, {
      id: Date.now().toString(), employeeName: userName,
      employeeId: userAccount?.id, days, reason: leaveReason.trim(),
      status: 'pending', type: leaveType, date: todayStr,
    }]);
    setLeaveDays(''); setLeaveReason('');
    setConfirmation(`${leaveType === 'wfh' ? 'WFH' : 'Leave'} request submitted!`);
    setTimeout(() => setConfirmation(null), 2500);
  };

  const checkIn = () => {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setAttendance(prev => ({
      ...prev,
      [todayStr]: { ...(prev[todayStr] || {}), [userAccount?.id]: { status: 'present', checkIn: t, checkOut: null } }
    }));
  };

  const checkOut = () => {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setAttendance(prev => ({
      ...prev,
      [todayStr]: { ...(prev[todayStr] || {}), [userAccount?.id]: { ...(prev[todayStr]?.[userAccount?.id] || {}), checkOut: t } }
    }));
  };

  const submitMood = (val) => {
    setMood(val);
    setMoodSubmitted(true);
    setMorale(prev => [...prev, { date: new Date().toLocaleDateString(), score: val * 20, from: userName }]);
  };

  const MOODS = ['😞', '😕', '😐', '🙂', '😄'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex">
      <aside className="w-60 bg-black/40 backdrop-blur border-r border-white/10 flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">{me.avatar || '??'}</div>
              <div>
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-white/40">{me.role || 'Employee'}</p>
              </div>
            </div>
          </div>
          <nav className="px-3 py-3 overflow-y-auto flex-1">
            <ul className="space-y-0.5">
              {EMP_NAV.map(item => (
                <li key={item.id}>
                  <button type="button" onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === item.id ? 'text-white bg-white/10 border border-white/15' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-3 pb-4">
            {me.pip && (
              <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                ⚠️ You are currently on a Performance Improvement Plan. Connect with HR.
              </div>
            )}
            <button type="button" onClick={() => setRole(null)} className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto max-h-screen">

        {activeTab === 'dashboard' && (
          <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-white">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {userName?.split(' ')[0]} 👋</h1>
            <p className="text-white/50 mt-1 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            {/* Mood check-in */}
            {!moodSubmitted ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-white mb-3">How are you feeling today?</p>
                <div className="flex gap-3">
                  {MOODS.map((m, i) => (
                    <button key={i} onClick={() => submitMood(i + 1)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-2xl transition-all hover:scale-110">
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">
                Thanks for sharing! Mood logged: {MOODS[mood - 1]}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Leave Balance', value: `${leaveBalance}`, sub: 'days remaining', color: 'text-blue-300', border: 'border-blue-500/20 bg-blue-500/5' },
                { label: 'Performance', value: `${me.performance || 0}%`, sub: me.performance >= 80 ? 'Great work!' : me.performance >= 60 ? 'Room to grow' : 'Needs focus', color: me.performance >= 80 ? 'text-emerald-300' : me.performance >= 60 ? 'text-yellow-300' : 'text-rose-300', border: 'border-white/10 bg-white/5' },
                { label: 'Attendance', value: `${me.attendance || 0}%`, sub: 'this month', color: 'text-purple-300', border: 'border-purple-500/20 bg-purple-500/5' },
                { label: 'Tasks Done', value: `${me.tasksCompleted || 0}`, sub: `${me.tasksPending || 0} pending`, color: 'text-teal-300', border: 'border-teal-500/20 bg-teal-500/5' },
              ].map(k => (
                <div key={k.label} className={`rounded-2xl border p-5 ${k.border}`}>
                  <p className="text-xs text-white/50">{k.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-white/30 mt-1">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Today's attendance */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-white">Today's Attendance</h2>
                {myAttToday && <span className={`text-xs px-3 py-1 rounded-full border ${myAttToday.status === 'present' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : myAttToday.status === 'wfh' ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'}`}>{myAttToday.status}</span>}
              </div>
              <div className="flex gap-3 flex-wrap">
                {!myAttToday?.checkIn ? (
                  <button onClick={checkIn} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 transition-colors">
                    ✓ Check In
                  </button>
                ) : (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/60">Checked in: <span className="text-emerald-300 font-medium">{myAttToday.checkIn}</span></span>
                    {myAttToday.checkOut ? (
                      <span className="text-white/60">Checked out: <span className="text-orange-300 font-medium">{myAttToday.checkOut}</span></span>
                    ) : (
                      <button onClick={checkOut} className="px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold hover:bg-orange-500/25 transition-colors">
                        Clock Out
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {myFeedback.length > 0 && (
              <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
                <h2 className="text-base font-semibold text-white mb-3">Recent Feedback</h2>
                <div className="space-y-2">
                  {myFeedback.slice(-2).map((f, i) => (
                    <div key={i} className={`rounded-xl border p-3 text-sm ${f.type === 'praise' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200' : f.type === 'constructive' ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-200' : 'border-blue-500/20 bg-blue-500/5 text-blue-200'}`}>
                      <p className="font-medium capitalize mb-1">{f.type} Feedback from {f.from}</p>
                      <p className="text-white/70">{f.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-white">My Attendance</h1>
            <p className="mt-2 text-white/60">Track your check-ins and attendance history.</p>
            <div className="mt-6 grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
                <p className="text-3xl font-bold text-emerald-300">{me.attendance || 0}%</p>
                <p className="text-xs text-white/50 mt-1">This month</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                <p className="text-3xl font-bold text-white">{Math.round((me.attendance || 0) * 24 / 100)}</p>
                <p className="text-xs text-white/50 mt-1">Days present</p>
              </div>
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 text-center">
                <p className="text-3xl font-bold text-rose-300">{24 - Math.round((me.attendance || 0) * 24 / 100)}</p>
                <p className="text-xs text-white/50 mt-1">Days absent</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Today</h2>
                {myAttToday && <span className={`text-xs px-3 py-1 rounded-full border ${myAttToday.status === 'present' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-blue-500/15 border-blue-500/30 text-blue-300'}`}>{myAttToday.status}</span>}
              </div>
              <div className="flex gap-3 flex-wrap">
                {!myAttToday?.checkIn ? (
                  <button onClick={checkIn} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 transition-colors">
                    ✓ Check In Now
                  </button>
                ) : (
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className="text-white/60">In: <span className="text-emerald-300 font-semibold">{myAttToday.checkIn}</span></span>
                    {myAttToday.checkOut ? (
                      <span className="text-white/60">Out: <span className="text-orange-300 font-semibold">{myAttToday.checkOut}</span></span>
                    ) : (
                      <button onClick={checkOut} className="px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-sm font-semibold hover:bg-orange-500/25 transition-colors">
                        Clock Out
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-white">Leave & WFH</h1>
            <p className="mt-2 text-white/60">Request leave or work-from-home days.</p>

            <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-sm text-white/50">Leave Balance</p>
                <p className="text-3xl font-bold text-blue-300 mt-1">{leaveBalance} days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/50">Requests Submitted</p>
                <p className="text-3xl font-bold text-white mt-1">{myLeaves.length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
              <h2 className="text-base font-semibold text-white mb-4">New Request</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {['leave', 'wfh'].map(t => (
                    <button key={t} onClick={() => setLeaveType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${leaveType === t ? 'bg-white/15 border-white/30 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}>
                      {t === 'leave' ? '📋 Leave' : '🏠 Work From Home'}
                    </button>
                  ))}
                </div>
                <input type="number" min="1" value={leaveDays} onChange={e => setLeaveDays(e.target.value)}
                  placeholder="Number of days" className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-400" />
                <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} rows={3}
                  placeholder="Reason..." className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-400" />
                {formError && <p className="text-rose-300 text-sm">{formError}</p>}
                {confirmation && <p className="text-emerald-300 text-sm">{confirmation}</p>}
                <button onClick={handleApplyLeave} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-colors">
                  Submit Request
                </button>
              </div>
            </div>

            <h2 className="text-base font-semibold text-white mb-3">My Requests</h2>
            {myLeaves.length === 0 ? (
              <p className="text-sm text-white/40">No requests yet.</p>
            ) : (
              <div className="space-y-3">
                {myLeaves.map(req => (
                  <div key={req.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white text-sm">{req.days} day{req.days !== 1 ? 's' : ''}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${req.type === 'wfh' ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : 'bg-purple-500/15 border-purple-500/30 text-purple-300'}`}>{req.type === 'wfh' ? 'WFH' : 'Leave'}</span>
                      </div>
                      {req.reason && <p className="text-xs text-white/50 mt-0.5">{req.reason}</p>}
                    </div>
                    <span className={`text-xs font-semibold rounded-full px-3 py-1 border ${req.status === 'pending' ? 'bg-yellow-500/15 border-yellow-500/35 text-yellow-300' : req.status === 'approved' ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200' : 'bg-rose-500/15 border-rose-500/35 text-rose-200'}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-white">My Goals</h1>
            <p className="mt-2 text-white/60">Track your OKRs and professional objectives.</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60 text-center py-8">Your manager and HR will assign goals here. Check back soon, or ask your manager to set your Q2 OKRs.</p>
              <div className="flex justify-center">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 max-w-sm text-center">
                  <p className="text-4xl mb-3">🎯</p>
                  <p className="text-white font-semibold">Goal Setting In Progress</p>
                  <p className="text-white/50 text-sm mt-2">Q2 2026 goals are being set by your manager.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-white">My Feedback</h1>
            <p className="mt-2 text-white/60">Feedback shared with you from HR and management.</p>
            <div className="mt-6 space-y-4">
              {myFeedback.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
                  <p className="text-3xl mb-3">💬</p>
                  <p className="text-white/40">No feedback yet. Keep up the great work!</p>
                </div>
              ) : myFeedback.map((f, i) => (
                <div key={i} className={`rounded-2xl border p-5 ${f.type === 'praise' ? 'border-emerald-500/20 bg-emerald-500/5' : f.type === 'constructive' ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-blue-500/20 bg-blue-500/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${f.type === 'praise' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : f.type === 'constructive' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' : 'bg-blue-500/20 border-blue-500/30 text-blue-300'}`}>
                      {f.type === 'praise' ? '🌟 Praise' : f.type === 'constructive' ? '💡 Constructive' : '📈 Development'}
                    </span>
                    <span className="text-xs text-white/30">{f.date} · {f.from}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{f.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recognition' && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-white">Recognition</h1>
            <p className="mt-2 text-white/60">Badges and shoutouts you've received.</p>
            <div className="mt-6 rounded-2xl border border-dashed border-yellow-500/20 bg-yellow-500/5 p-12 text-center">
              <p className="text-4xl mb-3">🏅</p>
              <p className="text-white/60">No badges yet — keep excelling and HR will recognize your contributions!</p>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-white">Career Growth</h1>
            <p className="mt-2 text-white/60">Learning resources and career development paths.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {GROWTH_RESOURCES.map((r, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${r.type === 'Course' ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : r.type === 'Workshop' ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' : 'bg-teal-500/15 border-teal-500/30 text-teal-300'}`}>
                      {r.type}
                    </span>
                    <span className="text-xs text-white/40">{r.duration}</span>
                  </div>
                  <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">{r.title}</p>
                  <p className="text-xs text-white/40 mt-1">{r.tag}</p>
                  <button className="mt-4 w-full py-2 rounded-xl border border-white/10 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    Start Learning →
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
              <h2 className="text-base font-semibold text-white mb-2">Your Development Path</h2>
              <p className="text-sm text-white/60 mb-4">Based on your role as <strong className="text-white">{me.role || 'N/A'}</strong>, here's a suggested growth path:</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Current Role', '→', 'Senior ' + (me.role?.split(' ')[0] || 'Engineer'), '→', 'Lead / Manager', '→', 'Director'].map((step, i) => (
                  <span key={i} className={`text-sm px-3 py-1.5 rounded-full ${step === '→' ? 'text-white/30' : i === 0 ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' : 'bg-white/5 border border-white/10 text-white/50'}`}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Chatbot role="employee" userName={userName} employees={employees} leaveRequests={leaveRequests} />
    </div>
  );
}

export default EmployeeDashboard;
