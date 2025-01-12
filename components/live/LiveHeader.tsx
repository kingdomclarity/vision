import React from 'react';
import { Radio } from 'lucide-react';

export function LiveHeader() {
  return (
    <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center gap-3">
          <Radio className="h-6 w-6" />
          <h1 className="text-3xl font-medium">LIVE</h1>
        </div>
      </div>
    </div>
  );
}