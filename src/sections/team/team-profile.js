import React from "react";
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
} from "@mui/material";
import { getInitials } from "src/utils/get-initials";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";

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

export const TeamProfile = ({ team }) => {
  return (
    <Card>
      <CardHeader title={team.name} />
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Badge color="success" badgeContent={team.overall_score || 0} max={999}>
            <Avatar
              src={team.avatar} // Assuming 'avatar' is part of the user profile data
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
              alt={getInitials(team.name)}
            >
              {getInitials(team.name)}
            </Avatar>
          </Badge>
          <Stack direction="row" spacing={2}>
            {team.staff.map((staff) => {
              return (
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
