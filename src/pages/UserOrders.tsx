import React from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ChevronRight, Download, Eye, ShoppingBag } from 'lucide-react';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const UserOrders = () => {
  // Mock data - in a real app this would come from an API
  const orders = [
    { 
      id: 1, 
      title: 'Premium Photoshoot Package', 
      creator: { 
        name: 'Jenna Studios', 
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
      }, 
      price: 24.99, 
      date: 'June 15, 2023', 
      status: 'completed',
      type: 'content'
    },
    { 
      id: 2, 
      title: 'Monthly Premium Subscription', 
      creator: { 
        name: 'Alex Art', 
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg' 
      }, 
      price: 9.99, 
      date: 'June 12, 2023', 
      status: 'active',
      renewDate: 'July 12, 2023',
      type: 'subscription'
    },
    { 
      id: 3, 
      title: 'Music Tutorial Session', 
      creator: { 
        name: 'Maya Music', 
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg' 
      }, 
      price: 8.99, 
      date: 'June 5, 2023', 
      status: 'pending',
      type: 'content'
    },
    { 
      id: 4, 
      title: 'VIP Live Session', 
      creator: { 
        name: 'Tom Films', 
        avatar: 'https://randomuser.me/api/portraits/men/62.jpg' 
      }, 
      price: 15.99, 
      date: 'May 30, 2023', 
      status: 'completed',
      type: 'live'
    },
    { 
      id: 5, 
      title: 'Monthly Basic Subscription', 
      creator: { 
        name: 'Emma Dance', 
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg' 
      }, 
      price: 4.99, 
      date: 'May 25, 2023', 
      status: 'cancelled',
      type: 'subscription'
    },
  ];

  return (
    <MobileLayout userMode>
      <div className="py-8 space-y-6 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-4">
          <Link to="/user">
            <CreatorButton variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </CreatorButton>
          </Link>
          <h1 className="text-xl font-bold text-creator-text">
            My Orders
          </h1>
        </div>

        <Tabs defaultValue="all" className="w-full animate-slide-up">
          <TabsList className="grid grid-cols-3 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
            <TabsTrigger value="content" className="rounded-full">Content</TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-full">Subscriptions</TabsTrigger>
          </TabsList>
          
          {/* All Orders Tab */}
          <TabsContent value="all" className="mt-4 space-y-4">
            <div className="space-y-3">
              {orders.map((order) => (
                <Link to={`/orders/${order.id}`} key={order.id}>
                  <Card className={cn(
                    "card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in",
                    order.status === 'pending' && "border-l-4 border-l-amber-400",
                    order.status === 'active' && "border-l-4 border-l-emerald-400",
                    order.status === 'cancelled' && "border-l-4 border-l-gray-400"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.creator.avatar} />
                          <AvatarFallback>{order.creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-creator-text">{order.title}</h3>
                          <p className="text-xs text-creator-text/70">{order.creator.name}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-creator-text/40" />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <p className="text-creator-text/70">${order.price}</p>
                          <span className="w-1 h-1 bg-creator-text/30 rounded-full"></span>
                          <p className="text-creator-text/70">{order.date}</p>
                        </div>
                        <Badge variant="outline" className={cn(
                          order.status === 'completed' && "bg-blue-100 text-blue-700 border-blue-200",
                          order.status === 'active' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                          order.status === 'pending' && "bg-amber-100 text-amber-700 border-amber-200",
                          order.status === 'cancelled' && "bg-gray-100 text-gray-700 border-gray-200"
                        )}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      {order.type === 'subscription' && order.status === 'active' && (
                        <div className="mt-2 text-xs bg-creator/5 p-2 rounded-md">
                          <p className="text-creator-text/80">Next renewal: {order.renewDate}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content" className="mt-4 space-y-4">
            <div className="space-y-3">
              {orders.filter(order => order.type === 'content' || order.type === 'live').map((order) => (
                <Link to={`/orders/${order.id}`} key={order.id}>
                  <Card className={cn(
                    "card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in",
                    order.status === 'pending' && "border-l-4 border-l-amber-400"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.creator.avatar} />
                          <AvatarFallback>{order.creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-creator-text">{order.title}</h3>
                          <p className="text-xs text-creator-text/70">{order.creator.name}</p>
                        </div>
                        {order.status === 'completed' ? (
                          <CreatorButton variant="outline" size="sm" className="h-8">
                            {order.type === 'live' ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            <span className="text-xs">View</span>
                          </CreatorButton>
                        ) : (
                          <ChevronRight className="h-5 w-5 text-creator-text/40" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <p className="text-creator-text/70">${order.price}</p>
                          <span className="w-1 h-1 bg-creator-text/30 rounded-full"></span>
                          <p className="text-creator-text/70">{order.date}</p>
                        </div>
                        <Badge variant="outline" className={cn(
                          order.status === 'completed' && "bg-blue-100 text-blue-700 border-blue-200",
                          order.status === 'pending' && "bg-amber-100 text-amber-700 border-amber-200"
                        )}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="mt-4 space-y-4">
            <div className="space-y-3">
              {orders.filter(order => order.type === 'subscription').map((order) => (
                <Link to={`/orders/${order.id}`} key={order.id}>
                  <Card className={cn(
                    "card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in",
                    order.status === 'active' && "border-l-4 border-l-emerald-400",
                    order.status === 'cancelled' && "border-l-4 border-l-gray-400"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.creator.avatar} />
                          <AvatarFallback>{order.creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-creator-text">{order.title}</h3>
                          <p className="text-xs text-creator-text/70">{order.creator.name}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-creator-text/40" />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <p className="text-creator-text/70">${order.price}/month</p>
                          <span className="w-1 h-1 bg-creator-text/30 rounded-full"></span>
                          <p className="text-creator-text/70">Started: {order.date}</p>
                        </div>
                        <Badge variant="outline" className={cn(
                          order.status === 'active' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                          order.status === 'cancelled' && "bg-gray-100 text-gray-700 border-gray-200"
                        )}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      {order.status === 'active' && (
                        <div className="mt-2 text-xs bg-creator/5 p-2 rounded-md">
                          <p className="text-creator-text/80">Next renewal: {order.renewDate}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default UserOrders;
