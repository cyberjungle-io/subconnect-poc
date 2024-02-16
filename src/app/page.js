import Link from 'next/link';
import Image from 'next/image';
import TileEditor from './tile-editor.jsx'; 
import ChartEditor from './chart-editor.jsx';
import TileEditorEditor from './tile-editor.jsx'; 



export default function Home() {
  return (
    <main className='w-full h-full'>
    <ChartEditor/>
    </main>
  );
}