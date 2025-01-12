import React, { useState, useRef, useEffect } from 'react';
import { SparkCard } from './SparkCard';
import type { Spark } from '../../types';

type SparkViewerProps = {
  sparks: Spark[];
};

export function SparkViewer({ sparks }: SparkViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      setCurrentIndex(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: 'none' }}
    >
      {sparks.map((spark, index) => (
        <div
          key={spark.id}
          className="h-full snap-start snap-always"
        >
          <div className="h-full max-w-[calc((100vh-8rem)*0.5625)] mx-auto relative">
            <SparkCard
              spark={spark}
              isActive={index === currentIndex}
            />
          </div>
        </div>
      ))}
    </div>
  );
}