import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { X, User, Mail, Phone, Lock, UserCheck, Users, Calendar } from 'lucide-react';
import axios from 'axios';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [batches, setBatches] = useState([]);
  const role = watch('role');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get('/api/batches');
        setBatches(res.data);
      } catch (error) {
        console.error('Failed to fetch batches', error);
      }
    };
    if (role === 'INTERN' || role === 'MENTOR') {
      fetchBatches();
    }
  }, [role]);

  const closeModal = () => {
    onClose();
    reset();
  }

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/users', data);
      onUserAdded(); // Call the callback to refresh data
      closeModal();
    } catch (error) {
      console.error('Failed to create user', error);
      alert(error.response?.data?.msg || 'Failed to create user.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Add New User
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">Create a new user account for your team</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors`}
                        placeholder="Enter full name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-opacity-50 transition-colors"
                        placeholder="Enter phone number (optional)"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors`}
                        placeholder="Enter password"
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                  </div>

                  {/* Role Field */}
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="role"
                        {...register('role', { required: 'Role is required' })}
                        className={`block w-full pl-10 pr-8 py-3 border ${errors.role ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors bg-white`}
                      >
                        <option value="">Select a role</option>
                        <option value="INTERN">Intern</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="HR">HR</option>
                        <option value="CEO">CEO</option>
                      </select>
                    </div>
                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
                  </div>

                  {/* Batch Field (conditionally shown) */}
                  {(role === 'INTERN' || role === 'MENTOR') && (
                    <div>
                      <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2">
                        Batch Assignment
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="batchId"
                          {...register('batchId')}
                          className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-opacity-50 transition-colors bg-white"
                        >
                          <option value="">Select a batch</option>
                          {batches.map((batch) => (
                            <option key={batch._id} value={batch._id}>
                              {batch.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Internship Date Fields (only for interns) */}
                  {role === 'INTERN' && (
                    <>
                      {/* Start Date Field */}
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Internship Start Date *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="startDate"
                            type="date"
                            {...register('startDate', { 
                              required: role === 'INTERN' ? 'Start date is required for interns' : false 
                            })}
                            className={`block w-full pl-10 pr-3 py-3 border ${errors.startDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors`}
                          />
                        </div>
                        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                      </div>

                      {/* End Date Field */}
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Internship End Date *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="endDate"
                            type="date"
                            {...register('endDate', { 
                              required: role === 'INTERN' ? 'End date is required for interns' : false,
                              validate: (value) => {
                                const startDate = watch('startDate');
                                if (role === 'INTERN' && startDate && value) {
                                  return new Date(value) > new Date(startDate) || 'End date must be after start date';
                                }
                                return true;
                              }
                            })}
                            className={`block w-full pl-10 pr-3 py-3 border ${errors.endDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors`}
                          />
                        </div>
                        {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                          📅 System will automatically notify when internship is nearing completion
                        </p>
                      </div>
                    </>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Create User
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddUserModal; 