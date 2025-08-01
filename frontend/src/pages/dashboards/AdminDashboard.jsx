import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  Users, Calendar, CheckCircle, MessageCircle, ClipboardList, TrendingUp,
  UserPlus, Activity, Award, Briefcase, BookUser, Crown, Search, Filter,
  Download, MoreVertical, Eye, Edit, Trash2, Mail, Phone, ChevronRight,
  Clock, MapPin, GraduationCap, Building, User, UserCheck, AlertCircle,
  BarChart3, Settings, X, FileText, Star, Code, Download as DownloadIcon,
  ExternalLink, Maximize2, Minimize2, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useInternshipData } from '../../hooks/useInternshipData';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import ReactDOM from "react-dom";
import innodataticsLogo from '../../assets/innodatatics_logo.png';

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
  padding: ${theme.spacing[4]};
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
    if (props.type === 'broadcast') return `background: ${theme.colors.primary[100]}; color: ${theme.colors.primary[700]};`;
    if (props.sender === 'Admin') return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
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

// Tab Navigation Styled Components
const TabNavigation = styled.nav`
  display: flex;
  space-x: 0.5rem;
  background: ${theme.colors.gray[100]};
  border-radius: ${theme.radius.xl};
  padding: 0.5rem;
  margin-bottom: ${theme.spacing[8]};
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border-radius: ${theme.radius.lg};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  ${props => props.isActive ? `
    background: white;
    color: ${theme.colors.primary[600]};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  ` : `
    color: ${theme.colors.gray[600]};
    &:hover {
      color: ${theme.colors.gray[900]};
      background: ${theme.colors.gray[50]};
    }
  `}
`;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getStats, messages, interns } = useInternshipData();
  
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

  // Dashboard view content (from Dashboard_New.jsx)
  const renderDashboardView = () => {
    const dashboardStats = getStats();
    const recentMessages = messages.slice(-4).reverse();
    const recentInterns = interns.slice(-3);

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
              {recentMessages.map((message) => (
                <MessageItem key={message.id} padding="4">
                  <Flex gap="3">
                    <Avatar type={message.type} sender={message.sender}>
                      {message.sender === 'Admin' ? 'AD' : message.sender.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing[1] }}>
                        <Flex align="center" gap="2">
                          <Text style={{ fontWeight: '500', fontSize: '0.875rem', color: theme.colors.gray[900] }} noMargin>
                            {message.sender}
                          </Text>
                          <Text size="sm" variant="muted" noMargin>
                            → {message.receiver}
                          </Text>
                          {message.type === 'broadcast' && (
                            <Badge variant="primary">Broadcast</Badge>
                          )}
                        </Flex>
                        <Text size="sm" variant="muted" noMargin>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </Flex>
                      <Text size="sm" noMargin>
                        {message.content}
                      </Text>
                    </div>
                  </Flex>
                </MessageItem>
              ))}
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
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
            {documents.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {documents.map(doc => (
                    <div key={doc._id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded by {doc.uploadedBy?.name} on {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            data-download-id={doc._id}
                            onClick={() => handleDownload(doc.filename, doc.originalName)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload documents to share with your team.
                </p>
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
        {/* Main tabs for switching between Dashboard and Management */}
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
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
      </MainContent>
    </div>
  );
};

export default AdminDashboard;
