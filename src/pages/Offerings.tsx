
import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import ContentCard from '@/components/ui/card/ContentCard';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { Button } from '@/components/ui/button';
import { Filter, Plus, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OfferingsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const offeringTypes = [
    { id: 'all', label: 'All' },
    { id: 'ppv', label: 'Pay Per View' },
    { id: 'sub', label: 'Subscription' },
    { id: 'free', label: 'Free' },
  ];

  const offerings = [
    { id: 1, title: 'Exclusive Photoshoot BTS', price: 12.99, type: 'ppv', isLocked: false },
    { id: 2, title: 'April QnA Session Recording', price: 5.99, type: 'ppv', isLocked: true },
    { id: 3, title: 'Makeup Tutorial (Premium)', price: 8.99, type: 'sub', isLocked: true },
    { id: 4, title: 'Weekly Vlog #24', price: 0, type: 'free', isLocked: false },
    { id: 5, title: 'Cooking with Jenna: Pasta Edition', price: 7.99, type: 'ppv', isLocked: true },
    { id: 6, title: 'Morning Routine 2023', price: 0, type: 'sub', isLocked: true },
  ];

  const filteredOfferings = offerings.filter(offering => 
    (activeTab === 'all' || offering.type === activeTab) &&
    (searchQuery === '' || offering.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MobileLayout>
      <div className="py-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-creator-text">
            Offerings
          </h1>
          <CreatorButton size="sm" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </CreatorButton>
        </div>

        {/* Search and Filter */}
        <Card className="card-glass animate-slide-up border-none">
          <CardContent className="p-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9 bg-white border-creator/10 text-sm"
                placeholder="Search offerings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Tabs 
                defaultValue="all" 
                className="w-full" 
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="bg-white/50 p-1 h-auto">
                  {offeringTypes.map(type => (
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

        {/* Offerings Grid */}
        <div className="space-y-4 animate-slide-up animation-delay-200">
          {filteredOfferings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredOfferings.map((offering, index) => (
                <ContentCard 
                  key={offering.id}
                  title={offering.title}
                  price={offering.price}
                  isLocked={offering.isLocked}
                  className={cn(
                    "animate-scale-in",
                    index % 4 === 0 ? "animation-delay-100" : 
                    index % 4 === 1 ? "animation-delay-200" : 
                    index % 4 === 2 ? "animation-delay-300" : 
                    "animation-delay-400"
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-creator/10 p-4 rounded-full mb-4">
                <Search className="h-6 w-6 text-creator" />
              </div>
              <h3 className="text-lg font-medium text-creator-text mb-1">No offerings found</h3>
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
      </div>
    </MobileLayout>
  );
};

export default OfferingsPage;
