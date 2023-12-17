import { useState } from "react";
import { TextField, Button, Box, Typography, Select, MenuItem } from "@mui/material";
import api from "src/utils/api";

const BuildingCreationForm = ({ setOpenDialog }) => {
  const [teamName, setTeamName] = useState("");
  const [teamGrade, setTeamGrade] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/teams/create/", {
        teamName: teamName,
        grade: teamGrade,
      });

      console.log("Team created:", response.data);
      // Reset form or display success message
      setTeamName("");
      setTeamGrade("");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error creating team:", error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6">Create New Team</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="teamName"
        label="Team Name"
        name="teamName"
        autoFocus
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        select
        id="teamGrade"
        label="Team Grade"
        name="teamGrade"
        value={teamGrade}
        onChange={(e) => setTeamGrade(e.target.value)}
      >
        <MenuItem value={"7"}>zain</MenuItem>
        <MenuItem value={"8"}>het</MenuItem>
        <MenuItem value={"9"}>tet</MenuItem>
        <MenuItem value={"10"}>yud</MenuItem>
        <MenuItem value={"11"}>yud-alef</MenuItem>
        <MenuItem value={"12"}>yud-bet</MenuItem>
      </TextField>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Create Team
      </Button>
    </Box>
  );
};

export default BuildingCreationForm;
