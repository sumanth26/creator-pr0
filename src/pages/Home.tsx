
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import ContentCard from '@/components/ui/card/ContentCard';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, MessageCircle, PlusCircle } from 'lucide-react';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { fetchUser } from '@/Redux/userSlice';
import { getFollowingUsers } from '@/lib/FollowersAndFollowings';
import { getInitials } from '@/lib/getInitalsName';

const Home = () => {
  const dispatch = useDispatch()
  const {
    user: loggedInUser,
    loading: loggedInLoading,
    error: loggedInError,
  } = useSelector((state: RootState) => state.user);
  const [following, setFollowing] = useState([]);
  // const [followingLoading,setFollowingLoading] = useState(false)



  // get logged in user
  useEffect(()=>{
     dispatch(fetchUser())
  },[dispatch])
  // get following list
  useEffect(() => {
    const fetchFollowing = async () => {
      if (!loggedInUser?.id) {
        console.log("No logged-in user or user ID");
        return;
      }
      const users = await getFollowingUsers(loggedInUser.id);
      setFollowing(users);
    };
  
    fetchFollowing();
  }, [loggedInUser?.id]);
  console.log(loggedInUser?.id)
    // console.log(following)
  // Mock data - in a real app this would come` from API
  const followedCreators = [
    { id: 1, name: 'Jenna Studios', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'Photography' },
    { id: 2, name: 'Alex Art', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'Digital Artist' },
    { id: 3, name: 'Maya Music', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'Music Producer' },
    { id: 4, name: 'Tom Films', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', type: 'Filmmaker' },
  ];

  const trendingPosts = [
    { 
      id: 1, 
      creator: 'Maya Music', 
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      creatorId: 3,
      content: 'Just dropped my new track! Check it out and let me know what you think!',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWMlMjBzdHVkaW98ZW58MHx8MHx8fDA%3D',
      likes: 245,
      comments: 32,
      time: '2h'
    },
    { 
      id: 2, 
      creator: 'Jenna Studios', 
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      creatorId: 1,
      content: 'Behind the scenes from today\'s photoshoot at the beach.',
      image: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D',
      likes: 432,
      comments: 56,
      time: '4h'
    },
    { 
      id: 3, 
      creator: 'Tom Films', 
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      creatorId: 4,
      content: 'Sneak peek from my upcoming short film. Full release for subscribers next week!',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlsbW1ha2luZ3xlbnwwfHwwfHx8MA%3D%3D',
      likes: 187,
      comments: 24,
      time: '8h'
    }
  ];

  const trendingOfferings = [
    { 
      id: 1, 
      title: 'Music Production Masterclass', 
      price: 14.99, 
      isLocked: true 
    },
    { 
      id: 2, 
      title: 'Photography Lighting Guide', 
      price: 9.99, 
      isLocked: true 
    },
    { 
      id: 3, 
      title: 'Digital Art Essentials', 
      price: 12.99, 
      isLocked: true 
    },
    { 
      id: 4, 
      title: 'Filmmaking Basics', 
      price: 19.99, 
      isLocked: true 
    }
  ];

  return (
    <MobileLayout>
      <div className="pt-4 pb-16 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-creator-text">
            Feed
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-creator"
            asChild
          >
            <Link to="/chat">
              <MessageCircle className="h-6 w-6" />
            </Link>
          </Button>
        </div>

        {/* Followed Creators */}
        <div className="animate-slide-up animation-delay-100">
          <SectionHeading title="Followed Creators" />
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide">
            {following.map((creator) => (
              <Link
                key={creator.id}
                to={`/creator/${creator.username}`}
                className="flex-shrink-0 w-16 flex flex-col items-center"
              >
                <Avatar className="h-14 w-14 border-2 border-creator">
                  <AvatarImage src={creator.profile_image} className='object-cover'/>
                  <AvatarFallback>{getInitials(creator.full_name)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-center mt-1 text-creator-text font-medium line-clamp-1">
                  {creator.full_name.split(' ')[0]}
                </span>
              </Link>
            ))}
            <Link
              to="/following"
              className="flex-shrink-0 w-16 flex flex-col items-center"
            >
              <div className="h-14 w-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <PlusCircle className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-xs text-center mt-1 text-gray-500 font-medium">
                More
              </span>
            </Link>
          </div>
        </div>
        
        {/* Trending Posts */}
        <div className="space-y-4 animate-slide-up animation-delay-200">
          <SectionHeading title="Trending Posts" />
          {trendingPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className={cn(
                "card-glass border-none overflow-hidden",
                index === 0 ? "animation-delay-100" : 
                index === 1 ? "animation-delay-200" : 
                "animation-delay-300"
              )}
            >
              <CardContent className="p-0">
                <div className="p-3 pb-2">
                  <Link to={`/creator/${post.creatorId}`} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.creator.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-creator-text hover:text-creator">
                        {post.creator}
                      </p>
                      <p className="text-xs text-creator-text/70">{post.time} ago</p>
                    </div>
                  </Link>
                  <p className="mt-2 text-sm text-creator-text">
                    {post.content}
                  </p>
                </div>
                {post.image && (
                  <div className="w-full aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={`Post by ${post.creator}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3 pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    asChild
                  >
                    <Link to={`/creator/${post.creatorId}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trending Offerings */}
        <div className="space-y-3 animate-slide-up animation-delay-300">
          <div className="flex items-center justify-between">
            <SectionHeading title="Popular Content" />
            <Button variant="link" size="sm" className="text-creator" asChild>
              <Link to="/following" className="flex items-center">
                View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {trendingOfferings.map((offering, index) => (
              <ContentCard 
                key={offering.id}
                title={offering.title}
                price={offering.price}
                isLocked={offering.isLocked}
                className={cn(
                  index === 0 ? "animation-delay-100" : 
                  index === 1 ? "animation-delay-200" : 
                  "animation-delay-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Home;
