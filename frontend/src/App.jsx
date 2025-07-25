import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ProtectedRoute from './context/ProtectedRoute';
import InternUpload from './pages/dashboards/InternUpload';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/admin" element={<ProtectedRoute roles={['CEO', 'HR']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/intern-upload" element={<ProtectedRoute roles={['INTERN']}><InternUpload /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
