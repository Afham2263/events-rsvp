'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState<any>(null)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase.from('events').select('*').eq('id', id).single()
      setEvent(data)
    }
    fetchEvent()
  }, [id])

  const handleRSVP = async (rsvpStatus: string) => {
    setStatus(rsvpStatus)

    const userId = '00000000-0000-0000-0000-000000000001' // fake user for demo

    const { error } = await supabase.from('rsvps').upsert(
      {
        user_id: userId,
        event_id: id,
        status: rsvpStatus,
      },
      { onConflict: 'user_id,event_id' }
    )

    if (error) {
      setMessage('Error saving RSVP.')
    } else {
      setMessage(`RSVP saved: ${rsvpStatus}`)
    }
  }

  if (!event) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{event.description}</p>
      <p className="mt-2">{event.city} • {event.date}</p>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => handleRSVP('Yes')}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Yes
        </button>
        <button
          onClick={() => handleRSVP('No')}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          No
        </button>
        <button
          onClick={() => handleRSVP('Maybe')}
          className="px-4 py-2 bg-yellow-500 text-black rounded"
        >
          Maybe
        </button>
      </div>

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  )
}
