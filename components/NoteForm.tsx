import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useEffect } from 'react';
import type { Note } from '@prisma/client';
import EditorWrapper from './EditorWrapper';

type Inputs = {
  title: string;
};

type NoteFormProps = {
  onNoteCreated: () => void;
  noteToEdit?: Note | null;
  onDelete?: (id: string) => void;
};

const NoteForm = ({ onNoteCreated, noteToEdit, onDelete }: NoteFormProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>({
    defaultValues: {
      title: noteToEdit?.title || '',
    }
  });
  
  const [content, setContent] = useState<string>(noteToEdit?.content || '');
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue('title', noteToEdit?.title || '');
    setContent(noteToEdit?.content || '');
    setServerError(null);
  }, [noteToEdit, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError(null);
    setLoading(true);

    const isEditing = !!noteToEdit;
    const url = '/api/notes';
    const method = isEditing ? 'PUT' : 'POST';
    const body = JSON.stringify({ ...data, content, id: noteToEdit?.id });

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    setLoading(false);

    if (res.ok) {
      if (!isEditing) {
         reset();
         setContent(''); 
      }
      onNoteCreated();
    } else {
      const errorData = await res.json();
      setServerError(errorData.message || 'Nepodařilo se uložit poznámku.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col w-full max-w-4xl mx-auto px-8 sm:px-12 md:px-24 py-12 relative group">
      
      <div className="flex justify-between items-center mb-8 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <p className="text-xs text-gray-400">
          Nezapomeňte změny uložit.
        </p>
        <div className="flex items-center gap-2">
           {noteToEdit && (
             <a 
                href={`/api/notes/export?id=${noteToEdit.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
             >
                Export (JSON)
             </a>
           )}
           {noteToEdit && onDelete && (
             <button 
                type="button" 
                onClick={() => onDelete(noteToEdit.id)} 
                className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors"
             >
                Smazat
             </button>
           )}
           <button 
              type="submit" 
              disabled={loading} 
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50"
           >
              {loading ? 'Ukládám...' : 'Uložit'}
           </button>
        </div>
      </div>

      {serverError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
          {serverError}
        </div>
      )}
      
      <input
        id="title"
        {...register('title')}
        placeholder="Název stránky"
        className="w-full text-4xl sm:text-5xl font-bold text-gray-900 placeholder-gray-200 border-none focus:outline-none focus:ring-0 bg-transparent mb-8 resize-none"
        autoComplete="off"
      />

      <div className="flex-1 w-full text-gray-800">
        <EditorWrapper 
          initialContent={content} 
          onChange={(newContent) => setContent(newContent)} 
        />
      </div>
    </form>
  );
};

export default NoteForm;
