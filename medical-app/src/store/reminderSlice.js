import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  reminders: [],
}

const isActiveToday = (med) => {
  const today = new Date().toISOString().split('T')[0]

  // Si pas de date début → actif
  if (!med.startDate) return true

  // Si date début dans le futur → pas encore actif
  if (med.startDate > today) return false

  // Si date fin dépassée → inactif
  if (med.endDate && med.endDate < today) return false

  return true
}

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    generateReminders: (state, action) => {
      const medications = action.payload
      const today = new Date().toISOString().split('T')[0]

      // Filtre uniquement les médicaments actifs aujourd'hui
      const activeMeds = medications.filter(isActiveToday)

      const generated = activeMeds.flatMap((med) =>
        med.times.map((time) => ({
          id: `${med.id}-${time}`,
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          time,
          date: today,
          taken: false,
        }))
      )

      // Evite les doublons
      const existingIds = state.reminders.map((r) => r.id)
      const newReminders = generated.filter((r) => !existingIds.includes(r.id))
      state.reminders = [...state.reminders, ...newReminders]
    },

    markAsTaken: (state, action) => {
      const reminder = state.reminders.find((r) => r.id === action.payload)
      if (reminder) reminder.taken = true
    },

    markAsUntaken: (state, action) => {
      const reminder = state.reminders.find((r) => r.id === action.payload)
      if (reminder) reminder.taken = false
    },

    // Permet d'injecter des données simulées pour l'historique
    addHistoryReminders: (state, action) => {
      state.reminders = [...state.reminders, ...action.payload]
    },
  },
})

export const {
  generateReminders,
  markAsTaken,
  markAsUntaken,
  addHistoryReminders,
} = reminderSlice.actions

export default reminderSlice.reducer