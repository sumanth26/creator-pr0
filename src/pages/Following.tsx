import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import SectionHeading from "@/components/ui/typography/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Bell, Heart, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatorButton from "@/components/ui/buttons/CreatorButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { fetchUser } from "@/Redux/userSlice";
import { getFollowingUsers, unfollowUser } from "@/lib/FollowersAndFollowings";
import { getInitials } from "@/lib/getInitalsName";
import { supabase } from "@/lib/superbase";

const Following = () => {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const dispatch = useDispatch();
  const [followingUserId, setFollowingUserId] = useState(null);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const {
    user: loggedInUser,
    loading: loggedInLoading,
    error: loggedInError,
  } = useSelector((state: RootState) => state.user);
  const [following, setFollowing] = useState([]);
  const [suggested, setsuggested] = useState([]);

  // get logged in user
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const fetchFollowing = async () => {
    if (loggedInUser?.id === null) {
      console.log("no login");
      return;
    }
    const users = await getFollowingUsers(loggedInUser?.id);
    setFollowing(users);
  };
  // get following list
  useEffect(() => {
    fetchFollowing();
  }, [loggedInUser]);
  // console.log(following)

  const fetchCreators = async () => {
    const { data, error } = await supabase.from("creators").select("*");

    if (error) {
      console.error("Error fetching creators:", error.message);
    } else {
      // Filter out the ones you're already following and yourself
      const filtered = data.filter(
        (creator) =>
          !following.some((f) => f.id === creator?.id) &&
          creator?.id !== loggedInUser?.id
      );
      setsuggested(filtered);
    }
  };
  useEffect(() => {
    if (following.length > 0) {
      fetchCreators();
    }
  }, [following, loggedInUser]);

  // console.log(suggested)

  useEffect(() => {
    const getUserToken = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      setAccessToken(sessionData?.session?.access_token);
      setLoading(false);
    };
    getUserToken();
  }, []);
  // handle follow
  const handleFollow = async (targetUserId: string) => {
    // setIsFollowingLoading(true);
    setFollowingUserId(targetUserId);
    try {
      if (!accessToken) {
        console.error("Access token missing");
        setIsFollowingLoading(false);
        setFollowingUserId(null);
        return;
      }
      // console.log('Access token:', accessToken);

      // Send follow request to edge function
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_FUNCTION_URL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUserId,
            loggedInUserId: loggedInUser.id,
          }),
        }
      );
      const data = await res.json();

      if (data.success) {
        console.log("Followed successfully!", data);
        await supabase.from("notifications").insert({
          receiver_id: targetUserId,
          sender_id: loggedInUser.id,
          type: "follow",
          message: `${loggedInUser.user_metadata.fullName} started follwing you.`,
          is_read: false,
        });
        fetchFollowing();
        fetchCreators();
      } else {
        console.error("Follow failed:", data.error);
      }
    } catch (err) {
      console.error("Unexpected follow error:", err);
    } finally {
      setIsFollowingLoading(false);
      setFollowingUserId(null);
    }
  };

  // unfollow
  const handleUnfollow = async (currentUserId, targetUserId) => {
    await unfollowUser(currentUserId, targetUserId);

    fetchFollowing();
    fetchCreators();
  };
  // Mock data
  const followedCreators = [
    {
      id: 1,
      name: "Jenna Studios",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      type: "Photographer",
      bio: "Professional photographer sharing exclusive behind-the-scenes content and premium photo edits.",
      followers: 2.8,
      posts: 156,
      subscription: 9.99,
      isFollowing: true,
    },
    {
      id: 2,
      name: "Alex Art",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      type: "Digital Artist",
      bio: "Digital artist creating stunning visual art and tutorials.",
      followers: 5.4,
      posts: 230,
      subscription: 4.99,
      isFollowing: true,
    },
    {
      id: 3,
      name: "Maya Music",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      type: "Music Producer",
      bio: "Indie music producer sharing original tracks and behind-the-scenes content.",
      followers: 12.5,
      posts: 89,
      subscription: 7.99,
      isFollowing: true,
    },
    {
      id: 4,
      name: "Tom Films",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      type: "Filmmaker",
      bio: "Independent filmmaker sharing exclusive short films and cinematography tips.",
      followers: 8.2,
      posts: 64,
      subscription: 11.99,
      isFollowing: true,
    },
    {
      id: 5,
      name: "Emma Dance",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      type: "Choreographer",
      bio: "Professional dancer and choreographer sharing dance tutorials and performances.",
      followers: 15.7,
      posts: 112,
      subscription: 6.99,
      isFollowing: true,
    },
  ];

  const formatFollowers = (count: number) => {
    return count >= 1 ? `${count}k` : `${count * 1000}`;
  };

  const suggestedCreators = [
    {
      id: 6,
      name: "John Tech",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      type: "Tech Reviewer",
      followers: 25.3,
      isFollowing: false,
    },
    {
      id: 7,
      name: "Sara Fitness",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      type: "Fitness Coach",
      followers: 45.8,
      isFollowing: false,
    },
    {
      id: 8,
      name: "Mike Gaming",
      avatar: "https://randomuser.me/api/portraits/men/79.jpg",
      type: "Game Streamer",
      followers: 120.4,
      isFollowing: false,
    },
  ];

  return (
    <MobileLayout>
      <div className="py-8 space-y-6 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-4">
          <Link to="/dashboard">
            <CreatorButton variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </CreatorButton>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-creator-text">Following</h1>
            <p className="text-creator-text/70 text-sm">
              Manage your followed creators
            </p>
          </div>
        </div>

        <Tabs defaultValue="following" className="w-full animate-slide-up">
          <TabsList className="grid grid-cols-2 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="following" className="rounded-full">
              Following ({following.length})
            </TabsTrigger>
            <TabsTrigger value="suggested" className="rounded-full">
              Suggested
            </TabsTrigger>
          </TabsList>

          {/* Following Tab */}
          <TabsContent value="following" className="mt-4 space-y-4">
            <div className="space-y-4">
              {following.map((creator) => (
                <Card
                  key={creator.id}
                  className="card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14 border-2 border-white">
                        <AvatarImage
                          src={creator.profile_image}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {creator.full_name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-creator-text">
                              {creator.full_name}
                            </h3>
                            <p className="text-xs text-creator-text/70">
                              {creator?.type}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-creator/10 text-creator border-creator"
                          >
                            ${creator?.subscription}/mo
                          </Badge>
                        </div>

                        <p className="text-xs text-creator-text/80 mt-1 line-clamp-2">
                          {creator.userbio}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-creator-text/70">
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {/* <span>{formatFollowers(creator.followers)}</span> */}
                          </div>
                          <div className="flex items-center">
                            <Bell className="h-3.5 w-3.5 mr-1" />
                            {/* <span>{creator.posts} posts</span> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                      <CreatorButton
                        variant="outline"
                        size="sm"
                        className={cn(
                          "gap-1",
                          creator.isFollowing
                            ? "text-pink-500 hover:text-pink-600 hover:bg-pink-50"
                            : ""
                        )}
                        onClick={() =>
                          handleUnfollow(loggedInUser?.id, creator?.id)
                        }
                      >
                        <span>Unfollow</span>
                      </CreatorButton>

                      <div className="flex gap-2">
                        <CreatorButton
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <Link to={`/creator/${creator.username}`}>
                            <span>View</span>
                          </Link>
                        </CreatorButton>
                        <CreatorButton
                          variant="outline"
                          size="sm"
                          className="gap-1"
                        >
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>Message</span>
                          </div>
                        </CreatorButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Suggested Tab */}
          <TabsContent value="suggested" className="mt-4 space-y-4">
            <SectionHeading
              title="Suggested for You"
              subtitle="Based on your interests"
            />

            <div className="space-y-3">
              {suggested.map((creator) => (
                <Card
                  key={creator.id}
                  className="card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none animate-fade-in"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage
                          src={creator.profile_image}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {getInitials(creator.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-creator-text">
                          {creator.full_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-creator-text/70">
                            @{creator?.username}
                          </p>
                          <span className="w-1 h-1 bg-creator-text/30 rounded-full"></span>
                          {/* <p className="text-xs text-creator-text/70">{formatFollowers(creator.followers)} followers</p> */}
                        </div>
                      </div>
                      <CreatorButton
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleFollow(creator.id)}
                        disabled={followingUserId === creator.id}
                      >
                        {followingUserId === creator.id ? (
                          <p>Pleas Wait</p>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>Follow</span>
                          </div>
                        )}
                      </CreatorButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              View More Suggestions
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Following;
