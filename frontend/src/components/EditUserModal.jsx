import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const EditUserModal = ({ isOpen, setIsOpen, user, fetchUsers }) => {
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const [batches, setBatches] = useState([]);
  const role = watch('role');

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('role', user.role);
      setValue('batchId', user.batchId?._id);
      setValue('isActive', user.isActive);
    }
  }, [user, setValue]);

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
    setIsOpen(false);
    reset();
  }

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/users/${user._id}`, data);
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Failed to update user', error);
      alert(error.response?.data?.msg || 'Failed to update user.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Edit User</Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input id="name" type="text" {...register('name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" {...register('email', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="phone">Phone (Optional)</label>
                    <input id="phone" type="tel" {...register('phone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="role">Role</label>
                    <select id="role" {...register('role', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="INTERN">Intern</option>
                      <option value="MENTOR">Mentor</option>
                      <option value="HR">HR</option>
                      <option value="CEO">CEO</option>
                    </select>
                  </div>
                  {(role === 'INTERN' || role === 'MENTOR') && (
                    <div>
                      <label htmlFor="batchId">Batch</label>
                      <select id="batchId" {...register('batchId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        <option value="">None</option>
                        {batches.map(batch => <option key={batch._id} value={batch._id}>{batch.name}</option>)}
                      </select>
                    </div>
                  )}
                   <div>
                      <label htmlFor="isActive" className="flex items-center">
                        <input id="isActive" type="checkbox" {...register('isActive')} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        <span className="ml-2 text-sm text-gray-600">Active User</span>
                      </label>
                    </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={closeModal} className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Cancel</button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">Update User</button>
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

export default EditUserModal; 