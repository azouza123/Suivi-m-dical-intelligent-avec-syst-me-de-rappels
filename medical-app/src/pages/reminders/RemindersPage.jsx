import { useEffect, useState } from 'react'
import { Bell, CheckCircle2, Clock, XCircle, History, Loader2 } from 'lucide-react'
import reminderService from '../../services/reminderService'

const TABS = ["Aujourd'hui", 'Historique']

const RemindersPage = () => {
  const [todayReminders, setTodayReminders] = useState([])
  const [historyReminders, setHistoryReminders] = useState([])
  const [activeTab, setActiveTab] = useState("Aujourd'hui")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [todayRes, histRes] = await Promise.all([
          reminderService.getAll(),
          reminderService.getHistory(),
        ])
        setTodayReminders(todayRes.data.sort((a, b) => a.time.localeCompare(b.time)))
        setHistoryReminders(histRes.data.sort((a, b) => b.date.localeCompare(a.date)))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const handleToggle = async (reminder) => {
    try {
      const newVal = !reminder.taken
      await reminderService.markTaken(reminder.id, newVal)
      setTodayReminders((prev) => prev.map((r) => r.id === reminder.id ? { ...r, taken: newVal } : r))
    } catch (e) { alert('Erreur') }
  }

  const takenCount = todayReminders.filter((r) => r.taken).length
  const totalCount = todayReminders.length
  const pct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Rappels</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Suivez vos prises de médicaments au quotidien</p>
      </div>

      {/* Progress card */}
      <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-blue-100 text-xs font-medium">Progression du jour</p>
            <p className="text-3xl font-semibold text-white mt-1">{takenCount}<span className="text-lg font-normal text-blue-200">/{totalCount}</span></p>
            <p className="text-blue-200 text-xs mt-0.5">médicaments pris</p>
          </div>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="white" strokeWidth="3"
                strokeDasharray={`${pct} 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">{pct}%</span>
          </div>
        </div>
        <div className="w-full bg-blue-500 rounded-full h-1.5 mt-2">
          <div className="bg-white h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === "Aujourd'hui" ? <Clock size={14} /> : <History size={14} />}
            {tab}
            {tab === "Aujourd'hui" && totalCount > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs px-1.5 py-0.5 rounded-full font-medium">
                {totalCount}
              </span>
            )}
            {tab === 'Historique' && historyReminders.length > 0 && (
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-1.5 py-0.5 rounded-full">
                {historyReminders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Today tab */}
      {activeTab === "Aujourd'hui" && (
        <div className="space-y-2">
          {todayReminders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell size={24} className="text-orange-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Aucun rappel pour aujourd'hui</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Ajoutez des médicaments actifs pour générer des rappels</p>
            </div>
          ) : (
            todayReminders.map((r) => (
              <div
                key={r.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  r.taken
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30'
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${r.taken ? 'bg-green-100 dark:bg-green-900/40' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
                    {r.taken
                      ? <CheckCircle2 size={18} className="text-green-500" />
                      : <Clock size={18} className="text-orange-500" />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${r.taken ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {r.medicationName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{r.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{r.time}</span>
                  <button
                    onClick={() => handleToggle(r)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      r.taken
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {r.taken ? 'Annuler' : 'Marquer pris'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'Historique' && (
        <div className="space-y-2">
          {historyReminders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <History size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Aucun historique disponible</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">L'historique de vos prises apparaîtra ici</p>
            </div>
          ) : (
            historyReminders.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${r.taken ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-50 dark:bg-red-900/30'}`}>
                    {r.taken
                      ? <CheckCircle2 size={18} className="text-green-500" />
                      : <XCircle size={18} className="text-red-400" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{r.medicationName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{r.date} à {r.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  r.taken
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                }`}>
                  {r.taken ? 'Pris' : 'Manqué'}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default RemindersPage