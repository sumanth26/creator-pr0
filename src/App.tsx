import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Posts from "./pages/Posts";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CreatorProfile from "./pages/CreatorProfile";
import OrderDetail from "./pages/OrderDetail";
import Subscriptions from "./pages/Subscriptions";
import Following from "./pages/Following";
import Analytics from "./pages/creator/Analytics";
import PendingOrders from "./pages/creator/PendingOrders";
import PaymentInfo from "./pages/creator/PaymentInfo";
import RecentPayments from "./pages/creator/RecentPayments";
import CreatorOrders from "./pages/creator/CreatorOrders";
import MyPosts from "./pages/creator/MyPosts";
import Settings from "./pages/Settings";
import BecomeCreator from "./pages/BecomeCreator";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import store from "./Redux/store";
import { AuthContextProvider } from "./HOC/AuthContextProvider";
import { Provider } from "react-redux";
import { CreatorLogin } from "./pages/Auth/CreatorLogin";
import { CreatorSignup } from "./pages/Auth/CreatorSignup";
import ProtectedRoute from "./ProtectedRoute";
import Task from "./pages/Task";
import CreatorProfileOld from "./pages/CreatorProfile-old";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <Routes>
              {/* public routes */}
              <Route path="/creator-login" element={<CreatorLogin />} />
              <Route path="/creator-signup" element={<CreatorSignup />} />
              <Route path="/task" element={<Task/>}/>
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/creator/:username" element={<CreatorProfile />} />
                <Route path="/creatorold/:username" element={<CreatorProfileOld />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/following" element={<Following />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/become-creator" element={<BecomeCreator />} />

                {/* Creator Routes */}
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/pending-orders" element={<PendingOrders />} />
                <Route path="/payment-info" element={<PaymentInfo />} />
                <Route path="/payments" element={<RecentPayments />} />
                <Route path="/creator-orders" element={<CreatorOrders />} />
                <Route path="/my-posts" element={<MyPosts />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </Provider>
);

export default App;
