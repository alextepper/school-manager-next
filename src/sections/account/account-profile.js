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
} from "@mui/material";
import { getInitials } from "src/utils/get-initials";

export const AccountProfile = ({ user }) => {
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
          <Badge color="success" badgeContent={user.overall_score} max={999}>
            <Avatar
              src={user.avatar} // Assuming 'avatar' is part of the user profile data
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
              alt={getInitials(`${user.first_name} ${user.last_name}`)}
            >
              {getInitials(`${user.first_name} ${user.last_name}`)}
            </Avatar>
          </Badge>

          <Typography gutterBottom variant="h5">
            {user.first_name} {user.last_name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.phone_number || "phone"}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.team?.name}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};
