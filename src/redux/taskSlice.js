import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

export const addTaskToFirestore = createAsyncThunk(
  "tasks/addTaskToFirestore",
  async ({ taskData, userId }) => {
    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), taskData)
    return { id: docRef.id, ...taskData }
  }
)

export const fetchTasksFromFirestore = createAsyncThunk(
  "tasks/fetchTasksFromFirestore",
  async (userId) => {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/tasks`))
    const tasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return tasks
  }
)

export const updateTaskInFirestore = createAsyncThunk(
  "tasks/updateTaskInFirestore",
  async ({ taskData, userId }) => {
    const taskRef = doc(db, `users/${userId}/tasks`, taskData.id)
    await updateDoc(taskRef, taskData)
    return taskData
  }
)

export const removeTaskFromFirestore = createAsyncThunk(
  "tasks/removeTaskFromFirestore",
  async ({ taskId, userId }) => {
    await deleteDoc(doc(db, `users/${userId}/tasks`, taskId))
    return taskId
  }
)

const initialState = {
  tasks: [], 
  selectedTask: null, 
  loading: false,
  error: null,
}

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      if (!state.tasks) state.tasks = []
      state.tasks.push(action.payload)
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null
      }
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    loadTasks: (state, action) => {
      state.tasks = action.payload
    },
    reorderTasks: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload
      if (
        sourceIndex < 0 ||
        destinationIndex < 0 ||
        sourceIndex >= state.tasks.length ||
        destinationIndex >= state.tasks.length
      ) {
        return
      }
      const [movedTask] = state.tasks.splice(sourceIndex, 1)
      state.tasks.splice(destinationIndex, 0, movedTask)
    },    
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null
    },
    updateSelectedTask: (state, action) => {
      if (state.selectedTask) {
        state.selectedTask = { ...state.selectedTask, ...action.payload }
      }
    },
    resetError: (state) => {
      state.error = null
    }, 
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(addTaskToFirestore.pending, (state) => {
        state.loading = true
      })
      .addCase(addTaskToFirestore.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
        state.loading = false
      })
      .addCase(addTaskToFirestore.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchTasksFromFirestore.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTasksFromFirestore.fulfilled, (state, action) => {
        state.tasks = action.payload
        state.loading = false
      })
      .addCase(fetchTasksFromFirestore.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateTaskInFirestore.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTaskInFirestore.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
        state.loading = false
      })
      .addCase(updateTaskInFirestore.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(removeTaskFromFirestore.pending, (state) => {
        state.loading = true
      })
      .addCase(removeTaskFromFirestore.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload)
        state.loading = false
      })
      .addCase(removeTaskFromFirestore.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }  
})

export const {
  addTask,
  removeTask,
  updateTask,
  loadTasks,
  reorderTasks,
  setSelectedTask,
  clearSelectedTask,
  resetError
} = taskSlice.actions

export default taskSlice.reducer
