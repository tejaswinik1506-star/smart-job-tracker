import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store/useAppStore';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { ParticlesBackground } from '../effects/ParticlesBackground';
import { Icons } from '../ui/icons';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useAppStore();

  const navigation = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, Icon: Icons.dashboard },
    { name: 'Applications', path: ROUTES.APPLICATIONS, Icon: Icons.applications },
    { name: 'Resume Analyzer', path: ROUTES.RESUME_ANALYZER, Icon: Icons.search },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated Particles Background */}
      <ParticlesBackground />
      {/* Header with Advanced Glassmorphism */}
      <header className="sticky top-0 z-40 w-full glass-strong border-b border-white/10 backdrop-blur-2xl neon-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with Enhanced Animation */}
            <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-3 group">
              <motion.div
                className="magnetic"
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Icons.briefcase className="w-8 h-8 text-white filter drop-shadow-lg" />
              </motion.div>
              <span className="font-bold text-xl hidden sm:inline-block gradient-text glitch">
                {APP_NAME}
              </span>
            </Link>

            {/* Navigation with 3D Effect */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 liquid-button flex items-center gap-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-deep neon-glow-purple animate-gradient'
                          : 'text-gray-300 hover:text-white glass-strong border border-white/10 hover:border-purple-500/50'
                      }`}
                    >
                      <item.Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Right side with enhanced styling */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle with 3D animation */}
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl glass-strong hover:neon-glow-purple transition-all duration-300 border border-white/10 hover:border-purple-500/50 card-3d"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.15, rotateY: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {isDarkMode ? (
                  <Icons.sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Icons.moon className="w-5 h-5 text-blue-400" />
                )}
              </motion.button>

              {/* User menu with advanced glassmorphism */}
              {user && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 glass-strong rounded-xl px-3 py-2 border border-white/10 hover:border-purple-500/50 neon-border card-3d"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold gradient-text">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  
                  {user.photoURL ? (
                    <motion.img
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full ring-2 ring-purple-500/50 shadow-deep"
                    />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-deep neon-glow-purple animate-gradient"
                    >
                      {user.email.charAt(0).toUpperCase()}
                    </motion.div>
                  )}
                  
                  <motion.button
                    onClick={handleSignOut}
                    className="p-2 text-gray-400 hover:text-white glass-strong rounded-lg transition-all duration-300 hover:neon-glow-purple border border-white/10"
                    aria-label="Sign out"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icons.logout className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation with glass effect */}
      <nav className="md:hidden glass-strong border-b border-white/10 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:glass'
                  }`}
                >
                  <item.Icon className="w-6 h-6 mb-1" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content with padding */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>

      {/* Footer with glassmorphism */}
      <footer className="glass-strong border-t border-white/10 mt-auto relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2025 <span className="gradient-text font-semibold">{APP_NAME}</span>. Built with React & Firebase.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 hover:scale-105 transform"
              >
                <Icons.github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 hover:scale-105 transform"
              >
                <Icons.info className="w-4 h-4" />
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center gap-1.5 hover:scale-105 transform"
              >
                <Icons.applications className="w-4 h-4" />
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
