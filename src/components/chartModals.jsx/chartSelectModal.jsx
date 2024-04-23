// ChartSelectModal.js
import React from 'react';

function ChartSelectModal({ isOpen, content, onSelect, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <h2>Select Content</h2>
        <ul>
          {content.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {item.form.title.text} {/* Assuming each content has a title */}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ChartSelectModal;
