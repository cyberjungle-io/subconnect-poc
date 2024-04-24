import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import Dashboard from "@/app/dashboard";
import RegisterHost from "@/app/register-host.jsx";
import TileEditor from "@/app/tile-editor.jsx";
import ChartEditor from "@/app/chart-editor.jsx";
const Navbar = ({ setPage,setIsAccountModalOpen, accountName, addDashboard}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="bg-gray-800 text-white">
       {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeMenu}
        ></div>
      )}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Hamburger button */}
          <div className="flex">
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
          <div className="flex justify-right">
          <button 
  className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md" 
  onClick={() => setIsAccountModalOpen(true)}
>
  {accountName ? `${accountName}` : 'Connect Wallet'}
</button>
          </div>
        </div>
      </div>

      {/* Collapsible menu content */}
      {isOpen && (
        
        <div
          className={`absolute top-0 left-0 w-[300px] h-full bg-gray-700 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-30`}
        >
            <div className="flex justify-end">
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                ""
              )}
            </button>
          </div>
          <div className="bg-gray-700 p-4 ">
            <h3 className="bg-transparent hover:bg-black hover:bg-opacity-25 text-white py-2 px-4 rounded cursor-pointer" onClick={() => setPage("dashboard")}>
              Dashboards
            </h3>
            <button onClick={addDashboard} className="btn btn-primary ml-2">
          Add Dashboard
        </button>
            <h3 className="bg-transparent hover:bg-black hover:bg-opacity-25 text-white py-2 px-4 rounded cursor-pointer" onClick={() => setPage("chart")}>
              Charts
            </h3>
            <h3 className="bg-transparent hover:bg-black hover:bg-opacity-25 text-white py-2 px-4 rounded cursor-pointer" onClick={() => setPage("tileEditor")}>
              Tiles
            </h3>
            <h3 className="bg-transparent hover:bg-black hover:bg-opacity-25 text-white py-2 px-4 rounded cursor-pointer" onClick={() => setPage("registerHost")}>Data</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
