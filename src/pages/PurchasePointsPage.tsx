import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Shield, ArrowLeft } from 'lucide-react';
import { useGiftStore, POINT_PACKAGES } from '../store/useGiftStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

export function PurchasePointsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { addPoints, getUserPoints } = useGiftStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const pointsNeeded = Number(new URLSearchParams(location.search).get('needed')) || 0;
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
  const currentPoints = user ? getUserPoints(user.id) : 0;

  const handlePurchase = async (packageId: string) => {
    if (!user) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const pointPackage = POINT_PACKAGES.find(p => p.id === packageId);
    if (pointPackage) {
      addPoints(user.id, pointPackage.points);
    }
    
    setIsProcessing(false);
    navigate(returnTo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-medium mb-2">Purchase Points</h1>
          <p className="text-gray-600 mb-8">
            Get points to send gifts and support your favorite creators
          </p>

          {pointsNeeded > 0 && (
            <div className="mb-8 p-4 bg-gold-50 rounded-lg border border-gold-200">
              <div className="text-gold-800 font-medium mb-1">Points Needed</div>
              <div className="text-gold-600">
                You need {pointsNeeded.toLocaleString()} more points for this gift
              </div>
              <div className="text-sm text-gold-600 mt-2">
                Current balance: {currentPoints.toLocaleString()} points
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            {POINT_PACKAGES.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => handlePurchase(pkg.id)}
                disabled={isProcessing}
                className={cn(
                  "p-6 border rounded-xl transition-colors text-center",
                  pkg.points >= pointsNeeded
                    ? "border-gold-500 bg-gold-50"
                    : "border-gray-200 hover:border-gold-300",
                  isProcessing && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="text-3xl font-medium text-gold-500 mb-1">
                  {pkg.points.toLocaleString()}
                </div>
                <div className="text-gray-600 mb-3">points</div>
                <div className="text-2xl font-medium">
                  ${pkg.price.toFixed(2)}
                </div>
                {pkg.points >= pointsNeeded && pointsNeeded > 0 && (
                  <div className="text-xs text-gold-600 mt-2">
                    Recommended
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="h-5 w-5" />
            <span>Secure payment processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}