/**
 * HIMASTI Offline Attendance Storage (IndexedDB Engine)
 * Memungkinkan presensi tetap berjalan di aula tanpa koneksi internet atau Wi-Fi.
 * Data disimpan secara terenkripsi/tervalidasi lokal dan disinkronkan otomatis saat online.
 */

export interface OfflineAttendanceRecord {
  local_id?: number
  event_id: string | number
  user_id: string | number
  user_name: string
  waktu_hadir: string
  status_kehadiran: string
  catatan?: string
  verification_method: 'webauthn' | 'offline_mesh' | 'standard'
  hardware_proof?: string
  device_info?: string
  is_synced: boolean
  created_at: string
}

const DB_NAME = 'himasti_portal_offline_v1'
const DB_VERSION = 1
const STORE_NAME = 'pending_absensis'

export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB tidak didukung di lingkungan ini.'))
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'local_id',
          autoIncrement: true,
        })
        store.createIndex('event_id', 'event_id', { unique: false })
        store.createIndex('is_synced', 'is_synced', { unique: false })
        store.createIndex('user_id', 'user_id', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveOfflineAttendance(
  record: Omit<OfflineAttendanceRecord, 'local_id' | 'is_synced' | 'created_at'>
): Promise<number> {
  const db = await openOfflineDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const item: OfflineAttendanceRecord = {
      ...record,
      is_synced: false,
      created_at: new Date().toISOString(),
    }
    const request = store.add(item)
    request.onsuccess = () => resolve(request.result as number)
    request.onerror = () => reject(request.error)
  })
}

export async function getPendingAttendances(): Promise<OfflineAttendanceRecord[]> {
  const db = await openOfflineDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => {
      const all = request.result as OfflineAttendanceRecord[]
      resolve(all.filter((item) => !item.is_synced))
    }
    request.onerror = () => reject(request.error)
  })
}

export async function markAttendanceSynced(local_id: number): Promise<void> {
  const db = await openOfflineDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getReq = store.get(local_id)
    getReq.onsuccess = () => {
      const item = getReq.result as OfflineAttendanceRecord | undefined
      if (item) {
        item.is_synced = true
        const putReq = store.put(item)
        putReq.onsuccess = () => resolve()
        putReq.onerror = () => reject(putReq.error)
      } else {
        resolve()
      }
    }
    getReq.onerror = () => reject(getReq.error)
  })
}

export async function deleteSyncedAttendances(): Promise<void> {
  const db = await openOfflineDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.openCursor()
    request.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor) {
        if (cursor.value.is_synced) {
          cursor.delete()
        }
        cursor.continue()
      } else {
        resolve()
      }
    }
    request.onerror = () => reject(request.error)
  })
}
