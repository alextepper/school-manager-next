import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  FormControlLabel,
  Switch,
  CardHeader,
} from "@mui/material";
import { getInitials } from "src/utils/get-initials";
import { useRouter } from "next/router";
import { Stack } from "@mui/system";
import { StyledBadge } from "src/utils/styledBadge";
import api from "src/utils/api";
import { cloudinaryUploadStaff } from "src/utils/cloudinary-upload";

export const StaffProfile = ({ user, loggedUserProfile }) => {
  const [profile, setProfile] = useState(user);
  const [avatar, setAvatar] = useState(profile.avatar);
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

      await api.put(`/staff-profile/${currentProfile.id}/`, updatedProfile);
      setProfile({ ...currentProfile, is_on_shift: !currentProfile.is_on_shift });
    } catch (error) {
      console.error("Error updating student profile:", error);
      // Handle error appropriately
    }
  };

  const handleAvatarClick = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const uploadedUrl = await cloudinaryUploadStaff(file, profile);
      setAvatar(uploadedUrl); // Update avatar URL
    };
    fileInput.click();
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
              onClick={
                loggedUserProfile.id == profile.id
                  ? handleAvatarClick
                  : () => console.log("You have no permission")
              }
              src={avatar} // Assuming 'avatar' is part of the user profile data
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
        action={
          loggedUserProfile.id == profile.id ? (
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
          ) : (
            ""
          )
        }
      />
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={2}>
            {profile.team.map((team) => {
              return (
                <Stack
                  key={team.id}
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    onClick={() => getThePage("/team/" + team.id)}
                    alt={team.name}
                    src={team.avatar}
                    sx={{ width: 45, height: 45, cursor: "pointer" }}
                  />
                  <p>{team.name}</p>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
