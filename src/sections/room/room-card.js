import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/router";

export const RoomCard = (props) => {
  const { room } = props;
  const router = useRouter();
  const getTheRoom = (roomId) => {
    router.push("/room/" + roomId);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      // onClick={() => getTheRoom(room.id)}
    >
      <CardContent>
        <Typography variant="h5">חדר: {room.number}</Typography>
        <Typography variant="h6">{room.gender === "male" ? "בנים" : "בנות"}</Typography>
        <Typography variant="body1">
          {room.students_count}/{room.bed_count}
        </Typography>

        {/* <Typography variant="body1">Students Count: {room.students_count}</Typography> */}
      </CardContent>
    </Card>
  );
};

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
};
