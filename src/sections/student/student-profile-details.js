import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  CardActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "src/utils/api";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export const StudentProfileDetails = ({ user, loggedUserProfile }) => {
  const [profile, setProfile] = useState(user);
  const [profileUpdate, setProfileUpdate] = useState({ gender: profile.gender });
  const [isEditMode, setIsEditMode] = useState(false);
  const [buildingList, setBuildingList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [building, setBuilding] = useState(profile.room ? profile.room.building : {});
  const [teams, setTeams] = useState([]);
  const validBirthday = profile.birthday ? dayjs(profile.birthday).toDate() : null;

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
    setProfileUpdate({ ...profileUpdate, birthday: formattedDate });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile({ ...profile, [name]: value });
    setProfileUpdate({ ...profileUpdate, [name]: value });
  };

  const handleBuildingChange = async (event) => {
    const selectedBuilding = event.target.value;
    setBuilding(selectedBuilding);
    setRoomList(selectedBuilding.rooms);
  };

  const toggleEditMode = async () => {
    if (buildingList.length == 0) {
      try {
        const buildings = await api.get("/buildings/");
        const teams = await api.get("/teams/");
        setBuildingList(buildings.data.results);
        setTeams(teams.data.results);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(buildingList);
    setIsEditMode(!isEditMode);
  };

  const saveProfile = async () => {
    try {
      // Update with your API endpoint and adjust accordingly
      const response = await api.patch(`/student-profile/${profile.id}/`, profileUpdate);
      console.log("Profile updated:", response.data);
      setIsEditMode(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error appropriately
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {isEditMode ? (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={profile.first_name || ""}
                onChange={handleProfileChange}
                inputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={profile.last_name || ""}
                onChange={handleProfileChange}
                inputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={profile.phone_number || ""}
                onChange={handleProfileChange}
                inputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                fullWidth
                labelId="Team"
                id="team"
                value={profile.team || ""}
                label="Team"
                name="team"
                onChange={handleProfileChange}
                inputProps={{
                  readOnly: !isEditMode,
                }}
              >
                {teams.map((team) => {
                  return (
                    <MenuItem value={team.id} key={team.id}>
                      {team.teamName}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                fullWidth
                labelId="Gender"
                id="gender"
                value={profile.gender || ""}
                label="Gender"
                name="gender"
                onChange={handleProfileChange}
                inputProps={{
                  readOnly: !isEditMode,
                }}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
                <MenuItem value={"other"}>Other</MenuItem>
              </Select>
            </Grid>
          </>
        ) : (
          ""
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Grade"
            name="grade"
            value={profile.grade || ""}
            inputProps={{
              readOnly: !isEditMode,
            }}
            onChange={handleProfileChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePicker
            fullWidth
            label="Birth Date" // Adjust format as needed
            name="birthday"
            value={validBirthday}
            onChange={handleDateChange}
            readOnly={!isEditMode}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Select
            fullWidth
            labelId="Building"
            id="building"
            value={building ? building : ""}
            label="Building"
            name="building"
            onChange={handleBuildingChange}
            inputProps={{
              readOnly: !isEditMode,
            }}
          >
            <MenuItem value={building}>{building.buildingName}</MenuItem>
            {buildingList.map((building) => {
              return (
                <MenuItem value={building} key={building.id}>
                  {building.buildingName}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            fullWidth
            labelId="Room"
            id="room"
            value={profile.room || ""}
            name="room"
            label="Room"
            onChange={handleProfileChange}
            inputProps={{
              readOnly: !isEditMode,
            }}
          >
            {profile.room ? (
              <MenuItem value={profile.room} key={profile.room.id}>
                {profile.room.number}
              </MenuItem>
            ) : (
              ""
            )}

            {roomList.map((room) => {
              return (
                <MenuItem value={room.id} key={room.id}>
                  {room.number}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={toggleEditMode}>
          <EditIcon />
        </Button>
        {isEditMode ? (
          <Button variant="contained" onClick={saveProfile}>
            Save details
          </Button>
        ) : (
          ""
        )}
      </CardActions>
    </Box>
  );
};
