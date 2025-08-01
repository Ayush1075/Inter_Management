// App.jsx (FIXED ✅)
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './context/ProtectedRoute';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import InternUpload from './pages/dashboards/InternUpload';

// Your components/pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ManageInterns from './pages/ManageInterns';
import AssignTasks from './pages/AssignTasks';
import MarkAttendance from './pages/MarkAttendance';
import MessagesAnnouncements from './pages/MessagesAnnouncements';
import MonitorProgress from './pages/MonitorProgress';

// New pages imports
import AssignTasks_New from './pages/AssignTasks_New';
import ManageInterns_New from './pages/ManageInterns_New';
import MarkAttendance_New from './pages/MarkAttendance_New';
import MessagesAnnouncements_New from './pages/MessagesAnnouncements_New';
import MonitorProgress_New from './pages/MonitorProgress_New';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Intern-only route */}
      <Route
        path="/intern-upload"
        element={
          <ProtectedRoute roles={['INTERN']}>
            <InternUpload />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes (CEO/HR) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['CEO', 'HR']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* New pages routes */}
      <Route path="/assign-tasks-new" element={<AssignTasks_New />} />
      <Route path="/manage-interns-new" element={<ManageInterns_New />} />
      <Route path="/mark-attendance-new" element={<MarkAttendance_New />} />
      <Route path="/messages-announcements-new" element={<MessagesAnnouncements_New />} />
      <Route path="/monitor-progress-new" element={<MonitorProgress_New />} />

      {/* Nested layout pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['CEO', 'HR']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="interns" element={<ManageInterns />} />
        <Route path="tasks" element={<AssignTasks />} />
        <Route path="attendance" element={<MarkAttendance />} />
        <Route path="messages" element={<MessagesAnnouncements />} />
        <Route path="progress" element={<MonitorProgress />} />
        <Route
          path="settings"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Settings Coming Soon</h1>
            </div>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
