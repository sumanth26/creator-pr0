
import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PendingOrders = () => {
  // Example pending orders
  const pendingOrders = [
    { id: 'ORD-2458', customer: 'Alex Smith', date: '15 min ago', amount: '$24.99', items: 2 },
    { id: 'ORD-2457', customer: 'Jessica Williams', date: '32 min ago', amount: '$49.99', items: 1 },
    { id: 'ORD-2456', customer: 'Michael Johnson', date: '1 hour ago', amount: '$19.99', items: 3 },
    { id: 'ORD-2455', customer: 'Emily Davis', date: '2 hours ago', amount: '$34.99', items: 2 },
  ];

  return (
    <MobileLayout>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pending Orders</h1>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            {pendingOrders.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {pendingOrders.map((order, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{order.amount}</div>
                      <div className="text-xs text-gray-500">{order.items} items</div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-amber-600">
                    <Clock className="w-3 h-3 mr-1" />
                    {order.date}
                  </div>
                </div>
                <Separator />
                <button className="w-full p-3 text-sm font-medium flex items-center justify-center hover:bg-gray-50">
                  Process Order
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default PendingOrders;
