'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Flame, CheckCircle2, Trophy, Users, Sparkles } from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { getStoredCheckins, getCurrentUser } from '@/lib/user-session';
import { INITIAL_ROUTINES } from '@/lib/store';

export default function ActivityPage() {
  const [dynamicActivities, setDynamicActivities] = useState<Array<{
    id: string;
    user: string;
    avatar: string;
    action: string;
    detail: string;
    streak?: number;
    time: string;
    type: string;
  }>>([]);

  useEffect(() => {
    const user = getCurrentUser();
    const checkins = getStoredCheckins();

    const userActivities = checkins.map((c) => {
      const routine = INITIAL_ROUTINES.find((r) => r.id === c.routine_id);
      return {
        id: c.id,
        user: user.display_name,
        avatar: user.avatar_url,
        action: 'verified daily routine',
        detail: routine?.title || c.note || 'Verified daily habit routine',
        streak: 3,
        time: c.completed_at ? 'Today' : 'Recently',
        type: 'routine',
      };
    });

    const defaultActivities = [
      {
        id: 'act-1',
        user: 'Abebe Kebede',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        action: 'completed a daily routine',
        detail: '1 Hour Full-Stack Coding & Deep Practice',
        streak: 3,
        time: '2 hours ago',
        type: 'routine'
      },
      {
        id: 'act-2',
        user: 'Meron Tadesse',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        action: 'completed a daily routine',
        detail: 'Forex Trade Journaling & Risk Check',
        streak: 12,
        time: '4 hours ago',
        type: 'routine'
      },
      {
        id: 'act-3',
        user: 'Samuel Alemu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        action: 'joined challenge',
        detail: '10,000 Pushups August Streak',
        time: '6 hours ago',
        type: 'challenge'
      }
    ];

    setDynamicActivities([...userActivities, ...defaultActivities]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Activity className="w-6 h-6 text-emerald-600" />
          <span>Social Activity Stream</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Verified progress and habit milestones from your partners and joined communities.
        </p>
      </div>

      <div className="space-y-4">
        {dynamicActivities.map((act) => (
          <Card key={act.id} className="flex items-start space-x-4 p-4">
            <Avatar name={act.user} src={act.avatar} size="md" />
            <div className="space-y-1 flex-1">
              <p className="text-xs text-slate-800 dark:text-slate-200">
                <span className="font-bold text-slate-900 dark:text-slate-100">{act.user}</span>{' '}
                <span className="text-slate-500">{act.action}</span>{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{act.detail}</span>
              </p>

              <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                <span>{act.time}</span>
                {act.streak && (
                  <span className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>{act.streak}-day streak</span>
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
