import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, ExternalLink, Gift, HelpCircle, Lock, MessageCircle, Shield } from 'lucide-react';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock order data - in a real app this would come from an API
  const order = {
    id: Number(id) || 1,
    title: 'Premium Photoshoot Package',
    description: 'Exclusive behind-the-scenes content from the latest premium photoshoot, including editing tutorials and high-resolution downloads.',
    creator: {
      id: 1,
      name: 'Jenna Studios',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    price: 24.99,
    date: 'June 15, 2023',
    status: 'completed',
    orderNumber: 'PO-20230615-001',
    paymentMethod: 'Visa •••• 4242',
    receiptUrl: '#',
    type: 'content',
    downloadable: true,
    contentDetails: {
      size: '1.2 GB',
      format: 'MP4, PDF, JPG',
      duration: '45 minutes',
      access: 'Lifetime'
    }
  };

  const statusColors = {
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200"
  };

  return (
    <MobileLayout userMode>
      <div className="py-8 space-y-6 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-4">
          <Link to="/orders">
            <CreatorButton variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </CreatorButton>
          </Link>
          <h1 className="text-xl font-bold text-creator-text">
            Order Details
          </h1>
        </div>

        {/* Order Status */}
        <Card className="card-glass border-none overflow-hidden animate-slide-up">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Badge 
                variant="outline" 
                className={cn(
                  "px-4 py-1 text-sm mb-3",
                  // @ts-ignore
                  statusColors[order.status]
                )}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              
              <h2 className="font-semibold text-lg text-creator-text mb-1">{order.title}</h2>
              <p className="text-sm text-creator-text/80 mb-4">{order.description}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={order.creator.avatar} />
                  <AvatarFallback>{order.creator.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <Link to={`/creator/${order.creator.id}`}>
                  <span className="text-sm text-creator hover:underline">{order.creator.name}</span>
                </Link>
              </div>
              
              {order.status === 'completed' && order.downloadable && (
                <CreatorButton className="mb-2">
                  <Download className="h-4 w-4" />
                  <span>Download Content</span>
                </CreatorButton>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <CreatorButton variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact Creator</span>
                  </CreatorButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Contact Creator</DialogTitle>
                    <DialogDescription>
                      Send a message to {order.creator.name} about your order.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <textarea
                      className="w-full min-h-[120px] rounded-md border border-input p-3 text-sm"
                      placeholder="Write your message here..."
                    />
                    <CreatorButton>Send Message</CreatorButton>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card className="card-glass border-none overflow-hidden animate-slide-up animation-delay-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-creator-text mb-3">Order Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-creator-text/70">Order Number</span>
                <span className="text-sm font-medium text-creator-text">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-creator-text/70">Purchase Date</span>
                <span className="text-sm font-medium text-creator-text">{order.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-creator-text/70">Total Amount</span>
                <span className="text-sm font-medium text-creator-text">${order.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-creator-text/70">Payment Method</span>
                <span className="text-sm font-medium text-creator-text">{order.paymentMethod}</span>
              </div>
              
              <div className="pt-2">
                <Link to={order.receiptUrl} className="text-creator text-sm flex items-center gap-1 hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Receipt</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Details */}
        {order.type === 'content' && (
          <Card className="card-glass border-none overflow-hidden animate-slide-up animation-delay-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-creator-text mb-3">Content Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-creator-text/70">Size</span>
                  <span className="text-sm font-medium text-creator-text">{order.contentDetails.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-creator-text/70">Format</span>
                  <span className="text-sm font-medium text-creator-text">{order.contentDetails.format}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-creator-text/70">Duration</span>
                  <span className="text-sm font-medium text-creator-text">{order.contentDetails.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-creator-text/70">Access Period</span>
                  <span className="text-sm font-medium text-creator-text">{order.contentDetails.access}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="card-glass border-none overflow-hidden animate-slide-up animation-delay-300">
          <CardContent className="p-4">
            <h3 className="font-medium text-creator-text mb-3">Need Help?</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2">
                <div className="bg-creator/10 p-1.5 rounded-full">
                  <HelpCircle className="h-4 w-4 text-creator" />
                </div>
                <span className="text-sm text-creator-text">Having issues with your order?</span>
              </div>
              <Separator />
              <div className="flex items-center gap-3 py-2">
                <div className="bg-creator/10 p-1.5 rounded-full">
                  <Lock className="h-4 w-4 text-creator" />
                </div>
                <span className="text-sm text-creator-text">Can't access your content?</span>
              </div>
              <Separator />
              <div className="flex items-center gap-3 py-2">
                <div className="bg-creator/10 p-1.5 rounded-full">
                  <Gift className="h-4 w-4 text-creator" />
                </div>
                <span className="text-sm text-creator-text">Send this as a gift</span>
              </div>
              <Separator />
              <div className="flex items-center gap-3 py-2">
                <div className="bg-creator/10 p-1.5 rounded-full">
                  <Shield className="h-4 w-4 text-creator" />
                </div>
                <span className="text-sm text-creator-text">Report a problem</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default OrderDetail;
