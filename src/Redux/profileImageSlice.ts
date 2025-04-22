import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/superbase";
import { fetchUser } from "./userSlice";

interface ProfileImageState {
  profileImage: string | null;
  uploading: boolean;
  error: string | null;
}

const initialState: ProfileImageState = {
  profileImage: null,
  uploading: false,
  error: null,
};

// 🚀 Upload Image
export const uploadProfileImage = createAsyncThunk(
  "profileImage/upload",
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}"); // Get user from storage (Adjust as needed)
      if (!user?.id) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${file.name}`;
      const filePath = `profile-pictures/${fileName}`;

      const { data, error } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      // Construct Public URL
      const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/profile-pictures/${fileName}`;

      // Update User Profile
      await supabase.from("creators").update({ profile_image: imageUrl }).eq("id", user.id);
      await supabase.auth.updateUser({ data: { profile_image: imageUrl } });

      // Refresh User Data
      dispatch(fetchUser());

      return imageUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || "Upload failed");
    }
  }
);

// 🚀 Update Image
export const updateProfileImage = createAsyncThunk(
  "profileImage/update",
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) throw new Error("User not authenticated");

      const oldProfileImage = user.user_metadata.profile_image;
      if (oldProfileImage) {
        const oldFileName = oldProfileImage.split("/").pop();
        await supabase.storage.from("profile-pictures").remove([`profile-pictures/${oldFileName}`]);
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${file.name}`;
      const filePath = `profile-pictures/${fileName}`;

      const { data, error } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      // Construct Public URL
      const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/profile-pictures/${fileName}`;

      // Update User Profile
      await supabase.from("creators").update({ profile_image: imageUrl }).eq("id", user.id);
      await supabase.auth.updateUser({ data: { profile_image: imageUrl } });

      dispatch(fetchUser());

      return imageUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

// 🚀 Remove Image
export const removeProfileImage = createAsyncThunk(
  "profileImage/remove",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) throw new Error("User not authenticated");

      const currentProfileImage = user.user_metadata.profile_image;
      if (!currentProfileImage) throw new Error("No image to remove");

      const fileName = currentProfileImage.split("/").pop();
      const { error } = await supabase.storage
        .from("profile-pictures")
        .remove([`profile-pictures/${fileName}`]);

      if (error) throw error;

      await supabase.auth.updateUser({ data: { profile_image: "" } });
      await supabase.from("creators").update({ profile_image: "" }).eq("id", user.id);

      dispatch(fetchUser());

      return "";
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove image");
    }
  }
);

// ✅ Redux Slice
const profileImageSlice = createSlice({
  name: "profileImage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.profileImage = action.payload;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.profileImage = action.payload;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      })
      .addCase(removeProfileImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(removeProfileImage.fulfilled, (state) => {
        state.uploading = false;
        state.profileImage = "";
      })
      .addCase(removeProfileImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileImageSlice.reducer;
