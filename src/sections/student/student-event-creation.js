import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "src/utils/api";
import { useTranslation } from "react-i18next";

const initialEventData = {
  giver: "",
  receiver: "",
  description: "",
  score: "",
  area: "",
};

export const StudentEventCreation = ({ user, loggedUserProfile }) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eventData, setEventData] = useState({
    ...initialEventData,
    giver: loggedUserProfile.id,
    receiver: user.id,
  });

  const createEvent = async (eventData) => {
    if (
      eventData.description === initialEventData.description &&
      eventData.score === initialEventData.score &&
      eventData.area === initialEventData.area
    ) {
      alert("Please fill in the event details before submitting."); // or use a more sophisticated method to show the error
      return;
    }

    try {
      const response = await api.post("/create-event/", eventData, {
        headers: {
          "Content-Type": "application/json",
          // Include other headers as needed, such as Authorization
        },
      });

      console.log("Event created successfully:", response.data);
      setEventData(initialEventData);
      // Handle the response, e.g., updating state, redirecting, showing a message
    } catch (error) {
      console.error("Error creating event:", error.response ? error.response.data : error.message);
      // Handle errors, e.g., showing error messages
    }
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createEvent(eventData);
    setIsSubmitting(false);
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          sx={{ pt: 3, pb: 1 }}
          title="אירוע חדש" //{t("New Event")}
          action={
            <>
              <TextField
                select
                size="small"
                sx={{ m: 1, minWidth: 80 }}
                label="ניקוד" //{t("Score")}
                name="score"
                value={eventData.score}
                onChange={handleChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                {/* Add more scores as needed */}
              </TextField>
              <TextField
                select
                size="small"
                sx={{ m: 1, minWidth: 80 }}
                label="תחום" //{t("Area")}
                name="area"
                value={eventData.area}
                onChange={handleChange}
              >
                <MenuItem value="discipline">משמעת</MenuItem>
                <MenuItem value="social">חברתי</MenuItem>
                <MenuItem value="study">לימודים</MenuItem>
                {/* Add more areas as needed */}
              </TextField>
            </>
          }
        />
        <CardContent sx={{ pt: 0, pb: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3} sx={{ pt: 0, pb: 0 }}>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="הערות" //{t("Description")}
                  name="description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={eventData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={2} sx={{ pt: 1.5, pb: 0, alignContent: "bottom" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  שמור{/* {t("Save")} */}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
