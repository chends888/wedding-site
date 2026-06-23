'use client'

import { useState, useRef } from 'react'

type Guest = {
  id: string
  name: string
  phone: string | null
  family_id: string | null
}

type Rsvp = {
  guest_id: string
  confirmed: boolean
  shoe_size: string | null
  updated_at: string
}

type Row = {
  name: string
  phone: string
  family: string
  confirmed: string
  shoe_size: string | null
  updated_at: string
}

const SIZE_LABELS: Record<string, string> = {
  'EU17': 'BR 17', 'EU18': 'BR 18', 'EU19': 'BR 19',
  'EU20': 'BR 20', 'EU21': 'BR 21', 'EU22': 'BR 22',
  'EU23': 'BR 23', 'EU24': 'BR 24', 'EU25': 'BR 25',
  'EU26': 'BR 26', 'EU27': 'BR 27', 'EU28': 'BR 28',
  'EU29': 'BR 29', 'EU30': 'BR 30', 'EU31': 'BR 31',
  'EU32': 'BR 32',
  'BR33': 'BR 33', 'BR34': 'BR 34', 'BR35': 'BR 35',
  'BR36': 'BR 36', 'BR37': 'BR 37', 'BR38': 'BR 38',
  'BR39': 'BR 39', 'BR40': 'BR 40', 'BR41': 'BR 41',
  'BR42': 'BR 42', 'BR43': 'BR 43', 'BR44': 'BR 44',
  'BR45': 'BR 45',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [sortCol, setSortCol] = useState<keyof Row>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const passwordRef = useRef<HTMLInputElement>(null)

  function toggleSort(col: keyof Row) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const sortedRows = [...rows].sort((a, b) => {
    const valA = (a[sortCol] ?? '').toLowerCase()
    const valB = (b[sortCol] ?? '').toLowerCase()
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  async function handleLoad() {
    setLoading(true)
    setError('')

    const actualPassword = passwordRef.current?.value || password
    const res = await fetch(`/api/admin?password=${encodeURIComponent(actualPassword)}`)
    const data = await res.json()

    if (!res.ok) {
      setError('Wrong password')
      setLoading(false)
      return
    }

    const guests: Guest[] = data.guests
    const rsvps: Rsvp[] = data.rsvps
    const families: { id: string; name: string }[] = data.families

    const familyMap: Record<string, string> = {}
    for (const f of families) {
      familyMap[f.id] = f.name
    }

    const processed: Row[] = guests.map((g: Guest) => {
      const rsvp = rsvps.find((r: Rsvp) => r.guest_id === g.id)
      return {
        name: g.name,
        phone: g.phone || '-',
        family: g.family_id ? (familyMap[g.family_id] || '-') : '-',
        confirmed: rsvp === undefined ? 'Pending' : rsvp.confirmed ? 'Yes' : 'No',
        shoe_size: rsvp?.shoe_size || null,
        updated_at: rsvp?.updated_at ? new Date(rsvp.updated_at).toLocaleDateString() : '-',
      }
    })

    setRows(processed)
    setLoaded(true)
    setLoading(false)
  }

  function exportCsv() {
    const headers = ['Name', 'Phone', 'Family', 'Confirmed', 'Shoe Size', 'Updated at']
    const csvRows = [headers, ...rows.map((r) => [r.name, r.phone, r.family, r.confirmed, r.shoe_size || '-', r.updated_at])]
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
  const sizeSummary = rows
    .filter((r) => r.confirmed === 'Yes' && r.shoe_size)
    .reduce((acc, r) => {
      acc[r.shoe_size!] = (acc[r.shoe_size!] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const sortedSizes = Object.entries(sizeSummary).sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { numeric: true })
  )

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>

      {!loaded ? (
        <div className="space-y-3 max-w-sm">
          <input
            ref={passwordRef}
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
            disabled={loading}
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
          {sortedSizes.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold">Flip-flop size summary (confirmed guests)</h2>
              <table className="text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-8">Size</th>
                    <th className="text-left py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSizes.map(([size, count]) => (
                    <tr key={size} className="border-b">
                      <td className="py-2 pr-8">{SIZE_LABELS[size] || size}</td>
                      <td className="py-2">{count}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="py-2 pr-8">Total</td>
                    <td className="py-2">{sortedSizes.reduce((acc, [, count]) => acc + count, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  {(['name', 'phone', 'family', 'confirmed', 'shoe_size', 'updated_at'] as (keyof Row)[]).map((col) => (
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
                    <td className="py-2 pr-4">{row.family}</td>
                    <td className="py-2 pr-4">
                      <span className={
                        row.confirmed === 'Yes' ? 'text-green-600' :
                        row.confirmed === 'No' ? 'text-red-500' :
                        'text-gray-400'
                      }>
                        {row.confirmed}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{row.shoe_size ? (SIZE_LABELS[row.shoe_size] || row.shoe_size) : '-'}</td>
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