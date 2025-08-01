import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Users, Package, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const CreateBatchModal = ({ isOpen, onClose, fetchBatches }) => {
  const [name, setName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      axios.get('/api/users').then(res => setAllUsers(res.data));
    }
  }, [isOpen]);

  const closeModal = () => {
    onClose();
    setName('');
    setSelectedUsers([]);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/batches', { name, userIds: selectedUsers });
      fetchBatches();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.msg || 'Failed to create batch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                      Create New Batch
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Batch Name Field */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Package className="w-4 h-4" />
                        <span>Batch Name</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Enter batch name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    {/* User Assignment Field */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                        <Users className="w-4 h-4" />
                        <span>Assign Users</span>
                        {selectedUsers.length > 0 && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            {selectedUsers.length} selected
                          </span>
                        )}
                      </label>
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
                        {allUsers.map(user => (
                          <label 
                            key={user._id} 
                            className="flex items-center space-x-3 p-3 hover:bg-white transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleUserSelect(user._id)}
                              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {user.name}
                                </span>
                                {selectedUsers.includes(user._id) && (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                          </label>
                        ))}
                        {allUsers.length === 0 && (
                          <div className="p-8 text-center">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <div className="text-sm text-gray-500">No users available</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4" />
                            <span>Create Batch</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateBatchModal; 