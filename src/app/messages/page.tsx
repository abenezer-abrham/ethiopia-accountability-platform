'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ShieldAlert, CheckCheck, UserX, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Avatar, Badge } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { INITIAL_PROFILES, Profile } from '@/lib/store';
import { inspectAndSanitizeContent } from '@/lib/link-guard';
import { getCurrentUser } from '@/lib/user-session';

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<Profile>(getCurrentUser);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const sync = () => setCurrentUser(getCurrentUser());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const partnerProfiles = INITIAL_PROFILES.filter((p) => p.id !== currentUser.id && p.username !== currentUser.username);
  const [selectedUser, setSelectedUser] = useState<Profile>(partnerProfiles[0] || INITIAL_PROFILES[1]);
  const [messagesMap, setMessagesMap] = useState<Record<string, Array<{ id: string; sender: string; text: string; time: string }>>>({
    'usr-2': [
      { id: 'm1', sender: 'usr-2', text: 'Selam! How is your habit routine going today?', time: '10:15 AM' },
      { id: 'm2', sender: 'me', text: 'Selam Meron! Going great, completed my daily practice session with verified proof.', time: '10:18 AM' },
      { id: 'm3', sender: 'usr-2', text: 'Awesome! I just logged my routine entry for today as well.', time: '10:20 AM' }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [spamAlert, setSpamAlert] = useState<string | null>(null);

  const activeMessages = selectedUser ? messagesMap[selectedUser.id] || [] : [];

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedUser || blocked) return;

    // Link Guard Sanitization Check
    const guard = inspectAndSanitizeContent(inputMessage, 420, 30);
    if (!guard.isClean && guard.actionTaken === 'BLOCKED') {
      setSpamAlert(`Message blocked by Anti-Spam Guard: ${guard.detectedThreats.join(', ')}`);
      setTimeout(() => setSpamAlert(null), 4000);
      return;
    }

    const cleanText = guard.sanitizedText;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser.id,
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesMap({
      ...messagesMap,
      [selectedUser.id]: [...activeMessages, newMessage]
    });

    setInputMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Direct Messaging & Partner Chat</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Encrypted 1-on-1 communication with your accountability partners and squad members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        {/* Left: Conversation List */}
        <div className="border-r border-slate-200 dark:border-slate-800 p-3 space-y-2 overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
            Partners & Squad Members
          </span>

          {partnerProfiles.map((user) => {
            const isSelected = selectedUser.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Avatar name={user.display_name} src={user.avatar_url} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.display_name}</p>
                    {user.sub_city && <span className="text-[9px] text-slate-400">({user.sub_city})</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Message Window */}
        <div className="md:col-span-2 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
          {/* Chat Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar name={selectedUser.display_name} src={selectedUser.avatar_url} size="sm" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedUser.display_name}</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Verified Accountability Partner</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBlocked(!blocked)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  blocked
                    ? 'bg-red-600 text-white border-red-500'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {blocked ? 'Blocked' : 'Block User'}
              </button>
            </div>
          </div>

          {/* Spam / Link Guard Alert */}
          {spamAlert && (
            <div className="p-2 bg-red-600 text-white text-xs font-semibold text-center">
              {spamAlert}
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {blocked ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs text-center rounded-xl font-medium">
                You have blocked messages from this user.
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMe = msg.sender === currentUser.id || msg.sender === 'me';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end space-x-1 text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Footer */}
          {!blocked && (
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
              <Input
                placeholder="Write your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="primary" onClick={handleSendMessage} leftIcon={<Send className="w-4 h-4" />}>
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
