import { Snackbar } from "@mui/material";

const MovementSaveNotification = ({ open, message, onClose }) => {
  return <Snackbar open={open} autoHideDuration={6000} onClose={onClose} message={message} />;
};

export default MovementSaveNotification;
