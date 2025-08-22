import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData()
  const status = formData.get('status') as string

  const { error } = await supabase.from('rsvps').insert({
    user_id: 1,
    event_id: params.id,
    status,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL(`/events/${params.id}`, req.url))
}
