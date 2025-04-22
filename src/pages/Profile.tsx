import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Clock,
  CreditCard,
  Heart,
  Image,
  LogOut,
  Package,
  Receipt,
  Settings,
  User,
} from "lucide-react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import SectionHeading from "@/components/ui/typography/SectionHeading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/Redux/logoutslice";
import { AppDispatch, RootState } from "@/Redux/store";
import { createClient } from "@supabase/supabase-js";
import { fetchUser } from "@/Redux/userSlice";
import { supabase } from "@/lib/superbase";
import { uploadProfileImage } from "@/Redux/profileImageSlice";
import { getInitials } from "@/lib/getInitalsName";
import { ProfileImageModal } from "@/components/ProfileImageModal";
import { Description } from "@radix-ui/react-toast";

const supabaseUrl = "https://liqgwtuvtuqoqpjbbxpv.supabase.co";
const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileUpdateRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  // get user details here
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);
  // console.log(user)
  const creatorMenuItems = [
    {
      title: "Analytics",
      path: "/analytics",
      icon: BarChart3,
      description: "View your performance metrics",
    },
    {
      title: "Pending Orders",
      path: "/pending-orders",
      icon: Clock,
      description: "Manage your pending orders",
    },
    {
      title: "Payment Info",
      path: "/payment-info",
      icon: CreditCard,
      description: "Update your payment information",
    },
    {
      title: "Recent Payments",
      path: "/payments",
      icon: Receipt,
      description: "View your payment history",
    },
    {
      title: "Orders",
      path: "/creator-orders",
      icon: Package,
      description: "Manage your customer orders",
    },
    {
      title: "My Posts",
      path: "/my-posts",
      icon: Image,
      description: "Manage your content and posts",
    },
  ];

  const userMenuItems = [
    {
      title: "My Profile",
      path: "/user-profile",
      icon: User,
      description: "Edit your personal information and offerings",
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
      description: "Update your preferences",
    },
    {
      title: "Following",
      path: "/following",
      icon: Heart,
      description: "Manage creators you follow",
    },
  ];

  // console.log(user);

  const profileImage = user?.user_metadata?.profile_image;
  //  handle logout here
  const handleLogout = async () => {
    await dispatch(logoutUser());
    alert("✅ Logged out successfully!");
    navigate("/creator-login"); // Redirect to login page
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const originalFileName = file.name.split(".").slice(0, -1).join(".");
    const fileName = `${user.id}-${originalFileName}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    // Upload image to Supabase Storage
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file, { upsert: true });

    if (error) {
      setUploading(false);
      console.error("Upload error:", error);
      return;
    }

    // Construct Public URL
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/profile-pictures/profile-pictures/${fileName}`;
    console.log("Generated image URL:", imageUrl);

    // ✅ Update profile_image in the creators table
    const { data: updatedCreator, error: updateError } = await supabase
      .from("creators")
      .update({ profile_image: imageUrl })
      .eq("id", user.id)
      .select();

    if (updateError) {
      console.error("Creators table update error:", updateError);
      return;
    }
    console.log("Profile image updated in creators:", updatedCreator);
    toast({
      title: "Image Uploaded",
      description: `Profile image uploaded Successfully`,
    });
    // ✅ Update user_metadata in Supabase Auth
    const { data: authUpdate, error: authError } =
      await supabase.auth.updateUser({
        data: { profile_image: imageUrl },
      });

    if (authError) {
      console.error("Auth metadata update error:", authError);
      return;
    }

    console.log("Profile image updated in Auth metadata:", authUpdate);

    // ✅ Update frontend state
    // updateProfileImage(imageUrl);
    dispatch(fetchUser());
    setUploading(false);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUpdate = () => {
     fileUpdateRef.current?.click()
  }
  // update profile image

  // remove image
  // Function to remove profile image
  const removeProfileImage = async () => {
    setUploading(true);

    try {
      // First, reset the profile image in the auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { profile_image: "" }, // Reset to default
      });

      if (authError) {
        toast({
          title: "Error",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // Extract the file name from the current image URL (to remove the file from storage)
      const currentProfileImage = user.user_metadata.profile_image; // Make sure to get the current profile image URL
      if (currentProfileImage) {
        const fileName = currentProfileImage.split("/").pop(); // Extract the file name from the URL
        const { error: storageError } = await supabase.storage
          .from("profile-pictures")
          .remove([`profile-pictures/${fileName}`]); // Remove the image from storage

        if (storageError) {
          toast({
            title: "Error",
            description: storageError.message,
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Removed",
        description: `Profile image removed Successfully`,
      });

      // Refresh user data
      dispatch(fetchUser());
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
      console.error("Error removing profile image:", err);
    } finally {
      setUploading(false);
    }
  };

  const updateProfileImage = async (event) => {
    setUploading(true);
    try {
      const file = event.target.files[0];
      if (!file) return;
  
      // Extract file extension and original name
      const fileExt = file.name.split(".").pop();
      const originalFileName = file.name.split(".").slice(0, -1).join(".");
      const fileName = `${user.id}-${originalFileName}.${fileExt}`; // Construct the new file name
      const filePath = `profile-pictures/${fileName}`; // Define file path in storage
  
      // Upload the new image to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file, { upsert: true });
  
      if (uploadError) {
        toast({ title: "Error", description: uploadError.message, variant: "destructive" });
        return;
      }
  
      // Construct the public URL of the new image
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/profile-pictures/profile-pictures/${fileName}`;
      console.log("Uploaded image URL:", imageUrl);
  
      // Delete the old profile image from Supabase Storage
      const currentProfileImage = user.user_metadata.profile_image; // Get the current profile image URL from user metadata
      if (currentProfileImage) {
        const oldFileName = currentProfileImage.split("/").pop(); // Extract the old file name from the URL
        const { error: deleteError } = await supabase.storage
          .from("profile-pictures")
          .remove([`profile-pictures/${oldFileName}`]); // Delete the old image
  
        if (deleteError) {
          toast({ title: "Error", description: deleteError.message, variant: "destructive" });
          return;
        }
      }
  
      // Update the new profile image URL in both Supabase Auth and the creators table
      const { error: authError } = await supabase.auth.updateUser({
        data: { profile_image: imageUrl }, // Update user metadata
      });
  
      if (authError) {
        toast({ title: "Error", description: authError.message, variant: "destructive" });
        return;
      }
  
      // Update the creators table with the new image URL
      const { error: creatorsError } = await supabase
        .from("creators")
        .update({ profile_image: imageUrl })
        .eq("id", user.id); // Update profile image in creators table
  
      if (creatorsError) {
        toast({ title: "Error", description: creatorsError.message, variant: "destructive" });
        return;
      }
  
      // Notify user of success
    
      toast({
        title: "Updated",
        description: `Profile image updated Successfully`,
      });
  
      // Refresh user data
      dispatch(fetchUser());
  
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      console.error("Error updating profile image:", err);
    } finally {
      setUploading(false);
    }
  };
  

  // ✅ Handle Image Upload

  const isCreator = true;

  return (
    <MobileLayout>
      <div className="py-4 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-creator-text">Menu</h1>
        </div>

        <Card className="card-glass border-none overflow-hidden animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                {/* <Avatar className="h-14 w-14 border-2 border-white mr-4">
                  <AvatarImage
                    src={
                      user?.user_metadata.profile_image
                    }
                  />
                  <AvatarFallback>
                    {getInitials(user?.user_metadata.fullName)}
                  </AvatarFallback>
                </Avatar> */}
                <ProfileImageModal
                  image={user?.user_metadata.profile_image}
                  name={getInitials(user?.user_metadata.fullName)}
                  handleFileChange={handleFileChange}
                  handleUpload={handleUpload}
                  fileInputRef={fileInputRef}
                  uploading={uploading}
                  setUploading={setUploading}
                  handleRemove={removeProfileImage}
                  // update image
                  fileUpdateRef={fileUpdateRef}
                  handleUpdateFileChange={updateProfileImage}
                  handleUpdate={handleUpdate}

                />
              </div>

              <div>
                <h2 className="font-semibold text-lg text-[#f2fce1]">
                  {user?.user_metadata.fullName}
                </h2>
                <p className="text-sm text-creator-text/80">
                  {isCreator ? "Creator Account" : "User Account"}
                </p>
                <Link to="/settings">
                  <Button variant="link" className="h-6 p-0 text-creator">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 animate-slide-up animation-delay-100">
          <SectionHeading title="Account" />

          <div className="space-y-2">
            {userMenuItems.map((item, index) => (
              <Card
                key={item.path}
                className={cn(
                  "card-glass border-none overflow-hidden",
                  index === 0
                    ? "animation-delay-100"
                    : index === 1
                    ? "animation-delay-200"
                    : "animation-delay-300"
                )}
              >
                <CardContent className="p-0">
                  <Link
                    to={item.path}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 text-creator mr-3" />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-xs text-creator-text/70">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {isCreator && (
          <div className="space-y-2 animate-slide-up animation-delay-200">
            <SectionHeading title="Creator Tools" />

            <div className="space-y-2">
              {creatorMenuItems.map((item, index) => (
                <Card
                  key={item.path}
                  className={cn(
                    "card-glass border-none overflow-hidden",
                    index === 0
                      ? "animation-delay-100"
                      : index === 1
                      ? "animation-delay-150"
                      : index === 2
                      ? "animation-delay-200"
                      : "animation-delay-250"
                  )}
                >
                  <CardContent className="p-0">
                    <Link
                      to={item.path}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 text-creator mr-3" />
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-xs text-creator-text/70">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!isCreator && (
          <div className="mt-4 animate-slide-up animation-delay-300">
            <Link to="/become-creator">
              <Button className="w-full bg-creator hover:bg-creator-dark text-white">
                Become a Creator
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-6 animate-slide-up animation-delay-400">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
