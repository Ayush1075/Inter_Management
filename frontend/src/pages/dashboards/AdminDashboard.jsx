import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Activity,
  TrendingUp,
  Award,
  Briefcase,
  BookUser,
  Crown,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  ChevronRight,
  Clock,
  MapPin,
  GraduationCap,
  Building,
  User,
  UserCheck,
  AlertCircle,
  BarChart3,
  Settings
} from "lucide-react";
import StatCard from "../../components/StatCard";
import UserCard from "../../components/UserCard";
import BatchCard from "../../components/BatchCard";
import EditUserModal from "../../components/EditUserModal";
import AddUserModal from "../../components/AddUserModal";
import BatchDetailModal from "../../components/BatchDetailModal";
import CreateBatchModal from "../../components/CreateBatchModal";
import innodataticsLogo from '../../assets/innodatatics_logo.png';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);

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

  // Handle stat card click to filter users by role
  const handleStatCardClick = (role) => {
    setActiveTab(role);
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allUsers;

    if (activeTab !== "ALL" && activeTab !== "BATCHES") {
      filtered = allUsers.filter(user => user.role === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, activeTab, allUsers]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const TABS = [
    { key: "ALL", label: "All Users", icon: Users },
    { key: "BATCHES", label: "Batches", icon: Briefcase },
    { key: "INTERN", label: "Interns", icon: Award },
    { key: "MENTOR", label: "Mentors", icon: TrendingUp },
    { key: "HR", label: "HR", icon: BookUser },
    { key: "CEO", label: "CEO", icon: Crown }
  ];

  // Enhanced StatCard Component - Made smaller and clickable
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

  // Enhanced UserCard Component - Made smaller
  const EnhancedUserCard = ({ user }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
            user.role === 'CEO' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
            user.role === 'HR' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
            user.role === 'MENTOR' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' :
            'bg-gradient-to-br from-green-500 to-green-700'
          }`}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{user.name}</h3>
            <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
              user.role === 'CEO' ? 'bg-purple-100 text-purple-800' :
              user.role === 'HR' ? 'bg-blue-100 text-blue-800' :
              user.role === 'MENTOR' ? 'bg-indigo-100 text-indigo-800' :
              'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => handleEditUser(user)}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => handleDeleteUser(user._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <Mail className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            <span>{user.phone}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            user.isActive ? 'bg-green-400' : 'bg-red-400'
          }`} />
          {user.isActive ? 'Active' : 'Inactive'}
        </div>
        <button className="flex items-center text-indigo-600 hover:text-indigo-800 text-xs font-medium group">
          View Details
          <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  // Enhanced BatchCard Component - Made smaller
  const EnhancedBatchCard = ({ batch }) => {
    const totalInterns = batch.users?.filter(u => u.role === 'INTERN').length || 0;
    const activeMentors = batch.users?.filter(u => u.role === 'MENTOR' && u.isActive).length || 0;
    const completionRate = batch.completionRate || Math.floor(Math.random() * 40) + 60;
    const isOngoing = new Date(batch.endDate) > new Date();
    
    return (
      <div 
        onClick={() => handleCardClick(batch)}
        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-lg shadow-md ${
              isOngoing ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
            }`}>
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {batch.name}
              </h3>
              <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                isOngoing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  isOngoing ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                {isOngoing ? 'Ongoing' : 'Completed'}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-blue-50 rounded-lg p-2.5">
            <div className="flex items-center space-x-1.5">
              <Users className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Total Interns</span>
            </div>
            <p className="text-xl font-bold text-blue-700 mt-1">{totalInterns}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2.5">
            <div className="flex items-center space-x-1.5">
              <UserCheck className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Active Mentors</span>
            </div>
            <p className="text-xl font-bold text-purple-700 mt-1">{activeMentors}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs font-bold text-gray-900">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                completionRate >= 80 ? 'bg-green-500' : completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</span>
          </div>
          {batch.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span>{batch.location}</span>
            </div>
          )}
          {batch.technology && (
            <div className="flex items-center space-x-2">
              <Settings className="h-3.5 w-3.5 text-gray-400" />
              <span>{batch.technology}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Watermark logo */}
      <img
        src={innodataticsLogo}
        alt="Innodatatics Watermark"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-w-[60vw] opacity-10 pointer-events-none select-none z-0"
        style={{ userSelect: 'none' }}
      />
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </button>
              <button
                onClick={() => setIsCreateBatchOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <span>Create Batch</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EnhancedStatCard
            title="Total Users"
            value={stats.total}
            icon={Users}
            trend={12}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            description="All registered users"
            onClick={handleStatCardClick}
            role="ALL"
          />
          <EnhancedStatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Activity}
            trend={8}
            color="bg-gradient-to-br from-green-500 to-green-600"
            description="Currently active users"
          />
          <EnhancedStatCard
            title="New This Month"
            value={stats.newThisMonth}
            icon={TrendingUp}
            trend={23}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            description="New registrations"
          />
          <EnhancedStatCard
            title="Total Batches"
            value={batches.length}
            icon={Briefcase}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            description="Training batches"
            onClick={handleStatCardClick}
            role="BATCHES"
          />
        </div>

        {/* Enhanced Role Distribution Cards - All clickable */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <EnhancedStatCard 
            title="Interns" 
            value={stats.intern} 
            icon={Award} 
            color="bg-gradient-to-br from-green-500 to-green-600"
            onClick={handleStatCardClick}
            role="INTERN"
          />
          <EnhancedStatCard 
            title="Mentors" 
            value={stats.mentor} 
            icon={TrendingUp} 
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            onClick={handleStatCardClick}
            role="MENTOR"
          />
          <EnhancedStatCard 
            title="HR" 
            value={stats.hr} 
            icon={BookUser} 
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
            onClick={handleStatCardClick}
            role="HR"
          />
          <EnhancedStatCard 
            title="CEO" 
            value={stats.ceo} 
            icon={Crown} 
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            onClick={handleStatCardClick}
            role="CEO"
          />
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filter</span>
              </button>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="mt-8">
            <nav className="flex space-x-2 bg-gray-100 rounded-xl p-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Enhanced Content Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {TABS.find(t => t.key === activeTab)?.label}
              </h2>
              {activeTab !== 'BATCHES' && (
                <p className="text-gray-600 mt-1">
                  Showing {filteredUsers.length} of {allUsers.length} users
                </p>
              )}
            </div>
            {activeTab === 'BATCHES' && (
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Briefcase className="h-4 w-4" />
                <span>Create Batch</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-48"></div>
              ))}
            </div>
          ) : activeTab === 'BATCHES' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {batches.map((batch) => (
                <EnhancedBatchCard key={batch._id} batch={batch} />
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredUsers.map((user) => (
                <EnhancedUserCard key={user._id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 text-lg">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first user"}
              </p>
            </div>
          )}
        </div>

        <AddUserModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} fetchUsers={fetchData} />
        <CreateBatchModal isOpen={isCreateBatchOpen} setIsOpen={setIsCreateBatchOpen} fetchBatches={fetchData} />
        <EditUserModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} user={selectedUser} fetchUsers={fetchData} />
        <BatchDetailModal isOpen={isBatchModalOpen} setIsOpen={setIsBatchModalOpen} batch={selectedBatch} />
      </div>
    </div>
  );
};

export default AdminDashboard;
