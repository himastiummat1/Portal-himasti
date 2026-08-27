import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || "himasti_cron_2026"}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = await fetch('https://devpost.com/api/hackathons?page=1', { cache: 'no-store' });
    const data = await res.json();
    
    await prisma.competitionInfo.deleteMany({
      where: { organizer: 'Devpost (Crawler)' }
    });

    const competitions = data.hackathons.slice(0, 10).map((h: any) => {
      let deadline = null;
      try {
        if (h.submission_period_dates) {
          const parts = h.submission_period_dates.split(' - ');
          const dateStr = parts.length > 1 ? parts[1] : parts[0];
          deadline = new Date(dateStr);
        }
      } catch (e) {}

      let poster = h.thumbnail_url;
      if (poster && poster.startsWith('//')) poster = 'https:' + poster;

      return {
        title: h.title,
        type: 'Hackathon Internasional',
        organizer: 'Devpost (Crawler)',
        description: `Tema: ${h.themes ? h.themes.map((t: any) => t.name).join(', ') : 'Bebas'}. Hadiah: ${h.prize_amount ? h.prize_amount.replace(/<[^>]+>/g, '') : 'TBA'}`,
        link: h.url,
        deadline: deadline && !isNaN(deadline.getTime()) ? deadline : null,
        poster: poster || null
      };
    });

    await prisma.competitionInfo.createMany({
      data: competitions
    });

    revalidatePath('/');
    return NextResponse.json({ success: true, count: competitions.length, data: competitions });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
