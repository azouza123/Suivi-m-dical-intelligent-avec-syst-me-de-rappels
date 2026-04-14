import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, Activity, Droplets, Weight, Heart } from 'lucide-react'
import { addMeasure, setMeasures } from '../../store/measureSlice'
import MeasureForm from '../../components/common/MeasureForm'

const TYPE_CONFIG = {
  blood_pressure: {
    label: 'Tension artérielle',
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  weight: {
    label: 'Poids',
    icon: Weight,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  glucose: {
    label: 'Glycémie',
    icon: Droplets,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
}

const FILTERS = ['Toutes', 'Tension artérielle', 'Poids', 'Glycémie']

const MeasuresPage = () => {
  const dispatch = useDispatch()
  const { measures } = useSelector((state) => state.measures)

  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Toutes')

  const handleAdd = (data) => {
    dispatch(addMeasure({ ...data, id: Date.now() }))
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette mesure ?')) {
      dispatch(setMeasures(measures.filter((m) => m.id !== id)))
    }
  }

  const filteredMeasures = activeFilter === 'Toutes'
    ? measures
    : measures.filter((m) => m.label === activeFilter)

  // Résumé par type
  const getLatest = (type) => measures.filter((m) => m.type === type).at(-1)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mesures médicales 📊</h1>
          <p className="text-gray-500 text-sm mt-1">
            Suivez l'évolution de vos indicateurs de santé
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(TYPE_CONFIG).map(([type, config]) => {
          const latest = getLatest(type)
          const Icon = config.icon
          return (
            <div
              key={type}
              className={`bg-white rounded-2xl border ${config.border} p-4 flex items-center gap-4`}
            >
              <div className={`p-3 rounded-xl ${config.bg}`}>
                <Icon size={20} className={config.color} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{config.label}</p>
                {latest ? (
                  <>
                    <p className={`text-lg font-bold ${config.color}`}>
                      {latest.value} <span className="text-sm font-normal text-gray-400">{latest.unit}</span>
                    </p>
                    <p className="text-xs text-gray-400">{latest.date} {latest.time}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Aucune mesure</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Liste vide */}
      {filteredMeasures.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Activity size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune mesure enregistrée</p>
          <p className="text-gray-400 text-sm mt-1">
            Cliquez sur "Ajouter" pour commencer
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Valeur</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Heure</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Notes</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {[...filteredMeasures].reverse().map((measure) => {
                const config = TYPE_CONFIG[measure.type]
                const Icon = config.icon
                return (
                  <tr key={measure.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className={config.color} />
                        <span className="text-gray-700">{measure.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {measure.value} <span className="text-gray-400 font-normal">{measure.unit}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{measure.date}</td>
                    <td className="px-5 py-3 text-gray-500">{measure.time}</td>
                    <td className="px-5 py-3 text-gray-400 italic">
                      {measure.notes || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(measure.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <MeasureForm
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

    </div>
  )
}

export default MeasuresPage