import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?select=id,title,video_url`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    )

    const shows = await res.json()
    if (!Array.isArray(shows)) {
      return NextResponse.json({ error: 'Supabase error', details: shows }, { status: 500 })
    }
    const missing = shows.filter((show: any) => !show.video_url || show.video_url.trim() === '')
    if (missing.length > 0) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Drama Land <onboarding@resend.dev>',
          to: 'support@discoverdramaland.com',
          subject: `⚠️ ${missing.length} Shows Missing Video Links on Drama Land`,
          html: `
            <h2>Shows Missing Video Links</h2>
            <p>${missing.length} shows have no video URL out of ${shows.length} total shows.</p>
            <ul>
              ${missing.map((b: any) => `<li><strong>${b.title}</strong></li>`).join('')}
            </ul>
            <p><a href="https://discoverdramaland.com/admin">Fix them in your admin panel</a></p>
          `
        })
      })
    }

    return NextResponse.json({ checked: shows.length, missing: missing.length })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}