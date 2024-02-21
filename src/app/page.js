"use client";
import { useState } from 'react';
import TileEditor from './tile-editor.jsx'; 
import ChartEditor from './chart-editor.jsx';
import DashboardEditor from './dashboard-editor.jsx';
import TileEditorEditor from './tile-editor.jsx'; 
import { Button } from "@/components/ui/button";

export default function Home() {
  const [page, setPage] = useState('dashboard');

  return (
    <main className='w-full h-full'>
      <Button onClick={() => setPage('dashboard')}>Dashboard Editor</Button>
      <Button onClick={() => setPage('chart')}>Chart Editor</Button>
      {page === 'dashboard' && <DashboardEditor/>}
      {page === 'chart' && <ChartEditor/>}
    </main>
  );
}