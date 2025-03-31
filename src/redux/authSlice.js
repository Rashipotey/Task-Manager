import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
}

const serializeUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = serializeUser(action.payload);
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      localStorage.removeItem("user")
    },
  },
})

export const { setUser, setLoading, setError, logout } = authSlice.actions
export default authSlice.reducer
