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

    const broken = []

    for (const ep of episodes) {
      if (!ep.video_url || ep.video_url.trim() === '') {
        broken.push({ show_id: ep.show_id, url: 'No video URL set' })
        continue
      }

      // Check YouTube videos using oEmbed API
      if (ep.video_url.includes('youtube') || ep.video_url.includes('youtu.be')) {
        try {
          const check = await fetch('https://www.youtube.com/oembed?url=' + ep.video_url + '&format=json')
          if (!check.ok) {
            broken.push({ show_id: ep.show_id, url: ep.video_url })
          }
        } catch {
          broken.push({ show_id: ep.show_id, url: ep.video_url })
        }
      }

      // Check Dailymotion videos
      if (ep.video_url.includes('dailymotion') || ep.video_url.includes('dai.ly')) {
        try {
          const check = await fetch('https://www.dailymotion.com/services/oembed?url=' + ep.video_url + '&format=json')
          if (!check.ok) {
            broken.push({ show_id: ep.show_id, url: ep.video_url })
          }
        } catch {
          broken.push({ show_id: ep.show_id, url: ep.video_url })
        }
      }
    }

    if (broken.length > 0) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Drama Land <onboarding@resend.dev>',
          to: 'support@discoverdramaland.com',
          subject: '⚠️ ' + broken.length + ' Broken Video Links on Drama Land',
          html: '<h2>Broken Video Links</h2><p>' + broken.length + ' broken or missing videos found out of ' + episodes.length + ' total episodes.</p><ul>' + broken.map((b: any) => '<li>Show ID: ' + b.show_id + '<br/>' + b.url + '</li>').join('') + '</ul><p><a href="https://discoverdramaland.com/admin">Fix them in your admin panel</a></p>'
        })
      })
    }

    return NextResponse.json({ checked: episodes.length, broken: broken.length })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}