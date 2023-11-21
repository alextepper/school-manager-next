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
  CardHeader,
  Fab,
} from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getInitials } from "src/utils/get-initials";
import { Stack } from "@mui/system";
import { StyledBadge } from "src/utils/styledBadge";
import api from "src/utils/api";
import { useRouter } from "next/router";

export const AccountProfile = ({ user }) => {
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;
  const [profile, setProfile] = useState(user);
  const [likes, setLikes] = useState(profile.likes.length);
  const [liked, setLiked] = useState(profile.likes.includes(loggedUserProfile.id));
  const router = useRouter();
  const getThePage = (url) => {
    router.push(url);
  };

  const switchAttendance = async (currentProfile) => {
    try {
      const updatedData = {
        is_in_school: !currentProfile.is_in_school,
      };

      await api.put(`/student-profile/${currentProfile.id}/`, updatedData);
      setProfile({ ...currentProfile, is_in_school: !currentProfile.is_in_school });
      // Handle successful update (e.g., update state or show a message)
    } catch (error) {
      console.error("Error updating student profile:", error);
      // Handle error appropriately
    }
  };

  const like = async (receiver) => {
    const newData = { receiver: receiver, giver: loggedUserProfile.id };
    try {
      if (!liked) {
        await api.post("/like/", newData);
        setLikes(likes + 1);
      } else {
        await api.delete("/unlike/", { data: newData }); // Correct way to send data in DELETE request
        setLikes(likes - 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <>
            <Badge color="success" badgeContent={profile.overall_score} max={999}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
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
                <Fab
                  onClick={() => like(profile.id)}
                  size="small"
                  sx={{
                    zIndex: 100,
                    mt: "-16px",
                    color: red[500],
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "10px",
                  }}
                >
                  {liked ? (
                    <FavoriteIcon sx={{ fontSize: "20px" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: "20px" }} />
                  )}
                  {likes}
                </Fab>
              </Box>
            </Badge>
          </>
        }
        title={
          <Typography gutterBottom variant="h6">
            {profile.first_name} {profile.last_name}
          </Typography>
        }
        subheader={
          <Button onClick={() => getThePage("/team/" + profile.team.id)} size="small">
            {profile.team?.name}
          </Button>
        }
        action={
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
        >
          <Stack direction="row" spacing={2}>
            {profile.team.staff.map((staff) => {
              return (
                <div onClick={() => getThePage("/staff/" + staff.id)} sx={{ cursor: "pointer" }}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    invisible={!staff.is_on_shift}
                    key={staff.id}
                  >
                    <Avatar
                      alt={staff.first_name}
                      src={staff.avatar}
                      sx={{ width: 56, height: 56 }}
                    />
                  </StyledBadge>
                </div>
              );
            })}
          </Stack>
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
