// Types for Ethiopia Accountability Platform

export type UserRole = 'user' | 'moderator' | 'admin' | 'ceo_founder';

export type TrustTier = 'tier_1_new' | 'tier_2_verified' | 'tier_3_leader';

export type VerificationBadge = 'none' | 'ceo_founder' | 'verified_admin' | 'verified_org' | 'verified_partner';

export type EthiopianRegion =
  | 'Addis Ababa'
  | 'Dire Dawa'
  | 'Oromia'
  | 'Amhara'
  | 'Tigray'
  | 'Sidama'
  | 'Central Ethiopia'
  | 'South Ethiopia'
  | 'Southwest Ethiopia'
  | 'Somali'
  | 'Benishangul-Gumuz'
  | 'Gambella'
  | 'Harari'
  | 'Afar'
  | 'Diaspora / International'
  | string;

export type SubCity =
  | 'Bole'
  | 'Kirkos'
  | 'Yeka'
  | 'Arada'
  | 'Gullele'
  | 'Lideta'
  | 'Nifas Silk-Lafto'
  | 'Kolfe Keranio'
  | 'Akaky Kaliti'
  | 'Lemi Kura'
  | 'Addis Ketema'
  | string;

export type UniversityCampus =
  | 'AAU (Addis Ababa University)'
  | 'ASTU (Adama Science & Tech)'
  | 'AASTU (Addis Ababa Science & Tech)'
  | 'Jimma University'
  | 'Hawassa University'
  | 'Bahir Dar University'
  | 'University of Gondar'
  | 'Mekelle University'
  | 'Haramaya University'
  | 'Dire Dawa University'
  | 'Arba Minch University'
  | 'Wollo University'
  | 'Debre Berhan University'
  | 'Debre Markos University'
  | 'Wolaita Sodo University'
  | 'Dilla University'
  | 'Jigjiga University'
  | 'Semera University'
  | 'Assosa University'
  | 'Gambella University'
  | 'Unity University / Private College'
  | 'ALX / Tech Bootcamp / Self-Taught'
  | 'Working Professional / Industry'
  | 'High School / Secondary Student'
  | 'Independent / Other'
  | string;

export type ActiveWindow =
  | 'Early Bird (5 AM – 8 AM)'
  | 'Morning Focus (8 AM – 12 PM)'
  | 'Afternoon Sprint (1 PM – 5 PM)'
  | 'Evening Wind-down (6 PM – 9 PM)'
  | 'Night Owl (10 PM – 1 AM)'
  | string;

export interface AdminRecord {
  email: string;
  role: UserRole;
  name: string;
  added_by: string;
  added_at: string;
  is_root?: boolean;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  username: string;
  type: 'individual_creator' | 'organization' | 'executive_ceo' | 'university_faculty';
  organization_name?: string;
  official_email?: string;
  document_url?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  badge_requested: VerificationBadge;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  email?: string;
  email_verified?: boolean;
  bio: string;
  avatar_url: string;
  location_region?: EthiopianRegion;
  sub_city?: SubCity;
  university_campus?: UniversityCampus;
  active_window?: ActiveWindow;
  trust_tier?: TrustTier;
  verification_badge?: VerificationBadge;
  organization?: string;
  experience_summary?: string;
  role: UserRole;
  reputation_score: number;
  created_at: string;
}


export interface Squad {
  id: string;
  name: string;
  slug: string;
  category: string;
  focus: string;
  max_members: number; // 5-8 members
  current_members_count: number;
  sub_city?: SubCity;
  university_campus?: UniversityCampus;
  active_window: ActiveWindow;
  leader_id: string;
  leader_name: string;
  leader_avatar: string;
  total_squad_streak: number;
  is_private: boolean;
  created_at: string;
}

export interface SquadMember {
  id: string;
  squad_id: string;
  user_id: string;
  user?: Profile;
  joined_at: string;
  checked_in_today: boolean;
  current_streak: number;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface UserInterest {
  id: string;
  user_id: string;
  interest_id: string;
  experience_level: 'Beginner' | 'Learning' | 'Intermediate' | 'Advanced' | 'Experienced';
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  banner_url?: string;
  sub_city?: SubCity;
  university_campus?: UniversityCampus;
  is_verified: boolean;
  is_private: boolean;
  creator_id: string;
  member_count: number;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin' | 'owner';
  joined_at: string;
}

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  author?: Profile;
  title: string;
  body: string;
  media_url?: string;
  is_announcement: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: Profile;
  body: string;
  created_at: string;
}

export interface Reaction {
  id: string;
  target_id: string;
  target_type: 'post' | 'comment';
  user_id: string;
  type: 'like' | 'helpful' | 'support';
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  target_date?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  visibility: 'public' | 'partners' | 'private';
  target_value?: number;
  current_value?: number;
  unit?: string;
  created_at: string;
  routines?: Routine[];
}

export interface Routine {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  target_minutes?: number;
  created_at: string;
}

export interface GoalCheckin {
  id: string;
  goal_id: string;
  routine_id: string;
  user_id: string;
  scheduled_date: string;
  completed_at: string;
  status: 'completed' | 'skipped' | 'missed';
  note?: string;
  evidence_url?: string;
  evidence_size_formatted?: string;
  ai_score?: number;
  privacy_blurred?: boolean;
  squad_id?: string;
}

export interface Challenge {
  id: string;
  community_id: string;
  community_name?: string;
  creator_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  participants_count: number;
  created_at: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  progress: number;
  completed: boolean;
  joined_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant: Profile;
  last_message?: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  target_id: string;
  target_type: 'user' | 'post' | 'comment' | 'message';
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'reminder' | 'partner' | 'community' | 'reaction' | 'message';
  title: string;
  content: string;
  is_read: boolean;
  link_url?: string;
  created_at: string;
}
