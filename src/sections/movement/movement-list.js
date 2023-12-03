import React, { useState, useEffect } from "react";
import api from "src/utils/api";
import MovementCard from "./movement-card";
import MovementDeleteConfirmationDialog from "../dialogs/movement-delete-confirmation-dialog";
import MovementSaveNotification from "../dialogs/movement-save-notification";

export const MovementList = ({ user }) => {
  const [movements, setMovements] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Call the delete function here
    setIsDialogOpen(false);
    setSnackbarMessage("Movement deleted successfully.");
    setIsSnackbarOpen(true);
  };

  const loadMovements = async (studentId) => {
    setLoading(true);
    let url = `/movements/list/?limit=10&offset=${(page - 1) * 10}`;
    if (studentId) {
      url += `&student=${studentId}`;
    }
    const response = await api.get(url);
    setMovements([...movements, ...response.data.results]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadMovements(user ? user.id : null);
    }
  }, [page]);

  const handleSave = async (updatedMovement) => {
    try {
      const response = await api.patch(`/movements/${updatedMovement.id}/`, updatedMovement);
      console.log("Movement updated:", response.data);
      // Update movements state
      setMovements(movements.map((m) => (m.id === updatedMovement.id ? updatedMovement : m)));
    } catch (error) {
      console.error("Error updating movement:", error);
      // Handle error appropriately
    }
  };

  // Handle deleting movement
  const handleDelete = async (movementId) => {
    try {
      await api.delete(`/movements/${movementId}/delete`);
      console.log("Movement deleted:", movementId);
      // Update movements state
      setMovements(movements.filter((m) => m.id !== movementId));
    } catch (error) {
      console.error("Error deleting movement:", error);
      // Handle error appropriately
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div>
        {/* ... other components ... */}
        <MovementDeleteConfirmationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        <MovementSaveNotification
          open={isSnackbarOpen}
          message={snackbarMessage}
          onClose={() => setIsSnackbarOpen(false)}
        />
      </div>
      {movements.map((movement) => (
        <MovementCard
          key={movement.id}
          movement={movement}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};
