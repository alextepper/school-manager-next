import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  CardActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { format, parseISO } from "date-fns";

const MovementCard = ({ movement, onSave, onDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMovement, setEditedMovement] = useState(movement);

  const formatDate = (isoDate) => format(parseISO(isoDate), "yyyy-MM-dd HH:mm:ss");
  const handleEdit = () => setIsEditMode(!isEditMode);
  const handleDelete = () => onDelete(movement.id);
  const handleSave = () => {
    onSave(editedMovement);
    setIsEditMode(false);
  };
  const handleChange = (event) => {
    setEditedMovement({ ...editedMovement, [event.target.name]: event.target.value });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: editedMovement.movement_type === "enter" ? "green" : "red" }}>
            {isEditMode ? (
              <TextField
                size="small"
                value={editedMovement.student.first_name}
                name="first_name"
                onChange={handleChange}
              />
            ) : (
              editedMovement.student.first_name
            )}
          </Avatar>
        }
        title={
          isEditMode ? (
            <TextField
              fullWidth
              value={
                editedMovement.student.first_name +
                " - " +
                editedMovement.movement_type.toUpperCase()
              }
              name="title"
              onChange={handleChange}
            />
          ) : (
            `${editedMovement.student.first_name} - ${editedMovement.movement_type.toUpperCase()}`
          )
        }
        subheader={`Recorded by: ${editedMovement.staff_member.first_name}`}
        action={
          <div>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
            {isEditMode && (
              <IconButton onClick={handleSave} color="success">
                <SaveIcon />
              </IconButton>
            )}
          </div>
        }
      />
      <CardContent>
        {isEditMode ? (
          <TextField
            fullWidth
            label="Scheduled Time"
            type="datetime-local"
            value={formatDate(editedMovement.scheduled_time)}
            name="scheduled_time"
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            Scheduled Time: {formatDate(editedMovement.scheduled_time)}
          </Typography>
        )}
        {isEditMode ? (
          <TextField
            fullWidth
            label="Actual Time"
            type="datetime-local"
            value={formatDate(editedMovement.actual_time)}
            name="actual_time"
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            Actual Time: {formatDate(editedMovement.actual_time)}
          </Typography>
        )}
        {/* Other fields like Actual Time and Comments can also be made editable similar to above */}
      </CardContent>
    </Card>
  );
};

export default MovementCard;
