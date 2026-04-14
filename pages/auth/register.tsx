import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess('Účet byl úspěšně vytvořen! Můžete se přihlásit.');
      setTimeout(() => router.push('/auth/signin'), 2000);
    } else {
      setError(data.message || 'Něco se pokazilo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-gray-900">
      <Head>
        <title>Registrace | Notion Klon</title>
      </Head>
      <div className="w-full max-w-sm px-8">
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
           </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-8">Vytvořit nový účet</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Jméno</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              placeholder="Zvolte si jméno"
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-600 mb-1">Heslo</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              placeholder="Zvolte si heslo"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">{success}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Zakládám účet...' : 'Zaregistrovat se'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Už máte vytvořený účet?{' '}
          <Link href="/auth/signin" className="font-medium text-black hover:underline">
            Přihlaste se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
