
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Bell, ChevronRight, DollarSign, Heart, MessageCircle, Plus, ShoppingBag, TrendingUp, User, UserPlus, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import ContentCard from '@/components/ui/card/ContentCard';

const Dashboard = () => {
  // Mock data
  const followedCreators = [
    { id: 1, name: 'Jenna Studios', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'Photographer' },
    { id: 2, name: 'Alex Art', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'Digital Artist' },
    { id: 3, name: 'Maya Music', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'Music Producer' },
  ];

  const recentOrders = [
    { id: 1, title: 'Premium Photoshoot Package', creator: 'Jenna Studios', price: 24.99, date: '2023-06-15', status: 'completed' },
    { id: 2, title: 'Exclusive Art Collection', creator: 'Alex Art', price: 12.99, date: '2023-06-10', status: 'completed' },
  ];

  const myContent = [
    { id: 1, title: 'Lighting Setup Guide', price: 9.99, views: 145, revenue: 560 },
    { id: 2, title: 'Premium Portrait Presets', price: 14.99, views: 87, revenue: 330 },
  ];

  const notifications = [
    { id: 1, message: 'Jenna Studios posted new content', time: '2 hours ago' },
    { id: 2, message: 'Your subscription to Alex Art renews tomorrow', time: '5 hours ago' },
  ];

  return (
    <MobileLayout>
      <div className="py-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-creator-text">
              Dashboard
            </h1>
            <p className="text-creator-text/70 text-sm">
              Manage your content and subscriptions
            </p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="https://randomuser.me/api/portraits/women/32.jpg" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          {[
            { label: 'Revenue', value: '$254.76', icon: DollarSign, color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
            { label: 'Followers', value: '18', icon: User, color: 'bg-blue-100', iconColor: 'text-blue-600' },
          ].map((stat, index) => (
            <Card 
              key={stat.label} 
              className={cn(
                "card-glass border-none overflow-hidden",
                index === 0 ? "animation-delay-100" : "animation-delay-200"
              )}
            >
              <CardContent className="p-3 space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("p-1.5 rounded-full", stat.color)}>
                    <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                  </div>
                  <span className="text-sm font-medium text-creator-text/70">{stat.label}</span>
                </div>
                <span className="text-xl font-semibold text-creator-text">{stat.value}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="following" className="w-full animate-slide-up">
          <TabsList className="grid grid-cols-4 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="following" className="rounded-full">Following</TabsTrigger>
            <TabsTrigger value="content" className="rounded-full">My Content</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full">Orders</TabsTrigger>
            <TabsTrigger value="updates" className="rounded-full">Updates</TabsTrigger>
          </TabsList>
          
          {/* Following Tab */}
          <TabsContent value="following" className="mt-4 space-y-4">
            <SectionHeading 
              title="Creators You Follow" 
              subtitle="Check out their latest content"
              action={(
                <Link to="/following">
                  <CreatorButton variant="outline" size="sm" className="text-xs">
                    View all
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
              asChild
            >
              <Link to="/discover">
                <UserPlus className="h-4 w-4" />
                <span>Discover creators</span>
              </Link>
            </CreatorButton>
          </TabsContent>
          
          {/* My Content Tab */}
          <TabsContent value="content" className="mt-4 space-y-4">
            <SectionHeading 
              title="Your Content" 
              subtitle="Manage your exclusive content"
              action={(
                <Link to="/posts">
                  <CreatorButton variant="outline" size="sm" className="text-xs">
                    Create new
                  </CreatorButton>
                </Link>
              )}
            />
            
            <div className="space-y-3">
              {myContent.map((content) => (
                <Link to={`/posts/${content.id}`} key={content.id}>
                  <Card className="card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-creator/10 p-2 rounded-full">
                          <Plus className="h-5 w-5 text-creator" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-creator-text">{content.title}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-creator-text/70">${content.price}</p>
                            <span className="w-1 h-1 bg-creator-text/30 rounded-full"></span>
                            <p className="text-xs text-creator-text/70">{content.views} views</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-medium text-emerald-600">${content.revenue}</span>
                          <span className="text-xs text-creator-text/50">Revenue</span>
                        </div>
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
              asChild
            >
              <Link to="/posts">
                <Plus className="h-4 w-4" />
                <span>Create new content</span>
              </Link>
            </CreatorButton>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-4 space-y-4">
            <SectionHeading 
              title="Your Orders" 
              subtitle="Track your purchases and subscriptions"
              action={(
                <Link to="/orders">
                  <CreatorButton variant="outline" size="sm" className="text-xs">
                    View all
                  </CreatorButton>
                </Link>
              )}
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
              asChild
            >
              <Link to="/orders">
                <ShoppingBag className="h-4 w-4" />
                <span>View all orders</span>
              </Link>
            </CreatorButton>
          </TabsContent>
          
          {/* Updates Tab */}
          <TabsContent value="updates" className="mt-4 space-y-4">
            <SectionHeading 
              title="Latest Updates" 
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

        {/* Creator Tools Section */}
        <div className="space-y-3 animate-slide-up animation-delay-300">
          <SectionHeading 
            title="Creator Tools" 
            subtitle="Grow your audience and monetize your content"
            action={(
              <CreatorButton variant="link" size="sm" className="flex items-center gap-1" asChild>
                <Link to="/subscriptions">
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CreatorButton>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="card-glass overflow-hidden hover:bg-white/95 transition-all border-none animate-fade-in">
              <CardContent className="p-3 flex flex-col items-start">
                <Video className="h-5 w-5 text-creator mb-2" />
                <h3 className="font-medium text-creator-text">
                  Go Live
                </h3>
                <p className="text-xs text-creator-text/70">
                  Host live sessions for fans
                </p>
                <CreatorButton variant="outline" size="sm" className="mt-2 text-xs" asChild>
                  <Link to="/posts?type=live">
                    Schedule Now
                  </Link>
                </CreatorButton>
              </CardContent>
            </Card>
            <Card className="card-glass overflow-hidden hover:bg-white/95 transition-all border-none animate-fade-in">
              <CardContent className="p-3 flex flex-col items-start">
                <TrendingUp className="h-5 w-5 text-creator mb-2" />
                <h3 className="font-medium text-creator-text">
                  Analytics
                </h3>
                <p className="text-xs text-creator-text/70">
                  Track your performance
                </p>
                <CreatorButton variant="outline" size="sm" className="mt-2 text-xs">
                  View Stats
                </CreatorButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
