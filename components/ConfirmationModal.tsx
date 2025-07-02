
import React, { Fragment } from 'react';
import { Icon } from './icons/Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
              <Icon name="warning" className="h-6 w-6 text-red-400"/>
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-100">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-400">{message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-700/50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-gray-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
