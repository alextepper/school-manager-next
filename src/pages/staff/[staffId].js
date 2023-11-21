import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { StaffProfile } from "src/sections/staff/staff-profile";
import { StaffProfileDetails } from "src/sections/staff/staff-profile-details";
import api from "src/utils/api";

const Page = () => {
  const router = useRouter();
  const { staffId } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staffId) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await api.get(`staff-profile/${staffId}`);
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
  }, [staffId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }
  return (
    <>
      <Head>
        <title>
          Student | {profile.first_name} {profile.last_name}
        </title>
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
                      <StaffProfile user={profile} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                      <StaffProfileDetails user={profile} />
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
