'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Waduh! Ada Error Nih 😭</h2>
        <div className="bg-gray-100 p-4 rounded text-sm text-red-800 font-mono mb-4 break-words overflow-auto">
          {error.message || "Unknown error"}
        </div>
        <p className="text-sm text-gray-500 mb-4">Digest: {error.digest}</p>
        <button onClick={() => reset()} className="px-4 py-2 bg-red-600 text-white rounded">Coba Lagi</button>
      </div>
    </div>
  )
}
