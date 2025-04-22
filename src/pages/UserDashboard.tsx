import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Bell, ChevronRight, Heart, ShoppingBag, User, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const followedCreators = [
    { id: 1, name: 'Jenna Studios', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'Photographer' },
    { id: 2, name: 'Alex Art', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'Digital Artist' },
    { id: 3, name: 'Maya Music', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'Music Producer' },
  ];

  const recentOrders = [
    { id: 1, title: 'Premium Photoshoot Package', creator: 'Jenna Studios', price: 24.99, date: '2023-06-15', status: 'completed' },
    { id: 2, title: 'Exclusive Art Collection', creator: 'Alex Art', price: 12.99, date: '2023-06-10', status: 'completed' },
    { id: 3, title: 'Music Tutorial Session', creator: 'Maya Music', price: 8.99, date: '2023-06-05', status: 'pending' },
  ];

  const notifications = [
    { id: 1, message: 'Jenna Studios posted new content', time: '2 hours ago' },
    { id: 2, message: 'Your subscription to Alex Art renews tomorrow', time: '5 hours ago' },
    { id: 3, message: 'Maya Music is going live in 30 minutes', time: '1 day ago' },
  ];

  return (
    <MobileLayout userMode>
      <div className="py-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-creator-text">
              My Dashboard
            </h1>
            <p className="text-creator-text/70 text-sm">
              Manage your subscriptions and purchases
            </p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="https://randomuser.me/api/portraits/women/32.jpg" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="followed" className="w-full animate-slide-up">
          <TabsList className="grid grid-cols-3 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="followed" className="rounded-full">Followed</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full">Orders</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-full">Updates</TabsTrigger>
          </TabsList>
          
          {/* Followed Creators Tab */}
          <TabsContent value="followed" className="mt-4 space-y-4">
            <SectionHeading 
              title="Creators You Follow" 
              subtitle="Check out their latest content"
              action={(
                <Link to="/discover">
                  <CreatorButton variant="outline" size="sm" className="text-xs">
                    Discover more
                  </CreatorButton>
                </Link>
              )}
            />
            
            <div className="space-y-3">
              {followedCreators.map((creator) => (
                <Link to={`/creator/${creator.id}`} key={creator.id}>
                  <Card className="card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-creator-text">{creator.name}</h3>
                          <p className="text-xs text-creator-text/70">{creator.type}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-creator-text/40" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <CreatorButton 
              variant="outline" 
              fullWidth 
              className="mt-4"
            >
              <UserPlus className="h-4 w-4" />
              <span>Find more creators</span>
            </CreatorButton>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-4 space-y-4">
            <SectionHeading 
              title="Your Orders" 
              subtitle="Track your purchases and subscriptions"
            />
            
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link to={`/orders/${order.id}`} key={order.id}>
                  <Card className={cn(
                    "card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in",
                    order.status === 'pending' && "border-l-4 border-l-amber-400"
                  )}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-creator/10 p-2 rounded-full">
                          <ShoppingBag className="h-5 w-5 text-creator" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-creator-text">{order.title}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-creator-text/70">{order.creator}</p>
                            <span className="w-1 h-1 bg-creator-text/30 rounded-full"></span>
                            <p className="text-xs text-creator-text/70">${order.price}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-creator-text/40" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <CreatorButton 
              variant="outline" 
              fullWidth 
              className="mt-4"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>View all purchases</span>
            </CreatorButton>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-4 space-y-4">
            <SectionHeading 
              title="Notifications" 
              subtitle="Stay updated with your creators"
            />
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card key={notification.id} className="card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-creator/10 p-2 rounded-full">
                        <Bell className="h-5 w-5 text-creator" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-creator-text">{notification.message}</h3>
                        <p className="text-xs text-creator-text/70">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommended Creators */}
        <div className="space-y-3 animate-slide-up animation-delay-300">
          <SectionHeading 
            title="Discover Creators" 
            subtitle="Based on your interests"
            action={(
              <CreatorButton variant="link" size="sm" className="flex items-center gap-1">
                <span>See all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </CreatorButton>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 4, name: 'Emma Dance', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', type: 'Choreographer' },
              { id: 5, name: 'Tom Films', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', type: 'Filmmaker' },
            ].map((creator) => (
              <Link to={`/creator/${creator.id}`} key={creator.id}>
                <Card className="card-glass overflow-hidden hover:bg-white/95 transition-all border-none animate-fade-in">
                  <CardContent className="p-3 flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 border-2 border-white mb-2">
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-creator-text">{creator.name}</h3>
                    <p className="text-xs text-creator-text/70">{creator.type}</p>
                    <CreatorButton variant="outline" size="sm" className="mt-2 text-xs">
                      <Heart className="h-3 w-3" />
                      <span>Follow</span>
                    </CreatorButton>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default UserDashboard;
