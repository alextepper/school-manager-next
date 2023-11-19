import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TeamProfile } from "src/sections/team/team-profile";
import { TeamProfileDetails } from "src/sections/team/team-profile-details";

const Page = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamId) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/team/${teamId}`);
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
  }, [teamId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }

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
                {profile && (
                  <>
                    <Grid item xs={12} md={6} lg={4}>
                      <TeamProfile team={profile} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                      <TeamProfileDetails team={profile} />
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
