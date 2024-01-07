import PropTypes from "prop-types";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Divider,
  Link,
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

export const TeamCard = (props) => {
  const { team } = props;
  const router = useRouter();
  const getThePage = (url) => {
    router.push(url);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 1,
          }}
        >
          <div onClick={() => getThePage("/team/" + team.id)}>
            <Avatar src={team.avatar} alt={team.teamName} sx={{ width: 80, height: 80 }}>
              {team.teamName}
            </Avatar>
          </div>
        </Box>
        <Typography align="center" gutterBottom variant="h5">
          {team.teamName}
        </Typography>
        <Typography align="center">({team.attendance_counter})</Typography>
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
        {team.staff.map((staff) => {
          return (
            <Link
              key={staff.id}
              href={`/staff/${staff.id}`}
              sx={{
                textDecoration: "none",
                color: "#333",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", // Add this line
                m: "0 !important",
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                invisible={!staff.is_on_shift}
              >
                <Avatar alt={staff.first_name} src={staff.avatar} sx={{ width: 40, height: 40 }} />
              </StyledBadge>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                {staff.first_name}
              </Typography>
            </Link>
          );
        })}
      </Stack>
    </Card>
  );
};

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
};
