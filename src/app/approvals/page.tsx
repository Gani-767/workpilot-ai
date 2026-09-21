"use client"

import React, { useState, useEffect } from 'react'
import { Loader2, Check, X, AlertCircle, ExternalLink } from 'lucide-react'

export default function ApprovalsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch('/api/approvals')
        const data = await res.json()
        setRequests(data)
      } catch (error) {
        console.error("Failed to fetch approvals", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  async function handleAction(requestId: string, action: 'APPROVE' | 'REJECT') {
    try {
      const res = await fetch(`/api/approvals/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      })

      if (res.ok) {
        setRequests(requests.filter(r => r.id !== requestId))
      } else {
        alert("Action failed")
      }
    } catch (error) {
      console.error("Error processing approval", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Approval Queue</h1>
        <p className="text-slate-500">Review and authorize proposed AI actions</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Queue is empty</h3>
          <p className="text-slate-500">No actions currently awaiting your approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <ApprovalCard key={req.id} request={req} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  )
}

function ApprovalCard({ request, onAction }: { request: any, onAction: (id: string, action: 'APPROVE' | 'REJECT') => void }) {
  const { proposedAction } = request;

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
            {proposedAction.tool}
          </span>
          <span className="text-slate-400 text-xs">
            Requested at {new Date(request.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAction(request.id, 'REJECT')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={() => onAction(request.id, 'APPROVE')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" /> Approve
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">AI Rationale</h4>
          <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg italic">
            "{proposedAction.aiResponse || 'No rationale provided'}"
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Proposed Data</h4>
          <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-auto max-h-40">
            <pre>{JSON.stringify(proposedAction.args, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
