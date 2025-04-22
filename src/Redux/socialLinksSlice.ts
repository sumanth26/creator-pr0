import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../lib/superbase';

// Define the shape of the social links
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

// Define the slice state
interface SocialLinksState {
  data: SocialLinks | null;
  loading: boolean;
  error: string | null;
}

const initialState: SocialLinksState = {
  data: null,
  loading: false,
  error: null
};

// Fetch social links from the `creators` table
export const fetchSocialLinks = createAsyncThunk<SocialLinks, string>(
  'socialLinks/fetch',
  async (userId, thunkAPI) => {
    const { data, error } = await supabase
      .from('creators')
      .select('social_links')
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data?.social_links || {};
  }
);

// Update social links in the `creators` table
export const updateSocialLinks = createAsyncThunk<SocialLinks, { userId: string; links: SocialLinks }>(
  'socialLinks/update',
  async ({ userId, links }, thunkAPI) => {
    const { data, error } = await supabase
      .from('creators')
      .update({
        social_links: links
      })
      .eq('id', userId)
      .select('social_links')
      .single();

    if (error) {
      console.error('Update error:', error);
      throw new Error(error.message);
    }

    return data.social_links;
  }
);

const socialLinksSlice = createSlice({
  name: 'socialLinks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialLinks.fulfilled, (state, action: PayloadAction<SocialLinks>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSocialLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch social links.';
      })
      .addCase(updateSocialLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSocialLinks.fulfilled, (state, action: PayloadAction<SocialLinks>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateSocialLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to update social links.';
      });
  }
});

export default socialLinksSlice.reducer;
