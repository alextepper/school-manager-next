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
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "src/utils/api";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Label } from "@mui/icons-material";

export const StudentProfileDetails = ({ user, loggedUserProfile }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(user);
  const [profileUpdate, setProfileUpdate] = useState({ gender: profile.gender });
  const [isEditMode, setIsEditMode] = useState(false);
  const [buildingList, setBuildingList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [building, setBuilding] = useState(profile.room ? profile.room.building : {});
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    if (buildingList.length == 0) {
      try {
        const buildings = await api.get("/buildings-simple/");
        const teams = await api.get("/teams-simple/");
        setBuildingList(buildings.data.results);
        setTeams(teams.data.results);
      } catch (err) {
        console.log(err);
      }
    }
    setIsLoading(false);
    setIsEditMode(!isEditMode);
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // Update with your API endpoint and adjust accordingly
      const response = await api.patch(`/student-profile/${profile.id}/`, profileUpdate);
      console.log("Profile updated:", response.data);
      setIsEditMode(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error appropriately
    }
    setIsLoading(false);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {isEditMode ? (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם פרטי" //{t("First Name")}
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
                label="שם משפחה" //{t("Last Name")}
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
                label="מספר טלפון" //{t("Phone Number")}
                name="phone_number"
                value={profile.phone_number || ""}
                onChange={handleProfileChange}
                inputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="קבוצה"
                id="team"
                value={profile.team || ""}
                name="team"
                onChange={handleProfileChange}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              >
                {teams.map((team) => (
                  <MenuItem value={team.id} key={team.id}>
                    {team.teamName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="מין" //{t("Gender")}
                id="gender"
                value={profile.gender || ""}
                name="gender"
                onChange={handleProfileChange}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              >
                <MenuItem value={"male"}>בן</MenuItem>
                <MenuItem value={"female"}>בת</MenuItem>
                {/* <MenuItem value={"other"}>אחר</MenuItem> */}
              </TextField>
            </Grid>
          </>
        ) : (
          ""
        )}

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="שכבה" //{t("Grade")}
            name="grade"
            value={profile.grade || ""}
            inputProps={{
              readOnly: !isEditMode,
            }}
            onChange={handleProfileChange}
          >
            <MenuItem value="ז">ז</MenuItem>
            <MenuItem value="ח">ח</MenuItem>
            <MenuItem value="ט">ט</MenuItem>
            <MenuItem value="י">י</MenuItem>
            <MenuItem value="יא">יא</MenuItem>
            <MenuItem value="יב">יב</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePicker
            fullWidth
            label="תאריך לידה" // {t("Birth Date")} // Adjust format as needed
            name="birthday"
            value={validBirthday}
            onChange={handleDateChange}
            readOnly={!isEditMode}
            sx={{ direction: "ltr", width: "100%" }}
            slotProps={{ popper: { sx: { direction: "ltr" } } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="מבנה" //{t("Building")}
            id="building"
            value={building ? building : ""}
            name="building"
            onChange={handleBuildingChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          >
            <MenuItem value={building}>{building.buildingName}</MenuItem>
            {buildingList.map((building) => (
              <MenuItem value={building} key={building.id}>
                {building.buildingName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            labelId="חדר" //{t("Room")}
            id="room"
            value={profile.room || ""}
            name="room"
            label="חדר"
            onChange={handleProfileChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          >
            {profile.room ? (
              <MenuItem value={profile.room} key={profile.room.id}>
                {profile.room.number}
              </MenuItem>
            ) : null}

            {roomList.map((room) => (
              <MenuItem value={room.id} key={room.id}>
                {room.number}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={toggleEditMode}>
          {isLoading ? <CircularProgress color="info" size={"1.5rem"} /> : <EditIcon />}
        </Button>
        {isEditMode && !isLoading ? (
          <Button variant="contained" onClick={saveProfile}>
            {isLoading ? <CircularProgress color="info" size={"1.5rem"} /> : "שמור"}
          </Button>
        ) : (
          ""
        )}
      </CardActions>
    </Box>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
