import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdOutlineDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { Camera } from "lucide-react";
import { RootState, AppDispatch } from "@/Redux/store";
// import {
//   removeProfileImage,
//   updateProfileImage,
//   uploadProfileImage,
// } from "@/Redux/profileImageSlice";
import { getInitials } from "@/lib/getInitalsName";
import { supabase } from "@/lib/superbase";
import { useToast } from "@/hooks/use-toast";
import { fetchUser } from "@/Redux/userSlice";
const supabaseUrl = "https://liqgwtuvtuqoqpjbbxpv.supabase.co";

const CameraImageModal = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  //   const { profileImage, uploading } = useSelector(
  //     (state: RootState) => state.profileImage
  //   );
  const [uploading, setUploading] = useState(false);
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileUpdateRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateClick = () => {
    fileUpdateRef.current?.click();
  };

  // upload the image
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    // console.log("Profile image updated in creators:", updatedCreator);
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

    // console.log("Profile image updated in Auth metadata:", authUpdate);

    // ✅ Update frontend state
    // updateProfileImage(imageUrl);
    dispatch(fetchUser());
    setUploading(false);
  };

  //   update the image
  const handleUpdateFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        toast({
          title: "Error",
          description: uploadError.message,
          variant: "destructive",
        });
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
          toast({
            title: "Error",
            description: deleteError.message,
            variant: "destructive",
          });
          return;
        }
      }

      // Update the new profile image URL in both Supabase Auth and the creators table
      const { error: authError } = await supabase.auth.updateUser({
        data: { profile_image: imageUrl }, // Update user metadata
      });

      if (authError) {
        toast({
          title: "Error",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // Update the creators table with the new image URL
      const { error: creatorsError } = await supabase
        .from("creators")
        .update({ profile_image: imageUrl })
        .eq("id", user.id); // Update profile image in creators table

      if (creatorsError) {
        toast({
          title: "Error",
          description: creatorsError.message,
          variant: "destructive",
        });
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
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile image:", err);
    } finally {
      setUploading(false);
    }
  };


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

  return (
    <Dialog.Root placement={"center"}>
      <Dialog.Trigger asChild>
        <Camera className="h-4 w-4 text-creator cursor-pointer" />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content margin={10}>
            <Dialog.Header />
            <Dialog.Body>
              <div className="flex-col flex justify-center items-center">
                <Avatar className="h-[200px] w-[200px] border-2 text-3xl">
                  <AvatarImage
                    src={user?.user_metadata.profile_image || ""}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {getInitials(user?.user_metadata.fullName)}
                  </AvatarFallback>
                </Avatar>
                {/* File inputs (hidden) */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileUpdateRef}
                  onChange={handleUpdateFileChange}
                  className="hidden"
                />

                {user?.user_metadata.profile_image ? (
                  <div className="flex gap-2 mt-2">
                    {uploading ? (
                      "Please wait..."
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="mt-4 border px-4 py-2 rounded-xl bg-[#f2fce1]"
                          onClick={handleUpdateClick}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="mt-4 border px-4 py-2 rounded-xl bg-[#f2fce1]"
                          onClick={() => dispatch(removeProfileImage())}
                        >
                          <MdOutlineDeleteOutline size={"18px"} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="mt-4 border px-4 py-2 rounded-xl bg-[#f2fce1]"
                    onClick={handleUploadClick}
                  >
                    {uploading ? (
                      "Please Wait..."
                    ) : (
                      <MdOutlineFileUpload size={"20px"} />
                    )}
                  </button>
                )}
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" color={"white"}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CameraImageModal;
