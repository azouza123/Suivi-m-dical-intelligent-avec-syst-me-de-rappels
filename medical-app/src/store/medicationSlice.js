import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    medications: [],
    loading: false,
    error: null,
}

const medicationSlice = createSlice ({
    name: 'medications',
    initialState,
    reducers: {
        setMedications: (state, action) => {
            state.medications = action.payload
        },
        addMedication: (state, action) => {
            state.medications.push(action.payload)
        },
        updateMedication: (state, action) => {
            state.medications.findIndex(m => m.id === action.payload.id)
            if (index !== -1) state.medications[index] = action.payload
        },
        deleteMedication: (state, action) => {
            state.medications = state.medications.filter(m => m.id !== action.payload)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    },
})

export const { setMedications, addMedication, updateMedication, deleteMedication, setLoading, setError } = medicationSlice.actions
export default medicationSlice.reducer