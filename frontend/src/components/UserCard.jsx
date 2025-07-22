import { Eye, Edit, Trash2, Calendar, Mail, Phone } from "lucide-react";

const UserCard = ({ user, onDelete, onEdit }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
    <div className="flex-grow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              user.role === 'CEO' ? 'bg-purple-100 text-purple-800' :
              user.role === 'HR' ? 'bg-pink-100 text-pink-800' :
              user.role === 'MENTOR' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={() => onEdit(user)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(user._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>{user.phone}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
    
    <div className="mt-4 flex items-center justify-between">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <div className={`w-2 h-2 rounded-full mr-1.5 ${
          user.isActive ? 'bg-green-400' : 'bg-red-400'
        }`} />
        {user.isActive ? 'Active' : 'Inactive'}
      </span>
      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        View Details
      </button>
    </div>
  </div>
);

export default UserCard; 