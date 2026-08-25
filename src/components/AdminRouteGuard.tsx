'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, ArrowLeft, Key, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { getCurrentUser } from '@/lib/user-session';
import { Profile, UserRole } from '@/lib/types';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ceo_only' | 'admin_or_mod';
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  requiredRole = 'admin_or_mod',
}) => {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const activeUser = getCurrentUser();
    setUser(activeUser);
    setIsChecking(false);

    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isCEO = user?.role === 'ceo_founder';
  const isMod = user?.role === 'moderator';
  const isAdmin = user?.role === 'admin';

  const isAuthorized =
    requiredRole === 'ceo_only'
      ? isCEO
      : isCEO || isMod || isAdmin;

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 animate-fade-in text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-lg">
          {requiredRole === 'ceo_only' ? <Crown className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
        </div>

        <div className="space-y-2">
          <Badge variant="amber" className="text-xs uppercase tracking-wider py-1 px-3">
            {requiredRole === 'ceo_only' ? 'Executive Clearance Required' : '403 • Restricted Administrative Area'}
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {requiredRole === 'ceo_only' ? 'CEO Verification Authority Only' : 'Moderator / Admin Access Required'}
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {requiredRole === 'ceo_only'
              ? 'This executive verification authority is strictly restricted to the platform CEO & Founder clearance level.'
              : 'You are currently signed in as a standard member. Administrative actions, audit inspection, and moderation require elevated privileges.'}
          </p>
        </div>

        <Card className="p-6 bg-slate-900 border-slate-800 text-left space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Current Role: <span className="uppercase text-amber-400">{user?.role || 'Member'}</span></p>
              <p className="text-[11px] text-slate-400">Signed in as {user?.display_name} (@{user?.username})</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/admin/claim" className="flex-1">
              <Button variant="primary" size="sm" className="w-full" leftIcon={<Key className="w-4 h-4" />}>
                Claim Admin / Mod Key
              </Button>
            </Link>
            <Link href="/home" className="flex-1">
              <Button variant="outline" size="sm" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
