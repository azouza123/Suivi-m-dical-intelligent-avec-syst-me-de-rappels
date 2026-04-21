import { createSlice } from "@reduxjs/toolkit";

// Load both token and user from localStorage on startup
const loadInitialState = () => {
  try {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
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
      // Save BOTH token and user to localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      // Remove BOTH from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer