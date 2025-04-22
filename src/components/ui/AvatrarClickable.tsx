import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadProfileImage,
  removeProfileImage,
} from "@/Redux/profileImageSlice";
import { RootState } from "@/Redux/store";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => {
  const dispatch = useDispatch();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const profileImage = useSelector(
    (state: RootState) => state.profileImage.profile_image
  );
  const loading = useSelector((state: RootState) => state.profileImage.loading);

  // ✅ Handle Click to Open File Input
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ Handle Image Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      dispatch(uploadProfileImage(event.target.files[0]));
    }
  };

  return (
    <div className="relative">
      {/* ✅ Avatar Clickable */}
      <AvatarPrimitive.Root
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative flex h-16 w-16 cursor-pointer rounded-full overflow-hidden border-2 border-gray-300",
          className
        )}
        {...props}
      >
        {/* ✅ Profile Image */}
        <AvatarPrimitive.Image
          src={profileImage}
          className="aspect-square h-full w-full object-cover"
        />
        {/* ✅ Fallback for No Image */}
        <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
          ?
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>

      {/* ✅ Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ✅ Remove Button */}
      {profileImage && profileImage !== "https://via.placeholder.com/100" && (
        <button
          onClick={() => dispatch(removeProfileImage())}
          className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
        >
          ✖
        </button>
      )}

      {/* ✅ Loading Indicator */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          Uploading...
        </span>
      )}
    </div>
  );
});

Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
