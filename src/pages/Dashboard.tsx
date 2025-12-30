import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useFirestoreApplications } from '../hooks/useFirestoreApplications';
import { Button } from '../components/ui/Button';
import { Icons, getStatusIcon } from '../components/ui/icons';
import { ROUTES, getRelativeTime } from '../utils/constants';
import type { DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { applications } = useFirestoreApplications(user?.id || null);
  const navigate = useNavigate();

  const stats: DashboardStats = useMemo(() => {
    const totalApplications = applications.length;
    const appliedCount = applications.filter((app) => app.status === 'Applied').length;
    const interviewCount = applications.filter((app) => app.status === 'Interview').length;
    const offerCount = applications.filter((app) => app.status === 'Offer').length;
    const rejectedCount = applications.filter((app) => app.status === 'Rejected').length;

    // Calculate weekly data (last 7 days)
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toISOString().split('T')[0];

      const count = applications.filter((app) => {
        const appDate = new Date(app.appliedDate).toISOString().split('T')[0];
        return appDate === dateString;
      }).length;

      return { day: dayName, count };
    });

    return {
      totalApplications,
      appliedCount,
      interviewCount,
      offerCount,
      rejectedCount,
      weeklyData,
    };
  }, [applications]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
      .slice(0, 5);
  }, [applications]);

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      Icon: Icons.barChart,
      gradient: 'from-purple-600 via-blue-600 to-indigo-600',
      glow: 'glow-primary',
    },
    {
      title: 'Applied',
      value: stats.appliedCount,
      Icon: Icons.applied,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      glow: 'glow-success',
    },
    {
      title: 'Interviews',
      value: stats.interviewCount,
      Icon: Icons.interview,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      glow: 'glow-warning',
    },
    {
      title: 'Offers',
      value: stats.offerCount,
      Icon: Icons.offer,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      glow: 'glow-success',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Track your job applications and progress
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 sm:mt-0"
        >
          <Button 
            onClick={() => navigate(ROUTES.APPLICATIONS)}
            className="btn-gradient hover-lift flex items-center gap-2"
          >
            <Icons.applications className="w-5 h-5" />
            View All Applications
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="glass rounded-2xl overflow-hidden card-3d card-3d-shadow neon-border hover:neon-glow-purple relative">
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-25 transition-opacity duration-300 holographic`} />
              
              {/* Gradient top border with pulse */}
              <div className={`h-1.5 bg-gradient-to-r ${stat.gradient} animate-gradient`} />
              
              {/* Spotlight effect */}
              <div className="spotlight">
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      {stat.title}
                    </div>
                    <motion.div
                      className="magnetic"
                      whileHover={{ scale: 1.3, rotate: 15 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <stat.Icon className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    className="text-5xl font-bold gradient-text mb-3"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className={`h-1.5 w-20 bg-gradient-to-r ${stat.gradient} rounded-full neon-glow-purple animate-gradient`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-strong rounded-2xl p-6 card-3d card-3d-shadow neon-border spotlight"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-1 flex items-center gap-2">
                <Icons.activity className="w-6 h-6" />
                Weekly Activity
              </h3>
              <p className="text-sm text-gray-400">Applications submitted this week</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.weeklyData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                  <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                itemStyle={{ color: '#a78bfa' }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#barGradient)" 
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Icons.activity className="w-5 h-5" />
                Recent Applications
              </h3>
              <p className="text-sm text-gray-400">Your latest submissions</p>
            </div>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                className="flex justify-center mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icons.applications className="w-20 h-20 text-gray-400" />
              </motion.div>
              <p className="text-gray-400 mb-4">
                No applications yet
              </p>
              <Button 
                onClick={() => navigate(ROUTES.APPLICATIONS)}
                className="btn-gradient flex items-center gap-2 mx-auto"
              >
                <Icons.add className="w-5 h-5" />
                Add Your First Application
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="glass-strong rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer group border border-white/10 hover:border-white/30"
                  onClick={() => navigate(ROUTES.APPLICATIONS)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate mb-1">
                        {app.company}
                      </p>
                      <p className="text-sm text-gray-300 truncate mb-1">
                        {app.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(app.appliedDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 10 }}
                      >
                        {React.createElement(getStatusIcon(app.status).Icon, {
                          className: "w-6 h-6 " + getStatusIcon(app.status).color
                        })}
                      </motion.div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full glass-strong border border-white/20">
                        {app.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions with Premium Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6"
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Icons.zap className="w-5 h-5" />
            Quick Actions
          </h3>
          <p className="text-sm text-gray-400">Get started with common tasks</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              className="w-full h-32 flex-col space-y-3 glass-strong hover:glass border border-white/10 hover:border-white/30 group relative overflow-hidden"
              onClick={() => navigate(ROUTES.APPLICATIONS)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                className="relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icons.add className="w-10 h-10 text-white" />
              </motion.div>
              <span className="font-semibold text-white relative z-10">Add Application</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              className="w-full h-32 flex-col space-y-3 glass-strong hover:glass border border-white/10 hover:border-white/30 group relative overflow-hidden"
              onClick={() => navigate(ROUTES.RESUME_ANALYZER)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              >
                <Icons.search className="w-10 h-10 text-white" />
              </motion.div>
              <span className="font-semibold text-white relative z-10">Analyze Resume</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              className="w-full h-32 flex-col space-y-3 glass-strong hover:glass border border-white/10 hover:border-white/30 group relative overflow-hidden"
              onClick={() => navigate(ROUTES.APPLICATIONS)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                className="relative z-10"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Icons.barChart className="w-10 h-10 text-white" />
              </motion.div>
              <span className="font-semibold text-white relative z-10">View Reports</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
