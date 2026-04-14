import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const TYPE_CONFIG = {
  blood_pressure: {
    label: 'Tension artérielle',
    unit: 'mmHg',
    color: '#ef4444',
    isBP: true,
  },
  weight: {
    label: 'Poids',
    unit: 'kg',
    color: '#3b82f6',
    isBP: false,
  },
  glucose: {
    label: 'Glycémie',
    unit: 'mmol/L',
    color: '#f97316',
    isBP: false,
  },
}

// Formate les données pour Recharts
const formatChartData = (measures, type) => {
  return measures
    .filter((m) => m.type === type)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map((m) => {
      if (type === 'blood_pressure') {
        const parts = m.value.split('/')
        return {
          date: `${m.date} ${m.time}`,
          Systolique: parts[0] ? parseInt(parts[0]) : null,
          Diastolique: parts[1] ? parseInt(parts[1]) : null,
        }
      }
      return {
        date: `${m.date} ${m.time}`,
        Valeur: parseFloat(m.value),
      }
    })
}

// Calcule les stats (min, max, moyenne)
const computeStats = (measures, type) => {
  const filtered = measures.filter((m) => m.type === type)
  if (filtered.length === 0) return null

  if (type === 'blood_pressure') {
    const systolics = filtered
      .map((m) => parseInt(m.value.split('/')[0]))
      .filter(Boolean)
    return {
      count: filtered.length,
      min: Math.min(...systolics),
      max: Math.max(...systolics),
      avg: Math.round(systolics.reduce((a, b) => a + b, 0) / systolics.length),
      note: 'Valeurs systoliques',
    }
  }

  const values = filtered.map((m) => parseFloat(m.value)).filter(Boolean)
  return {
    count: filtered.length,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
    note: null,
  }
}

// Tendance (hausse, baisse, stable)
const getTrend = (measures, type) => {
  const filtered = measures
    .filter((m) => m.type === type)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  if (filtered.length < 2) return 'stable'

  const getValue = (m) =>
    type === 'blood_pressure'
      ? parseInt(m.value.split('/')[0])
      : parseFloat(m.value)

  const last = getValue(filtered[filtered.length - 1])
  const prev = getValue(filtered[filtered.length - 2])

  if (last > prev) return 'up'
  if (last < prev) return 'down'
  return 'stable'
}

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={16} className="text-red-500" />
  if (trend === 'down') return <TrendingDown size={16} className="text-green-500" />
  return <Minus size={16} className="text-gray-400" />
}

const StatsPage = () => {
  const { measures } = useSelector((state) => state.measures)
  const [activeType, setActiveType] = useState('blood_pressure')

  const config = TYPE_CONFIG[activeType]
  const chartData = formatChartData(measures, activeType)
  const stats = computeStats(measures, activeType)
  const trend = getTrend(measures, activeType)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Statistiques 📈</h1>
        <p className="text-gray-500 text-sm mt-1">
          Visualisez l'évolution de vos indicateurs de santé
        </p>
      </div>

      {/* Sélecteur de type */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeType === type
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={activeType === type ? { backgroundColor: cfg.color } : {}}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Pas de données */}
      {chartData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Activity size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Aucune donnée pour {config.label}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Ajoutez des mesures dans la page Mesures
          </p>
        </div>
      ) : (
        <>
          {/* Cartes stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Mesures</p>
                <p className="text-2xl font-bold text-gray-800">{stats.count}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Minimum</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.min}
                  <span className="text-sm font-normal text-gray-400 ml-1">{config.unit}</span>
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Maximum</p>
                <p className="text-2xl font-bold text-red-500">
                  {stats.max}
                  <span className="text-sm font-normal text-gray-400 ml-1">{config.unit}</span>
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Moyenne</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.avg}
                    <span className="text-sm font-normal text-gray-400 ml-1">{config.unit}</span>
                  </p>
                  <TrendIcon trend={trend} />
                </div>
              </div>
            </div>
          )}

          {/* Graphique */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-1">
              Évolution — {config.label}
            </h2>
            {stats?.note && (
              <p className="text-xs text-gray-400 mb-4">{stats.note}</p>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(val) => val.split(' ')[0]}
                />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                {activeType === 'blood_pressure' ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="Systolique"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Diastolique"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey="Valeur"
                    stroke={config.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tableau récapitulatif */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Tableau récapitulatif</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Heure</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Valeur</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {measures
                  .filter((m) => m.type === activeType)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((m) => (
                    <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-600">{m.date}</td>
                      <td className="px-5 py-3 text-gray-600">{m.time}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: config.color }}>
                        {m.value} <span className="text-gray-400 font-normal">{config.unit}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 italic">{m.notes || '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  )
}

export default StatsPage