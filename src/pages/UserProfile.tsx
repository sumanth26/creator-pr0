import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeading from "@/components/ui/typography/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { getInitials } from "@/lib/getInitalsName";
import {
  ArrowLeft,
  Camera,
  Edit,
  Facebook,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Twitter,
  Youtube,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { fetchUser } from "@/Redux/userSlice";
import CameraImageModal from "@/components/CameraImageModal";
import { uploadProfileImage } from "@/Redux/profileImageSlice";
import CoverImageModal from "@/components/CoverImageUpload";
import { supabase } from "@/lib/superbase";
import { fetchSocialLinks, updateSocialLinks } from "@/Redux/socialLinksSlice";
import { link } from "fs";
import AddOfferingModal from "@/components/AddOfferingModal";
import EditOfferings from "@/components/EditOfferings";

import { fetchOfferings } from "@/Redux/offeringsSlice";
import AddSubscription from "@/components/AddSubscription";
import { fetchSubscriptions } from "@/Redux/subscriptionsSlice";
import { Root } from "react-dom/client";
import EditSubscription from "@/components/EditSubscription";

const UserProfile = () => {
  const [updatingBio, setUpdatingBio] = useState(false);
  const {
    user: userProfile,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);

  const { data: userSocialLinks, loading: userSocialLinksLoading } =
    useSelector((state: RootState) => state.socialLinks);

  const { data: userOfferings, loading: offeringLoading } = useSelector(
    (state: RootState) => state.offerings
  );

  const { subscriptions: userSubscriptions, loading: userSubsLoading } = useSelector(
    (state: RootState) => state.subscription
  );
  const [instaLink, setinstaLink] = useState("");
  const [facebookLink, setfacebookLink] = useState("");
  const [youtubeLink, setyoutubeLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [linkedin, setLinkedIn] = useState("");
  const [otherLink, setOtherLink] = useState("");

  const dispatch = useDispatch();
  // console.log(userOfferings);

  const { toast } = useToast();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [userBio, setUserBio] = useState("");

  // Mock data - in a real app this would come from an API
  const user = {
    name: "Jenna Studios",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "Photographer",
    bannerImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3",
    socialLinks: [
      {
        platform: "Instagram",
        url: "https://instagram.com/jennastudios",
        icon: Instagram,
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/jennastudios",
        icon: Twitter,
      },
      {
        platform: "Facebook",
        url: "https://facebook.com/jennastudios",
        icon: Facebook,
      },
    ],
    offerings: [
      {
        id: 1,
        title: "Exclusive Photoshoot BTS",
        price: 12.99,
        isLocked: false,
      },
      {
        id: 2,
        title: "April QnA Session Recording",
        price: 5.99,
        isLocked: true,
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
    ],
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile?.id) {
      dispatch(fetchSocialLinks(userProfile?.id));
    }
  }, [userProfile]);
  useEffect(() => {
    if (userSocialLinks) {
      setinstaLink(userSocialLinks.instagram || "");
      setfacebookLink(userSocialLinks.facebook || "");
      setyoutubeLink(userSocialLinks.youtube || "");
      setLinkedIn(userSocialLinks.linkedin || "");
      setTwitterLink(userSocialLinks.twitter || "");
      setOtherLink(userSocialLinks.website || "");
    }
  }, [userSocialLinks]);

  // console.log(userSocialLinks)

  useEffect(() => {
    setUserBio(userProfile?.user_metadata.userbio);
    setBio(userProfile?.user_metadata.userbio);
  }, [userProfile]);

  // fetch offering
  useEffect(() => {
    if (userProfile) {
      dispatch(fetchOfferings(userProfile?.id));
    }
  }, [dispatch, userProfile]);

  // fetch subscriptions
  useEffect(() => {
    if (userProfile) {
      dispatch(fetchSubscriptions(userProfile?.id));
    }
  }, [dispatch, userProfile]);

  // console.log(userSubscriptions)

  // console.log(userProfile?.user_metadata.userbio);
  const handleSaveBio = async () => {
    setIsEditingBio(false);
    console.log("Updating Bio for ID:", userProfile?.id); // Debugging check

    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { userbio: bio }, // Update user metadata
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const { error: creatorsError } = await supabase
        .from("creators")
        .update({ userbio: bio })
        .eq("id", userProfile.id); // Update bio in creators table

      if (creatorsError) {
        throw new Error(creatorsError.message);
      }
      toast({
        title: "Updated",
        description: `Bio updated successfully`,
      });
      dispatch(fetchUser());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // console.log(userProfile.id)

  // handle save link
  const handleSaveSocialLinks = () => {
    if (!userProfile?.id) return;
    dispatch(
      updateSocialLinks({
        userId: userProfile.id,
        links: {
          instagram: instaLink,
          twitter: twitterLink,
          facebook: facebookLink,
          linkedin: linkedin,
          youtube: youtubeLink,
          website: otherLink,
        },
      })
    )
      .unwrap()
      .then(() => {
        // console.log("✅ Social links updated successfully");
        toast({
          title: "Social Links Updated",
          description: "Socail media links updated!",
        });
      })
      .catch((error) => {
        console.error("❌ Failed to update social links:", error.message);
      });
  };

  // console.log(userSocialLinks);

  return (
    <MobileLayout>
      <div className="pb-16 animate-fade-in">
        {/* Banner with Profile Picture */}
        <div className="relative">
          {/* Banner Image */}
          <div className="relative h-40 w-full bg-gray-200 overflow-hidden">
            <img
              src={
                userProfile?.user_metadata.coverimage || "./images/cover.jpeg"
              }
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
              // onClick={() => handleImageUpload("banner")}
            >
              <CoverImageModal />
            </button>
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {userLoading ? (
                <SkeletonCircle height={24} w={24} />
              ) : (
                <>
                  <Avatar className="h-24 w-24 border-4 border-white ring-2 ring-creator">
                    <AvatarImage
                      src={userProfile?.user_metadata.profile_image}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getInitials(userProfile?.user_metadata.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md"
                    // onClick={() => handleImageUpload("avatar")}
                  >
                    <CameraImageModal />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information with spacing for the avatar */}
        <div className="mt-14 text-center">
          {userLoading ? (
            <Skeleton />
          ) : (
            <h1 className="text-xl font-bold text-creator-text">
              {userProfile?.user_metadata.fullName}
            </h1>
          )}

          <p className="text-sm text-creator-text/70">
            @{userProfile?.user_metadata.username}
          </p>
        </div>

        {/* Bio Section */}
        <Card className="mt-6 card-glass border-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-creator-text">Bio</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setIsEditingBio(!isEditingBio)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditingBio ? "Cancel" : "Edit"}
              </Button>
            </div>

            {isEditingBio ? (
              <div className="space-y-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-creator"
                />
                <Button size="sm" onClick={handleSaveBio}>
                  Save Bio
                </Button>
              </div>
            ) : (
              <>
                {userLoading ? (
                  <Skeleton />
                ) : (
                  <p className="text-sm text-creator-text/80">
                    {userBio ? userBio : "Add Bio"}
                    {/* {userProfile?.user_metadata.userbio} */}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="offerings" className="w-full mt-6">
          <TabsList className="grid grid-cols-3 w-full bg-white/50 rounded-full p-1">
            <TabsTrigger value="offerings" className="rounded-full">
              Offerings
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-full">
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="social" className="rounded-full">
              Social
            </TabsTrigger>
          </TabsList>

          {/* Offerings Tab */}
          <TabsContent value="offerings" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeading
                title="My Offerings"
                subtitle="Content available for purchase"
              />
              <AddOfferingModal buttonName={"Add New"} />
            </div>
            {offeringLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : userOfferings.length > 0 ? (
              <div className="space-y-3">
                {userOfferings.map((offering) => (
                  <Card
                    key={offering.id}
                    className="card-glass border-none overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-creator-text">
                            {offering.title}
                          </h3>
                          <p className="text-sm">{offering.description}</p>
                          <p className="text-creator font-bold">
                            ₹{offering.price}
                          </p>
                        </div>
                        <EditOfferings offering={offering} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No offerings yet</p>
                <AddOfferingModal buttonName={"Create your first offering"} />
              </div>
            )}
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeading
                title="My Subscription Plans"
                subtitle="Recurring subscription offerings"
              />

              <AddSubscription buttonName={"Add new"} />
            </div>

            {user.subscriptions.length > 0 ? (
              <div className="space-y-4">
                {/* {user.subscriptions.map((subscription) => (
                  <Card
                    key={subscription.id}
                    className="card-glass border-none overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-creator-text">
                          {subscription.title}
                        </h3>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-lg font-bold text-creator">
                        ${subscription.price}
                        <span className="text-sm font-normal text-creator-text/70">
                          /month
                        </span>
                      </p>

                      <ul className="mt-2 space-y-1">
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
                    </CardContent>
                  </Card>
                ))} */}
                 {userSubscriptions.map((subscription) => (
                  <Card
                    key={subscription.id}
                    className="card-glass border-none overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-creator-text">
                            {subscription.title}
                          </h3>
                          <p className="text-sm">{subscription.description}</p>
                          <p className="text-creator font-bold">
                            ₹{subscription.price}
                          </p>
                        </div>
                        <EditSubscription subscription={subscription} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No subscription plans yet</p>
                <AddSubscription buttonName={"Create your first subscription plan"}/>
              </div>
            )}
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="mt-4 space-y-4">
            <SectionHeading
              title="Social Links"
              subtitle="Connect your social media accounts"
            />

            <Card className="card-glass border-none">
              <CardContent className="p-4 space-y-4">
                {/* insta link */}
                <div className="flex items-center space-x-3">
                  <Instagram className="h-5 w-5 text-creator" />
                  <div className="flex-1">
                    <Input
                      placeholder="Insta link"
                      className="text-sm"
                      value={instaLink}
                      onChange={(e) => setinstaLink(e.target.value)}
                    />
                  </div>
                </div>
                {/* facebook */}
                <div className="flex items-center space-x-3">
                  <Facebook className="h-5 w-5 text-creator" />
                  <div className="flex-1">
                    <Input
                      placeholder="Facebook link"
                      className="text-sm"
                      value={facebookLink}
                      onChange={(e) => setfacebookLink(e.target.value)}
                    />
                  </div>
                </div>
                {/* twitter */}
                <div className="flex items-center space-x-3">
                  <FaXTwitter className="h-5 w-5 text-creator" />
                  <div className="flex-1">
                    <Input
                      placeholder="Facebook link"
                      className="text-sm"
                      value={twitterLink}
                      onChange={(e) => setTwitterLink(e.target.value)}
                    />
                  </div>
                </div>
                {/* youtube */}
                <div className="flex items-center space-x-3">
                  <Youtube className="h-5 w-5 text-creator" />
                  <div className="flex-1">
                    <Input
                      placeholder="Youtube link"
                      className="text-sm"
                      value={youtubeLink}
                      onChange={(e) => setyoutubeLink(e.target.value)}
                    />
                  </div>
                </div>
                {/* Linkedin */}
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-creator" />
                  <div className="flex-1">
                    <Input
                      placeholder="Linkedin link"
                      className="text-sm"
                      value={linkedin}
                      onChange={(e) => setLinkedIn(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <LinkIcon className="h-5 w-5 text-creator" />
                  <div className="flex-1">
                    <Input
                      placeholder="Add another link"
                      className="text-sm"
                      value={otherLink}
                      onChange={(e) => setOtherLink(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full mt-2"
                  size="sm"
                  onClick={handleSaveSocialLinks}
                >
                  Save Links
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default UserProfile;
