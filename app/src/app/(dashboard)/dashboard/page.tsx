export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Active Operators</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Gear Items</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>
      <div className="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Welcome to CommandCentered</h2>
        <p className="text-gray-400">
          Your production management system is ready. Start by creating your first event in the Planning section.
        </p>
      </div>
    </div>
  )
}
