import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

export const PromotionalStrip = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">🔥</span>
            <span className="font-medium text-sm md:text-base">
              Premium is 50% off for a limited time — Upgrade Now!
            </span>
            <span className="hidden md:inline-block bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
              Ends Soon
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/pricing')}
              variant="secondary"
              size="sm"
              className="bg-white text-green-600 hover:bg-white/90 font-medium"
            >
              Upgrade Now
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss promotional banner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};