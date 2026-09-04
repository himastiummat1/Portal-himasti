// HIMASTI Enterprise Service Worker v2.0.0 (Offline Mesh & Background Sync)
const CACHE_NAME = 'himasti-enterprise-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/absen',
  '/images/logo_himasti.jpg',
  '/manifest.json'
];

const DB_NAME = 'himasti_next_offline_v1';
const STORE_NAME = 'pending_absensis';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Cache & Network Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Static assets (images, fonts, scripts) -> Stale While Revalidate
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // HTML pages -> Network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((res) => {
        if (res) return res;
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/absen');
        }
      });
    })
  );
});

// ==========================================
// BACKGROUND SYNC API (Zero Internet Hall Sync)
// ==========================================

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-attendance') {
    event.waitUntil(processBackgroundAttendanceSync());
  }
});

function openServiceWorkerDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getUnsyncedRecords() {
  try {
    const db = await openServiceWorkerDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const records = (req.result || []).filter((r) => !r.is_synced);
        resolve(records);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[SW] Gagal membaca IndexedDB:', err);
    return [];
  }
}

async function deleteSyncedRecords(syncedIds) {
  if (!syncedIds || syncedIds.length === 0) return;
  try {
    const db = await openServiceWorkerDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const id of syncedIds) {
      store.delete(id);
    }
  } catch (err) {
    console.error('[SW] Gagal menghapus record synced di IndexedDB:', err);
  }
}

async function processBackgroundAttendanceSync() {
  const records = await getUnsyncedRecords();
  if (records.length === 0) return;

  try {
    const response = await fetch('/api/absen/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records }),
    });

    if (!response.ok) {
      throw new Error(`Sync server responded with status ${response.status}`);
    }

    const data = await response.json();
    const syncedIds = records.map((r) => r.local_id).filter(Boolean);
    await deleteSyncedRecords(syncedIds);

    // Kirim notifikasi push/lokal ke pengguna jika didukung
    if (self.registration && 'showNotification' in self.registration) {
      const count = data.syncedCount || records.length;
      self.registration.showNotification('Presensi HIMASTI Terkirim', {
        body: `${count} kehadiran aula berhasil disinkronkan otomatis ke server!`,
        icon: '/images/logo_himasti.jpg',
        badge: '/images/logo_himasti.jpg',
        tag: 'attendance-sync-success',
      });
    }

    // Beritahu tab yang sedang aktif untuk me-refresh UI
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({
        type: 'ATTENDANCE_SYNCED',
        count: data.syncedCount,
      });
    }
  } catch (err) {
    console.error('[SW] Background sync gagal, akan dicoba kembali nanti:', err);
    throw err; // Lempar error agar browser menjadwalkan retry sync
  }
}

// Handler saat notifikasi di-klik
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/absen') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/absen');
      }
    })
  );
});
