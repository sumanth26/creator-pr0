
import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const RecentPayments = () => {
  // Example transactions
  const transactions = [
    { id: 'TRX-4578', type: 'incoming', amount: '$54.99', from: 'Sarah Wilson', date: 'May 12, 2023', status: 'Completed' },
    { id: 'TRX-4577', type: 'outgoing', amount: '$250.00', to: 'Bank Account', date: 'May 10, 2023', status: 'Completed' },
    { id: 'TRX-4576', type: 'incoming', amount: '$19.99', from: 'David Miller', date: 'May 9, 2023', status: 'Completed' },
    { id: 'TRX-4575', type: 'incoming', amount: '$34.99', from: 'James Brown', date: 'May 7, 2023', status: 'Completed' },
    { id: 'TRX-4574', type: 'outgoing', amount: '$500.00', to: 'Bank Account', date: 'May 1, 2023', status: 'Completed' },
  ];

  return (
    <MobileLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold">Recent Payments</h1>

        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.map((transaction, index) => (
              <React.Fragment key={index}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 p-2 rounded-full ${
                      transaction.type === 'incoming' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {transaction.type === 'incoming' 
                        ? <ArrowDownLeft className="w-5 h-5" /> 
                        : <ArrowUpRight className="w-5 h-5" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {transaction.type === 'incoming' 
                            ? `From ${transaction.from}` 
                            : `To ${transaction.to}`
                          }
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'incoming' 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}>
                          {transaction.type === 'incoming' 
                            ? `+${transaction.amount}` 
                            : `-${transaction.amount}`
                          }
                        </div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm text-gray-500">{transaction.date}</div>
                        <div className="text-xs bg-gray-100 rounded px-2 py-0.5">
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < transactions.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default RecentPayments;
