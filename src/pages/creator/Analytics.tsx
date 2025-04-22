
import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, Users, Eye, ShoppingBag } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Analytics = () => {
  // Example analytics data
  const analyticsData = [
    { label: 'Revenue', value: '$1,245.89', icon: DollarSign, change: '+12.5%', positive: true },
    { label: 'Followers', value: '1,856', icon: Users, change: '+8.2%', positive: true },
    { label: 'Views', value: '24.5K', icon: Eye, change: '-3.1%', positive: false },
    { label: 'Orders', value: '148', icon: ShoppingBag, change: '+5.4%', positive: true },
  ];

  return (
    <MobileLayout>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {analyticsData.map((item, index) => (
            <Card key={index} className="border border-gray-200">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <item.icon className="w-4 h-4 mr-1" />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="text-xl font-bold">{item.value}</div>
                <div className={`text-xs flex items-center mt-1 ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {item.positive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {item.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Analytics;
