import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Pill,
  Activity,
  Bell,
  TrendingUp,
  ChevronRight,
  Clock,
} from 'lucide-react'

// ─── Carte de résumé ───────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, color, to }) => (
  <Link
    to={to}
    className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <ChevronRight size={18} className="text-gray-400" />
  </Link>
)

// ─── Rappel item ───────────────────────────────────────────
const ReminderItem = ({ name, time, taken }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${taken ? 'bg-green-400' : 'bg-orange-400'}`} />
      <div>
        <p className="text-sm font-medium text-gray-700">{name}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Clock size={11} /> {time}
        </p>
      </div>
    </div>
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
      taken
        ? 'bg-green-50 text-green-600'
        : 'bg-orange-50 text-orange-600'
    }`}>
      {taken ? 'Pris' : 'En attente'}
    </span>
  </div>
)

// ─── Mesure item ───────────────────────────────────────────
const MeasureItem = ({ label, value, unit, date }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-400">{date}</p>
    </div>
    <p className="text-sm font-bold text-blue-600">
      {value} <span className="text-gray-400 font-normal">{unit}</span>
    </p>
  </div>
)

// ─── Page principale ───────────────────────────────────────
const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth)

  // Données simulées (seront remplacées par l'API plus tard)
  const summaryData = [
    { icon: Pill, label: 'Médicaments actifs', value: 3, color: 'bg-blue-500', to: '/medications' },
    { icon: Bell, label: 'Rappels aujourd\'hui', value: 5, color: 'bg-orange-500', to: '/reminders' },
    { icon: Activity, label: 'Mesures ce mois', value: 12, color: 'bg-green-500', to: '/measures' },
    { icon: TrendingUp, label: 'Statistiques', value: '↗', color: 'bg-purple-500', to: '/stats' },
  ]

  const reminders = [
    { name: 'Paracétamol 500mg', time: '08:00', taken: true },
    { name: 'Metformine 850mg', time: '12:00', taken: false },
    { name: 'Amlodipine 5mg', time: '20:00', taken: false },
  ]

  const measures = [
    { label: 'Tension artérielle', value: '120/80', unit: 'mmHg', date: "Aujourd'hui 09:00" },
    { label: 'Glycémie', value: '5.4', unit: 'mmol/L', date: "Aujourd'hui 07:30" },
    { label: 'Poids', value: '72', unit: 'kg', date: 'Hier 08:00' },
  ]

  return (
    <div className="space-y-6">

      {/* Message de bienvenue */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Bonjour, {user?.name || 'Utilisateur'} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Voici votre résumé de santé du jour
        </p>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* Rappels + Mesures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Rappels du jour */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Bell size={18} className="text-orange-500" />
              Rappels du jour
            </h2>
            <Link to="/reminders" className="text-xs text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {reminders.map((r, i) => (
            <ReminderItem key={i} {...r} />
          ))}
        </div>

        {/* Dernières mesures */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Activity size={18} className="text-green-500" />
              Dernières mesures
            </h2>
            <Link to="/measures" className="text-xs text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {measures.map((m, i) => (
            <MeasureItem key={i} {...m} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default DashboardPage