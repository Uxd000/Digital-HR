import { useState } from 'react';
import RoleSelect from './pages/RoleSelect';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HRDashboard from './pages/HRDashboard';

export const initialEmployees = [
  { id: 'e1', name: 'Ava Johnson', role: 'Software Engineer', department: 'Engineering', email: 'ava.johnson@company.com', phone: '+91 98400 11001', joinDate: '2021-03-15', status: 'Active', attendance: 95, performance: 88, tasksCompleted: 42, tasksPending: 3, salary: '₹18,00,000', manager: 'Sarah Kim', avatar: 'AJ', pip: false },
  { id: 'e2', name: 'Noah Patel', role: 'Product Designer', department: 'Design', email: 'noah.patel@company.com', phone: '+91 98400 11002', joinDate: '2020-07-01', status: 'Active', attendance: 90, performance: 72, tasksCompleted: 30, tasksPending: 8, salary: '₹15,00,000', manager: 'Sarah Kim', avatar: 'NP', pip: false },
  { id: 'e3', name: 'Mia Chen', role: 'QA Analyst', department: 'Engineering', email: 'mia.chen@company.com', phone: '+91 98400 11003', joinDate: '2022-01-10', status: 'On Leave', attendance: 78, performance: 28, tasksCompleted: 18, tasksPending: 12, salary: '₹12,00,000', manager: 'Raj Sharma', avatar: 'MC', pip: false },
  { id: 'e4', name: 'James Wilson', role: 'DevOps Engineer', department: 'Infrastructure', email: 'james.wilson@company.com', phone: '+91 98400 11004', joinDate: '2019-11-20', status: 'Active', attendance: 98, performance: 93, tasksCompleted: 55, tasksPending: 2, salary: '₹22,00,000', manager: 'Raj Sharma', avatar: 'JW', pip: false },
  { id: 'e5', name: 'Priya Nair', role: 'Data Analyst', department: 'Analytics', email: 'priya.nair@company.com', phone: '+91 98400 11005', joinDate: '2023-05-03', status: 'Active', attendance: 82, performance: 25, tasksCompleted: 20, tasksPending: 15, salary: '₹13,00,000', manager: 'Sarah Kim', avatar: 'PN', pip: false },
  { id: 'e6', name: 'Arjun Mehta', role: 'Backend Developer', department: 'Engineering', email: 'arjun.mehta@company.com', phone: '+91 98400 11006', joinDate: '2021-09-14', status: 'Active', attendance: 93, performance: 85, tasksCompleted: 38, tasksPending: 4, salary: '₹16,00,000', manager: 'Raj Sharma', avatar: 'AM', pip: false },
];

const initialCandidates = [
  { id: 1, name: 'Alice Smith', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], score: 92, stage: 'Applied' },
  { id: 2, name: 'Bob Jones', role: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'AWS'], score: 88, stage: 'Screening' },
  { id: 3, name: 'Charlie Davis', role: 'UX Designer', skills: ['Figma', 'Prototyping', 'Research'], score: 95, stage: 'Interview' },
  { id: 4, name: 'Dana Lee', role: 'Product Manager', skills: ['Agile', 'Jira', 'Strategy'], score: 90, stage: 'Offer' },
  { id: 5, name: 'Evan Wright', role: 'Full Stack Dev', skills: ['React', 'Python', 'Docker'], score: 85, stage: 'Applied' },
];

// Today's attendance seed — some checked in, some WFH, some absent
const todayStr = new Date().toISOString().split('T')[0];
const initialAttendance = {
  [todayStr]: {
    e1: { status: 'present', checkIn: '09:02', checkOut: null },
    e2: { status: 'wfh', checkIn: '09:30', checkOut: null },
    e3: { status: 'leave', checkIn: null, checkOut: null },
    e4: { status: 'present', checkIn: '08:45', checkOut: null },
    e5: { status: 'absent', checkIn: null, checkOut: null },
    e6: { status: 'present', checkIn: '09:15', checkOut: null },
  }
};

function App() {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [userAccount, setUserAccount] = useState(null);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [employees, setEmployees] = useState(initialEmployees);
  const [meetings, setMeetings] = useState([]);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: '1', employeeName: 'Ava Johnson', employeeId: 'e1', days: 2, status: 'pending', reason: 'Family function', type: 'leave', date: todayStr },
    { id: '2', employeeName: 'Noah Patel', employeeId: 'e2', days: 1, status: 'approved', reason: 'Work from home', type: 'wfh', date: todayStr },
    { id: '3', employeeName: 'Mia Chen', employeeId: 'e3', days: 3, status: 'approved', reason: 'Medical checkup', type: 'leave', date: todayStr },
  ]);
  const [feedback, setFeedback] = useState([]);
  const [morale, setMorale] = useState([]);

  // Auto-PIP for employees below 30% performance
  const processedEmployees = employees.map(e => ({
    ...e,
    pip: e.performance < 30 ? true : e.pip
  }));

  const handleSelectRole = (r, account) => {
    setRole(r);
    if (r === 'hr') {
      setUserName(typeof account === 'string' ? account : account?.name || 'HR');
      setUserAccount(account);
    } else {
      setUserName(account?.name || 'Employee');
      setUserAccount(account);
    }
  };

  if (role === 'employee')
    return (
      <EmployeeDashboard
        leaveRequests={leaveRequests}
        setLeaveRequests={setLeaveRequests}
        setRole={setRole}
        userName={userName}
        userAccount={userAccount}
        employees={processedEmployees}
        attendance={attendance}
        setAttendance={setAttendance}
        feedback={feedback}
        setFeedback={setFeedback}
        morale={morale}
        setMorale={setMorale}
      />
    );
  if (role === 'hr')
    return (
      <HRDashboard
        leaveRequests={leaveRequests}
        setLeaveRequests={setLeaveRequests}
        candidates={candidates}
        setCandidates={setCandidates}
        employees={processedEmployees}
        setEmployees={setEmployees}
        meetings={meetings}
        setMeetings={setMeetings}
        attendance={attendance}
        setAttendance={setAttendance}
        feedback={feedback}
        setFeedback={setFeedback}
        morale={morale}
        setMorale={setMorale}
        setRole={setRole}
        userName={userName}
      />
    );

  return <RoleSelect onSelectRole={handleSelectRole} />;
}

export default App;
