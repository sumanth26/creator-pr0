
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface CreatorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
  asChild?: boolean; // Added this property
}

const CreatorButton = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className,
  fullWidth = false,
  asChild = false, // Add default value
  ...props 
}: CreatorButtonProps) => {
  const Comp = asChild ? Slot : "button";
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        // Base styles
        "font-medium rounded-full transition-all duration-300 shadow-sm",
        
        // Default variant styles
        variant === 'default' && "bg-creator hover:bg-creator-dark text-white",
        
        // Outline variant
        variant === 'outline' && "border-creator text-creator hover:bg-creator hover:text-white",
        
        // Ghost variant
        variant === 'ghost' && "text-creator hover:bg-creator/10",
        
        // Link variant
        variant === 'link' && "text-creator hover:text-creator-dark underline-offset-4",
        
        // Size specific styles
        size === 'sm' && "text-xs py-1",
        size === 'default' && "text-sm",
        size === 'lg' && "text-base py-2.5",
        
        // Full width
        fullWidth && "w-full",
        
        className
      )}
      asChild={asChild}
      {...props}
    >
      {asChild ? children : <Comp>{children}</Comp>}
    </Button>
  );
};

export default CreatorButton;
