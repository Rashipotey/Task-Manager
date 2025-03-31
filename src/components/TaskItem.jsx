import React from "react"
import { Draggable } from "@hello-pangea/dnd"
import { ListItem, ListItemText } from "@mui/material"

const TaskItem = ({ task, index, isMobile }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            backgroundColor: isMobile ? "primary.light" : "background.paper",
            boxShadow: 1,
            borderRadius: 2,
          }}
        >
          <ListItemText primary={task.title} secondary={task.description} />
        </ListItem>
      )}
    </Draggable>
  )
}

export default TaskItem
