"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  addTaskToFirestore,
  updateTaskInFirestore,
  clearSelectedTask,
  removeTaskFromFirestore,
} from "../redux/taskSlice"
import { useNavigate } from "react-router-dom"
import { logout } from "../redux/authSlice"

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

function TaskForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tasks = useSelector((state) => (Array.isArray(state.tasks?.tasks) ? state.tasks.tasks : []))
  const selectedTask = useSelector((state) => state.tasks.selectedTask)
  const userId = useSelector((state) => state.auth.user?.uid)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(new Date())
  const [priority, setPriority] = useState("medium")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title)
      setDescription(selectedTask.description || "")
      setDueDate(new Date(selectedTask.dueDate))
      setPriority(selectedTask.priority)
      setIsEditing(true)
    } else {
      resetForm()
    }
  }, [selectedTask])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDueDate(new Date())
    setPriority("medium")
    setIsEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!Array.isArray(tasks)) {
      console.error("Tasks not loaded or invalid format.")
      return
    }

    const taskData = {
      title,
      description,
      dueDate: dueDate.toISOString(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    if (isEditing && selectedTask) {
      dispatch(
        updateTaskInFirestore({
          id: selectedTask.id,
          ...taskData,
        }),
      )
    } else {
      dispatch(addTaskToFirestore({ taskData, userId }))
    }

    resetForm()
    dispatch(clearSelectedTask())
  }

  const handleCancel = () => {
    resetForm()
    dispatch(clearSelectedTask())
  }

  const handleDeleteSelected = () => {
    if (selectedTask) {
      dispatch(removeTaskFromFirestore(selectedTask.id))
      resetForm()
      dispatch(clearSelectedTask())
    } else {
      alert("No task selected to delete!")
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/auth")
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newDate) => setDueDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorities.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              {isEditing && (
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? "Update Task" : "Add Task"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
        {isEditing && (
          <Button variant="outlined" color="error" onClick={handleDeleteSelected}>
            Delete Task
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default TaskForm
