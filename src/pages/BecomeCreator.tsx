
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Check, ChevronRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const BecomeCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState("");

  const contentTypes = [
    { id: 'art', label: 'Art & Design' },
    { id: 'music', label: 'Music & Audio' },
    { id: 'photo', label: 'Photography' },
    { id: 'writing', label: 'Writing & Publishing' },
    { id: 'video', label: 'Video & Film' },
    { id: 'education', label: 'Education & Courses' },
    { id: 'other', label: 'Other' },
  ];

  const benefits = [
    { 
      icon: Sparkles, 
      title: 'Monetize Your Content', 
      description: 'Earn from subscriptions, tips, and exclusive content.' 
    },
    { 
      icon: HeartHandshake, 
      title: 'Build Your Community', 
      description: 'Connect directly with your supporters and fans.' 
    },
    { 
      icon: ShieldCheck, 
      title: 'Secure Platform', 
      description: 'Your content and payments are protected and private.' 
    },
  ];

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step - activate creator account
      toast({
        title: "Creator Account Activated!",
        description: "You're now a creator and can access all creator tools.",
      });
      navigate("/profile");
    }
  };

  return (
    <MobileLayout>
      <div className="py-6 space-y-6 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-2">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-creator-text">
            Become a Creator
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between px-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                stepNumber < step ? "bg-creator text-white" : 
                stepNumber === step ? "bg-creator/20 text-creator border-2 border-creator" :
                "bg-gray-100 text-gray-400"
              }`}>
                {stepNumber < step ? <Check className="h-5 w-5" /> : stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`h-1 w-10 ${
                  stepNumber < step ? "bg-creator" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-center">Why become a creator?</h2>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <Card key={index} className="card-glass border-none">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-creator/10 p-2 rounded-full">
                        <benefit.icon className="h-6 w-6 text-creator" />
                      </div>
                      <div>
                        <h3 className="font-medium">{benefit.title}</h3>
                        <p className="text-sm text-creator-text/70 mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-center">What kind of content will you share?</h2>
            
            <RadioGroup value={contentType} onValueChange={setContentType}>
              <div className="space-y-3">
                {contentTypes.map((type) => (
                  <Card key={type.id} className="card-glass border-none overflow-hidden">
                    <CardContent className="p-0">
                      <Label
                        htmlFor={type.id}
                        className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <RadioGroupItem value={type.id} id={type.id} className="mr-3" />
                        <span>{type.label}</span>
                      </Label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-center">Ready to get started?</h2>
            
            <Card className="card-glass border-none">
              <CardContent className="p-4">
                <p className="text-center">
                  You're about to activate your creator account. After activation, you'll have access to:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-creator" />
                    <span className="text-sm">Creator analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-creator" />
                    <span className="text-sm">Subscription management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-creator" />
                    <span className="text-sm">Content publishing tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-creator" />
                    <span className="text-sm">Payment processing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        <CreatorButton 
          className="w-full" 
          onClick={handleContinue}
          disabled={step === 2 && !contentType}
        >
          {step === 3 ? 'Activate Creator Account' : 'Continue'} 
          <ChevronRight className="h-4 w-4 ml-1" />
        </CreatorButton>
      </div>
    </MobileLayout>
  );
};

export default BecomeCreator;
