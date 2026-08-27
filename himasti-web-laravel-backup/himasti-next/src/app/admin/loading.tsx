export default function Loading() {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Mengambil data dari server...</p>
    </div>
  );
}
