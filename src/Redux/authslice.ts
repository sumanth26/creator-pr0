import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://liqgwtuvtuqoqpjbbxpv.supabase.co",
  import.meta.env.VITE_SUPABASE_KEY
);

// Define Auth State
interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async Thunk for Signup (Includes Inserting Data into `creators` Table)
export const signUpCreator = createAsyncThunk(
  "auth/signup",
  async ({ email, password, fullName, username, mobile }: any, { rejectWithValue }) => {
    try {
      // 1️⃣ Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        phone:mobile,
        options: {
          data: { fullName, username, mobile, profile_image: "" },
        },
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("User ID not found");

      // 2️⃣ Store additional user data in `creators` table
      const { error: dbError } = await supabase.from("creators").insert([
        {
          id: userId, // Use the same ID as Supabase Auth
          email,
          username,
          full_name: fullName,
          mobile, // Save as "mobile"
          profile_image: "",
        },
      ]);

      if (dbError) throw dbError;

      return authData.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpCreator.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
