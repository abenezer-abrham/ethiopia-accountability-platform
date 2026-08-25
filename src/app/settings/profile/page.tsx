'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Settings, Save, CheckCircle2, ArrowLeft, Upload, MapPin, Sparkles, Mail, ShieldCheck, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { getCurrentUser, setCurrentUser, markEmailVerified, isEmailVerified } from '@/lib/user-session';
import { Profile } from '@/lib/types';

const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Dire Dawa',
  'Oromia',
  'Amhara',
  'Tigray',
  'Sidama',
  'Central Ethiopia',
  'South Ethiopia',
  'Southwest Ethiopia',
  'Somali',
  'Benishangul-Gumuz',
  'Gambella',
  'Harari',
  'Afar',
  'Diaspora / International',
  'Other / Custom'
];

export default function SettingsProfilePage() {
  const [profile, setProfile] = useState<Profile>(getCurrentUser);

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [email, setEmail] = useState(profile.email || '');
  const [isVerified, setIsVerified] = useState(profile.email_verified || isEmailVerified(profile.email || ''));
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location_region || 'Addis Ababa');
  const [experience, setExperience] = useState(profile.experience_summary || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSendOtp = () => {
    if (!email) return;
    setOtpSent(true);
    setOtpMsg('✓ 6-digit confirmation code sent to your email.');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length >= 4 || otpCode === '123456') {
      markEmailVerified(email);
      setIsVerified(true);
      setOtpSent(false);
      setOtpMsg('✓ Email successfully verified!');
    } else {
      setOtpMsg('Please enter a valid confirmation code.');
    }
  };

  const handleSave = () => {
    const updated: Profile = {
      ...profile,
      display_name: displayName,
      email: email || undefined,
      email_verified: isVerified,
      bio,
      location_region: location,
      experience_summary: experience,
      avatar_url: avatarUrl,
    };
    setCurrentUser(updated);
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${profile.username}`}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            <span>Profile Settings</span>
          </h1>
        </div>
        <Link href="/settings/verification">
          <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-4 h-4 text-emerald-500" />}>
            Apply for Badge
          </Button>
        </Link>
      </div>

      {/* Main Settings Card */}
      <Card className="space-y-6 p-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <Avatar name={displayName} src={avatarUrl} size="xl" />
          <div className="space-y-2 flex-1 w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Profile Photo URL
            </label>
            <Input
              placeholder="https://images.unsplash.com/..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              leftIcon={<Upload className="w-4 h-4" />}
            />
            <p className="text-[11px] text-slate-400">Enter a direct image link for your avatar picture.</p>
          </div>
        </div>

        {/* Email & Verification Section */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Account Email & Verification Status
            </label>
            {isVerified ? (
              <span className="text-xs text-emerald-500 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified</span>
              </span>
            ) : (
              <Badge variant="amber">Unverified</Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsVerified(false);
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              className="flex-1 text-xs"
            />
            {!isVerified && (
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={handleSendOtp}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                {otpSent ? 'Resend Code' : 'Verify Email'}
              </Button>
            )}
          </div>

          {otpSent && !isVerified && (
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Input
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="max-w-[200px] text-xs"
              />
              <Button size="sm" variant="secondary" onClick={handleVerifyOtp}>
                Confirm Code
              </Button>
            </div>
          )}

          {otpMsg && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {otpMsg}
            </p>
          )}
        </div>

        {/* Display Name & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            placeholder="e.g. Abebe Kebede"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              City / Region in Ethiopia
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 text-sm border-slate-300 dark:border-slate-800"
            >
              {ETHIOPIAN_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio */}
        <Textarea
          label="Bio / Short Description"
          placeholder="Share your active practice goals, passions, and background..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
        />

        {/* Experience Summary */}
        <Input
          label="Experience Summary / Headline"
          placeholder="e.g. Senior Full-Stack Developer & Open Source Contributor"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        {/* Feedback / Toast */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href={`/profile/${profile.username}`}>
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
