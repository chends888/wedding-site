import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids')?.split(',') || []

  if (!ids.length) {
    return NextResponse.json({ rsvps: [] })
  }

  const { data, error } = await supabaseAdmin
    .from('rsvp')
    .select('guest_id, confirmed, shoe_size, age_range')
    .in('guest_id', ids)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rsvps: data })
}

export async function POST(request: NextRequest) {
  const { guestId, confirmed, shoe_size, age_range } = await request.json()

  if (!guestId || confirmed === undefined) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('rsvp')
    .upsert(
      {
        guest_id: guestId,
        confirmed,
        shoe_size: shoe_size ?? null,
        age_range: age_range ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'guest_id' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}