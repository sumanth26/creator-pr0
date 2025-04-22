import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import sampleCoverimage from "../assets/images/cover.jpeg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CreatorButton from "@/components/ui/buttons/CreatorButton";
import SectionHeading from "@/components/ui/typography/SectionHeading";
import ContentCard from "@/components/ui/card/ContentCard";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Share2,
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  MapPin,
  Image,
  Video,
  MoreHorizontal,
  Check,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { fetchUser } from "@/Redux/userSlice";
import { supabase } from "@/lib/superbase";
import { getInitials } from "@/lib/getInitalsName";
import {
  getFollowers,
  getFollowingUsers,
  isFollowingUser,
  unfollowUser,
} from "@/lib/FollowersAndFollowings";
import { fetchOfferings } from "@/Redux/offeringsSlice";
import { fetchSocialLinks } from "@/Redux/socialLinksSlice";
import SocialButtons from "@/components/SocialLinks";
import { fetchSubscriptions } from "@/Redux/subscriptionsSlice";

const getSocialIcon = (type) => {
  const iconMap = {
    twitter: <Twitter size={16} />,
    instagram: <Instagram size={16} />,
    facebook: <Facebook size={16} />,
    youtube: <Youtube size={16} />,
    website: <Globe size={16} />,
    linkedin: <Linkedin size={16} />,
  };

  return iconMap[type] || null;
};
const CreatorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUser] = useState(null);
  const {
    user: loggedInUser,
    loading: loggedInLoading,
    error: loggedInError,
  } = useSelector((state: RootState) => state.user);
  const { data: userOffering } = useSelector(
    (state: RootState) => state.offerings
  );
  const { data: userSocialLinks, loading: userSocialLinksLoading } =
    useSelector((state: RootState) => state.socialLinks);

  const { subscriptions, loading: subscriptionLoading } = useSelector(
    (state: RootState) => state.subscription
  );
  const [openSubscriptions, setOpenSubscriptions] = useState<number[]>([]);
  const [expandBio, setExpandBio] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  // const [isFollowingUser, setIsFollowingUser] = useState(false);
  const postsPerPage = 6; // Number of posts to show per page
  const [accessToken, setAccessToken] = useState("");
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  // console.log(username)

  // fetch loggedin user
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // fetch user's offerings
  useEffect(() => {
    dispatch(fetchOfferings(userProfile?.id));
  }, [dispatch, userProfile?.id]);
  // fetch user's subscription list
  useEffect(() => {
    if (userProfile) {
      dispatch(fetchSubscriptions(userProfile?.id));
    }
  }, [dispatch, userProfile?.id]);

  // fetch social links
  useEffect(() => {
    if (userProfile) {
      dispatch(fetchSocialLinks(userProfile?.id));
    }
  }, [userProfile]);
  //  fetch profiled user
  const fetchUserByUsername = async (username) => {
    const { data, error } = await supabase
      .from("creators")
      .select("*") // Select all columns, or specify only needed ones
      .eq("username", username) // Filter where username matches
      .single(); // Expect only one userProfile
    if (error) {
      console.error("Error fetching userProfile:", error);

      return null;
    }
    return data;
  };

  // get user

  const getUser = async () => {
    setLoading(true);
    const userData = await fetchUserByUsername(username);
    setUser(userData);
    setLoading(false);
  };
  useEffect(() => {
    getUser();
  }, [username]);

  useEffect(() => {
    const getUserToken = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      setAccessToken(sessionData?.session?.access_token);
      setLoading(false);
    };
    getUserToken();
  }, []);

  // get users following
  useEffect(() => {
    const fetchFollowing = async () => {
      if (loggedInUser?.id === null) {
        console.log("no login");
        return;
      }
      const users = await getFollowingUsers(loggedInUser?.id);
      setFollowing(users);
    };
    fetchFollowing();
  }, [loggedInUser?.id]);
  // console.log(following.length);

  // get followers
  const fetchFollowers = async () => {
    const result = await getFollowers(userProfile?.id);
    setFollowers(result);
  };

  useEffect(() => {
    fetchFollowers();
  }, [userProfile?.id]);
  // console.log(followers);

  // check follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      const following = await isFollowingUser(
        loggedInUser?.id,
        userProfile?.id
      );
      setIsFollowing(following);
    };
    checkFollowStatus();
  }, [userProfile?.id]);

  // console.log(userProfile)
  // console.log("Login user", loggedInUser);
  // console.log("user profile to view", userProfile);

  // Mock data - in a real app this would come from an API
  const creator = {
    id: Number(id) || 1,
    name: "Jenna Studios",
    username: "@jennastudios",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    banner:
      "https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=2070&auto=format&fit=crop",
    bannerText: "Exclusive 4k photos and videos",
    type: "Photographer",
    bio: "Content creator sharing my photography journey! Follow along for tips, tricks, and behind-the-scenes content. I post new photos and videos every week.",
    fullBio:
      "Content creator sharing my photography journey! Follow along for tips, tricks, and behind-the-scenes content. I post new photos and videos every week. Based in California but traveling often for photoshoots and projects. Self-taught photographer with 5+ years of experience.",
    location: "CA",
    stats: {
      followers: "8K",
      photos: "1.5K",
      videos: "370",
    },
    following: false,
    social: [
      {
        type: "twitter",
        url: "https://twitter.com/jennastudios",
        label: "Twitter",
      },
      {
        type: "instagram",
        url: "https://instagram.com/jennastudios",
        label: "Instagram",
      },
      {
        type: "facebook",
        url: "https://facebook.com/jennastudios",
        label: "Facebook",
      },
      {
        type: "youtube",
        url: "https://youtube.com/jennastudios",
        label: "Youtube",
      },
      { type: "website", url: "https://jennastudios.com", label: "Website" },
    ],
    offerings: [
      {
        id: 1,
        title: "Exclusive Photoshoot BTS",
        subtitle: "Behind the scenes footage",
        price: 12.99,
        isLocked: false,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop",
      },
      {
        id: 2,
        title: "April QnA Session Recording",
        subtitle: "Recorded session",
        price: 5.99,
        isLocked: true,
        image:
          "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1974&auto=format&fit=crop",
      },
      {
        id: 3,
        title: "Makeup Tutorial (Premium)",
        subtitle: "Pro tips and tricks",
        price: 8.99,
        isLocked: true,
        image:
          "https://images.unsplash.com/photo-1522333789090-1afc82db536a?q=80&w=2071&auto=format&fit=crop",
      },
      {
        id: 4,
        title: "Lighting Techniques Masterclass",
        subtitle: "Advanced lighting guide",
        price: 15.99,
        isLocked: true,
        image:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1970&auto=format&fit=crop",
      },
    ],
    subscriptions: [
      {
        id: 1,
        title: "Basic Access",
        price: 4.99,
        features: [
          "Access to basic content",
          "Weekly updates",
          "Community access",
        ],
      },
      {
        id: 2,
        title: "Premium Access",
        price: 9.99,
        features: [
          "All basic features",
          "Exclusive tutorials",
          "Direct messaging",
          "1 premium download per month",
        ],
      },
      {
        id: 3,
        title: "VIP Access",
        price: 19.99,
        features: [
          "All premium features",
          "Monthly 1:1 sessions",
          "Early access to new content",
          "Unlimited premium downloads",
        ],
      },
    ],
  };

  // All posts (in a real app, you would fetch only the posts for the current page)
  const allPosts = [
    {
      id: 1,
      title: "Summer Beach Photoshoot",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1974&auto=format&fit=crop",
      likes: 245,
    },
    {
      id: 2,
      title: "Studio Lighting Setup",
      price: 2.99,
      image:
        "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=2071&auto=format&fit=crop",
      likes: 178,
    },
    {
      id: 3,
      title: "Portrait Photography Tips",
      price: 5.99,
      image:
        "https://images.unsplash.com/photo-1616874535244-73aea5daadb9?q=80&w=1964&auto=format&fit=crop",
      likes: 320,
    },
    {
      id: 4,
      title: "Behind the Scenes",
      price: 1.99,
      image:
        "https://images.unsplash.com/photo-1596003906949-67221c37965c?q=80&w=1974&auto=format&fit=crop",
      likes: 189,
    },
    {
      id: 5,
      title: "Landscape Photography Guide",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1970&auto=format&fit=crop",
      likes: 412,
    },
    {
      id: 6,
      title: "Product Photography Essentials",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=1974&auto=format&fit=crop",
      likes: 267,
    },
    {
      id: 7,
      title: "Night Photography Workshop",
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1970&auto=format&fit=crop",
      likes: 356,
    },
    {
      id: 8,
      title: "Color Grading Masterclass",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1484244233201-29892afe6a2c?q=80&w=1974&auto=format&fit=crop",
      likes: 298,
    },
    {
      id: 9,
      title: "Wedding Photography Tips",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1970&auto=format&fit=crop",
      likes: 421,
    },
    {
      id: 10,
      title: "Food Photography Guide",
      price: 3.99,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1970&auto=format&fit=crop",
      likes: 187,
    },
    {
      id: 11,
      title: "Travel Photography Essentials",
      price: 5.99,
      image:
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1931&auto=format&fit=crop",
      likes: 329,
    },
    {
      id: 12,
      title: "Macro Photography Tutorial",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1550176847-3f1e84731f78?q=80&w=1974&auto=format&fit=crop",
      likes: 274,
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  // follow user
  const handleFollow = async (targetUserId: string) => {
    setIsFollowingLoading(true);
    try {
      if (!accessToken) {
        console.error("Access token missing");
        setIsFollowingLoading(false);
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
        // dispatch(fetchUser());
        // getUser()
        await supabase.from("notifications").insert({
          receiver_id: userProfile.id,
          sender_id: loggedInUser.id,
          type: "follow",
          message: `${loggedInUser.user_metadata.fullName} started follwing you.`,
          is_read: false,
        });

        fetchFollowers();
        setIsFollowing(true);
      } else {
        console.error("Follow failed:", data.error);
      }
    } catch (err) {
      console.error("Unexpected follow error:", err);
    } finally {
      setIsFollowingLoading(false);
    }
  };
  // unfollow user
  const handleUnfollow = async (currentUserId, targetUserId) => {
    await unfollowUser(currentUserId, targetUserId);
    setIsFollowing(false);
    getUser();
    fetchFollowers();
  };
  const handleShare = () => {
    navigator.clipboard.writeText(
      `https://privateofferings.app/c/${creator.name
        .toLowerCase()
        .replace(" ", "")}`
    );
    toast({
      title: "Link copied",
      description: "Creator profile link has been copied to clipboard",
    });
  };

  const handleSendTip = () => {
    toast({
      title: "Coming soon",
      description: "The tip feature is coming soon!",
    });
  };

  const toggleSubscription = (id: number) => {
    setOpenSubscriptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSocialIcon = (type: string) => {
    switch (type) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the posts section
    document
      .getElementById("creator-posts")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // setsocial links
  useEffect(() => {
    if (userSocialLinks) {
      const transformed = Object.entries(userSocialLinks)
        .filter(([_, url]) => url)
        .map(([type, url]) => ({
          type,
          url,
          label: type.charAt(0).toUpperCase() + type.slice(1),
        }));

      setSocialLinks(transformed);
    }
  }, [userSocialLinks]);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <span className="flex h-9 w-9 items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
          </span>
        </PaginationItem>
      );
    }

    // Show current page and neighbors
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <span className="flex h-9 w-9 items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
          </span>
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // console.log(user)
  if (loading || loggedInLoading) {
    return <p>Loading</p>;
  }
  if (error || loggedInError) {
    return <p>{error}</p>;
  }
  return (
    <MobileLayout userMode>
      <div className="pb-8 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-2 pt-4 px-2">
          <Link to="/">
            <CreatorButton variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </CreatorButton>
          </Link>
          <div className="flex-1"></div>
        </div>

        {/* Banner Image with text overlay */}
        <div className="relative w-full h-48">
          <img
            src={
              userProfile?.coverimage === "Unknown"
                ? sampleCoverimage
                : userProfile?.coverimage
            }
            alt="Creator Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          {/* Banner text overlay - styled like the reference image */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
            <h1 className="text-3xl font-serif italic">
              {userProfile?.full_name}
            </h1>
          </div>

          {/* Avatar - centered */}
          <div className="z-[999] absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <Avatar className="w-20 h-20 border-2 border-white shadow-md">
              <AvatarImage
                src={userProfile?.profile_image}
                className="object-cover"
              />
              <AvatarFallback>
                {getInitials(userProfile?.full_name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile section with avatar, name, username and follow button */}
        <div className="px-4">
          <div className="flex items-start mt-4">
            {/* Profile avatar */}

            <div className="ml-3 flex-1">
              {/* Name and username */}

              <div>
                <h2 className="font-bold text-lg">{userProfile?.full_name}</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm text-gray-600">
                      @{userProfile?.username}
                    </p>

                    {/* Action Buttons - Now next to username */}
                    {loggedInUser?.id === userProfile?.id ? (
                      <></>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <CreatorButton
                          onClick={
                            () =>
                              isFollowing
                                ? handleUnfollow(
                                    loggedInUser?.id,
                                    userProfile?.id
                                  ) // If following, unfollow
                                : handleFollow(userProfile?.id) // If not following, follow
                          }
                          size="sm"
                          className={cn(
                            "rounded-full h-7 px-2.5",
                            isFollowing
                              ? "bg-white border border-creator text-creator"
                              : ""
                          )}
                        >
                          {isFollowing ? (
                            <>
                              {/* <Check className="h-3 w-3 mr-1" /> */}
                              <span className="text-xs">Following</span>
                            </>
                          ) : (
                            <span className="text-xs">Follow</span>
                          )}
                        </CreatorButton>
                        <CreatorButton
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </CreatorButton>
                        <CreatorButton
                          variant="outline"
                          size="sm"
                          onClick={handleSendTip}
                          className="h-7 w-7 p-0"
                        >
                          <DollarSign className="h-3.5 w-3.5" />
                        </CreatorButton>
                        <CreatorButton
                          variant="outline"
                          size="icon"
                          onClick={handleShare}
                          className="h-7 w-7 p-0"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </CreatorButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row - Tightly packed */}
          <div className="flex space-x-6 mt-4 px-2">
            <div className="text-center">
              <p className="font-semibold">{followers.length}</p>
              <p className="text-xs text-gray-500">
                {followers.length > 1 ? "Followers" : "Follower"}
              </p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{userProfile?.photos || 0}</p>
              <p className="text-xs text-gray-500">Photos</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{userProfile?.videos || 0}</p>
              <p className="text-xs text-gray-500">Videos</p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-4">
            <p className="text-sm whitespace-pre-line">
              {expandBio ? userProfile?.userbio : userProfile?.userbio}
            </p>
            {/* {creator.bio !== creator.fullBio && (
              <button
                onClick={() => setExpandBio(!expandBio)}
                className="text-creator text-sm font-medium mt-1"
              >
                {expandBio ? "Show less" : "Show more"}
              </button>
            )} */}
          </div>

          {/* Social Media Links - Horizontal Scrollable */}

          <div className="grid grid-cols-4 gap-3 pb-2 mt-5">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 whitespace-nowrap"
              >
                {getSocialIcon(social.type)}
                <span className="text-xs font-medium">{social.label}</span>
              </a>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-center mt-2 text-creator-text/70">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{creator.location}</span>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs
          defaultValue="offerings"
          className="w-full animate-slide-up mt-6 px-4"
        >
          <TabsList className="grid grid-cols-2 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="offerings" className="rounded-full">
              Offerings
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-full">
              Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* Offerings Tab */}
          <TabsContent value="offerings">
            {/* Content Offerings Section */}
            <SectionHeading
              title="Content Offerings"
              subtitle="Pay per view content"
              className="mb-2 mt-4"
            />

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              {userOffering.length > 0 ? (
                <CarouselContent>
                  {userOffering.map((offering) => (
                    <CarouselItem key={offering.id} className="basis-3/4">
                      <ContentCard
                        title={offering.title}
                        subtitle={offering.description}
                        price={offering.price}
                        // isLocked={offering.isLocked}
                        // image={offering.image}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              ) : (
                <p className="text-center font-bold">No offerings found</p>
              )}

              <div className="flex justify-center mt-2">
                <CarouselPrevious className="static translate-y-0 h-7 w-7 mr-2" />
                <CarouselNext className="static translate-y-0 h-7 w-7" />
              </div>
            </Carousel>

            {/* Posts Section with Pagination */}
            <div id="creator-posts">
              <SectionHeading
                title="Creator Posts"
                subtitle="Latest updates and content"
                className="mt-6 mb-2"
              />

              <div className="grid grid-cols-2 gap-3 mt-2">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-fade-in"
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-sm line-clamp-1">
                        {post.title}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-creator font-semibold text-sm">
                          ${post.price}
                        </span>
                        <div className="flex items-center text-gray-500">
                          <Heart className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <SectionHeading
              title="Subscription Plans"
              subtitle="Subscribe for regular content"
              className="mb-2 mt-4"
            />

            <div className="space-y-3">
              {subscriptions?.map((subscription, index) => (
                <Collapsible
                  key={subscription.id}
                  open={openSubscriptions.includes(subscription.id)}
                  onOpenChange={() => toggleSubscription(subscription.id)}
                >
                  <Card
                    className={cn(
                      "overflow-hidden",
                      index === 1 ? "relative" : "",
                      openSubscriptions.includes(subscription.id)
                        ? "ring-2 ring-creator ring-opacity-50"
                        : ""
                    )}
                  >
                    {index === 1 && (
                      <div className="absolute top-0 right-0 bg-creator text-white text-xs px-2 py-0.5 rounded-bl-lg">
                        Popular
                      </div>
                    )}
                    <CollapsibleTrigger className="w-full text-left">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-creator-text">
                            {subscription.title}
                          </h3>
                          <p className="text-base font-bold text-creator">
                            ${subscription.price}
                            <span className="text-xs font-normal text-creator-text/70">
                              /month
                            </span>
                          </p>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-creator-text/70 transition-transform",
                            openSubscriptions.includes(subscription.id) &&
                              "transform rotate-180"
                          )}
                        />
                      </CardContent>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-3 px-3 border-t border-gray-100">
                        <p>{subscription.description}</p>

                        <CreatorButton
                          className="w-full mt-3"
                          variant={index === 1 ? "default" : "outline"}
                          size="sm"
                        >
                          Subscribe Now
                        </CreatorButton>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default CreatorProfile;
