import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export default function LandingPage() {
  const { token } = useAuth();

  useEffect(() => {
    document.title = 'GigFlow | Smart Leads';
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans">
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 dark:bg-brand-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-7xl mx-auto px-6 pt-8">
        <nav className="flex justify-between items-center py-6 glass px-8 rounded-2xl animate-fade-in-up">
          <div className="text-2xl font-display font-bold text-gradient">GigFlow</div>
          <div className="flex gap-4">
            {token ? (
              <Link to="/dashboard" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition shadow-lg shadow-brand-500/30">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Sign In
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition shadow-lg shadow-brand-500/30">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        <main className="mt-24 md:mt-32 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-100 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-medium text-sm">
            🚀 The Next Generation B2B CRM
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 leading-tight max-w-4xl">
            Manage your leads with <br/>
            <span className="text-gradient">intelligent workflows</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl font-light">
            Capture, qualify, and convert leads seamlessly. Built for high-performing sales teams to accelerate growth and close deals faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {token ? (
              <Link to="/dashboard" className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:scale-105 transition transform shadow-xl">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl hover:scale-105 transition transform shadow-xl shadow-brand-500/30">
                  Start for Free
                </Link>
                <Link to="/login" className="px-8 py-4 glass text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:scale-105 transition transform">
                  Sign In to Account
                </Link>
              </>
            )}
          </div>
        </main>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 pb-32 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {[
            { title: 'Smart Filtering', desc: 'Find exact leads in seconds with advanced queries.', icon: '🔍' },
            { title: 'Real-time Sync', desc: 'Always have the latest status on your deals.', icon: '⚡' },
            { title: 'Secure & Fast', desc: 'Built on a modern stack ensuring top performance.', icon: '🛡️' }
          ].map((feature, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl hover:-translate-y-2 transition duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition transform origin-left">{feature.icon}</div>
              <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
