import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sharedDoctors: [],
}

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    addDoctor: (state, action) => {
      state.sharedDoctors.push(action.payload)
    },
    removeDoctor: (state, action) => {
      state.sharedDoctors = state.sharedDoctors.filter(
        (d) => d.id !== action.payload
      )
    },
    updateAccess: (state, action) => {
      const doctor = state.sharedDoctors.find((d) => d.id === action.payload.id)
      if (doctor) {
        doctor.active = action.payload.active
        if (!action.payload.active) {
          // On enregistre la date exacte de suspension
          doctor.suspendedAt = new Date().toISOString()
        } else {
          // Réactivation : on efface la date de suspension
          doctor.suspendedAt = null
        }
      }
    },
  },
})

export const { addDoctor, removeDoctor, updateAccess } = doctorSlice.actions
export default doctorSlice.reducer