import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Briefcase, Target, ShieldCheck, Users, Zap, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-slate-200 py-16 sm:py-24 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              Our Mission & Vision
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Bridging the Gap Between Ambition and Opportunity
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              CareerHub is a centralized modern recruitment ecosystem designed to empower talent to discover meaningful work while helping innovative companies scale their teams with velocity and precision.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Precision Matching</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our database-backed search and multifaceted filter system ensures candidates discover roles aligned with their specific compensation requirements, skills, and work mode preferences.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">End-to-End Pipeline</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Recruiters manage candidate progression through intuitive visual pipelines — from initial application screening to interview coordination and final offer letters.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Transparency & Trust</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every job posting is authenticated and verified. Candidates receive real-time notifications on each stage change, eliminating traditional hiring black holes.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
