import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  Users, Calendar, CheckCircle, MessageCircle, ClipboardList, TrendingUp,
  UserPlus, Activity, Award, Briefcase, BookUser, Crown, Search, Filter,
  Download, MoreVertical, Eye, Edit, Trash2, Mail, Phone, ChevronRight,
  Clock, MapPin, GraduationCap, Building, User, UserCheck, AlertCircle,
  BarChart3, Settings, X, FileText, Star, Code, Download as DownloadIcon,
  ExternalLink, Maximize2, Minimize2, Plus, LogOut, ZoomIn, ZoomOut,
  RotateCcw, Loader, MessageSquare, Send
} from 'lucide-react';
// We're using iframe for PDF viewing, so no need for react-pdf

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useInternshipData } from '../../hooks/useInternshipData';
import useMessages from '../../hooks/useMessages';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import ReactDOM from "react-dom";
import innodataticsLogo from '../../assets/innodatatics_logo.png';

// Configure axios defaults
axios.defaults.baseURL = '';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Import existing modal components
import AddUserModal from '../../components/AddUserModal';
import EditUserModal from '../../components/EditUserModal';
import CreateBatchModal from '../../components/CreateBatchModal';
import BatchDetailModal from '../../components/BatchDetailModal';

import { 
  Container, 
  Grid, 
  Flex, 
  GlassCard, 
  Heading1, 
  Heading2,
  Heading3,
  Text, 
  Badge,
  theme,
  MainContent
} from '../../components/styled/StyledComponents';

// Dashboard styled components
const DashboardHeader = styled(Flex)`
  margin-bottom: ${theme.spacing[6]};
`;

const DateInfo = styled.div`
  text-align: right;
`;

const StatsGrid = styled(Grid)`
  margin-bottom: ${theme.spacing[6]};
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const MainGrid = styled(Grid)`
  grid-template-columns: 1fr;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MessageItem = styled(GlassCard)`
  padding: ${props => props.$padding ? theme.spacing[props.$padding] : theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
`;

const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  flex-shrink: 0;
  
  ${props => {
    if (props.$type === 'broadcast') return `background: ${theme.colors.primary[100]}; color: ${theme.colors.primary[700]};`;
    if (props.$sender === 'Admin') return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
    return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
  }}
`;

const InternItem = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[3]};
  background: rgba(248, 250, 252, 0.5);
  border-radius: ${theme.radius.lg};
  margin-bottom: ${theme.spacing[3]};
`;

const InternAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  border-radius: ${theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
`;

const QuickActionButton = styled.button`
  width: 100%;
  padding: ${theme.spacing[3]};
  text-align: left;
  background: rgba(248, 250, 252, 0.5);
  border: 1px solid transparent;
  border-radius: ${theme.radius.lg};
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: ${theme.spacing[2]};

  &:hover {
    background: rgba(241, 245, 249, 0.8);
    border-color: ${theme.colors.gray[200]};
  }
`;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getStats, interns } = useInternshipData();
  const { messages, loading: messagesLoading, error: messagesError } = useMessages();
  
  // State for view management
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [mainActiveTab, setMainActiveTab] = useState("DASHBOARD");
  const [adminActiveTab, setAdminActiveTab] = useState("ALL");
  
  // State for admin functionality
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    intern: 0,
    mentor: 0,
    hr: 0,
    ceo: 0,
    activeUsers: 0,
    newThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isDocPanelOpen, setIsDocPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Admin functionality handlers
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCardClick = (batch) => {
    setSelectedBatch(batch);
    setIsBatchModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete user', error);
        alert(error.response?.data?.msg || 'Failed to delete user.');
      }
    }
  };

  const handleStatCardClick = (role) => {
    setAdminActiveTab(role);
  };

  const calculateStats = (userData) => {
    const total = userData.length;
    const intern = userData.filter(u => u.role === 'INTERN').length;
    const mentor = userData.filter(u => u.role === 'MENTOR').length;
    const hr = userData.filter(u => u.role === 'HR').length;
    const ceo = userData.filter(u => u.role === 'CEO').length;
    const activeUsers = userData.filter(u => u.isActive).length;
    
    const currentMonth = new Date().getMonth();
    const newThisMonth = userData.filter(u => {
      const userMonth = new Date(u.createdAt).getMonth();
      return userMonth === currentMonth;
    }).length;

    setStats({ total, intern, mentor, hr, ceo, activeUsers, newThisMonth });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const usersRes = await axios.get("/api/users");
      const batchesRes = await axios.get("/api/batches");

      setAllUsers(usersRes.data);
      calculateStats(usersRes.data);
      
      const batchesWithUsers = batchesRes.data.map(batch => ({
        ...batch,
        users: usersRes.data.filter(u => u.batchId?._id === batch._id)
      }));
      setBatches(batchesWithUsers);

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/api/users/documents');
      setDocuments(res.data);
    } catch (err) {
      setDocuments([]);
    }
  };

  const handleDownload = async (filename, originalName) => {
    try {
      console.log('Downloading document:', filename, originalName);
      
      const response = await axios.get(`/api/users/download/${filename}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      console.log('Download response:', response);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
    } catch (err) {
      console.error('Download error:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'Download failed';
      if (err.response?.status === 404) {
        errorMessage = 'File not found';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied';
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`/api/users/documents/${docId}`);
      fetchDocuments();
    } catch (err) {
      alert('Failed to delete document: ' + (err.response?.data?.msg || err.message));
    }
  };

  useEffect(() => {
    fetchData();
    if (user?.role === 'CEO' || user?.role === 'HR') fetchDocuments();
  }, []);

  useEffect(() => {
    let filtered = allUsers;

    if (adminActiveTab !== "ALL" && adminActiveTab !== "BATCHES" && adminActiveTab !== "DOCUMENTS") {
      filtered = allUsers.filter(user => user.role === adminActiveTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, adminActiveTab, allUsers]);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Constants
  const MAIN_TABS = [
    { key: "DASHBOARD", label: "Dashboard View", icon: BarChart3 },
    { key: "MANAGEMENT", label: "User Management", icon: Users }
  ];

  const ADMIN_TABS = [
    { key: "ALL", label: "All Users", icon: Users },
    { key: "BATCHES", label: "Batches", icon: Briefcase },
    { key: "INTERN", label: "Interns", icon: Award },
    { key: "MENTOR", label: "Mentors", icon: TrendingUp },
    { key: "HR", label: "HR", icon: BookUser },
    { key: "CEO", label: "CEO", icon: Crown },
    { key: "DOCUMENTS", label: "Documents", icon: FileText },
  ];

  // Enhanced StatCard Component for admin view
  const EnhancedStatCard = ({ title, value, icon: Icon, trend, color, description, onClick, role }) => (
    <div 
      onClick={() => onClick && onClick(role)}
      className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${color} shadow-md`}>
          <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-semibold">+{trend}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );

  // Enhanced UserCard Component
  const EnhancedUserCard = ({ user }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
    const [popupHover, setPopupHover] = useState(false);
    const cardRef = useRef(null);

    const getRoleColor = (role) => {
      switch (role) {
        case 'INTERN': return 'from-green-500 to-green-600';
        case 'MENTOR': return 'from-blue-500 to-blue-600';
        case 'HR': return 'from-indigo-500 to-indigo-600';
        case 'CEO': return 'from-purple-500 to-purple-600';
        default: return 'from-gray-500 to-gray-600';
      }
    };

    const getBadgeColor = (role) => {
      switch (role) {
        case 'INTERN': return 'bg-green-100 text-green-800';
        case 'MENTOR': return 'bg-blue-100 text-blue-800';
        case 'HR': return 'bg-indigo-100 text-indigo-800';
        case 'CEO': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div 
        ref={cardRef}
        className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(user.role)}`}>
            {user.role}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => handleEditUser(user)}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Edit className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleDeleteUser(user._id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced BatchCard Component
  const EnhancedBatchCard = ({ batch }) => (
    <div 
      onClick={() => handleCardClick(batch)}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
          {batch.users?.length || 0} users
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{batch.name}</h3>
        {batch.description && (
          <p className="text-xs text-gray-600 line-clamp-2">{batch.description}</p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Created {new Date(batch.createdAt).toLocaleDateString()}</span>
        <ChevronRight className="h-3 w-3" />
      </div>
    </div>
  );

  // Document view handler
  const handleViewDocument = (doc) => {
    setSelectedDoc(doc);
    setIsDocModalOpen(true);
  };

  // Enhanced Document Card Component
  const EnhancedDocumentCard = ({ doc }) => {
    const getFileIcon = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      switch (ext) {
        case 'pdf':
          return <FileText className="h-6 w-6 text-red-500" />;
        case 'doc':
        case 'docx':
          return <FileText className="h-6 w-6 text-blue-500" />;
        default:
          return <FileText className="h-6 w-6 text-gray-500" />;
      }
    };

    const formatFileSize = (bytes) => {
      if (!bytes) return 'Unknown size';
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
      <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              {/* File Icon */}
              <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                {getFileIcon(doc.originalname)}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-900 transition-colors">
                  {doc.originalname}
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  {formatFileSize(doc.size)} • {doc.originalname.split('.').pop().toUpperCase()}
                </p>
                
                {/* Upload Info */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{doc.uploader?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex flex-col items-end space-y-2">
              {doc.suggestedRole && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm">
                  <Award className="h-3 w-3 mr-1" />
                  {doc.suggestedRole}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                Analyzed
              </span>
            </div>
          </div>

          {/* Skills Preview */}
          {doc.skills && doc.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Skills ({doc.skills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {doc.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
                {doc.skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                    +{doc.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Projects Preview */}
          {doc.projects && doc.projects.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Projects ({doc.projects.length})</span>
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">
                {doc.projects.slice(0, 2).join(' • ')}
                {doc.projects.length > 2 && ' ...'}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDocument(doc)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>View</span>
              </button>
              <button
                onClick={() => handleDownload(doc.filename, doc.originalname)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
              >
                <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Download</span>
              </button>
            </div>
            <button
              onClick={() => handleDeleteDocument(doc._id)}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
            >
              <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Document Detail Modal with all improvements
  const DocumentDetailModal = ({ isOpen, onClose, document }) => {
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfBlob, setPdfBlob] = useState(null);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const [pdfError, setPdfError] = useState(null);

    if (!document) return null;

    const getFileIcon = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      switch (ext) {
        case 'pdf':
          return <FileText className="h-8 w-8 text-red-500" />;
        case 'doc':
        case 'docx':
          return <FileText className="h-8 w-8 text-blue-500" />;
        default:
          return <FileText className="h-8 w-8 text-gray-500" />;
      }
    };

    const formatFileSize = (bytes) => {
      if (!bytes) return 'Unknown size';
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Enhanced PDF loading with better error handling
    useEffect(() => {
      if (document && document.filename && isOpen) {
        setIsLoadingPdf(true);
        setPdfError(null);
        
                 // Token is automatically added by axios interceptor

                          // Use axios for consistency with other API calls
         const timeoutId = setTimeout(() => {
           setPdfError('Request timed out. Please try again.');
           setIsLoadingPdf(false);
         }, 30000);

         axios.get(`/api/users/download/${document.filename}`, {
           responseType: 'blob',
           timeout: 30000,
         })
         .then(response => {
           clearTimeout(timeoutId);
           console.log('PDF blob loaded:', response.data.size, 'bytes', response.data.type);
           const url = URL.createObjectURL(response.data);
           setPdfBlob(response.data);
           setPdfUrl(url);
           setIsLoadingPdf(false);
         })
         .catch(error => {
           clearTimeout(timeoutId);
           console.error('Error loading PDF:', error);
           if (error.response?.status === 401) {
             setPdfError('Authentication failed. Please log in again.');
           } else if (error.response?.status === 404) {
             setPdfError('File not found on server.');
           } else if (error.code === 'ECONNABORTED') {
             setPdfError('Request timed out. Please try again.');
           } else {
             setPdfError(error.response?.data?.msg || error.message || 'Failed to load PDF');
           }
           setIsLoadingPdf(false);
         });

         return () => {
           clearTimeout(timeoutId);
         };
      }
    }, [document, isOpen]);

    // Cleanup blob URL
    useEffect(() => {
      return () => {
        if (pdfUrl && pdfUrl.startsWith('blob:')) {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }, [pdfUrl]);



         const retryPdfLoad = () => {
       setPdfError(null);
       setIsLoadingPdf(true);
       const timeoutId = setTimeout(() => {
         setPdfError('Request timed out. Please try again.');
         setIsLoadingPdf(false);
       }, 30000);

       axios.get(`/api/users/download/${document.filename}`, {
         responseType: 'blob',
         timeout: 30000,
       })
       .then(response => {
         clearTimeout(timeoutId);
         const url = URL.createObjectURL(response.data);
         setPdfBlob(response.data);
         setPdfUrl(url);
         setIsLoadingPdf(false);
       })
       .catch(error => {
         clearTimeout(timeoutId);
         console.error('Error loading PDF:', error);
         if (error.response?.status === 401) {
           setPdfError('Authentication failed. Please log in again.');
         } else if (error.response?.status === 404) {
           setPdfError('File not found on server.');
         } else if (error.code === 'ECONNABORTED') {
           setPdfError('Request timed out. Please try again.');
         } else {
           setPdfError(error.response?.data?.msg || error.message || 'Failed to load PDF');
         }
         setIsLoadingPdf(false);
       });
     };

    return (
      <div className={`fixed inset-0 z-[9999] ${isOpen ? 'block' : 'hidden'}`}>
        {/* Improved backdrop - lighter and more professional */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal container - Popup style */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative transform overflow-hidden bg-white shadow-2xl transition-all duration-300 w-full max-w-7xl h-[90vh] rounded-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button - Top right corner */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 bg-white shadow-lg"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Content Layout - Full height */}
              <div className="flex h-full bg-gray-50/50">
                {/* Left Panel - PDF Viewer */}
                <div className="w-3/5 border-r border-gray-200/80 bg-white">
                  <div className="h-full flex flex-col">
                                         {/* PDF Header */}
                     <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/80 bg-gray-50/50">
                       <div className="flex items-center space-x-3">
                         <div className="p-2 bg-blue-500 rounded-lg">
                           <FileText className="h-5 w-5 text-white" />
                         </div>
                         <h4 className="text-lg font-semibold text-gray-900">Document Preview</h4>
                       </div>
                       
                       <div className="flex items-center space-x-2">
                         <button
                           onClick={() => handleDownload(document.filename, document.originalname)}
                           className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                         >
                           <Download className="h-4 w-4 mr-2" />
                           Download
                         </button>
                       </div>
                     </div>
                    
                    {/* PDF Display Area - Full size */}
                    <div className="flex-1 bg-gray-100">
                      {isLoadingPdf ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                          </div>
                          <span className="text-gray-600 font-medium">Loading document...</span>
                          <div className="text-sm text-gray-500">Please wait while we fetch your document</div>
                        </div>
                      ) : pdfError ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="p-4 bg-red-50 rounded-2xl">
                            <FileText className="h-16 w-16 text-red-400 mx-auto" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Document</h3>
                            <p className="text-gray-600 mb-4">{pdfError}</p>
                            <button
                              onClick={retryPdfLoad}
                              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                              Try Again
                            </button>
                          </div>
                        </div>
                      ) : pdfUrl ? (
                        <iframe
                          src={pdfUrl}
                          className="w-full h-full border-0"
                          title="PDF Viewer"
                          onLoad={() => {
                            console.log('PDF iframe loaded successfully');
                          }}
                          onError={(error) => {
                            console.error('PDF iframe error:', error);
                            setPdfError('Failed to load PDF in iframe');
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                            <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Unavailable</h3>
                          <p className="text-gray-600">The document preview is not available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Enhanced Analysis Results */}
                <div className="w-2/5 overflow-y-auto bg-gray-50/30">
                  <div className="p-6 space-y-6">
                    {/* AI Analysis Header */}
                    <div className="text-center pb-6 border-b border-gray-200">
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
                        <Award className="h-5 w-5" />
                        <span className="font-semibold text-lg">AI Analysis Complete</span>
                      </div>
                      <p className="text-gray-600 text-sm">Intelligent insights extracted from the resume</p>
                    </div>

                    {/* Recommended Role - Enhanced */}
                    {document.suggestedRole && (
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900">Recommended Role</h4>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                              {document.suggestedRole}
                            </span>
                            <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm font-semibold">AI Matched</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span>High confidence match</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span>Skills aligned</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Technical Skills - Enhanced */}
                    {document.skills && document.skills.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                              <Code className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">Technical Skills</h4>
                          </div>
                          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                            {document.skills.length} skills
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm">
                          <div className="flex flex-wrap gap-2">
                            {document.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Projects - Enhanced */}
                    {document.projects && document.projects.length > 0 && (
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                              <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">Key Projects</h4>
                          </div>
                          <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                            {document.projects.length} projects
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {document.projects.map((project, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700 leading-relaxed">{project}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Professional Summary - Enhanced */}
                    {document.summaryText && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900">Professional Summary</h4>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm">
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                              {document.summaryText || "Based on the comprehensive analysis of the resume, this candidate demonstrates strong technical capabilities and relevant experience. The AI has identified key strengths and areas of expertise that align well with the recommended role. The candidate shows potential for contributing effectively to technical projects and teams."}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard view content (from Dashboard_New.jsx)
  const renderDashboardView = () => {
    const baseStats = getStats();
    const recentMessages = messages?.slice(-4).reverse() || [];
    const recentInterns = interns.slice(-3);
    
    // Calculate unread messages from backend data
    const unreadMessages = messages?.filter(message => !message.readBy?.some(read => read.userId === user?._id)).length || 0;
    
    const dashboardStats = {
      ...baseStats,
      unreadMessages
    };

    return (
      <Container>
        <DashboardHeader justify="space-between" align="flex-start" responsive>
          <div>
            <Heading1>Admin Dashboard</Heading1>
            <Text variant="secondary">Welcome back, {user?.name}! Here's what's happening with your interns today.</Text>
          </div>
          <DateInfo>
            <Text size="sm" variant="muted">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Text>
            <Text style={{ fontWeight: '600', color: theme.colors.gray[900] }}>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </DateInfo>
        </DashboardHeader>

        <StatsGrid>
          <GlassCard style={{ padding: theme.spacing[6], textAlign: 'center' }}>
            <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
              <Users size={24} color={theme.colors.primary[600]} />
              <Badge variant="success">+2 this month</Badge>
            </Flex>
            <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
              {dashboardStats.totalInterns}
            </Text>
            <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
              Total Interns
            </Text>
          </GlassCard>
          
          <GlassCard style={{ padding: theme.spacing[6], textAlign: 'center' }}>
            <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
              <ClipboardList size={24} color={theme.colors.warning[600]} />
              <Badge variant="warning">3 due this week</Badge>
            </Flex>
            <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
              {dashboardStats.pendingTasks}
            </Text>
            <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
              Pending Tasks
            </Text>
          </GlassCard>
          
          <GlassCard style={{ padding: theme.spacing[6], textAlign: 'center' }}>
            <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
              <CheckCircle size={24} color={theme.colors.success[600]} />
              <Badge variant="success">+5 this week</Badge>
            </Flex>
            <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
              {dashboardStats.completedTasks}
            </Text>
            <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
              Completed Tasks
            </Text>
          </GlassCard>
          
          <GlassCard style={{ padding: theme.spacing[6], textAlign: 'center' }}>
            <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[3] }}>
              <Calendar size={24} color={theme.colors.primary[600]} />
              <Badge variant="primary">+2% from last week</Badge>
            </Flex>
            <Text style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.gray[900], marginBottom: theme.spacing[1] }} noMargin>
              {dashboardStats.averageAttendance}%
            </Text>
            <Text size="sm" variant="secondary" style={{ fontWeight: '500' }} noMargin>
              Attendance Rate
            </Text>
          </GlassCard>
        </StatsGrid>

        <MainGrid>
          <GlassCard>
            <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[6] }}>
              <Heading2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <MessageCircle size={20} color={theme.colors.primary[600]} />
                Recent Messages & Announcements
              </Heading2>
              {dashboardStats.unreadMessages > 0 && (
                <Badge variant="error">
                  {dashboardStats.unreadMessages} unread
                </Badge>
              )}
            </Flex>
            
            <div>
              {messagesLoading && (
                <div style={{ textAlign: 'center', padding: theme.spacing[4] }}>
                  <Text>Loading messages...</Text>
                </div>
              )}
              
              {messagesError && (
                <div style={{ textAlign: 'center', padding: theme.spacing[4], color: theme.colors.error[500] }}>
                  <Text>Error: {messagesError}</Text>
                </div>
              )}
              
              {!messagesLoading && !messagesError && recentMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: theme.spacing[4], color: theme.colors.gray[500] }}>
                  <Text>No recent messages or announcements.</Text>
                </div>
              )}
              
              {!messagesLoading && !messagesError && recentMessages.length > 0 && (
                <>
                  {recentMessages.map((message) => (
                    <MessageItem key={message._id} $padding="4">
                      <Flex gap="3">
                        <Avatar $type={message.type} $sender={message.author?.name}>
                          {message.author?.name === 'Admin' ? 'AD' : message.author?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </Avatar>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[1] }}>
                            <Flex align="center" gap="2">
                              <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                                {message.author?.name || 'Unknown'}
                              </Text>
                              <Text size="sm" variant="muted" noMargin>
                                → {message.recipients === 'all' ? 'All Users' : message.recipients}
                              </Text>
                              {message.type === 'announcement' && (
                                <Badge variant="primary">Announcement</Badge>
                              )}
                              {message.type === 'urgent' && (
                                <Badge variant="error">Urgent</Badge>
                              )}
                              {message.type === 'info' && (
                                <Badge variant="info">Info</Badge>
                              )}
                            </Flex>
                            <Text size="sm" variant="muted" noMargin>
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </Flex>
                          <Text size="sm" noMargin>
                            {message.title}
                          </Text>
                          <Text size="sm" variant="muted" noMargin style={{ marginTop: theme.spacing[1] }}>
                            {message.content}
                          </Text>
                        </div>
                      </Flex>
                    </MessageItem>
                  ))}
                </>
              )}
            </div>
          </GlassCard>

          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
            <GlassCard>
              <Heading3 style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <Users size={20} color={theme.colors.primary[600]} />
                Recent Interns
              </Heading3>
              <div>
                {recentInterns.map((intern) => (
                  <InternItem key={intern.id}>
                    <Flex align="center" gap="3">
                      <InternAvatar>
                        {intern.name.split(' ').map(n => n[0]).join('')}
                      </InternAvatar>
                      <div>
                        <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                          {intern.name}
                        </Text>
                        <Text size="sm" variant="muted" noMargin>
                          {intern.role}
                        </Text>
                      </div>
                    </Flex>
                    <Badge 
                      variant={
                        intern.taskStatus === 'Completed' ? 'success' :
                        intern.taskStatus === 'In Progress' ? 'warning' :
                        'neutral'
                      }
                    >
                      {intern.taskStatus}
                    </Badge>
                  </InternItem>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <Heading3 style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <TrendingUp size={20} color={theme.colors.primary[600]} />
                Quick Actions
              </Heading3>
              <div>
                <QuickActionButton onClick={() => navigate('/assign-tasks-new')}>
                  <Flex align="center" gap="3">
                    <ClipboardList size={16} color={theme.colors.primary[600]} />
                    <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                      Assign New Task
                    </Text>
                  </Flex>
                </QuickActionButton>
                
                <QuickActionButton onClick={() => navigate('/mark-attendance-new')}>
                  <Flex align="center" gap="3">
                    <Calendar size={16} color={theme.colors.primary[600]} />
                    <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                      Mark Attendance
                    </Text>
                  </Flex>
                </QuickActionButton>
                
                <QuickActionButton onClick={() => navigate('/messages-announcements-new')}>
                  <Flex align="center" gap="3">
                    <MessageCircle size={16} color={theme.colors.primary[600]} />
                    <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                      Send Announcement
                    </Text>
                  </Flex>
                </QuickActionButton>
                
                <QuickActionButton onClick={() => navigate('/manage-interns-new')}>
                  <Flex align="center" gap="3">
                    <Users size={16} color={theme.colors.primary[600]} />
                    <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                      Manage Interns
                    </Text>
                  </Flex>
                </QuickActionButton>
              </div>
            </GlassCard>
          </div>
        </MainGrid>
      </Container>
    );
  };

  // Admin management view (original AdminDashboard functionality)
  const renderAdminManagementView = () => {
    return (
      <Container>
        {/* Tabs for admin functionality */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {ADMIN_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setAdminActiveTab(key)}
              className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                adminActiveTab === key
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content based on selected tab */}
        {adminActiveTab === "ALL" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Users Grid */}
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map(user => (
                  <EnhancedUserCard key={user._id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {searchTerm ? 'No users found matching your search' : 'No users found'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm 
                    ? `Try adjusting your search term "${searchTerm}"` 
                    : 'Get started by adding your first user to the system.'
                  }
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                      Add your first user
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {adminActiveTab === "BATCHES" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Batch Management</h2>
              <button
                onClick={() => setIsCreateBatchModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Batch</span>
              </button>
            </div>

            {batches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map(batch => (
                  <EnhancedBatchCard key={batch._id} batch={batch} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No batches found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new batch for your interns.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsCreateBatchModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create your first batch
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {adminActiveTab === "DOCUMENTS" && (user?.role === 'CEO' || user?.role === 'HR') && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Document Intelligence</h2>
                    <p className="text-lg text-gray-600">AI-powered document analysis and management</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {documents.length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    document{documents.length !== 1 ? 's' : ''} analyzed
                  </div>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Award className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Roles Suggested</p>
                      <p className="text-xl font-bold text-gray-900">
                        {documents.filter(doc => doc.suggestedRole).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Code className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Skills Extracted</p>
                      <p className="text-xl font-bold text-gray-900">
                        {documents.reduce((total, doc) => total + (doc.skills?.length || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Projects Found</p>
                      <p className="text-xl font-bold text-gray-900">
                        {documents.reduce((total, doc) => total + (doc.projects?.length || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Analysis Rate</p>
                      <p className="text-xl font-bold text-gray-900">100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {documents.map(doc => (
                  <EnhancedDocumentCard key={doc._id} doc={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="max-w-md mx-auto">
                  <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 inline-block">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Documents Yet</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Upload documents to unlock AI-powered analysis and get intelligent insights about skills, projects, and role recommendations.
                  </p>
                  
                  {/* Features List */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="font-medium text-gray-900">Auto Analysis</p>
                      <p className="text-gray-500">PDF documents analyzed instantly</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="p-2 bg-emerald-100 rounded-lg w-fit mx-auto mb-2">
                        <Code className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="font-medium text-gray-900">Skill Extraction</p>
                      <p className="text-gray-500">Technical skills automatically identified</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="font-medium text-gray-900">Role Matching</p>
                      <p className="text-gray-500">AI suggests best-fit roles</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistics for role-specific tabs */}
        {["INTERN", "MENTOR", "HR", "CEO"].includes(adminActiveTab) && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <EnhancedStatCard
                title={`Total ${adminActiveTab}s`}
                value={filteredUsers.length}
                icon={Users}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                onClick={() => setAdminActiveTab("ALL")}
                role={adminActiveTab}
              />
            </div>

            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map(user => (
                  <EnhancedUserCard key={user._id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No {adminActiveTab.toLowerCase()}s found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no users with the {adminActiveTab.toLowerCase()} role.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                    Add {adminActiveTab.toLowerCase()}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Sidebar />
      <MainContent>
        {/* Header with user info and logout */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <Container>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {mainActiveTab === "DASHBOARD" ? "Dashboard" : "User Management"}
                </h1>
                {user && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Welcome,</span>
                    <span className="font-semibold text-gray-900">{user.name || user.email}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.role}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Main tabs for switching between Dashboard and Management */}
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-16 z-40">
          <Container>
            <div className="flex space-x-8">
              {MAIN_TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMainActiveTab(key)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                    mainActiveTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </Container>
        </div>

        {/* Content based on active main tab */}
        {mainActiveTab === "DASHBOARD" && renderDashboardView()}
        {mainActiveTab === "MANAGEMENT" && renderAdminManagementView()}

        {/* All the modals */}
        <AddUserModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          onUserAdded={fetchData}
        />
        
        <EditUserModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onUserUpdated={fetchData}
        />
        
        <CreateBatchModal 
          isOpen={isCreateBatchModalOpen} 
          onClose={() => setIsCreateBatchModalOpen(false)}
          onBatchCreated={fetchData}
        />
        
        <BatchDetailModal 
          isOpen={isBatchModalOpen} 
          onClose={() => setIsBatchModalOpen(false)}
          batch={selectedBatch}
        />

        {/* Document Detail Modal */}
        <DocumentDetailModal 
          isOpen={isDocModalOpen} 
          onClose={() => setIsDocModalOpen(false)}
          document={selectedDoc}
        />
      </MainContent>
    </div>
  );
};

export default AdminDashboard;
