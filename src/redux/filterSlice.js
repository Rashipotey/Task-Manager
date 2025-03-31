import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  status: "all", 
  sortBy: "dueDate", 
  priority: "all", 
}

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.status = action.payload
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },

    setPriorityFilter: (state, action) => {
      state.priority = action.payload
    },
  },
})

export const { setFilter, setSortBy, setPriorityFilter } = filterSlice.actions
export default filterSlice.reducer
