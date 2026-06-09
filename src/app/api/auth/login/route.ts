import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { phone } = await request.json()

  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 })
  }

  const digits = phone.replace(/\D/g, '')

  // Find guest by phone
  const { data: guest, error: guestError } = await supabaseAdmin
    .from('guests')
    .select('id, name, language, family_id')
    .eq('phone', digits)
    .single()

  if (guestError || !guest) {
    return NextResponse.json({ error: 'Number not found' }, { status: 404 })
  }

  // Load all family members
  const { data: members } = await supabaseAdmin
    .from('guests')
    .select('id, name')
    .eq('family_id', guest.family_id)

  return NextResponse.json({
    guest: {
      ...guest,
      members: members || [],
    },
  })
}