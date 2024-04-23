import React, { useState } from 'react';
import ChartSelectModal from './ChartSelectModal';

function SelectContentModal({ isOpen, onClose, content, onSelect,handleSelectChart }) {
    const [activeTab, setActiveTab] = useState('tab1');  // Initialize with 'tab1'

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
                {/* Tabs at the top of the modal */}
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('tab1')}
                        className={`flex-1 py-3 flex items-center justify-center ${activeTab === 'tab1' ? 'border-b-4 border-blue-500 text-blue-500' : 'border-b-4 border-transparent text-gray-600'} hover:border-blue-500 hover:text-blue-500 transition-colors duration-300`}
                        style={{ borderTopLeftRadius: '0.5rem' }}
                    >
                        {/* Icon and label for Tiles */}
                        Tiles
                    </button>
                    <button
                        onClick={() => setActiveTab('tab2')}
                        className={`flex-1 py-3 flex items-center justify-center ${activeTab === 'tab2' ? 'border-b-4 border-blue-500 text-blue-500' : 'border-b-4 border-transparent text-gray-600'} hover:border-blue-500 hover:text-blue-500 transition-colors duration-300`}
                        style={{ borderTopRightRadius: '0.5rem' }}
                    >
                        {/* Icon and label for Charts */}
                        Charts
                    </button>
                </div>

                {/* Modal content based on active tab */}
                <div className="p-5 text-center">
                    {activeTab === 'tab1' ? (
                        <p>Tiles Content Here</p>
                    ) : (
                        <>
                        <p>charts</p>
                        <ChartSelectModal
                            
                            content={content}
                            onSelect={handleSelectChart}
                              // Switch back to the first tab or close modal entirely
                        /></>
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
