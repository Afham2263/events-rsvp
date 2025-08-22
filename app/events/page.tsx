import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default async function EventsPage() {
  const { data: events } = await supabase.from('events').select('*').order('date', { ascending: true })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <ul className="space-y-4">
        {events?.map((event) => (
          <li key={event.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <p className="text-gray-500">{event.city} • {event.date}</p>
            <a 
              href={`/events/${event.id}`} 
              className="text-blue-500 underline mt-2 inline-block"
            >
              View Details
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
