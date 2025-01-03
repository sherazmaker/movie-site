import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear any authentication-related data
    localStorage.removeItem('user');
    
    // Redirect to login/sign-in page
    router.push('/signin');
  };

  useEffect(() => {
    // Check if the user is authenticated
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/signin'); // Redirect if not logged in
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Welcome to the Home Page!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
