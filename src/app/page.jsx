"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { DragDropContext } from "react-beautiful-dnd"
import { Container, Box, Typography } from "@mui/material"
import { store } from "@/lib/store"
import { loadTasks, reorderTasks } from "@/lib/features/tasks/tasksSlice"
import TaskForm from "@/components/task-form"
import TaskList from "@/components/task-list"
import FilterBar from "@/components/filter-bar"

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#8b5cf6",
    },
  },
})

export default function Home() {
  const handleDragEnd = (result) => {
    if (!result.destination) return
    store.dispatch(
      reorderTasks({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      }),
    )
  }

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      store.dispatch(loadTasks(JSON.parse(savedTasks)))
    }
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center">
              Task Manager
            </Typography>
            <TaskForm />
            <FilterBar />
            <DragDropContext onDragEnd={handleDragEnd}>
              <TaskList />
            </DragDropContext>
          </Box>
        </Container>
      </ThemeProvider>
    </Provider>
  )
}

