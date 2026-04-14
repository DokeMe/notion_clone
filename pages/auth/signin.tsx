import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const SignInPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      name,
      password,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/');
    } else {
      setError('Neplatné přihlašovací údaje. Zkuste to znovu.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-gray-900">
      <Head>
        <title>Přihlášení | Notion Klon</title>
      </Head>
      <div className="w-full max-w-sm px-8">
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
           </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-8">Přihlášení do aplikace</h1>
        
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
              placeholder="Zadejte své jméno"
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
              placeholder="Zadejte heslo"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Nemáte ještě účet?{' '}
          <Link href="/auth/register" className="font-medium text-black hover:underline">
            Zaregistrujte se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
