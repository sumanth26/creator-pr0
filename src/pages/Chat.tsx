
import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDownAZ, 
  ArrowUpAZ, 
  CircleDollarSign, 
  Image as ImageIcon, 
  MessagesSquare, 
  Send, 
  ShoppingCart, 
  Star, 
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Chat = {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isTopSpender: boolean;
  totalSpent: number;
  lastPurchase?: {
    type: 'post' | 'subscription';
    title: string;
    price: number;
  };
};

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("newest");
  const [message, setMessage] = useState("");

  // Mock data for chats
  const chats: Chat[] = [
    {
      id: "1",
      username: "Jessica_fan",
      avatar: "/placeholder.svg",
      lastMessage: "I loved your latest post! The makeup tutorial was amazing 😍",
      timestamp: "5m ago",
      unread: true,
      isTopSpender: true,
      totalSpent: 149.99,
      lastPurchase: {
        type: 'post',
        title: 'Exclusive BTS Photoshoot',
        price: 9.99
      }
    },
    {
      id: "2",
      username: "Michael_K",
      avatar: "/placeholder.svg",
      lastMessage: "Can you make a tutorial on that hairstyle?",
      timestamp: "1h ago",
      unread: true,
      isTopSpender: false,
      totalSpent: 29.99,
      lastPurchase: {
        type: 'subscription',
        title: 'Silver Plan',
        price: 9.99
      }
    },
    {
      id: "3",
      username: "SarahLoves",
      avatar: "/placeholder.svg",
      lastMessage: "Just subscribed to your premium content!",
      timestamp: "3h ago",
      unread: false,
      isTopSpender: true,
      totalSpent: 99.99,
      lastPurchase: {
        type: 'subscription',
        title: 'Gold Plan',
        price: 19.99
      }
    },
    {
      id: "4",
      username: "JohnDoe",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for answering my question!",
      timestamp: "1d ago",
      unread: false,
      isTopSpender: false,
      totalSpent: 39.99
    },
  ];

  const messages = [
    { id: 1, sender: 'fan', content: 'Hello! I just purchased your latest makeup tutorial post.', time: '11:30 AM' },
    { id: 2, sender: 'creator', content: 'Hi there! Thank you so much for the support! How did you like it?', time: '11:32 AM' },
    { id: 3, sender: 'fan', content: 'It was amazing! The tips really helped me improve my technique.', time: '11:35 AM' },
    { id: 4, sender: 'creator', content: 'I\'m so glad to hear that! Let me know if you have any questions.', time: '11:40 AM' },
    { id: 5, sender: 'fan', content: 'Will you be doing any live tutorials soon?', time: '11:45 AM' },
  ];

  const filteredChats = [...chats].sort((a, b) => {
    if (filterType === "newest") {
      // Simple sort by "timestamp" (would be better with actual dates)
      return a.timestamp > b.timestamp ? -1 : 1;
    } else if (filterType === "unread") {
      // Sort unread first
      return a.unread === b.unread ? 0 : a.unread ? -1 : 1;
    } else if (filterType === "top-spenders") {
      // Sort by total spent
      return b.totalSpent - a.totalSpent;
    }
    return 0;
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send the message to the backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <MobileLayout>
      <div className="py-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-creator-text">
            Messages
          </h1>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CreatorButton size="sm" variant="outline" className="flex items-center gap-1.5">
                  {filterType === "newest" && <ArrowUpAZ className="h-4 w-4" />}
                  {filterType === "unread" && <MessagesSquare className="h-4 w-4" />}
                  {filterType === "top-spenders" && <CircleDollarSign className="h-4 w-4" />}
                  <span>Filter</span>
                </CreatorButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setFilterType("newest")}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  <span>Newest</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("unread")}>
                  <MessagesSquare className="mr-2 h-4 w-4" />
                  <span>Unread</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("top-spenders")}>
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  <span>Top Spenders</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {activeChat ? (
          // Chat conversation view
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-lg p-3 mb-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <CreatorButton 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setActiveChat(null)}
                  className="p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </CreatorButton>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="User avatar" />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {chats.find(c => c.id === activeChat)?.username}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <CircleDollarSign className="h-3 w-3 text-creator" />
                      <span className="text-xs text-creator">
                        ${chats.find(c => c.id === activeChat)?.totalSpent.toFixed(2)} spent
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex",
                  msg.sender === 'creator' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] rounded-lg p-3 shadow-sm",
                    msg.sender === 'creator' 
                      ? "bg-creator/10 text-creator-dark" 
                      : "bg-gray-100 text-gray-800"
                  )}>
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase info if available */}
            {chats.find(c => c.id === activeChat)?.lastPurchase && (
              <div className="mb-4">
                <Card className="bg-gray-50 border-dashed border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-creator" />
                      <span className="text-xs font-medium">Recent Purchase</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {chats.find(c => c.id === activeChat)?.lastPurchase?.type === 'post' ? (
                          <ImageIcon className="h-8 w-8 p-1.5 bg-creator/10 text-creator rounded-md" />
                        ) : (
                          <Star className="h-8 w-8 p-1.5 bg-creator/10 text-creator rounded-md" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {chats.find(c => c.id === activeChat)?.lastPurchase?.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {chats.find(c => c.id === activeChat)?.lastPurchase?.type === 'post' ? 'Post' : 'Subscription'}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-creator/10 text-creator border-none">
                        ${chats.find(c => c.id === activeChat)?.lastPurchase?.price.toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Message input */}
            <div className="flex gap-2 pt-2">
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="resize-none min-h-[60px]"
              />
              <div className="flex flex-col gap-2">
                <CreatorButton
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                >
                  <ImageIcon className="h-4 w-4" />
                </CreatorButton>
                <CreatorButton
                  size="icon"
                  onClick={handleSendMessage}
                  className="h-8 w-8"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </CreatorButton>
              </div>
            </div>
          </div>
        ) : (
          // Chat list view
          <div className="space-y-4">
            <SectionHeading 
              title="Conversations" 
              subtitle={`${filterType === "newest" ? "Recent" : filterType === "unread" ? "Unread" : "Top Spending"} fans`} 
            />
            
            <div className="space-y-3">
              {filteredChats.map((chat) => (
                <Card 
                  key={chat.id}
                  className={cn(
                    "overflow-hidden cursor-pointer",
                    chat.unread ? "bg-creator/5 border-creator/10" : "bg-white"
                  )}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <Avatar className="h-12 w-12">
                        <img src={chat.avatar} alt={`${chat.username}'s avatar`} />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-creator-text">{chat.username}</h3>
                            {chat.isTopSpender && (
                              <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 text-[10px] px-1 py-0 h-4">
                                <CircleDollarSign className="h-2.5 w-2.5 mr-0.5" />
                                Top
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <p className={cn(
                          "text-sm mt-0.5 truncate",
                          chat.unread ? "font-medium text-creator-dark" : "text-gray-500"
                        )}>
                          {chat.lastMessage}
                        </p>
                        
                        {chat.lastPurchase && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className={cn(
                              "flex items-center gap-1 text-xs rounded-full px-2 py-0.5",
                              chat.lastPurchase.type === 'post' 
                                ? "bg-purple-50 text-purple-700" 
                                : "bg-blue-50 text-blue-700"
                            )}>
                              {chat.lastPurchase.type === 'post' ? (
                                <ImageIcon className="h-3 w-3" />
                              ) : (
                                <Star className="h-3 w-3" />
                              )}
                              <span>
                                {chat.lastPurchase.type === 'post' ? 'Purchased Post' : 'Subscribed'}
                              </span>
                            </div>
                            <Badge className="bg-creator/10 text-creator/80 border-none text-[10px]">
                              ${chat.lastPurchase.price.toFixed(2)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredChats.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-creator/10 p-4 rounded-full mb-4">
                  <MessagesSquare className="h-6 w-6 text-creator" />
                </div>
                <h3 className="text-lg font-medium text-creator-text mb-1">No messages yet</h3>
                <p className="text-sm text-creator-text/70 mb-4">
                  Messages from your fans will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default ChatPage;
