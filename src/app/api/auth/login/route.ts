import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { phone } = await request.json()

  if (!phone) {
    return NextResponse.json({ error: 'Telefone obrigatório' }, { status: 400 })
  }

  const digits = phone.replace(/\D/g, '')

  // Busca o líder pelo telefone
  const { data: leader, error: leaderError } = await supabaseAdmin
    .from('guests')
    .select('id, name, language')
    .eq('phone', digits)
    .single()

  if (leaderError || !leader) {
    return NextResponse.json({ error: 'Número não encontrado' }, { status: 404 })
  }

  // Busca os dependentes
  const { data: dependents } = await supabaseAdmin
    .from('guests')
    .select('id, name')
    .eq('parent_id', leader.id)

  return NextResponse.json({
    guest: {
      ...leader,
      dependents: dependents || [],
    },
  })
}