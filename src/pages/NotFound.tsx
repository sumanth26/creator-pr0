
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import CreatorButton from "@/components/ui/buttons/CreatorButton";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout hideNav={true}>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 animate-fade-in">
        <div className="bg-creator/15 p-6 rounded-full mb-6">
          <div className="text-creator text-6xl font-light">404</div>
        </div>
        
        <h1 className="text-2xl font-bold text-creator-text mb-2">
          Page Not Found
        </h1>
        
        <p className="text-creator-text/70 mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <CreatorButton 
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </CreatorButton>
          
          <CreatorButton 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </CreatorButton>
        </div>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
