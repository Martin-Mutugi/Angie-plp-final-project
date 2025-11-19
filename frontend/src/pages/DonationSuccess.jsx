import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DonationSuccess = ({ user }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Simulate confetti effect
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container section">
      <div className="max-w-2xl mx-auto">
        {/* Success Celebration Card */}
        <div className="card card-lg text-center relative overflow-hidden">
          {/* Celebration Background Elements */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                >
                  {['🎉', '✨', '🌟', '💫', '🥳'][i % 5]}
                </div>
              ))}
            </div>
          )}
          
          {/* Success Icon */}
          <div className="relative z-10">
            <div className="w-32 h-32 bg-gradient rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 animate-scale-in">
              ✅
            </div>
            
            {/* Success Message */}
            <h1 className="display-2 mb-4 text-primary-700">Donation Successful!</h1>
            <p className="text-lg text-secondary mb-2">
              Thank you for your incredible generosity
            </p>
            <p className="text-tertiary mb-8 max-w-md mx-auto">
              Your support is creating real change and making a lasting impact on communities in need.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-3 gap-4 mb-8">
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-semibold text-primary-700">Global Impact</h3>
              <p className="text-sm text-tertiary">SDG Goals Supported</p>
            </div>
            
            <div className="text-center p-4 bg-secondary-50 rounded-xl">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-secondary-700">Lives Touched</h3>
              <p className="text-sm text-tertiary">Direct Beneficiaries</p>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl mb-2">💝</div>
              <h3 className="font-semibold text-emerald-700">Your Legacy</h3>
              <p className="text-sm text-tertiary">Sustainable Change</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-8">
            <h3 className="h3 text-primary-700 mb-3 flex items-center justify-center gap-2">
              <span>📬</span>
              What's Next?
            </h3>
            <ul className="text-left space-y-3 text-tertiary">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm">1</span>
                <span>You'll receive a confirmation email with your receipt</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm">2</span>
                <span>Track your donation's impact in your dashboard</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm">3</span>
                <span>Receive updates on how your donation is being used</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-2 gap-4">
            <Link 
              to="/dashboard" 
              className="btn btn-primary btn-lg flex items-center justify-center gap-2"
            >
              <span>📊</span>
              View My Dashboard
            </Link>
            
            <Link 
              to="/donate" 
              className="btn btn-outline btn-lg flex items-center justify-center gap-2"
            >
              <span>💝</span>
              Make Another Donation
            </Link>
          </div>

          {/* Share Encouragement */}
          <div className="mt-8 p-4 bg-neutral-100 rounded-xl border border-neutral-200">
            <p className="text-sm text-tertiary flex items-center justify-center gap-2">
              <span>🌟</span>
              Consider sharing your impact story with friends and family
            </p>
          </div>
        </div>

        {/* Impact Celebration Section */}
        <div className="card mt-8">
          <div className="text-center">
            <h2 className="h2 mb-4">You're Part of Something Bigger</h2>
            <p className="text-tertiary mb-6 max-w-2xl mx-auto">
              Together with thousands of other donors, you're helping advance the UN Sustainable Development Goals 
              and create a better world for future generations.
            </p>
            
            <div className="grid grid-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold text-neutral-900">17 Goals</h4>
                <p className="text-xs text-tertiary">UN SDGs Supported</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🌎</div>
                <h4 className="font-semibold text-neutral-900">50+</h4>
                <p className="text-xs text-tertiary">Countries Reached</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-semibold text-neutral-900">1M+</h4>
                <p className="text-xs text-tertiary">Lives Impacted</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💝</div>
                <h4 className="font-semibold text-neutral-900">You</h4>
                <p className="text-xs text-tertiary">Making a Difference</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;