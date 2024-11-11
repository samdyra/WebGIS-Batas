import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignIn from './hooks/useSignIn';
import useAuthStore from './hooks/useAuthStore';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate: signIn, isLoading } = useSignIn();

  const user = useAuthStore((state) => state.user); // Get user from auth store

  useEffect(() => {
    if (user) {
      // If user is logged in, navigate to admin page
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(
      { username, password },
      {
        onSuccess: () => {
          navigate('/admin');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side with background image and text */}
      <div
        className="flex-1 bg-main-green-dark text-white p-12 flex flex-col justify-between"
        style={{ backgroundImage: 'url("/path-to-your-blue-texture-image.jpg")', backgroundSize: 'cover' }}
      >
        <div>
          <div className="text-3xl font-bold mb-4">Biro Pemotda Jawa Barat</div>
          <div className="text-5xl font-bold">
            Sistem Informasi Monitoring
            <br />
            dan Evaluasi
            <br />
            Batas Daerah
          </div>
        </div>
        <div className="text-sm">©2024</div>
      </div>

      {/* Right side with login form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md border py-xl px-xl shadow-md rounded-lg">
          <div className="mb-8">
            <a href="/webgis" className="text-main-green hover:underline">
              ← Kembali ke Peta
            </a>
          </div>
          <h2 className="text-3xl font-bold mb-2">Login</h2>
          <p className="text-gray-600 mb-8">Silakan masukkan username dan password</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Masuk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
