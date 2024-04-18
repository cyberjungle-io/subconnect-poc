"use client";
import React, { useState, useEffect, useContext, createContext } from 'react';



import TileEditor from './tile-editor.jsx'; 
import ChartEditor from './chart-editor.jsx';
import DashboardEditor from './dashboard-editor.jsx';
import TileEditorEditor from './tile-editor.jsx'; 
import { Button } from "@/components/ui/button";
import Dashboard from './dashboard.jsx';
import RegisterHost from './register-host.jsx';
import Navbar from '../components/custom/Navbar.jsx';
import PolkadotJSModal from "@/components/ui/select-js-wallet.jsx";

const initialState = {
  account_id: null,
  key: null,
  data: {
    tiles: {},
    dashboards: {},
    charts: {},
  },
};
// Create a context
export const GlobalStateContext = createContext();


export default function Home() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [globalState, setGlobalState] = useState(initialState);
  const handleSelectAccountContent = (acct) => {
    console.log(acct);
    const newacct = {
      name: acct.meta.name,
      address: acct.address,
    };
    //saveLocalStorage(newacct);
    localStorage.setItem("subconnect", JSON.stringify(newacct));
    console.log(globalState);
    globalState["account_id"] = newacct.address;
    getStorageData(newacct.address);

    setIsAccountModalOpen(false);
  };
  
  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {isAccountModalOpen && (
          <div className="modal">
            <PolkadotJSModal
              onClose={() => setIsAccountModalOpen(false)}
              handleSelectContent={handleSelectAccountContent}
            />
          </div>
        )}
    <main className='w-full h-full'>
      <Navbar setPage={setPage} setIsAccountModalOpen={setIsAccountModalOpen}/>
      {page === 'chart' && <ChartEditor/>}
      {page === 'dashboard' && <Dashboard/>}
      {page === 'tileEditor' && <TileEditor/>}
      {page === 'registerHost' && <RegisterHost/>}
    </main>
    </GlobalStateContext.Provider>
  );
}