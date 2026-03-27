import { useState } from 'react';
import Chatbot from '../components/Chatbot';
import ResumeAnalyzer from './ResumeAnalyzer';
import Recruitment from './Recruitment';
import Employees from './Employees';
import PerformanceDashboard from './PerformanceDashboard';
import AttendanceTracker from './AttendanceTracker';
import AIInsights from './AIInsights';
import TalentManagement from './TalentManagement';
import EmployeeExperience from './EmployeeExperience';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'attendance', label: 'Attendance', icon: '📅', badge: 'leave' },
  { id: 'leave', label: 'Leave Requests', icon: '📋', badge: 'leave' },
  { id: 'performance', label: 'Performance', icon: '📊', badge: 'perf' },
  { id: 'talent', label: 'Talent Management', icon: '🎯' },
  { id: 'experience', label: 'Employee Experience', icon: '❤️' },
  { id: 'resume', label: 'Resume Analyzer', icon: '🔍' },
  { id: 'recruitment', label: 'Recruitment Pipeline', icon: '🚀' },
  { id: 'insights', label: 'AI Insights', icon: '✨' },
];

function HRDashboard({ leaveRequests, setLeaveRequests, candidates, setCandidates, employees, setEmployees, meetings, setMeetings, attendance, setAttendance, feedback, setFeedback, morale, setMorale, setRole, userName }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const pendingLeave = leaveRequests.filter(r => r.status === 'pending').length;
  const lowPerf = employees.filter(e => e.performance < 70).length;
  const pipCount = employees.filter(e => e.pip).length;
  const activeEmp = employees.filter(e => e.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex">
      <aside className="w-64 bg-black/40 backdrop-blur border-r border-white/10 flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">HR</div>
              <div>
                <p className="text-sm font-semibold text-white truncate">{userName || 'HR'}</p>
                <p className="text-xs text-white/40">HR Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="px-3 py-3 overflow-y-auto flex-1">
            <ul className="space-y-0.5">
              {NAV.map(item => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                      activeTab === item.id
                        ? 'text-white bg-white/10 border border-white/15'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge === 'leave' && item.id === 'leave' && pendingLeave > 0 && (
                      <span className="text-xs bg-yellow-500/25 border border-yellow-500/30 text-yellow-300 rounded-full px-1.5 py-0.5">{pendingLeave}</span>
                    )}
                    {item.badge === 'perf' && lowPerf > 0 && (
                      <span className="text-xs bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-full px-1.5 py-0.5">{lowPerf}</span>
                    )}
                    {item.id === 'insights' && <span className="text-xs bg-purple-500/25 border border-purple-500/30 text-purple-300 rounded-full px-1.5 py-0.5">AI</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-3 pb-4">
            <button
              type="button"
              onClick={() => setRole(null)}
              className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto max-h-screen">
        {activeTab === 'resume' && <ResumeAnalyzer setCandidates={setCandidates} />}
        {activeTab === 'recruitment' && <Recruitment candidates={candidates} setCandidates={setCandidates} meetings={meetings} setMeetings={setMeetings} />}
        {activeTab === 'employees' && <Employees employees={employees} />}
        {activeTab === 'performance' && <PerformanceDashboard employees={employees} />}
        {activeTab === 'attendance' && <AttendanceTracker employees={employees} attendance={attendance} setAttendance={setAttendance} leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} />}
        {activeTab === 'insights' && <AIInsights employees={employees} candidates={candidates} leaveRequests={leaveRequests} meetings={meetings} attendance={attendance} />}
        {activeTab === 'talent' && <TalentManagement employees={employees} />}
        {activeTab === 'experience' && <EmployeeExperience employees={employees} feedback={feedback} setFeedback={setFeedback} morale={morale} setMorale={setMorale} />}

        {activeTab === 'leave' && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold tracking-tight text-white">Leave Requests</h1>
            <p className="mt-3 text-white/60">Review and action employee leave and WFH requests.</p>
            <div className="mt-6 space-y-3">
              {leaveRequests.length === 0 ? (
                <div className="text-sm text-white/60">No leave requests yet.</div>
              ) : (
                leaveRequests.map(req => {
                  const isPending = req.status === 'pending';
                  return (
                    <div key={req.id} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{req.employeeName}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${req.type === 'wfh' ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : 'bg-purple-500/15 border-purple-500/30 text-purple-300'}`}>
                              {req.type === 'wfh' ? '🏠 WFH' : '📋 Leave'}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 mt-0.5">{req.days} day{req.days !== 1 ? 's' : ''}</p>
                          {req.reason && <p className="mt-1 text-sm text-white/50 italic">"{req.reason}"</p>}
                        </div>
                        <div className="flex gap-2 items-center">
                          {isPending && (
                            <>
                              <button onClick={() => setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r))} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors">Approve</button>
                              <button onClick={() => setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r))} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors">Reject</button>
                            </>
                          )}
                          <span className={`text-xs font-semibold rounded-full px-3 py-1 border ${isPending ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300' : req.status === 'approved' ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200' : 'bg-rose-500/15 border-rose-500/35 text-rose-200'}`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-4xl font-bold tracking-tight text-white">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {userName?.split(' ')[0] || 'HR'} 👋</h1>
            <p className="mt-2 text-white/60">Here's your HR overview for today.</p>

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Employees', value: employees.length, sub: `${activeEmp} active`, color: 'text-blue-300', border: 'border-blue-500/20 bg-blue-500/5' },
                { label: 'Pending Leaves', value: pendingLeave, sub: 'need approval', color: 'text-yellow-300', border: 'border-yellow-500/20 bg-yellow-500/5' },
                { label: 'On PIP', value: pipCount, sub: 'performance plans', color: 'text-rose-300', border: 'border-rose-500/20 bg-rose-500/5' },
                { label: 'Open Pipeline', value: candidates.length, sub: `${candidates.filter(c=>c.stage==='Offer').length} at offer`, color: 'text-purple-300', border: 'border-purple-500/20 bg-purple-500/5' },
              ].map(k => (
                <div key={k.label} className={`rounded-2xl border p-5 ${k.border}`}>
                  <p className="text-xs text-white/50">{k.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-white/30 mt-1">{k.sub}</p>
                </div>
              ))}
            </div>

            {pipCount > 0 && (
              <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-center gap-4">
                <span className="text-2xl">🚨</span>
                <div className="flex-1">
                  <p className="font-semibold text-rose-200">Auto-PIP Alert</p>
                  <p className="text-sm text-rose-300/70">{employees.filter(e => e.pip).map(e => e.name).join(', ')} {pipCount === 1 ? 'has been' : 'have been'} automatically placed on PIP (performance below 30%).</p>
                </div>
                <button onClick={() => setActiveTab('performance')} className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 border border-rose-500/30 text-rose-200 hover:bg-rose-500/30 transition-colors flex-shrink-0">
                  View Details →
                </button>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">Employees</h2>
                  <button onClick={() => setActiveTab('employees')} className="text-xs text-purple-300 hover:text-purple-200">View all →</button>
                </div>
                <div className="space-y-2">
                  {employees.slice(0, 5).map(emp => (
                    <div key={emp.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center text-white text-xs font-bold border border-white/10 flex-shrink-0">{emp.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{emp.name}</p>
                        <p className="text-xs text-white/40 truncate">{emp.role}</p>
                      </div>
                      <div className="text-right hidden sm:block flex-shrink-0">
                        <p className={`text-sm font-bold ${emp.performance >= 80 ? 'text-emerald-300' : emp.performance >= 60 ? 'text-yellow-300' : 'text-rose-300'}`}>{emp.performance}%</p>
                        <p className="text-xs text-white/30">perf</p>
                      </div>
                      {emp.pip && <span className="text-xs px-2 py-0.5 rounded-full border bg-rose-500/15 border-rose-500/30 text-rose-300 flex-shrink-0">PIP</span>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: '🔍 Analyze Resume', tab: 'resume' },
                    { label: '🚀 View Pipeline', tab: 'recruitment' },
                    { label: '📅 Attendance Today', tab: 'attendance' },
                    { label: '✨ Generate Insights', tab: 'insights' },
                    { label: '❤️ Employee Experience', tab: 'experience' },
                    { label: '🎯 Talent Management', tab: 'talent' },
                  ].map(a => (
                    <button key={a.tab} onClick={() => setActiveTab(a.tab)} className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      {a.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <Chatbot role="hr" userName={userName} employees={employees} leaveRequests={leaveRequests} candidates={candidates} />
    </div>
  );
}

export default HRDashboard;
