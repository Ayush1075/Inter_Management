import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Briefcase, User, Users, X } from 'lucide-react';

const BatchDetailModal = ({ isOpen, setIsOpen, batch }) => {
  if (!batch) return null;

  const closeModal = () => setIsOpen(false);

  const mentors = batch.users.filter(u => u.role === 'MENTOR');
  const interns = batch.users.filter(u => u.role === 'INTERN');

  const UserListItem = ({ user }) => (
    <li className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </li>
  );

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
          <div className="fixed inset-0 bg-black bg-opacity-40" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 flex items-center">
                    <Briefcase className="h-6 w-6 mr-3 text-indigo-600" />
                    {batch.name}
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mentors Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <h4 className="text-md font-semibold text-gray-700">Mentors ({mentors.length})</h4>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {mentors.map(mentor => <UserListItem key={mentor._id} user={mentor} />)}
                      {mentors.length === 0 && <li className="text-sm text-gray-500 py-2">No mentors assigned.</li>}
                    </ul>
                  </div>

                  {/* Interns Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <h4 className="text-md font-semibold text-gray-700">Interns ({interns.length})</h4>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {interns.map(intern => <UserListItem key={intern._id} user={intern} />)}
                      {interns.length === 0 && <li className="text-sm text-gray-500 py-2">No interns assigned.</li>}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BatchDetailModal; 