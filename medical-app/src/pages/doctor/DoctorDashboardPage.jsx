import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Users, Activity, Pill, ChevronRight, Eye } from 'lucide-react'

// Données simulées — seront remplacées par l'API
const MOCK_PATIENTS = [
  {
    id: 1,
    name: 'Ahmed Ben Ali',
    email: 'ahmed@email.com',
    lastMeasure: { label: 'Tension', value: '130/85', date: "Aujourd'hui" },
    medicationsCount: 3,
    measuresCount: 12,
    status: 'active',
  },
  {
    id: 2,
    name: 'Fatma Trabelsi',
    email: 'fatma@email.com',
    lastMeasure: { label: 'Glycémie', value: '6.2', date: 'Hier' },
    medicationsCount: 2,
    measuresCount: 8,
    status: 'active',
  },
  {
    id: 3,
    name: 'Mohamed Chabbi',
    email: 'mohamed@email.com',
    lastMeasure: { label: 'Poids', value: '88', date: 'Il y a 3 jours' },
    medicationsCount: 1,
    measuresCount: 5,
    status: 'suspended',
  },
]

const DoctorDashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const activePatients = MOCK_PATIENTS.filter((p) => p.status === 'active')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Bonjour, Dr. {user?.name || 'Médecin'} 👨‍⚕️
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Voici le suivi de vos patients
        </p>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500">
            <Users size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total patients</p>
            <p className="text-2xl font-bold text-gray-800">{MOCK_PATIENTS.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500">
            <Activity size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Patients actifs</p>
            <p className="text-2xl font-bold text-gray-800">{activePatients.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500">
            <Pill size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Accès suspendus</p>
            <p className="text-2xl font-bold text-gray-800">
              {MOCK_PATIENTS.filter((p) => p.status === 'suspended').length}
            </p>
          </div>
        </div>
      </div>

      {/* Liste patients */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            Mes patients
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {MOCK_PATIENTS.map((patient) => (
            <div key={patient.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{patient.name}</p>
                  <p className="text-xs text-gray-400">{patient.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Dernière mesure */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Dernière mesure</p>
                  <p className="text-sm font-medium text-gray-700">
                    {patient.lastMeasure.label} — {patient.lastMeasure.value}
                  </p>
                  <p className="text-xs text-gray-400">{patient.lastMeasure.date}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-3 hidden sm:flex">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                    💊 {patient.medicationsCount}
                  </span>
                  <span className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
                    📊 {patient.measuresCount}
                  </span>
                </div>

                {/* Statut */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  patient.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {patient.status === 'active' ? 'Actif' : 'Suspendu'}
                </span>

                {/* Bouton voir */}
                {patient.status === 'active' && (
                  <Link
                    to={`/doctor/patient/${patient.id}`}
                    className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Eye size={13} />
                    Voir
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboardPage