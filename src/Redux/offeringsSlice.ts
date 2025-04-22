import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../lib/superbase";

export interface Offering {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  created_at?: string;
}

interface OfferingsState {
  data: Offering[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferingsState = {
  data: [],
  loading: false,
  error: null,
};

// ✅ GET offerings by user ID
export const fetchOfferings = createAsyncThunk<Offering[], string>(
  "offerings/fetch",
  async (userId, thunkAPI) => {
    const { data, error } = await supabase
      .from("user_offerings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
);

// ✅ ADD offering
export const addOffering = createAsyncThunk<
  Offering,
  Omit<Offering, "id" | "created_at">
>("offerings/add", async (newOffering, thunkAPI) => {
  // ✅ Count existing offerings for the user
  const { count, error: countError } = await supabase
    .from("user_offerings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", newOffering.user_id);

  if (countError) {
    throw new Error(countError.message);
  }

  if (count !== null && count >= 8) {
    throw new Error("You can only add up to 8 offerings.");
  }

  // ✅ Proceed to insert if under limit
  const { data, error } = await supabase
    .from("user_offerings")
    .insert([newOffering])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
});

// ✅ UPDATE offering
export const updateOffering = createAsyncThunk(
  "offerings/updateOffering",
  async (updated: { id: string; title: string; description: string; price: number }, { rejectWithValue }) => {
    const { id, ...data } = updated;
    const { error } = await supabase
      .from("user_offerings")
      .update(data)
      .eq("id", id);

    if (error) return rejectWithValue(error.message);
    return updated;
  }
);

// ✅ DELETE offering
export const deleteOffering = createAsyncThunk<string, string>(
  "offerings/delete",
  async (id, thunkAPI) => {
    const { error } = await supabase
      .from("user_offerings")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return id;
  }
);

const offeringsSlice = createSlice({
  name: "offerings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchOfferings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOfferings.fulfilled,
        (state, action: PayloadAction<Offering[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchOfferings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch offerings";
      })

      // Add
      .addCase(
        addOffering.fulfilled,
        (state, action: PayloadAction<Offering>) => {
          state.data.unshift(action.payload);
        }
      )

      // Update
      .addCase(
        updateOffering.fulfilled,
        (state, action: PayloadAction<Offering>) => {
          const index = state.data.findIndex((o) => o.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        }
      )

      // Delete
      .addCase(
        deleteOffering.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter((o) => o.id !== action.payload);
        }
      );
  },
});

export default offeringsSlice.reducer;
