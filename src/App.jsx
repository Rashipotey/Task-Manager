"use client"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Typography, Box } from "@mui/material"
import { DragDropContext } from "@hello-pangea/dnd"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"
import FilterSort from "./components/FilterSort"
import Auth from "./components/Auth"
import { loadTasks, reorderTasks } from "./redux/taskSlice"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"
import { persistor } from "./redux/store"

function MainPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadTasks()) 
  }, [dispatch])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    dispatch(
      reorderTasks({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      }),
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Task Manager
        </Typography>
        <FilterSort />
        <DragDropContext onDragEnd={handleDragEnd}>
          <TaskList />
        </DragDropContext>
        <Box sx={{ mt: 4 }}>
          <TaskForm />
        </Box>
      </Box>
    </Container>
  )
}

function App() {
  const user = useSelector((state) => state.auth.user)

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <MainPage /> : <Navigate to="/auth" replace />}
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </PersistGate>
  )
}

export default App
