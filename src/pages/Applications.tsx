import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useAuth } from '../hooks/useAuth';
import { useFirestoreApplications } from '../hooks/useFirestoreApplications';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Icons, getStatusIcon } from '../components/ui/icons';
import { APPLICATION_STATUSES, formatDate } from '../utils/constants';
import type { JobApplication, ApplicationStatus } from '../types';

export const Applications: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useAppStore();
  const {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useFirestoreApplications(user?.id || null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'company'>('date');
  const [showConfetti, setShowConfetti] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied' as ApplicationStatus,
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      }
      return a.company.localeCompare(b.company);
    });

    return filtered;
  }, [applications, searchQuery, filterStatus, sortBy]);

  const openModal = (app?: JobApplication) => {
    if (app) {
      setEditingApp(app);
      setFormData({
        company: app.company,
        role: app.role,
        status: app.status,
        appliedDate: app.appliedDate,
        notes: app.notes,
      });
    } else {
      setEditingApp(null);
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (editingApp) {
      updateApplication(editingApp.id, formData);
      addToast({ message: 'Application updated successfully', type: 'success' });
    } else {
      const newApp: JobApplication = {
        id: Date.now().toString(),
        ...formData,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addApplication(newApp);
      addToast({ message: 'Application added successfully', type: 'success' });
      
      // Show confetti for new application
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    deleteApplication(id);
    addToast({ message: 'Application deleted', type: 'info' });
    setDeleteConfirm(null);
  };

  const getStatusGradient = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return 'from-blue-600 to-cyan-600';
      case 'Interview':
        return 'from-yellow-600 to-orange-600';
      case 'Offer':
        return 'from-green-600 to-emerald-600';
      case 'Rejected':
        return 'from-red-600 to-pink-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const statusStats = useMemo(() => {
    const stats = {
      All: applications.length,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      stats[app.status]++;
    });

    return stats;
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Confetti for celebrations */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Icons.applications className="w-10 h-10" />
            Job Applications
          </h1>
          <p className="text-gray-400">
            Manage and track all your job applications in one place
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-0"
        >
          <Button
            onClick={() => openModal()}
            className="btn-gradient hover-lift shadow-xl flex items-center gap-2"
          >
            <Icons.add className="w-5 h-5" />
            Add New Application
          </Button>
        </motion.div>
      </motion.div>

      {/* Status Filter Chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-wrap gap-3">
          {(['All', ...APPLICATION_STATUSES] as const).map((status, index) => {
            const isActive = filterStatus === status;
            const count = statusStats[status as keyof typeof statusStats] || 0;
            
            return (
              <motion.button
                key={status}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setFilterStatus(status as ApplicationStatus | 'All')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? `bg-gradient-to-r ${getStatusGradient(status as ApplicationStatus)} text-white shadow-lg scale-105`
                    : 'glass-strong text-gray-300 hover:text-white hover:glass border border-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status === 'All' ? (
                  <Icons.barChart className="w-5 h-5" />
                ) : (
                  React.createElement(getStatusIcon(status).Icon, { className: "w-5 h-5" })
                )}
                <span>{status}</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Search and Sort Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 glass-strong border border-white/20 focus:border-purple-500"
            />
          </div>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'company')}
            className="glass-strong border border-white/20 focus:border-purple-500"
          >
            <option value="date">Sort by Date</option>
            <option value="company">Sort by Company</option>
          </Select>
        </div>
      </motion.div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            {filterStatus === 'All' ? (
              <Icons.applications className="w-24 h-24 text-gray-400" />
            ) : (
              React.createElement(getStatusIcon(filterStatus).Icon, { className: "w-24 h-24 text-gray-400" })
            )}
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {filterStatus === 'All' ? 'No Applications Yet' : `No ${filterStatus} Applications`}
          </h3>
          <p className="text-gray-400 mb-6">
            {filterStatus === 'All'
              ? 'Start tracking your job applications by adding your first one!'
              : `You don't have any applications with status "${filterStatus}"`}
          </p>
          {filterStatus === 'All' && (
            <Button onClick={() => openModal()} className="btn-gradient flex items-center gap-2 mx-auto">
              <Icons.add className="w-5 h-5" />
              Add Your First Application
            </Button>
          )}
          {filterStatus !== 'All' && (
            <Button onClick={() => setFilterStatus('All')} variant="secondary" className="flex items-center gap-2 mx-auto">
              <Icons.barChart className="w-5 h-5" />
              View All Applications
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-strong rounded-2xl overflow-hidden card-3d card-3d-shadow neon-border spotlight border border-white/10 hover:border-purple-500/50"
              >
                {/* Status Banner with Animation */}
                <div className={`h-2 bg-gradient-to-r ${getStatusGradient(app.status)} animate-gradient`} />
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold gradient-text mb-1 group-hover:neon-glow-purple transition-all">
                        {app.company}
                      </h3>
                      <p className="text-gray-300 text-sm font-medium">{app.role}</p>
                    </div>
                    {React.createElement(getStatusIcon(app.status).Icon, {
                      className: "w-8 h-8 magnetic " + getStatusIcon(app.status).color,
                    })}
                  </div>

                  {/* Status Badge with Neon Effect */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusGradient(
                        app.status
                      )} text-white shadow-deep neon-glow-purple`}
                    >
                      {React.createElement(getStatusIcon(app.status).Icon, { className: "w-4 h-4" })}
                      {app.status}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <Icons.calendar className="w-4 h-4 mr-2" />
                    <span>Applied on {formatDate(app.appliedDate)}</span>
                  </div>

                  {/* Notes Preview */}
                  {app.notes && (
                    <div className="glass-strong rounded-lg p-3 mb-4 border border-white/10">
                      <div className="flex items-start gap-2">
                        <Icons.applications className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {app.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => openModal(app)}
                      className="flex-1 glass-strong hover:glass border border-white/20 hover:border-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icons.edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                    
                    {deleteConfirm === app.id ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex-1 flex gap-2"
                      >
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-2 rounded-xl font-medium text-sm flex items-center justify-center gap-1"
                        >
                          <Icons.check className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 glass-strong text-white px-3 py-2 rounded-xl font-medium text-sm flex items-center justify-center gap-1"
                        >
                          <Icons.close className="w-4 h-4" />
                          Cancel
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        onClick={() => setDeleteConfirm(app.id)}
                        className="glass-strong hover:glass border border-white/20 hover:border-red-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icons.delete className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingApp ? 'Edit Application' : 'Add New Application'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Company Name"
            type="text"
            placeholder="e.g., Google, Microsoft, Apple"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
            className="glass-strong border border-white/20 focus:border-purple-500"
          />

          <Input
            label="Job Role"
            type="text"
            placeholder="e.g., Frontend Developer, Product Manager"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            className="glass-strong border border-white/20 focus:border-purple-500"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
            required
            className="glass-strong border border-white/20 focus:border-purple-500"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <Input
            label="Applied Date"
            type="date"
            value={formData.appliedDate}
            onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            required
            className="glass-strong border border-white/20 focus:border-purple-500"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add any additional notes, interview dates, contacts, etc..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl glass-strong border border-white/20 focus:border-purple-500 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 btn-gradient flex items-center justify-center gap-2">
              <Icons.save className="w-5 h-5" />
              {editingApp ? 'Update Application' : 'Add Application'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1 flex items-center justify-center gap-2">
              <Icons.close className="w-5 h-5" />
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
