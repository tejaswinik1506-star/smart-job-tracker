import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: 'blur(12px)' }}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                rotateX: 0,
                transition: {
                  type: "spring",
                  damping: 25,
                  stiffness: 300
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50,
                transition: { duration: 0.2 }
              }}
              className={cn(
                'w-full pointer-events-auto relative',
                sizes[size]
              )}
            >
              {/* Glow Effect Behind Modal */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-3xl opacity-30 animate-pulse" />
              
              {/* Modal Card */}
              <div className="relative glass-strong rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Animated Border Effect */}
                <div className="absolute inset-0 rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-20 animate-gradient" />
                </div>

                {/* Sparkle Effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-xl animate-pulse delay-1000" />

                {/* Header */}
                {title && (
                  <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold gradient-text"
                    >
                      {title}
                    </motion.h2>
                    
                    {/* Close Button */}
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                      <div className="relative glass-strong p-2 rounded-xl border border-white/20 hover:border-red-500/50 transition-colors">
                        <svg
                          className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </motion.button>
                  </div>
                )}

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10 p-8"
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
