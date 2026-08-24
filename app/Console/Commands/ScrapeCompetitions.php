<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\CompetitionInfo;
use Carbon\Carbon;

class ScrapeCompetitions extends Command
{
    protected $signature = 'scrape:lomba';
    protected $description = 'Scrape Hackathon and IT Competitions from Google News RSS';

    public function handle()
    {
        $this->info('Mulai scraping RSS Feed untuk info lomba IT...');

        // Fetch Google News RSS for hackathon and IT competitions
        $url = 'https://news.google.com/rss/search?q=hackathon+OR+%22lomba+IT%22+when:30d&hl=id&gl=ID&ceid=ID:id';
        $response = Http::get($url);

        if (!$response->successful()) {
            $this->error('Gagal mengambil data dari RSS Feed!');
            return;
        }

        $xml = simplexml_load_string($response->body());
        
        if (!$xml) {
            $this->error('Gagal mem-parsing XML!');
            return;
        }

        $count = 0;
        
        foreach ($xml->channel->item as $item) {
            $title = (string) $item->title;
            $link = (string) $item->link;
            $pubDate = (string) $item->pubDate;
            $source = (string) $item->source;

            // Bersihkan nama organizer (contoh: "Tribun News" atau sejenisnya dari source)
            $organizer = $source ? $source : 'Portal Berita';

            // Filter judul agar hanya memasukkan yang relevan jika memungkinkan
            // (Walaupun search engine google sudah memfilter)
            
            // Cek duplikasi
            $exists = CompetitionInfo::where('title', $title)->first();
            
            if (!$exists) {
                // Konversi tanggal pubDate ke format MySQL
                $deadline = Carbon::parse($pubDate)->addDays(14)->format('Y-m-d'); // Mock deadline 14 hari setelah berita rilis
                
                CompetitionInfo::create([
                    'title' => substr($title, 0, 255),
                    'type' => stripos($title, 'hackathon') !== false ? 'Hackathon' : 'Lomba',
                    'organizer' => substr($organizer, 0, 255),
                    'description' => "Berita terbaru terkait IT kompetisi/hackathon dari $organizer. Baca selengkapnya melalui link berikut.",
                    'link' => $link,
                    'deadline' => $deadline,
                    'poster' => null
                ]);
                $count++;
            }
        }

        $this->info("Scraping selesai! {$count} info lomba/berita IT berhasil ditambahkan.");
    }
}
