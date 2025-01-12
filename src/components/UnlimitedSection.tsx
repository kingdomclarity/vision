import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Check } from 'lucide-react';

export function UnlimitedSection() {
  return (
    <div className="bg-gradient-to-br from-gold-500 to-gold-600 text-white py-16 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8" />
          <h2 className="text-3xl font-medium">Join VISION UNLIMITED</h2>
        </div>
        
        <p className="text-xl mb-8">Get unlimited access to premium content for $14.99/month</p>
        
        <div className="grid grid-cols-3 gap-8 mb-10">
          {[
            'Ad-free viewing experience',
            'Exclusive premium content',
            'Early access to new releases',
            'Download videos for offline viewing',
            '4K Ultra HD streaming',
            'Cancel anytime'
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span className="text-left">{feature}</span>
            </div>
          ))}
        </div>

        <Link
          to="/unlimited"
          className="inline-flex items-center gap-2 bg-white text-gold-600 px-8 py-3 rounded-full font-medium hover:bg-gold-50 transition-colors"
        >
          <Crown className="h-5 w-5" />
          <span>Start Your Free Trial</span>
        </Link>
      </div>
    </div>
  );
}