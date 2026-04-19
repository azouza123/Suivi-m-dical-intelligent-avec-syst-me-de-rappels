import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Pill, Activity, Bell, BarChart2, ChevronRight, Clock, TrendingUp, Loader2, CheckCircle2 } from 'lucide-react'
import medicationService from '../../services/medicationService'
import measureService from '../../services/measureService'
import reminderService from '../../services/reminderService'

const StatCard = ({ icon: Icon, label, value, sub, iconBg, iconColor, to }) => (
  <Link to={to} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
        <Icon size={18} className={iconColor} />
      </div>
      <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors" />
    </div>
    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{sub}</p>}
  </Link>
)

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const [medications, setMedications] = useState([])
  const [measures, setMeasures] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [medsRes, measRes, remRes] = await Promise.all([
          medicationService.getAll(),
          measureService.getAll(),
          reminderService.getAll(),
        ])
        setMedications(medsRes.data)
        setMeasures(measRes.data)
        setReminders(remRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const takenCount = reminders.filter((r) => r.taken).length
  const totalCount = reminders.length
  const observance = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Bonjour, {user?.name?.split(' ')[0] || 'Utilisateur'} 👋
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Voici votre résumé de santé du jour
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Pill} label="Médicaments actifs" value={medications.length}
          sub="en cours de traitement"
          iconBg="bg-blue-50 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400"
          to="/medications"
        />
        <StatCard
          icon={Bell} label="Rappels aujourd'hui" value={totalCount}
          sub={`${takenCount} pris · ${totalCount - takenCount} restants`}
          iconBg="bg-orange-50 dark:bg-orange-900/30" iconColor="text-orange-500 dark:text-orange-400"
          to="/reminders"
        />
        <StatCard
          icon={Activity} label="Mesures enregistrées" value={measures.length}
          sub="total historique"
          iconBg="bg-green-50 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400"
          to="/measures"
        />
        <StatCard
          icon={TrendingUp} label="Observance" value={`${observance}%`}
          sub="taux de prise aujourd'hui"
          iconBg="bg-purple-50 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400"
          to="/stats"
        />
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression du jour</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{takenCount}/{totalCount} médicaments pris</p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${observance}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">{observance}% d'observance</p>
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Rappels */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Rappels du jour</h3>
            </div>
            <Link to="/reminders" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Voir tout</Link>
          </div>

          {reminders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucun rappel aujourd'hui</p>
          ) : (
            <div className="space-y-1">
              {reminders.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${r.taken ? 'bg-green-50 dark:bg-green-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
                      {r.taken
                        ? <CheckCircle2 size={14} className="text-green-500" />
                        : <Clock size={14} className="text-orange-500" />
                      }
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${r.taken ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>{r.medicationName}</p>
                      <p className="text-xs text-gray-400">{r.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.taken ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                    {r.taken ? 'Pris' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mesures */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-green-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dernières mesures</h3>
            </div>
            <Link to="/measures" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Voir tout</Link>
          </div>

          {measures.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucune mesure enregistrée</p>
          ) : (
            <div className="space-y-1">
              {measures.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{m.label}</p>
                    <p className="text-xs text-gray-400">{m.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {m.value} <span className="text-xs font-normal text-gray-400">{m.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default DashboardPage