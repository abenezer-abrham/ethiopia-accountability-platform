'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { User, ShieldCheck, Flame, Target, MessageSquare, UserPlus, UserCheck, Settings, Award, Globe, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import { INITIAL_PROFILES, INITIAL_GOALS, Profile } from '@/lib/store';
import { getCurrentUser, setCurrentUser } from '@/lib/user-session';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [currentUser, setCurrentUserSession] = useState<Profile>(getCurrentUser);

  useEffect(() => {
    setCurrentUserSession(getCurrentUser());
    const sync = () => setCurrentUserSession(getCurrentUser());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const initialProfile =
    username === currentUser.username
      ? currentUser
      : INITIAL_PROFILES.find((p) => p.username === username) || INITIAL_PROFILES[0];

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [following, setFollowing] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(profile.display_name);
  const [editBio, setEditBio] = useState(profile.bio || '');
  const [editLocation, setEditLocation] = useState(profile.location_region || 'Addis Ababa');
  const [editAvatar, setEditAvatar] = useState(profile.avatar_url || '');

  const publicGoals = INITIAL_GOALS.filter((g) => g.user_id === profile.id);

  const isOwner = currentUser.username === profile.username || currentUser.id === profile.id;

  const handleSaveProfile = () => {
    const updated = {
      ...profile,
      display_name: editDisplayName,
      bio: editBio,
      location_region: editLocation,
      avatar_url: editAvatar,
    };
    setProfile(updated);
    if (isOwner) {
      setCurrentUser(updated);
    }
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Banner & Header */}
      <Card className="bg-slate-900 border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar name={profile.display_name} src={profile.avatar_url} size="xl" />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{profile.display_name}</h1>
                <Badge variant="emerald">{profile.reputation_score} pts</Badge>
              </div>
              <p className="text-xs text-slate-400">@{profile.username} • {profile.location_region || 'Ethiopia'}</p>
              <p className="text-xs text-slate-300 max-w-md pt-1">{profile.bio}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isOwner ? (
              <>
                <Button
                  variant={following ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => setFollowing(!following)}
                  leftIcon={following ? <UserCheck className="w-4 h-4 text-emerald-400" /> : <UserPlus className="w-4 h-4" />}
                >
                  {following ? 'Following' : 'Follow'}
                </Button>

                <Link href="/messages">
                  <Button variant="secondary" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                    Message
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)} leftIcon={<Edit3 className="w-4 h-4" />}>
                  Edit Profile
                </Button>
                <Link href="/settings/profile">
                  <Button variant="primary" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
                    Settings
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Grid: Public Goals & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Public Goals & Routines</span>
          </h3>

          <div className="space-y-3">
            {publicGoals.map((goal) => (
              <div key={goal.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{goal.title}</span>
                  <Badge variant="emerald">{goal.category}</Badge>
                </div>
                <ProgressBar value={goal.current_value || 0} max={goal.target_value || 100} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Habit Badges</span>
          </h3>

          <div className="space-y-2.5">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center space-x-3 text-xs">
              <span className="text-lg">🔥</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">10-Day Streak</p>
                <p className="text-[10px] text-slate-400">Completed 10 consecutive daily check-ins</p>
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center space-x-3 text-xs">
              <span className="text-lg">💻</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Open Source Contributor</p>
                <p className="text-[10px] text-slate-400">Verified code submissions</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Dialog isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Profile Details">
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={editDisplayName}
            onChange={(e) => setEditDisplayName(e.target.value)}
          />

          <Input
            label="Region / Location"
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
          />

          <Textarea
            label="Bio / About"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />

          <Input
            label="Avatar Photo URL"
            value={editAvatar}
            onChange={(e) => setEditAvatar(e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
