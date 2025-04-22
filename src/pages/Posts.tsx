
import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import SectionHeading from '@/components/ui/typography/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreatorButton from '@/components/ui/buttons/CreatorButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, X, Edit, Image as ImageIcon, Video as VideoIcon, Trash, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Post {
  id: number;
  title: string;
  price: number;
  content: {
    type: 'image' | 'video';
    urls: string[];
  };
  payPerView: boolean;
  subscriptionIds: number[];
}

interface Subscription {
  id: number;
  title: string;
}

const Posts = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'Behind the scenes photoshoot',
      price: 4.99,
      content: {
        type: 'image',
        urls: ['https://randomuser.me/api/portraits/women/44.jpg']
      },
      payPerView: true,
      subscriptionIds: []
    },
    {
      id: 2,
      title: 'Editing techniques video',
      price: 9.99,
      content: {
        type: 'video',
        urls: ['https://example.com/video.mp4']
      },
      payPerView: false,
      subscriptionIds: [1, 2]
    }
  ]);
  
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState<number | null>(null);
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<number[]>([]);
  const [isPayPerView, setIsPayPerView] = useState(true);
  
  // Mock subscriptions data
  const subscriptions: Subscription[] = [
    { id: 1, title: 'Basic Access' },
    { id: 2, title: 'Premium Access' },
    { id: 3, title: 'VIP Access' }
  ];
  
  // Price options
  const priceOptions = [
    { value: '1.99', label: '$1.99' },
    { value: '2.99', label: '$2.99' },
    { value: '4.99', label: '$4.99' },
    { value: '9.99', label: '$9.99' },
    { value: '14.99', label: '$14.99' },
    { value: '19.99', label: '$19.99' },
  ];
  
  const form = useForm({
    defaultValues: {
      title: '',
      price: '4.99',
    }
  });
  
  const handleAddPost = () => {
    setIsAddingPost(true);
    setContentType('image');
    setSelectedImages([]);
    setSelectedVideo('');
    setSelectedSubscriptions([]);
    setIsPayPerView(true);
    form.reset({
      title: '',
      price: '4.99',
    });
  };
  
  const handleEditPost = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    setIsEditingPost(postId);
    form.reset({
      title: post.title,
      price: post.price.toString(),
    });
    setContentType(post.content.type);
    setIsPayPerView(post.payPerView);
    setSelectedSubscriptions(post.subscriptionIds);
    
    if (post.content.type === 'image') {
      setSelectedImages(post.content.urls);
    } else {
      setSelectedVideo(post.content.urls[0] || '');
    }
  };
  
  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast({
      title: "Post deleted",
      description: "The post has been successfully deleted."
    });
  };
  
  const handleSubmit = form.handleSubmit((data) => {
    if (contentType === 'image' && selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image for your post.",
        variant: "destructive"
      });
      return;
    }
    
    if (contentType === 'video' && !selectedVideo) {
      toast({
        title: "No video selected",
        description: "Please select a video for your post.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isPayPerView && selectedSubscriptions.length === 0) {
      toast({
        title: "No subscription plans selected",
        description: "Please select at least one subscription plan or enable pay-per-view.",
        variant: "destructive"
      });
      return;
    }
    
    const newPost: Post = {
      id: isEditingPost || Date.now(),
      title: data.title,
      price: parseFloat(data.price),
      content: {
        type: contentType,
        urls: contentType === 'image' ? selectedImages : [selectedVideo]
      },
      payPerView: isPayPerView,
      subscriptionIds: selectedSubscriptions
    };
    
    if (isEditingPost) {
      setPosts(posts.map(p => p.id === isEditingPost ? newPost : p));
      setIsEditingPost(null);
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated."
      });
    } else {
      setPosts([newPost, ...posts]);
      setIsAddingPost(false);
      toast({
        title: "Post created",
        description: "Your post has been successfully created."
      });
    }
    
    form.reset({
      title: '',
      price: '4.99',
    });
  });
  
  const handleCancel = () => {
    setIsAddingPost(false);
    setIsEditingPost(null);
    form.reset();
  };
  
  const handleImageSelect = () => {
    // In a real app, this would open a file picker
    // For now, we'll use mock images
    const mockImageUrls = [
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/women/43.jpg',
      'https://randomuser.me/api/portraits/women/42.jpg'
    ];
    
    if (selectedImages.length < 5) {
      setSelectedImages([...selectedImages, mockImageUrls[selectedImages.length % mockImageUrls.length]]);
    } else {
      toast({
        title: "Maximum images reached",
        description: "You can only add up to 5 images per post.",
        variant: "destructive"
      });
    }
  };
  
  const handleVideoSelect = () => {
    // In a real app, this would open a file picker
    // For now, we'll use a mock video URL
    setSelectedVideo('https://example.com/video.mp4');
    toast({
      title: "Video selected",
      description: "Your video has been selected."
    });
  };
  
  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };
  
  const handleRemoveVideo = () => {
    setSelectedVideo('');
  };
  
  const handleSubscriptionToggle = (subscriptionId: number) => {
    if (selectedSubscriptions.includes(subscriptionId)) {
      setSelectedSubscriptions(selectedSubscriptions.filter(id => id !== subscriptionId));
    } else {
      setSelectedSubscriptions([...selectedSubscriptions, subscriptionId]);
    }
  };
  
  return (
    <MobileLayout>
      <div className="py-8 space-y-6 animate-fade-in pb-28">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-creator-text">Posts</h1>
          <CreatorButton 
            onClick={handleAddPost} 
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </CreatorButton>
        </div>
        
        {/* Create/Edit Post Form */}
        {(isAddingPost || isEditingPost !== null) && (
          <Card className="card-glass border-none overflow-hidden animate-slide-up">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-creator-text">
                  {isEditingPost !== null ? 'Edit Post' : 'Create New Post'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Tabs 
                      defaultValue={contentType} 
                      onValueChange={(value) => setContentType(value as 'image' | 'video')}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="image" className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          <span>Images</span>
                        </TabsTrigger>
                        <TabsTrigger value="video" className="flex items-center gap-1">
                          <VideoIcon className="h-4 w-4" />
                          <span>Video</span>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="image" className="space-y-3 mt-3">
                        <div className="flex flex-wrap gap-2">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative w-16 h-16">
                              <img 
                                src={image} 
                                alt={`Selected ${index}`} 
                                className="w-16 h-16 object-cover rounded-md" 
                              />
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          
                          {selectedImages.length < 5 && (
                            <Button 
                              variant="outline" 
                              className="w-16 h-16 flex flex-col items-center justify-center"
                              onClick={handleImageSelect}
                            >
                              <Plus className="h-5 w-5" />
                              <span className="text-xs mt-1">Add</span>
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You can add up to 5 images per post.
                        </p>
                      </TabsContent>
                      
                      <TabsContent value="video" className="space-y-3 mt-3">
                        {selectedVideo ? (
                          <div className="relative rounded-md bg-muted p-3">
                            <div className="flex items-center">
                              <VideoIcon className="h-6 w-6 mr-2 text-creator" />
                              <span className="text-sm truncate flex-1">Video selected</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-destructive"
                                onClick={handleRemoveVideo}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full py-8 flex flex-col items-center justify-center"
                            onClick={handleVideoSelect}
                          >
                            <VideoIcon className="h-8 w-8 mb-2" />
                            <span>Select Video</span>
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground">
                          You can add only one video per post.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a price" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priceOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pay-per-view" 
                          checked={isPayPerView}
                          onCheckedChange={(checked) => setIsPayPerView(!!checked)}
                        />
                        <label
                          htmlFor="pay-per-view"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Pay-per-view
                        </label>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm mb-2">Available with subscriptions:</p>
                        {subscriptions.map(subscription => (
                          <div key={subscription.id} className="flex items-center space-x-2 mt-2">
                            <Checkbox 
                              id={`sub-${subscription.id}`} 
                              checked={selectedSubscriptions.includes(subscription.id)}
                              onCheckedChange={() => handleSubscriptionToggle(subscription.id)}
                              disabled={isPayPerView}
                            />
                            <label
                              htmlFor={`sub-${subscription.id}`}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${isPayPerView ? 'opacity-50' : ''}`}
                            >
                              {subscription.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2 space-x-2">
                    <Button variant="outline" type="button" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditingPost !== null ? 'Update Post' : 'Create Post'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {/* Posts List */}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="card-glass border-none overflow-hidden animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-creator-text">{post.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-creator flex items-center">
                        <DollarSign className="h-3.5 w-3.5 mr-1" />
                        {post.price.toFixed(2)}
                      </span>
                      <CreatorButton 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditPost(post.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </CreatorButton>
                      <CreatorButton 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </CreatorButton>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    {post.content.type === 'image' ? (
                      <div className="flex overflow-x-auto space-x-2 pb-2">
                        {post.content.urls.map((url, index) => (
                          <img 
                            key={index}
                            src={url} 
                            alt={`Post ${index}`} 
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0" 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center bg-muted rounded-md p-2">
                        <VideoIcon className="h-5 w-5 mr-2 text-creator" />
                        <span className="text-sm">Video content</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {post.payPerView && (
                      <span className="text-xs bg-creator/10 text-creator px-2 py-1 rounded-full">
                        Pay-per-view
                      </span>
                    )}
                    {post.subscriptionIds.map(id => {
                      const sub = subscriptions.find(s => s.id === id);
                      return sub ? (
                        <span 
                          key={id} 
                          className="text-xs bg-creator-accent/10 text-creator-accent px-2 py-1 rounded-full"
                        >
                          {sub.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No posts yet. Create your first post!</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Posts;
