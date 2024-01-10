import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Card, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventList } from "src/sections/event/event-list";

const Page = () => {
  // const [data, setData] = useState([]); // State for storing fetched data

  // useEffect(() => {
  //   const fetchStudentList = async () => {
  //     try {
  //       const response = await api.get(`/student-profiles`);
  //       setData(response.data.results); // Set fetched data to state
  //     } catch (err) {
  //       console.error("Error fetching student profiles:", err);
  //       // Handle error appropriately
  //     }
  //   };

  //   fetchStudentList();
  // }, []);

  return (
    <>
      <Head>
        <title>חדשות | RKZ Solutions</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">חדשות</Typography>
              </Stack>
            </Stack>
            <Card>
              <EventList />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
