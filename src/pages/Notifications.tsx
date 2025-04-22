import React, { useEffect, useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Image, ShoppingBag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/Redux/store";
import { supabase } from "@/lib/superbase";
// import { useDisclosure } from "@chakra-ui/react";
import { fetchUser } from "@/Redux/userSlice";

type NotificationType = "order" | "purchase" | "post" | "live";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications = () => {
  const {
    user: loggedInUser,
    loading: loggedInLoading,
    error: loggedInError,
  } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      message: "You received a new order for Premium Photoshoot Package",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "purchase",
      title: "Purchase Confirmed",
      message: "Your purchase of Digital Art Collection has been confirmed",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "post",
      title: "New Content Available",
      message: "Jenna Studios just posted new exclusive content",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "live",
      title: "Live Event Starting Soon",
      message: "Maya Music is going live in 30 minutes",
      time: "30 minutes ago",
      read: false,
    },
    {
      id: 5,
      type: "order",
      title: "Order Shipped",
      message: "Your order #12345 has been shipped",
      time: "3 days ago",
      read: true,
    },
    {
      id: 6,
      type: "post",
      title: "Content Updated",
      message: "Alex Art updated their premium collection",
      time: "4 days ago",
      read: true,
    },
  ]);
  const [newNotifications, setNewNotifications] = useState([]);

  useEffect(() => {
    dispatch(fetchUser());
    fetchNotifications();
  }, [dispatch]);
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*, sender:sender_id(full_name, profile_image)")
      .eq("receiver_id", loggedInUser.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching notifications:", error.message);
      return;
    }
    setNewNotifications(data);
  };

  console.log(newNotifications);
  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case "purchase":
        return <ShoppingBag className="h-5 w-5 text-green-500" />;
      case "post":
        return <Image className="h-5 w-5 text-purple-500" />;
      case "live":
        return <Calendar className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    return notifications.filter((notification) => notification.type === type);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <MobileLayout>
      <div className="py-4 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-creator-text">
              Notifications
            </h1>
            <p className="text-creator-text/70 text-sm">
              Stay updated with your latest activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-creator text-white">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="all" className="rounded-full text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="order" className="rounded-full text-xs">
              Orders
            </TabsTrigger>
            <TabsTrigger value="purchase" className="rounded-full text-xs">
              Purchases
            </TabsTrigger>
            <TabsTrigger value="post" className="rounded-full text-xs">
              Posts
            </TabsTrigger>
            <TabsTrigger value="live" className="rounded-full text-xs">
              Live
            </TabsTrigger>
          </TabsList>

          {["all", "order", "purchase", "post", "live"].map((tabValue) => (
            <TabsContent
              key={tabValue}
              value={tabValue}
              className="mt-4 space-y-3"
            >
              {newNotifications.length > 0 ? (
                newNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "card-glass overflow-hidden border-none transition-all",
                      !notification.read && "border-l-4 border-l-creator"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="bg-white/70 p-2 rounded-full">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-creator-text">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-creator-text/60">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-creator-text/80 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 text-creator-text/60">
                  <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>No notifications to show</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Notifications;
