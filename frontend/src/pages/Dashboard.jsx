import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with loading state
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        // In production, this would fetch from /api/donations with user auth
        setTimeout(() => {
          setDonations([
            { 
              _id: '1', 
              amount: 5000, 
              type: 'POOL', 
              status: 'SUCCEEDED', 
              createdAt: new Date().toISOString(),
              recipientName: 'General SDG Fund'
            },
            { 
              _id: '2', 
              amount: 3000, 
              type: 'DIRECT', 
              status: 'SUCCEEDED', 
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              recipientName: 'Community Education Program'
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const downloadReceipt = () => {
    const receipt = `
SDG DONATIONS PLATFORM - RECEIPT
================================
Date: ${new Date().toLocaleDateString()}
Donor: ${user?.email || 'User'}
Total Amount: 8,000 KES
Donations: 2
Status: Completed

DONATION HISTORY:
${donations.map(donation => `
- ${donation.type} Donation: ${donation.amount.toLocaleString()} KES
  Recipient: ${donation.recipientName}
  Date: ${new Date(donation.createdAt).toLocaleDateString()}
  Status: ${donation.status}
`).join('')}

Thank you for your generous support!
Your donations are making a real impact.

Contact: support@sdgdonations.org
Website: www.sdgdonations.org
    `;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Receipt downloaded successfully!');
  };

  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const impactScore = Math.floor(totalAmount / 100); // Simple impact metric

  if (isLoading) {
    return (
      <div className="container section">
        <div className="flex items-center justify-center py-12">
          <div className="loading"></div>
          <span className="ml-3 text-tertiary">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Dashboard Header */}
      <div className="text-center mb-8">
        <h1 className="display-2 mb-2">Your Impact Dashboard</h1>
        <p className="text-lg text-secondary">
          Track your donations and see the difference you're making
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-4 gap-6 mb-8">
        <div className="card card-hover text-center">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="h3 text-primary-600">{totalAmount.toLocaleString()} KES</h3>
          <p className="text-sm text-tertiary">Total Donated</p>
        </div>
        
        <div className="card card-hover text-center">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="h3 text-secondary-600">{donations.length}</h3>
          <p className="text-sm text-tertiary">Total Donations</p>
        </div>
        
        <div className="card card-hover text-center">
          <div className="text-3xl mb-2">🌱</div>
          <h3 className="h3 text-emerald-600">{impactScore}</h3>
          <p className="text-sm text-tertiary">Impact Score</p>
        </div>
        
        <div className="card card-hover text-center">
          <div className="text-3xl mb-2">⭐</div>
          <h3 className="h3 text-amber-600">
            {donations.length >= 5 ? 'Gold' : donations.length >= 2 ? 'Silver' : 'Bronze'}
          </h3>
          <p className="text-sm text-tertiary">Supporter Level</p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-2 gap-6 mb-8">
        {/* Quick Donation Card */}
        <div className="card bg-gradient text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-2xl">
              💝
            </div>
            <div>
              <h2 className="h2 text-white">Continue Your Impact</h2>
              <p className="text-white text-opacity-90">Make another donation today</p>
            </div>
          </div>
          <Link 
            to="/donate" 
            className="btn btn-outline w-full bg-white bg-opacity-20 text-white border-white hover:bg-white hover:text-primary-600"
          >
            Make New Donation
          </Link>
        </div>

        {/* Receipts Card */}
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-2xl text-primary-600">
              📄
            </div>
            <div>
              <h2 className="h2">Your Documents</h2>
              <p className="text-tertiary">Download receipts and reports</p>
            </div>
          </div>
          <button 
            className="btn btn-primary w-full"
            onClick={downloadReceipt}
          >
            Download All Receipts
          </button>
        </div>
      </div>

      {/* Donation History */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="h2">Donation History</h2>
            <p className="text-tertiary">Your complete donation journey</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-tertiary">
            <span className="w-2 h-2 bg-success-500 rounded-full"></span>
            All donations successful
          </div>
        </div>

        <div className="space-y-4">
          {donations.map((donation, index) => (
            <div key={donation._id} className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                  donation.type === 'POOL' ? 'bg-primary-500' : 'bg-secondary-500'
                }`}>
                  {donation.type === 'POOL' ? '🌍' : '🎯'}
                </div>
                <div>
                  <h4 className="h4 text-neutral-900">
                    {donation.type === 'POOL' ? 'General SDG Fund' : donation.recipientName}
                  </h4>
                  <p className="text-sm text-tertiary">
                    {new Date(donation.createdAt).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="h3 text-primary-600">{donation.amount.toLocaleString()} KES</p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                  <span className="text-sm text-success-600 font-medium">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {donations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="h3 text-neutral-700 mb-2">No donations yet</h3>
            <p className="text-tertiary mb-6">Make your first donation to start your impact journey</p>
            <Link to="/donate" className="btn btn-primary">
              Make First Donation
            </Link>
          </div>
        )}
      </div>

      {/* Impact Visualization */}
      <div className="card mt-8">
        <h2 className="h2 mb-6">Your Impact Visualization</h2>
        <div className="grid grid-3 gap-6">
          <div className="text-center p-6 bg-primary-50 rounded-2xl">
            <div className="text-4xl mb-3">🏫</div>
            <h4 className="h4 text-primary-700">Education</h4>
            <p className="text-tertiary">Supporting schools</p>
            <div className="mt-3 bg-primary-200 rounded-full h-2">
              <div className="bg-primary-500 rounded-full h-2" style={{width: '60%'}}></div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-secondary-50 rounded-2xl">
            <div className="text-4xl mb-3">💧</div>
            <h4 className="h4 text-secondary-700">Clean Water</h4>
            <p className="text-tertiary">Water access projects</p>
            <div className="mt-3 bg-secondary-200 rounded-full h-2">
              <div className="bg-secondary-500 rounded-full h-2" style={{width: '30%'}}></div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-emerald-50 rounded-2xl">
            <div className="text-4xl mb-3">🌳</div>
            <h4 className="h4 text-emerald-700">Environment</h4>
            <p className="text-tertiary">Climate initiatives</p>
            <div className="mt-3 bg-emerald-200 rounded-full h-2">
              <div className="bg-emerald-500 rounded-full h-2" style={{width: '10%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;