"use client";
import { useState } from 'react';
import TileEditor from './tile-editor.jsx'; 
import ChartEditor from './chart-editor.jsx';
import DashboardEditor from './dashboard-editor.jsx';
import TileEditorEditor from './tile-editor.jsx'; 
import { Button } from "@/components/ui/button";
import NewDashboard from './newDashboard.jsx';

export default function Home() {
  const [page, setPage] = useState('dashboard');

  return (
    <main className='w-full h-full'>
      <Button onClick={() => setPage('dashboard')}>Dashboard Editor</Button>
      <Button onClick={() => setPage('chart')}>Chart Editor</Button>
      <Button onClick={() => setPage('newDashboard')}>NewDashboard</Button>
      {page === 'dashboard' && <DashboardEditor/>}
      {page === 'chart' && <ChartEditor/>}
      {page === 'newDashboard' && <NewDashboard/>}
    </main>
  );
}