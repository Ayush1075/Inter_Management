import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InternUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('File to upload:', file);
    if (!file) return setStatus('Please select a file.');
    setStatus('Uploading...');
    const formData = new FormData();
    formData.append('document', file);
    try {
      await axios.post('/api/users/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Upload successful!');
      setFile(null);
    } catch (err) {
      setStatus('Upload failed.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
      >
        Logout
      </button>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Internship Document</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" onChange={handleChange} className="block w-full" accept="*" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Upload</button>
        </form>
        {status && <div className="mt-4 text-center text-sm text-gray-700">{status}</div>}
      </div>
    </div>
  );
};

export default InternUpload; 