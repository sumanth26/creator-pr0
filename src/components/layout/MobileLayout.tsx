
import React from 'react';
import BottomNav from './BottomNav';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  userMode?: boolean;
}

const MobileLayout = ({ children, className, hideNav = false, userMode = false }: MobileLayoutProps) => {
  const location = useLocation()
   // Hide bottom navs on login and signup pages
   const isAuthPage = ["/creator-login", "/creator-signup"].includes(location.pathname);
  return (
    <div className="min-h-screen flex flex-col bg-creator-light">
      <main className={cn(
        "flex-1 max-w-md mx-auto w-full pb-16 px-4 flex flex-col", 
        className
      )}>
        {children}
      </main>
      {!hideNav && !isAuthPage && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
