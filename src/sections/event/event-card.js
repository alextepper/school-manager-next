import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { deepOrange, deepPurple, red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Badge } from "@mui/material";
import { SmallAvatar } from "src/utils/small-avatar";
import { formatDistanceToNow, format, parseISO, differenceInDays } from "date-fns";
import { useRouter } from "next/router";

export default function EventCard({ event }) {
  const router = useRouter();
  const getThePage = (url) => {
    router.push(url);
  };
  const dateFormatter = (dateString) => {
    const now = new Date();
    const date = parseISO(dateString);

    let displayDate;
    if (differenceInDays(now, date) > 7) {
      // More than 7 days ago, use absolute time
      displayDate = format(date, "yyyy-MM-dd HH:mm:ss");
    } else {
      // Within 7 days, use relative time
      displayDate = formatDistanceToNow(date, { addSuffix: true });
    }

    return displayDate;
  };

  return (
    <Card sx={{ mb: 1 }}>
      <CardHeader
        avatar={
          <div
            onClick={() => getThePage("/profile/" + event.receiver.id)}
            sx={{ cursor: "pointer" }}
            key={event.id}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <SmallAvatar alt={event.giver.first_name} src={event.giver.avatar}>
                  {event.giver.first_name}
                </SmallAvatar>
              }
            >
              <Avatar alt={event.receiver.first_name} src={event.receiver.avatar}>
                {event.receiver.first_name}
              </Avatar>
            </Badge>
          </div>
        }
        title={`To ${event.receiver.first_name} from ${event.giver.first_name}`}
        subheader={dateFormatter(event.timestamp)}
        action={<Avatar sx={{ bgcolor: deepPurple[500] }}>{event.score}</Avatar>}
      />
      <CardContent sx={{ pt: 1, pb: 0 }}>
        <Typography variant="body2">{event.description}</Typography>
      </CardContent>
    </Card>
  );
}
