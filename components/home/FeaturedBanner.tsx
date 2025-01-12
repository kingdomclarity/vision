import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Banner = {
  id: string;
  imageUrl: string;
  link: string;
  title: string;
  subtitle?: string;
};

const banners: Banner[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2000&h=700&fit=crop',
    link: '/videos/live-concert-2024',
    title: 'Experience Live Music Like Never Before',
    subtitle: 'Watch exclusive live concerts from top artists',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=2000&h=700&fit=crop',
    link: '/videos/sports-championship',
    title: 'Championship Finals - Watch Live',
    subtitle: 'Catch all the action live this weekend',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=2000&h=700&fit=crop',
    link: '/videos/comedy-special',
    title: 'Comedy Night Special',
    subtitle: 'An evening of non-stop laughter with top comedians',
  }
];

export function FeaturedBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[200px] md:h-[400px] group bg-white px-4 lg:px-8 pt-4">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Preview Banners */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center">
          {[-2, -1, 1, 2].map((offset) => {
            const isLeft = offset < 0;
            const isFirstPreview = Math.abs(offset) === 1;
            const index = (currentBanner + offset + banners.length) % banners.length;
            
            return (
              <div
                key={offset}
                className="absolute h-full transition-all duration-800"
                style={{
                  width: '10%',
                  left: isLeft ? `${isFirstPreview ? '4%' : '0%'}` : 'auto',
                  right: !isLeft ? `${isFirstPreview ? '4%' : '0%'}` : 'auto',
                  transform: `scale(${isFirstPreview ? 0.85 : 0.7}) rotateY(${isLeft ? '25deg' : '-25deg'})`,
                  transformOrigin: isLeft ? 'right center' : 'left center',
                  zIndex: isFirstPreview ? 10 : 5,
                  opacity: isFirstPreview ? 0.8 : 0.6,
                }}
              >
                <img
                  src={banners[index].imageUrl}
                  alt=""
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            );
          })}
        </div>

        {/* Main Banner */}
        <div className="w-full md:w-[80%] h-full rounded-xl md:rounded-[2rem] overflow-hidden shadow-xl relative z-20">
          {banners.map((banner, index) => (
            <Link
              key={banner.id}
              to={banner.link}
              className="absolute inset-0 transition-all duration-800 transform-gpu"
              style={{
                opacity: index === currentBanner ? 1 : 0,
                transform: `rotateY(${
                  index === currentBanner ? '0deg' : 
                  index === ((currentBanner - direction + banners.length) % banners.length) ? '50deg' :
                  '-50deg'
                })`,
                transformOrigin: direction > 0 ? 'left center' : 'right center',
              }}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                  <h2 className="text-2xl md:text-4xl font-light tracking-wide text-white mb-2">{banner.title}</h2>
                  {banner.subtitle && (
                    <p className="text-sm md:text-lg text-gray-200">{banner.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentBanner ? 1 : -1);
                setCurrentBanner(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentBanner ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}