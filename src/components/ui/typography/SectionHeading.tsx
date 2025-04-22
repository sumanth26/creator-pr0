
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

const SectionHeading = ({ title, subtitle, className, action }: SectionHeadingProps) => {
  return (
    <div className={cn("flex flex-col space-y-1 mb-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-creator-text font-semibold text-xl animate-fade-in">{title}</h2>
        {action && (
          <div className="animate-fade-in">
            {action}
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-creator-text/70 text-sm font-normal animate-fade-in animation-delay-100">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
