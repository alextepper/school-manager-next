import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import api from "src/utils/api";
import Head from "next/head";
import { Box, Container } from "@mui/system";

// ...

const Page = () => {
  const [carUses, setCarUses] = useState([]);

  useEffect(() => {
    const fetchCarUses = async () => {
      try {
        const response = await api.get("/car-use/list/");
        setCarUses(response.data.results);
      } catch (error) {
        console.error("Failed to fetch car uses", error);
      }
    };

    fetchCarUses();
  }, []);

  return (
    <>
      <Head>
        <title>רכב כפר</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl">
          {carUses.map((carUse) => (
            <Card key={carUse.id} sx={{ minWidth: 275, marginBottom: 1 }}>
              <CardContent sx={{ p: 1 }}>
                <Grid container spacing={0.1}>
                  <Grid item xs={3}>
                    <TextField
                      label="User"
                      value={`${carUse.user.first_name} ${carUse.user.last_name}`}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Purpose"
                      value={carUse.purpose}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Start Time"
                      value={carUse.start_time}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="End Time"
                      value={carUse.end_time}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Start Mileage"
                      value={carUse.start_mileage}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="End Mileage"
                      value={carUse.end_mileage}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Area"
                      value={carUse.area}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Destination"
                      value={carUse.destination}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
