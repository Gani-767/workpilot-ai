"use client"

import React, { useState, useEffect } from 'react'
import { Plus, User, Settings, Trash2, Edit3, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/api/employees')
        const data = await res.json()
        setEmployees(data)
      } catch (error) {
        console.error("Failed to fetch employees", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEmployees()
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
          <h1 className="text-3xl font-bold text-slate-900">AI Employees</h1>
          <p className="text-slate-500">Manage your AI workforce and their personas</p>
        </div>
        <button
          onClick={() => router.push('/employees/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No AI Employees yet</h3>
          <p className="text-slate-500 mb-6">Start by creating your first AI employee to delegate work.</p>
          <button
            onClick={() => router.push('/employees/new')}
            className="text-blue-600 font-medium hover:underline"
          >
            Create your first AI employee &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp: any) => (
            <div key={emp.id} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/employees/${emp.id}`)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{emp.name}</h3>
              <p className="text-sm font-medium text-blue-600 mb-3">{emp.role}</p>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                {emp.systemPrompt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {emp.status}
                </span>
                <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  View Activity
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
