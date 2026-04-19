import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2, Pill, Clock } from 'lucide-react'
import {
  addMedication,
  updateMedication,
  deleteMedication,
} from '../../store/medicationSlice'
import MedicationForm from '../../components/common/MedicationForm'

const FREQUENCY_LABELS = {
  daily: 'Une fois / jour',
  twice: 'Deux fois / jour',
  three: 'Trois fois / jour',
  weekly: 'Une fois / semaine',
}

const MedicationsPage = () => {
  const dispatch = useDispatch()
  const { medications } = useSelector((state) => state.medications)

  const [showForm, setShowForm] = useState(false)
  const [editingMed, setEditingMed] = useState(null)

  const handleAdd = (data) => {
    dispatch(addMedication({ 
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(), // timestamp d'ajout
    }))
    setShowForm(false)
  }

  const handleEdit = (data) => {
    dispatch(updateMedication({ ...data, id: editingMed.id }))
    setEditingMed(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce médicament ?')) {
      dispatch(deleteMedication(id))
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Médicaments 💊</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérez vos médicaments et horaires de prise
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

      {/* Liste vide */}
      {medications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Pill size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucun médicament enregistré</p>
          <p className="text-gray-400 text-sm mt-1">
            Cliquez sur "Ajouter" pour commencer
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3"
            >
              {/* Nom + actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Pill size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{med.name}</p>
                    <p className="text-xs text-gray-400">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingMed(med)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Fréquence */}
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                📅 {FREQUENCY_LABELS[med.frequency]}
              </div>

              {/* Horaires */}
              <div className="flex flex-wrap gap-2">
                {med.times.map((time, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full"
                  >
                    <Clock size={11} />
                    {time}
                  </span>
                ))}
              </div>

              {/* Dates */}
              {med.startDate && (
                <p className="text-xs text-gray-400">
                  📆 Du {med.startDate} {med.endDate && `au ${med.endDate}`}
                </p>
              )}

              {/* Notes */}
              {med.notes && (
                <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-2">
                  💬 {med.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout */}
      {showForm && (
        <MedicationForm
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Modal Modification */}
      {editingMed && (
        <MedicationForm
          initialData={editingMed}
          onSubmit={handleEdit}
          onClose={() => setEditingMed(null)}
        />
      )}

    </div>
  )
}

export default MedicationsPage