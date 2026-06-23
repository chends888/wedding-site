import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function GET(request: NextRequest) {
  const password = request.nextUrl.searchParams.get('password')

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: families, error: familiesError } = await supabaseAdmin
    .from('families')
    .select('id, name')

  if (familiesError) {
    return NextResponse.json({ error: familiesError.message }, { status: 500 })
  }

  const { data: guests, error: guestsError } = await supabaseAdmin
    .from('guests')
    .select('id, name, phone, family_id')
    .order('name')

  if (guestsError) {
    return NextResponse.json({ error: guestsError.message }, { status: 500 })
  }

  const { data: rsvps, error: rsvpsError } = await supabaseAdmin
    .from('rsvp')
    .select('guest_id, confirmed, shoe_size, updated_at')

  if (rsvpsError) {
    return NextResponse.json({ error: rsvpsError.message }, { status: 500 })
  }

  return NextResponse.json({ guests, rsvps, families })
}