
import React from 'react';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface ContentCardProps {
  title: string;
  subtitle?: string; // Added this property
  price?: string | number;
  image?: string;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}

const ContentCard = ({ 
  title, 
  subtitle,
  price, 
  image, 
  isLocked = false, 
  onClick, 
  className 
}: ContentCardProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl aspect-video max-w-full transition-all duration-300 transform hover:translate-y-[-5px] cursor-pointer",
        "border border-white/40 shadow-sm",
        "animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" />
      
      {image ? (
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-creator-accent to-creator-dark z-0" />
      )}
      
      <div className="absolute bottom-0 left-0 p-3 z-20 w-full">
        <h3 className="text-white font-medium text-sm md:text-base line-clamp-2">{title}</h3>
        
        {subtitle && (
          <p className="text-white/80 text-xs line-clamp-1">{subtitle}</p>
        )}
        
        {price && (
          <div className="flex items-center mt-1">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
              ${typeof price === 'number' ? price.toFixed(2) : price}
            </span>
          </div>
        )}
      </div>

      {isLocked && (
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-black/30 backdrop-blur-sm p-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
