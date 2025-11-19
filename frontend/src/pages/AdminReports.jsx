import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReports = ({ user }) => {
  const [reportsData, setReportsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    // Simulate loading reports data
    setIsLoading(true);
    setTimeout(() => {
      setReportsData({
        overview: {
          totalDonations: 1250000,
          activeRecipients: 24,
          poolBalance: 750000,
          totalAllocations: 500000,
          avgDonation: 12500,
          successRate: 98.5
        },
        donations: {
          daily: [12500, 18750, 15600, 21000, 18900, 22000, 19500],
          monthly: [450000, 520000, 480000, 550000, 600000, 580000],
          categories: {
            FOOD: 35,
            EDUCATION: 25,
            HEALTHCARE: 20,
            HOUSING: 12,
            CLOTHING: 5,
            OTHER: 3
          }
        },
        recipients: {
          byStatus: {
            VERIFIED: 18,
            PENDING: 4,
            REJECTED: 2
          },
          topRecipients: [
            { name: 'Maria Kamau', received: 125000, needs: 3 },
            { name: 'Children\'s Home', received: 98000, needs: 5 },
            { name: 'Community School', received: 75000, needs: 2 },
            { name: 'Health Center', received: 62000, needs: 4 },
            { name: 'Elderly Care', received: 45000, needs: 3 }
          ]
        },
        allocations: {
          completed: 45,
          pending: 8,
          failed: 2,
          efficiency: 92.7
        }
      });
      setIsLoading(false);
    }, 2000);
  }, [timeRange]);

  const getCategoryColor = (category) => {
    const colors = {
      FOOD: 'bg-secondary-500',
      EDUCATION: 'bg-primary-500',
      HEALTHCARE: 'bg-pink-500',
      HOUSING: 'bg-amber-500',
      CLOTHING: 'bg-indigo-500',
      OTHER: 'bg-neutral-500'
    };
    return colors[category] || 'bg-neutral-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'text-success-600 bg-success-50';
      case 'PENDING': return 'text-warning-600 bg-warning-50';
      case 'REJECTED': return 'text-error-600 bg-error-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
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

  if (isLoading) {
    return (
      <div className="container section">
        <div className="flex items-center justify-center py-12">
          <div className="loading"></div>
          <span className="ml-3 text-tertiary">Loading analytics dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="display-2 mb-2">Analytics Dashboard</h1>
          <p className="text-lg text-secondary">
            Comprehensive insights and platform performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-tertiary">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            Live Data
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-4 gap-6 mb-8">
        <div className="card card-hover text-center">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="h3 text-primary-600">{reportsData.overview.totalDonations.toLocaleString()} KES</h3>
          <p className="text-sm text-tertiary">Total Donations</p>
          <div className="mt-2 text-xs text-success-600 font-medium">
            ↑ 12.5% from last period
          </div>
        </div>
        
        <div className="card card-hover text-center">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="h3 text-secondary-600">{reportsData.overview.activeRecipients}</h3>
          <p className="text-sm text-tertiary">Active Recipients</p>
          <div className="mt-2 text-xs text-success-600 font-medium">
            ↑ 3 new this month
          </div>
        </div>
        
        <div className="card card-hover text-center">
          <div className="text-3xl mb-3">🏦</div>
          <h3 className="h3 text-emerald-600">{reportsData.overview.poolBalance.toLocaleString()} KES</h3>
          <p className="text-sm text-tertiary">Pool Balance</p>
          <div className="mt-2 text-xs text-tertiary">
            Available for allocation
          </div>
        </div>
        
        <div className="card card-hover text-center">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="h3 text-amber-600">{reportsData.overview.successRate}%</h3>
          <p className="text-sm text-tertiary">Success Rate</p>
          <div className="mt-2 text-xs text-success-600 font-medium">
            ↑ 2.3% improvement
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-2 gap-8 mb-8">
        {/* Donations by Category */}
        <div className="card">
          <h2 className="h2 mb-6 flex items-center gap-2">
            <span>📊</span>
            Donations by Category
          </h2>
          <div className="space-y-4">
            {Object.entries(reportsData.donations.categories).map(([category, percentage]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                  <span className="font-medium text-sm text-neutral-700">{category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getCategoryColor(category)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recipient Status Distribution */}
        <div className="card">
          <h2 className="h2 mb-6 flex items-center gap-2">
            <span>👥</span>
            Recipient Status
          </h2>
          <div className="space-y-4">
            {Object.entries(reportsData.recipients.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900">{count}</p>
                  <p className="text-xs text-tertiary">recipients</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Recipients */}
      <div className="card mb-8">
        <h2 className="h2 mb-6 flex items-center gap-2">
          <span>🏆</span>
          Top Recipients
        </h2>
        <div className="space-y-4">
          {reportsData.recipients.topRecipients.map((recipient, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{recipient.name}</h4>
                  <p className="text-sm text-tertiary">{recipient.needs} active needs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">{recipient.received.toLocaleString()} KES</p>
                <p className="text-xs text-tertiary">total received</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics Grid */}
      <div className="grid grid-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl mb-3">📤</div>
          <h3 className="h3 text-neutral-900">{reportsData.allocations.completed}</h3>
          <p className="text-sm text-tertiary">Completed Allocations</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-3">⏳</div>
          <h3 className="h3 text-neutral-900">{reportsData.allocations.pending}</h3>
          <p className="text-sm text-tertiary">Pending Allocations</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="h3 text-neutral-900">{reportsData.allocations.efficiency}%</h3>
          <p className="text-sm text-tertiary">Allocation Efficiency</p>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="card mt-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="h3">Export Reports</h3>
            <p className="text-tertiary">Download comprehensive reports for analysis</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline flex items-center gap-2">
              <span>📥</span>
              Export CSV
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <span>📊</span>
              Generate PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="grid grid-3 gap-6 mt-8">
        <div className="card text-center">
          <div className="text-2xl mb-2">📈</div>
          <h4 className="h4 text-neutral-900">Advanced Charts</h4>
          <p className="text-sm text-tertiary mt-2">Interactive data visualization</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-2">🔔</div>
          <h4 className="h4 text-neutral-900">Real-time Alerts</h4>
          <p className="text-sm text-tertiary mt-2">Smart notifications</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-2">🎯</div>
          <h4 className="h4 text-neutral-900">Predictive Analytics</h4>
          <p className="text-sm text-tertiary mt-2">AI-powered insights</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;