"use client"

import React from 'react'
import { CheckCircle2, Play, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <span className="text-xl font-bold tracking-tight">WorkPilot AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Now in Founder's Beta
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          Delegate your repetitive work to <span className="text-blue-600">AI Employees</span> you actually trust.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          WorkPilot AI is a human-in-the-loop OS that lets you automate your sales, research, and operations without losing control.
          <span className="font-semibold text-slate-800"> Stage, Review, and Approve every action before it hits the real world.</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
            <Play className="w-5 h-5 fill-current" /> Watch Demo
          </button>
        </div>
      </section>

      {/* Video Placeholder Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-4">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all">
              <Play className="w-10 h-10 text-white fill-current ml-1" />
            </div>
            <p className="font-medium">Insert Demo Video Here</p>
          </div>
          {/* This is where the Loom/YouTube embed goes */}
        </div>
      </section>

      {/* Features / How it Works */}
      <section id="how-it-works" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Stage-and-Commit Architecture</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Stop worrying about AI hallucinations. We've built a safety layer between the AI and your customers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. AI Executes</h3>
            <p className="text-slate-600 leading-relaxed">Your AI employee researches leads and drafts personalized messages using real-time web data.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">2. Human Review</h3>
            <p className="text-slate-600 leading-relaxed">Every consequential action is staged in your Approval Queue. You review the rationale and the data.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Safe Commit</h3>
            <p className="text-slate-600 leading-relaxed">Once you click approve, WorkPilot executes the action via your real Gmail or Google Sheets account.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Founder's Beta Pricing</h2>
          <p className="text-slate-400 mb-12 text-lg">Join the first 5 companies to shape the future of AI automation.</p>

          <div className="bg-white text-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl font-bold text-xs uppercase">
              Limited Offer
            </div>
            <h3 className="text-2xl font-bold mb-2">Founder's Plan</h3>
            <div className="flex items-center justify-center gap-1 mb-6">
              <span className="text-4xl font-extrabold">₹999</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="text-left space-y-4 mb-10">
              {['Unlimited AI Employees', 'Full Approval Queue Access', 'Gmail & Sheets Integrations', 'Recurring Workflow Scheduler', 'Priority Feature Requests'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all">
              Join the Beta Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>© 2026 ERO'S Company. Built for the future of work.</p>
      </footer>
    </div>
  )
}
