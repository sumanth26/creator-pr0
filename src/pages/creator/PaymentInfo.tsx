
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { CreditCard, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import CreatorButton from '@/components/ui/buttons/CreatorButton';

const PaymentInfo = () => {
  return (
    <MobileLayout>
      <div className="py-8 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-creator-text">Payment Info</h1>
        </div>
        
        <div className="space-y-4">
          <SectionHeading title="Connected Payment Methods" subtitle="Manage your payment methods" />
          
          <Card className="card-glass border-none">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-creator/10 flex items-center justify-center mr-3">
                  <CreditCard className="h-5 w-5 text-creator" />
                </div>
                <div>
                  <h3 className="font-medium">Credit Card</h3>
                  <p className="text-sm text-creator-text/70">Visa ending in 4242</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-creator/10 flex items-center justify-center mr-3">
                  <Wallet className="h-5 w-5 text-creator" />
                </div>
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-creator-text/70">Connected: yourname@email.com</p>
                </div>
              </div>
              
              <CreatorButton variant="outline" className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                Add Payment Method
              </CreatorButton>
            </CardContent>
          </Card>
          
          <SectionHeading title="Payout Information" subtitle="Where you receive your earnings" />
          
          <Card className="card-glass border-none">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-creator/10 flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5 text-creator" />
                </div>
                <div>
                  <h3 className="font-medium">Bank Account</h3>
                  <p className="text-sm text-creator-text/70">Ending in 0123</p>
                </div>
              </div>
              
              <CreatorButton variant="outline" className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                Update Payout Information
              </CreatorButton>
            </CardContent>
          </Card>
          
          <SectionHeading title="Tax Information" subtitle="Required for payouts" />
          
          <Card className="card-glass border-none">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Tax Form Status</h3>
                  <p className="text-sm text-creator-text/70">W-9 submitted</p>
                </div>
                <Button variant="link" className="text-creator">View</Button>
              </div>
              
              <CreatorButton variant="outline" className="w-full">
                Update Tax Information
              </CreatorButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PaymentInfo;
