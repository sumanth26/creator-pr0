
import React from 'react';
import { Plus, Image, Video, Search, Filter, MoreVertical } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyPosts = () => {
  // Example posts
  const posts = [
    { id: 1, type: 'image', title: 'New Collection Preview', likes: 124, comments: 32, date: '2 days ago' },
    { id: 2, type: 'video', title: 'Behind the Scenes', likes: 89, comments: 15, date: '3 days ago' },
    { id: 3, type: 'image', title: 'Limited Edition Items', likes: 216, comments: 48, date: '5 days ago' },
    { id: 4, type: 'image', title: 'Upcoming Event Announcement', likes: 76, comments: 23, date: '1 week ago' },
    { id: 5, type: 'video', title: 'Tutorial: How to Style', likes: 152, comments: 37, date: '1 week ago' },
  ];

  return (
    <MobileLayout>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Posts</h1>
          <Button className="bg-creator hover:bg-creator-dark rounded-full w-10 h-10 p-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search posts..." />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="all" className="space-y-4 mt-0">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${post.type === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                        {post.type === 'image' ? <Image className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{post.date}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Boost Post</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {post.likes} likes
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {post.comments} comments
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-0">
            {posts.filter(post => post.type === 'image').map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                        <Image className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{post.date}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Boost Post</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {post.likes} likes
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {post.comments} comments
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4 mt-0">
            {posts.filter(post => post.type === 'video').map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-purple-100 text-purple-600">
                        <Video className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{post.date}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Boost Post</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {post.likes} likes
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {post.comments} comments
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default MyPosts;
