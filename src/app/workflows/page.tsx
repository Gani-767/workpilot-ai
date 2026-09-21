"use client"

import React, { useState, useEffect } from 'react'
import { Loader2, Plus, Calendar, Play, Trash2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch('/api/workflows')
        const data = await res.json()
        setWorkflows(data)
      } catch (error) {
        console.error("Failed to fetch workflows", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWorkflows()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scheduled Workflows</h1>
          <p className="text-slate-500">Automate your AI employees with recurring jobs</p>
        </div>
        <button
          onClick={() => router.push('/workflows/builder')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Workflow
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No workflows scheduled</h3>
          <p className="text-slate-500 mb-6">Create a workflow to let your AI employees work on autopilot.</p>
          <button
            onClick={() => router.push('/workflows/builder')}
            className="text-blue-600 font-medium hover:underline"
          >
            Build your first workflow &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {workflows.map((wf: any) => (
            <div key={wf.id} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-300 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{wf.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" /> {wf.aiEmployee?.name || 'Unknown Agent'}
                    </span>
                    <span>•</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{wf.schedule}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Play className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
