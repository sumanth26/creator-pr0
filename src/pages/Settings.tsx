
import React from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Bell, Globe, Lock, LogOut, Moon, Palette, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <MobileLayout>
      <div className="py-6 space-y-5 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-4">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-creator-text">
            Settings
          </h1>
        </div>

        <div className="space-y-5">
          <SectionHeading title="Account" />
          
          <Card className="card-glass border-none">
            <CardContent className="p-0">
              <Link to="/profile" className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-creator mr-3" />
                  <span>Edit Profile</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </Link>
              
              <Link to="/payment-info" className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-creator mr-3" />
                  <span>Privacy & Security</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </Link>
            </CardContent>
          </Card>
          
          <SectionHeading title="Preferences" />
          
          <Card className="card-glass border-none">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-creator mr-3" />
                  <span>Notifications</span>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-creator mr-3" />
                  <span>Dark Mode</span>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-creator mr-3" />
                  <span>Language</span>
                </div>
                <div className="text-sm text-gray-500">English</div>
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Palette className="h-5 w-5 text-creator mr-3" />
                  <span>Appearance</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <SectionHeading title="Creator" />
          
          <Card className="card-glass border-none">
            <CardContent className="p-0">
              <Link to="/become-creator" className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-creator">Become a Creator</span>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </Link>
            </CardContent>
          </Card>
          
          <Button 
            variant="destructive" 
            className="w-full mt-6"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Settings;
