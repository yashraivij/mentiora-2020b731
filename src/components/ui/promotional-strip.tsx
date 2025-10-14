import React from 'react';
import { Button } from './button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';

export const PromotionalStrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPremium } = useSubscription();

  // Always show on landing page, hide on other pages for premium users
  if (isPremium && location.pathname !== '/') {
    return null;
  }

  const handleUpgradeClick = () => {
    if (location.pathname === '/') {
      navigate('/login');
    } else {
      navigate('/pricing');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm">✨</span>
            <span className="font-medium text-xs md:text-sm">
              Try Premium Free for a Limited Time!
            </span>
            <span 
              className="hidden md:inline-block bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer hover:bg-white/30 transition-colors"
              onClick={handleUpgradeClick}
            >
              Limited Time
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpgradeClick}
              variant="secondary"
              size="sm"
              className="bg-white text-green-600 hover:bg-white/90 font-medium text-xs px-3 py-1 h-auto"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};