import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Donate from './pages/Donate';
import Dashboard from './pages/Dashboard';
import AdminRecipients from './pages/AdminRecipients';
import AdminAllocations from './pages/AdminAllocations';
import DonationSuccess from './pages/DonationSuccess';
import AdminReports from './pages/AdminReports';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container min-h-screen bg-neutral-50">
        {/* Premium Navigation - Using Navbar Component */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/donate" element={<Donate user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/admin/recipients" element={<AdminRecipients user={user} />} />
            <Route path="/admin/allocations" element={<AdminAllocations user={user} />} />
            <Route path="/donation/success" element={<DonationSuccess user={user} />} />
            <Route path="/admin/reports" element={<AdminReports user={user} />} />
          </Routes>
        </main>

        {/* Premium Footer */}
        <footer className="bg-neutral-900 text-white py-12">
          <div className="container">
            <div className="grid grid-3 gap-8">
              {/* Mission */}
              <div className="text-center md:text-left">
                <h4 className="text-white mb-4 flex items-center justify-center md:justify-start gap-2">
                  <span>🎯</span>
                  Our Mission
                </h4>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Advancing UN Sustainable Development Goals through transparent, impactful donations. 
                  Building a better future through collective action and financial transparency.
                </p>
              </div>
              
              {/* Impact Areas */}
              <div className="text-center md:text-left">
                <h4 className="text-white mb-4 flex items-center justify-center md:justify-start gap-2">
                  <span>🌱</span>
                  Impact Areas
                </h4>
                <ul className="text-neutral-300 text-sm space-y-2">
                  {['Quality Education', 'Clean Water Access', 'Climate Action', 'Poverty Alleviation'].map((area, index) => (
                    <li key={index} className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-secondary-500">✓</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Contact */}
              <div className="text-center md:text-left">
                <h4 className="text-white mb-4 flex items-center justify-center md:justify-start gap-2">
                  <span>📞</span>
                  Get In Touch
                </h4>
                <div className="text-neutral-300 text-sm space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span>📧</span>
                    support@sdg-donations.org
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span>🌐</span>
                    www.sdg-donations.org
                  </div>
                </div>
                
                <div className="flex justify-center md:justify-start gap-3 mt-4">
                  {['📘', '🐦', '📸', '💼'].map((icon, index) => (
                    <button
                      key={index}
                      className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-300 hover:text-white transition-all hover:scale-110 hover:bg-neutral-700"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="mt-8 pt-8 border-t border-neutral-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-neutral-400 text-sm">
                    &copy; 2024 SDG Donations Platform. Creating impact through transparency.
                  </p>
                </div>
                
                <div className="flex gap-6 text-neutral-400 text-sm">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                    <button
                      key={index}
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;