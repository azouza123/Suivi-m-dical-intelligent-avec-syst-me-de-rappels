import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  try {
    // sessionStorage is per-tab — perfect for multiple users
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    const userStr = sessionStorage.getItem('user')
    if (token && userStr) {
      return {
        user: JSON.parse(userStr),
        token,
        isAuthenticated: true,
      }
    }
  } catch (e) {}
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      // Save to sessionStorage (per tab) instead of localStorage (shared)
      sessionStorage.setItem('token', action.payload.token)
      sessionStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer