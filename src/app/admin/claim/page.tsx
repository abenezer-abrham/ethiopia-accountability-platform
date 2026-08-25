'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Key, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { setUserRole } from '@/lib/user-session';

export default function AdminClaimPage() {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [roleAssigned, setRoleAssigned] = useState<'admin' | 'moderator'>('admin');

  const handleClaim = () => {
    const code = inviteCode.trim().toUpperCase();

    if (!code) {
      setError('Please enter an invitation key.');
      return;
    }

    if (code === 'ET-OWNER-2026-ADMIN' || code === 'ET-MOD-2026') {
      const assigned = code.includes('ADMIN') ? 'admin' : 'moderator';
      setError('');
      setRoleAssigned(assigned);
      setUserRole(assigned);
      setSuccess(true);
    } else {
      setError('Invalid or expired Admin Invitation Key. Please request a valid key from the platform owner.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link href="/admin">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Admin
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Key className="w-6 h-6 text-amber-500" />
          <span>Admin & Moderator Key Claim</span>
        </h1>
      </div>

      {/* Explanation Banner */}
      <Card className="bg-slate-900 border-slate-800 p-6 space-y-4">
        <div className="space-y-2">
          <Badge variant="amber">Owner Verification System</Badge>
          <h2 className="text-lg font-bold text-white">How Admin Authorization Works</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            All users (standard members, moderators, and platform admins) log in using standard authentication.
            To elevate a normal user account to an Admin or Moderator, enter the <strong className="text-amber-400">Owner Invitation Key</strong> sent directly by the platform owner.
          </p>
        </div>

        {/* Default Demonstration Key Info */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>Demo Invitation Keys:</span>
            <Badge variant="emerald">Live Sample</Badge>
          </div>
          <p>• Admin Key: <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">ET-OWNER-2026-ADMIN</code></p>
          <p>• Moderator Key: <code className="text-amber-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">ET-MOD-2026</code></p>
        </div>
      </Card>

      {/* Claim Form */}
      <Card className="space-y-4 p-6">
        <Input
          label="Enter Owner Invitation Key"
          placeholder="e.g. ET-OWNER-2026-ADMIN"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          error={error}
          leftIcon={<Lock className="w-4 h-4" />}
        />

        {success ? (
          <div className="p-4 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded-xl text-center text-xs font-bold space-y-2">
            <div className="flex items-center justify-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">Verification Successful!</span>
            </div>
            <p>Your account has been granted <span className="uppercase text-white font-extrabold">{roleAssigned}</span> access in PostgreSQL profiles table.</p>
            <Link href="/admin" className="inline-block pt-2">
              <Button size="sm" variant="primary">Go to Moderation Console</Button>
            </Link>
          </div>
        ) : (
          <Button variant="primary" className="w-full" onClick={handleClaim} leftIcon={<Key className="w-4 h-4" />}>
            Verify Key & Activate Access
          </Button>
        )}
      </Card>
    </div>
  );
}
