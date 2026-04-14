import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, CheckCircle2, Clock, XCircle, History } from 'lucide-react'
import {
  generateReminders,
  markAsTaken,
  markAsUntaken,
  addHistoryReminders,
} from '../../store/reminderSlice'

const TABS = ["Aujourd'hui", 'Historique']

const RemindersPage = () => {
  const dispatch = useDispatch()
  const { reminders } = useSelector((state) => state.reminders)
  const { medications } = useSelector((state) => state.medications)
  const [activeTab, setActiveTab] = useState("Aujourd'hui")

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (medications.length > 0) {
      dispatch(generateReminders(medications))
    }
  }, [medications])

  // Simule des données historiques pour les tests
  const simulateHistory = () => {
    if (medications.length === 0) return
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]

    const fakeHistory = medications.flatMap((med) =>
      med.times.flatMap((time) => [
        {
          id: `${med.id}-${time}-${yesterday}`,
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          time,
          date: yesterday,
          taken: true,
        },
        {
          id: `${med.id}-${time}-${twoDaysAgo}`,
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          time,
          date: twoDaysAgo,
          taken: false,
        },
      ])
    )

    // Evite les doublons
    const existingIds = reminders.map((r) => r.id)
    const newHistory = fakeHistory.filter((r) => !existingIds.includes(r.id))
    dispatch(addHistoryReminders(newHistory))
  }

  const todayReminders = reminders
    .filter((r) => r.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))

  const historyReminders = reminders
    .filter((r) => r.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))

  const takenCount = todayReminders.filter((r) => r.taken).length
  const totalCount = todayReminders.length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rappels 🔔</h1>
          <p className="text-gray-500 text-sm mt-1">
            Suivez vos prises de médicaments au quotidien
          </p>
        </div>
        {/* Bouton temporaire pour tester l'historique */}
        <button
          onClick={simulateHistory}
          className="text-xs px-3 py-2 border border-dashed border-gray-300 text-gray-400 rounded-lg hover:bg-gray-50"
        >
          🧪 Simuler historique
        </button>
      </div>

      {/* Résumé du jour */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Progression du jour</p>
            <p className="text-3xl font-bold mt-1">
              {takenCount} / {totalCount}
            </p>
            <p className="text-blue-100 text-sm mt-1">médicaments pris</p>
          </div>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeDasharray={`${totalCount > 0 ? (takenCount / totalCount) * 100 : 0} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === "Aujourd'hui" ? (
              <span className="flex items-center gap-2">
                <Clock size={15} /> {tab}
                {totalCount > 0 && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                    {totalCount}
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <History size={15} /> {tab}
                {historyReminders.length > 0 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {historyReminders.length}
                  </span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Aujourd'hui */}
      {activeTab === "Aujourd'hui" && (
        <div className="space-y-3">
          {todayReminders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Bell size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aucun rappel pour aujourd'hui</p>
              <p className="text-gray-400 text-sm mt-1">
                Ajoutez des médicaments actifs pour générer des rappels
              </p>
            </div>
          ) : (
            todayReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`bg-white rounded-2xl border p-4 flex items-center justify-between transition-all ${
                  reminder.taken ? 'border-green-100 bg-green-50/50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${reminder.taken ? 'bg-green-100' : 'bg-orange-50'}`}>
                    {reminder.taken
                      ? <CheckCircle2 size={20} className="text-green-500" />
                      : <Clock size={20} className="text-orange-500" />
                    }
                  </div>
                  <div>
                    <p className={`font-medium ${reminder.taken ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {reminder.medicationName}
                    </p>
                    <p className="text-xs text-gray-400">{reminder.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">{reminder.time}</span>
                  <button
                    onClick={() =>
                      reminder.taken
                        ? dispatch(markAsUntaken(reminder.id))
                        : dispatch(markAsTaken(reminder.id))
                    }
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      reminder.taken
                        ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {reminder.taken ? 'Annuler' : 'Marquer pris'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Historique */}
      {activeTab === 'Historique' && (
        <div className="space-y-3">
          {historyReminders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <History size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aucun historique disponible</p>
              <p className="text-gray-400 text-sm mt-1">
                Cliquez sur "Simuler historique" pour tester
              </p>
            </div>
          ) : (
            historyReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${reminder.taken ? 'bg-green-100' : 'bg-red-50'}`}>
                    {reminder.taken
                      ? <CheckCircle2 size={20} className="text-green-500" />
                      : <XCircle size={20} className="text-red-400" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{reminder.medicationName}</p>
                    <p className="text-xs text-gray-400">{reminder.date} à {reminder.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  reminder.taken
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-500'
                }`}>
                  {reminder.taken ? 'Pris' : 'Manqué'}
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