import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2, Pill, Clock, Loader2, Search } from 'lucide-react'
import { setMedications, addMedication, updateMedication, deleteMedication } from '../../store/medicationSlice'
import medicationService from '../../services/medicationService'
import MedicationForm from '../../components/common/MedicationForm'

const FREQUENCY_LABELS = {
  daily:  'Une fois / jour',
  twice:  'Deux fois / jour',
  three:  'Trois fois / jour',
  weekly: 'Une fois / semaine',
}

const FREQ_COLORS = {
  daily:  'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  twice:  'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  three:  'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  weekly: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
}

const MedicationsPage = () => {
  const dispatch = useDispatch()
  const { medications } = useSelector((state) => state.medications)
  const [showForm, setShowForm] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    medicationService.getAll()
      .then((r) => dispatch(setMedications(r.data)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (data) => {
    try {
      const r = await medicationService.create(data)
      dispatch(addMedication(r.data))
      setShowForm(false)
    } catch (e) { alert("Erreur lors de l'ajout") }
  }

  const handleEdit = async (data) => {
    try {
      const r = await medicationService.update(editingMed.id, data)
      dispatch(updateMedication(r.data))
      setEditingMed(null)
    } catch (e) { alert('Erreur lors de la modification') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce médicament ?')) return
    try {
      await medicationService.delete(id)
      dispatch(deleteMedication(id))
    } catch (e) { alert('Erreur lors de la suppression') }
  }

  const filtered = medications.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Médicaments</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{medications.length} médicament{medications.length !== 1 ? 's' : ''} enregistré{medications.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Search */}
      {medications.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un médicament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-16 text-center">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Pill size={24} className="text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {search ? 'Aucun résultat' : 'Aucun médicament enregistré'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            {search ? 'Essayez un autre terme de recherche' : 'Cliquez sur "Ajouter" pour commencer'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((med) => (
            <div key={med.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-gray-200 dark:hover:border-gray-700 transition-all">

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Pill size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{med.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingMed(med)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Frequency badge */}
              <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${FREQ_COLORS[med.frequency] || 'bg-gray-100 text-gray-600'}`}>
                {FREQUENCY_LABELS[med.frequency] || med.frequency}
              </span>

              {/* Times */}
              {med.times && med.times.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {med.times.map((time, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 px-2 py-1 rounded-md">
                      <Clock size={10} /> {time}
                    </span>
                  ))}
                </div>
              )}

              {/* Dates */}
              {med.startDate && (
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                  Du {med.startDate}{med.endDate ? ` au ${med.endDate}` : ' — en cours'}
                </p>
              )}

              {/* Notes */}
              {med.notes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                  {med.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && <MedicationForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />}
      {editingMed && <MedicationForm initialData={editingMed} onSubmit={handleEdit} onClose={() => setEditingMed(null)} />}
    </div>
  )
}

export default MedicationsPage