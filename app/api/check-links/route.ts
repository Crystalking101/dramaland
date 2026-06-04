import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const res = await fetch(
      supabaseUrl + '/rest/v1/Episodes?select=id,show_id,video_url',
      {
        headers: {
          apikey: supabaseKey!,
          Authorization: 'Bearer ' + supabaseKey!,
        },
      }
    )

    const episodes = await res.json()

    if (!Array.isArray(episodes)) {
      return NextResponse.json({ error: 'Supabase error', details: episodes }, { status: 500 })
    }

    const missing = episodes.filter((ep: any) => !ep.video_url || ep.video_url.trim() === '')

    if (missing.length > 0) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Drama Land <onboarding@resend.dev>',
          to: 'support@discoverdramaland.com',
          subject: '⚠️ ' + missing.length + ' Episodes Missing Video Links on Drama Land',
          html: '<h2>Episodes Missing Video Links</h2><p>' + missing.length + ' episodes have no video URL out of ' + episodes.length + ' total.</p><ul>' + missing.map((b: any) => '<li>' + b.show_id + '</li>').join('') + '</ul><p><a href="https://discoverdramaland.com/admin">Fix them in your admin panel</a></p>'
        })
      })
    }

    return NextResponse.json({ checked: episodes.length, missing: missing.length })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}