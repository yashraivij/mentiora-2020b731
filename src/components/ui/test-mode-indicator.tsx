import React from 'react';
import { Badge } from '@/components/ui/badge';
import { isTestMode } from '@/lib/stripe-config';

export const TestModeIndicator = () => {
  if (!isTestMode()) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 text-sm font-medium shadow-lg">
        🧪 Stripe Test Mode
      </Badge>
    </div>
  );
};