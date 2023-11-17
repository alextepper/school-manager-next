import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";

const Page = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileId) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/student-profile/${profileId}`);
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
  }, [profileId]);

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
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Account</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                {profile && (
                  <>
                    <Grid item xs={12} md={6} lg={4}>
                      <AccountProfile user={profile} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                      <AccountProfileDetails user={profile} />
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
