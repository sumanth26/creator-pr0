import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, Search, X } from 'lucide-react';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Discover = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - in a real app this would come from an API
  const creators = [
    { id: 1, name: 'Jenna Studios', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'Photographer', followers: 1245, following: false },
    { id: 2, name: 'Alex Art', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'Digital Artist', followers: 892, following: true },
    { id: 3, name: 'Maya Music', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'Music Producer', followers: 2143, following: false },
    { id: 4, name: 'Emma Dance', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', type: 'Choreographer', followers: 756, following: false },
    { id: 5, name: 'Tom Films', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', type: 'Filmmaker', followers: 1823, following: true },
    { id: 6, name: 'Sarah Crafts', avatar: 'https://randomuser.me/api/portraits/women/56.jpg', type: 'Crafts & DIY', followers: 643, following: false },
    { id: 7, name: 'James Fitness', avatar: 'https://randomuser.me/api/portraits/men/43.jpg', type: 'Fitness Coach', followers: 1398, following: false },
    { id: 8, name: 'Lisa Cooking', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', type: 'Chef', followers: 921, following: false },
  ];

  const categories = ['Photography', 'Art', 'Music', 'Dance', 'Film', 'Crafts', 'Fitness', 'Cooking', 'Fashion'];
  
  const filteredCreators = searchQuery 
    ? creators.filter(creator => 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        creator.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : creators;

  const handleFollow = (creatorId: number) => {
    const creator = creators.find(c => c.id === creatorId);
    if (creator) {
      toast({
        title: creator.following ? "Unfollowed" : "Following",
        description: creator.following 
          ? `You have unfollowed ${creator.name}` 
          : `You are now following ${creator.name}`,
      });
    }
  };

  return (
    <MobileLayout userMode>
      <div className="py-8 space-y-6 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-4">
          <Link to="/user">
            <CreatorButton variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </CreatorButton>
          </Link>
          <h1 className="text-xl font-bold text-creator-text">
            Discover Creators
          </h1>
        </div>

        {/* Search */}
        <div className="relative animate-slide-up">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-creator-text/50" />
          <Input
            type="text"
            placeholder="Search creators or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white pl-10 pr-8 rounded-full focus-visible:ring-creator border-none shadow-sm"
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4 text-creator-text/50" />
            </button>
          )}
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="animate-slide-up animation-delay-100">
            <SectionHeading title="Browse Categories" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant="outline"
                  className="bg-white/80 hover:bg-white cursor-pointer transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Trending Creators */}
        <div className="space-y-3 animate-slide-up animation-delay-200">
          <SectionHeading 
            title={searchQuery ? "Search Results" : "Trending Creators"} 
            subtitle={searchQuery ? `Found ${filteredCreators.length} creators` : "Popular creators to follow"}
          />
          
          <div className="space-y-3">
            {filteredCreators.map((creator, index) => (
              <Card 
                key={creator.id} 
                className={cn(
                  "card-glass overflow-hidden hover:bg-white/95 transition-all duration-200 border-none",
                  "animate-fade-in",
                  index === 0 ? "animation-delay-100" : 
                  index === 1 ? "animation-delay-150" : 
                  index === 2 ? "animation-delay-200" :
                  index === 3 ? "animation-delay-250" : ""
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link to={`/creator/${creator.id}`}>
                          <h3 className="font-medium text-creator-text hover:text-creator transition-colors">{creator.name}</h3>
                        </Link>
                        <CreatorButton 
                          variant={creator.following ? "outline" : "default"}
                          size="sm"
                          className="h-8"
                          onClick={() => handleFollow(creator.id)}
                        >
                          <Heart className="h-3.5 w-3.5" fill={creator.following ? "currentColor" : "none"} />
                          <span className="text-xs">{creator.following ? "Following" : "Follow"}</span>
                        </CreatorButton>
                      </div>
                      <p className="text-xs text-creator-text/70">{creator.type}</p>
                      <p className="text-xs text-creator-text/70 mt-1">{creator.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Discover;
