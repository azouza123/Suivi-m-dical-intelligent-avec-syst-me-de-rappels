import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addDoctor, removeDoctor, updateAccess } from '../../store/doctorSlice'
import {
  Stethoscope,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
} from 'lucide-react'

// ─── Modal ajout médecin ───────────────────────────────────
const AddDoctorModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...formData, id: Date.now(), active: true, addedAt: new Date().toLocaleDateString('fr-FR') })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Autoriser un médecin
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du médecin *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Dr. Martin Dupont"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email professionnel *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="dr.dupont@clinic.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spécialité
            </label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Ex: Cardiologue, Médecin généraliste..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Info accès lecture seule */}
          <div className="flex items-start gap-2 bg-blue-50 text-blue-700 text-xs px-4 py-3 rounded-lg">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            <p>
              Le médecin aura accès en <strong>lecture seule</strong> à vos mesures médicales et médicaments. Il ne pourra rien modifier.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              Autoriser l'accès
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Vue lecture seule du médecin ─────────────────────────
const DoctorReadOnlyView = ({ doctor, measures, medications, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Vue médecin — {doctor.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Eye size={11} /> Aperçu de ce que voit votre médecin
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Médicaments */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              💊 Médicaments actifs
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {medications.length}
              </span>
            </h3>
            {medications.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun médicament enregistré</p>
            ) : (
              <div className="space-y-2">
                {medications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{med.name}</p>
                      <p className="text-xs text-gray-400">{med.dosage}</p>
                    </div>
                    <div className="flex gap-2">
                      {med.times.map((t, i) => (
                        <span key={i} className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dernières mesures */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              📊 Dernières mesures
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {measures.length}
              </span>
            </h3>
            {measures.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune mesure enregistrée</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Type</th>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Valeur</th>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...measures].reverse().slice(0, 10).map((m) => (
                      <tr key={m.id} className="border-t border-gray-100">
                        <td className="px-4 py-2.5 text-gray-600">{m.label}</td>
                        <td className="px-4 py-2.5 font-semibold text-blue-600">
                          {m.value} <span className="text-gray-400 font-normal text-xs">{m.unit}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-400">{m.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Page principale ───────────────────────────────────────
const DoctorSharePage = () => {
  const dispatch = useDispatch()
  const { sharedDoctors } = useSelector((state) => state.doctors)
  const { measures } = useSelector((state) => state.measures)
  const { medications } = useSelector((state) => state.medications)

  const [showAddModal, setShowAddModal] = useState(false)
  const [previewDoctor, setPreviewDoctor] = useState(null)

  const handleDelete = (id) => {
    if (window.confirm('Révoquer l\'accès de ce médecin ?')) {
      dispatch(removeDoctor(id))
    }
  }

  const handleToggleAccess = (doctor) => {
    dispatch(updateAccess({ id: doctor.id, active: !doctor.active }))
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mon médecin 🩺</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérez les accès de vos médecins à votre suivi médical
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Autoriser un médecin
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck size={20} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Accès sécurisé en lecture seule</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Vos médecins autorisés peuvent consulter vos mesures et médicaments, mais ne peuvent rien modifier. Vous pouvez révoquer l'accès à tout moment.
          </p>
        </div>
      </div>

      {/* Liste vide */}
      {sharedDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Stethoscope size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucun médecin autorisé</p>
          <p className="text-gray-400 text-sm mt-1">
            Cliquez sur "Autoriser un médecin" pour partager votre suivi
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sharedDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className={`bg-white rounded-2xl border p-5 flex items-center justify-between transition-all ${
                doctor.active ? 'border-gray-200' : 'border-gray-100 opacity-60'
              }`}
            >
              {/* Infos médecin */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Stethoscope size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{doctor.name}</p>
                  <p className="text-xs text-gray-400">{doctor.email}</p>
                  {doctor.specialty && (
                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {doctor.specialty}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Date ajout */}
                <span className="text-xs text-gray-400 mr-2">
                  Depuis le {doctor.addedAt}
                </span>

                {/* Statut actif */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  doctor.active
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {doctor.active ? 'Actif' : 'Suspendu'}
                </span>

                {/* Aperçu */}
                <button
                  onClick={() => setPreviewDoctor(doctor)}
                  title="Aperçu de la vue médecin"
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye size={16} />
                </button>

                {/* Activer / Suspendre */}
                <button
                  onClick={() => handleToggleAccess(doctor)}
                  title={doctor.active ? "Suspendre l'accès" : "Réactiver l'accès"}
                  className={`p-2 rounded-lg transition-colors ${
                    doctor.active
                      ? 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {doctor.active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                {/* Supprimer */}
                <button
                  onClick={() => handleDelete(doctor.id)}
                  title="Révoquer l'accès"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ajout */}
      {showAddModal && (
        <AddDoctorModal
          onSubmit={(data) => dispatch(addDoctor(data))}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Modal aperçu vue médecin */}
      {previewDoctor && (
  <DoctorReadOnlyView
    doctor={previewDoctor}
    measures={
      previewDoctor.suspendedAt
        ? measures.filter((m) =>
            new Date(m.createdAt) < new Date(previewDoctor.suspendedAt)
          )
        : measures
    }
    medications={
      previewDoctor.suspendedAt
        ? medications.filter((med) =>
            new Date(med.createdAt) < new Date(previewDoctor.suspendedAt)
          )
        : medications
    }
    onClose={() => setPreviewDoctor(null)}
  />
)}

    </div>
  )
}

export default DoctorSharePage