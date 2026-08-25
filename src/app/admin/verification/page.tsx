'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Crown,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  Lock,
  Sparkles,
  ArrowLeft,
  FileCheck,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
  VerificationRequest,
  VerificationBadge
} from '@/lib/store';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';
import { getVerificationRequests, updateVerificationRequestStatus, getCurrentUser } from '@/lib/user-session';

export default function VerificationAdminPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setRequests(getVerificationRequests());
    const sync = () => setRequests(getVerificationRequests());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Stats
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;

  const handleApprove = (req: VerificationRequest) => {
    const user = getCurrentUser();
    updateVerificationRequestStatus(req.id, 'approved', `${user.display_name} (CEO)`);
    setRequests(getVerificationRequests());
    setActionSuccessToast(`✅ Granted ${req.badge_requested.toUpperCase()} badge to @${req.username}!`);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  const handleReject = (req: VerificationRequest) => {
    const user = getCurrentUser();
    updateVerificationRequestStatus(req.id, 'rejected', `${user.display_name} (CEO)`);
    setRequests(getVerificationRequests());
    setActionSuccessToast(`❌ Verification request for @${req.username} rejected.`);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  const getBadgeIcon = (badge: VerificationBadge) => {
    switch (badge) {
      case 'ceo_founder':
        return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      case 'verified_admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'verified_org':
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'verified_partner':
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <AdminRouteGuard requiredRole="ceo_only">
      <div className="space-y-6">
        {/* Top Back Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Console</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <span>Executive CEO & Verification Authority</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Industry-standard corporate identity verification, executive badges, and clearance granting.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="amber" className="text-xs py-1 px-3">
              👑 CEO Clearance Level 5
            </Badge>
          </div>
        </div>

        {actionSuccessToast && (
          <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-lg animate-fade-in">
            {actionSuccessToast}
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Pending Requests</span>
            <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
          </Card>
          <Card className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Verified Badges Issued</span>
            <p className="text-2xl font-bold text-emerald-600">{approvedCount + 2}</p>
          </Card>
          <Card className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Organizations Verified</span>
            <p className="text-2xl font-bold text-blue-500">14</p>
          </Card>
          <Card className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Cryptographic Clearance</span>
            <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center space-x-1">
              <Fingerprint className="w-4 h-4 text-emerald-500" />
              <span>MFA Verified</span>
            </p>
          </Card>
        </div>

        {/* Verification Queue Table / Cards */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Identity & Verification Applications Queue</span>
            </h3>
          </div>

          <div className="space-y-3">
            {requests.map((req) => {
              const isPending = req.status === 'pending';
              return (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <Avatar name={req.user_name} src={req.user_avatar} size="md" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{req.user_name}</span>
                          <span className="text-[11px] text-slate-400">(@{req.username})</span>
                          <Badge variant={req.status === 'approved' ? 'emerald' : req.status === 'pending' ? 'amber' : 'slate'}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 capitalize">
                          Type: {req.type.replace('_', ' ')} • Requested Badge:{' '}
                          <strong className="text-slate-700 dark:text-slate-300">{req.badge_requested}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Submitted: {req.submitted_at}
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    {req.organization_name && (
                      <p className="text-slate-800 dark:text-slate-200">
                        <strong>Organization:</strong> {req.organization_name}
                      </p>
                    )}
                    {req.official_email && (
                      <p className="text-slate-800 dark:text-slate-200">
                        <strong>Corporate / Academic Email:</strong>{' '}
                        <span className="text-emerald-600 font-semibold">{req.official_email}</span>
                      </p>
                    )}
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Reason / Proof:</strong> {req.reason}
                    </p>
                  </div>

                  {isPending ? (
                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        onClick={() => handleReject(req)}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Reject Application
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs"
                        onClick={() => handleApprove(req)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Approve & Grant Verified Badge
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>Reviewed: {req.reviewed_at} by {req.reviewed_by}</span>
                      <span className="text-emerald-600 font-bold flex items-center space-x-1">
                        {getBadgeIcon(req.badge_requested)}
                        <span>Badge Active</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AdminRouteGuard>
  );
}
