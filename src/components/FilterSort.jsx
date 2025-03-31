"use client"
import { useDispatch, useSelector } from "react-redux"
import { FormControl, InputLabel, Select, MenuItem, Grid, Paper } from "@mui/material"
import { setFilter, setSortBy, setPriorityFilter } from "../redux/filterSlice"

function FilterSort() {
  const dispatch = useDispatch()
  const { status, sortBy, priority } = useSelector((state) => state.filters)

  const handleStatusChange = (e) => {
    dispatch(setFilter(e.target.value))
  }

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value))
  }

  const handlePriorityChange = (e) => {
    dispatch(setPriorityFilter(e.target.value))
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={handleStatusChange}>
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select value={priority} label="Priority" onChange={handlePriorityChange}>
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="createdAt">Created Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default FilterSort
