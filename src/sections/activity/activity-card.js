import PropTypes from "prop-types";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

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

export const ActivityCard = (props) => {
  const { activity } = props;
  const router = useRouter();
  const getTheTeam = (teamId) => {
    router.push("/team/" + teamId);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        >
          <div onClick={() => getTheTeam(activity.id)}>
            <Avatar src={activity.avatar} alt={activity.name} sx={{ width: 80, height: 80 }}>
              {activity.name}
            </Avatar>
          </div>
        </Box>
        <Typography align="center" gutterBottom variant="h5">
          {activity.name}
        </Typography>
        <Typography align="center">({activity.students.length})</Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-evenly"
        spacing={2}
        sx={{ p: 2 }}
      >
        <AvatarGroup max={5} total={activity.students.length}>
          {activity.students.map((student) => {
            return (
              <Avatar
                key={activity.id}
                alt={student.first_name}
                src={student.avatar}
                sx={{ width: 40, height: 40 }}
              />
            );
          })}
        </AvatarGroup>
      </Stack>
    </Card>
  );
};
