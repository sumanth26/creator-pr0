import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/superbase";

interface Subscription {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  createdAt?: string;
}

interface SubscriptionsState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionsState = {
  subscriptions: [],
  loading: false,
  error: null,
};

// ✅ Get all subscriptions for a user
export const fetchSubscriptions = createAsyncThunk<Subscription[], string>(
  "subscriptions/fetch",
  async (userId, thunkAPI) => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
);

// ✅ Add a new subscription
export const addSubscription = createAsyncThunk<
  Subscription,
  Omit<Subscription, "id" | "created_at">
>("subscriptions/add", async (newSubscription, thunkAPI) => {
  const { count, error: countError } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", newSubscription.user_id);

  if (countError) throw new Error(countError.message);

  if (count !== null && count >= 8) {
    throw new Error("You can only add up to 8 subscriptions.");
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .insert([newSubscription])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
});

// ✅ Update a subscription
export const updateSubscriptions = createAsyncThunk(
  "subscriptions/update",
  async (
    updated: { id: string; title: string; description: string; price: number },
    { rejectWithValue }
  ) => {
    const { id, ...data } = updated;
    const { error } = await supabase
      .from("subscriptions")
      .update(data)
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return updated;
  }
);

// ✅ Delete a subscription
export const deleteSubscription = createAsyncThunk<string, string>(
  "subscriptions/delete",
  async (id, thunkAPI) => {
    const { error } = await supabase.from("subscriptions").delete().eq("id", id);

    if (error) throw new Error(error.message);
    return id;
  }
);

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.subscriptions.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add subscription";
      })

      // Fetch
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action: PayloadAction<Subscription[]>) => {
        state.subscriptions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch subscriptions";
      })

      // Update
      .addCase(updateSubscriptions.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex((sub) => sub.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = {
            ...state.subscriptions[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateSubscriptions.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteSubscription.fulfilled, (state, action: PayloadAction<string>) => {
        state.subscriptions = state.subscriptions.filter((sub) => sub.id !== action.payload);
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete subscription";
      });
  },
});

export default subscriptionsSlice.reducer;
