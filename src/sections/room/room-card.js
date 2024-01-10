import PropTypes from "prop-types";
import { Button, Card, CardContent, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";

export const RoomCard = (props) => {
  const { room } = props;
  const router = useRouter();
  const getThePage = (url) => {
    router.push(url);
  };
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
          {room.students.length}/{room.bed_count}
        </Typography>
        {room.students.map((student) => (
          <Button
            color={student.is_in_school ? "success" : "error"}
            variant="contained"
            size="small"
            onClick={() => getThePage("/profile/" + student.id)}
            to={`/profile/${student.id}`}
            key={student.id}
            sx={{ m: 1 }}
          >
            {student.first_name}
          </Button>
        ))}

        {/* <Typography variant="body1">Students Count: {room.students_count}</Typography> */}
      </CardContent>
    </Card>
  );
};

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
};
