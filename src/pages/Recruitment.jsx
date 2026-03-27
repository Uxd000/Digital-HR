import { useState } from 'react';

const columns = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const columnColors = {
  Applied: 'border-blue-500/30 bg-blue-500/5',
  Screening: 'border-yellow-500/30 bg-yellow-500/5',
  Interview: 'border-purple-500/30 bg-purple-500/5',
  Offer: 'border-emerald-500/30 bg-emerald-500/5',
  Rejected: 'border-rose-500/30 bg-rose-500/5',
};

const columnHeaderColors = {
  Applied: 'text-blue-300',
  Screening: 'text-yellow-300',
  Interview: 'text-purple-300',
  Offer: 'text-emerald-300',
  Rejected: 'text-rose-300',
};

const NEXT_STAGES = {
  Applied: 'Screening',
  Screening: 'Interview',
  Interview: 'Offer',
};

// Senior management for scheduling
const seniorManagement = [
  { id: 'm1', name: 'Sarah Kim', role: 'VP Engineering', avatar: 'SK',
    busySlots: ['2026-03-27 10:00', '2026-03-27 14:00', '2026-03-28 09:00'] },
  { id: 'm2', name: 'Raj Sharma', role: 'CTO', avatar: 'RS',
    busySlots: ['2026-03-27 11:00', '2026-03-28 15:00', '2026-03-29 10:00'] },
  { id: 'm3', name: 'Lisa Park', role: 'Head of HR', avatar: 'LP',
    busySlots: ['2026-03-28 10:00', '2026-03-29 11:00'] },
  { id: 'm4', name: 'David Torres', role: 'Head of Product', avatar: 'DT',
    busySlots: ['2026-03-27 09:00', '2026-03-28 14:00', '2026-03-29 16:00'] },
];

// Generate candidate-facing time slots for next 5 days
function generateSlots() {
  const slots = [];
  const base = new Date('2026-03-27');
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  for (let d = 0; d < 5; d++) {
    const date = new Date(base);
    date.setDate(base.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    for (const t of times) {
      slots.push(`${dateStr} ${t}`);
    }
  }
  return slots;
}

function findFreeManager(slot) {
  return seniorManagement.find(m => !m.busySlots.includes(slot)) || null;
}

function ScheduleModal({ candidate, onClose, onScheduled, existingMeeting }) {
  const allSlots = generateSlots();
  const [selected, setSelected] = useState('');
  const [scheduled, setScheduled] = useState(null);

  const handleSchedule = () => {
    if (!selected) return;
    const manager = findFreeManager(selected);
    const meeting = {
      id: Date.now(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateRole: candidate.role,
      slot: selected,
      manager: manager ? manager.name : 'HR Team',
      managerRole: manager ? manager.role : 'HR',
    };
    setScheduled(meeting);
    onScheduled(meeting);
  };

  const slotsByDate = allSlots.reduce((acc, slot) => {
    const [date] = slot.split(' ');
    if (!acc[date]) acc[date] = [];
    const manager = findFreeManager(slot);
    acc[date].push({ slot, manager });
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[560px] max-h-[80vh] overflow-y-auto rounded-2xl bg-gray-900 border border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Schedule Interview</h2>
            <p className="text-sm text-white/60 mt-0.5">{candidate.name} — {candidate.role}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl px-2">✕</button>
        </div>

        {scheduled ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-emerald-200 font-semibold">Interview Scheduled!</p>
            <p className="text-white/70 text-sm mt-2">
              <span className="text-white">{scheduled.slot}</span> with{' '}
              <span className="text-white">{scheduled.manager}</span> ({scheduled.managerRole})
            </p>
            <button onClick={onClose} className="mt-4 px-5 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            {existingMeeting && (
              <div className="mb-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-sm text-purple-200">
                ⚠️ Already scheduled: <strong>{existingMeeting.slot}</strong> with {existingMeeting.manager}
              </div>
            )}
            <p className="text-sm text-white/60 mb-4">
              Select a slot — the system will auto-assign an available manager.
            </p>
            <div className="space-y-4">
              {Object.entries(slotsByDate).map(([date, slots]) => (
                <div key={date}>
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">{date}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map(({ slot, manager }) => (
                      <button
                        key={slot}
                        onClick={() => setSelected(slot)}
                        className={`rounded-lg border px-3 py-2 text-xs text-left transition-all ${
                          selected === slot
                            ? 'border-purple-400 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="font-medium">{slot.split(' ')[1]}</div>
                        <div className="text-white/40 mt-0.5 truncate">
                          {manager ? manager.name.split(' ')[0] : 'Unavailable'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSchedule}
                disabled={!selected}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  selected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                Confirm & Schedule
              </button>
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Recruitment({ candidates, setCandidates, meetings, setMeetings }) {
  const [schedulingFor, setSchedulingFor] = useState(null);
  const [filter, setFilter] = useState('');

  const handleMoveStage = (candidate) => {
    const nextStage = NEXT_STAGES[candidate.stage];
    if (!nextStage) return;
    setCandidates(prev =>
      prev.map(c => c.id === candidate.id ? { ...c, stage: nextStage } : c)
    );
  };

  const handleReject = (candidate) => {
    setCandidates(prev =>
      prev.map(c => c.id === candidate.id ? { ...c, stage: 'Rejected' } : c)
    );
  };

  const handleScheduled = (meeting) => {
    setMeetings(prev => {
      const filtered = prev.filter(m => m.candidateId !== meeting.candidateId);
      return [...filtered, meeting];
    });
  };

  const getMeeting = (candidateId) => meetings?.find(m => m.candidateId === candidateId);

  const filtered = filter
    ? candidates.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) || c.role.toLowerCase().includes(filter.toLowerCase()))
    : candidates;

  return (
    <div className="max-w-full mx-auto p-8 h-full flex flex-col">
      <header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Recruitment Pipeline</h1>
          <p className="text-white/60">Manage candidate progression and AI match scores.</p>
        </div>
        <input
          type="text"
          placeholder="Search candidates..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-400 w-56"
        />
      </header>

      {meetings && meetings.length > 0 && (
        <div className="mb-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
          <p className="text-sm font-semibold text-purple-300 mb-3">📅 Scheduled Interviews</p>
          <div className="flex flex-wrap gap-3">
            {meetings.map(m => (
              <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <span className="text-white font-medium">{m.candidateName}</span>
                <span className="text-white/40 mx-2">·</span>
                <span className="text-purple-300">{m.slot}</span>
                <span className="text-white/40 mx-2">·</span>
                <span className="text-white/60">{m.manager}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex gap-5 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col} className={`w-72 flex-shrink-0 flex flex-col rounded-2xl border ${columnColors[col]} overflow-hidden`}>
            <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className={`font-semibold ${columnHeaderColors[col]}`}>{col}</h2>
                <span className="bg-white/10 text-white/80 text-xs py-1 px-2.5 rounded-full font-medium">
                  {filtered.filter((c) => c.stage === col).length}
                </span>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {filtered.filter((c) => c.stage === col).length === 0 && (
                <p className="text-xs text-white/30 text-center py-4">No candidates</p>
              )}
              {filtered
                .filter((c) => c.stage === col)
                .map((candidate) => {
                  const meeting = getMeeting(candidate.id);
                  return (
                    <div
                      key={candidate.id}
                      className="p-4 rounded-xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-base font-bold text-white">{candidate.name}</h3>
                            <p className="text-xs text-white/60 mt-0.5">{candidate.role}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-500/20 to-purple-600/20 border border-purple-500/30 w-10 h-10 rounded-lg shadow-sm">
                            <span className="text-xs font-bold text-purple-200">{candidate.score}%</span>
                            <span className="text-[9px] text-purple-300/70 font-medium uppercase tracking-wider leading-none">AI</span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(candidate.skills || []).map(skill => (
                            <span key={skill} className="text-[10px] font-medium bg-black/30 border border-white/10 text-white/80 px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {meeting && (
                          <div className="mt-3 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-200">
                            📅 {meeting.slot} · {meeting.manager}
                          </div>
                        )}

                        {col !== 'Rejected' && col !== 'Offer' && (
                          <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                            {NEXT_STAGES[col] && (
                              <button
                                onClick={() => handleMoveStage(candidate)}
                                className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-colors flex items-center justify-center gap-1"
                              >
                                → {NEXT_STAGES[col]}
                              </button>
                            )}
                            {col === 'Interview' && (
                              <button
                                onClick={() => setSchedulingFor(candidate)}
                                className="flex-1 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-semibold text-purple-300 transition-colors"
                              >
                                📅 Schedule
                              </button>
                            )}
                            <button
                              onClick={() => handleReject(candidate)}
                              className="py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        {col === 'Applied' && (
                          <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                            <button
                              onClick={() => handleMoveStage(candidate)}
                              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-colors flex items-center justify-center gap-1"
                            >
                              → Screening
                            </button>
                            <button
                              onClick={() => handleReject(candidate)}
                              className="py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {schedulingFor && (
        <ScheduleModal
          candidate={schedulingFor}
          existingMeeting={getMeeting(schedulingFor.id)}
          onClose={() => setSchedulingFor(null)}
          onScheduled={(m) => {
            handleScheduled(m);
            setSchedulingFor(null);
          }}
        />
      )}
    </div>
  );
}

export default Recruitment;
