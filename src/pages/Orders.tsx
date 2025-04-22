
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, MessageSquare, Search, CheckCircle, Clock, ShoppingBag, ChevronRight, Download, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { Separator } from '@/components/ui/separator';

const OrdersPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('creator');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [completionMessage, setCompletionMessage] = useState('');
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [userOrdersFilter, setUserOrdersFilter] = useState('all');

  // Creator orders data
  const creatorOrders = [
    { 
      id: 1, 
      type: 'ppv', 
      status: 'pending', 
      title: 'Exclusive Photoshoot BTS', 
      price: 12.99, 
      customer: { 
        name: 'Alex Thompson', 
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      date: '2 hours ago'
    },
    { 
      id: 2, 
      type: 'ppv', 
      status: 'completed', 
      title: 'April QnA Session Recording', 
      price: 5.99, 
      customer: { 
        name: 'Sarah Williams', 
        avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
      },
      date: '1 day ago',
      completionMessage: 'Sent full video recording with extra 10 minutes of BTS content.'
    },
    { 
      id: 3, 
      type: 'sub', 
      status: 'pending', 
      title: 'Premium Monthly Subscription', 
      price: 9.99, 
      customer: { 
        name: 'Mike Johnson', 
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      date: '3 days ago'
    },
    { 
      id: 4, 
      type: 'event', 
      status: 'pending', 
      title: 'Interactive Photoshoot Live Session', 
      price: 24.99, 
      customer: { 
        name: 'Emily Davis', 
        avatar: 'https://randomuser.me/api/portraits/women/25.jpg'
      },
      date: '1 week ago'
    },
    { 
      id: 5, 
      type: 'ppv', 
      status: 'completed', 
      title: 'Makeup Tutorial (Premium)', 
      price: 8.99, 
      customer: { 
        name: 'Jennifer Lee', 
        avatar: 'https://randomuser.me/api/portraits/women/91.jpg'
      },
      date: '2 weeks ago',
      completionMessage: 'Sent video with product links and exclusive discount codes.'
    }
  ];

  // User orders data
  const userOrders = [
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

  const orderTypes = [
    { id: 'all', label: 'All' },
    { id: 'ppv', label: 'Pay Per View' },
    { id: 'sub', label: 'Subscriptions' },
    { id: 'event', label: 'Live Events' },
  ];

  const filteredCreatorOrders = creatorOrders.filter(order => 
    (activeTab === 'all' || order.type === activeTab) &&
    (searchQuery === '' || 
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredUserOrders = userOrders.filter(order => 
    (userOrdersFilter === 'all' || order.type === userOrdersFilter) &&
    (searchQuery === '' || 
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCompleteOrder = (order) => {
    setSelectedOrder(order);
    setCompletionMessage('');
    setIsCompleteDialogOpen(true);
  };

  const submitCompletion = () => {
    if (!completionMessage.trim()) {
      toast({
        title: "Completion message required",
        description: "Please provide details about how you completed this order.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would update the database
    toast({
      title: "Order completed",
      description: `Order #${selectedOrder.id} has been marked as completed.`,
    });
    
    setIsCompleteDialogOpen(false);
    setCompletionMessage('');
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'ppv': return <ShoppingBag className="h-4 w-4" />;
      case 'sub': return <CheckCircle className="h-4 w-4" />;
      case 'event': return <Clock className="h-4 w-4" />;
      case 'content': return <ShoppingBag className="h-4 w-4" />;
      case 'subscription': return <CheckCircle className="h-4 w-4" />;
      case 'live': return <Clock className="h-4 w-4" />;
      default: return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const getOrderTypeLabel = (type) => {
    switch (type) {
      case 'ppv': return 'Pay Per View';
      case 'sub': return 'Subscription';
      case 'event': return 'Live Event';
      case 'content': return 'Content';
      case 'subscription': return 'Subscription';
      case 'live': return 'Live Event';
      default: return 'Order';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 'active':
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 'pending':
        return "bg-amber-100 text-amber-700 border-amber-200";
      case 'cancelled':
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <MobileLayout>
      <div className="py-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-creator-text">
            Orders
          </h1>
        </div>

        {/* Main tabs: Creator vs User Orders */}
        <Tabs 
          defaultValue="creator" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full animate-slide-up"
        >
          <TabsList className="w-full grid grid-cols-2 rounded-full p-1">
            <TabsTrigger value="creator" className="rounded-full">
              Creator Orders
            </TabsTrigger>
            <TabsTrigger value="user" className="rounded-full">
              My Purchases
            </TabsTrigger>
          </TabsList>

          {/* Creator Orders Tab */}
          <TabsContent value="creator" className="mt-4 space-y-4">
            {/* Search and Filter */}
            <Card className="card-glass animate-slide-up border-none">
              <CardContent className="p-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 bg-white border-creator/10 text-sm"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Tabs 
                    defaultValue="all" 
                    className="w-full" 
                    value={activeTab === 'creator' ? activeTab : 'all'}
                    onValueChange={(value) => {
                      if (value !== 'creator' && value !== 'user') {
                        setActiveTab(value);
                      }
                    }}
                  >
                    <TabsList className="bg-white/50 p-1 h-auto">
                      {orderTypes.map(type => (
                        <TabsTrigger 
                          key={type.id}
                          value={type.id}
                          className={cn(
                            "text-xs py-1 px-3",
                            "data-[state=active]:bg-creator data-[state=active]:text-white"
                          )}
                        >
                          {type.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  
                  <Button size="sm" variant="outline" className="ml-2">
                    <Filter className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Creator Orders List */}
            <div className="space-y-4 animate-slide-up animation-delay-200">
              {filteredCreatorOrders.length > 0 ? (
                <div className="space-y-3">
                  {filteredCreatorOrders.map((order, index) => (
                    <Card 
                      key={order.id} 
                      className={cn(
                        "card-glass border-none overflow-hidden",
                        order.status === 'pending' ? "border-l-4 border-l-amber-400" : "border-l-4 border-l-emerald-400",
                        "animate-scale-in",
                        index % 3 === 0 ? "animation-delay-100" : 
                        index % 3 === 1 ? "animation-delay-200" : 
                        "animation-delay-300"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={order.customer.avatar} />
                              <AvatarFallback>{order.customer.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-creator-text">{order.title}</h3>
                              <div className="flex items-center text-xs text-creator-text/70 mt-1">
                                <span>{order.customer.name}</span>
                                <span className="mx-1.5">•</span>
                                <span>{order.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-creator">${order.price}</div>
                            <Badge variant="outline" className={cn(
                              "mt-1",
                              order.status === 'pending' 
                                ? "bg-amber-100 text-amber-700 border-amber-200" 
                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                            )}>
                              {order.status === 'pending' ? 'Pending' : 'Completed'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center text-xs bg-creator/5 p-2 rounded-md mb-3">
                          {getOrderTypeIcon(order.type)}
                          <span className="ml-1.5 text-creator-text/80">{getOrderTypeLabel(order.type)}</span>
                        </div>

                        {order.completionMessage && (
                          <div className="text-sm bg-white p-3 rounded-md border border-gray-100 mb-3">
                            <div className="font-medium text-xs text-creator-text/70 mb-1">Completion Details:</div>
                            <p className="text-creator-text/80">{order.completionMessage}</p>
                          </div>
                        )}

                        <div className="flex space-x-2 mt-3">
                          <CreatorButton 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              toast({
                                title: "Message sent",
                                description: `Your message to ${order.customer.name} has been sent.`,
                              });
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            <span>Message</span>
                          </CreatorButton>
                          
                          {order.status === 'pending' && (
                            <CreatorButton 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleCompleteOrder(order)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              <span>Complete</span>
                            </CreatorButton>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-creator/10 p-4 rounded-full mb-4">
                    <ShoppingBag className="h-6 w-6 text-creator" />
                  </div>
                  <h3 className="text-lg font-medium text-creator-text mb-1">No orders found</h3>
                  <p className="text-sm text-creator-text/70 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <CreatorButton 
                    size="sm" 
                    className="flex items-center gap-1.5"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('all');
                    }}
                  >
                    <span>Clear filters</span>
                  </CreatorButton>
                </div>
              )}
            </div>
          </TabsContent>

          {/* User Orders Tab */}
          <TabsContent value="user" className="mt-4 space-y-4">
            {/* User Orders Filter */}
            <Card className="card-glass animate-slide-up border-none">
              <CardContent className="p-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 bg-white border-creator/10 text-sm"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Tabs 
                    defaultValue="all" 
                    className="w-full" 
                    value={userOrdersFilter}
                    onValueChange={setUserOrdersFilter}
                  >
                    <TabsList className="bg-white/50 p-1 h-auto">
                      <TabsTrigger 
                        value="all"
                        className={cn(
                          "text-xs py-1 px-3",
                          "data-[state=active]:bg-creator data-[state=active]:text-white"
                        )}
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger 
                        value="content"
                        className={cn(
                          "text-xs py-1 px-3",
                          "data-[state=active]:bg-creator data-[state=active]:text-white"
                        )}
                      >
                        Content
                      </TabsTrigger>
                      <TabsTrigger 
                        value="subscription"
                        className={cn(
                          "text-xs py-1 px-3",
                          "data-[state=active]:bg-creator data-[state=active]:text-white"
                        )}
                      >
                        Subscriptions
                      </TabsTrigger>
                      <TabsTrigger 
                        value="live"
                        className={cn(
                          "text-xs py-1 px-3",
                          "data-[state=active]:bg-creator data-[state=active]:text-white"
                        )}
                      >
                        Live
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Button size="sm" variant="outline" className="ml-2">
                    <Filter className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* User Orders List */}
            <div className="space-y-3">
              {filteredUserOrders.map((order) => (
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
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
          </TabsContent>
        </Tabs>

        {/* Complete Order Dialog */}
        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Order</DialogTitle>
              <DialogDescription>
                Describe how you've fulfilled this order. This message will be visible to the customer.
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-creator-text/70">Order:</span>
                  <span className="text-sm text-creator-text">{selectedOrder.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-creator-text/70">Customer:</span>
                  <span className="text-sm text-creator-text">{selectedOrder.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-creator-text/70">Amount:</span>
                  <span className="text-sm text-creator-text">${selectedOrder.price}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-creator-text/70 block mb-2">
                    Completion Message:
                  </label>
                  <Textarea
                    placeholder="Describe how you've fulfilled this order (e.g., content delivered, special bonuses included, etc.)"
                    value={completionMessage}
                    onChange={(e) => setCompletionMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                Cancel
              </Button>
              <CreatorButton onClick={submitCompletion}>
                <CheckCircle className="h-4 w-4 mr-1.5" />
                <span>Mark as Complete</span>
              </CreatorButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default OrdersPage;
