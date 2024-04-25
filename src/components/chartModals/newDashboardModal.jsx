import React, { useState, useContext } from "react";
import { GlobalStateContext } from "@/app/page";

const NewDashboardModal = ({ onSubmit, closeModal }) => {
    const [name, setName] = useState('');
    const { globalState, setGlobalState } = useContext(GlobalStateContext);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const newDashboard = {
          name: name || `Dashboard ${globalState.data.dashboards.length + 1}`,
          dashboard: [],
      };
      const newState = {
          ...globalState,
          data: {
              ...globalState.data,
              dashboards: [...globalState.data.dashboards, newDashboard],
              currentDashboard: globalState.data.dashboards.length,
          },
      };
      setGlobalState(newState);
      closeModal();
  };

  // Function to stop event propagation
  const handleModalClick = (event) => {
    event.stopPropagation();
};
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black" onClick={closeModal}>
        <div className="bg-white p-4 rounded-lg shadow-lg"  onClick={(e) => e.stopPropagation()}>
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
