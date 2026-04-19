import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, Activity, Droplets, Weight, Heart, Loader2 } from 'lucide-react'
import { setMeasures, addMeasure } from '../../store/measureSlice'
import measureService from '../../services/measureService'
import MeasureForm from '../../components/common/MeasureForm'

const TYPE_CONFIG = {
  blood_pressure: { label: 'Tension artérielle', icon: Heart,    color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/30',    border: 'border-red-100 dark:border-red-900/50' },
  weight:         { label: 'Poids',              icon: Weight,   color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/30',  border: 'border-blue-100 dark:border-blue-900/50' },
  glucose:        { label: 'Glycémie',           icon: Droplets, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-100 dark:border-orange-900/50' },
}

const FILTERS = ['Toutes', 'Tension artérielle', 'Poids', 'Glycémie']

const MeasuresPage = () => {
  const dispatch = useDispatch()
  const { measures } = useSelector((state) => state.measures)
  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Toutes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    measureService.getAll()
      .then((r) => dispatch(setMeasures(r.data)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (data) => {
    try {
      const r = await measureService.create(data)
      dispatch(addMeasure(r.data))
      setShowForm(false)
    } catch (e) { alert("Erreur lors de l'ajout") }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette mesure ?')) return
    try {
      await measureService.delete(id)
      dispatch(setMeasures(measures.filter((m) => m.id !== id)))
    } catch (e) { alert('Erreur lors de la suppression') }
  }

  const filtered = activeFilter === 'Toutes'
    ? measures
    : measures.filter((m) => m.label === activeFilter)

  const getLatest = (type) => measures.filter((m) => m.type === type).at(-1)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mesures médicales</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Suivez l'évolution de vos indicateurs de santé</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(TYPE_CONFIG).map(([type, config]) => {
          const latest = getLatest(type)
          const Icon = config.icon
          return (
            <div key={type} className={`bg-white dark:bg-gray-900 border ${config.border} rounded-xl p-4 flex items-center gap-4`}>
              <div className={`w-11 h-11 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={config.color} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{config.label}</p>
                {latest ? (
                  <>
                    <p className={`text-lg font-semibold ${config.color}`}>
                      {latest.value} <span className="text-xs font-normal text-gray-400">{latest.unit}</span>
                    </p>
                    <p className="text-xs text-gray-400 truncate">{latest.date}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Aucune mesure</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
          <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity size={24} className="text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Aucune mesure enregistrée</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Cliquez sur "Ajouter" pour commencer</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valeur</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Heure</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {[...filtered].reverse().map((measure) => {
                const config = TYPE_CONFIG[measure.type]
                const Icon = config?.icon || Activity
                return (
                  <tr key={measure.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 ${config?.bg || 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                          <Icon size={13} className={config?.color || 'text-gray-400'} />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">{measure.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{measure.value}</span>
                      <span className="text-xs text-gray-400 ml-1">{measure.unit}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{measure.date}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{measure.time}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 dark:text-gray-500 italic max-w-xs truncate">{measure.notes || '—'}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(measure.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <MeasureForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />}
    </div>
  )
}

export default MeasuresPage