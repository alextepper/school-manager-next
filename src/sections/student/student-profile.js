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
  Collapse,
  IconButton,
} from "@mui/material";

import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getInitials } from "src/utils/get-initials";
import { Stack } from "@mui/system";
import { StyledBadge } from "src/utils/styledBadge";
import api from "src/utils/api";
import { useRouter } from "next/router";
import { cloudinaryUpload } from "src/utils/cloudinary-upload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@emotion/styled";
import { StudentProfileDetails } from "./student-profile-details";
import { MovementList } from "../movement/movement-list";
import { useTranslation } from "react-i18next";
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

export const StudentProfile = ({ user, loggedUserProfile }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(user);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [likes, setLikes] = useState(profile.likes.length);
  const [liked, setLiked] = useState(profile.likes.includes(loggedUserProfile.id));
  const [expanded, setExpanded] = useState(false);
  const [expandedMovements, setExpandedMovements] = useState(false);
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
            <Badge color="success" badgeContent={profile.events} max={999}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  src={avatar} // Assuming 'avatar' is part of the user profile data
                  sx={{
                    height: 80,
                    width: 80,
                  }}
                  onClick={
                    loggedUserProfile.role == "staff"
                      ? handleAvatarClick
                      : () => console.log("You have no permission")
                  }
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
          <>
            <Typography gutterBottom variant="h6" sx={{ mr: 2 }}>
              {profile.first_name} {profile.last_name}
              <IconButton
                disabled={!(loggedUserProfile.role === "staff" && profile.phone_number !== "")}
                href={`tel: ${profile ? profile.phone_number : ""}`}
              >
                {profile.phone_number !== "" ? (
                  <PhoneEnabled color="success" />
                ) : (
                  <PhoneDisabledIcon color="disabled" />
                )}
              </IconButton>
            </Typography>
          </>
        }
        subheader={
          <Box display="block">
            <Button onClick={() => getThePage("/team/" + profile.team.id)} size="small">
              {profile.team?.teamName}
            </Button>
            {loggedUserProfile.role == "staff" && profile.room
              ? `${profile.room.building.buildingName}(${profile.room.number})`
              : ""}
          </Box>
        }
        action={
          loggedUserProfile.role == "staff" ? (
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
          ) : (
            ""
          )
        }
      />
      <CardContent sx={{ p: 1 }}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={2}>
            {profile.team
              ? profile.team.staff.map((staff) => {
                  return (
                    <div
                      onClick={() => getThePage("/staff/" + staff.id)}
                      sx={{ cursor: "pointer" }}
                      key={staff.id}
                    >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                        invisible={!staff.is_on_shift}
                      >
                        <Avatar
                          alt={staff.first_name}
                          src={staff.avatar}
                          sx={{ width: 35, height: 35 }}
                        />
                      </StyledBadge>
                    </div>
                  );
                })
              : ""}
          </Stack>
        </Box>
      </CardContent>
      {loggedUserProfile.role == "staff" ? (
        <>
          <Divider />
          <CardActions onClick={() => setExpanded(!expanded)} sx={{ px: 3 }}>
            <Typography variant="h6">
              {/* {t("Info")} */}
              מידע
            </Typography>
            <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <StudentProfileDetails user={profile} loggedUserProfile={loggedUserProfile} />
            </CardContent>
          </Collapse>
          <Divider />
          {/* <CardActions onClick={() => setExpandedMovements(!expandedMovements)} sx={{ px: 3 }}>
            <Typography variant="h6">Movements</Typography>
            <ExpandMore expand={expandedMovements} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expandedMovements} timeout="auto" unmountOnExit>
            <CardContent>
              <MovementList user={profile} />
            </CardContent>
          </Collapse> */}
        </>
      ) : (
        ""
      )}
    </Card>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
