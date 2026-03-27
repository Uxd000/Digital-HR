import { useState } from 'react';

const HR_ACCOUNTS = [
  { name: 'Sarah Kim', role: 'VP Engineering', avatar: 'SK' },
  { name: 'Raj Sharma', role: 'CTO', avatar: 'RS' },
  { name: 'Lisa Park', role: 'Head of HR', avatar: 'LP' },
];

const EMPLOYEE_ACCOUNTS = [
  { name: 'Ava Johnson', id: 'e1', avatar: 'AJ' },
  { name: 'Noah Patel', id: 'e2', avatar: 'NP' },
  { name: 'Mia Chen', id: 'e3', avatar: 'MC' },
  { name: 'James Wilson', id: 'e4', avatar: 'JW' },
  { name: 'Priya Nair', id: 'e5', avatar: 'PN' },
  { name: 'Arjun Mehta', id: 'e6', avatar: 'AM' },
];

function RoleSelect({ onSelectRole }) {
  const [screen, setScreen] = useState('home'); // 'home' | 'hr' | 'employee'
  const [selectedHR, setSelectedHR] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);

  if (screen === 'hr') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-2xl p-8">
          <button onClick={() => setScreen('home')} className="text-white/40 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-white mb-1">HR Login</h2>
          <p className="text-white/50 text-sm mb-6">Select your account to continue</p>
          <div className="space-y-3">
            {HR_ACCOUNTS.map(acc => (
              <button
                key={acc.name}
                onClick={() => setSelectedHR(acc.name)}
                className={`w-full flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                  selectedHR === acc.name
                    ? 'border-purple-400 bg-purple-500/15'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {acc.avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">{acc.name}</p>
                  <p className="text-xs text-white/50">{acc.role}</p>
                </div>
                {selectedHR === acc.name && <span className="ml-auto text-purple-400">✓</span>}
              </button>
            ))}
          </div>
          <button
            disabled={!selectedHR}
            onClick={() => onSelectRole('hr', selectedHR)}
            className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all ${
              selectedHR
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            Continue as HR →
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'employee') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-2xl p-8">
          <button onClick={() => setScreen('home')} className="text-white/40 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-white mb-1">Employee Login</h2>
          <p className="text-white/50 text-sm mb-6">Select your name to continue</p>
          <div className="space-y-2">
            {EMPLOYEE_ACCOUNTS.map(acc => (
              <button
                key={acc.name}
                onClick={() => setSelectedEmp(acc)}
                className={`w-full flex items-center gap-4 rounded-2xl border p-3.5 transition-all ${
                  selectedEmp?.name === acc.name
                    ? 'border-blue-400 bg-blue-500/15'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {acc.avatar}
                </div>
                <p className="font-medium text-white text-sm">{acc.name}</p>
                {selectedEmp?.name === acc.name && <span className="ml-auto text-blue-400">✓</span>}
              </button>
            ))}
          </div>
          <button
            disabled={!selectedEmp}
            onClick={() => onSelectRole('employee', selectedEmp)}
            className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all ${
              selectedEmp
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow-lg'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            Continue as Employee →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-2xl p-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg">
          HR
        </div>
        <h1 className="text-3xl font-bold text-white text-center">AI Digital HR System</h1>
        <p className="mt-2 text-white/50 text-center text-sm">Smart HR powered by AI</p>
        <div className="mt-10 w-full flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setScreen('employee')}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold text-base shadow-lg transition-all hover:from-blue-600 hover:to-teal-600 hover:-translate-y-0.5"
          >
            👤 Login as Employee
          </button>
          <button
            type="button"
            onClick={() => setScreen('hr')}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-base shadow-lg transition-all hover:from-purple-600 hover:to-blue-700 hover:-translate-y-0.5"
          >
            🏢 Login as HR
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;
