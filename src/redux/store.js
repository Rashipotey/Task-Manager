import { configureStore, combineReducers } from "@reduxjs/toolkit"
import taskReducer from "./taskSlice"
import filterReducer from "./filterSlice"
import authReducer from "./authSlice"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "tasks"], 
}

const rootReducer = combineReducers({
  tasks: taskReducer,
  filters: filterReducer,
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)
export default store
