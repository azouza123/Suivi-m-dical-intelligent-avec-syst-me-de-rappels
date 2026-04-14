import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import medicationReducer from './medicationSlice'
import measureReducer from './measureSlice'
import reminderReducer from './reminderSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    medications: medicationReducer,
    measures: measureReducer,
    reminders: reminderReducer,
  },
})

export default store