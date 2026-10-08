import React from 'react';
import { Briefcase, Heart, Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-md">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Career<span className="text-indigo-600">Hub</span>
              </span>
            </a>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Connect Talent with Opportunity. CareerHub is the centralized recruitment platform connecting passionate candidates with innovative companies worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-600">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 hover:text-indigo-600 hover:bg-slate-200 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 hover:text-indigo-600 hover:bg-slate-200 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 hover:text-indigo-600 hover:bg-slate-200 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">For Candidates</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="/jobs" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Browse All Jobs
                </a>
              </li>
              <li>
                <a href="/companies" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Top Companies
                </a>
              </li>
              <li>
                <a href="/candidate/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Candidate Dashboard
                </a>
              </li>
              <li>
                <a href="/candidate/resumes" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Resume Builder
                </a>
              </li>
              <li>
                <a href="/candidate/applications" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Application Tracker
                </a>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">For Recruiters</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="/recruiter/jobs/new" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="/recruiter/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Employer Dashboard
                </a>
              </li>
              <li>
                <a href="/recruiter/pipeline" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Hiring Pipeline
                </a>
              </li>
              <li>
                <a href="/recruiter/analytics" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Recruiter Analytics
                </a>
              </li>
              <li>
                <a href="/register" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Hire Talent
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Popular Fields</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="/jobs?category=software-engineering" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Software Engineering
                </a>
              </li>
              <li>
                <a href="/jobs?category=data-science-ai" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Data Science & AI
                </a>
              </li>
              <li>
                <a href="/jobs?category=product-design" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Product & Design
                </a>
              </li>
              <li>
                <a href="/jobs?category=cloud-devops" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Cloud & DevOps
                </a>
              </li>
              <li>
                <a href="/jobs?category=cybersecurity" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Cybersecurity
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} CareerHub Inc. All rights reserved. Built for recruitment excellence.</p>
          <div className="flex items-center gap-6">
            <a href="/about" className="hover:text-slate-700">About</a>
            <a href="#" className="hover:text-slate-700">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700">Terms of Service</a>
            <a href="#" className="hover:text-slate-700">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
