import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';

const categoryBanners: Record<Category, {
  banners: Array<{
    id: string;
    imageUrl: string;
    link: string;
    title: string;
    subtitle?: string;
  }>;
}> = {
  Music: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2000&h=700&fit=crop',
        link: '/category/music/featured',
        title: 'Live Music Festival 2024',
        subtitle: 'Experience the magic of live performances'
      },
      {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=2000&h=700&fit=crop',
        link: '/category/music/top-artists',
        title: 'Top Artists of the Month',
        subtitle: 'Discover trending musicians and bands'
      }
    ]
  },
  Movies: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=2000&h=700&fit=crop',
        link: '/category/movies/premieres',
        title: 'New Movie Premieres',
        subtitle: 'Watch the latest blockbusters'
      },
      {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=2000&h=700&fit=crop',
        link: '/category/movies/classics',
        title: 'Classic Cinema Collection',
        subtitle: 'Timeless films that shaped history'
      }
    ]
  },
  Sports: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2000&h=700&fit=crop',
        link: '/category/sports/live',
        title: 'Live Sports Coverage',
        subtitle: 'Watch your favorite teams in action'
      }
    ]
  },
  Comedy: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=2000&h=700&fit=crop',
        link: '/category/comedy/standup',
        title: 'Comedy Night Special',
        subtitle: 'The best stand-up performances'
      }
    ]
  },
  News: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=2000&h=700&fit=crop',
        link: '/category/news/live',
        title: '24/7 News Coverage',
        subtitle: 'Stay informed with breaking news'
      }
    ]
  },
  Podcasts: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=2000&h=700&fit=crop',
        link: '/category/podcasts/trending',
        title: 'Top Podcasts',
        subtitle: 'Listen to trending shows'
      }
    ]
  },
  Lifestyle: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=2000&h=700&fit=crop',
        link: '/category/lifestyle/featured',
        title: 'Lifestyle & Wellness',
        subtitle: 'Tips for a better life'
      }
    ]
  },
  Inspiration: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=2000&h=700&fit=crop',
        link: '/category/inspiration/motivational',
        title: 'Daily Inspiration',
        subtitle: 'Stories that motivate and inspire'
      }
    ]
  },
  Arts: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=2000&h=700&fit=crop',
        link: '/category/arts/exhibitions',
        title: 'Art & Culture',
        subtitle: 'Explore creative expressions'
      }
    ]
  },
  Kids: {
    banners: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=2000&h=700&fit=crop',
        link: '/category/kids/educational',
        title: 'VISION Kids',
        subtitle: 'Fun and educational content'
      }
    ]
  }
};

type CategoryBannerProps = {
  category: Category;
};

export function CategoryBanner({ category }: CategoryBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Get banners for category, fallback to empty array if category not found
  const banners = categoryBanners[category]?.banners || [];

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setDirection(1);
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-[200px] md:h-[400px] group bg-white px-4 lg:px-8 pt-4">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Preview Banners */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center">
          {[-2, -1, 1, 2].map((offset) => {
            const isLeft = offset < 0;
            const isFirstPreview = Math.abs(offset) === 1;
            const index = (currentBanner + offset + banners.length) % banners.length;
            
            return banners[index] && (
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
        {banners.length > 1 && (
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
        )}
      </div>
    </div>
  );
}