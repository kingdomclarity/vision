import React, { useState } from 'react';
import { Crown, Check, Star, Zap, Download, Tv2, Shield, Gift } from 'lucide-react';

export function UnlimitedPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  
  const features = [
    {
      icon: Star,
      title: 'Premium Content',
      description: 'Access exclusive shows, movies, and documentaries',
    },
    {
      icon: Zap,
      title: 'Early Access',
      description: 'Watch new releases before anyone else',
    },
    {
      icon: Download,
      title: 'Offline Viewing',
      description: 'Download and watch anywhere, anytime',
    },
    {
      icon: Tv2,
      title: '4K Ultra HD',
      description: 'Experience content in stunning 4K quality',
    },
    {
      icon: Shield,
      title: 'Ad-Free',
      description: 'Enjoy uninterrupted viewing with no ads',
    },
    {
      icon: Gift,
      title: 'Exclusive Benefits',
      description: 'Get special perks and member-only content',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=2000&h=1000&fit=crop"
          alt="Premium content"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
          <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-8">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-12 w-12 text-gold-400" />
              <h1 className="text-5xl font-medium text-white">VISION UNLIMITED</h1>
            </div>
            <p className="text-2xl text-gray-200 mb-8 max-w-2xl">
              Unlock a world of premium entertainment with exclusive content, early access, and ad-free viewing.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-4xl mx-auto px-8 -mt-20 mb-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center border-b border-gray-100">
            <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded-full mb-8">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  !isAnnual ? 'bg-white text-gold-600 shadow' : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  isAnnual ? 'bg-white text-gold-600 shadow' : 'text-gray-600'
                }`}
              >
                Yearly
              </button>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-medium mb-2">
                {isAnnual ? '$99.99' : '$14.99'}
                <span className="text-lg text-gray-500 font-normal">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              {isAnnual && (
                <div className="text-green-600 font-medium">
                  Save $79.89 per year
                </div>
              )}
            </div>

            <button className="w-full bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full font-medium transition-colors mb-6">
              Start Your Free Trial
            </button>

            <p className="text-gray-500 text-sm">
              Cancel anytime. Free trial for 7 days.
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <feature.icon className="h-6 w-6 text-gold-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="max-w-6xl mx-auto px-8 mb-20">
        <h2 className="text-3xl font-medium text-center mb-12">
          Premium Content Awaits
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop',
          ].map((image, index) => (
            <div
              key={index}
              className="aspect-video rounded-2xl overflow-hidden relative group cursor-pointer"
            >
              <img
                src={image}
                alt="Premium content preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Crown className="h-12 w-12 text-gold-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}