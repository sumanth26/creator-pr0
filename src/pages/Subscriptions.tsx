
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight, DollarSign, Edit2, Plus, RefreshCw, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const SubscriptionsPage = () => {
  const subscriptionPlans = [
    { 
      id: 1, 
      name: 'Basic', 
      price: 9.99, 
      subscribers: 12,
      benefits: ['Exclusive content', 'Content library access', 'Priority support'],
      isActive: true 
    },
    { 
      id: 2, 
      name: 'Premium', 
      price: 19.99, 
      subscribers: 6,
      benefits: ['All Basic benefits', 'Live sessions access', 'Behind the scenes content', 'Direct messaging'],
      isActive: true 
    },
  ];

  const formatSubscribers = (count: number) => {
    return count === 1 ? '1 subscriber' : `${count} subscribers`;
  };

  return (
    <MobileLayout>
      <div className="py-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-creator-text">
            Subscriptions
          </h1>
          <CreatorButton size="sm" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Plan</span>
          </CreatorButton>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          {[
            { label: 'Total Revenue', value: '$254.76', icon: DollarSign, color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
            { label: 'Subscribers', value: '18', icon: Users, color: 'bg-blue-100', iconColor: 'text-blue-600' },
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

        {/* Subscription Plans */}
        <div className="space-y-4 animate-slide-up animation-delay-200">
          <SectionHeading 
            title="Subscription Plans" 
            subtitle="Manage your subscription offerings"
          />
          
          <div className="space-y-4">
            {subscriptionPlans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={cn(
                  "card-glass border-none overflow-hidden relative",
                  "transition-all duration-300 hover:shadow-md",
                  "animate-scale-in",
                  index === 0 ? "animation-delay-200" : "animation-delay-300"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-creator-text">{plan.name}</h3>
                        {plan.isActive && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-lg font-bold text-creator-dark">
                          ${plan.price}
                        </span>
                        <span className="text-sm text-creator-text/70">/month</span>
                      </div>
                    </div>
                    <CreatorButton variant="outline" size="sm" className="text-xs gap-1">
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </CreatorButton>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-creator-text/70 mb-3">
                    <Users className="h-3.5 w-3.5" />
                    <span>{formatSubscribers(plan.subscribers)}</span>
                  </div>
                  
                  <Separator className="my-3 bg-gray-200" />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-creator-text">Benefits:</h4>
                    <ul className="space-y-1">
                      {plan.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-creator shrink-0 mt-0.5" />
                          <span className="text-creator-text/80">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex mt-4 gap-2">
                    <CreatorButton 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs flex items-center gap-1"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Renew All</span>
                    </CreatorButton>
                    
                    <CreatorButton 
                      size="sm" 
                      className="text-xs ml-auto"
                    >
                      View Subscribers
                    </CreatorButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SubscriptionsPage;
