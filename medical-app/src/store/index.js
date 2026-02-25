import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import medicationReducer from './medicationSlice'
import measureReducer from './authSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        medications: medicationReducer,
        measures: measureReducer,
    },
})

export default store