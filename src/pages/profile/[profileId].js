import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Container, Stack, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import api from "src/utils/api";
import { StudentProfile } from "src/sections/student/student-profile";
import { StudentEventCreation } from "src/sections/student/student-event-creation";
import { EventList } from "src/sections/event/event-list";
import { StudentProfileDetails } from "src/sections/student/student-profile-details";

const Page = () => {
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;
  const router = useRouter();
  const { profileId } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileId) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await api.get(`student-profile/${profileId}`);
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
                    <Grid item xs={12}>
                      <StudentProfile user={profile} loggedUserProfile={loggedUserProfile} />
                    </Grid>

                    {loggedUserProfile.role == "staff" ? (
                      <Grid item xs={12}>
                        <StudentEventCreation
                          user={profile}
                          loggedUserProfile={loggedUserProfile}
                        />
                      </Grid>
                    ) : (
                      ""
                    )}
                    <Grid item xs={12}>
                      <EventList user={profile} />
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
