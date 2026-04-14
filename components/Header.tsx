import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      <Link href="/">
        <h2 className="text-2xl font-bold">Poznámky</h2>
      </Link>
      <div className="flex items-center">
        {loading && <p className="text-gray-500">Načítání...</p>}
        
        {!loading && !session && (
          <div className="space-x-4">
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Přihlásit se
            </Link>
            <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Registrovat
            </Link>
          </div>
        )}

        {session?.user && (
          <div className="flex items-center space-x-4">
            <span>
              Přihlášen jako: <strong className="font-semibold">{session.user.name}</strong>
            </span>
            <button 
              onClick={() => signOut()} 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Odhlásit se
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
