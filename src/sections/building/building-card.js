import PropTypes from "prop-types";
import {
  // Avatar,
  Badge,
  Box,
  Card,
  // CardContent,
  CardHeader,
  CardMedia,
  // Divider,
  // Stack,
  Typography,
} from "@mui/material";
// import styled from "@emotion/styled";
import { useRouter } from "next/router";

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   "& .MuiBadge-badge": {
//     backgroundColor: "#44b700",
//     color: "#44b700",
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     "&::after": {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       borderRadius: "50%",
//       animation: "ripple 1.2s infinite ease-in-out",
//       border: "1px solid currentColor",
//       content: '""',
//     },
//   },
//   "@keyframes ripple": {
//     "0%": {
//       transform: "scale(.8)",
//       opacity: 1,
//     },
//     "100%": {
//       transform: "scale(2.4)",
//       opacity: 0,
//     },
//   },
// }));

export const BuildingCard = (props) => {
  const { building } = props;
  const router = useRouter();
  const getTheBuilding = (teamId) => {
    router.push("/building/" + teamId);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div onClick={() => getTheBuilding(building.id)}>
        <CardMedia sx={{ height: 150 }} image={building.avatar} />
      </div>
      <CardHeader
        sx={{ cursor: "pointer", p: 1 }}
        title={<Typography variant="h3">{building.buildingName}</Typography>}
        subheader={
          building.teams ? (
            <Typography variant="h6">{building.teams.map((team) => team).join(", ")}</Typography>
          ) : (
            ""
          )
        }
      />

      <Box sx={{ flexGrow: 1 }} />
      {/* <Divider /> */}
      {/* <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-evenly"
        spacing={2}
        sx={{ p: 2 }}
      >
        {team.staff.map((staff) => {
          return (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              invisible={!staff.is_on_shift}
              key={staff.id}
            >
              <Avatar alt={staff.first_name} src={staff.avatar} sx={{ width: 40, height: 40 }} />
            </StyledBadge>
          );
        })}
      </Stack> */}
    </Card>
  );
};

BuildingCard.propTypes = {
  buliding: PropTypes.object.isRequired,
};
