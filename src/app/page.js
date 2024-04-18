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
  
  const [page, setPage] = useState('dashboard');
  const [globalState, setGlobalState] = useState(initialState);

  
  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
    <main className='w-full h-full'>
      <Navbar setPage={setPage}/>
      {page === 'chart' && <ChartEditor/>}
      {page === 'dashboard' && <Dashboard/>}
      {page === 'tileEditor' && <TileEditor/>}
      {page === 'registerHost' && <RegisterHost/>}
    </main>
    </GlobalStateContext.Provider>
  );
}