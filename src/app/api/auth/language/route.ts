import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { guestId, language } = await request.json()

  if (!guestId || !language) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('guests')
    .update({ language })
    .eq('id', guestId)

  if (error) {
    return NextResponse.json({ error: 'Erro ao salvar idioma' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}