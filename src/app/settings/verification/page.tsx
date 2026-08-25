'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Sparkles,
  Award,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { getCurrentUser, submitVerificationRequest } from '@/lib/user-session';
import { VerificationRequest } from '@/lib/types';

export default function VerificationRequestPage() {
  const [requestType, setRequestType] = useState<'individual_creator' | 'organization' | 'university_faculty'>('individual_creator');
  const [orgName, setOrgName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();

    const badgeRequested =
      requestType === 'individual_creator'
        ? 'verified_partner'
        : requestType === 'organization'
        ? 'verified_org'
        : 'verified_admin';

    const newRequest: VerificationRequest = {
      id: `ver-${Date.now()}`,
      user_id: user.id,
      user_name: user.display_name,
      username: user.username,
      user_avatar: user.avatar_url,
      type: requestType,
      organization_name: orgName || undefined,
      official_email: officialEmail,
      badge_requested: badgeRequested,
      reason,
      status: 'pending',
      submitted_at: 'Just now',
    };

    submitVerificationRequest(newRequest);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link href="/settings/profile" className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Settings</span>
      </Link>

      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>Apply for Official Verification Badge</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Get recognized as a verified creator, coach, organization, or academic faculty on Egna.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Application Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our executive verification team reviews corporate emails and credentials within 24–48 hours. You will receive an in-app notification once approved.
            </p>
            <Link href="/home" className="inline-block pt-2">
              <Button size="sm" variant="primary">Return to Home</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Verification Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('individual_creator')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    requestType === 'individual_creator'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Award className="w-4 h-4 mb-1 text-blue-500" />
                  <span>Creator / Coach</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('organization')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    requestType === 'organization'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-1 text-amber-500" />
                  <span>Corporate Entity</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('university_faculty')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    requestType === 'university_faculty'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Crown className="w-4 h-4 mb-1 text-emerald-500" />
                  <span>University / Campus</span>
                </button>
              </div>
            </div>

            {requestType !== 'individual_creator' && (
              <Input
                label="Organization / Institute Name"
                placeholder="e.g. Addis Ababa University or Ethio Telecom"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            )}

            <Input
              label="Official Institutional / Corporate Email"
              type="email"
              placeholder="name@organization.et or name@aau.edu.et"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              required
            />

            <Textarea
              label="Why should this profile be verified?"
              placeholder="Provide public links, portfolio, or proof of identity..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
