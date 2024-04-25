import React, { useState } from "react";

const NewDashboardModal = ({ onSubmit, closeModal }) => {
    const [name, setName] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onSubmit(name); // Pass the dashboard name to the addDashboard function
    };
  // Function to stop event propagation
  const handleModalClick = (event) => {
    event.stopPropagation();
};
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
        <div className="bg-white p-4 rounded-lg shadow-lg"  onClick={handleModalClick}>
          <h2 className="text-lg font-bold mb-4">Create New Dashboard</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-gray-300 p-2 w-full mb-4"
              placeholder="Dashboard Name"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Create
            </button>
            <button onClick={closeModal} type="button" className="bg-red-500 text-white px-4 py-2 rounded ml-2">
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  };
  export default NewDashboardModal;
