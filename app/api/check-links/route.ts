import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
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
  const broken = []

  for (const show of shows) {
    if (!show.video_url) {
      broken.push({ title: show.title, url: 'No video URL set' })
      continue
    }
    try {
      const check = await fetch(show.video_url, { method: 'HEAD' })
      if (!check.ok) broken.push({ title: show.title, url: show.video_url })
    } catch {
      broken.push({ title: show.title, url: show.video_url })
    }
  }

  if (broken.length > 0) {
    await resend.emails.send({
      from: 'Drama Land <onboarding@resend.dev>',
      to: 'support@discoverdramaland.com', 
      subject: `⚠️ ${broken.length} Broken Video Links on Drama Land`,
      html: `
        <h2>Broken Video Links</h2>
        <p>${broken.length} broken links found out of ${shows.length} shows checked.</p>
        <ul>
          ${broken.map(b => `<li><strong>${b.title}</strong><br/>${b.url}</li>`).join('')}
        </ul>
        <p><a href="https://discoverdramaland.com/admin">Fix them in your admin panel</a></p>
      `
    })
  }

  return NextResponse.json({ checked: shows.length, broken: broken.length })
}