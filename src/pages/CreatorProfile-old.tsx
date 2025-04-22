import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import sampleCoverimage from "../assets/images/cover.jpeg";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useSelect,
} from "@chakra-ui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/superbase";
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
  Globe,
  MapPin,
  Image,
  Video,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { fetchUser } from "@/Redux/userSlice";

const CreatorProfileOld = () => {
  const { id } = useParams<{ id: string }>();
  // loggedinuser
  const {
    user: loggedInUser,
    loading: loggedInLoading,
    error: loggedInError,
  } = useSelector((state: RootState) => state.user);

  const { username } = useParams<{ username: string }>();
  const [userProfile, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  
  // console.log(username)
  const { toast } = useToast();
  const [openSubscriptions, setOpenSubscriptions] = useState<number[]>([]);
  const [expandBio, setExpandBio] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Number of posts to show per page

  // Mock data - in a real app this would come from an API
  const creator = {
    id: Number(id) || 1,
    name: "Jenna Studios",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    banner:
      "https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=2070&auto=format&fit=crop",
    type: "Photographer",
    bio: "Thanks for being here babes😘 Follow me while you're here💕 My name is Jenna, I'm a professional photographer who's born & raised in Texas🤠 I love hanging out on F...",
    fullBio:
      "Thanks for being here babes😘 Follow me while you're here💕 My name is Jenna, I'm a professional photographer who's born & raised in Texas🤠 I love hanging out on Facebook and sharing exclusive behind-the-scenes content and premium photo edits.",
    location: "TX",
    stats: {
      likes: "6.3K",
      followers: "12.3K",
      photos: "1.8K",
      videos: "326",
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
        label: "Bluesky",
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
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1974&auto=format&fit=crop",
      },
      {
        id: 4,
        title: "Lighting Techniques Masterclass",
        subtitle: "Advanced lighting guide",
        price: 15.99,
        isLocked: true,
        image:
          "https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=2031&auto=format&fit=crop",
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
    posts: [
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

  // Get crrent posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleFollow = () => {
    
    toast({
      title: creator.following ? "Unfollowed" : "Following",
      description: creator.following
        ? `You have unfollowed ${creator.name}`
        : `You are now following ${creator.name}`,
    });
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

  const dispatch = useDispatch();
  // fetch loggedin user
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // let username = "shubhkmr"
  // fetch the userProfile from supabase
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

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const userData = await fetchUserByUsername(username);
      setUser(userData);
      setLoading(false);
    };

    getUser();
  }, [username]);

  // console.log(userProfile)
  console.log("Login user",loggedInUser)
  console.log("user profile to view",userProfile)





  return (
    <MobileLayout userMode>
      <div className="pb-8 space-y-4 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-2 pt-4">
          <Link to="/">
            <CreatorButton variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </CreatorButton>
          </Link>
          <h1 className="text-xl font-bold text-creator-text">
            {userProfile?.username}
          </h1>
        </div>

        {/* Banner Image with Profile Picture */}
        <div className="relative w-full h-36 rounded-xl -mt-2 border-2 border-white">
          <img
            src={
               userProfile?.coverimage === "Unknown" ? sampleCoverimage : userProfile?.coverimage
            }
            alt="Creator Banner"
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>

          {/* Profile Picture - Positioned at bottom center of banner */}
          <div className="absolute -bottom-11 left-1/2 transform -translate-x-1/2 z-[999]">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={userProfile?.profile_image}
                className="object-cover"
              />
              <AvatarFallback>
                {userProfile?.full_name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-3 pt-8">
          <div className="flex flex-col items-center">
            {/* Name & Profession */}
            {loading ? (
              <>
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-4 w-24 mt-1 rounded-md" />
              </>
            ) : (
              <>
                <h2 className="font-semibold text-lg text-creator-text">
                  {userProfile?.full_name}
                </h2>
                <p className="text-sm text-creator-text/70">
                  @{userProfile?.username}
                </p>
              </>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-4 mt-2 text-sm">
              {[
                { label: "Likes", value: creator.stats.likes },
                { label: "Followers", value: userProfile?.followers.length },
                { label: "Photos", value: creator.stats.photos },
                { label: "Videos", value: creator.stats.videos },
              ].map((item, i) => (
                <div className="text-center" key={i}>
                  <p className="font-semibold">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Bio & Location */}
            <div className="w-full mt-2">
              {loading ? (
                <Skeleton className="h-4 w-3/4 mx-auto rounded-md" />
              ) : (
                <p className="text-sm text-creator-text/90 text-center">
                  {expandBio ? userProfile?.fullUserbio : userProfile?.userbio}
                </p>
              )}

              {!loading &&
                userProfile?.userbio !== userProfile?.fullUserbio && (
                  <button
                    onClick={() => setExpandBio(!expandBio)}
                    className="text-creator text-sm font-medium mt-1 mx-auto block"
                  >
                    {expandBio ? "Show less" : "Show more"}
                  </button>
                )}

              {loading ? (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 mt-1 text-creator-text/70">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-xs">{userProfile?.location}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3 w-full justify-center">
              <CreatorButton
                onClick={handleFollow}
                size="xl"
                className="flex items-center "
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <Heart className="h-3.5 w-3.5" />
                  <span>Follow</span>
                </div>
              </CreatorButton>
              {[Share2, MessageCircle, Send].map((Icon, i) => (
                <CreatorButton
                  key={i}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={
                    i === 0 ? handleShare : i === 2 ? handleSendTip : undefined
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                </CreatorButton>
              ))}
            </div>

            {/* Social Links */}
            {creator.social.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-3 max-w-xs">
                {creator.social.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-gray-100 text-creator-text/80 text-xs px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {getSocialIcon(social.type)}
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="offerings" className="w-full animate-slide-up mt-2">
          <TabsList className="grid grid-cols-2 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="offerings" className="rounded-full">
              Offerings
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-full">
              Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* Offerings Tab */}
          <TabsContent value="offerings" className="mt-3">
            {/* Content Offerings Section */}
            <SectionHeading
              title="Content Offerings"
              subtitle="Pay per view content"
              className="mb-2"
            />

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {creator.offerings.map((offering) => (
                  <CarouselItem key={offering.id} className="basis-3/4">
                    <ContentCard
                      title={offering.title}
                      subtitle={offering.subtitle}
                      price={offering.price}
                      isLocked={offering.isLocked}
                      image={offering.image}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
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
          <TabsContent value="subscriptions" className="mt-3">
            <SectionHeading
              title="Subscription Plans"
              subtitle="Subscribe for regular content"
              className="mb-2"
            />

            <div className="space-y-3">
              {creator.subscriptions.map((subscription, index) => (
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
                        <ul className="space-y-1.5">
                          {subscription.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center text-sm text-creator-text/80"
                            >
                              <span className="mr-2 text-creator">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>

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

export default CreatorProfileOld;
