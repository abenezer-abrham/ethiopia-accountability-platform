/**
 * Multilingual Internationalization (i18n) Engine for Ethiopia
 * 
 * Supports:
 * - English (en)
 * - Amharic (am - አማርኛ)
 * - Afaan Oromoo (om - Oromoo)
 */

export type AppLanguage = 'en' | 'am' | 'om';

export interface Translations {
  appName: string;
  appTagline: string;
  nav: {
    home: string;
    discover: string;
    goals: string;
    activity: string;
    messages: string;
    challenges: string;
    launches: string;
    admin: string;
    squads: string;
    profile: string;
    settings: string;
  };
  home: {
    greeting: string;
    habitLevel: string;
    todaySummary: string;
    newGoal: string;
    priorityRoutines: string;
    completedOf: string;
    checkIn: string;
    done: string;
    dayStreak: string;
    activeGoals: string;
    viewAllGoals: string;
    partnerTitle: string;
    communityUpdates: string;
    exploreCommunities: string;
    offlineNotice: string;
  };
  checkinModal: {
    title: string;
    subtitle: string;
    noteLabel: string;
    notePlaceholder: string;
    proofUploadLabel: string;
    uploadButton: string;
    compressionStats: string;
    exifValid: string;
    aiVerification: string;
    privacyBlurLabel: string;
    privacyBlurButton: string;
    shareWithSquad: string;
    confirmButton: string;
    cancelButton: string;
  };
  discover: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: string;
    subCitiesTitle: string;
    campusesTitle: string;
    scheduleMatching: string;
    microSquadsTab: string;
    communitiesTab: string;
    joined: string;
    join: string;
  };
  squads: {
    title: string;
    subtitle: string;
    createSquad: string;
    membersCount: string;
    dailySync: string;
    activeWindow: string;
  };
  offline: {
    offlineMode: string;
    dataSaverActive: string;
    syncedToast: string;
    queueButton: string;
  };
}

export const DICTIONARY: Record<AppLanguage, Translations> = {
  en: {
    appName: 'Egna',
    appTagline: 'Accountability, Learning & Community',
    nav: {
      home: 'Home',
      discover: 'Discover',
      goals: 'Goals',
      activity: 'Activity',
      messages: 'Messages',
      challenges: 'Challenges',
      launches: 'Launches',
      admin: 'Moderation Admin',
      squads: 'Micro-Squads',
      profile: 'Profile',
      settings: 'Settings',
    },
    home: {
      greeting: 'Selam',
      habitLevel: 'Habit Level 4',
      todaySummary: 'Here is your accountability command center for today',
      newGoal: 'New Goal',
      priorityRoutines: "Today's Accountability Routines",
      completedOf: 'completed',
      checkIn: 'Check In',
      done: 'Done',
      dayStreak: 'day streak',
      activeGoals: 'Active Goals Progress',
      viewAllGoals: 'View All Goals',
      partnerTitle: 'Accountability Partner',
      communityUpdates: 'Recent Community Updates',
      exploreCommunities: 'Explore Communities',
      offlineNotice: 'Offline Mode: Submissions will auto-sync when back online',
    },
    checkinModal: {
      title: 'Daily Habit Check-in',
      subtitle: 'Upload photo proof of completion. Proofs are compressed client-side to <150 KB.',
      noteLabel: 'Completion Note (Optional)',
      notePlaceholder: 'What did you accomplish during this session?',
      proofUploadLabel: 'Photo / Screenshot Proof',
      uploadButton: 'Upload & Compress Photo',
      compressionStats: 'Bandwidth Saved',
      exifValid: 'EXIF Timestamp Verified',
      aiVerification: 'AI Pre-Screen Match',
      privacyBlurLabel: 'Privacy Anonymization',
      privacyBlurButton: 'Auto-Blur Face / Sensitive Areas',
      shareWithSquad: 'Share with My 5-Person Squad',
      confirmButton: 'Confirm Check-in',
      cancelButton: 'Cancel',
    },
    discover: {
      title: 'Discover Communities & Squads',
      subtitle: 'Find Ethiopian peers working on programming, calisthenics, forex, and language habits.',
      searchPlaceholder: 'Search by sub-city, university campus, or skill...',
      categories: 'Categories',
      subCitiesTitle: 'Addis Ababa Sub-Cities',
      campusesTitle: 'University Campuses',
      scheduleMatching: 'Schedule & Time Matching',
      microSquadsTab: '5-8 Person Micro-Squads',
      communitiesTab: 'Public Communities',
      joined: 'Joined',
      join: 'Join',
    },
    squads: {
      title: '5-8 Person Accountability Micro-Squads',
      subtitle: 'Close-knit circles with shared daily streaks and daily active window synchronization.',
      createSquad: 'Create Squad',
      membersCount: 'members',
      dailySync: 'Daily Sync Time',
      activeWindow: 'Active Window',
    },
    offline: {
      offlineMode: 'Offline Mode: Changes stored in IndexedDB',
      dataSaverActive: 'Data Saver Active: 2G/3G low-bandwidth optimization enabled',
      syncedToast: 'Synced check-ins to database!',
      queueButton: 'Offline Queue',
    },
  },
  am: {
    appName: 'እኛ (Egna)',
    appTagline: 'የጋራ ተጠያቂነት፣ ትምህርት እና ማህበረሰብ',
    nav: {
      home: 'ዋና ገጽ',
      discover: 'አስስ / ፈልግ',
      goals: 'ግቦችና ልማዶች',
      activity: 'የቅርብ እንቅስቃሴዎች',
      messages: 'መልዕክቶች',
      challenges: 'ውድድሮች',
      launches: 'ይፋ ማድረጊያ (Launches)',
      admin: 'አስተዳዳሪ ማዕከል',
      squads: 'ንዑስ ቡድኖች (ስኳዶች)',
      profile: 'የግል መገለጫ',
      settings: 'ቅንብሮች',
    },
    home: {
      greeting: 'ሰላም',
      habitLevel: 'የልማድ ደረጃ 4',
      todaySummary: 'የዛሬው የዕለታዊ ተጠያቂነት እና የልማድ ክትትል ማዕከልዎ',
      newGoal: 'አዲስ ግብ',
      priorityRoutines: 'የዛሬ የዕለት ተጠያቂነት ልማዶች',
      completedOf: 'ተጠናቋል',
      checkIn: 'አረጋግጥ (Check-in)',
      done: 'ተከናውኗል',
      dayStreak: 'ቀናት ተከታታይነት',
      activeGoals: 'የነቃ ግቦች ዕድገት',
      viewAllGoals: 'ሁሉንም ግቦች ይመልከቱ',
      partnerTitle: 'የተጠያቂነት አጋር',
      communityUpdates: 'የማህበረሰብ አዳዲስ መረጃዎች',
      exploreCommunities: 'ማህበረሰቦችን አስስ',
      offlineNotice: 'ከመስመር ውጭ፡ ግንኙነት ሲመለስ በራሱ ይመዘገባል',
    },
    checkinModal: {
      title: 'የዕለት ልማድ ማረጋገጫ',
      subtitle: 'የተግባር ማረጋገጫ ፎቶ ይጫኑ። የፎቶው መጠን ወዲያውኑ ወደ <150 KB ይቀነሳል።',
      noteLabel: 'የተግባር ማስታወሻ (አማራጭ)',
      notePlaceholder: 'በዚህ የልምምድ ክፍለ ጊዜ ምን አከናወኑ?',
      proofUploadLabel: 'የማረጋገጫ ፎቶ / ምስል',
      uploadButton: 'ፎቶ ምረጥና መጠን ቀንስ',
      compressionStats: 'የተቆጠበ ዳታ',
      exifValid: 'የፎቶው ሰዓት ተረጋግጧል',
      aiVerification: 'በአይ (AI) የተረጋገጠ',
      privacyBlurLabel: 'የግላዊነት ጥበቃ',
      privacyBlurButton: 'ፊትን ወይም የግል ቦታን ደብዝዝ',
      shareWithSquad: 'ለ 5-ሰው ስኳድ ቡድኔ አጋራ',
      confirmButton: 'ማረጋገጫ መዝግብ',
      cancelButton: 'ሰርዝ',
    },
    discover: {
      title: 'ማህበረሰቦችን እና ስኳዶችን ይፈልጉ',
      subtitle: 'በኮዲንግ፣ ስፖርት፣ ንግድ እና ቋንቋ ልማዶች ላይ ከኢትዮጵያውያን ጓደኞች ጋር ይገናኙ።',
      searchPlaceholder: 'በክፍለ ከተማ፣ በዩኒቨርሲቲ ካምፓስ ወይም በክህሎት ይፈልጉ...',
      categories: 'ዘርፎች',
      subCitiesTitle: 'የአዲስ አበባ ክፍለ ከተሞች',
      campusesTitle: 'የዩኒቨርሲቲ ግቢዎች',
      scheduleMatching: 'የሰዓትና የፕሮግራም ማዛመጃ',
      microSquadsTab: 'የ 5-8 ሰው ጥብቅ ስኳዶች',
      communitiesTab: 'ይፋዊ ማህበረሰቦች',
      joined: 'ተቀላቅለዋል',
      join: 'ተቀላቀል',
    },
    squads: {
      title: 'የ 5-8 ሰው የተጠያቂነት ስኳዶች',
      subtitle: 'የጋራ ዕለታዊ ጥንካሬ እና ተመሳሳይ የልምምድ ሰዓት ያላቸው የቅርብ ቡድኖች።',
      createSquad: 'አዲስ ስኳድ ፍጠር',
      membersCount: 'አባላት',
      dailySync: 'ዕለታዊ መገናኛ ሰዓት',
      activeWindow: 'ተግባራዊ ሰዓት',
    },
    offline: {
      offlineMode: 'ከመስመር ውጭ ሁነታ፡ ዳታው በስልክዎ ላይ ተቀምጧል',
      dataSaverActive: 'ዳታ ቆጣቢ ነቅቷል፡ ዝቅተኛ ኢንተርኔት አጠቃቀም',
      syncedToast: 'የተመዘገቡ ማረጋገጫዎች ወደ ዳታቤዝ ገብተዋል!',
      queueButton: 'ያልገቡ ማረጋገጫዎች',
    },
  },
  om: {
    appName: 'Egna (Nuyi)',
    appTagline: 'Itti-gaafatamummaa, Barumsa fi Hawaasa',
    nav: {
      home: 'Fuula Duraa',
      discover: 'Barbaadi',
      goals: 'Galmawwan',
      activity: 'Sochiiwwan',
      messages: 'Ergaawwan',
      challenges: 'Dorgommiiwwan',
      launches: 'Eebba (Launches)',
      admin: 'Qindeessaa',
      squads: 'Garee Xixiqqaa',
      profile: 'Eenyummaa',
      settings: 'Qindaa’inoota',
    },
    home: {
      greeting: 'Akkam',
      habitLevel: 'Sadarkaa 4',
      todaySummary: 'Giddu-gala itti-gaafatamummaa fi amala guyyaa kee',
      newGoal: 'Galma Haaraa',
      priorityRoutines: 'Amaloota Guyyaa Hardhaa',
      completedOf: 'xumurameera',
      checkIn: 'Mirkaneessi',
      done: 'Xumurame',
      dayStreak: 'guyyoota walitti aanan',
      activeGoals: 'Guddina Galmawwan Hojii Irra Jiranii',
      viewAllGoals: 'Galmawwan Hunda Ilaali',
      partnerTitle: 'Hiriyaa Itti-Gaafatamummaa',
      communityUpdates: 'Oduuwwan Hawaasaa',
      exploreCommunities: 'Hawaasota Barbaadi',
      offlineNotice: 'Interneetiin ala: Yeroo interneetiin deebi’u ofiin gala',
    },
    checkinModal: {
      title: 'Mirkaneessa Amala Guyyaa',
      subtitle: 'Suuraa ragaa hojichaa fe’i. Qabiyyeen suuraa battalumatti <150 KBtti hir’ata.',
      noteLabel: 'Yaada (Filannoo)',
      notePlaceholder: 'Yeroo kanatti maal hojjette?',
      proofUploadLabel: 'Suuraa Ragaa',
      uploadButton: 'Suuraa Filadhu & Hir’isi',
      compressionStats: 'Daataan Qusatame',
      exifValid: 'Sa’aatiin Mirkanaa’eera',
      aiVerification: 'AI’n Mirkanaa’eera',
      privacyBlurLabel: 'Eegumsa Dhuunfaa',
      privacyBlurButton: 'Fuula Yookiin Iddoo Dhoksi',
      shareWithSquad: 'Garee Namoota 5tiif Qoodi',
      confirmButton: 'Mirkaneessi',
      cancelButton: 'Dhiisi',
    },
    discover: {
      title: 'Hawaasota fi Gareewwan Barbaadi',
      subtitle: 'Hiriyaa saganteessuu, ispoortii, daldalaa fi afaanii waliin wal-qunnamaa.',
      searchPlaceholder: 'Kutaa magaalaan, kaampaasiin ykn dandeettiin barbaadi...',
      categories: 'Kutaalee',
      subCitiesTitle: 'Kutaalee Magaalaa Finfinnee',
      campusesTitle: 'Kaampaasota Yuunivarsiitii',
      scheduleMatching: 'Walsimannaa Sa’aatii',
      microSquadsTab: 'Gareewwan Namoota 5-8',
      communitiesTab: 'Hawaasota Hundaaf Banaa',
      joined: 'Miseensa',
      join: 'Miseensa Ta’i',
    },
    squads: {
      title: 'Gareewwan Itti-Gaafatamummaa Namoota 5-8',
      subtitle: 'Garee dhiyoo sa’aatii walfakkaataa fi amala waloo qaban.',
      createSquad: 'Garee Uumi',
      membersCount: 'miseensota',
      dailySync: 'Yeroo Wal-qunnamtii Guyyaa',
      activeWindow: 'Sa’aatii Hojii',
    },
    offline: {
      offlineMode: 'Tajaajila Interneetii Malee',
      dataSaverActive: 'Daataa Qusachuu: Qusannoo daataa 2G/3G',
      syncedToast: 'Ragaaleen fe’aman gara kuusaa deeman!',
      queueButton: 'Kuusaa Ragaa',
    },
  },
};

const LANGUAGE_STORAGE_KEY = 'egna_selected_language';

export function getStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage;
    if (stored && ['en', 'am', 'om'].includes(stored)) return stored;
  } catch {}
  return 'en';
}

export function setStoredLanguage(lang: AppLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  } catch {}
}
