import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Users, Activity, Pill, Clock, Calendar,
  ChevronRight, Loader2, Plus, Trash2,
  Heart, Droplets
} from 'lucide-react'
import doctorService from '../../services/doctorService'
import MedicationForm from '../../components/common/MedicationForm'

const TYPE_CONFIG = {
  blood_pressure: {
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  },
  weight: {
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  },
  glucose: {
    icon: Droplets,
    color: 'text-purple-500',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  },
}

const FREQ_LABELS = {
  daily: 'Une fois / jour',
  twice: 'Deux fois / jour',
  three: 'Trois fois / jour',
  weekly: 'Une fois / semaine',
}

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth)

  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [medications, setMedications] = useState([])
  const [measures, setMeasures] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showPrescribe, setShowPrescribe] = useState(false)

  useEffect(() => {
    doctorService.getPatients()
      .then((r) => setPatients(r.data))
      .catch(console.error)
      .finally(() => setLoadingPatients(false))
  }, [])

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient)
    setLoadingDetail(true)
    try {
      const [medsRes, measRes] = await Promise.all([
        doctorService.getPatientMedications(patient.id),
        doctorService.getPatientMeasures(patient.id),
      ])
      setMedications(medsRes.data)
      setMeasures(measRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handlePrescribe = async (data) => {
    try {
      const r = await doctorService.prescribeMedication(selectedPatient.id, data)
      setMedications((prev) => [...prev, r.data])
      setShowPrescribe(false)
    } catch (e) {
      alert('Erreur lors de la prescription')
    }
  }

  const handleDeleteMed = async (medId) => {
    if (!window.confirm('Supprimer ce médicament ?')) return
    try {
      await doctorService.deleteMedication(selectedPatient.id, medId)
      setMedications((prev) => prev.filter((m) => m.id !== medId))
    } catch (e) {
      alert('Erreur lors de la suppression')
    }
  }

  const doctorName = user?.name?.startsWith('Dr.') ? user.name : `Dr. ${user?.name || 'Médecin'}`

  return (
    <div className="w-full overflow-x-hidden space-y-5">

      {/* Purple hero banner */}
      <div
        className="w-full rounded-2xl p-7"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)' }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Espace Médecin</h1>
        <p className="text-purple-200 text-sm mb-3">Bienvenue {doctorName}</p>
        <div className="flex items-center gap-2 text-purple-100 text-sm">
          <Users size={15} className="text-purple-200" />
          <span>{patients.length} patient(s) sous votre suivi</span>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-12 gap-5">

        {/* LEFT — Patient list — 3 cols */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div
              className="px-4 py-3.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
            >
              <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <Users size={15} />
                Mes Patients
              </h2>
            </div>

            <div className="p-2">
              {loadingPatients ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={22} className="animate-spin text-purple-500" />
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center py-10">
                  <Users size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Aucun patient</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        selectedPatient?.id === patient.id
                          ? 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold ${
                        selectedPatient?.id === patient.id
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{patient.email}</p>
                      </div>
                      <ChevronRight size={14} className={
                        selectedPatient?.id === patient.id
                          ? 'text-purple-400 flex-shrink-0'
                          : 'text-gray-200 dark:text-gray-700 flex-shrink-0'
                      } />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Patient detail — 9 cols */}
        <div className="col-span-12 lg:col-span-9 min-w-0">
          {!selectedPatient ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center py-28">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <Activity size={28} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                Sélectionnez un patient
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Choisissez un patient pour voir son suivi médical
              </p>
            </div>
          ) : loadingDetail ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center py-28">
              <Loader2 size={28} className="animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="space-y-4 min-w-0">

              {/* Patient info */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {selectedPatient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {selectedPatient.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div
                  className="px-5 py-3.5 flex items-center justify-between"
                  style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}
                >
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <Pill size={15} />
                    Médicaments actifs
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {medications.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => setShowPrescribe(true)}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={13} />
                    Prescrire
                  </button>
                </div>

                <div className="p-4">
                  {medications.length === 0 ? (
                    <div className="text-center py-8">
                      <Pill size={24} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Aucun médicament prescrit</p>
                      <button
                        onClick={() => setShowPrescribe(true)}
                        className="mt-3 text-xs text-blue-600 hover:underline"
                      >
                        + Ajouter une prescription
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {medications.map((med) => (
                        <div
                          key={med.id}
                          className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100 dark:border-cyan-900/30"
                        >
                          <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Pill size={14} className="text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {med.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {med.dosage} • {FREQ_LABELS[med.frequency] || med.frequency}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {med.times && med.times.map((time, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 text-xs bg-white dark:bg-gray-800 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 px-1.5 py-0.5 rounded-md"
                                >
                                  <Clock size={9} /> {time}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMed(med.id)}
                            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Measures */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div
                  className="px-5 py-3.5"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <Activity size={15} />
                    Mesures récentes
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {measures.length}
                    </span>
                  </h3>
                </div>

                <div className="p-4">
                  {measures.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity size={24} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Aucune mesure enregistrée</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {measures.map((m) => {
                        const config = TYPE_CONFIG[m.type] || TYPE_CONFIG.weight
                        const Icon = config.icon
                        return (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <div className={`w-9 h-9 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon size={15} className={config.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {m.label}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <Calendar size={10} />
                                {m.date} à {m.time}
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${config.badge}`}>
                              {m.value} {m.unit}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {showPrescribe && (
        <MedicationForm
          onSubmit={handlePrescribe}
          onClose={() => setShowPrescribe(false)}
        />
      )}
    </div>
  )
}

export default DoctorDashboard