import { supabase } from "./superbase";


// get following users
export const getFollowingUsers = async (currentUserId) => {
  // Step 1: Get followed user IDs
  const { data: follows, error: followError } = await supabase
    .from('followers')
    .select('followed_id')
    .eq('follower_id', currentUserId);

  if (followError) {
    console.error('Error fetching following list:', followError);
    return [];
  }

  const followedIds = follows.map((row) => row.followed_id);

  if (followedIds.length === 0) return [];

  // Step 2: Get user profiles (assuming from 'creators' table)
  const { data: followedUsers, error: userFetchError } = await supabase
    .from('creators')
    .select('*')
    .in('id', followedIds);

  if (userFetchError) {
    console.error('Error fetching followed user profiles:', userFetchError);
    return [];
  }

  return followedUsers;
};




// get followers
export const getFollowers = async (userId) => {
    // Step 1: Get all follower IDs
    const { data: followers, error: followerError } = await supabase
      .from('followers')
      .select('follower_id')
      .eq('followed_id', userId);
  
    if (followerError) {
      console.error('Error fetching followers:', followerError);
      return [];
    }
  
    const followerIds = followers.map(row => row.follower_id);
  
    if (followerIds.length === 0) return [];
  
    // Step 2: Fetch profile info of those followers (assuming from 'creators' table)
    const { data: followerProfiles, error: profileError } = await supabase
      .from('creators')
      .select('*')
      .in('id', followerIds);
  
    if (profileError) {
      console.error('Error fetching follower profiles:', profileError);
      return [];
    }
  
    return followerProfiles;
  };
  

//check wheather following the user or not
export const isFollowingUser = async (currentUserId, targetUserId) => {
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', currentUserId)
      .eq('followed_id', targetUserId)
      .maybeSingle(); // returns `null` if not found
    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
    return !!data;
  };
  


  export const unfollowUser = async (currentUserId, targetUserId) => {
    const { error } = await supabase
    .from('followers')
    .delete()
    .eq('follower_id', currentUserId)
    .eq('followed_id', targetUserId);

  if (error) {
    console.error('Failed to unfollow:', error.message);
  }
  };