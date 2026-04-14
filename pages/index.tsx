import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import NoteForm from '../components/NoteForm';
import type { Note } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    } else {
      setNotes([]);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotes();
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete poznámku trvale smazat?')) return;

    const res = await fetch(`/api/notes?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      if (activeNoteId === id) setActiveNoteId(null);
      fetchNotes(); 
    } else {
      alert('Nepodařilo se smazat poznámku.');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const res = await fetch('/api/notes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert('Import proběhl úspěšně!');
        fetchNotes();
      } else {
        const errorData = await res.json();
        alert('Chyba při importu: ' + errorData.message);
      }
    } catch (err) {
      alert('Neplatný JSON soubor.');
    }
    
    e.target.value = '';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400">Načítání...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Head>
          <title>Notion Klon</title>
        </Head>
        <div className="text-center max-w-md mx-auto p-8 rounded-xl">
          <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Poznámky</h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Váš osobní prostor pro myšlenky, úkoly a plány. Inspirováno minimalismem Notion.
          </p>
          <Link 
            href="/auth/signin" 
            className="block text-center w-full bg-black text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
          >
            Přihlásit se pro pokračování
          </Link>
        </div>
      </div>
    );
  }

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  return (
    <div className="flex h-screen bg-white overflow-hidden text-gray-900 font-sans">
      <Head>
         <title>{activeNote?.title || 'Nová poznámka'} | Notion Klon</title>
      </Head>
      
      <aside className="w-64 bg-[#fbfbfa] flex flex-col border-r border-gray-200/80 shadow-sm z-10 shrink-0">
        
        <div className="p-4 flex items-center justify-between hover:bg-gray-200/50 cursor-pointer transition-colors group">
          <div className="flex items-center gap-3 truncate">
            <div className="w-6 h-6 bg-blue-600 rounded text-xs flex items-center justify-center font-bold text-white shadow-sm">
               {session.user.name?.[0].toUpperCase() || 'U'}
            </div>
            <span className="font-semibold text-sm truncate text-gray-700">{session.user.name}&apos;s Notion</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Poznámky</div>
          <ul className="space-y-[1px]">
            {notes.map(note => (
              <li key={note.id}>
                <button 
                  onClick={() => setActiveNoteId(note.id)}
                  className={`w-full text-left px-4 py-1.5 text-sm flex items-center gap-3 transition-colors ${
                    activeNoteId === note.id 
                    ? 'bg-gray-200/80 font-medium text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-200/50'
                  }`}
                >
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <span className="truncate">{note.title || 'Bez názvu'}</span>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 px-2 space-y-[2px]">
            <button 
              onClick={() => setActiveNoteId(null)} 
              className="w-full text-left px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200/60 rounded transition-colors flex items-center gap-3 group"
            >
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Přidat poznámku
            </button>
            
            <a 
              href="/api/notes/export"
              target="_blank"
              rel="noreferrer"
              className="w-full text-left px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200/60 rounded transition-colors flex items-center gap-3 group"
            >
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Exportovat vše (JSON)
            </a>

            <label className="w-full text-left px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200/60 rounded transition-colors flex items-center gap-3 group cursor-pointer">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Importovat (JSON)
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200/60 bg-[#fbfbfa]">
           <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-900 w-full text-left flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-200/60 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Odhlásit se
           </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-white relative">
        <NoteForm 
          key={activeNoteId || 'new'} 
          noteToEdit={activeNote} 
          onNoteCreated={fetchNotes} 
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default HomePage;
