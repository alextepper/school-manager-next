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
  CardHeader,
  AvatarGroup,
  CardMedia,
} from "@mui/material";
import { getInitials } from "src/utils/get-initials";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import { cloudinaryUpload } from "src/utils/cloudinary-upload";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const BuildingProfile = ({ building, loggedUserProfile }) => {
  const [profile, setProfile] = useState(building);
  const [avatar, setAvatar] = useState(profile.avatar);
  const router = useRouter();
  const getThePage = (url) => {
    router.push(url);
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
      <div>
        <CardMedia sx={{ height: 240 }} image={profile.avatar} />
      </div>

      <CardHeader
        sx={{ pt: 1 }}
        title={
          <>
            <Typography gutterBottom variant="h4">
              {profile.buildingName}
            </Typography>
          </>
        }
        subheader={
          building.teams ? (
            <Typography variant="h6">{building.teams.map((team) => team).join(", ")}</Typography>
          ) : (
            ""
          )
        }
      />
      {/* <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={2}>
            {team.staff.map((staff) => {
              return (
                <Stack
                  key={staff.id}
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    invisible={!staff.is_on_shift}
                    key={staff.id}
                  >
                    <Avatar
                      onClick={() => getThePage("/staff/" + staff.id)}
                      alt={staff.first_name}
                      src={staff.avatar}
                      sx={{ width: 45, height: 45, cursor: "pointer" }}
                    />
                  </StyledBadge>
                  <p>{staff.first_name}</p>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </CardContent> */}
      {/* <CardActions>
        <Button fullWidth variant="text">
          Call
        </Button>
      </CardActions> */}
    </Card>
  );
};
