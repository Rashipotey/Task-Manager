import { createSelector } from "@reduxjs/toolkit"

const compareTasksByProperty = (a, b, property) => {
  switch (property) {
    case "dueDate":
      return new Date(a.dueDate) - new Date(b.dueDate)
    case "priority": {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    case "title":
      return a.title.localeCompare(b.title)
    case "createdAt":
      return new Date(a.createdAt) - new Date(b.createdAt)
    default:
      return 0
  }
}

export const selectFilteredAndSortedTasks = createSelector(
  [
    (state) => Array.isArray(state.tasks.tasks) ? state.tasks.tasks : [], 
    (state) => state.filters.status,
    (state) => state.filters.sortBy,
  ],
  (tasks, status, sortBy) => {
    let filteredTasks = [...tasks]

    if (status === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed)
    } else if (status === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed)
    }

    return filteredTasks.sort((a, b) => compareTasksByProperty(a, b, sortBy))
  }
)
