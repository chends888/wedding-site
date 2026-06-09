'use client'

import { useState } from 'react'

type Guest = {
  id: string
  name: string
  phone: string | null
  parent_id: string | null
  language: string | null
}

type Rsvp = {
  guest_id: string
  confirmed: boolean
  updated_at: string
}

type Row = {
  name: string
  phone: string
  leader: string
  language: string
  confirmed: string
  updated_at: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [sortCol, setSortCol] = useState<keyof Row>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function toggleSort(col: keyof Row) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const sortedRows = [...rows].sort((a, b) => {
    const valA = a[sortCol].toLowerCase()
    const valB = b[sortCol].toLowerCase()
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  async function handleLoad() {
    setLoading(true)
    setError('')

    const res = await fetch(`/api/admin?password=${encodeURIComponent(password)}`)
    const data = await res.json()

    if (!res.ok) {
      setError('Senha incorreta')
      setLoading(false)
      return
    }

    const guests: Guest[] = data.guests
    const rsvps: Rsvp[] = data.rsvps

    const leaderMap: Record<string, string> = {}
    for (const g of guests) {
      if (!g.parent_id) leaderMap[g.id] = g.name
    }

    const processed: Row[] = guests.map((g) => {
      const rsvp = rsvps.find((r) => r.guest_id === g.id)
      return {
        name: g.name,
        phone: g.phone || '-',
        leader: g.parent_id ? (leaderMap[g.parent_id] || '-') : '-',
        language: g.language || '-',
        confirmed: rsvp === undefined ? 'Pending' : rsvp.confirmed ? 'Yes' : 'No',
        updated_at: rsvp?.updated_at ? new Date(rsvp.updated_at).toLocaleDateString() : '-',
      }
    })

    setRows(processed)
    setLoaded(true)
    setLoading(false)
  }

  function exportCsv() {
    const headers = ['Name', 'Phone', 'Leader', 'Language', 'Confirmed', 'Updated at']
    const csvRows = [headers, ...rows.map((r) => [r.name, r.phone, r.leader, r.language, r.confirmed, r.updated_at])]
    const csv = csvRows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rsvp.csv'
    a.click()
  }

  const confirmed = rows.filter((r) => r.confirmed === 'Yes').length
  const declined = rows.filter((r) => r.confirmed === 'No').length
  const pending = rows.filter((r) => r.confirmed === 'Pending').length

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>

      {!loaded ? (
        <div className="space-y-3 max-w-sm">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            className="w-full border rounded-lg px-4 py-3"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLoad}
            disabled={loading || !password}
            className="w-full bg-black text-white rounded-lg px-4 py-3 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Enter'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-6 text-sm">
            <span className="text-green-600 font-medium">✓ Confirmed: {confirmed}</span>
            <span className="text-red-500 font-medium">✗ Declined: {declined}</span>
            <span className="text-gray-500 font-medium">? Pending: {pending}</span>
          </div>

          <button
            onClick={exportCsv}
            className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
          >
            Export CSV
          </button>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  {(['name', 'phone', 'leader', 'language', 'confirmed', 'updated_at'] as (keyof Row)[]).map((col) => (
                    <th
                      key={col}
                      className="text-left py-2 pr-4 cursor-pointer hover:text-gray-400 select-none whitespace-nowrap"
                      onClick={() => toggleSort(col)}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1).replace('_', ' ')}{' '}
                      <span className="inline-block w-3 text-xs">
                        {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 pr-4">{row.name}</td>
                    <td className="py-2 pr-4">{row.phone}</td>
                    <td className="py-2 pr-4">{row.leader}</td>
                    <td className="py-2 pr-4">{row.language}</td>
                    <td className="py-2 pr-4">
                      <span className={
                        row.confirmed === 'Yes' ? 'text-green-600' :
                        row.confirmed === 'No' ? 'text-red-500' :
                        'text-gray-400'
                      }>
                        {row.confirmed}
                      </span>
                    </td>
                    <td className="py-2">{row.updated_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}