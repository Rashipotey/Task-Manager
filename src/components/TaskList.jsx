"use client"

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Box,
  Typography,
  Paper,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  clearSelectedTask,
  setSelectedTask,
  removeTaskFromFirestore,
  updateTaskInFirestore,
  fetchTasksFromFirestore,
} from "../redux/taskSlice"

function TaskList() {
  const dispatch = useDispatch()

  const tasks = useSelector((state) => (Array.isArray(state.tasks?.tasks) ? state.tasks.tasks : []))
  const { status, sortBy, priority } = useSelector((state) => state.filters)

  useEffect(() => {
    dispatch(fetchTasksFromFirestore())
  }, [dispatch])

  useEffect(() => {
    console.log("Updated tasks:", tasks)
  }, [tasks])

  const filteredTasks = tasks
    .filter((task) => {
      if (status === "active" && task.completed) return false
      if (status === "completed" && !task.completed) return false
      return true
    })
    .filter((task) => {
      if (priority !== "all" && task.priority !== priority) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate)
      if (sortBy === "priority") return a.priority.localeCompare(b.priority)
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "createdAt") return new Date(a.createdAt) - new Date(b.createdAt)
      return 0
    })

  const handleEdit = (task) => {
    dispatch(setSelectedTask(task))
  }

  const handleDelete = async (taskId) => {
    dispatch(removeTaskFromFirestore(taskId))
    dispatch(clearSelectedTask())
  }

  const handleToggleComplete = async (task) => {
    dispatch(
      updateTaskInFirestore({
        ...task,
        completed: !task.completed,
      }),
    )
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Task List
      </Typography>

      {filteredTasks.length === 0 ? (
        <Typography align="center">No tasks available</Typography>
      ) : (
        <List>
          {filteredTasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                backgroundColor: task.completed ? "#f0f0f0" : "transparent",
                mb: 1,
                borderRadius: 1,
              }}
              secondaryAction={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton edge="end" color="error" onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <Checkbox
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                color="primary"
              />
              <ListItemText
                primary={task.title}
                secondary={`${task.description || "No Description"} | Due: ${new Date(
                  task.dueDate,
                ).toLocaleDateString()} | Priority: ${task.priority}`}
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
                onClick={() => handleEdit(task)}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  )
}

export default TaskList
