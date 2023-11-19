import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Divider,
  CardActions,
  Button,
  Badge,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { getInitials } from "src/utils/get-initials";
import { useRouter } from "next/router";
import axios from "axios";
import { Stack } from "@mui/system";

export const AccountProfile = ({ user }) => {
  const [profile, setProfile] = useState(user);
  const router = useRouter();
  const getTheTeam = (teamId) => {
    router.push("/team/" + teamId);
  };

  const switchAttendance = async (currentProfile) => {
    try {
      const updatedProfile = {
        ...currentProfile,
        is_in_school: !currentProfile.is_in_school,
      };

      await axios.put(
        `http://localhost:8000/student-profile/${currentProfile.id}/`,
        updatedProfile
      );
      setProfile({ ...currentProfile, is_in_school: !currentProfile.is_in_school });
      // Handle successful update (e.g., update state or show a message)
    } catch (error) {
      console.error("Error updating student profile:", error);
      // Handle error appropriately
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Badge color="success" badgeContent={profile.overall_score} max={999}>
            <Avatar
              src={user.avatar} // Assuming 'avatar' is part of the user profile data
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
              alt={getInitials(`${profile.first_name} ${profile.last_name}`)}
            >
              {getInitials(`${profile.first_name} ${profile.last_name}`)}
            </Avatar>
          </Badge>
          <Stack sx={{ alignItems: "center", mb: 2 }}>
            <Typography gutterBottom variant="h5">
              {profile.first_name} {profile.last_name}
            </Typography>
            <Button variant="contained" onClick={() => getTheTeam(profile.team.id)} size="small">
              {profile.team?.name}
            </Button>
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={profile.is_in_school}
                onChange={() => {
                  switchAttendance(profile);
                }}
                name="jason"
              />
            }
            label={profile.is_in_school ? "Is in School" : "Isn't in School"}
            labelPlacement="top"
          />
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Call
        </Button>
      </CardActions>
    </Card>
  );
};
