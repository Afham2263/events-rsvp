import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: any) {
  const id = params.id
  const formData = await req.formData()
  const status = formData.get('status') as string

  const userId = '00000000-0000-0000-0000-000000000001' // replace with actual user UUID

  const { error } = await supabase.from('rsvps').insert({
    user_id: userId,
    event_id: id,
    status,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  
  return NextResponse.redirect(new URL(`/events/${id}`, req.url))
}
