import { useAuth } from '../context/AuthContext';

const Navbar = ({ user }) => {
  const { logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-indigo-600">IMS</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">
              Welcome, {user?.email} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 