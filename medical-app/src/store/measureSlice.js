import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  measures: [],
  loading: false,
  error: null,
}

const measureSlice = createSlice({
  name: 'measures',
  initialState,
  reducers: {
    setMeasures: (state, action) => {
      state.measures = action.payload
    },
    addMeasure: (state, action) => {
      state.measures.push(action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setMeasures, addMeasure, setLoading, setError } = measureSlice.actions
export default measureSlice.reducer