
import React from 'react';
import { Package, Search, Filter } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CreatorOrders = () => {
  // Example orders
  const orders = [
    { id: 'ORD-2458', customer: 'Alex Smith', date: 'May 12, 2023', amount: '$24.99', status: 'Completed' },
    { id: 'ORD-2457', customer: 'Jessica Williams', date: 'May 11, 2023', amount: '$49.99', status: 'Shipped' },
    { id: 'ORD-2456', customer: 'Michael Johnson', date: 'May 10, 2023', amount: '$19.99', status: 'Processing' },
    { id: 'ORD-2455', customer: 'Emily Davis', date: 'May 9, 2023', amount: '$34.99', status: 'Completed' },
    { id: 'ORD-2454', customer: 'Robert Wilson', date: 'May 8, 2023', amount: '$29.99', status: 'Completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <MobileLayout>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders</h1>
          <Badge className="bg-creator/10 text-creator border-creator/20">
            {orders.length} Total
          </Badge>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search orders..." />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.customer}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{order.amount}</div>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <button className="w-full p-3 text-sm font-medium flex items-center justify-center hover:bg-gray-50">
                  <Package className="h-4 w-4 mr-2" />
                  View Order Details
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default CreatorOrders;
