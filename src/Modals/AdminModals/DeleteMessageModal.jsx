import React from 'react';
import Modal from 'react-modal';

const DeleteMessageModal = ({ isOpen, onRequestClose, onDelete }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Delete Message Confirmation"
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
  >
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
      <p className="mb-6 text-gray-600">Are you sure you want to delete this message?</p>
      <div className="flex justify-end gap-4">
        <button onClick={onRequestClose} className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md">Cancel</button>
        <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md">Delete</button>
      </div>
    </div>
  </Modal>
);

export default DeleteMessageModal;
