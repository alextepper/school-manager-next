import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TeamProfile } from "src/sections/team/team-profile";
import { TeamProfileDetails } from "src/sections/team/team-profile-details";
import api from "src/utils/api";

const Page = () => {
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;
  const router = useRouter();
  const { buildingId } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (buildingId) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/building/${buildingId}`);
          setProfile(response.data);
        } catch (err) {
          console.error("Error fetching profile:", err);
          // Handle error appropriately
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [buildingId]);

  if (!profile && !loading) {
    return <div>No profile data found.</div>;
  }

  return (
    <>
      <Head>
        <title>{profile ? profile.teamName : ""} | Team</title>
      </Head>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
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
                  {profile && (
                    <>
                      {/* <Grid item xs={12} md={6} lg={4}>
                        <TeamProfile team={profile} loggedUserProfile={loggedUserProfile} />
                      </Grid>
                      <Grid item xs={12} md={6} lg={8}>
                        <TeamProfileDetails team={profile} />
                      </Grid> */}
                    </>
                  )}
                </Grid>
              </div>
            </Stack>
          </Container>
        </Box>
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
