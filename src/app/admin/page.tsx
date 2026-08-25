'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Target,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  FileText,
  Crown,
  Building2,
  ArrowRight,
  Fingerprint,
  UserPlus,
  Trash2,
  Mail,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { INITIAL_REPORTS, INITIAL_VERIFICATION_REQUESTS, Report } from '@/lib/store';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';
import { getAdminRegistry, addAdminEmail, removeAdminEmail, ROOT_ADMIN_EMAIL, AdminRecord } from '@/lib/user-session';

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; target: string; time: string }>>([
    { id: 'log-1', action: 'Approved community request', target: 'Python & Next.js Ethiopia', time: '2 hours ago' },
    { id: 'log-2', action: 'Dismissed report #41', target: 'Post #99', time: '1 day ago' },
    { id: 'log-3', action: 'Cross-referenced root CEO clearance', target: 'abenezerabrham61@gmail.com', time: 'Just now' }
  ]);

  // Admin Registry Management
  const [adminList, setAdminList] = useState<AdminRecord[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'moderator'>('admin');
  const [addMsg, setAddMsg] = useState('');

  useEffect(() => {
    setAdminList(getAdminRegistry());
    const sync = () => setAdminList(getAdminRegistry());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const ok = addAdminEmail(newEmail, newRole, newName);
    if (ok) {
      setAdminList(getAdminRegistry());
      setAddMsg(`✓ Added ${newEmail} as ${newRole}`);
      setNewEmail('');
      setNewName('');
      setTimeout(() => setAddMsg(''), 3000);
    }
  };

  const handleRemoveAdmin = (email: string) => {
    removeAdminEmail(email);
    setAdminList(getAdminRegistry());
  };

  const pendingVerifications = INITIAL_VERIFICATION_REQUESTS.filter((v) => v.status === 'pending').length;

  const handleResolve = (id: string, action: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setAuditLogs((prev) => [
      { id: `log-${id}-${prev.length + 1}`, action: `Moderator action: ${action}`, target: `Report #${id}`, time: 'Just now' },
      ...prev
    ]);
  };

  return (
    <AdminRouteGuard requiredRole="admin_or_mod">
      <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <span>Platform Moderation & Security Admin</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Enforce community rules, review safety reports, and inspect cryptographic audit logs.
          </p>
        </div>

        <Link href="/admin/verification">
          <Button variant="primary" size="sm" leftIcon={<Crown className="w-4 h-4 text-amber-300" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
            CEO Verification Authority
          </Button>
        </Link>
      </div>

      {/* CEO Executive Clearance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">CEO & Verification Authority</h3>
              <Badge variant="amber">Clearance Level 5</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review institutional, creator, and corporate identity badge applications ({pendingVerifications} pending).
            </p>
          </div>
        </div>

        <Link href="/admin/verification">
          <Button size="sm" variant="secondary" className="whitespace-nowrap">
            Open Verification Console
          </Button>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Users</span>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">1,248</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Goals</span>
          <p className="text-xl font-bold text-emerald-600">3,410</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Verified Check-ins</span>
          <p className="text-xl font-bold text-blue-500">18,920</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Pending Reports</span>
          <p className="text-xl font-bold text-amber-500">{reports.length}</p>
        </Card>
      </div>

      {/* Reports Queue */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Pending Safety & Moderation Reports Queue</span>
          </h3>
        </div>

        {reports.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-medium">
            ✅ All reports resolved. System is clean!
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <Badge variant="amber">{rep.reason}</Badge>
                    <span className="text-slate-500">Target: {rep.target_type} ({rep.target_id})</span>
                  </div>
                  <span className="text-slate-400">Reported by {rep.reporter_name}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{rep.description}</p>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleResolve(rep.id, 'Dismissed')}>
                    Dismiss
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleResolve(rep.id, 'Removed content & issued warning')}>
                    Remove Content & Warn User
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Admin & Moderator Database Registry */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Admin & Moderator Database Cross-Reference Table</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Emails listed here automatically receive elevated clearance when signing into Egna.
            </p>
          </div>
          <Badge variant="emerald">Live Cross-Reference</Badge>
        </div>

        {addMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-bold text-center">
            {addMsg}
          </div>
        )}

        {/* Add new admin form */}
        <form onSubmit={handleAddAdmin} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            Add / Authorize New Team Member
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-xs"
            />
            <Input
              placeholder="email@example.com"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              leftIcon={<Mail className="w-3.5 h-3.5" />}
              className="text-xs"
              required
            />
            <div className="flex items-center space-x-2">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'moderator')}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
              <Button type="submit" size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>
          </div>
        </form>

        {/* Admin List */}
        <div className="space-y-2">
          {adminList.map((adm) => {
            const isRoot = adm.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();
            return (
              <div
                key={adm.email}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    adm.role === 'ceo_founder'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {adm.role === 'ceo_founder' ? '👑' : adm.role === 'moderator' ? '🛡️' : '⚡'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{adm.name}</span>
                      <Badge variant={adm.role === 'ceo_founder' ? 'amber' : 'emerald'} className="text-[10px] py-0 px-1.5">
                        {adm.role === 'ceo_founder' ? 'Root CEO / Owner' : adm.role === 'moderator' ? 'Moderator' : 'Admin'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">{adm.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400">Added: {adm.added_at}</span>
                  {!isRoot && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAdmin(adm.email)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Revoke clearance"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Audit Logs */}
      <Card className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Executive & Moderator Audit Logs</span>
        </h3>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{log.action} ({log.target})</span>
              <span className="text-[10px] text-slate-400">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
      </div>
    </AdminRouteGuard>
  );
}
