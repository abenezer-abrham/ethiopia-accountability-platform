'use client';

import React, { useState } from 'react';
import { Rocket, Zap, Users, Star, Lock, CheckCircle, Plus, X, ChevronDown, ChevronUp, Crown, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { INITIAL_LAUNCHES, Launch, LaunchCategory } from '@/lib/store';
import { getCurrentUser } from '@/lib/user-session';

const BADGE_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ceo_founder:      { label: 'CEO & Founder', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30', icon: <Crown className="w-3 h-3" /> },
  verified_partner: { label: 'Verified Partner', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', icon: <BadgeCheck className="w-3 h-3" /> },
  verified_org:     { label: 'Verified Org', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30', icon: <ShieldCheck className="w-3 h-3" /> },
  verified_admin:   { label: 'Admin', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30', icon: <ShieldCheck className="w-3 h-3" /> },
};

const CATEGORIES: LaunchCategory[] = [
  'SaaS / Web App', 'Mobile App', 'Course / Learning', 'Community',
  'Open Source Tool', 'Content / Newsletter', 'Physical Product', 'Service / Agency', 'Other'
];

function ProgressBar({ value, max }: { value: number; max?: number }) {
  if (!max) return null;
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
      <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function LaunchCard({ launch, onBack }: { launch: Launch; onBack: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [backed, setBacked] = useState(false);
  const [backerCount, setBackerCount] = useState(launch.founding_backers);
  const badgeMeta = BADGE_META[launch.creator_badge];
  const spotsLeft = launch.founding_slots ? launch.founding_slots - backerCount : undefined;
  const isSoldOut = spotsLeft !== undefined && spotsLeft <= 0;

  const handleBack = () => {
    if (backed || isSoldOut) return;
    setBacked(true);
    setBackerCount(c => c + 1);
    onBack(launch.id);
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0 overflow-hidden hover:border-emerald-500/40 transition-all duration-200">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
      <div className="p-5 space-y-4">

        {/* Top row */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
            {launch.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight">{launch.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{launch.tagline}</p>
              </div>
              <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {launch.category}
              </span>
            </div>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-2">
          <Avatar name={launch.creator_name} src={launch.creator_avatar} size="sm" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{launch.creator_name}</span>
            {badgeMeta && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${badgeMeta.color}`}>
                {badgeMeta.icon} {badgeMeta.label}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {launch.description}
          </p>
          <button onClick={() => setExpanded(e => !e)} className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 hover:underline">
            {expanded ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />Read more</>}
          </button>
        </div>

        {/* Founding perks */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Founding Perks</p>
          <div className="space-y-1.5">
            {launch.founding_perks.map((perk, i) => (
              <div key={i} className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-3 py-2 border border-emerald-100 dark:border-emerald-900/50">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{perk.label}</span>
                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {launch.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">#{tag}</span>
          ))}
        </div>

        {/* Progress + CTA */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span><strong className="text-slate-900 dark:text-slate-100">{backerCount}</strong> founding {backerCount === 1 ? 'backer' : 'backers'}</span>
            </div>
            {launch.founding_slots && (
              <span className={`font-semibold text-xs ${spotsLeft! <= 5 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                {isSoldOut ? '🔴 Sold out' : `${spotsLeft} spots left`}
              </span>
            )}
          </div>
          {launch.founding_slots && <ProgressBar value={backerCount} max={launch.founding_slots} />}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div>
              {launch.founding_price ? (
                <div>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{launch.founding_price.toLocaleString()} ETB</span>
                  <span className="text-[10px] text-slate-400 ml-1">one-time</span>
                </div>
              ) : (
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">Free Access</span>
              )}
            </div>
            <Button
              size="sm"
              variant={backed ? 'ghost' : 'primary'}
              onClick={handleBack}
              disabled={backed || isSoldOut}
              leftIcon={backed ? <CheckCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            >
              {backed ? "You're In!" : isSoldOut ? 'Sold Out' : 'Back This Launch'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function LaunchesPage() {
  const user = getCurrentUser();
  const canCreateLaunch = !!(user.verification_badge && user.verification_badge !== 'none');

  const [launches, setLaunches] = useState<Launch[]>(INITIAL_LAUNCHES);
  const [activeCategory, setActiveCategory] = useState<LaunchCategory | 'All'>('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [backedIds, setBackedIds] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', tagline: '', description: '',
    category: 'SaaS / Web App' as LaunchCategory,
    founding_price: '', founding_slots: '',
    perks: [{ label: '', description: '' }],
    tags: '', demo_url: '',
  });

  const filtered = launches.filter(l => activeCategory === 'All' || l.category === activeCategory);

  const handleBack = (id: string) => setBackedIds(ids => [...ids, id]);

  const addPerk = () => setForm(f => ({ ...f, perks: [...f.perks, { label: '', description: '' }] }));
  const removePerk = (i: number) => setForm(f => ({ ...f, perks: f.perks.filter((_, idx) => idx !== i) }));
  const updatePerk = (i: number, field: 'label' | 'description', val: string) =>
    setForm(f => ({ ...f, perks: f.perks.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));

  const handleCreate = () => {
    if (!form.name || !form.tagline || !form.description) return;
    const newLaunch: Launch = {
      id: `launch-${Date.now()}`,
      creator_id: user.id,
      creator_name: user.display_name,
      creator_avatar: user.avatar_url,
      creator_badge: user.verification_badge || 'none',
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      category: form.category,
      demo_url: form.demo_url || undefined,
      founding_perks: form.perks.filter(p => p.label),
      founding_price: form.founding_price ? parseInt(form.founding_price) : undefined,
      founding_slots: form.founding_slots ? parseInt(form.founding_slots) : undefined,
      founding_backers: 0,
      status: 'active',
      launched_at: new Date().toISOString(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    setLaunches(prev => [newLaunch, ...prev]);
    setCreateOpen(false);
    setForm({ name: '', tagline: '', description: '', category: 'SaaS / Web App', founding_price: '', founding_slots: '', perks: [{ label: '', description: '' }], tags: '', demo_url: '' });
  };

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 rounded-2xl p-6 border border-slate-700/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Egna Launches</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">Be Their First.</h1>
              <p className="text-sm text-slate-300 mt-1.5 max-w-md leading-relaxed">
                Verified Egna creators launch here first. Back early, get exclusive founding perks, and help Ethiopian builders land their first real users.
              </p>
            </div>
            {canCreateLaunch ? (
              <Button onClick={() => setCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />} className="shrink-0">
                Launch Something
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50">
                <Lock className="w-3.5 h-3.5" />
                <span>Get verified to launch</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-8 mt-5 pt-4 border-t border-slate-700/40">
            <div>
              <p className="text-xl font-extrabold text-white">{launches.length}</p>
              <p className="text-[10px] text-slate-400 font-medium">Active Launches</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-emerald-400">{launches.reduce((s, l) => s + l.founding_backers, 0)}</p>
              <p className="text-[10px] text-slate-400 font-medium">Total Backers</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">100%</p>
              <p className="text-[10px] text-slate-400 font-medium">Verified Creators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...CATEGORIES] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as LaunchCategory | 'All')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Rocket className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No launches in this category yet.</p>
          {canCreateLaunch && (
            <p className="text-sm mt-1">You could be the first! <button onClick={() => setCreateOpen(true)} className="text-emerald-500 underline">Launch something.</button></p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(launch => (
            <LaunchCard key={launch.id} launch={launch} onBack={handleBack} />
          ))}
        </div>
      )}

      {/* Non-verified CTA */}
      {!canCreateLaunch && (
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm">Want to launch here?</h3>
            <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-0.5">
              Only verified creators and organizations can post launches. Apply for verification and reach your first founding users inside Egna.
            </p>
          </div>
          <a href="/settings/verification">
            <Button size="sm" variant="ghost" className="shrink-0 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">Get Verified →</Button>
          </a>
        </Card>
      )}

      {/* Create Launch Dialog */}
      <Dialog isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Post a Launch">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <p className="text-xs text-slate-500">Your verification badge appears on this launch. Keep it real — this is your reputation in the community.</p>
          <Input label="Product / Project Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. CalisthenicsET" />
          <Input label="Tagline (one sentence)" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Ethiopia's first structured calisthenics coaching platform." />
          <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What is it? Who is it for? Why become a founding user?" rows={4} />
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as LaunchCategory }))} className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Demo / Landing Page URL (optional)" value={form.demo_url} onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))} placeholder="https://..." />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Founding Perks</label>
              <button onClick={addPerk} className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"><Plus className="w-3 h-3" />Add perk</button>
            </div>
            {form.perks.map((perk, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <div className="flex-1 space-y-1.5">
                  <Input placeholder="Perk name (e.g. 🎖️ Lifetime Access)" value={perk.label} onChange={e => updatePerk(i, 'label', e.target.value)} />
                  <Input placeholder="Brief description..." value={perk.description} onChange={e => updatePerk(i, 'description', e.target.value)} />
                </div>
                {form.perks.length > 1 && (
                  <button onClick={() => removePerk(i)} className="text-slate-400 hover:text-red-500 mt-1"><X className="w-4 h-4" /></button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Founding Price (ETB, blank = Free)" value={form.founding_price} onChange={e => setForm(f => ({ ...f, founding_price: e.target.value }))} placeholder="e.g. 500" type="number" />
            <Input label="Max Founding Users (blank = unlimited)" value={form.founding_slots} onChange={e => setForm(f => ({ ...f, founding_slots: e.target.value }))} placeholder="e.g. 100" type="number" />
          </div>
          <Input label="Tags (comma-separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="coding, saas, free" />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setCreateOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} className="flex-1" leftIcon={<Rocket className="w-4 h-4" />} disabled={!form.name || !form.tagline || !form.description}>
              Go Live
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
