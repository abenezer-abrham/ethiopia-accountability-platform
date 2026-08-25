'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Plus, Flame, CheckCircle2, Calendar, Lock, Globe, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { ProgressBar } from '@/components/ui/Progress';
import { Goal } from '@/lib/store';
import { getStoredGoals, saveGoal, getCurrentUser } from '@/lib/user-session';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setGoals(getStoredGoals());
    const sync = () => setGoals(getStoredGoals());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Form State for Multi-step creation
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Programming');
  const [targetDate, setTargetDate] = useState('2026-11-30');
  const [visibility, setVisibility] = useState<'public' | 'partners' | 'private'>('public');
  const [targetVal, setTargetVal] = useState('60');
  const [unit, setUnit] = useState('hours');
  const [routineTitle, setRoutineTitle] = useState('Daily 1-Hour Practice Session');

  const handleCreateGoal = () => {
    if (!newTitle) return;
    const user = getCurrentUser();

    const created: Goal = {
      id: `goal-${Date.now()}`,
      user_id: user.id,
      title: newTitle,
      description: newDesc,
      category: newCategory,
      start_date: new Date().toISOString().split('T')[0],
      target_date: targetDate,
      status: 'active',
      visibility: visibility,
      target_value: Number(targetVal) || 100,
      current_value: 0,
      unit: unit || 'sessions',
      created_at: new Date().toISOString()
    };

    saveGoal(created);
    setGoals(getStoredGoals());
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Target className="w-6 h-6 text-emerald-600" />
            <span>Personal Goals & Routines</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Turn your long-term ambitions into verifiable daily discipline.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Goal
        </Button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const current = goal.current_value || 0;
          const target = goal.target_value || 100;
          return (
            <Card key={goal.id} className="space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="emerald">{goal.category}</Badge>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      {goal.visibility === 'public' && <Globe className="w-3 h-3 text-slate-400" />}
                      {goal.visibility === 'partners' && <Users className="w-3 h-3 text-blue-400" />}
                      {goal.visibility === 'private' && <Lock className="w-3 h-3 text-amber-400" />}
                      <span className="capitalize">{goal.visibility}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{goal.title}</h3>
                </div>

                <Badge variant={goal.status === 'active' ? 'emerald' : 'slate'}>
                  {goal.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">{goal.description}</p>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="text-emerald-600">{current} / {target} {goal.unit}</span>
                </div>
                <ProgressBar value={current} max={target} />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target: {goal.target_date}</span>
                </span>
                <Link href={`/goals/${goal.id}`}>
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 font-semibold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Routines & Streaks
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Multi-step Create Goal Dialog */}
      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Goal">
        <div className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g. Master Next.js App Router"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <Textarea
            label="Description"
            placeholder="Explain why this goal matters and what you aim to achieve..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 text-sm border-slate-300 dark:border-slate-800"
              >
                <option value="Programming">Programming</option>
                <option value="Fitness">Fitness</option>
                <option value="Forex">Forex</option>
                <option value="Languages">Languages</option>
                <option value="Bible Study">Bible Study</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <Input
              label="Target Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Quantity"
              type="number"
              value={targetVal}
              onChange={(e) => setTargetVal(e.target.value)}
            />
            <Input
              label="Measurement Unit"
              placeholder="e.g. hours / workouts"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <Input
            label="Daily Routine Title"
            placeholder="e.g. Study 60 minutes daily"
            value={routineTitle}
            onChange={(e) => setRoutineTitle(e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateGoal} disabled={!newTitle}>
              Save Goal & Routine
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
