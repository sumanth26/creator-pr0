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

// ✅ Async Thunk for Login (Checks Email Verification)
export const signInCreator = createAsyncThunk(
  "auth/signin",
  async ({ email, password }: any, { rejectWithValue }) => {
    try {
      // 1️⃣ Log in user with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      // 2️⃣ Check if the email is verified
      if (!data.user.email_confirmed_at) {
        throw new Error("Email is not verified. Please check your inbox.");
      }

      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Auth Slice
const signinSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInCreator.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = signinSlice.actions;
export default signinSlice.reducer;
