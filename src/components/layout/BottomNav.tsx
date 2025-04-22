
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, ShoppingBag, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Chat', path: '/chat', icon: MessageCircle },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-md px-2 py-1">
      <ul className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <li key={item.path} className="w-full">
              <Link 
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-creator-dark" 
                    : "text-gray-500 hover:text-creator"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} 
                />
                <span className={cn(
                  "text-xs mt-1 font-medium transition-all duration-200",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
                <div className={cn(
                  "h-1 w-4 rounded-full transition-all duration-200 mt-1",
                  isActive ? "bg-creator scale-100" : "bg-transparent scale-0"
                )} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
