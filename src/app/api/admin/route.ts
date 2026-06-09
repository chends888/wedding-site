import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function GET(request: NextRequest) {
  const password = request.nextUrl.searchParams.get('password')

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: guests, error: guestsError } = await supabaseAdmin
    .from('guests')
    .select('id, name, phone, parent_id, language')
    .order('name')

  if (guestsError) {
    return NextResponse.json({ error: guestsError.message }, { status: 500 })
  }

  const { data: rsvps, error: rsvpsError } = await supabaseAdmin
    .from('rsvp')
    .select('guest_id, confirmed, updated_at')

  if (rsvpsError) {
    return NextResponse.json({ error: rsvpsError.message }, { status: 500 })
  }

  return NextResponse.json({ guests, rsvps })
}