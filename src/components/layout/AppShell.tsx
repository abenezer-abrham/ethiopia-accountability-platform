'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Target,
  Activity,
  MessageSquare,
  Trophy,
  ShieldAlert,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Key,
  Inbox,
  Crown,
  LogOut,
  Menu
} from 'lucide-react';
import { Avatar, Badge } from '../ui/Card';
import { Button } from '../ui/Button';
import { processOfflineQueue, subscribeQueueChanges, QueuedCheckin } from '@/lib/offline-queue';
import { DICTIONARY, AppLanguage, getStoredLanguage, setStoredLanguage } from '@/lib/i18n';
import { OfflineQueueModal } from '../ui/OfflineQueueModal';
import { getCurrentUser, logoutUser } from '@/lib/user-session';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const [currentLang, setCurrentLang] = useState<AppLanguage>('en');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light') return false;
    }
    return true;
  });
  const [dataSaver, setDataSaver] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [offlineQueueOpen, setOfflineQueueOpen] = useState(false);
  const [queuedItems, setQueuedItems] = useState<QueuedCheckin[]>([]);

  // Retractable Sidebar State
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar_collapsed');
      return stored === 'true';
    }
    return false;
  });

  const t = DICTIONARY[currentLang] || DICTIONARY.en;

  // Current logged in user state (dynamically resolves role or defaults to standard user)
  const [user, setUser] = useState<Profile>(getCurrentUser);

  useEffect(() => {
    const syncUser = () => {
      setUser(getCurrentUser());
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const isExecutiveOrAdmin = user.role === 'ceo_founder' || user.role === 'moderator' || user.role === 'admin';

  useEffect(() => {
    const lang = getStoredLanguage();
    setCurrentLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  }, []);

  const handleLanguageChange = (newLang: AppLanguage) => {
    setCurrentLang(newLang);
    setStoredLanguage(newLang);
  };

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebar_collapsed', String(next));
  };

  const handleToggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const [syncToast, setSyncToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeQueueChanges((items) => {
      setQueuedItems(items);
    });

    const handleOnline = async () => {
      setIsOnline(true);
      const res = await processOfflineQueue();
      if (res.syncedCount > 0) {
        setSyncToast(`Synced ${res.syncedCount} queued check-ins to database!`);
        setTimeout(() => setSyncToast(null), 4000);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { label: t.nav.home, href: '/home', icon: Home },
    { label: t.nav.discover, href: '/discover', icon: Compass },
    { label: t.nav.goals, href: '/goals', icon: Target },
    { label: t.nav.activity, href: '/activity', icon: Activity },
    { label: t.nav.messages, href: '/messages', icon: MessageSquare },
    { label: t.nav.challenges, href: '/challenges', icon: Trophy },
  ];

  const adminNav = [
    { label: 'Verification Authority', href: '/admin/verification', icon: Crown, badge: 'CEO' },
    { label: t.nav.admin, href: '/admin', icon: ShieldAlert, badge: '1' },
    { label: 'Claim Admin Key', href: '/admin/claim', icon: Key },
  ];

  const isPublicPage = pathname === '/' || pathname === '/signup' || pathname === '/login' || pathname === '/onboarding';

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Offline / Data Saver / Sync Toast Status Banner */}
      {syncToast && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between shadow-md animate-fade-in">
          <span>{syncToast}</span>
        </div>
      )}
      {(!isOnline || dataSaver) && !syncToast && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            {!isOnline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>
              {!isOnline
                ? t.offline.offlineMode
                : t.offline.dataSaverActive}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setOfflineQueueOpen(true)}
              className="underline text-amber-100 hover:text-white text-[11px] font-bold cursor-pointer"
            >
              View Queue ({queuedItems.length})
            </button>
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className="underline text-amber-100 hover:text-white text-[11px] cursor-pointer"
            >
              {dataSaver ? 'Disable Data Saver' : 'Enable Data Saver'}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Retractable Sidebar Navigation - Clean Icon Rail (w-16) vs Expanded (w-64) */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 sticky top-0 h-screen transition-all duration-300 z-30 overflow-x-hidden ${
          isCollapsed ? 'w-16 p-2' : 'w-64 p-3'
        } ${(!isOnline || dataSaver) ? 'pt-8' : ''}`}
      >
        {/* Sidebar Header & Brand (Pixel-perfect when collapsed: no cut-off!) */}
        <div
          className={`flex items-center mb-4 border-b border-slate-100 dark:border-slate-800/80 ${
            isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-2 py-3'
          }`}
        >
          {isCollapsed ? (
            <Link href="/home" className="flex items-center justify-center" title="Egna (እኛ)">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-sm hover:scale-105 transition-transform">
                🇪🇹
              </div>
            </Link>
          ) : (
            <>
              <Link href="/home" className="flex items-center space-x-3 overflow-hidden min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
                  🇪🇹
                </div>
                <div className="min-w-0 flex-1 animate-fade-in">
                  <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                    Egna <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold font-ethiopic">እኛ</span>
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{t.appTagline}</p>
                </div>
              </Link>

              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Retract Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center space-x-3 rounded-lg text-sm font-medium transition-all ${
                  isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                } ${
                  active
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
          {/* Admin & Security Section - Only visible to authorized roles */}
          {isExecutiveOrAdmin && (
            <div className="pt-6">
              {!isCollapsed && (
                <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Executive & Admin</span>
                  {user.role === 'ceo_founder' ? (
                    <span className="text-[9px] text-amber-400 font-extrabold uppercase">👑 CEO Clearance</span>
                  ) : (
                    <span className="text-[9px] text-emerald-400 font-extrabold uppercase">🛡️ Mod Clearance</span>
                  )}
                </div>
              )}

              {adminNav
                .filter((item) => {
                  if (item.href === '/admin/verification' && user.role !== 'ceo_founder') return false;
                  return true;
                })
                .map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center justify-between rounded-lg text-sm font-medium transition-all ${
                        isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                      } ${
                        active
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <Icon className="w-5 h-5 shrink-0 text-amber-500" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && item.badge && (
                        <Badge variant="amber" className="text-[10px] py-0 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
            </div>
          )}
        </nav>

        {/* Sidebar Bottom Controls: Retract toggle when collapsed + User Profile */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${user.username}`}
              className={`flex items-center rounded-xl transition-all flex-1 min-w-0 ${
                isCollapsed ? 'justify-center p-1 hover:opacity-80' : 'p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 space-x-3'
              }`}
              title={isCollapsed ? `${user.display_name} (@${user.username})` : undefined}
            >
              <Avatar name={user.display_name} src={user.avatar_url} size="sm" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user.display_name}
                    </p>
                    {user.role === 'ceo_founder' && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    @{user.username} • {user.role === 'ceo_founder' ? 'CEO / Founder' : user.role === 'moderator' ? 'Moderator' : 'Member'}
                  </p>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  window.location.href = '/login';
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 mb-16 md:mb-0">
        {/* Top Header Bar with Sidebar Toggle Button */}
        <header className={`sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between ${(!isOnline || dataSaver) ? 'mt-6' : ''}`}>
          <div className="flex items-center space-x-3">
            {/* Header Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Retract Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            <div className="flex items-center space-x-2 md:hidden">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                🇪🇹
              </div>
              <span className="font-bold text-sm tracking-tight">Egna (እኛ)</span>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-500">
              <span>Ethiopian Accountability Platform</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Production Alpha</span>
              {user.role === 'ceo_founder' && (
                <span className="text-amber-400 font-bold flex items-center space-x-1 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>CEO Authority</span>
                </span>
              )}
              {user.role === 'moderator' && (
                <span className="text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                  <ShieldAlert className="w-3 h-3 text-emerald-400" />
                  <span>Moderator</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Switcher Selector */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 p-0.5 text-xs font-semibold">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('am')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-ethiopic ${
                  currentLang === 'am'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="አማርኛ (Amharic)"
              >
                አማ
              </button>
              <button
                onClick={() => handleLanguageChange('om')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  currentLang === 'om'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Afaan Oromoo"
              >
                OM
              </button>
            </div>

            {/* Offline Queue Drawer Button */}
            <button
              onClick={() => setOfflineQueueOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              title="Offline Sync Queue"
            >
              <Inbox className="w-4 h-4" />
              {queuedItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {queuedItems.length}
                </span>
              )}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {/* Notification Popup */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                    <span className="text-[11px] text-emerald-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200">
                      <p className="font-semibold">🔥 Routine Reminder</p>
                      <p className="text-[11px] text-slate-500">Don&apos;t forget your 1-hour Next.js practice routine today!</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200">
                      <p className="font-semibold">👑 Executive Notification</p>
                      <p className="text-[11px] text-slate-500">1 new university organization verification request awaiting review.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Data Saver Mode Toggle */}
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                dataSaver
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Data Saver Mode"
            >
              <Wifi className="w-4 h-4" />
            </button>

            {/* Profile Avatar Mobile */}
            <Link href={`/profile/${user.username}`} className="md:hidden">
              <Avatar name={user.display_name} src={user.avatar_url} size="sm" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Offline Queue Modal */}
      <OfflineQueueModal
        isOpen={offlineQueueOpen}
        onClose={() => setOfflineQueueOpen(false)}
        isOnline={isOnline}
        onSyncComplete={(count) => {
          setSyncToast(`Synced ${count} check-in(s) to database!`);
          setTimeout(() => setSyncToast(null), 4000);
        }}
      />

      {/* Mobile Bottom Navigation (Fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-around py-2 px-1">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                active
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
