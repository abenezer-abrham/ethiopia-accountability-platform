'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/40">
            🇪🇹
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">Egna</span>
            <span className="ml-2 text-xs font-semibold text-emerald-400 border border-emerald-800 bg-emerald-950/60 px-2 py-0.5 rounded-full">
              እኛ
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/home">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Log In
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-8">
        <Badge variant="emerald" className="py-1 px-3 text-xs tracking-wide uppercase">
          Peer Accountability & Growth for Ethiopia
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-100">
          Build habits. Join Ethiopian communities. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Stay accountable.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transform your daily goals in programming, calisthenics, language learning, and financial discipline with verified proof check-ins and peer accountability partners across Ethiopia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto text-base px-8 py-3.5 shadow-lg shadow-emerald-900/30" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Your Onboarding
            </Button>
          </Link>
          <Link href="/discover" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-slate-700 text-slate-300 hover:bg-slate-900">
              Browse Communities
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Feature Highlights */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/90 border-slate-800/80 p-6 space-y-3">
          <div className="p-3 w-fit bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-800/50">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Routines & Streaks</h3>
          <p className="text-sm text-slate-400">
            Turn ambitious personal goals into manageable daily routines. Verify progress with evidence uploads and streak metrics.
          </p>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800/80 p-6 space-y-3">
          <div className="p-3 w-fit bg-amber-950/80 text-amber-400 rounded-xl border border-amber-800/50">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Local Communities</h3>
          <p className="text-sm text-slate-400">
            Connect with Ethiopian developers, fitness enthusiasts, and learners in Addis Ababa, Hawassa, Bahr Dar, Adama, and beyond.
          </p>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800/80 p-6 space-y-3">
          <div className="p-3 w-fit bg-blue-950/80 text-blue-400 rounded-xl border border-blue-800/50">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Safety & Audit</h3>
          <p className="text-sm text-slate-400">
            Enforced community moderation, audit logging, direct message rate-limiting, and zero financial scam tolerance.
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Egna (እኛ) — Ethiopia Accountability, Learning & Community Platform</p>
      </footer>
    </div>
  );
}
