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
  Divider,
  CardActions,
  Button,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getInitials } from "src/utils/get-initials";
import { useRouter } from "next/router";
import { Stack } from "@mui/system";
import { StyledBadge } from "src/utils/styledBadge";
import api from "src/utils/api";
import { cloudinaryUpload } from "src/utils/cloudinary-upload";
import styled from "@emotion/styled";
import { StaffProfileDetails } from "./staff-profile-details";
import { PhoneEnabled } from "@mui/icons-material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const StaffProfile = ({ user, loggedUserProfile }) => {
  const [profile, setProfile] = useState(user);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [expanded, setExpanded] = useState(false);
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
      const uploadedUrl = await cloudinaryUpload(file, profile);
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
          <>
            <Typography gutterBottom variant="h6" sx={{ mr: 2 }}>
              {profile.first_name} {profile.last_name}
              <IconButton
                disabled={!(loggedUserProfile.role == "staff" || profile.phone_number == "")}
                href={`tel: ${profile ? profile.phone_number : ""}`}
              >
                <PhoneEnabled color="success" />
              </IconButton>
            </Typography>
          </>
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
                    alt={team.teamName}
                    src={team.avatar}
                    sx={{ width: 45, height: 45, cursor: "pointer" }}
                  />
                  <p>{team.teamName}</p>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        {loggedUserProfile.role == "staff" ? (
          <>
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </>
        ) : (
          ""
        )}
      </CardActions>
      {loggedUserProfile.role == "staff" ? (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <StaffProfileDetails user={profile} loggedUserProfile={loggedUserProfile} />
          </CardContent>
        </Collapse>
      ) : (
        ""
      )}
    </Card>
  );
};
