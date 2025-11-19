import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAllocations = ({ user }) => {
  const [allocations, setAllocations] = useState([]);
  const [poolFunds, setPoolFunds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [allocationData, setAllocationData] = useState({
    recipientId: '',
    amount: '',
    purpose: '',
    category: 'FOOD'
  });

  useEffect(() => {
    // Simulate loading allocation data
    setIsLoading(true);
    setTimeout(() => {
      setAllocations([
        {
          _id: '1',
          recipientName: 'Maria Kamau',
          amount: 25000,
          category: 'EDUCATION',
          purpose: 'School fees and supplies',
          status: 'COMPLETED',
          allocatedAt: new Date('2024-01-15').toISOString()
        },
        {
          _id: '2',
          recipientName: 'Children\'s Home Nairobi',
          amount: 50000,
          category: 'FOOD',
          purpose: 'Monthly food supplies',
          status: 'PENDING',
          allocatedAt: new Date('2024-01-20').toISOString()
        }
      ]);
      setPoolFunds(1250000);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAllocationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        const newAllocation = {
          _id: Date.now().toString(),
          recipientName: 'New Recipient',
          amount: parseInt(allocationData.amount),
          category: allocationData.category,
          purpose: allocationData.purpose,
          status: 'PENDING',
          allocatedAt: new Date().toISOString()
        };
        
        setAllocations([newAllocation, ...allocations]);
        setPoolFunds(prev => prev - parseInt(allocationData.amount));
        setAllocationData({
          recipientId: '',
          amount: '',
          purpose: '',
          category: 'FOOD'
        });
        setShowAllocationForm(false);
        alert('Allocation created successfully!');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      alert('Allocation failed: ' + error.message);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-success-600 bg-success-50 border-success-200';
      case 'PENDING': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'FAILED': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      FOOD: '🍎',
      EDUCATION: '📚',
      HEALTHCARE: '🏥',
      HOUSING: '🏠',
      CLOTHING: '👕',
      OTHER: '📦'
    };
    return icons[category] || '📦';
  };

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container section">
        <div className="max-w-md mx-auto text-center">
          <div className="card card-lg">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="display-2 mb-4">Admin Access Required</h1>
            <p className="text-lg text-secondary mb-6">
              This area is restricted to platform administrators only.
            </p>
            <div className="space-y-4">
              <a href="/login" className="btn btn-primary w-full">
                Sign In as Admin
              </a>
              <a href="/" className="btn btn-outline w-full">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="display-2 mb-2">Fund Allocations</h1>
          <p className="text-lg text-secondary">
            Manage and distribute pooled funds to recipients
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-tertiary">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            Admin Mode
          </div>
        </div>
      </div>

      {/* Pool Funds Overview */}
      <div className="grid grid-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="h3 text-primary-600">{poolFunds.toLocaleString()} KES</h3>
          <p className="text-sm text-tertiary">Available Pool Funds</p>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-3">📤</div>
          <h3 className="h3 text-secondary-600">{allocations.length}</h3>
          <p className="text-sm text-tertiary">Total Allocations</p>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="h3 text-success-600">
            {allocations.filter(a => a.status === 'COMPLETED').length}
          </h3>
          <p className="text-sm text-tertiary">Completed</p>
        </div>
      </div>

      {/* Allocation Actions */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="h2">Allocation Management</h2>
            <p className="text-tertiary">Create and manage fund distributions</p>
          </div>
          <button 
            className={`btn ${showAllocationForm ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => setShowAllocationForm(!showAllocationForm)}
            disabled={poolFunds === 0}
          >
            {showAllocationForm ? (
              <span className="flex items-center gap-2">
                <span>✕</span>
                Cancel
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>📤</span>
                New Allocation
              </span>
            )}
          </button>
        </div>

        {/* Allocation Form */}
        {showAllocationForm && (
          <div className="border-t pt-6">
            <h3 className="h3 mb-6 flex items-center gap-2">
              <span>🎯</span>
              Create New Allocation
            </h3>
            <form onSubmit={handleAllocationSubmit}>
              <div className="grid grid-2 gap-6 mb-6">
                <div className="form-group">
                  <label className="form-label">Recipient</label>
                  <select
                    value={allocationData.recipientId}
                    onChange={(e) => setAllocationData({...allocationData, recipientId: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Select a recipient...</option>
                    <option value="1">Maria Kamau - Education</option>
                    <option value="2">Children's Home Nairobi - Food</option>
                    <option value="3">Community Health Center - Healthcare</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Amount (KES)</label>
                  <input
                    type="number"
                    value={allocationData.amount}
                    onChange={(e) => setAllocationData({...allocationData, amount: e.target.value})}
                    className="form-input"
                    placeholder="5000"
                    min="100"
                    max={poolFunds}
                    required
                  />
                  <p className="text-xs text-tertiary mt-2">
                    Available: {poolFunds.toLocaleString()} KES
                  </p>
                </div>
              </div>

              <div className="grid grid-2 gap-6 mb-6">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={allocationData.category}
                    onChange={(e) => setAllocationData({...allocationData, category: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="FOOD">Food & Nutrition</option>
                    <option value="EDUCATION">Education</option>
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="HOUSING">Housing</option>
                    <option value="CLOTHING">Clothing</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Purpose</label>
                  <input
                    type="text"
                    value={allocationData.purpose}
                    onChange={(e) => setAllocationData({...allocationData, purpose: e.target.value})}
                    className="form-input"
                    placeholder="Specific purpose for this allocation"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || poolFunds === 0}
                className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Creating Allocation...' : 'Create Allocation'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Allocations List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="h2">Allocation History</h2>
            <p className="text-tertiary">
              {allocations.length} allocation{allocations.length !== 1 ? 's' : ''} made
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading"></div>
            <span className="ml-3 text-tertiary">Loading allocations...</span>
          </div>
        ) : allocations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📤</div>
            <h3 className="h3 text-neutral-700 mb-2">No Allocations Yet</h3>
            <p className="text-tertiary mb-6">
              Start by creating your first fund allocation
            </p>
            <button 
              onClick={() => setShowAllocationForm(true)}
              className="btn btn-primary"
            >
              Create First Allocation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {allocations.map(allocation => (
              <div key={allocation._id} className="card card-hover">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 text-lg">
                        {getCategoryIcon(allocation.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="h3 text-neutral-900">{allocation.recipientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(allocation.status)}`}>
                            {allocation.status}
                          </span>
                        </div>
                        <p className="text-tertiary mb-2">{allocation.purpose}</p>
                        <div className="flex items-center gap-4 text-sm text-tertiary">
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            {new Date(allocation.allocatedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🏷️</span>
                            {allocation.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:text-right">
                    <div className={`border rounded-xl p-4 ${
                      allocation.status === 'COMPLETED' 
                        ? 'bg-success-50 border-success-200' 
                        : 'bg-warning-50 border-warning-200'
                    }`}>
                      <p className="text-2xl font-bold text-neutral-900 mb-1">
                        {allocation.amount.toLocaleString()} KES
                      </p>
                      <p className="text-sm text-tertiary">Allocated Amount</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-200">
                  <button className="btn btn-ghost btn-sm flex items-center gap-2">
                    <span>👁️</span>
                    View Details
                  </button>
                  {allocation.status === 'PENDING' && (
                    <>
                      <button className="btn btn-primary btn-sm flex items-center gap-2">
                        <span>✅</span>
                        Approve
                      </button>
                      <button className="btn btn-outline btn-sm flex items-center gap-2">
                        <span>✕</span>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-3 gap-6 mt-8">
        <div className="card text-center">
          <div className="text-2xl mb-2">📊</div>
          <h4 className="h4 text-neutral-900">Allocation Analytics</h4>
          <p className="text-sm text-tertiary mt-2">Coming Soon</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-2">🔍</div>
          <h4 className="h4 text-neutral-900">Audit Trail</h4>
          <p className="text-sm text-tertiary mt-2">Coming Soon</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-2">📋</div>
          <h4 className="h4 text-neutral-900">Reports</h4>
          <p className="text-sm text-tertiary mt-2">Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAllocations;