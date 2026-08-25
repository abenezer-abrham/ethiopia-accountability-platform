'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Flame,
  Plus,
  TrendingUp,
  Upload,
  Calendar,
  Sparkles,
  Users,
  EyeOff,
  FileImage
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import {
  INITIAL_GOALS,
  INITIAL_ROUTINES,
  INITIAL_CHECKINS,
  INITIAL_POSTS,
  INITIAL_SQUADS,
  calculateStreak,
  GoalCheckin
} from '@/lib/store';
import { compressImageFile, CompressionResult } from '@/lib/image-compression';
import { validateProofImage, ExifValidationResult } from '@/lib/exif-validator';
import { preScreenProofWithAI, AiScreeningResult } from '@/lib/ai-screening';
import { enqueueCheckin } from '@/lib/offline-queue';
import { ImagePrivacyEditor } from '@/components/ui/ImagePrivacyEditor';
import { ProofAuditSection } from '@/components/ProofAuditSection';
import { DICTIONARY, AppLanguage, getStoredLanguage } from '@/lib/i18n';
import confetti from 'canvas-confetti';
import { getCurrentUser, getStoredCheckins, saveCheckin } from '@/lib/user-session';
import { Profile } from '@/lib/types';

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<AppLanguage>('en');
  const t = DICTIONARY[currentLang] || DICTIONARY.en;
  const [currentUser, setCurrentUser] = useState<Profile>(getCurrentUser);

  useEffect(() => {
    setCurrentLang(getStoredLanguage());
    setCurrentUser(getCurrentUser());
    setCheckins(getStoredCheckins());

    const sync = () => {
      setCurrentUser(getCurrentUser());
      setCheckins(getStoredCheckins());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const [checkins, setCheckins] = useState<GoalCheckin[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<{ goalId: string; routineId: string; title: string; category?: string } | null>(null);
  const [checkinNote, setCheckinNote] = useState('');
  
  // Proof Upload & Verification State
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [exifResult, setExifResult] = useState<ExifValidationResult | null>(null);
  const [aiResult, setAiResult] = useState<AiScreeningResult | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [isFaceBlurred, setIsFaceBlurred] = useState(false);
  const [targetSquadId, setTargetSquadId] = useState('sqd-1');
  const [shareAudience, setShareAudience] = useState<'squad' | 'public' | 'private'>('squad');

  const todayStr = new Date().toISOString().split('T')[0];

  const isCheckedInToday = (routineId: string) => {
    return checkins.some(c => c.routine_id === routineId && c.scheduled_date === todayStr && c.status === 'completed');
  };

  const handleOpenCheckinModal = (goalId: string, routineId: string, title: string) => {
    const goal = INITIAL_GOALS.find(g => g.id === goalId);
    setSelectedRoutine({ goalId, routineId, title, category: goal?.category || 'General' });
    setCheckinNote('');
    setCompressionResult(null);
    setExifResult(null);
    setAiResult(null);
    setIsFaceBlurred(false);
  };

  // Handle Photo Proof Selection & Adaptive Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      // 1. Client-Side Compression to <150 KB
      const compressed = await compressImageFile(file, {
        maxDimension: 1280,
        initialQuality: 0.78,
        targetMaxSizeBytes: 150 * 1024,
      });
      setCompressionResult(compressed);

      // 2. EXIF & Anti-Cheating Analysis
      const exif = await validateProofImage(file);
      setExifResult(exif);

      // 3. Vision AI Pre-Screening
      const ai = await preScreenProofWithAI(
        compressed.dataUrl,
        selectedRoutine?.category || 'General',
        selectedRoutine?.title || 'Habit Routine'
      );
      setAiResult(ai);
    } catch (err) {
      console.error('Photo processing failed:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCompleteCheckin = async () => {
    if (!selectedRoutine) return;

    const newCheckin: GoalCheckin = {
      id: `chk-${Date.now()}`,
      goal_id: selectedRoutine.goalId,
      routine_id: selectedRoutine.routineId,
      user_id: currentUser.id,
      scheduled_date: todayStr,
      completed_at: new Date().toISOString(),
      status: 'completed',
      note: checkinNote || 'Completed daily routine on time.',
      evidence_url: compressionResult?.dataUrl || undefined,
      evidence_size_formatted: compressionResult ? `${compressionResult.compressedSizeFormatted} (${compressionResult.savedPercent}% saved)` : undefined,
      ai_score: aiResult?.confidenceScore,
      privacy_blurred: isFaceBlurred,
      squad_id: shareAudience === 'squad' ? targetSquadId : undefined,
    };

    // Save to persistent storage
    saveCheckin(newCheckin);

    // If offline or data saver, enqueue to IndexedDB
    if (!navigator.onLine) {
      await enqueueCheckin({
        goalId: selectedRoutine.goalId,
        routineId: selectedRoutine.routineId,
        routineTitle: selectedRoutine.title,
        scheduledDate: todayStr,
        note: newCheckin.note,
        evidenceUrl: newCheckin.evidence_url,
        evidenceSizeFormatted: newCheckin.evidence_size_formatted,
        aiScore: newCheckin.ai_score,
        privacyBlurred: isFaceBlurred,
      });
    }

    setCheckins(getStoredCheckins());
    setSelectedRoutine(null);

    // Trigger celebration micro-animation
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t.home.greeting}, {currentUser.display_name.split(' ')[0]}!
            </h1>
            <Badge variant="emerald">{t.home.habitLevel}</Badge>
            <span className="text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-800/40">
              {currentUser.sub_city || 'Addis Ababa'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {t.home.todaySummary}, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}.
          </p>
        </div>

        <Link href="/goals">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            {t.home.newGoal}
          </Button>
        </Link>
      </div>

      {/* Priority 1: TODAY'S ACCOUNTABILITY ROUTINES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.home.priorityRoutines}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Priority 1
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {checkins.filter(c => c.scheduled_date === todayStr).length} of {INITIAL_ROUTINES.length} {t.home.completedOf}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_ROUTINES.map((routine) => {
            const checkedIn = isCheckedInToday(routine.id);
            const streak = calculateStreak(checkins, routine.id);

            return (
              <Card
                key={routine.id}
                className={`transition-all ${
                  checkedIn
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/50'
                    : 'hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 flex-1 pr-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{routine.title}</h3>
                      {checkedIn && <Badge variant="emerald">{t.home.done}</Badge>}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{streak.currentStreak} {t.home.dayStreak}</span>
                      </span>
                      <span>•</span>
                      <span>Target: {routine.target_minutes} mins</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={checkedIn ? 'outline' : 'primary'}
                    disabled={checkedIn}
                    onClick={() => handleOpenCheckinModal(routine.goal_id, routine.id, routine.title)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    {checkedIn ? t.home.done : t.home.checkIn}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Priority 2: GOAL SUMMARY & 5-PERSON MICRO-SQUAD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{t.home.activeGoals}</span>
            </h3>
            <Link href="/goals" className="text-xs text-emerald-600 font-semibold hover:underline">
              {t.home.viewAllGoals}
            </Link>
          </div>

          <div className="space-y-4">
            {INITIAL_GOALS.map((goal) => {
              const currentVal = goal.current_value || 0;
              const targetVal = goal.target_value || 100;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{goal.title}</span>
                    <span className="text-slate-500">
                      {currentVal} / {targetVal} {goal.unit}
                    </span>
                  </div>
                  <ProgressBar value={currentVal} max={targetVal} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* 5-Person Micro-Squad Widget */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>My 5-Person Squad</span>
            </h3>
            <Badge variant="emerald">5/6 Active</Badge>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {INITIAL_SQUADS[0].name}
              </span>
              <span className="text-[10px] text-amber-500 font-bold flex items-center space-x-1">
                <Flame className="w-3 h-3 fill-amber-500" />
                <span>{INITIAL_SQUADS[0].total_squad_streak}d Group Streak</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              {INITIAL_SQUADS[0].focus}
            </p>

            <div className="flex items-center -space-x-2 pt-1">
              <Avatar name="Samuel Alemu" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" size="sm" />
              <Avatar name="Abebe Kebede" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" size="sm" />
              <Avatar name="Meron Tadesse" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" size="sm" />
              <Avatar name="Hiwot Mengistu" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" size="sm" />
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                +1
              </div>
            </div>

            <Link href="/discover" className="block pt-1">
              <Button size="sm" variant="ghost" className="w-full text-xs text-emerald-600 dark:text-emerald-400">
                Squad Chat & Daily Checklist ➔
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Priority 3: INCENTIVIZED PROOF AUDITING SECTION */}
      <ProofAuditSection />

      {/* Priority 4: COMMUNITY ANNOUNCEMENTS & UPDATES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.home.communityUpdates}
          </span>
          <Link href="/discover" className="text-xs text-emerald-600 font-semibold hover:underline">
            {t.home.exploreCommunities}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_POSTS.map((post) => (
            <Card key={post.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar name={post.author?.display_name || 'User'} src={post.author?.avatar_url} size="sm" />
                  <div>
                    <span className="text-xs font-bold block">{post.author?.display_name}</span>
                    <span className="text-[10px] text-slate-400">Python & Next.js Ethiopia • Bole</span>
                  </div>
                </div>
                {post.is_announcement && <Badge variant="amber">Announcement</Badge>}
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{post.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{post.body}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{post.likes_count} likes</span>
                <span>{post.comments_count} comments</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Interactive Check-In & Proof Modal */}
      <Dialog
        isOpen={!!selectedRoutine}
        onClose={() => setSelectedRoutine(null)}
        title={selectedRoutine ? `${t.checkinModal.title}: ${selectedRoutine.title}` : t.checkinModal.title}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t.checkinModal.subtitle}
          </p>

          <Textarea
            label={t.checkinModal.noteLabel}
            placeholder={t.checkinModal.notePlaceholder}
            value={checkinNote}
            onChange={(e) => setCheckinNote(e.target.value)}
          />

          {/* Photo Proof Upload with Real-time Compression */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t.checkinModal.proofUploadLabel}
            </label>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
              {compressionResult ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden max-h-48 border border-slate-200 dark:border-slate-700 mx-auto w-fit">
                    <img
                      src={compressionResult.dataUrl}
                      alt="Compressed proof"
                      className="max-h-48 object-contain"
                    />
                    {isFaceBlurred && (
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Face Blurred</span>
                      </span>
                    )}
                  </div>

                  {/* Real-time Compression & Anti-Fraud Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-left max-w-sm mx-auto">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-500/30 text-emerald-800 dark:text-emerald-200">
                      <p className="font-bold flex items-center space-x-1">
                        <FileImage className="w-3.5 h-3.5" />
                        <span>Compressed: {compressionResult.compressedSizeFormatted}</span>
                      </p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-300">
                        {compressionResult.savedPercent}% bandwidth saved ({compressionResult.originalSizeFormatted} raw)
                      </p>
                    </div>

                    <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-lg border border-blue-500/30 text-blue-800 dark:text-blue-200">
                      <p className="font-bold flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Pre-Screen: {aiResult ? `${Math.round(aiResult.confidenceScore * 100)}%` : 'Checking...'}</span>
                      </p>
                      <p className="text-[10px] text-blue-700 dark:text-blue-300 truncate">
                        {aiResult?.predictedCategory || 'Verified'}
                      </p>
                    </div>
                  </div>

                  {/* Privacy Anonymization Button */}
                  <div className="flex justify-center space-x-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPrivacyModalOpen(true)}
                      leftIcon={<EyeOff className="w-3.5 h-3.5" />}
                    >
                      {t.checkinModal.privacyBlurButton}
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2 block">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                      {isCompressing ? 'Compressing on device...' : t.checkinModal.uploadButton}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Shrinks 5MB camera photos to &lt;150 KB WebP format automatically
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isCompressing}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Visibility / Micro-Squad Audience Selector */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Audience & Micro-Squad Sharing
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShareAudience('squad')}
                className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                  shareAudience === 'squad'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                👥 5-Person Squad
              </button>
              <button
                type="button"
                onClick={() => setShareAudience('public')}
                className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                  shareAudience === 'public'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                🌐 Public Feed
              </button>
              <button
                type="button"
                onClick={() => setShareAudience('private')}
                className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                  shareAudience === 'private'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                🔒 Only Me
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setSelectedRoutine(null)}>
              {t.checkinModal.cancelButton}
            </Button>
            <Button
              variant="primary"
              onClick={handleCompleteCheckin}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {t.checkinModal.confirmButton}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Privacy Anonymization Canvas Modal */}
      {compressionResult && (
        <ImagePrivacyEditor
          isOpen={privacyModalOpen}
          onClose={() => setPrivacyModalOpen(false)}
          imageSrc={compressionResult.dataUrl}
          onSaveBlurredImage={(blurredDataUrl) => {
            setCompressionResult({
              ...compressionResult,
              dataUrl: blurredDataUrl,
            });
            setIsFaceBlurred(true);
          }}
        />
      )}
    </div>
  );
}
