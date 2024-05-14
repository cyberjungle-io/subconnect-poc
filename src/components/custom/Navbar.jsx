import React, { useState,useEffect,useContext } from "react";

import { Button } from "@/components/ui/button";
import Dashboard from "@/app/dashboard";
import RegisterHost from "@/app/register-host.jsx";
import TileEditor from "@/app/tile-editor.jsx";
import ChartEditor from "@/app/chart-editor.jsx";
import NewDashboardModal from "@/components/chartModals/newDashboardModal.jsx";
import { GlobalStateContext } from "@/app/page";

const Navbar = ({
  setPage,
  setIsAccountModalOpen,
  _accountName,
  _globalState,
}) => {
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [accountName, setAccountName] = useState("");

useEffect(() => {
  console.log("Navbar: " + JSON.stringify(globalState));
  setAccountName(globalState.account_name);
}, [globalState]);
  const addDashboard = () => {
    const newDashboard = {
      name: `Dashboard ${globalState.data.dashboards.length + 1}`, // Simple naming strategy
      dashboard: [], // Start with an empty dashboard configuration
    };
    const newState = {
      ...globalState,
      data: {
        ...globalState.data,
        dashboards: [...globalState.data.dashboards, newDashboard],
        currentDashboard: globalState.data.dashboards.length, // Set the newly added dashboard as the current one
      },
    };
    setGlobalState(newState); // Update global state
    setRows([]); // Since the new dashboard is empty, set rows to an empty array
  };

  return (
    <div className="bg-gray-800 text-white ">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeMenu}
        ></div>
      )}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Hamburger button */}
          <div className="flex w-1/5">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {!isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                ""
              )}
            </button>
          </div>

          {/* Logo or title */}
          <div className="flex-grow text-center text-xl font-semibold">
            SubConnect
          </div>

          {/* Wallet connect button */}
          <div className="flex justify-end w-1/5">
            <button
              className="flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 py-2 px-4 rounded transition duration-150 ease-in-out"
              onClick={() => setIsAccountModalOpen(true)}
            >
              {accountName ? `${accountName}` : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible menu content */}
{isOpen && (
  <div
    className={`fixed top-0 left-0 w-[300px] h-full bg-gray-800 transform ${
      isOpen ? "translate-x-0" : "translate-x-full"
    } transition-transform duration-300 ease-in-out z-30 flex flex-col`}
  >
    <div className="flex justify-end p-4">
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          ""
        )}
      </button>
    </div>
    <div className="bg-gray-800 p-6 flex-grow overflow-y-auto">
      <h2 className="text-xl font-semibold text-white mb-4">Pages</h2>
      <div className="space-y-3">
        <h3
          className="flex items-center space-x-3 bg-transparent hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
          onClick={() => {
            setPage("dashboard");
            closeMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <span>Personal</span>
        </h3>
        <h3
          className="flex items-center space-x-3 bg-transparent hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
          onClick={() => {
            setPage("dashboard");
            closeMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
          <span>Group</span>
        </h3>
        <h3
          className="flex items-center space-x-3 bg-transparent hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
          onClick={() => {
            setPage("dashboard");
            closeMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          <span>Public</span>
        </h3>
        <button
          className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md w-full"
          onClick={() => {
            setIsModalOpen(true);
            closeMenu();
          }} // Open modal
        >
          Add Page
        </button>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">Editors</h2>
      <div className="space-y-3">
        <h3
          className="flex items-center space-x-3 bg-transparent hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
          onClick={() => {
            setPage("chart");
            closeMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
            />
          </svg>
          <span>Charts</span>
        </h3>
        <h3
          className="flex items-center space-x-3 bg-transparent hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
          onClick={() => {
            setPage("tileEditor");
            closeMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
          <span>Tiles</span>
        </h3>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">Data</h2>
      <div className="space-y-3">
        <h3
          className="flex items-center space-x-3 bg-transparent hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
          onClick={() => {
            setPage("registerHost");
            closeMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5v6m0 0v6m0-6H6m6 0h6M21 12c0 4.5-6 9-9 9S3 16.5 3 12s3-9 9-9 9 4.5 9 9Z"
            />
          </svg>
          <span>Register Host</span>
        </h3>
      </div>
    </div>
  </div>
)}

      
      {isModalOpen && (
        <NewDashboardModal closeModal={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;
