import { useState } from 'react'
import { X } from 'lucide-react'

const MEASURE_TYPES = [
  { value: 'blood_pressure', label: 'Tension artérielle', placeholder: 'Ex: 120/80', unit: 'mmHg' },
  { value: 'weight', label: 'Poids', placeholder: 'Ex: 72.5', unit: 'kg' },
  { value: 'glucose', label: 'Glycémie', placeholder: 'Ex: 5.4', unit: 'mmol/L' },
]

const MeasureForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'blood_pressure',
    value: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedType = MEASURE_TYPES.find((t) => t.value === formData.type)
    onSubmit({ ...formData, unit: selectedType.unit, label: selectedType.label })
  }

  const selectedType = MEASURE_TYPES.find((t) => t.value === formData.type)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Ajouter une mesure
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Type de mesure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de mesure *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MEASURE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Valeur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valeur * <span className="text-gray-400">({selectedType.unit})</span>
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              placeholder={selectedType.placeholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date + Heure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ex: Prise après le repas"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default MeasureForm