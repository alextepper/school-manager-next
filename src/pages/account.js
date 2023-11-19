import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { useEffect, useState } from "react";
import axios from "axios";

const fetchStudentProfile = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8000/student-profile/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    // Handle error appropriately
  }
};

const Page = () => {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchStudentProfile(loggedUser.id).then((user) => {
      setUser(user);
      console.log(user);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Account | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Grid container spacing={3}>
                {user && (
                  <>
                    <Grid item xs={12} md={6} lg={4}>
                      <AccountProfile user={user} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                      <AccountProfileDetails user={user} />
                    </Grid>
                  </>
                )}
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
