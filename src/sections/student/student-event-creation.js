import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "src/utils/api";

export const StudentEventCreation = ({ user }) => {
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;
  const [eventData, setEventData] = useState({
    giver: loggedUserProfile.id,
    receiver: user.id,
    description: "",
    score: "",
    area: "",
  });

  const createEvent = async (eventData) => {
    try {
      const response = await api.post("/create-event/", eventData, {
        headers: {
          "Content-Type": "application/json",
          // Include other headers as needed, such as Authorization
        },
      });

      console.log("Event created successfully:", response.data);
      // Handle the response, e.g., updating state, redirecting, showing a message
    } catch (error) {
      console.error("Error creating event:", error.response ? error.response.data : error.message);
      // Handle errors, e.g., showing error messages
    }
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEvent(eventData);
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          sx={{ pt: 3, pb: 1 }}
          title="New Event"
          action={
            <>
              <FormControl size="small" sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="score-label">Score</InputLabel>
                <Select
                  labelId="score-label"
                  label="Score"
                  name="score"
                  value={eventData.score}
                  onChange={handleChange}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  {/* Add more areas as needed */}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="area-label">Area</InputLabel>
                <Select
                  labelId="area-label"
                  label="Area"
                  name="area"
                  value={eventData.area}
                  onChange={handleChange}
                >
                  <MenuItem value="Area 1">Area 1</MenuItem>
                  <MenuItem value="Area 2">Area 2</MenuItem>
                  {/* Add more areas as needed */}
                </Select>
              </FormControl>
            </>
          }
        />
        <CardContent sx={{ pt: 0, pb: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3} sx={{ pt: 0, pb: 0 }}>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={eventData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={2} sx={{ pt: 1.5, pb: 0, alignContent: "bottom" }}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};