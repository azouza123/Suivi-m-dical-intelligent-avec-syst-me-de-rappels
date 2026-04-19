import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Droplets, Weight, Pill, Clock } from 'lucide-react'

// Données simulées par patient
const MOCK_DATA = {
  1: {
    name: 'Ahmed Ben Ali',
    medications: [
      { id: 1, name: 'Amlodipine 5mg', dosage: '5mg', times: ['08:00'], frequency: 'daily' },
      { id: 2, name: 'Metformine 850mg', dosage: '850mg', times: ['08:00', '20:00'], frequency: 'twice' },
    ],
    measures: [
      { id: 1, type: 'blood_pressure', label: 'Tension artérielle', value: '130/85', unit: 'mmHg', date: '2024-04-15', time: '09:00' },
      { id: 2, type: 'blood_pressure', label: 'Tension artérielle', value: '125/80', unit: 'mmHg', date: '2024-04-14', time: '09:00' },
      { id: 3, type: 'glucose', label: 'Glycémie', value: '5.8', unit: 'mmol/L', date: '2024-04-15', time: '07:30' },
      { id: 4, type: 'weight', label: 'Poids', value: '78', unit: 'kg', date: '2024-04-13', time: '08:00' },
    ],
  },
  2: {
    name: 'Fatma Trabelsi',
    medications: [
      { id: 1, name: 'Paracétamol 1g', dosage: '1g', times: ['08:00', '14:00', '20:00'], frequency: 'three' },
    ],
    measures: [
      { id: 1, type: 'glucose', label: 'Glycémie', value: '6.2', unit: 'mmol/L', date: '2024-04-15', time: '07:00' },
      { id: 2, type: 'weight', label: 'Poids', value: '65', unit: 'kg', date: '2024-04-14', time: '08:00' },
    ],
  },
}

const TYPE_CONFIG = {
  blood_pressure: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  weight: { icon: Weight, color: 'text-blue-500', bg: 'bg-blue-50' },
  glucose: { icon: Droplets, color: 'text-orange-500', bg: 'bg-orange-50' },
}

const DoctorPatientDetailPage = () => {
  const { patientId } = useParams()
  const patient = MOCK_DATA[patientId]

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Patient introuvable</p>
        <Link to="/doctor/dashboard" className="text-blue-600 text-sm mt-2 inline-block">
          ← Retour au tableau de bord
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/doctor/dashboard"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
            👁 Accès en lecture seule
          </p>
        </div>
      </div>

      {/* Médicaments */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill size={18} className="text-blue-500" />
          Médicaments actifs
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {patient.medications.length}
          </span>
        </h2>

        {patient.medications.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun médicament enregistré</p>
        ) : (
          <div className="space-y-3">
            {patient.medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Pill size={15} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{med.name}</p>
                    <p className="text-xs text-gray-400">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {med.times.map((t, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">
                      <Clock size={10} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mesures */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Heart size={18} className="text-red-500" />
          Historique des mesures
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {patient.measures.length}
          </span>
        </h2>

        {patient.measures.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune mesure enregistrée</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Valeur</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Heure</th>
                </tr>
              </thead>
              <tbody>
                {[...patient.measures].reverse().map((m) => {
                  const config = TYPE_CONFIG[m.type]
                  const Icon = config.icon
                  return (
                    <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${config.bg}`}>
                            <Icon size={13} className={config.color} />
                          </div>
                          <span className="text-gray-700">{m.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {m.value} <span className="text-gray-400 font-normal">{m.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{m.date}</td>
                      <td className="px-4 py-3 text-gray-500">{m.time}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default DoctorPatientDetailPage