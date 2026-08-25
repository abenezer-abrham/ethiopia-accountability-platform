export * from './types';
import { Profile, Community, Post, Goal, Routine, GoalCheckin, Challenge, Report, Squad, VerificationRequest } from './types';

// Default mock Ethiopian users with Sub-city, Verification Badges, and Trust Tier attributes
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-ceo',
    username: 'abenezer',
    display_name: 'Abenezer Abrham',
    email: 'abenezerabrham61@gmail.com',
    email_verified: true,
    bio: 'Platform Founder & Software Engineer building Egna for Ethiopia.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location_region: 'Addis Ababa',
    sub_city: 'Bole',
    university_campus: 'AAU (Addis Ababa University)',
    active_window: 'Early Bird (5 AM – 8 AM)',
    trust_tier: 'tier_3_leader',
    verification_badge: 'ceo_founder',
    experience_summary: 'Platform Founder & CEO',
    role: 'ceo_founder',
    reputation_score: 2500,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: 'usr-2',
    username: 'meron_t',
    display_name: 'Meron Tadesse',
    bio: 'Forex trader & accounting enthusiast. Focus on risk management.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    location_region: 'Bahr Dar',
    university_campus: 'Bahir Dar University',
    active_window: 'Morning Focus (8 AM – 12 PM)',
    trust_tier: 'tier_2_verified',
    verification_badge: 'verified_admin',
    experience_summary: 'Trust & Safety Moderator',
    role: 'moderator',
    reputation_score: 480,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'usr-3',
    username: 'samuel_b',
    display_name: 'Samuel Alemu',
    bio: 'Calisthenics & fitness athlete. 5am workout routine.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location_region: 'Hawassa',
    university_campus: 'Hawassa University',
    active_window: 'Early Bird (5 AM – 8 AM)',
    trust_tier: 'tier_2_verified',
    verification_badge: 'verified_partner',
    experience_summary: 'Calisthenics Coach',
    role: 'user',
    reputation_score: 310,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: 'usr-4',
    username: 'hiwot_m',
    display_name: 'Hiwot Mengistu',
    bio: 'Cybersecurity learner & Bible study leader in Kirkos.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    location_region: 'Addis Ababa',
    sub_city: 'Kirkos',
    university_campus: 'ASTU (Adama Science & Tech)',
    active_window: 'Night Owl (10 PM – 1 AM)',
    trust_tier: 'tier_2_verified',
    verification_badge: 'none',
    experience_summary: 'Security Enthusiast',
    role: 'user',
    reputation_score: 150,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  }
];

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'vr-1',
    user_id: 'usr-3',
    user_name: 'Samuel Alemu',
    username: 'samuel_b',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    type: 'individual_creator',
    reason: 'Ethiopian Calisthenics community coach with 500+ active athletes across Hawassa & Addis Ababa.',
    status: 'approved',
    badge_requested: 'verified_partner',
    submitted_at: '2 days ago',
    reviewed_at: '1 day ago',
    reviewed_by: 'Abebe Kebede (CEO)'
  },
  {
    id: 'vr-2',
    user_id: 'usr-4',
    user_name: 'Hiwot Mengistu',
    username: 'hiwot_m',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    type: 'university_faculty',
    organization_name: 'ASTU Cybersecurity Club',
    official_email: 'hiwot.m@astu.edu.et',
    reason: 'Official faculty club lead organizing campus CTF challenges and study accountability circles.',
    status: 'pending',
    badge_requested: 'verified_org',
    submitted_at: '3 hours ago'
  }
];

export const INITIAL_COMMUNITIES: Community[] = [

  {
    id: 'com-1',
    name: 'Python & Next.js Ethiopia',
    slug: 'python-nextjs-ethiopia',
    description: 'Community of Ethiopian developers practicing full-stack web engineering & accountability.',
    category: 'Programming',
    sub_city: 'Bole',
    university_campus: 'AAU (Addis Ababa University)',
    banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    is_verified: true,
    is_private: false,
    creator_id: 'usr-1',
    member_count: 342,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'com-2',
    name: 'Ethiopia Calisthenics & Fitness',
    slug: 'ethiopia-fitness',
    description: 'Daily bodyweight workouts, nutrition tips, and streak check-ins across Ethiopian cities.',
    category: 'Fitness',
    sub_city: 'Kirkos',
    banner_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    is_verified: true,
    is_private: false,
    creator_id: 'usr-3',
    member_count: 512,
    created_at: new Date(Date.now() - 80 * 86400000).toISOString()
  },
  {
    id: 'com-3',
    name: 'Forex Journaling & Risk ET',
    slug: 'forex-journaling-et',
    description: 'Strict trade logging, risk management rules, and educational accountability. No fake hype.',
    category: 'Forex',
    banner_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    is_verified: false,
    is_private: false,
    creator_id: 'usr-2',
    member_count: 218,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'com-4',
    name: 'Addis Tech Founders & Innovators',
    slug: 'addis-tech-founders',
    description: 'Building sustainable products for local and global problems from Ethiopia.',
    category: 'Business',
    sub_city: 'Yeka',
    banner_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    is_verified: true,
    is_private: false,
    creator_id: 'usr-1',
    member_count: 189,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

// Initial 5-8 Person Micro-Squads
export const INITIAL_SQUADS: Squad[] = [
  {
    id: 'sqd-1',
    name: 'Bole 5 AM Calisthenics Circle',
    slug: 'bole-5am-calisthenics',
    category: 'Fitness',
    focus: 'Daily 5:15 AM bodyweight workout & streak check-ins',
    max_members: 6,
    current_members_count: 5,
    sub_city: 'Bole',
    active_window: 'Early Bird (5 AM – 8 AM)',
    leader_id: 'usr-3',
    leader_name: 'Samuel Alemu',
    leader_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    total_squad_streak: 28,
    is_private: false,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'sqd-2',
    name: 'AAU 4-Kilo Night Coders',
    slug: 'aau-4kilo-night-coders',
    category: 'Programming',
    focus: 'Nightly 10 PM Next.js & Rust problem solving group',
    max_members: 5,
    current_members_count: 4,
    sub_city: 'Arada',
    university_campus: 'AAU (Addis Ababa University)',
    active_window: 'Night Owl (10 PM – 1 AM)',
    leader_id: 'usr-1',
    leader_name: 'Abebe Kebede',
    leader_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    total_squad_streak: 42,
    is_private: false,
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'sqd-3',
    name: 'Kirkos Cybersecurity & Network Study',
    slug: 'kirkos-cybersec-study',
    category: 'Education',
    focus: 'CCNA & Linux certification accountability',
    max_members: 6,
    current_members_count: 3,
    sub_city: 'Kirkos',
    active_window: 'Evening Wind-down (6 PM – 9 PM)',
    leader_id: 'usr-4',
    leader_name: 'Hiwot Mengistu',
    leader_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    total_squad_streak: 15,
    is_private: false,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    user_id: 'usr-1',
    title: 'Master Next.js 15 & Supabase Architecture',
    description: 'Build production-ready applications with robust typescript and server actions.',
    category: 'Programming',
    start_date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    status: 'active',
    visibility: 'public',
    target_value: 60,
    current_value: 24,
    unit: 'hours studied',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'goal-2',
    user_id: 'usr-1',
    title: '5am Morning Calisthenics Routine',
    description: 'Build chest, core strength and daily habit discipline.',
    category: 'Fitness',
    start_date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    target_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    status: 'active',
    visibility: 'public',
    target_value: 30,
    current_value: 16,
    unit: 'days completed',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'rout-1',
    goal_id: 'goal-1',
    user_id: 'usr-1',
    title: '1 Hour Full-Stack Coding & Deep Practice',
    frequency: 'daily',
    target_minutes: 60,
    created_at: new Date().toISOString()
  },
  {
    id: 'rout-2',
    goal_id: 'goal-2',
    user_id: 'usr-1',
    title: 'Morning Push-ups & Core Workout',
    frequency: 'daily',
    target_minutes: 30,
    created_at: new Date().toISOString()
  }
];

const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgoStr = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

export const INITIAL_CHECKINS: GoalCheckin[] = [
  {
    id: 'chk-1',
    goal_id: 'goal-1',
    routine_id: 'rout-1',
    user_id: 'usr-1',
    scheduled_date: yesterdayStr,
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    note: 'Completed database migration module and Supabase RLS security policies.',
    evidence_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    evidence_size_formatted: '114 KB (97.6% compressed)',
    ai_score: 0.96,
  },
  {
    id: 'chk-2',
    goal_id: 'goal-1',
    routine_id: 'rout-1',
    user_id: 'usr-1',
    scheduled_date: twoDaysAgoStr,
    completed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'completed',
    note: 'Practiced React server actions and optimistic updates.'
  },
  {
    id: 'chk-3',
    goal_id: 'goal-2',
    routine_id: 'rout-2',
    user_id: 'usr-1',
    scheduled_date: yesterdayStr,
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    note: '100 pushups and 5 min plank at Bole stadium track.'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    community_id: 'com-1',
    author_id: 'usr-1',
    author: INITIAL_PROFILES[0],
    title: '📢 Weekly Developer Accountability Sprint Announcement',
    body: 'Greetings developers! This week we are focusing on clean architecture, dynamic UI feedback, and error handling. Share your daily study goals in the comments below!',
    is_announcement: true,
    likes_count: 34,
    comments_count: 12,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'post-2',
    community_id: 'com-2',
    author_id: 'usr-3',
    author: INITIAL_PROFILES[2],
    title: 'Day 16 of Morning Calisthenics Challenge',
    body: 'Woke up at 5:15 AM today in Hawassa. Completed 120 pushups, pull-ups and leg raises. Consistency is key when motivation drops.',
    media_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    is_announcement: false,
    likes_count: 45,
    comments_count: 8,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chg-1',
    community_id: 'com-1',
    community_name: 'Python & Next.js Ethiopia',
    creator_id: 'usr-1',
    title: '30 Days of Code & Build Ethiopia',
    description: 'Commit to coding for at least 1 hour every day for 30 consecutive days. Share daily progress and GitHub commits.',
    start_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    participants_count: 84,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'chg-2',
    community_id: 'com-2',
    community_name: 'Ethiopia Calisthenics & Fitness',
    creator_id: 'usr-3',
    title: '10,000 Pushups August Streak',
    description: 'Perform 300+ bodyweight reps daily to hit 10,000 total reps this month.',
    start_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
    participants_count: 142,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporter_id: 'usr-2',
    reporter_name: 'Meron Tadesse',
    target_id: 'post-99',
    target_type: 'post',
    reason: 'Scam',
    description: 'Promoting unverified automated trading bot promises 500% daily returns.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

// Calculation utility: Calculate streak from checkins
export function calculateStreak(checkins: GoalCheckin[], routineId: string): { currentStreak: number; longestStreak: number; completionRate: number } {
  const routineCheckins = checkins
    .filter(c => c.routine_id === routineId && c.status === 'completed')
    .map(c => c.scheduled_date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (routineCheckins.length === 0) {
    return { currentStreak: 0, longestStreak: 0, completionRate: 0 };
  }

  const uniqueDates = Array.from(new Set(routineCheckins));
  
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if today or yesterday is completed
  const checkDate = new Date(today);
  let dateStr = checkDate.toISOString().split('T')[0];
  
  if (!uniqueDates.includes(dateStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    dateStr = checkDate.toISOString().split('T')[0];
  }

  while (uniqueDates.includes(dateStr)) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
    dateStr = checkDate.toISOString().split('T')[0];
  }

  // Calculate longest streak
  let longestStreak = currentStreak;
  let tempStreak = 0;
  const sortedAsc = [...uniqueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  for (let i = 0; i < sortedAsc.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedAsc[i - 1]);
      const curr = new Date(sortedAsc[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
  }

  const completionRate = Math.min(100, Math.round((uniqueDates.length / 30) * 100));

  return { currentStreak, longestStreak, completionRate };
}
