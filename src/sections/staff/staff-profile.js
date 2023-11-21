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
  FormControlLabel,
  Switch,
  CardHeader,
} from "@mui/material";
import { getInitials } from "src/utils/get-initials";
import { useRouter } from "next/router";
import axios from "axios";
import { Stack } from "@mui/system";
import { StyledBadge } from "src/utils/styledBadge";

export const StaffProfile = ({ user }) => {
  const [profile, setProfile] = useState(user);
  const router = useRouter();
  const getThePage = (url) => {
    router.push(url);
  };

  const switchAttendance = async (currentProfile) => {
    try {
      const updatedProfile = {
        ...currentProfile,
        is_on_shift: !currentProfile.is_on_shift,
      };

      await axios.put(`http://localhost:8000/staff-profile/${currentProfile.id}/`, updatedProfile);
      setProfile({ ...currentProfile, is_on_shift: !currentProfile.is_on_shift });
    } catch (error) {
      console.error("Error updating student profile:", error);
      // Handle error appropriately
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            invisible={!profile.is_on_shift}
            key={user.id}
          >
            <Avatar
              src={user.avatar} // Assuming 'avatar' is part of the user profile data
              sx={{
                height: 80,
                width: 80,
              }}
              alt={getInitials(`${profile.first_name} ${profile.last_name}`)}
            >
              {getInitials(`${profile.first_name} ${profile.last_name}`)}
            </Avatar>
          </StyledBadge>
        }
        title={
          <Typography gutterBottom variant="h6">
            {profile.first_name} {profile.last_name}
          </Typography>
        }
        subheader={
          <Stack sx={{ alignItems: "center", mb: 2 }}>
            {profile.team.map((team) => {
              return (
                <Button onClick={() => getThePage("/team/" + team.id)} key={team.id} size="small">
                  {team.name}
                </Button>
              );
            })}
          </Stack>
        }
        action={
          <FormControlLabel
            control={
              <Switch
                color="success"
                checked={profile.is_on_shift}
                onChange={() => {
                  switchAttendance(profile);
                }}
              />
            }
          />
        }
      />
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        ></Box>
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
