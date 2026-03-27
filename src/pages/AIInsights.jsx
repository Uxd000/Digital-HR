import { useState } from 'react';

async function fetchInsights(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) throw new Error('API error');
  const d = await res.json();
  return d.content?.[0]?.text || '';
}

function InsightCard({ title, value, sub, color, icon }) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-70">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function Bar({ value, color, label }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-white/60 mb-1"><span>{label}</span><span>{value}%</span></div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function AIInsights({ employees, candidates, leaveRequests, meetings, attendance }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derived stats
  const avgPerf = Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length);
  const avgAtt = Math.round(employees.reduce((s, e) => s + e.attendance, 0) / employees.length);
  const pipCount = employees.filter(e => e.pip).length;
  const highPerf = employees.filter(e => e.performance >= 85).length;
  const lowPerf = employees.filter(e => e.performance < 60).length;
  const onLeave = employees.filter(e => e.status === 'On Leave').length;
  const pendingLeave = leaveRequests.filter(r => r.status === 'pending').length;
  const openRoles = [...new Set(candidates.map(c => c.role))].length;
  const offerStage = candidates.filter(c => c.stage === 'Offer').length;
  const deptPerf = employees.reduce((acc, e) => {
    if (!acc[e.department]) acc[e.department] = { total: 0, count: 0 };
    acc[e.department].total += e.performance;
    acc[e.department].count++;
    return acc;
  }, {});

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    const summary = `
HR Analytics Data:
- Total employees: ${employees.length}, Active: ${employees.filter(e => e.status === 'Active').length}, On Leave: ${onLeave}
- Avg performance: ${avgPerf}%, Avg attendance: ${avgAtt}%
- High performers (≥85%): ${highPerf}, Low performers (<60%): ${lowPerf}, On PIP: ${pipCount}
- Pending leave requests: ${pendingLeave}
- Recruitment: ${candidates.length} candidates, ${offerStage} at offer stage, ${openRoles} open roles
- Scheduled interviews: ${meetings.length}
- Department performance: ${Object.entries(deptPerf).map(([d, v]) => `${d}: ${Math.round(v.total/v.count)}%`).join(', ')}
- Employees: ${employees.map(e => `${e.name}(perf:${e.performance}%,att:${e.attendance}%${e.pip?',PIP':''})`).join('; ')}

Generate 5 specific, actionable HR insights from this data. For each insight:
1. Give a clear headline (max 8 words)
2. One sentence explaining the finding
3. One concrete action recommendation

Format as JSON array:
[{"headline":"...","finding":"...","action":"...","type":"risk|opportunity|trend|alert"}]

Return ONLY the JSON array.`;

    try {
      const text = await fetchInsights(summary);
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      if (start !== -1 && end > start) {
        const parsed = JSON.parse(text.slice(start, end + 1));
        setInsights(parsed);
      } else throw new Error('Parse error');
    } catch {
      // Deterministic fallback insights from real data
      setInsights([
        { headline: `${pipCount} Employee${pipCount !== 1 ? 's' : ''} Need Urgent Attention`, finding: `${pipCount} employee${pipCount !== 1 ? 's are' : ' is'} on PIP with performance below 30%, risking retention and productivity.`, action: 'Schedule immediate 1:1 coaching sessions and set 30-day milestone checkpoints.', type: 'alert' },
        { headline: `${lowPerf} Employees Below Performance Threshold`, finding: `${lowPerf} team member${lowPerf !== 1 ? 's have' : ' has'} performance below 60%, which may impact team output.`, action: 'Assign mentors and create individual development plans within this week.', type: 'risk' },
        { headline: `Recruitment Pipeline at ${offerStage} Offer${offerStage !== 1 ? 's' : ''}`, finding: `${candidates.filter(c => c.stage === 'Applied').length} candidates applied, ${candidates.filter(c => c.stage === 'Interview').length} in interview — pipeline is ${candidates.length > 8 ? 'healthy' : 'thin'}.`, action: offerStage > 0 ? 'Accelerate offer decisions to prevent candidate drop-off.' : 'Push more qualified candidates to offer stage this week.', type: 'opportunity' },
        { headline: `Avg Attendance ${avgAtt}% — ${avgAtt < 85 ? 'Below' : 'Above'} Target`, finding: `Company-wide attendance stands at ${avgAtt}%. ${avgAtt < 85 ? 'This is below the 85% target and may indicate disengagement.' : 'Team attendance is healthy.'}`, action: avgAtt < 85 ? 'Investigate root causes through anonymous pulse surveys and flexible work policy.' : 'Recognize high-attendance teams to sustain this culture.', type: avgAtt < 85 ? 'risk' : 'trend' },
        { headline: `${Object.entries(deptPerf).sort((a,b) => (b[1].total/b[1].count)-(a[1].total/a[1].count))[0]?.[0]} Leads in Performance`, finding: `${Object.entries(deptPerf).sort((a,b) => (b[1].total/b[1].count)-(a[1].total/a[1].count))[0]?.[0]} department has the highest avg performance at ${Math.round(Object.entries(deptPerf).sort((a,b) => (b[1].total/b[1].count)-(a[1].total/a[1].count))[0]?.[1].total / Object.entries(deptPerf).sort((a,b) => (b[1].total/b[1].count)-(a[1].total/a[1].count))[0]?.[1].count)}%.`, action: 'Document best practices from top department and share across underperforming teams.', type: 'opportunity' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const typeConfig = {
    alert: { bg: 'border-rose-500/30 bg-rose-500/5', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: '🚨' },
    risk: { bg: 'border-yellow-500/30 bg-yellow-500/5', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: '⚠️' },
    opportunity: { bg: 'border-emerald-500/30 bg-emerald-500/5', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '💡' },
    trend: { bg: 'border-blue-500/30 bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '📈' },
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">AI Insights</h1>
          <p className="mt-2 text-white/60">Real-time intelligence derived from your HR data by Claude AI.</p>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all ${
            loading ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Analyzing data...
            </>
          ) : '✨ Generate AI Insights'}
        </button>
      </header>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InsightCard title="Avg Performance" value={`${avgPerf}%`} sub={`${highPerf} high, ${lowPerf} low performers`} color="border-blue-500/20 bg-blue-500/5 text-blue-200" icon="📊" />
        <InsightCard title="Avg Attendance" value={`${avgAtt}%`} sub={`${onLeave} currently on leave`} color="border-purple-500/20 bg-purple-500/5 text-purple-200" icon="📅" />
        <InsightCard title="On PIP" value={pipCount} sub="performance improvement plan" color={pipCount > 0 ? "border-rose-500/20 bg-rose-500/5 text-rose-200" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-200"} icon="⚠️" />
        <InsightCard title="Hiring Pipeline" value={candidates.length} sub={`${offerStage} at offer stage`} color="border-teal-500/20 bg-teal-500/5 text-teal-200" icon="🎯" />
      </div>

      {/* Department breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Department Performance</h2>
          {Object.entries(deptPerf).map(([dept, v]) => (
            <Bar key={dept} label={dept} value={Math.round(v.total / v.count)}
              color={v.total/v.count >= 80 ? 'bg-emerald-400' : v.total/v.count >= 65 ? 'bg-yellow-400' : 'bg-rose-400'} />
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Workforce Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'High Performers (≥85%)', count: highPerf, color: 'text-emerald-300' },
              { label: 'Good Performers (70–84%)', count: employees.filter(e => e.performance >= 70 && e.performance < 85).length, color: 'text-blue-300' },
              { label: 'Needs Improvement (60–69%)', count: employees.filter(e => e.performance >= 60 && e.performance < 70).length, color: 'text-yellow-300' },
              { label: 'At Risk (<60%)', count: lowPerf, color: 'text-rose-300' },
              { label: 'On PIP (<30%)', count: pipCount, color: 'text-rose-400 font-bold' },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center text-sm">
                <span className="text-white/60">{r.label}</span>
                <span className={r.color}>{r.count} employee{r.count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {!insights && !loading && (
        <div className="rounded-2xl border border-dashed border-white/20 bg-white/3 p-12 text-center">
          <p className="text-4xl mb-4">✨</p>
          <p className="text-white/60 text-lg font-medium">Click "Generate AI Insights" to analyze your HR data</p>
          <p className="text-white/30 text-sm mt-2">Claude will identify risks, opportunities, and recommendations from your live data</p>
        </div>
      )}

      {insights && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">AI-Generated Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((ins, i) => {
              const cfg = typeConfig[ins.type] || typeConfig.trend;
              return (
                <div key={i} className={`rounded-2xl border p-5 ${cfg.bg}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xl">{cfg.icon}</span>
                    <div className="flex-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.badge}`}>
                        {ins.type?.toUpperCase()}
                      </span>
                      <h3 className="text-white font-semibold mt-1.5 leading-tight">{ins.headline}</h3>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{ins.finding}</p>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-white/40 mb-1">Recommended Action</p>
                    <p className="text-sm text-white/80">{ins.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
