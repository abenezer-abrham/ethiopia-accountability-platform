'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, MessageSquare, Trophy, BookOpen, ShieldCheck, Heart, ThumbsUp, Plus, Send, AlertTriangle, Pin, UserCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { INITIAL_COMMUNITIES, INITIAL_POSTS, INITIAL_CHALLENGES, INITIAL_PROFILES, Post } from '@/lib/store';
import { getCurrentUser } from '@/lib/user-session';

export default function CommunityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const community = INITIAL_COMMUNITIES.find(c => c.slug === slug) || INITIAL_COMMUNITIES[0];

  const [activeTab, setActiveTab] = useState<'posts' | 'challenges' | 'resources' | 'members' | 'moderation'>('posts');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // New Post Dialog
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postMedia, setPostMedia] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);

  // Members Management state
  const [members, setMembers] = useState(INITIAL_PROFILES);

  // Comment Modal state
  const [commentModalPostId, setCommentModalPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, Array<{ author: string; text: string; date: string }>>>({
    'post-1': [
      { author: 'Meron Tadesse', text: 'Excited for this week! I am aiming for 5 consecutive daily study logs.', date: '1 day ago' },
      { author: 'Samuel Alemu', text: 'Count me in for the morning streak checkins!', date: '12 hours ago' }
    ]
  });

  const handleCreatePost = () => {
    if (!postTitle || !postBody) return;
    const user = getCurrentUser();

    const newPost: Post = {
      id: `post-${Date.now()}`,
      community_id: community.id,
      author_id: user.id,
      author: user,
      title: postTitle,
      body: postBody,
      media_url: postMedia || undefined,
      is_announcement: isAnnouncement,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    setCreatePostOpen(false);
    setPostTitle('');
    setPostBody('');
    setIsAnnouncement(false);
  };

  const handleTogglePin = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, is_announcement: !p.is_announcement } : p));
  };

  const handlePromoteMod = (userId: string) => {
    setMembers(members.map(m => m.id === userId ? { ...m, role: 'moderator' } : m));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText) return;
    const list = commentsMap[postId] || [];
    setCommentsMap({
      ...commentsMap,
      [postId]: [...list, { author: 'Abebe Kebede', text: commentText, date: 'Just now' }]
    });
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      <Link href="/discover">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Communities
        </Button>
      </Link>

      {/* Community Hero Card */}
      <Card className="bg-slate-900 border-slate-800 p-6 space-y-4">
        {community.banner_url && (
          <img src={community.banner_url} alt={community.name} className="w-full h-40 object-cover rounded-xl border border-slate-800" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Badge variant="emerald">{community.category}</Badge>
              {community.is_verified && <Badge variant="amber">Verified Community</Badge>}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{community.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">{community.description}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">Joined ({community.member_count})</Button>
            <Button variant="primary" size="sm" onClick={() => setCreatePostOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Create Post
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-t border-slate-800 pt-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'posts', label: 'Posts & Feed', icon: MessageSquare },
            { id: 'challenges', label: 'Challenges', icon: Trophy },
            { id: 'resources', label: 'Resources', icon: BookOpen },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'moderation', label: 'Mod Console', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab 1: Posts & Feed */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {posts.map((post) => {
            const postComments = commentsMap[post.id] || [];
            return (
              <Card key={post.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar name={post.author?.display_name || 'User'} src={post.author?.avatar_url} size="sm" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">{post.author?.display_name}</span>
                      <span className="text-[10px] text-slate-400">@{post.author?.username}</span>
                    </div>
                  </div>
                  {post.is_announcement && <Badge variant="amber">Announcement</Badge>}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{post.title}</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{post.body}</p>

                {post.media_url && (
                  <img src={post.media_url} alt="Post Attachment" className="w-full max-h-80 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center space-x-3 text-slate-500">
                    <button className="flex items-center space-x-1 hover:text-emerald-600 cursor-pointer">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes_count}</span>
                    </button>
                    <button
                      onClick={() => setCommentModalPostId(post.id)}
                      className="flex items-center space-x-1 hover:text-emerald-600 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{postComments.length || post.comments_count} Comments</span>
                    </button>
                  </div>

                  <Link href={`/admin`} className="text-[11px] text-slate-400 hover:text-red-500 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Report</span>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab 2: Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {INITIAL_CHALLENGES.map((chg) => (
            <Card key={chg.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="amber">Active Challenge</Badge>
                <span className="text-xs text-slate-400">{chg.participants_count} Participants</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{chg.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{chg.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Ends: {chg.end_date}</span>
                <Button size="sm" variant="primary">Join Challenge</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Resources */}
      {activeTab === 'resources' && (
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Community Resources & Learning Guidelines</h3>
          <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <li>Community Rules & Accountability Ethics Guidelines</li>
            <li>Recommended Learning Roadmap for Ethiopian Software Engineers</li>
            <li>Daily Standup & Check-in Best Practices</li>
          </ul>
        </Card>
      )}

      {/* Tab 4: Members */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((usr) => (
            <Card key={usr.id} className="flex items-center space-x-3 p-3">
              <Avatar name={usr.display_name} src={usr.avatar_url} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">{usr.display_name}</p>
                <p className="text-[11px] text-slate-400">@{usr.username}</p>
              </div>
              <Badge variant={usr.role === 'admin' ? 'amber' : usr.role === 'moderator' ? 'emerald' : 'slate'}>
                {usr.role}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 5: Community Moderation Console */}
      {activeTab === 'moderation' && (
        <Card className="space-y-6 p-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Community Moderator Console</span>
            </h2>
            <p className="text-xs text-slate-500">Appoint moderators, pin community announcements, and maintain community safety.</p>
          </div>

          <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Posts & Announcements</h3>
            <div className="space-y-2">
              {posts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-bold truncate text-slate-900 dark:text-slate-100">{p.title}</p>
                    <p className="text-[10px] text-slate-400">By {p.author?.display_name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={p.is_announcement ? 'secondary' : 'outline'}
                    onClick={() => handleTogglePin(p.id)}
                    leftIcon={<Pin className="w-3.5 h-3.5" />}
                  >
                    {p.is_announcement ? 'Unpin' : 'Pin Announcement'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Appoint Community Moderators</h3>
            <div className="space-y-2">
              {members.map((usr) => (
                <div key={usr.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                  <div className="flex items-center space-x-3">
                    <Avatar name={usr.display_name} src={usr.avatar_url} size="sm" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{usr.display_name}</p>
                      <p className="text-[10px] text-slate-400">Role: {usr.role}</p>
                    </div>
                  </div>
                  {usr.role === 'user' && (
                    <Button size="sm" variant="outline" onClick={() => handlePromoteMod(usr.id)} leftIcon={<UserCheck className="w-3.5 h-3.5" />}>
                      Promote to Mod
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Create Post Dialog */}
      <Dialog isOpen={createPostOpen} onClose={() => setCreatePostOpen(false)} title="Create Community Post">
        <div className="space-y-4">
          <Input label="Post Title" placeholder="Title..." value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
          <Textarea label="Body Content" placeholder="Share your update or lesson..." value={postBody} onChange={(e) => setPostBody(e.target.value)} />
          <Input label="Image URL (Optional)" placeholder="https://..." value={postMedia} onChange={(e) => setPostMedia(e.target.value)} />
          
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer pt-1">
            <input type="checkbox" checked={isAnnouncement} onChange={(e) => setIsAnnouncement(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-emerald-600" />
            <span>Pin as Official Community Announcement</span>
          </label>

          <div className="flex justify-end space-x-3 pt-3">
            <Button variant="outline" onClick={() => setCreatePostOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreatePost}>Publish Post</Button>
          </div>
        </div>
      </Dialog>

      {/* Comments Drawer / Dialog */}
      <Dialog isOpen={!!commentModalPostId} onClose={() => setCommentModalPostId(null)} title="Post Discussion & Comments">
        <div className="space-y-4">
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {(commentModalPostId ? commentsMap[commentModalPostId] || [] : []).map((c, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{c.author}</span>
                  <span className="text-[10px] text-slate-400">{c.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <Input
              placeholder="Write a supportive comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button variant="primary" onClick={() => commentModalPostId && handleAddComment(commentModalPostId)} leftIcon={<Send className="w-4 h-4" />}>
              Send
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
