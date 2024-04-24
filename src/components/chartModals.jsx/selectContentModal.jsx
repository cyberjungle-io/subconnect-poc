import React, { useState } from "react";
import ChartSelectModal from "./chartSelectModal";
import TileSelectModal from "./tileSelectModal";

function SelectContentModal({
  isOpen,
  onClose,
  content,
  
  onSelect,
  
}) {
  const [activeTab, setActiveTab] = useState("tab1"); // Initialize with 'tab1'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        {/* Tabs at the top of the modal */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("tab1")}
            className={`flex-1 py-3 flex items-center justify-center ${
              activeTab === "tab1"
                ? "border-b-4 border-blue-500 text-blue-500"
                : "border-b-4 border-transparent text-gray-600"
            } hover:border-blue-500 hover:text-blue-500 transition-colors duration-300`}
            style={{ borderTopLeftRadius: "0.5rem" }}
          >
            {/* Icon and label for Tiles */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
            Tiles
          </button>
          <button
            onClick={() => setActiveTab("tab2")}
            className={`flex-1 py-3 flex items-center justify-center ${
              activeTab === "tab2"
                ? "border-b-4 border-blue-500 text-blue-500"
                : "border-b-4 border-transparent text-gray-600"
            } hover:border-blue-500 hover:text-blue-500 transition-colors duration-300`}
            style={{ borderTopRightRadius: "0.5rem" }}
          >
            {/* Icon and label for Charts */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
              />
            </svg>
            Charts
          </button>
        </div>

        {/* Modal content based on active tab */}
        <div className="p-5 text-center">
          {activeTab === "tab1" ? (
            <>
              <TileSelectModal
                content={content[1]}
                onSelect={onSelect[1]}
              />
            </>
          ) : (
            <>
              <ChartSelectModal
                content={content[0]}
                onSelect={onSelect[0]}
              />
            </>
          )}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectContentModal;
