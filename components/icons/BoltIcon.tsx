import React from 'react';

type BoltIconProps = {
  className?: string;
};

export function BoltIcon({ className = "h-8 w-8 text-gold-500" }: BoltIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        d="M14 2L4 14h6l-2 8 10-12h-6l2-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}