'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass,
  User,
  BookOpen,
  Dumbbell,
  Code,
  ShieldCheck,
  DollarSign,
  MapPin,
  Clock,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { INITIAL_COMMUNITIES, SubCity, UniversityCampus, ActiveWindow } from '@/lib/store';
import { setCurrentUser } from '@/lib/user-session';

const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Dire Dawa',
  'Oromia (Adama, Bishoftu, Jimma, Shashemene...)',
  'Amhara (Bahir Dar, Gondar, Dessie, Debre Berhan...)',
  'Tigray (Mekelle, Shire, Aksum...)',
  'Sidama (Hawassa, Yirgalem...)',
  'Central Ethiopia (Hossana, Butajira, Welkite...)',
  'South Ethiopia (Arba Minch, Wolaita Sodo, Dilla...)',
  'Southwest Ethiopia (Bonga, Mizan Teferi...)',
  'Somali (Jijiga, Gode...)',
  'Benishangul-Gumuz (Assosa...)',
  'Gambella',
  'Harari (Harar)',
  'Afar (Semera, Awash...)',
  'Diaspora / International',
  'Other / Custom City'
];

const ADDIS_SUBCITIES = [
  'Bole',
  'Kirkos',
  'Yeka',
  'Arada',
  'Gullele',
  'Lideta',
  'Nifas Silk-Lafto',
  'Kolfe Keranio',
  'Akaky Kaliti',
  'Lemi Kura',
  'Addis Ketema',
];

const ALL_CAMPUSES_AND_AFFILIATIONS = [
  'Addis Ababa University (AAU)',
  'Adama Science & Technology University (ASTU)',
  'Addis Ababa Science & Technology University (AASTU)',
  'Jimma University (JU)',
  'Hawassa University (HU)',
  'Bahir Dar University (BDU)',
  'University of Gondar (UoG)',
  'Mekelle University (MU)',
  'Haramaya University',
  'Dire Dawa University',
  'Arba Minch University',
  'Wollo University / Dessie',
  'Debre Berhan University',
  'Debre Markos University',
  'Wolaita Sodo University',
  'Dilla University',
  'Jigjiga University',
  'Semera University',
  'Assosa University',
  'Gambella University',
  'Unity University / Private College',
  'ALX / Tech Bootcamp / Self-Taught',
  'Working Professional / Industry',
  'High School / Secondary Student',
  'Independent / Other',
];

const ACTIVE_WINDOWS: ActiveWindow[] = [
  'Early Bird (5 AM – 8 AM)',
  'Morning Focus (8 AM – 12 PM)',
  'Afternoon Sprint (1 PM – 5 PM)',
  'Evening Wind-down (6 PM – 9 PM)',
  'Night Owl (10 PM – 1 AM)',
];

const INTEREST_OPTIONS = [
  { id: 'prog', name: 'Programming', icon: Code, category: 'Tech' },
  { id: 'fit', name: 'Fitness & Calisthenics', icon: Dumbbell, category: 'Health' },
  { id: 'sec', name: 'Cybersecurity', icon: ShieldCheck, category: 'Tech' },
  { id: 'forex', name: 'Forex & Trading', icon: DollarSign, category: 'Finance' },
  { id: 'bible', name: 'Bible Study', icon: BookOpen, category: 'Personal' },
  { id: 'biz', name: 'Business & Startups', icon: Compass, category: 'Business' },
  { id: 'read', name: 'Reading & Growth', icon: BookOpen, category: 'Personal' },
  { id: 'lang', name: 'Language Learning', icon: BookOpen, category: 'Education' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Addis Ababa');
  const [selectedSubCity, setSelectedSubCity] = useState<string>('Bole');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string>('Addis Ababa University (AAU)');
  const [customCampus, setCustomCampus] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ActiveWindow>('Early Bird (5 AM – 8 AM)');

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Programming', 'Fitness & Calisthenics']);
  const [experienceLevels, setExperienceLevels] = useState<Record<string, string>>({
    'Programming': 'Intermediate',
    'Fitness & Calisthenics': 'Learning'
  });
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(['com-1']);

  const validateUsername = (val: string) => {
    setUsername(val);
    const regex = /^[a-z0-9_]{3,20}$/i;
    if (val.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
    } else if (val.toLowerCase() === 'admin' || val.toLowerCase() === 'mod') {
      setUsernameError('This username is reserved.');
    } else {
      setUsernameError('');
    }
  };

  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      setSelectedInterests(selectedInterests.filter(i => i !== name));
    } else {
      setSelectedInterests([...selectedInterests, name]);
      if (!experienceLevels[name]) {
        setExperienceLevels({ ...experienceLevels, [name]: 'Learning' });
      }
    }
  };

  const handleFinish = () => {
    const finalDisplayName = displayName.trim() || 'New Member';
    const finalUsername = username.trim().toLowerCase() || `user_${Math.floor(1000 + Math.random() * 9000)}`;
    const finalLocation = selectedRegion === 'Other / Custom City' && customLocation
      ? customLocation
      : selectedRegion;
    const finalSubCity = selectedRegion === 'Addis Ababa' ? selectedSubCity : (customLocation || selectedRegion);
    const finalCampus = selectedCampus === 'Independent / Other' && customCampus
      ? customCampus
      : selectedCampus;

    const newProfile = {
      id: `usr-${Date.now()}`,
      username: finalUsername,
      display_name: finalDisplayName,
      email: emailInput || undefined,
      email_verified: false,
      bio: `Practicing ${selectedInterests.join(', ')} in ${finalLocation}.`,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalDisplayName)}`,
      location_region: finalLocation,
      sub_city: finalSubCity,
      university_campus: finalCampus,
      active_window: selectedSchedule,
      trust_tier: 'tier_1_new' as const,
      verification_badge: 'none' as const,
      experience_summary: `${selectedInterests[0] || 'Learning'} Practitioner`,
      role: 'user' as const,
      reputation_score: 50,
      created_at: new Date().toISOString(),
    };

    setCurrentUser(newProfile);
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-xl mb-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-md">
          🇪🇹
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Welcome to Egna (እኛ)</h1>
        <p className="text-xs sm:text-sm text-slate-400">Step {step} of 5 — Nationwide Profile Setup</p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Card Container */}
      <Card className="w-full max-w-xl bg-slate-900 border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Step 1: Profile & Handle */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">What should we call you?</h2>
              <p className="text-xs text-slate-400">Choose your public display name and unique username.</p>
            </div>

            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Abebe Kebede"
            />

            <Input
              label="Username"
              value={username}
              onChange={(e) => validateUsername(e.target.value)}
              error={usernameError}
              placeholder="e.g. abebe_k"
            />

            <Input
              label="Email Address (For Verification & Notifications)"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
            />
          </div>
        )}

        {/* Step 2: Nationwide Location & Schedule Matching */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>Nationwide Region & Schedule Matching</span>
              </h2>
              <p className="text-xs text-slate-400">
                Match with 5-person accountability micro-squads across all Ethiopian regions, campuses, and active time windows.
              </p>
            </div>

            <div className="space-y-3">
              {/* Region Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Region / City / Base
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full rounded-lg border bg-slate-950 text-slate-100 p-2.5 text-xs border-slate-800"
                >
                  {ETHIOPIAN_REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-city if Addis Ababa */}
              {selectedRegion === 'Addis Ababa' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Addis Ababa Sub-City
                  </label>
                  <select
                    value={selectedSubCity}
                    onChange={(e) => setSelectedSubCity(e.target.value)}
                    className="w-full rounded-lg border bg-slate-950 text-slate-100 p-2.5 text-xs border-slate-800"
                  >
                    {ADDIS_SUBCITIES.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Location if other */}
              {selectedRegion === 'Other / Custom City' && (
                <Input
                  label="Specify Your City or Town"
                  placeholder="e.g. Debre Zeit / Bishoftu, Ambo, etc."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                />
              )}

              {/* University / Academic / Professional Affiliation */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  University / Academic / Professional Base (Optional)
                </label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full rounded-lg border bg-slate-950 text-slate-100 p-2.5 text-xs border-slate-800"
                >
                  {ALL_CAMPUSES_AND_AFFILIATIONS.map((cam) => (
                    <option key={cam} value={cam}>
                      {cam}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCampus === 'Independent / Other' && (
                <Input
                  label="Specify Your Institute / Company / Field"
                  placeholder="e.g. Self-Taught Software Engineer, Freelancer"
                  value={customCampus}
                  onChange={(e) => setCustomCampus(e.target.value)}
                />
              )}

              {/* Daily Active Window */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Daily Active Window
                </label>
                <select
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value as ActiveWindow)}
                  className="w-full rounded-lg border bg-slate-950 text-slate-100 p-2.5 text-xs border-slate-800"
                >
                  {ACTIVE_WINDOWS.map((win) => (
                    <option key={win} value={win}>
                      {win}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">Choose your habit routines</h2>
              <p className="text-xs text-slate-400">Select what you are actively practicing daily.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {INTEREST_OPTIONS.map((item) => {
                const selected = selectedInterests.includes(item.name);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleInterest(item.name)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      selected
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span>{item.name}</span>
                    </div>
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Experience Levels */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">Experience Levels</h2>
              <p className="text-xs text-slate-400">Help us match you with peers at your skill level.</p>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {selectedInterests.map((interest) => (
                <div key={interest} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400">{interest}</span>
                  <div className="flex flex-wrap gap-2">
                    {['Beginner', 'Learning', 'Intermediate', 'Advanced', 'Experienced'].map((lvl) => {
                      const active = experienceLevels[interest] === lvl;
                      return (
                        <button
                          key={lvl}
                          onClick={() => setExperienceLevels({ ...experienceLevels, [interest]: lvl })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Matched Local Communities */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">Recommended Micro-Communities</h2>
              <p className="text-xs text-slate-400">
                Matched for {selectedSubCity} and {selectedSchedule}.
              </p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {INITIAL_COMMUNITIES.map((com) => {
                const joined = joinedCommunities.includes(com.id);
                return (
                  <div key={com.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="space-y-1 min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-100 truncate">{com.name}</span>
                        {com.is_verified && <Badge variant="emerald">Verified</Badge>}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{com.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={joined ? 'outline' : 'primary'}
                      onClick={() => {
                        if (joined) setJoinedCommunities(joinedCommunities.filter(c => c !== com.id));
                        else setJoinedCommunities([...joinedCommunities, com.id]);
                      }}
                    >
                      {joined ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button
              variant="primary"
              disabled={step === 1 && (!!usernameError || !displayName || !username)}
              onClick={() => setStep(step + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleFinish} rightIcon={<Sparkles className="w-4 h-4" />}>
              Finish & Go to Command Center
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
