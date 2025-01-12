import React, { useEffect, useRef } from 'react';

type MilestoneLevel = {
  threshold: number;
  color: string;
};

const milestoneLevels: MilestoneLevel[] = [
  { threshold: 0, color: '#0000FF' }, // dark blue
  { threshold: 100, color: '#00FF00' }, // green
  { threshold: 1000, color: '#87CEEB' }, // sky blue
  { threshold: 2500, color: '#FF69B4' }, // neon pink
  { threshold: 5000, color: '#FFA500' }, // orange
  { threshold: 10000, color: '#FF0000' }, // red
  { threshold: 20000, color: '#FFFF00' }, // yellow
  { threshold: 30000, color: '#40E0D0' }, // turquoise
  { threshold: 40000, color: '#006400' }, // dark green
  { threshold: 50000, color: '#DAA520' }, // dark yellow
  { threshold: 75000, color: '#FF8C00' }, // dark orange
  { threshold: 100000, color: '#B6AC7D' }, // specified hex
];

type MilestoneCircleProps = {
  value: number;
  label: string;
};

export function MilestoneCircle({ value, label }: MilestoneCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Format large numbers
  const formatValue = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Get the current milestone level
  const getCurrentLevel = (value: number) => {
    for (let i = milestoneLevels.length - 1; i >= 0; i--) {
      if (value >= milestoneLevels[i].threshold) {
        return milestoneLevels[i];
      }
    }
    return milestoneLevels[0];
  };

  // Get the next milestone threshold
  const getNextThreshold = (value: number) => {
    for (const level of milestoneLevels) {
      if (value < level.threshold) {
        return level.threshold;
      }
    }
    return value * 10; // If beyond all levels, use 10x current value
  };

  // Calculate progress percentage
  const getProgress = (value: number) => {
    const currentLevel = getCurrentLevel(value);
    const nextThreshold = getNextThreshold(value);
    const levelStart = currentLevel.threshold;
    return ((value - levelStart) / (nextThreshold - levelStart)) * 100;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentLevel = getCurrentLevel(value);
    const progress = getProgress(value);
    
    // Set up animation
    let rotation = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background circle with 50% opacity
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(182, 172, 125, 0.5)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Draw progress arc with glow
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        70,
        rotation,
        rotation + (Math.PI * 2 * progress) / 100
      );
      ctx.strokeStyle = currentLevel.color;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = currentLevel.color;
      ctx.shadowBlur = 15;
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;

      // Update rotation
      rotation += Math.PI / 300;
      if (rotation >= Math.PI * 2) {
        rotation = 0;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={180}
          height={180}
          className="w-[180px] h-[180px]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gold-500">
            {formatValue(value)}
          </div>
          <div className="text-base text-gray-600 mt-2">{label}</div>
        </div>
      </div>
    </div>
  );
}