import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Activity, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react'
import measureService from '../../services/measureService'

const TYPE_CONFIG = {
  blood_pressure: { label: 'Tension artérielle', unit: 'mmHg', color: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-500', isBP: true },
  weight:         { label: 'Poids',              unit: 'kg',    color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-500', isBP: false },
  glucose:        { label: 'Glycémie',           unit: 'mmol/L',color: '#f97316', bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-500', isBP: false },
}

const formatChartData = (measures, type) =>
  measures
    .filter((m) => m.type === type)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map((m) => {
      if (type === 'blood_pressure') {
        const [sys, dia] = m.value.split('/')
        return { date: m.date, Systolique: parseInt(sys) || null, Diastolique: parseInt(dia) || null }
      }
      return { date: m.date, Valeur: parseFloat(m.value) }
    })

const computeStats = (measures, type) => {
  const f = measures.filter((m) => m.type === type)
  if (!f.length) return null
  const vals = type === 'blood_pressure'
    ? f.map((m) => parseInt(m.value.split('/')[0])).filter(Boolean)
    : f.map((m) => parseFloat(m.value)).filter(Boolean)
  return {
    count: f.length,
    min: Math.min(...vals),
    max: Math.max(...vals),
    avg: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10,
    note: type === 'blood_pressure' ? 'Valeurs systoliques' : null,
  }
}

const getTrend = (measures, type) => {
  const f = measures.filter((m) => m.type === type).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  if (f.length < 2) return 'stable'
  const val = (m) => type === 'blood_pressure' ? parseInt(m.value.split('/')[0]) : parseFloat(m.value)
  const last = val(f[f.length - 1]), prev = val(f[f.length - 2])
  return last > prev ? 'up' : last < prev ? 'down' : 'stable'
}

const StatsPage = () => {
  const [measures, setMeasures] = useState([])
  const [activeType, setActiveType] = useState('blood_pressure')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    measureService.getAll()
      .then((r) => setMeasures(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const config = TYPE_CONFIG[activeType]
  const chartData = formatChartData(measures, activeType)
  const stats = computeStats(measures, activeType)
  const trend = getTrend(measures, activeType)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statistiques</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Visualisez l'évolution de vos indicateurs de santé</p>
      </div>

      {/* Type selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              activeType === type
                ? 'text-white border-transparent'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            style={activeType === type ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* No data */}
      {chartData.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
          <div className={`w-14 h-14 ${config.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Activity size={24} className={config.text} />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Aucune donnée pour {config.label}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Ajoutez des mesures dans la page Mesures</p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Mesures', value: stats.count, unit: '', sub: 'total' },
                { label: 'Minimum', value: stats.min, unit: config.unit, sub: 'valeur minimale' },
                { label: 'Maximum', value: stats.max, unit: config.unit, sub: 'valeur maximale' },
                { label: 'Moyenne', value: stats.avg, unit: config.unit, sub: stats.note || 'moyenne globale', trend: true },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
                  <div className="flex items-end gap-1">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{s.value}</p>
                    {s.unit && <p className="text-xs text-gray-400 mb-1">{s.unit}</p>}
                    {s.trend && (
                      <div className="mb-1 ml-1">
                        {trend === 'up' && <TrendingUp size={14} className="text-red-400" />}
                        {trend === 'down' && <TrendingDown size={14} className="text-green-400" />}
                        {trend === 'stable' && <Minus size={14} className="text-gray-400" />}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Évolution — {config.label}</h3>
              {stats?.note && <p className="text-xs text-gray-400 mt-0.5">{stats.note}</p>}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px', background: 'white' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {activeType === 'blood_pressure' ? (
                  <>
                    <Line type="monotone" dataKey="Systolique" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Diastolique" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} activeDot={{ r: 5 }} />
                  </>
                ) : (
                  <Line type="monotone" dataKey="Valeur" stroke={config.color} strokeWidth={2} dot={{ r: 3, fill: config.color }} activeDot={{ r: 5 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Tableau récapitulatif</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Heure</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Valeur</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {measures.filter((m) => m.type === activeType).sort((a, b) => b.date.localeCompare(a.date)).map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{m.date}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{m.time}</td>
                    <td className="px-5 py-3 font-semibold" style={{ color: config.color }}>
                      {m.value} <span className="text-gray-400 font-normal text-xs">{config.unit}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 dark:text-gray-500 italic text-xs">{m.notes || '—'}</td>
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